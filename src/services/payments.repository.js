//import PaymentDTO from "../DAO/DTO/payment.dto.js";
import {
  ticketService,
  cartService,
} from "../services/index.js";
import Stripe from "stripe";
import config from "../config/config.js";
import nodemailer from "nodemailer";
import { sent_success } from "../controllers/mailing.controller.js";

const stripe = new Stripe(config.STRIPE_PRIVATE_KEY);

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
    this.stripe = new Stripe(config.STRIPE_PRIVATE_KEY);
  }

  creacteCheckout = async (items, id) => {
    const lineItems = items
    .filter((item) => item.pid.stock > 0)
    .map((item) => ({
      price_data: {
        product_data: {
          name: item.pid.title,
        },
        currency: "usd",
        unit_amount: item.pid.price,
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `https://proyecto-final-coder-backend-production-germanianiero.up.railway.app/api/payments/success/${cid}`,
      cancel_url: `https://proyecto-final-coder-backend-production-germanianiero.up.railway.app/api/payments/cancel/${cid}`,
    });

    return session;
  };

  /*
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
  }; */
  sucessPayment = async (cid, email) => {

    const cart = await cartService.getCartById(cid);
    const purchaseData = await cartService.finishPurchase(cart);

    if (purchaseData && purchaseData.amountTotalBuy !== undefined) {
      const amountTotalBuy = purchaseData.amountTotalBuy;
      const buyProducts = purchaseData.buyProducts;

      const products = buyProducts.map((product) => ({
        pid: {
          title: product.pid.title,
          price: product.pid.price,
        },
        quantity: product.quantity,
      }));

      const ticketData = {
        amount: amountTotalBuy,
        purchaser: email,
        products: products,
      };

      const newTicket = await ticketService.createTicket(ticketData);
      console.log(newTicket);

      await sent_success(email, amountTotalBuy, products, newTicket);

      return newTicket;
    } else {
      throw new Error("Error al finalizar la compra");
    }
  };



    /*const ticket = await this.ticketDAO.getTicketById(ticketId);
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
  }; */

  cancellPayment = async () => {};
    /*const ticket = await this.ticketDAO.getTicketById(ticketId);
    const user = await userService.getUserByEmail(ticket.purcharser);
    const cartUser = await cartService.getCartUserById(user);
    for (const product of ticket.products) {
      const pid = product.pid._id;
      const productDB = await productService.getProductById(pid);
      const quantity = product.quantity;
      productDB.stock += quantity;
      await productService.updateProduct(pid, productDB);
      cartUser.cart.products.push({ pid, quantity });
      const cid = cartUser.cart._id;
      const cart = cartUser.cart;
      await cartService.updateCartById(cid, cart);
    }
    ticket.status = "canceled";
    await this.ticketDAO.updateTicket(ticket._id, ticket);*/
  
}
