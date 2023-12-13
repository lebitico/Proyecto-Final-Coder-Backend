import { Router } from "express";
import passport from "passport";
import {
  userPremium,
  uploadDocuments,
  uploadDocumentView,
  inactiveUser,
  deleteUser,
  getTicketUser,
  getCurrentUser,
  deleteUserById,
  getUsers,
  createUsers,
  getUserByID,
  login,
  logout,
  register,
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
  deleteUser
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  getCurrentUser
);
router.get("/", passport.authenticate("jwt", { session: false }), getUsers);
router.post("/login", passport.authenticate("login"), login);
router.post("/logout", logout);
router.post("/register", passport.authenticate("register"), register);
router.get("/:uid", getUserByID);
router.delete("/:uid", deleteUserById);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  inactiveUser
);

export default router;
