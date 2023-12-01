import { Router } from "express";
import { getProducts, createProducts, getProductByID, updateProducts, deleteProducts } from "../controllers/products.controller.js";
import passport from "passport";
import { authorization } from '../utils/utils.js'

const router = Router()

router.get('/', getProducts)
router.get('/:pid', getProductByID)
router.post('/', passport.authenticate("jwt", { session: false }),
    authorization('admin'),
    createProducts
)
//router.put('/:pid', updateProducts)
router.put('/:pid',
    passport.authenticate("jwt", { session: false }),
    authorization('admin'),
    updateProducts
)
router.delete('/:pid',  
    passport.authenticate("jwt", { session: false }),
        authorization('admin'),
        deleteProducts
)

export default router