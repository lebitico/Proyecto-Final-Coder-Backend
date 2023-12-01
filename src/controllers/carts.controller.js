import { cartService } from "../services/index.js";
import CartModel from "../DAO/mongo/carts.mongo.js"

export const getCarts = async (req, res) => {
  const result = await cartService.getCarts();
  res.send({ status: "success", payload: result });
};

export const getCartByID = async (req, res) => {
  const { cid } = req.params;
  const result = await cartService.getCartById(cid);

  res.send({ status: "success", payload: result });
};

export const createCarts = async (req, res) => {
  const cart = req.body;

  const result = await cartService.createCarts(cart);
  res.send({ status: "success", payload: result });
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

export const purchaseCarts = async (req, res) => {
  try {
    const userMail = req.user.user.email
    const cid = req.params.cid;
    const result = await cartService.purchaseCarts(cid, userMail);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", payload: error.message });
 
}};

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
