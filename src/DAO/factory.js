import config from '../config/config.js'
import mongoose from 'mongoose'
import CustomError from "../utils/errors/CustomError.js"

export let User
export let Order
export let Product
export let Cart

export let Category
export let Message
export let Ticket
export let Session

//console.log(`Persistence with ${config.PERSISTENCE}`)

switch (config.PERSISTENCE) {
    case 'MONGO':
        mongoose.connect(config.DBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            DBNAME: config.DBNAME
        })

        .then(() => console.log('MongoDB connected'))
        .catch((err) => CustomError.createError(`Error in MongoDB connection`, err))

        const { default: UserMongo } = await import('./mongo/users.mongo.js')
        const { default: OrderMongo } = await import('./mongo/orders.mongo.js')
        const { default: ProductMongo } = await import('./mongo/products.mongo.js')
        const { default: CartMongo } = await import('./mongo/carts.mongo.js')

        const { default: CategoryMongo } = await import('./mongo/categorys.mongo.js')
        const { default: MessageMongo } = await import('./mongo/messages.mongo.js')
        const { default: TicketMongo } = await import('./mongo/tickets.mongo.js')
        const { default: SessionMongo } = await import('./mongo/users.mongo.js')

        User = UserMongo
        Order = OrderMongo
        Product = ProductMongo
        Cart = CartMongo
        Category = CategoryMongo
        Message = MessageMongo
        Ticket = TicketMongo
        Session = SessionMongo

        break;

    case 'FILE':
        const { default: UserFile } = await import('./file/users.file.js')
        const { default: OrderFile } = await import('./file/orders.file.js')
        const { default: ProductFile } = await import('./file/products.file.js')
        const { default: CartFile } = await import('./file/carts.file.js')
       /* const { default: CategoryFile } = await import('./file/categorys.file.js')
        const { default: MessageFile } = await import('./file/messages.file.js')
        const { default: SessionFile } = await import('./mongo/sessions.file.js')
        const { default: TicketFile } = await import('./mongo/tickets.file.js') */
        

        User = UserFile
        Order = OrderFile
        Product = ProductFile
        Cart = CartFile
       /* Category = CategoryFile
        Message = MessageFile
        Session = SessionFile
        Ticket = TicketFile*/

        break;

    default:
        break;
}

