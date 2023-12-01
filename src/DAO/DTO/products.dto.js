export default class ProductsDTO {

    constructor(product) {
        this.title = product?.title ?? ''
        this.description = product?.description ?? ''
        this.description = product?.description ?? ''
        this.price = product?.price ?? 0
        this.thumbnail = product?.thumbnail ?? [ ]    
        this.code = product?.code ?? 0
        this.stock = product?.stock ?? 0
        this.status = product?.status ?? true
        this.category = product?.category ?? 0
  
        
    }
}