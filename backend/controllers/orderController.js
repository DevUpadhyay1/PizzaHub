const Order = require("../models/OrderItem");
const CustomPizza = require("../models/CustomPizza");
const PizzaVariety = require("../models/PizzaVariety");

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // Expecting array of { customPizzaId | varietyPizzaId, quantity }

    const pizzas = [];

    for (const item of items) {
      if (item.customPizzaId) {
        const customPizza = await CustomPizza.findById(item.customPizzaId);
        if (!customPizza) throw new Error("Custom pizza not found");

        pizzas.push({
          customPizza: customPizza._id,
          quantity: item.quantity || 1,
        });
      } else if (item.varietyPizzaId) {
        const varietyPizza = await PizzaVariety.findById(item.varietyPizzaId);
        if (!varietyPizza) throw new Error("Variety pizza not found");

        pizzas.push({
          varietyPizza: varietyPizza._id,
          quantity: item.quantity || 1,
        });
      } else {
        throw new Error(
          "Each item must have either customPizzaId or varietyPizzaId"
        );
      }
    }

    const order = await Order.create({
      user: req.user._id,
      pizzas,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "email")
      .populate("pizzas.customPizza")
      .populate("pizzas.varietyPizza");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "email")
      .populate("pizzas.customPizza")
      .populate("pizzas.varietyPizza");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
