import ProductDTO from "../DAO/DTO/products.dto.js";

export default class ProductRepository {

    constructor(dao) {
        this.dao = dao
    }

    getProducts = async () => { return await this.dao.getProducts() }
    getProductById = async(pid) => { return await this.dao.getProductById(pid) }
    createProducts = async(product) => { 
        const productToInsert = new ProductDTO(product)
        return await this.dao.createProduct(productToInsert)
    }
    updateProducts = async (pid, productUpdate) => {
        const product = this.getProductById(pid)
        if (!product) {
            throw new Error("no existe el producto");
          }
        
        return await this.dao.updateProduct(pid, productUpdate)
    }
    deleteProducts = async (pid) => {
        const product = this.getProductById(pid)
        if (!product) {
            throw new Error("no existe el producto");
          }
        
        return await this.dao.deleteProducts(pid, product)

    }
}