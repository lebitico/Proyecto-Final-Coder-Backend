import { Router } from "express";
import { getOrders, createOrders, resolveOrder, getOrderByID } from "../controllers/orders.controller.js";

const router = Router()

router.get('/', getOrders)
router.get('/:oid', getOrderByID)
router.post('/', createOrders)
router.post('/:oid', resolveOrder)

export default router