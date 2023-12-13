import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const TicketModel = mongoose.model(
  "tickets",
  new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purcharser: {
      type: String,
      required: true,
    },
    products: [
      {
        pid: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: Number,
      },
    ],
    status: String,
  })
);

export default TicketModel;
