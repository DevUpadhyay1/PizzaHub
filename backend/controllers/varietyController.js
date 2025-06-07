const PizzaVariety = require("../models/PizzaVariety");
const InventoryItem = require("../models/InventoryItem");

exports.addPizzaVariety = async (req, res) => {
  try {
    const {
      name,
      base,
      sauce,
      cheese,
      veggies = [],
      meat = [],
      price,
      image,
    } = req.body;

    // Combine all ingredients into one array
    const allIngredients = [
      { name: base, category: "base" },
      { name: sauce, category: "sauce" },
      { name: cheese, category: "cheese" },
      ...veggies.map((v) => ({ name: v, category: "veggies" })),
      ...meat.map((m) => ({ name: m, category: "meat" })),
    ];

    // Check each ingredient's availability
    const unavailableItems = [];

    for (const item of allIngredients) {
      const inventoryItem = await InventoryItem.findOne({
        name: item.name,
        category: item.category,
        isActive: true,
      });

      if (!inventoryItem || inventoryItem.stock <= 0) {
        unavailableItems.push(`${item.name} (${item.category})`);
      }
    }

    if (unavailableItems.length > 0) {
      return res.status(400).json({
        error: "Pizza cannot be created due to insufficient stock of:",
        unavailableItems,
      });
    }

    // All ingredients are in stock, proceed to save
    const pizza = new PizzaVariety({
      name,
      base,
      sauce,
      cheese,
      veggies,
      meat,
      price,
      image,
    });

    const saved = await pizza.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.getAllPizzaVarieties = async (req, res) => {
  try {
    const pizzas = await PizzaVariety.find();
    res.status(200).json(pizzas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
