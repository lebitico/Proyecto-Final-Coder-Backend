import { Router } from "express";
import {
  addProductCartByID,
  deleteProductOneCartById,
  getCartByUserId,
  updateProductCartById,
  getCarts,
  createCarts,
  getCartByID,
  updateCarts,
  deleteOneCarts,
  deleteCarts,
  finishPurchase
} from "../controllers/carts.controller.js";
import passport from "passport";

const router = Router();

router.get("/", getCarts);

router.get("/:cid", getCartByID);

router.post("/:cid/products/:pid", updateCarts);

router.delete("/:cid/products/:pid", passport.authenticate("jwt", { session: false }),
authorizationRol(["Usuario", "Premium"]),
deleteOneCarts);

router.delete("/:cid", passport.authenticate("jwt", { session: false }),
authorizationRol(["Usuario", "Premium"]),
deleteCarts);

router.post("/", passport.authenticate("jwt", { session: false }), createCarts);
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  getCartByUserId
);

router.get(
  "/pid/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizationRol(["Usuario", "Premium"]),
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
  authorizationRol(["Usuario", "Premium"]),
  finishPurchase
);

export default router;
