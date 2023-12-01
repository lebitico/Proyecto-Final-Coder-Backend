import express from 'express'
import config from './config/config.js'
import usersRouter from './routes/users.router.js'
import ordersRouter from './routes/orders.router.js'
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import nodemailer from 'nodemailer'
import twilio from 'twilio'
import cors from 'cors'
import handlebars from 'express-handlebars'
import __dirname from './utils/utils.js'
import session from 'express-session'
//import sessionRouter from './routes/session.router.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { addLogger } from './utils/logger.js'
import cookieParser from 'cookie-parser'

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'; 

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

// Configurar los motores de plantilla
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars') 


const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion de Productos, Carritos y Usuario',
            description: 'Este proyecto es de productos(products), carritos(carts) y usuario (sessions) - German Ianiero'
        }
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
  
  app.use(passport.session());

app.use('/api/session', usersRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

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