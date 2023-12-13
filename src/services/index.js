import {
  User,
  Product,
  Cart,
  Category,
  Message,
  Session,
  Ticket,
} from "../DAO/factory.js";

import UserRepository from "./users.repository.js";
import ProductRepository from "./products.repository.js";
import CartRepository from "./carts.repository.js";

import CategoryRepository from "./categorys.repository.js";
import MessageRepository from "./messages.repository.js";
import SessionRepository from "./sessions.repository.js";
import TicketRepository from "./tickets.repository.js";
import PaymentRepository from "./payments.repository.js";

export const userService = new UserRepository(new User(), new Cart(),
new Ticket());
export const productService = new ProductRepository(new Product(), new User());
export const cartService = new CartRepository(new Cart(),  new User(),
new Product(),
new Ticket());

export const categoryService = new CategoryRepository(new Category());
export const messageService = new MessageRepository(new Message());
export const sessionService = new SessionRepository(new Session());
export const ticketService = new TicketRepository(new Ticket());
export const paymentService = new PaymentRepository(new Ticket(), new Cart());
