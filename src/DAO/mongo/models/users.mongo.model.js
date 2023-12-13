import mongoose from "mongoose";

const UserModel = mongoose.model(
  "users",
  new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    rol: {
      type: String,
      enum: ["user", "admin", "premium"],
      default: "user",
    },
    password: String,
    orders: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "orders",
      },
    ],
    cartid: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "carts",
    },
    status: {
      type: "String",
      enum: ["verified", "not verified"],
      default: "not verified",
    },
    verificationCode: String,
    documents: [
      {
        name: String,
        reference: String,
      },
    ],
    last_connection: {
      type: Date,
      default: null,
    },
    ticketId: [
      {
        tic: { type: mongoose.Schema.Types.ObjectId, ref: "tickets" },
      },
    ],
  })
);

export default UserModel;