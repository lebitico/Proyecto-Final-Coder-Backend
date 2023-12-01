import mongoose from "mongoose";

const UserModel = mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    rol: String,
    password: String,
    orders: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'orders'
        }
    ],
    cartid: 
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'carts'
        },
}))

export default UserModel