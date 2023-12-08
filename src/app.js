import express from 'express'
import config from './config/config.js'
import usersRouter from './routes/users.router.js'
import ordersRouter from './routes/orders.router.js'
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
//import chatRouter from './routes/chat.router.js'
//import viewsRoutes from "./routes/view.routes.js";
import nodemailer from 'nodemailer'
import twilio from 'twilio'
import cors from 'cors'
import handlebars from 'express-handlebars'
import path from 'path'
import exphbs from 'express-handlebars';
import {fileURLToPath} from 'url'
import { dirname } from 'path'
//import __dirname from './utils/utils.js'
import session from 'express-session'
//import sessionRouter from './routes/session.router.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { addLogger } from './utils/logger.js'
import cookieParser from 'cookie-parser'
import paymentsRouter from './routes/payment.router.js'

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import { Server } from "socket.io";

import { specs } from "./swagger/swagger.js";


const app = express()

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'gamcordoba@gmail.com',
        pass: 'dzoepvskzrwqgmuq'
    }
})

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTHO_TOKEN)

//app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(addLogger)
app.use(paymentsRouter)

// Static files
app.use(express.static(path.resolve("src/public")));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar los motores de plantilla
const handlebarss = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    layoutsDir: path.join(__dirname, 'views/layouts/'), // Directorio de los layouts
    partialsDir: path.join(__dirname, 'views/') // Directorio de los partials
});

app.engine('handlebars', handlebarss.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/cart', (req, res) => {
res.render('cart'); // Renderiza la vista 'cart.handlebars'
});

app.get('/cartDetail', (req, res) => {
res.render('cartDetail'); // Renderiza la vista 'cartDetail.handlebars'
});

app.get('/chat', (req, res) => {
res.render('chat'); // Renderiza la vista 'chat.handlebars'
});
app.get('/form', (req, res) => {
res.render('form'); // Renderiza la vista 'form.handlebars'
});

app.get('/home', (req, res) => {
res.render('home'); // Renderiza la vista 'home.handlebars'
});

app.get('/login', (req, res) => {
res.render('login'); // Renderiza la vista 'login.handlebars'
});

app.get('/productList', (req, res) => {
res.render('productList'); // Renderiza la vista 'productList.handlebars'
});

app.get('/profile', (req, res) => {
res.render('profile'); // Renderiza la vista 'profile.handlebars'
});

app.get('/realTimeProducts', (req, res) => {
res.render('realTimeProducts'); // Renderiza la vista 'realTimeProducts.handlebars'
});

app.get('/register', (req, res) => {
res.render('register'); // Renderiza la vista 'register.handlebars'
});



const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentación Proyecto Final curso Backend Ecommerce 2023 2023 ",
            description:  `Documentación de la API del proyecto final.\n
            Esta documentación tiene como finalidad poder consumir la api generada en mi servidor.\n
            El proyecto ha sido realizado con EXPRESS JS, NODE JS, JAVASCRIPT, MONGO DB, HANDLEBARS.\n
            El proyecto se trata en realizar el backend de una ecommerce completa.\n
            Información adicional sobre el proyecto:\n
              * API para el manejo de productos (con websockets)
              * API para el manejo de categorías
              * API para el manejo de la autenticación y autorización
              * API para el carrito de compras
              * API para los tickets de una compra
              * Reestablecimiento de la contraseña
              * Verificación del correo del usuario a través de un mail.
              * Interfaz gráfica utilizando el motor de plantillas handlebars.
              * Estilos proporcionados con CSS y Boostrap.\n
             Datos del cursado:\n
              * Año: 2023
              * Comisión: 52135
              * Del 20-05-2023 al 11-11-2023
              * Profesor: Arturo Verbel de Leon
              * Tutor: Marco Giabbani\n
              Repositorio de github del proyecto: https://github.com/GermanIaniero/Proyecto-Final-Coder-Backend \n
              Información de contacto: \n
              * Email: german_danielianiero@hotmail.com
              * Linkedin: https://www.linkedin.com/in/
              * Github: https://github.com/GermanIaniero'
              `,
        } 
    }, 

    components: {
        securitySchemes: {
          Authorization: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            value: "Bearer <JWT token here>",
          },
        },
      },
    
    apis: [`${__dirname}/../docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Passport
initializePassport()
app.use(passport.initialize())

app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
  );

const io = new Server(httpServer)

io.on('connection', (socket) => {
    socket.on('new-product', async data => {
      try { 
       // const productRepository.addProduct(data);
        const products = await productRepository.getProducts();
        await productManager.create(data)
        io.emit('reload-table', products);
      } catch { 
        console.log(e);
      }
    })

    socket.on("delete-product", async (id, email) => {
        try {
          await productRepository.deleteProduct(id, email);
          const products = await productRepository.getProducts();
          io.emit("reload-table", products);
        } catch (e) {
          console.log(e);
        }
      });
      socket.on("message", async (data) => {
        await messageRepository.saveMessage(data);
        //Envia el back
        const messages = await messageRepository.getMessages();
        io.emit("messages", messages);
      });
      socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`);
      });
})
  app.use(passport.session());

app.use("/", viewsRoutes);  
app.use('/api/session', usersRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/chat', chatsRouter)
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.get('/mail', async(req, res) => {
    const result = await transport.sendMail({
        from: 'gamcordoba@gmail.com',
        to: ['gamcordoba@gmail.com'],
        subject: 'Felicitaciones por tu nuevo trabajo !!',
        html: `
            <div>
                Bienvenido a tu nuevo puesto de Senior Backend
                <br> Tu salario es <b>140.000 USD</b> per year.
                <img src="cid:image1" />
            </div>
        `,
        attachments: [
            {
                filename: 'spider.jpg',
                path: `${__dirname}/images/spider.jpg`,
                cid: 'image1'
            }
        ]
    })

    
    res.send('Email sent')
})

app.get('/sms', async(req, res) => {
    const result = await client.messages.create({
        body: 'You have been hired',
        from: TWILIO_SMS_NUMBER,
        to: '+😅'
    })

    //console.log(result)
    res.send('SMS sent!')
})

app.listen(config.PORT, ()  => console.log('Listening...'))

//runServer();

//export default app;