import TicketModel from "./models/tickets.mongo.model.js"
import ProductModel from "./models/products.mongo.model.js"

export default class Ticket {
   
    async getTicket() {
        try {
          return await ticketModel.find().lean().exec();
        } catch (error) {
          throw error;
        }
      }

      async getTicketById(id) {
        try {
          if (id) {
            return await ticketModel.findById(id).lean().exec();
          }
        } catch (error) {
          throw error;
        }
      }

   async updateTicket(id, data) {
    try {
      if ((id, data)) {
        return await ticketModel.findByIdAndUpdate(id, data);
      }
    } catch (e) {
      throw e;
    }
  }

    
    async createTicket(data) {
        try {
          if (data) return await ticketModel.create(data);
        } catch (error) {
          throw error;
        }
      }



    
}