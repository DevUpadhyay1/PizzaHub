const Cart = require("../models/Cart");
const CustomPizza = require("../models/CustomPizza");
const PizzaVariety = require("../models/PizzaVariety");

exports.addToCart = async (req, res) => {
  const { pizzaType, pizzaId, quantity } = req.body;
  const userId = req.user._id;

  try {
    if (pizzaType === "custom") {
      const exists = await CustomPizza.findById(pizzaId);
      if (!exists)
        return res.status(404).json({ error: "Custom pizza not found" });
    } else if (pizzaType === "variety") {
      const exists = await PizzaVariety.findById(pizzaId);
      if (!exists)
        return res.status(404).json({ error: "Pizza variety not found" });
    } else {
      return res.status(400).json({ error: "Invalid pizza type" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ pizzaType, pizzaId, quantity }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) =>
          item.pizzaType === pizzaType && item.pizzaId.toString() === pizzaId
      );

      if (index >= 0) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ pizzaType, pizzaId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.json({ items: [] });

    // Manually populate items
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const model = item.pizzaType === "custom" ? CustomPizza : PizzaVariety;
        const pizza = await model.findById(item.pizzaId);
        return {
          ...item.toObject(),
          pizzaId: pizza,
        };
      })
    );

    res.json({ ...cart.toObject(), items: populatedItems });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.removeItem = async (req, res) => {
  const { pizzaType, pizzaId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(item.pizzaType === pizzaType && item.pizzaId.toString() === pizzaId)
    );

    await cart.save();

    // ✅ Populate the cart items before responding
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const model = item.pizzaType === "custom" ? CustomPizza : PizzaVariety;
        const pizza = await model.findById(item.pizzaId);
        return {
          ...item.toObject(),
          pizzaId: pizza,
        };
      })
    );

    res.json({ ...cart.toObject(), items: populatedItems }); // ✅ Send populated data
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateQuantity = async (req, res) => {
  const { pizzaType, pizzaId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.pizzaType === pizzaType && item.pizzaId.toString() === pizzaId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1); // remove item if qty <= 0
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // Populate before sending
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const model = item.pizzaType === "custom" ? CustomPizza : PizzaVariety;
        const pizza = await model.findById(item.pizzaId);
        return {
          ...item.toObject(),
          pizzaId: pizza,
        };
      })
    );

    res.json({ ...cart.toObject(), items: populatedItems });
  } catch (err) {
    console.error("Update cart quantity error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controllers/cartController.js
exports.addCustomPizzaToCart = async (req, res) => {
  const userId = req.user.id;
  const pizza = req.body;

  try {
    const cartItem = await Cart.create({
      user: userId,
      pizza: {
        ...pizza,
        isCustom: true,
      },
    });

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: "Error adding custom pizza to cart" });
  }
};
