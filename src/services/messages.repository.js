import MessageDto from "../DAO/DTO/messages.dto.js"

export default class MessageRepository {
  constructor(messageDAO) {
    this.messageDAO = messageDAO;
  }
  async saveMessage(data) {
    try {
      const message = await this.messageDAO.saveMessage(data);
      return new MessageDto(message);
    } catch (error) {
      throw error;
    }
  }
  async getMessages() {
    try {
      const messages = await this.messageDAO.getMessages();
      return messages;
    } catch (error) {
      throw error;
    }
  }
}