// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    pizzas: [
      {
        customPizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CustomPizza",
        },
        varietyPizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PizzaVariety",
        },
        quantity: { type: Number, default: 1 },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "preparing", "out for delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
