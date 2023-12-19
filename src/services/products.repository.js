import ProductDTO from "../DAO/DTO/products.dto.js";
//import CustomError from "../utils/errors/CustomError.js";
//import EErrors from "../utils/errors/enums.js";
//import { generateProductsErrorInfo } from "../utils/errors/info.js";
//import nodemailer from "nodemailer";
//import config from "../config/config.js";

export default class ProductRepository {
  constructor(productDAO, userDAO) {
    this.productDAO = productDAO;
    this.userDAO = userDAO;
  }

  getProducts = async (limit) => {
    return await this.productDAO.getProducts(limit);
   /* try {
      const products = await this.productDAO.getProducts();
      return products.map((product) => new ProductDTO(product));
    } catch (error) {
      throw error;
    }*/
  };

  //return await this.dao.getProducts() }
  getProductById = async (pid) => {
    //try {
      return await this.productDAO.getProductById(id);
    /*  return product;
    } catch (error) {
      throw error;
    }*/
    //return await this.dao.getProductById(pid) }
  };
  addProduct = async (data) => {
    return await this.productDAO.addProducts(data);
  
    /*try {
      const productExist = await this.productDAO.getProductByCode(data.code);
      if (productExist) {
        CustomError.createError({
          name: "Error",
          message: "Product already exists",
          code: EErrors.PRODUCT_ALREADY_EXISTS,
          info: generateProductsErrorInfo(productExist),
        });
      }
      const owner = data.owner;
      const user = await this.userDAO.getUserByEmail(owner);
      if (!user) {
        return CustomError.createError({
          name: "Error",
          message: "User not found",
          code: EErrors.USER_NOT_FOUND,
          info: generateProductsErrorInfo(user),
        });
      }

      if (user.rol === "admin" || user.rol === "premium") {
        const product = await this.productDAO.addProduct(data);
        return product;
      } else {
        return CustomError.createError({
          name: "Error",
          message: "User not authorized",
          code: EErrors.USER_NOT_AUTHORIZED,
          info: generateProductsErrorInfo(user),
        });
      }
    } catch (error) {
      throw error;
    }*/
  };

  createProducts = async (product) => {
    const productToInsert = new ProductDTO(product);
    return await this.dao.createProduct(productToInsert);
  };
  updateProducts = async (id, updatedProduct) => {
    return await this.productDAO.updateProduct(id, updatedProduct);
    /*
    try {
      const product = await this.productDAO.updateProduct(id, data);
      return product;
    } catch (error) {
      throw error;
    } */
    /*const product = this.getProductById(pid)
        if (!product) {
            throw new Error("no existe el producto");
          }
        
        return await this.dao.updateProduct(pid, productUpdate)*/
  };
  deleteProducts = async (pid) => {
    return await this.dao.deleteProduct(pid);
    /* const product = this.getProductById(pid)
        if (!product) {
            throw new Error("no existe el producto");
          }
        
        return await this.dao.deleteProducts(pid, product)
    try {
      const user = await this.userDAO.getUserByEmail(email);
      if (user.rol === "admin") {
        const producto = await this.productDAO.getProductById(id);
        if (producto.owner !== "admin") {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: config.USER,
              pass: config.PASS,
            },
          });
          const mailOptions = {
            to: producto.owner,
            subject:
              "Tu producto ha sido eliminado por no cumplir con nuestras normas",
            text: `El producto ${producto.title} ${producto.descripcion} ha sido eliminado. Contactarse con el servicio tecnico.`,
          };
          await transporter.sendMail(mailOptions);
        }
        const product = await this.productDAO.deleteProduct(id);
        return "product deleted";
      }
      const products = this.productDAO.getProductById(id);
      if (products.owner === email) {
        const product = await this.productDAO.deleteProduct(id);
        return "product deleted";
      }
      throw "El mail que proporcionó no posee permisos para eliminar productos,ingrese uno válido.";
    } catch (error) {
      throw error;
    }*/
  };

  getProductsPaginate = async (page, limit, queryParams, sort) => {
    try {
      const products = await this.productDAO.getProductsPaginate(
        page,
        limit,
        queryParams,
        sort
      );
      const productsPrev = products.productsPrev;
      const productsNext = products.productsNext;
      const parametrosAnterior = new URLSearchParams(productsPrev);
      const paginaAnterior = parametrosAnterior.get("page");
      const parametrosPosterior = new URLSearchParams(productsNext);
      const paginaSiguiente = parametrosPosterior.get("page");
      let productsPaginate = products.productsPaginate;
      productsPaginate = productsPaginate.filter(
        (product) => product.stock > 0
      );
      return {
        productsPaginate,
        productsPrev,
        productsNext,
        paginaAnterior,
        paginaSiguiente,
      };
    } catch (e) {
      throw e;
    }
  };

  getProductsLimit = async (limit) => {
    try {
      const products = await this.productDAO.getProductsLimit(limit);
      return products.map((product) => new ProductDTO(product));
    } catch (error) {
      throw error;
    }
  };
}
