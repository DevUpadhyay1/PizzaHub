const CustomPizza = require("../models/CustomPizza");
const InventoryItem = require("../models/InventoryItem");

exports.createCustomPizza = async (req, res) => {
  try {
    const { base, sauce, cheese, veggies = [], meat = [] } = req.body;

    const ingredientNames = [base, sauce, cheese, ...veggies, ...meat];

    const inventoryItems = await InventoryItem.find({
      name: { $in: ingredientNames },
      isActive: true,
    });

    // Ensure all requested items exist and are in stock
    const inventoryMap = {};
    for (let item of inventoryItems) {
      inventoryMap[item.name] = item;
    }

    for (let name of ingredientNames) {
      if (!inventoryMap[name]) {
        return res
          .status(400)
          .json({ error: `${name} is not available or inactive.` });
      }
      if (inventoryMap[name].stock <= 0) {
        return res.status(400).json({ error: `${name} is out of stock.` });
      }
    }

    // Calculate price
    const price = ingredientNames.reduce(
      (sum, name) => sum + inventoryMap[name].price,
      0
    );

    // Decrease stock for each used item
    for (let name of ingredientNames) {
      await InventoryItem.updateOne(
        { _id: inventoryMap[name]._id },
        { $inc: { stock: -1 } }
      );
    }

    // Save custom pizza
    const customPizza = new CustomPizza({
      base,
      sauce,
      cheese,
      veggies,
      meat,
      price,
    });
    const savedPizza = await customPizza.save();

    res
      .status(201)
      .json({ message: "Custom pizza created", pizza: savedPizza });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
