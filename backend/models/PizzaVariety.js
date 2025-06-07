const mongoose = require("mongoose");

const pizzaVarietySchema = new mongoose.Schema(
  {
    name: { type: String, required: true,},
    base: { type: String, required: true },
    sauce: { type: String, required: true },
    cheese: { type: String, required: true },
    veggies: [{ type: String }],
    meat: [{ type: String }],
    price: { type: Number, required: true },
    image: { type: String }, // Optional: URL for frontend
  },
  { timestamps: true }
);

module.exports = mongoose.model("PizzaVariety", pizzaVarietySchema);
