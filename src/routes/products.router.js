import { Router } from "express";
import {
  addProduct,
  getProductsRealTime,
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
  "/realtimeProducts",
  passport.authenticate("jwt", { session: false }),
  getProductsRealTime
);


export default router;
