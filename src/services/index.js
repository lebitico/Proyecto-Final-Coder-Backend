import { User, Order, Product, Cart, Category, Message, Session, Ticket } from '../DAO/factory.js'
import UserRepository from './users.repository.js'
import OrderRepository from './orders.repository.js'
import ProductRepository from './products.repository.js'
import CartRepository from './carts.repository.js'

import CategoryRepository from "./categorys.repository.js";
import MessageRepository from "./messages.repository.js";
import SessionRepository from "./sessions.repository.js";
import TicketRepository from "./tickets.repository.js";
import PaymentRepository from "./payments.repository.js";

export const userService = new UserRepository(new User())
export const orderService = new OrderRepository(new Order())
export const productService = new ProductRepository(new Product())
export const cartService = new CartRepository(new Cart())


export const categoryService = new CategoryRepository(new Category())
export const messageService = new MessageRepository(new Message())
export const sessionService = new SessionRepository(new Session())
export const ticketService = new TicketRepository(new Ticket())
export const paymentService = new PaymentRepository(new Ticket(), new Cart())