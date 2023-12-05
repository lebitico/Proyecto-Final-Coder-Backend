import PaymentModel from "./models/payments.mongo.model.js"

export default class Payment {
    getPayments = async () => { return await PaymentModel.find() }
    getPaymentById = async (id) => { return await PaymentModel.findOne({ _id: id }) }
    createPayment = async (payment) => { return await PaymentModel.create(payment) }
    updatePayment = async (id, payment) => {
        return await PaymentModel.updateOne({ _id: id }, { $set: payment })
    }
    deletePayments = async (id) => {
        return await PaymentModel.deleteOne({ _id: id })
    }
}