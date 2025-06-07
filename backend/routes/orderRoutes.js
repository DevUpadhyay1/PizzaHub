const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.createOrder);
router.get('/myorders', protect, orderController.getUserOrders);
router.get('/all', protect, authorizeRoles('admin'), orderController.getAllOrders);
router.put('/:id/status', protect, authorizeRoles('admin'), orderController.updateOrderStatus);

module.exports = router;
