import mongoose from "mongoose";

const MessagesModel = mongoose.model('messages', new mongoose.Schema({
    user: String,
    message: String,
    hour: String
}))

export default MessagesModel