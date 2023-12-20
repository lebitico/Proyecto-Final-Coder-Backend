import { Router } from "express";
import passport from "passport";
import { authorizationRol, authorizationStrategy } from "../utils.js";
import { generateToken, generateProducts } from "../utils/utils.js";
import { getProfile, renderLogin, renderRegister } from "../controllers/session.controllers.js";
//import { getProducts, getProductByID } from "../controllers/products.controller.js";

const router = Router();
// import auth from './auth';

router.get("/", (req, res) => {
  res.render("home", {});
});

router.get("/failregister", async (req, res) => {
  res.send({ error: "failed" });
});

router.get("/register", renderRegister)
  
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile
);
router.get(
  "/login-github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    console.log("Callback: ", req.user);
    const access_token = generateToken(req.user);
    res
      .cookie("keyCookieForJWT", (req.user.token = access_token), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      .redirect("/profile");
  }
);
router.get(
  "/login-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
  async (req, res) => {}
);

router.get(
  "/googlecallback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const access_token = generateToken(req.user);
    res
      .cookie("keyCookieForJWT", access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/profile");
  }
);

router.get("/mockingproducts", async (req, res) => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }
  res.send({ status: "success", payload: products });
});

router.get("/loggerTest", (req, res) => {
  req.logger.info("Info");
  req.logger.debug("Debug");
  req.logger.http("Http");
  req.logger.error("Error");
  req.logger.fatal("Fatal");
  req.logger.warning("Warning");
  res.send("Logger testing");
});


router.get("/login", renderLogin);

// //Reestablecer Pass
// router.get("/resetPass", auth, (req, res) => {
//   res.render("resetPass", {});
// });

// //Reestablecer Pass
// router.get("/resetPassError", auth, (req, res) => {
//   res.render("resetPassError", {});
// });

// // Reestablecer Pass confirm
// router.get("/resetPassConfirm", auth, (req, res) => {
//   const token = req.query.token;

//   try {
//     const decoded = jwt.verify(token, config.secret_jwt);
//     const isExpired = Date.now() > decoded.exp * 1000;
//     if (isExpired) {
//       res.render("resetPassError", { message: "El enlace ha expirado" });
//     } else {
//       res.render("resetPassConfirm", { token });
//     }
//   } catch (error) {
//     res.render("resetPassError", { message: "Error al verificar el enlace" });
//   }
// });

//Ruta para admins
router.get(
  "/admin",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Premium", "Admin"]),
  (req, res) => {
    res.render("admin", {});
  }
);

//Chat socket io
router.get(
  "/messages",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Usuario"),
  (req, res) => {
    res.render("messages", {});
  }
);

router.get(
  "/cart",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "Premium"]),
  (req, res) => {
    res.render("cart", {});
  }
);

//Contacto
router.get("/contacto", async (req, res) => res.render("contacto", {}));







//Ruta PAGINATE PRODUCTS
router.get("/productos", async (req, res) => {
  const page = parseInt(req.query?.page || 1);
  const limit = parseInt(req.query?.limit || 10);

  const queryParams = req.query?.query || "";
  const query = {};

  if (queryParams) {
    const [field, value] = queryParams.split(",");
    if (!isNaN(parseInt(value))) {
      query[field] = value;
    }
  }

  const sortField = req.query?.sortField || "createdAt";
  const sortOrder = req.query?.sortOrder === "desc" ? -1 : 1;

  try {
    const products = await ProductModel.paginate(query, {
      limit,
      page,
      lean: true,
      sort: { [sortField]: sortOrder },
    });

    products.prevLink = products.hasPrevPage
      ? `/productos?page=${products.prevPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";
    products.nextLink = products.hasNextPage
      ? `/productos?page=${products.nextPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";

    return res.render("paginate", products);
  } catch (error) {
    return res.status(500).send("Error al enviar products.");
  }
});

export default router;