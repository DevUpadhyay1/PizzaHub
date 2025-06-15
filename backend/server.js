// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const varietyRoutes = require("./routes/varietyRoutes");
const cartRoutes = require("./routes/cartRoutes");
// const Razorpay = require("razorpay");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true,
  })
);
app.use(express.json());
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/pizza", pizzaRoutes);
app.use("/api/variety", varietyRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user-dashboard", require("./routes/userDashboardRoutes"));
app.use("/api/admin-dashboard", require("./routes/adminDashboardRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("API Running");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    // Start server after DB is connected
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
