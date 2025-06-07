const Order = require('../models/OrderItem');
const InventoryItem = require('../models/InventoryItem');
const User = require('../models/User');

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const inventory = await InventoryItem.find();

    res.json({ totalOrders, totalUsers, inventory });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
