import { Router } from "express";
import passport from "passport";
import {
  userPremium,
  uploadDocuments,
  uploadDocumentView,
  getUsers,
  inactiveUser,
  deleteUserById,
  getTicketUser,
  getCurrentUser
} from "../controllers/users.controller.js";

import upload from "../middlewares/multer.js";

const router = Router();
router.get(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  userPremium
);

router.get(
  "/ticket/:uid",
  passport.authenticate("jwt", { session: false }),
  getTicketUser
);

router.post(
  "/:uid/documents",
  passport.authenticate("jwt", { session: false }),
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
    { name: "documentDNI", maxCount: 1 },
    { name: "comprobanteDomicilio", maxCount: 1 },
    { name: "comprobanteEstadoCuenta", maxCount: 1 },
  ]),
  uploadDocuments
);

router.get(
  "/uploadDocuments",
  passport.authenticate("jwt", { session: false }),
  uploadDocumentView
);

router.get(
  "/delete/:uid",
  passport.authenticate("jwt", { session: false }),
  deleteUserById
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  getCurrentUser
);
router.get("/", passport.authenticate("jwt", { session: false }), getUsers);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  inactiveUser
);

router.get(
  "/delete/:uid",
  passport.authenticate("jwt", { session: false }),
  deleteUserById
);

router.post("/users", createUser);


router.get("/users/:email", getUserByEmail);

router.get("/users/id/:id", getUserById);

router.put("/users/:id", updatedUserById);

router.put("/users/premium/:id", updatedUserRole);

export default router;
