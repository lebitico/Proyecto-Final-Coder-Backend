import { sessionService } from "../services/index.js";
import { generateToken } from "../utils.js";
import jwt from "jsonwebtoken";
import Swal from "sweetalert2";

export const renderLogin = (req, res) => {
  if (Object.keys(req.cookies).length != 0) return res.redirect("/profile");
  res.render("login", {})
}

export const loginUser = async (req, res) => {
  try {
    const user = await sessionService.loginUser(req.body);
    if (user == null) {
      req.logger.error("Error al loguear el usuario");
      return res.redirect("/login");
    }
    const access_token = generateToken(user);
    res
      .cookie("secretForJWT", (user.token = access_token), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      .render("profile", user);
  } catch (error) {
    req.logger.fatal("Error al loguear el usuario");
    res.status(500).json({ error: error.message });
  }
};

export const renderRegister = (req, res) => {
  if (Object.keys(req.cookies)?.length != 0) return res.redirect("/profile");
  res.render("register", {})
}

export const registerUser = async (req, res) => {
  try {
    const user = await sessionService.registerUser(req.body);
    req.logger.info("Usuario registrado");
    res.redirect("/login");
  } catch (error) {
    req.logger.fatal("Error al registrar el usuario");
    res.status(500).json({ error: error.message });
  }
};

export const getUserCurrent = async (req, res) => {
  try {
    const user = await sessionService.getUserCurrent(req.user.user);
    req.logger.info("Usuario obtenido");
    return res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.fatal("Error al obtener el usuario");
    res.status(500).json({ error: error.message });
  }
};

export const verificarUser = async (req, res) => {
  try {
    const token = req.params.token;
    jwt.verify(token, "secret", async (err, decoded) => {
      if (err) {
        req.logger.fatal("Token de verificacion no válido");
        res.status(500).json({ message: "Token de verificacion no válido" });
      }
      await sessionService.verificarUser(decoded);
      res.render("verificar", {});
    });
  } catch (error) {
    req.logger.fatal("Error al verificar el usuario");
    res.status(500).json({ error: error.message });
  }
};

export const resetearPassword = async (req, res) => {
  try {
    res.render("resetearPassword", {});
  } catch (error) {
    req.logger.fatal("Error al resetear la contraseña");
    res.status(500).json({ error: error.message });
  }
};

export const restart = async (req, res) => {
  const email = req.body.email;
  await sessionService.validUserSentEmailPassword(email);
  Swal.fire({
    title: "Correo enviado",
    text: "Correo enviado con las instrucciones para restablecer la contraseña",
    icon: "success",
  });
  res.send({
    status: "success",
    message: "Email enviado con las instrucciones para cambiar la contraseña",
  });
};

export const resetPasswordForm = async (req, res) => {
  const token = req.params.token;
  jwt.verify(token, "secret", async (err, decoded) => {
    if (err) {
      req.logger.fatal("Token de verificacion no válido");
      res.status(500).render("resetearPassword");
    }
    res.status(200).render("formReset");
  });
};


export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail(email);

    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const currentPassword = user.password;

      if (await bcrypt.compare(password, currentPassword)) {
        return res.status(400).json({
          message: "La nueva contraseña no puede ser igual a la actual",
        });
      }

      const updatedUser = { password: hashedPassword };
      await userService.updatedUserById(user.id, updatedUser);

      return res.redirect("/login");
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

export const validPassword = async (req, res) => {
  try {
    const password = req.body.newPassword;
    const email = req.body.email;
    const confirmpassword = req.body.confirmPassword;
    await sessionService.resetPasswordForm(email, password, confirmpassword);
    res.render("login", {});
  } catch (error) {
    req.logger.fatal("Error al validar la contraseña");
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  const { user } = req.user;
  const userDB = await sessionService.getUserByEmail(user.email);
  res.status(200).render("profile", userDB);
};

export const logoutUser = async (req, res) => {
  const { user } = req.user;
  await sessionService.setDateController(user);
  res.clearCookie("keyCookieForJWT").redirect("/api/session/login");
};

export const loginGithub = async (req, res) => {
  const user = req.user;
  user.last_connection = new Date().toLocaleString();
  await user.save();

  const access_token = generateToken(user);

  res
    .cookie(config.secret_cookie, access_token, {
      maxAge: 60 * 60 * 10000,
      httpOnly: true,
    })
    .redirect("/profile");
};
