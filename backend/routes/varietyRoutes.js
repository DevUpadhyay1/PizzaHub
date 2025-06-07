const express = require("express");
const router = express.Router();
const {
  addPizzaVariety,
  getAllPizzaVarieties,
} = require("../controllers/varietyController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("admin"), addPizzaVariety);
router.get("/", getAllPizzaVarieties);

module.exports = router;
