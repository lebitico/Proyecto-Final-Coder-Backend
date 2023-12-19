import { userService } from "../services/index.js";
import { generateToken } from "../utils.js";
import { use } from "chai";

export const getUsers = async (req, res) => {
  try {
    const { user } = req.user;
    if (user.rol === "admin") {
      const users = await userService.getUsers();
      res.render("users", { users });
    } else {
      const message = {
        message:
          "Usted no se encuentra autorizado para realizar dicha operación",
      };
      const URI = {
        URI: "/api/products/products",
      };
      res.status(500).render("popUp", { message, URI });
    }
  } catch (error) {
    req.logger.fatal("Error al obtener los usuarios");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }

  //const result = await userService.getUsers()
};

export const getUserByID = async (req, res) => {
  const { uid } = req.params;
  const result = await userService.getUserById(uid);

  res.send({ status: "success", payload: result });
};

export const getTicketUser = async (req, res) => {
  try {
    const id = req.params.uid;
    const tickets = await userService.getTicketUserById(id);
    res.render("tickets", { tickets });
  } catch (e) {
    const message = {
      message:
        "Usted no posee tickets de compra,para verlos por favor haga primero una compra.",
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const createUsers = async (req, res) => {
  const result = await userService.createUsers(user);

  res.send({ status: "success", payload: result });
};

export const login = async (req, res) => {
  const user = req.user;

  //res.send({ status: 'success', payload: result })

  const access_token = generateToken(user);

  res
    .cookie("coderCookie", access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    })
    .send({ message: "Logged In!" });
};

export const logout = async (req, res) => {
  //const result = await userService.logout()
  res.clearCookie("coderCookie");
  return res
    .status(200)
    .send({ status: "success", payload: "Logout successful" });
};

export const register = async (req, res) => {
  //const result = await userService.createUsers()
  const user = req.user;
  res.send({ status: "success", payload: user });
};

export const deleteUserById = async (req, res) => {
  /*const uid = req.params.uid
    const result = await userService.deleteUserById(uid)*/

  try {
    const { uid } = req.params;
    const deleteUser = await userService.deleteUser(uid);
    const message = {
      message: "Usuario eliminado con exito",
    };
    const URI = {
      URI: "/api/users",
    };
    res.status(500).render("popUp", { message, URI });
  } catch (e) {
    const message = {
      message: e,
    };
    const URI = {
      URI: "/api/users",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.send({ status: "success", payload: user });
};

export const userPremium = async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDB = await userService.userPremium(uid);
    res.render("profile", userDB);
  } catch (error) {
    req.logger.fatal("Error al cambiar a usuario premium");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const uid = req.params.uid;
    const files = req.files;
    const userDB = await userService.uploadDocuments(uid, files);
    const message = {
      message: "Felicidades, sus documentos han sido subidos con éxito",
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(200).render("popUp", { message, URI });
  } catch (error) {
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const uploadDocumentView = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.user.user.email);
    const uid = user._id;
    res.status(200).render("uploadDocuments", { uid });
  } catch (e) {
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const inactiveUser = async (req, res) => {
  try {
    const userDrop = await userService.inactiveUsersDrop();
    res.status(200).send(userDrop);
  } catch (e) {
    const message = {
      message: e,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const createUser = async (req, res) => {
  const user = req.body;
  try {
    const userCreate = userService.createUser(user);
    //res.send({ status: "success", payload: userCreate });
    res.status(500).render("popUp", { message, URI });
  } catch (e) {
    req.logger.error("No se pudo crear usuario");
    handleError(config.user_not_add, res);
  }
};


export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req?.params?.email;
    const user = await userService.getUserByEmail(email);

    //res.send({ message: "Usuario encontrado", payload: user });
    res.status(500).render("popUp", { message, URI });
  } catch (error) {
    req.logger.error("No se pudo obtener usuario por email");
    handleError(config.user_not_found, res);
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);

    //res.send({ message: "Usuario encontrado", payload: user });
    res.status(500).render("popUp", { message, URI });
  } catch (error) {
    req.logger.error("No se pudo obtener usuario por id");
    handleError(config.user_not_found, res);
  }
};

export const updatedUserById = async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, email, age, password, cart, roles } = req.body;
  const updatedUser = {
    first_name,
    last_name,
    email,
    age,
    password,
    cart,
    roles,
  };

  try {
    const result = await userService.updatedUserById(userId, updatedUser);

    //res.send({ status: "Usuario actualizado exitosamente", payload: result });
    res.status(500).render("popUp", { message, URI });
  } catch (error) {
    req.logger.error("No se pudo actualizar usuario");
    handleError(config.user_not_update, res);
  }
};

export const updatedUserRole = async (req, res) => {
  const userId = req.params.id;
  const { roles } = req.body;
  const updatedRole = { roles };

  try {
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario ha cargado los documentos requeridos
    const documents = user.documents.map(doc => doc.fileType);
    const requiredDocuments = ['Identificacion', 'Domicilio', 'Estado_cuenta'];

    const hasRequiredDocuments = requiredDocuments.every(doc => documents.includes(doc));

    if (!hasRequiredDocuments) {
      return res.status(400).json({ message: 'El usuario no ha cargado todos los documentos requeridos' });
    }

    // Actualizar el rol solo si tiene los documentos requeridos
    const result = await userService.updatedUserById(userId, updatedRole);
    return res.send({ status: 'Rol actualizado exitosamente', payload: result });
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar el rol del usuario', error: error.message });
  }
};
