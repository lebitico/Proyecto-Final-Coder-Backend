import express from 'express'
import config from './config/config.js'

import nodemailer from 'nodemailer'
import twilio from 'twilio'
import cors from 'cors'
import handlebars from 'express-handlebars'
import path from 'path'
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
//import __dirname from './utils/utils.js'
import session from 'express-session'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { addLogger } from './utils/logger.js'
import cookieParser from 'cookie-parser'
import paymentsRouter from './routes/payment.router.js'


import swaggerUiExpress from 'swagger-ui-express';
import { specs } from "./docs/swagger.js";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";

import usersRouter from './routes/users.router.js'
//import ordersRouter from './routes/orders.router.js'
//import cartsRouter from './routes/carts.router.js'
//import productsRouter from './routes/products.router.js'
import chatRouter from './routes/chat.router.js'
import viewsRouter from "./routes/view.router.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import chatRouter from "./routes/chat.router.js";
import viewsRouter from "./routes/view.router.js";
import sessionRouter from "./routes/session.router.js";
import { messageRepository } from "./services/index.js";
import { productRepository } from "./services/index.js";
import usersRouter from "./routes/users.router.js";
import paymentRouter from "./routes/payment.router.js";


const PORT = config.port;
const app = express()

// Configurar los motores de plantilla
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(addLogger)
app.use(cors({ origin: "*" }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.url,
      dbName: config.dbName,
      ttl: process.env.ttl,
    }),
    secret: "CoderSecret",
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport()
app.use(passport.initialize())

app.use(passport.session());
app.use(cookieParser("secretForJWT"));    
app.use(passport.session());
app.use("/", viewsRouter);
app.use('/api/session', sessionRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/chat', chatRouter)
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use('/api/users', usersRouter)

const runServer = () => {
  const httpServer = app.listen(
    config.PORT,
    console.log(`✅Server escuchando in the port: ${config.PORT}`)
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
}


  runServer();

  export default app; 