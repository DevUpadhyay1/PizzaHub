const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// Use 'protect' middleware
router.post("/add", protect, cartController.addToCart);
router.get("/", protect, cartController.getCart);
router.post("/remove", protect, cartController.removeItem);
router.post('/update', protect, cartController.updateQuantity);

module.exports = router;
