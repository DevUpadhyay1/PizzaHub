const PizzaVariety = require("../models/PizzaVariety");

// Get all available pizza varieties for user dashboard
exports.getAvailablePizzas = async (req, res) => {
  try {
    const pizzas = await PizzaVariety.find({ stock: { $gt: 0 } });

    res.status(200).json({
      message:
        pizzas.length === 0
          ? "No pizzas available right now"
          : "Pizzas fetched successfully",
      pizzas, // ← always return an object with key `pizzas`
    });
  } catch (err) {
    console.error("Error fetching pizza varieties:", err);
    res.status(500).json({ message: "Failed to load pizzas" });
  }
};
