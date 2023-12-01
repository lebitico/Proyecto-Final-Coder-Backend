import { User, Order, Product, Cart } from '../DAO/factory.js'
import UserRepository from './users.repository.js'
import OrderRepository from './orders.repository.js'
import ProductRepository from './products.repository.js'
import CartRepository from './carts.repository.js'

export const userService = new UserRepository(new User())
export const orderService = new OrderRepository(new Order())
export const productService = new ProductRepository(new Product())
export const cartService = new CartRepository(new Cart())