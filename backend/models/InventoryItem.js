// models/InventoryItem.js

const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["base", "sauce", "cheese", "veggies", "meat"],
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    threshold: { type: Number, default: 20 },
    unit: { type: String, default: "pcs" },
    isActive: { type: Boolean, default: true },

    // 🔽 New field for image URL
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
