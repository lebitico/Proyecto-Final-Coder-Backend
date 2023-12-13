import { Router } from "express";
import {
  addProduct,
  getProductsRealTime,
  getProducts,
  getProductByID,
  updateProducts,
  deleteProducts,
} from "../controllers/products.controller.js";
import passport from "passport";

const router = Router();

router.post("/", passport.authenticate("jwt", { session: false }), addProduct);
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  updateProducts
);
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  deleteProducts
);

router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  getProducts
);

router.get(
  "/realtimeProducts",
  passport.authenticate("jwt", { session: false }),
  getProductsRealTime
);
router.get(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  getProductByID
);

export default router;
