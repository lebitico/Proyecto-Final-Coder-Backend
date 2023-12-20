import { Router } from "express";
import {
  createTicket,
  getTicketById,
  getTickets,
  updateTicketById,
  deleteTicket,
} from "../controllers/tickets.controller.js";
import {
  authorizationRol,
  authorizationStrategy,
  extractNonSensitiveUserInfo,
} from "../utils.js";
import passport from 'passport'
const router = Router();

router.post(
  "/tickets",
  passport.authenticate("jwt", { session: false }),
  authorizationRol(["Usuario", "Premium"]),
  extractNonSensitiveUserInfo,
  createTicket
);

router.get("/tickets", getTickets);

router.get("/tickets/:id", getTicketById);

router.put("/tickets/:id", updateTicketById);

router.delete("/tickets/:id", deleteTicket);

export default router;