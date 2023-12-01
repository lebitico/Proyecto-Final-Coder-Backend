import { Router } from "express";
import { getCarts, createCarts, getCartByID, updateCarts, deleteOneCarts, deleteCarts, purchaseCarts  } from "../controllers/carts.controller.js";
import passport from "passport";

const router = Router()

router.get('/', getCarts)
router.get('/:cid', getCartByID)
router.post('/', createCarts)
router.post('/:cid/products/:pid', updateCarts)
router.post('/:cid/purchase', passport.authenticate("jwt", { session: false }),
    purchaseCarts) 
router.delete('/:cid/products/:pid', deleteOneCarts)
router.delete('/:cid', deleteCarts)

export default router