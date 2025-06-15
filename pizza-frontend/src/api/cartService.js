// src/api/cartService.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/cart",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addToCart = async (pizzaId, pizzaType, quantity = 1) => {
  const res = await API.post("/add", { pizzaId, pizzaType, quantity });
  return res.data;
};

export const getCart = async () => {
  const res = await API.get("/");
  return res.data;
};

export const removeFromCart = async (pizzaId, pizzaType) => {
  const res = await API.post("/remove", { pizzaId, pizzaType });
  return res.data;
};

export const updateCartQuantity = async (pizzaId, pizzaType, quantity) => {
  const res = await API.post("/update", { pizzaId, pizzaType, quantity });
  return res.data;
};
