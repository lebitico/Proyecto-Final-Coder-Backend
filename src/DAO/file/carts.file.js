import FileManager from "./file.manager.js"

export default class Cart extends FileManager {
    constructor(filename = './db.carts.json') {
        super(filename)
    }

    getCarts = async (query = {}) => { return await this.get(query) }
    getCartById = async (id) => { return await this.getById(id) }
    createCart = async (cart) => { return await this.add(cart) }
    updateCart = async (id, cart) => {
        cart.id = id
        return await this.update(cart)
    }
}