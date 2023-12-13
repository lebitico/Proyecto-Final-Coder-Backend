import Stripe from "stripe";
import { paymentService } from "../services/index.js";

export const creacteCheckout = async (req, res) => {
  try {
    const ticketId = req.query.ticketId;
    const session = await paymentService.creacteCheckout(ticketId);
    return res.redirect(session.url);
  } catch (e) {
    const message = {
      message: "Ya ha sido pagado el ticket",
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const sucessPayment = async (req, res) => {
  try {
    const ticketId = req.query.ticketId;
    const succes = await paymentService.sucessPayment(ticketId);
    return res.render("sucess", succes);
  } catch (e) {
    const message = {
      message: e,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const CancellPayment = async (req, res) => {
  try {
    const ticketId = req.query.ticketId;
    const sucess = await paymentService.cancellPayment(ticketId);
    const message = {
      message: "Tu compra ha sido cancelada con exito.",
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(500).render("popUp", { message, URI });
  } catch (e) {
    const message = {
      message: e,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).render("popUp", { message, URI });
  }
};
