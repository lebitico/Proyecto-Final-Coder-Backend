import PaymentDTO from "../DAO/DTO/payment.dto.js";
import {
  paymentService,
  ticketRepository,
  cartRepository,
  userRepository,
  productRepository,
} from "../services/index.js";
import Stripe from "stripe";
import config from "../config/config.js";
import nodemailer from "nodemailer";

const stripe = new Stripe(config.keyPrivate);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.USER,
    pass: config.PASS,
  },
});

export default class PaymentRepository {
  constructor(ticketDAO, cartDAO) {
    this.ticketDAO = ticketDAO;
    this.cartDAO = cartDAO;
  }

  creacteCheckout = async (id) => {
    try {
      const ticket = await this.ticketDAO.getTicketById(id);
      const products = ticket.products;
      if (ticket.status === "confirmate") {
        throw new Error("ya ha sido pagado el ticket");
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((product) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: product.pid.title,
            },
            unit_amount: product.pid.price * 100,
          },
          quantity: product.quantity,
        })),
        mode: "payment",
        success_url: config.suces + `${encodeURIComponent(ticket._id)}`,
        cancel_url: config.cancel + `${encodeURIComponent(ticket._id)}`,
      });
      return session;
    } catch (e) {
      throw e;
    }
  };
  sucessPayment = async (ticketId) => {
    const ticket = await this.ticketDAO.getTicketById(ticketId);
    ticket.status = "confirmate";
    await this.ticketDAO.updateTicket(ticketId, ticket);
    const result = transporter.sendMail({
      from: config.USER,
      to: ticket.purcharser,
      subject: "Thank you for your purchase!",
      html: `Thank you for your purchase! Your order number is ${ticket._id}.
            Your products are: ${ticket.products
              .map(
                (product) =>
                  `Title: ${product.pid.title} - Descripcion: ${product.pid.descripcion} - Price: $ ${product.pid.price}`
              )
              .join(", ")}.
            A confirmation email will be sent to you when your order is shipped.Total de la compra:$ ${
              ticket.amount
            }`,
    });
    return ticket;
  };

  cancellPayment = async (ticketId) => {
    const ticket = await this.ticketDAO.getTicketById(ticketId);
    const user = await userRepository.getUserByEmail(ticket.purcharser);
    const cartUser = await cartRepository.getCartUserById(user);
    for (const product of ticket.products) {
      const pid = product.pid._id;
      const productDB = await productRepository.getProductById(pid);
      const quantity = product.quantity;
      productDB.stock += quantity;
      await productRepository.updateProduct(pid, productDB);
      cartUser.cart.products.push({ pid, quantity });
      const cid = cartUser.cart._id;
      const cart = cartUser.cart;
      await cartRepository.updateCartById(cid, cart);
    }
    ticket.status = "canceled";
    await this.ticketDAO.updateTicket(ticket._id, ticket);
  };
}
