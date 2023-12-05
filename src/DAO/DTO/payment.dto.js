export default class PaymentDTO {

    constructor(payment) {
        this.title = payment?.title ?? ''
        this.description = payment?.description ?? ''
        this.description = payment?.description ?? ''
        this.price = payment?.price ?? 0
        this.thumbnail = payment?.thumbnail ?? [ ]    
        this.code = payment?.code ?? 0
        this.stock = payment?.stock ?? 0
        this.status = payment?.status ?? true
        this.category = payment?.category ?? 0
        
    }
}