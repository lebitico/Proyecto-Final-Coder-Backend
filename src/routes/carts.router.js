import { Router } from "express";
import {
  addProductCartByID,
  deleteProductOneCartById,
  getCartByUserId,
  updateProductCartById,
  getTicketCartUserById,
  getCarts,
  createCarts,
  getCartByID,
  updateCarts,
  deleteOneCarts,
  deleteCarts,
  purchaseCarts,
} from "../controllers/carts.controller.js";
import passport from "passport";

const router = Router();

router.get("/", getCarts);
//router.get("/:cid", getCartByID);
//router.post("/", createCarts);
router.post("/:cid/products/:pid", updateCarts);
/*router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  purchaseCarts
);*/
router.delete("/:cid/products/:pid", deleteOneCarts);
router.delete("/:cid", deleteCarts);

router.post("/", passport.authenticate("jwt", { session: false }), createCarts);
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  getCartByUserId
);
router.get(
  "/pid/:pid",
  passport.authenticate("jwt", { session: false }),
  addProductCartByID
);
router.get(
  "/delete/:pid",
  passport.authenticate("jwt", { session: false }),
  deleteProductOneCartById
);
router.put(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  updateProductCartById
);


router.get(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  getTicketCartUserById
);

export default router;
