import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Pizza,
  X,
  RefreshCw,
} from "lucide-react";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../../api/cartService";

const PizzaCart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      setCart(cartData);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (pizzaId, pizzaType, quantity = 1) => {
    setUpdating(true);
    try {
      const updatedCart = await addToCart(pizzaId, pizzaType, quantity);
      setCart(updatedCart);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add to cart");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveFromCart = async (pizzaId, pizzaType) => {
    setUpdating(true);
    try {
      const updatedCart = await removeFromCart(pizzaId, pizzaType);
      setCart(updatedCart);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  const handleQuantityChange = async (pizzaId, pizzaType, newQuantity) => {
    if (newQuantity <= 0) {
      return handleRemoveFromCart(pizzaId, pizzaType);
    }

    setUpdating(true);
    try {
      const updatedCart = await updateCartQuantity(
        pizzaId,
        pizzaType,
        newQuantity
      );
      setCart(updatedCart);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };
  const getTotalPrice = () => {
    return cart.items.reduce(
      (total, item) => total + (item.pizzaId?.price || 0) * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const clearError = () => setError("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchCart}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                title="Refresh Cart"
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {getTotalItems()} Items
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mr-3"></div>
            <span className="text-gray-600">Loading your cart...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items
                  </h2>
                </div>

                {cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500">
                      Items you add will appear here
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {cart.items.map((item, index) => (
                      <div
                        key={`${item.pizzaType}-${item.pizzaId._id}-${index}`}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Pizza Image */}
                          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Pizza className="h-8 w-8 text-white" />
                          </div>

                          {/* Pizza Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {item.pizzaId?.name || "Unknown Pizza"}
                            </h3>
                            <p className="text-sm text-gray-500 capitalize">
                              {item.pizzaType} Pizza
                            </p>
                            <p className="text-lg font-semibold text-red-600">
                              ${(item.pizzaId?.price || 0).toFixed(2)} each
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg border">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.pizzaId._id,
                                    item.pizzaType,
                                    item.quantity - 1
                                  )
                                }
                                disabled={updating}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-12 text-center font-medium py-2 text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.pizzaId._id,
                                    item.pizzaType,
                                    item.quantity + 1
                                  )
                                }
                                disabled={updating}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-r-lg transition-colors disabled:opacity-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() =>
                                handleRemoveFromCart(
                                  item.pizzaId._id,
                                  item.pizzaType
                                )
                              }
                              disabled={updating}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Remove from cart"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              $
                              {(
                                (item.pizzaId?.price || 0) * item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border sticky top-8">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Items ({getTotalItems()})
                    </span>
                    <span className="font-medium">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ${(getTotalPrice() * 0.08).toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-red-600">
                        ${(getTotalPrice() * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {cart.items.length > 0 && (
                  <div className="p-6 border-t bg-gray-50 rounded-b-lg">
                    <button
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium text-lg transform hover:scale-105 active:scale-95 shadow-lg"
                      disabled={updating}
                    >
                      {updating ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>   
    </div>
  );
};

export default PizzaCart;
