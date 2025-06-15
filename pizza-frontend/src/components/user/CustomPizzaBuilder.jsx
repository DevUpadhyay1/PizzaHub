import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Pizza,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const CustomPizzaBuilder = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState({
    base: "",
    sauce: "",
    cheese: "",
    veggies: [],
    meat: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [step, setStep] = useState(1);

  const fetchInventoryItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setInventoryItems(response.data);
      } else {
        console.error("Inventory data is not an array", response.data);
        setInventoryItems([]); // fallback to prevent crash
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      setInventoryItems([]); // fallback to prevent crash
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  // Calculate total price whenever selection changes
  useEffect(() => {
    if (inventoryItems.length === 0) return;

    let price = 0;
    const allSelected = [
      selectedPizza.base,
      selectedPizza.sauce,
      selectedPizza.cheese,
      ...selectedPizza.veggies,
      ...selectedPizza.meat,
    ].filter(Boolean);

    allSelected.forEach((itemName) => {
      const item = inventoryItems.find((inv) => inv.name === itemName);
      if (item) price += item.price;
    });

    setTotalPrice(price);
  }, [selectedPizza, inventoryItems]);

  const getItemsByCategory = (category) => {
    if (!Array.isArray(inventoryItems)) return [];
    return inventoryItems.filter(
      (item) => item.category === category && item.isActive && item.stock > 0
    );
  };

  const handleSingleSelect = (category, itemName) => {
    setSelectedPizza((prev) => ({
      ...prev,
      [category]: itemName,
    }));
  };

  const handleMultiSelect = (category, itemName) => {
    setSelectedPizza((prev) => {
      const currentItems = prev[category];
      const isSelected = currentItems.includes(itemName);

      return {
        ...prev,
        [category]: isSelected
          ? currentItems.filter((item) => item !== itemName)
          : [...currentItems, itemName],
      };
    });
  };
  const createCustomPizza = async () => {
    if (!selectedPizza.base || !selectedPizza.sauce || !selectedPizza.cheese) {
      setMessage("Please select base, sauce, and cheese to continue");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // 1️⃣ First create the pizza
      const pizzaResponse = await axios.post(
        "http://localhost:5000/api/pizza/custom",
        selectedPizza,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdPizza = pizzaResponse.data.pizza;

      // 2️⃣ Then add to cart using returned pizzaId
      const cartResponse = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          pizzaType: "custom",
          pizzaId: createdPizza._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Custom pizza created and added to cart!");
      setMessageType("success");

      // Reset form after a delay
      setTimeout(() => {
        setSelectedPizza({
          base: "",
          sauce: "",
          cheese: "",
          veggies: [],
          meat: [],
        });
        setStep(1);
        setMessage("");
      }, 2000);
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        error.message ||
        "Failed to create custom pizza";
      setMessage(errMsg);
      setMessageType("error");
    }

    setLoading(false);
  };

  const IngredientCard = ({ item, isSelected, onSelect, disabled = false }) => (
    <div
      onClick={() => !disabled && onSelect()}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${
          isSelected
            ? "border-orange-500 bg-orange-50 shadow-lg transform scale-105"
            : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${item.stock <= 3 ? "ring-2 ring-red-200" : ""}
      `}
    >
      {isSelected && (
        <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-orange-500" />
      )}

      <div className="text-center">
        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-orange-600 font-bold text-lg">₹{item.price}</p>
        <p
          className={`text-sm mt-1 ${
            item.stock <= 3 ? "text-red-500" : "text-gray-500"
          }`}
        >
          Stock: {item.stock}
        </p>
      </div>
    </div>
  );

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4, 5].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${
                step >= stepNum
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }
            `}
          >
            {stepNum}
          </div>
          {stepNum < 5 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step > stepNum ? "bg-orange-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Pizza className="w-12 h-12 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">
              Custom Pizza Builder
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Create your perfect pizza with fresh ingredients
          </p>
        </div>

        <StepIndicator />

        {/* Message Display */}
        {message && (
          <div
            className={`
            mb-6 p-4 rounded-lg flex items-center gap-2
            ${
              messageType === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }
          `}
          >
            {messageType === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Panel - Pizza Builder */}
          <div className="lg:col-span-3 space-y-8">
            {/* Step 1: Base Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                Choose Your Base
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {getItemsByCategory("base").map((item) => (
                  <IngredientCard
                    key={item.name}
                    item={item}
                    isSelected={selectedPizza.base === item.name}
                    onSelect={() => {
                      handleSingleSelect("base", item.name);
                      if (step === 1) setStep(2);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Step 2: Sauce Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                Pick Your Sauce
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                {getItemsByCategory("sauce").map((item) => (
                  <IngredientCard
                    key={item.name}
                    item={item}
                    isSelected={selectedPizza.sauce === item.name}
                    onSelect={() => {
                      handleSingleSelect("sauce", item.name);
                      if (step === 2) setStep(3);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Step 3: Cheese Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                Select Your Cheese
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {getItemsByCategory("cheese").map((item) => (
                  <IngredientCard
                    key={item.name}
                    item={item}
                    isSelected={selectedPizza.cheese === item.name}
                    onSelect={() => {
                      handleSingleSelect("cheese", item.name);
                      if (step === 3) setStep(4);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Step 4: Vegetable Toppings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  4
                </span>
                Add Vegetables (Optional)
              </h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getItemsByCategory("veggies").map((item) => (
                  <IngredientCard
                    key={item.name}
                    item={item}
                    isSelected={selectedPizza.veggies.includes(item.name)}
                    onSelect={() => {
                      handleMultiSelect("veggies", item.name);
                      if (step === 4) setStep(5);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Step 5: Meat Toppings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  5
                </span>
                Add Meat (Optional)
              </h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getItemsByCategory("meat").map((item) => (
                  <IngredientCard
                    key={item.name}
                    item={item}
                    isSelected={selectedPizza.meat.includes(item.name)}
                    onSelect={() => handleMultiSelect("meat", item.name)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Your Pizza
              </h3>

              <div className="space-y-3 mb-6">
                {selectedPizza.base && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium">
                      Base: {selectedPizza.base}
                    </span>
                    <span className="text-orange-600 font-bold">
                      ₹
                      {inventoryItems.find((i) => i.name === selectedPizza.base)
                        ?.price || 0}
                    </span>
                  </div>
                )}

                {selectedPizza.sauce && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium">
                      Sauce: {selectedPizza.sauce}
                    </span>
                    <span className="text-orange-600 font-bold">
                      ₹
                      {inventoryItems.find(
                        (i) => i.name === selectedPizza.sauce
                      )?.price || 0}
                    </span>
                  </div>
                )}

                {selectedPizza.cheese && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium">
                      Cheese: {selectedPizza.cheese}
                    </span>
                    <span className="text-orange-600 font-bold">
                      ₹
                      {inventoryItems.find(
                        (i) => i.name === selectedPizza.cheese
                      )?.price || 0}
                    </span>
                  </div>
                )}

                {selectedPizza.veggies.map((veggie) => (
                  <div
                    key={veggie}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span className="text-sm font-medium">{veggie}</span>
                    <span className="text-orange-600 font-bold">
                      ₹
                      {inventoryItems.find((i) => i.name === veggie)?.price ||
                        0}
                    </span>
                  </div>
                ))}

                {selectedPizza.meat.map((meat) => (
                  <div
                    key={meat}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span className="text-sm font-medium">{meat}</span>
                    <span className="text-orange-600 font-bold">
                      ₹{inventoryItems.find((i) => i.name === meat)?.price || 0}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              <button
                onClick={createCustomPizza}
                disabled={
                  loading ||
                  !selectedPizza.base ||
                  !selectedPizza.sauce ||
                  !selectedPizza.cheese
                }
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 text-lg"
              >
                {loading ? "Creating Pizza..." : `Add to Cart - ₹${totalPrice}`}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Base, sauce, and cheese are required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPizzaBuilder;
