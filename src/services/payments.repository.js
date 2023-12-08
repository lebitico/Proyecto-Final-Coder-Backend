import PaymentDTO from "../DAO/DTO/payment.dto.js";

export default class PaymentRepository {

    constructor(dao) {
        this.dao = dao
    }

    getPayments = async () => { return await this.dao.getPayment() }
    getPaymentById = async(payid) => { return await this.dao.getPaymentById(payid) }
    createPayment = async(payment) => { 
        return await this.dao.createPayment(paymentToInsert)
    }
    updatePayments = async (payid, paymentUpdate) => {
       
    }
    deletePayments = async (payid) => {
       
    }
}