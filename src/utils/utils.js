import { faker } from "@faker-js/faker";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from "bcrypt";
import { config } from "dotenv";
config();

import jwt from "jsonwebtoken";
import passport from "passport";

import multer from "multer";


export const generateUser = () => {
  const numOfProducts = faker.number.int({ max: 10 });

  const products = [];
  for (let i = 0; i < numOfProducts; i++) {
    products.push(generateProduct());
  }

  return {
    name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    birthDate: faker.date.birthdate(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    sex: faker.person.sex(),
    products,
  };
};

const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    category: faker.commerce.department(),
    stock: faker.number.int({ max: 100 }),
    id: faker.database.mongodbObjectId(),
    image: faker.image.urlLoremFlickr(),
  };
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password); // true o false
};

export const generateToken = (user) => {
  jwt.sign({ user }, "secretForJWT", process.env.PRIVATE_KEY, {
    expiresIn: "24h",
  });
};

export const generateTokenPass = (user) => {
  return jwt.sign({ user }, config.secret_jwt, { expiresIn: "12h" });
};

export const extractCookie = (req) => {
  return req && req.cookies ? req.cookies[config.SECRET_COOKIE] : null;
};

export const authorization = (rol) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).send({ error: "Unauthorized" });
    if (user.user.rol != rol)
      return res.status(403).send({ error: "No permission" });
    return next();
  };
};

export const generateProducts = () => {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    departament: faker.commerce.department(),
    stock: faker.number.int({min: 1}),
    id: faker.database.mongodbObjectId(),
    image: faker.image.avatar(),
  };
};

export const extractNonSensitiveUserInfo = (req, res, next) => {
  if (req.user) {
    const { first_name, last_name, email, age, cart } = req.user.user;
    req.nonSensitiveUserInfo = { first_name, last_name, email, age, cart };
  }
  next();
};



export default __dirname;
