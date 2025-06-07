const express = require('express');
const router = express.Router();

const {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  updateStock,
  updateStockByCategory,
} = require('../controllers/inventoryController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 🔐 Admin-only routes
router.post('/', protect, authorizeRoles('admin'), addItem);
router.put('/:id', protect, authorizeRoles('admin'), updateItem);
router.delete('/:id', protect, authorizeRoles('admin'), deleteItem);
router.patch('/:id/stock', protect, authorizeRoles('admin'), updateStock);
router.patch('/category/:category/stock', protect, authorizeRoles('admin'), updateStockByCategory);

// 🔓 Accessible to all authenticated users
router.get('/', protect, getItems);

module.exports = router;
