export default class TicketRepository {
  constructor(ticketDao) {
    this.ticketDao = ticketDao;
  }

  createTicket= async (data)=> {
    try {
      const ticket = await this.ticketDao.createTicket(data);
      return ticket;
    } catch (error) {
      throw error;
    }
  }
  getTicket = async (limit) =>{
    try {
      return await this.ticketDao.getTicketById(limit);
     
    } catch (e) {
      throw e;
    }
  }


  getTicketById = async (id) => {
    return await this.dao.getTicketById(id);
  };

  updateTicketById = async (id, updatedTicket) => {
    return await this.dao.updateTicketById(id, updatedTicket);
  };

  deleteTicket = async (id) => {
    return await this.dao.deleteTicket(id);
  };


}
