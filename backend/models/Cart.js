const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  pizzaType: {
    type: String,
    enum: ["custom", "variety"],
    required: true,
  },
  pizzaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "items.pizzaType", 
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
