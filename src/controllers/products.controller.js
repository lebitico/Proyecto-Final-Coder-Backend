import {
  productService,
  categoryService,
  userService,
} from "../services/index.js";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";
import { generateCartErrorInfo } from "../utils/errors/info.js";

export const getProducts = async (req, res) => {
  try {
    const { user } = req.user;
    const userDB = await userService.getUserByEmail(user.email);
    const first_name = userDB.first_name;
    const last_name = userDB.last_name;
    const rol = userDB.rol;
    const page = parseInt(req.query.page) || 10;
    const limit = parseInt(req.query.limit) || 10;
    const queryParams = req.query.query || "";
    const sort = parseInt(req.query.sort);
    let products;
    if (page || limit || queryParams || sort) {
      products = await productRepository.getProductsPaginate(
        page,
        limit,
        queryParams,
        sort
      );
    } else {
      products = await productService.getProducts();
    }
    const category = await categoryService.getCategorys();
    const productsPrev = products.productsPrev;
    const productsNext = products.productsNext;
    const productsPrevValidate = products.paginaAnterior;
    const productsNextValidate = products.paginaSiguiente;
    products = products.productsPaginate;
    console.log(products)
    res.render("home", {
      products,
      category,
      last_name,
      first_name,
      rol,
      productsPrev,
      productsNext,
      productsPrevValidate,
      productsNextValidate,
    });
  } catch (error) {
    req.logger.fatal("Error al obtener los productos");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const getProductByID = async (req, res) => {
  /*const  pid  = req.params.pid
    const result = await productService.getProductById(pid)

    res.send({ status: 'success', payload: result })*/

  try {
    const product = await productRepository.getProductById(req.params.pid);
    res.status(200).json(product);
  } catch (error) {
    req.logger.fatal("Error al obtener el producto");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const createProducts = async (req, res) => {
  try {
    const product = req.body;

    const result = await productService.createProducts(product);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", payload: error.message });
  }
};

export const updateProducts = async (req, res) => {
  /*try {
        const pid = req.params.pid
        const product = req.body
        const result = await productService.updateProducts(pid, product)
        res.send({ status: 'success', payload: result })*/
  try {
    const product = await productRepository.updateProduct(
      req.params.pid,
      req.body
    );
    res.status(200).json(product);
  } catch (error) {
    req.logger.fatal("Error al actualizar el producto");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const product = await productRepository.deleteProduct(
      req.params.pid,
      req.user.user.email
    );
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    req.logger.fatal("Error al eliminar el producto");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const getProductsRealTime = async (req, res) => {
  try {
    const { user } = req.user;
    const userDB = await userService.getUserByEmail(user.email);
    const first_name = userDB.first_name;
    const last_name = userDB.last_name;
    const rol = userDB.rol;
    const page = parseInt(req.query.page) || 10;
    const limit = parseInt(req.query.limit) || 10;
    const queryParams = req.query.query || "";
    const sort = parseInt(req.query.sort);
    let products;
    if (page || limit || queryParams || sort) {
      products = await productRepository.getProductsPaginate(
        page,
        limit,
        queryParams,
        sort
      );
    } else {
      products = await productRepository.getProducts();
    }
    const category = await categoryService.getCategorys();
    if (userDB.rol === "admin" || userDB.rol === "premium") {
      const productsPrev = products.productsPrev;
      const productsNext = products.productsNext;
      const productsPrevValidate = products.paginaAnterior;
      const productsNextValidate = products.paginaSiguiente;
      products = products.productsPaginate;
      res.render("realtimeproducts", {
        products,
        category,
        last_name,
        first_name,
        rol,
        productsPrev,
        productsNext,
        productsPrevValidate,
        productsNextValidate,
      });
    } else {
      throw CustomError.createError({
        name: "Error",
        message: "not authorized",
        code: EErrors.CART_NOT_FOUND,
        info: generateCartErrorInfo(),
      });
    }
  } catch (error) {
    req.logger.fatal("Error al obtener los productos");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const addProduct = async (req, res) => {
  try {
    const product = await productRepository.addProduct(req.body);
    res.status(201).send(product);
  } catch (error) {
    req.logger.fatal("Error al agregar el producto");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const getProductsPaginate = async (req, res) => {
  try {
    const products = await productRepository.getProductsPaginate(
      req.query.page,
      req.query.limit,
      req.query,
      req.query.sort
    );
    res.status(200).json(products);
  } catch (error) {
    req.logger.fatal("Error al obtener los productos");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const getProductsLimit = async (req, res) => {
  try {
    const products = await productRepository.getProductsLimit(req.query.limit);
    req.logger.error("Error al obtener los productos");
    res.status(200).json(products);
  } catch (error) {
    req.logger.fatal("Error al obtener los productos");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/products/products",
    };
    res.status(500).render("popUp", { message, URI });
  }
};
