const mongoose = require("mongoose");

const customPizzaSchema = new mongoose.Schema(
  {
    base: { type: String, required: true }, // Change from ObjectId to String
    sauce: { type: String, required: true },
    cheese: { type: String, required: true },
    veggies: [{ type: String }],
    meat: [{ type: String }],
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomPizza", customPizzaSchema);
