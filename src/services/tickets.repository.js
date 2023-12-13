export default class TicketRepository {
  constructor(ticketDao) {
    this.ticketDao = ticketDao;
  }

  async createTicket(data) {
    try {
      const ticket = await this.ticketDao.createTicket(data);
      return ticket;
    } catch (error) {
      throw error;
    }
  }
  async getTicket(id) {
    try {
      const ticket = await this.ticketDao.getTicketById(id);
      return ticket;
    } catch (e) {
      throw e;
    }
  }
}
