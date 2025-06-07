const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controllers/adminDashboardController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/adashboard', protect, authorizeRoles('admin'), getAdminDashboard);

module.exports = router;
