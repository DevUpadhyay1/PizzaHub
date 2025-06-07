const express = require("express");
const router = express.Router();
const {
  getAvailablePizzas,
} = require("../controllers/userDashboardController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Route to get all available pizza varieties for users
router.get("/dashboard", protect, authorizeRoles("user"), getAvailablePizzas);

module.exports = router;
//
