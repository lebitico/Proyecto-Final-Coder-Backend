import { cartService, userService } from "../services/index.js";
import { Types } from "mongoose";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";
import { generateCartErrorInfo } from "../utils/errors/info.js";

export const getCarts = async (req, res) => {
  const result = await cartService.getCarts();
  res.send({ status: "success", payload: result });
};

export const getCartByID = async (req, res) => {
  try {
    const { cid } = req.params;
    res.status(200).json(await cartService.getCartById(cid));
  } catch (error) {
    req.logger.fatal("Error al obtener el carrito");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const getTicketCartUserById = async (req, res) => {
  try {
    const user = req.user;
    const userDb = await userService.getUserByEmail(user.user.email);
    const ticket = await cartService.getTicketCartUserById(userDb._id);
    if (ticket) {
      res.status(200).render("ticket", ticket);
    } else {
      req.logger.error("Error al obtener el ticket");
      CustomError.createError({
        name: "Error",
        message: "Cart not products",
        code: EErrors.CART_NOT_FOUND,
        info: generateCartErrorInfo(req.user),
      });
    }
  } catch (error) {
    req.logger.fatal("Error al obtener el ticket");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/carts/carts",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const getCartByUserId = async (req, res) => {
  try {
    const { user } = req.user;
    const { cart, total } = await cartService.getCartUserById(user);
    const { first_name, last_name, rol, email } = user;
    if (cart) {
      res
        .status(200)
        .render("./cart", { cart, first_name, last_name, email, rol, total });
    } else {
      req.logger.error("Error al obtener el carrito");
      CustomError.createError({
        name: "Error",
        message: "Cart not found",
        code: EErrors.CART_NOT_FOUND,
        info: generateCartErrorInfo(req.user),
      });
    }
  } catch (error) {
    req.logger.fatal("Error al obtener el carrito");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/carts/carts",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const createCarts = async (req, res) => {
  try {
    const cart = req.body;

    const result = await cartService.createCarts(cart);
    res.status(200).json(cart);
  } catch (error) {
    req.logger.fatal("Error al crear el carrito");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const addProductCartByID = async (req, res) => {
  try {
    const { user } = req.user;
    const pid = req.params.pid;
    const quantity = parseInt(req.body.quantity || 1);
    const idProduct = new Types.ObjectId(pid);
    await cartService.addProductCartByID(idProduct, quantity, user);
    const message = {
      message: "Producto agregado al carrito correctamente",
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).render("popUp", { message, URI });
  } catch (error) {
    req.logger.fatal("Error al agregar el producto");
    const message = {
      message: error,
    };
    res.status(500).render("popUp", message);
  }
};

export const updateCarts = async (req, res) => {
  try {
    const pid = req.params.pid;
    const cid = req.params.cid;
    const quantity = parseInt(req.body.quantity);
    const product = { pid, quantity };
    const result = await cartService.updateCarts(cid, product);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", payload: error.message });
  }
};

export const updateCartById = async (req, res) => {
  try {
    const cart = await cartService.updateCartById(
      req.params.cid,
      req.params.pid,
      req.body.quantity || 1
    );
    res.status(200).json(cart);
  } catch (error) {
    req.logger.fatal("Error al actualizar el producto");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const updateProductCartById = async (req, res) => {
  try {
    const pid = req.params.pid;
    const cid = req.params.cid;
    await cartService.deleteProductOneCartById(cid, pid);
    res.redirect("http://localhost:8080/api/carts/user");
  } catch (e) {
    req.logger.fatal("Error al actualizar el producto");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/carts/carts",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const purchaseCarts = async (req, res) => {
  try {
    const userMail = req.user.user.email;
    const cid = req.params.cid;
    const result = await cartService.purchaseCarts(cid, userMail);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", payload: error.message });
  }
};

export const deleteOneCarts = async (req, res) => {
  const pid = req.params.pid;
  const cid = req.params.cid;
  const quantity = parseInt(req.body.quantity);
  const carts2 = { pid, quantity };
  const result = await cartService.deleteOneCarts(cid, carts2);
  res.send({ status: "success", payload: result });
};

export const deleteCarts = async (req, res) => {
  const pid = req.params.pid;
  const cid = req.params.cid;
  const quantity = parseInt(req.body.quantity);
  const carts2 = { pid, quantity };
  const result = await cartService.deleteCarts(cid, carts2);
  res.send({ status: "success", payload: result });
};

export const deleteCartById = async (req, res) => {
  try {
    const cid = req.params.id;
    const cartId = new Types.ObjectId(cid);
    const cart = await cartService.deleteCartById(cartId);
    res.status(200).json(cart);
  } catch (error) {
    req.logger.fatal("Error al eliminar el carrito");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const deleteProductCartByID = async (req, res) => {
  try {
    const cart = await cartService.deleteProductCartByID(
      req.params.cid,
      req.params.pid
    );
    const message = {
      message: "Carrito eliminado",
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).json(cart);
  } catch (error) {
    req.logger.fatal("Error al eliminar el producto");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(200).render("popUp", { message, URI });
  }
};

export const deleteProductOneCartById = async (req, res) => {
  try {
    const { user } = req.user;
    const pid = req.params.pid;
    await cartService.deleteProductOneCartById(user, pid);
    res.redirect("/api/cart/user");
  } catch (error) {
    req.logger.fatal("Error al eliminar el producto");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/carts/carts",
    };
    res.status(200).render("popUp", { message, URI });
  }
};
