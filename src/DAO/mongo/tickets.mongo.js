import TicketModel from "./models/tickets.mongo.model.js";

export default class Ticket {
  async getTicket() {
    try {
      return await TicketModel.find().lean().exec();
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(id) {
    try {
      if (id) {
        return await TicketModel.findById(id)
          .populate("products.pid")
          .lean()
          .exec();
      }
    } catch (error) {
      throw error;
    }
  }

  async updateTicket(id, data) {
    try {
      if ((id, data)) {
        return await TicketModel.findByIdAndUpdate(id, data);
      }
    } catch (e) {
      throw e;
    }
  }

  async createTicket(data) {
    try {
      if (data) return await TicketModel.create(data);
    } catch (error) {
      throw error;
    }
  }

  async addTicket(data) {
    try {
      if (data) return await TicketModel.create(data);
    } catch (error) {
      throw error;
    }
  }
}
