import FileManager from "./file.manager.js"

export default class Product extends FileManager {
    constructor(filename = './db.product.json') {
        super(filename)
    }

    getProducts = async (query = {}) => { return await this.get(query) }
    getProductById = async (id) => { return await this.getById(id) }
    createProduct = async (product) => { return await this.set(product) }
    updateProduct = async (id, product) => {
        product.id = id
        return await this.update(product)
    }
    deleteProducts = async (id, product) => {
        product.id = id
        return await this.delete(product)
    }
}