// controllers/inventoryController.js

const InventoryItem = require('../models/InventoryItem');

// Add a new inventory item
exports.addItem = async (req, res) => {
  try {
    const { category, name, price, stock = 0, photo } = req.body;

    if (!category || !name || price === undefined) {
      return res.status(400).json({ error: 'Category, name and price are required' });
    }

    const newItem = new InventoryItem({
      category,
      name,
      price,
      stock,
      photo,
    });

    await newItem.save();
    res.status(201).json({ message: 'Inventory item added successfully', item: newItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add inventory item', details: err.message });
  }
};

// Get all inventory items (optionally filter by category)
exports.getItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const items = await InventoryItem.find(filter).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory items', details: err.message });
  }
};

// Update an existing inventory item by ID (supports partial updates)
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.status(200).json({ message: 'Inventory item updated successfully', item: updatedItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inventory item', details: err.message });
  }
};

// Delete an inventory item by ID
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inventory item', details: err.message });
  }
};

// Update stock of an inventory item by ID
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Valid stock number is required and must be >= 0' });
    }

    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.status(200).json({ message: 'Stock updated successfully', item: updatedItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stock', details: err.message });
  }
};

// Bulk update stock by category (e.g., set stock=5 for all "base" items)
exports.updateStockByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { stock } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    if (stock === undefined || typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Valid stock number is required and must be >= 0' });
    }

    const result = await InventoryItem.updateMany({ category }, { stock });

    res.status(200).json({
      message: `Stock updated to ${stock} for category '${category}'`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stock by category', details: err.message });
  }
};
