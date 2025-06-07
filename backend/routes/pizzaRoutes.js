// routes/customPizzaRoutes.js
const express = require("express");
const router = express.Router();
const { createCustomPizza } = require("../controllers/pizzaController");
const { createOrder } = require("../controllers/orderController");

router.post("/custom", createCustomPizza);

module.exports = router;
