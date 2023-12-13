import { createHash, isValidPassword } from "../utils/utils.js";
import UserDTO from "../DAO/DTO/users.dto.js";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";
import { generateUserErrorInfo } from "../utils/errors/info.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.USER,
    pass: config.PASS,
  },
});

export default class SessionRepository {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async loginUser(user) {
    try {
      const userDB = await this.userDAO.getUserByEmail(user.email);
      if (!userDB) {
        CustomError.createError({
          name: "Error",
          message: "User not found by create error",
          code: EErrors.USER_NOT_FOUND,
          info: generateUserErrorInfo(user),
        });
      }
      if (userDB.status === "not verified") {
        CustomError.createError({
          name: "Error",
          message: "User not verified",
          code: EErrors.USER_NOT_VERIFIED,
        });
      }
      if (!isValidPassword(userDB, user.password)) {
        CustomError.createError({
          name: "Error",
          message: "Password not valid",
          code: EErrors.PASSWORD_NOT_VALID,
          info: generateUserErrorInfo(user),
        });
      }
      const date = new Date();
      userDB.last_connection = date;
      await this.userDAO.updateUser(userDB._id, userDB);
      return new UserDTO(userDB);
    } catch (e) {
      throw e;
    }
  }

  async registerUser(user) {
    if (await this.userDAO.getUserByEmail(user.email))
      throw new Error("User already exist");
    const token = jwt.sign({ email: user.email }, "secret", {
      expiresIn: "24h",
    });
    const verificationLink = `http://localhost:8080/api/session/verify/${token}`;
    const mailOptions = {
      from: config.USER,
      to: user.email,
      subject: "Verificación de tu correo electrónico",
      html: `Haz click en el siguiente link para verificar tu correo electrónico: ${verificationLink}`,
    };
    user.password = createHash(user.password);
    if (user.email === "adminCoder@coder.com") {
      user.rol = "admin";
    } else {
      user.rol = "user";
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw new Error("Error al enviar el mail");
    });
    return await this.userDAO.createUser(user);
  }

  async getUserCurrent(user) {
    return new UserDTO(user);
  }

  async verificarUser(decoded) {
    const user = await this.userDAO.getUserByEmail(decoded.email);
    user.status = "verified";
    await this.userDAO.updateUser(user._id, user);
  }

  async resetPasswordForm(email, password, confirmPassword) {
    const user = await this.userDAO.getUserByEmail(email);
    if (!user) {
      CustomError.createError({
        name: "Error",
        message: "User not found by create error",
        code: EErrors.USER_NOT_FOUND,
        info: generateUserErrorInfo(user),
      });
    }
    if (password !== confirmPassword) {
      return CustomError.createError({
        name: "Error",
        message: "Las contraseñas no coinciden",
        code: EErrors.PASSWORD_NOT_VALID,
        info: generateUserErrorInfo(user),
      });
    }
    if (isValidPassword(user, password)) {
      return CustomError.createError({
        name: "Error",
        message: "La contraseña ingresada no puede ser igual a la anterior",
        code: EErrors.PASSWORD_NOT_VALID,
        info: generateUserErrorInfo(user),
      });
    }
    const newPassword = createHash(password);
    user.password = newPassword;
    await this.userDAO.updateUser(user._id, user);
    return user;
  }

  async validUserSentEmailPassword(email) {
    const user = await this.userDAO.getUserByEmail(email);
    if (user) {
      const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
      const mailOptions = {
        from: config.USER,
        to: email,
        subject: "Restablecer tu contraseña",
        html: `Haz click en el siguiente link para restablecer tu contraseña: http://localhost:8080/api/session/resetPasswordForm/${token}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw new Error("Error al enviar el mail");
      });
    }
    return user;
  }

  async getUserByEmail(email) {
    try {
      const user = await this.userDAO.getUserByEmail(email);
      if (!user) {
        CustomError.createError({
          name: "Error",
          message: "User not found by create error",
          code: EErrors.USER_NOT_FOUND,
          info: generateUserErrorInfo(user),
        });
      }
      return user;
    } catch (e) {
      throw e;
    }
  }
  async setDateController(user) {
    const userDB = await this.userDAO.getUserByEmail(user.email);
    const date = new Date();
    userDB.last_connection = date;
    await this.userDAO.updateUser(userDB._id, userDB);
    return userDB;
  }
}
