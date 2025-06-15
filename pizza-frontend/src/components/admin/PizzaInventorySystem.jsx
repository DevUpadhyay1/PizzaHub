import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  AlertTriangle,
  Save,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  IndianRupee,
} from "lucide-react";

// Axios configuration for API calls
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/inventory",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const PizzaInventorySystem = () => {
  // State management
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    category: "base",
    name: "",
    price: "",
    stock: "",
    threshold: "20",
    unit: "pcs",
    photo: "",
    isActive: true,
  });

  const categories = [
    { value: "all", label: "All Categories", icon: "🍕" },
    { value: "base", label: "Pizza Base", icon: "🥖" },
    { value: "sauce", label: "Sauce", icon: "🍅" },
    { value: "cheese", label: "Cheese", icon: "🧀" },
    { value: "veggies", label: "Vegetables", icon: "🥬" },
    { value: "meat", label: "Meat", icon: "🥓" },
  ];

  const units = ["pcs", "kg", "bottles", "packets", "liters"];

  // Fetch inventory items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      // Handle authentication errors
      if (error.response?.status === 401) {
        // Redirect to login or refresh token
        console.log("Authentication required");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter items based on search and category
  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (showLowStock) {
      filtered = filtered.filter((item) => item.stock <= item.threshold);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, showLowStock]);

  // Load data on component mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        threshold: parseInt(formData.threshold),
      };

      if (showEditModal && currentItem) {
        await api.put(`/${currentItem._id}`, data);
      } else {
        await api.post("/", data);
      }

      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      // Handle specific errors
      if (error.response?.status === 401) {
        console.log("Authentication required");
      } else if (error.response?.status === 400) {
        console.log("Invalid data provided");
      }
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/${id}`);
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
        if (error.response?.status === 401) {
          console.log("Authentication required");
        } else if (error.response?.status === 404) {
          console.log("Item not found");
        }
      }
    }
  };

  // Handle stock update
  const handleStockUpdate = async (id, newStock) => {
    try {
      await api.patch(`/${id}/stock`, { stock: newStock });
      fetchItems();
    } catch (error) {
      console.error("Error updating stock:", error);
      if (error.response?.status === 401) {
        console.log("Authentication required");
      } else if (error.response?.status === 404) {
        console.log("Item not found");
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      category: "base",
      name: "",
      price: "",
      stock: "",
      threshold: "20",
      unit: "pcs",
      photo: "",
      isActive: true,
    });
    setShowAddModal(false);
    setShowEditModal(false);
    setCurrentItem(null);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      category: item.category,
      name: item.name,
      price: item.price.toString(),
      stock: item.stock.toString(),
      threshold: item.threshold.toString(),
      unit: item.unit,
      photo: item.photo || "",
      isActive: item.isActive,
    });
    setShowEditModal(true);
  };

  // Get stock status
  const getStockStatus = (item) => {
    if (item.stock <= item.threshold) {
      return {
        status: "low",
        color: "text-red-600 bg-red-50",
        text: "Low Stock",
      };
    } else if (item.stock <= item.threshold * 2) {
      return {
        status: "medium",
        color: "text-yellow-600 bg-yellow-50",
        text: "Medium",
      };
    }
    return {
      status: "good",
      color: "text-green-600 bg-green-50",
      text: "Good",
    };
  };

  // Calculate summary stats
  const totalItems = items.length;
  const lowStockItems = items.filter(
    (item) => item.stock <= item.threshold
  ).length;
  const totalValue = items.reduce(
    (sum, item) => sum + item.price * item.stock,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pizza Inventory Management
          </h1>
          <p className="text-gray-600">
            Track and manage your pizza ingredients efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {lowStockItems}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalValue.toFixed(2)}
                </p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-48"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLowStock(!showLowStock)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                  showLowStock
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {showLowStock ? <EyeOff size={20} /> : <Eye size={20} />}
                {showLowStock ? "Show All" : "Low Stock"}
              </button>

              <button
                onClick={fetchItems}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw size={20} />
                Refresh
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const stockStatus = getStockStatus(item);
              const categoryInfo = categories.find(
                (cat) => cat.value === item.category
              );

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{categoryInfo?.icon}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                    >
                      {stockStatus.text}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1 capitalize">
                    {item.category}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mb-3">
                    ₹{item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Stock:</span>
                    <span className="font-medium">
                      {item.stock} {item.unit}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modals */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {showEditModal ? "Edit Item" : "Add New Item"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    >
                      {categories.slice(1).map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Threshold
                      </label>
                      <input
                        type="number"
                        value={formData.threshold}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            threshold: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        {units.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.photo}
                      onChange={(e) =>
                        setFormData({ ...formData, photo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save size={16} />
                      {showEditModal ? "Update" : "Add"} Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzaInventorySystem;
