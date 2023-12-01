import TicketModel from "./models/tickets.mongo.model.js"
import ProductModel from "./models/products.mongo.model.js"

export default class Ticket {
   
    getTicket = async () => { return await TicketModel.find() }
    getTicketById = async (id) => { return await TicketModel.findOne({ _id: id }) }
    getNextId = (list) => {
        return (list.length == 0) ? 1 : list[list.length - 1].id + 1
    }

    
    createTickets = async (totalamount, userMail) => { 
        const list = await this.getTicket()
        const options = { timeZone: 'America/Argentina/Buenos_Aires' };
        const argentinaDate  =new Date().toLocaleString('en-US', options);  
       
        const ticket= {
            purchase_datetime : argentinaDate,
            code : this.getNextId(list),
            amount: totalamount,
            purchaser: userMail,
        }
            return await TicketModel.create(ticket)
    } 



    
}