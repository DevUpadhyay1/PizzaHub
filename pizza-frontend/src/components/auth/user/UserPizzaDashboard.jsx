import React, { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Pizza,
  ChefHat,
  Home,
  Menu,
  X,
  Heart,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Package,
} from "lucide-react";
import { debounce } from "lodash";

// Mock navigation hook (replace with actual useNavigate from react-router-dom)
const useNavigate = () => {
  return (path) => {
    console.log(`Navigating to: ${path}`);
    // In real app: navigate(path);
  };
};

// API service
const api = {
  getPizzas: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get("http://localhost:5000/api/variety/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

const debouncedSearch = useCallback(
  debounce((value) => {
    setSearchTerm(value);
  }, 300),
  []
);

const handleInputChange = (e) => {
  const value = e.target.value;
  setDisplayValue(value); // Update display immediately
  debouncedSearch(value); // Update search with delay
};

const UserPizzaDashboard = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const loadPizzas = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getPizzas();
      console.log("API response:", data); // ✅ check this
      setPizzas(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load available pizzas. Please login or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPizzas();
  }, []);
  const categories = [
    "All",
    ...new Set((Array.isArray(pizzas) ? pizzas : []).map((p) => p.category)),
  ];
  const filteredPizzas = useMemo(() => {
    if (!Array.isArray(pizzas)) return [];

    return pizzas.filter((pizza) => {
      const matchesSearch = pizza.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || pizza.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [pizzas, searchTerm, selectedCategory]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (pizza) => {
    console.log("Adding to cart:", pizza);
    navigate("/cart");
  };

  const Header = () => (
    <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Pizza className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Pizza Palace</h1>
              <p className="text-xs text-red-100">Fresh & Delicious</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-white/10 hover:shadow-lg"
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </button>
            <button
              onClick={() => navigate("/custom-pizza")}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-white/10 hover:shadow-lg"
            >
              <ChefHat className="h-4 w-4" />
              <span className="font-medium">Custom Pizza</span>
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-white/10 hover:shadow-lg"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-medium">Cart</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-white/20 mt-4 pt-4">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-left"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </button>
              <button
                onClick={() => {
                  navigate("/custom-pizza");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-left"
              >
                <ChefHat className="h-5 w-5" />
                <span className="font-medium">Custom Pizza</span>
              </button>
              <button
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-left"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">Cart</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );

  const SearchAndFilter = () => (
    // <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
    //   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
    //     <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
    //       <div className="relative">
    //         <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
    //         <input
    //           type="text"
    //           placeholder="Search pizzas or ingredients..."
    //           value={searchTerm}
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //           className="pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors w-full sm:w-80 text-gray-900 placeholder-gray-500"
    //         />
    //       </div>

    //       <div className="relative">
    //         <Filter className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
    //         <select
    //           value={selectedCategory}
    //           onChange={(e) => setSelectedCategory(e.target.value)}
    //           className="pl-12 pr-8 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white text-gray-900 min-w-48"
    //         >
    //           {categories.map((category) => (
    //             <option key={category} value={category}>
    //               {category === "All" ? "All Categories" : category}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //     </div>

    //     <div className="flex items-center space-x-4 text-sm text-gray-600">
    //       <span className="font-medium">
    //         {filteredPizzas.length} pizza
    //         {filteredPizzas.length !== 1 ? "s" : ""} available
    //       </span>
    //     </div>
    //   </div>
    // </div>

    // <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
    //   <div className="flex flex-col lg:flex-row gap-4">
    //     {/* Search Bar */}
    //     <div className="flex-1 relative">
    //       <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    //       <input
    //         key="search-input"
    //         type="text"
    //         placeholder="Search for pizzas..."
    //         value={searchTerm}
    //         onChange={(e) => setSearchTerm(e.target.value)}
    //         className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
    //       />
    //     </div>
    <div className="relative flex-1">
      <Search
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder="Search for food..."
        value={displayValue} // Use displayValue for immediate feedback
        onChange={handleInputChange}
        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
      />
    </div>
    //     {/* Category Filter */}
    //     <div className="relative">
    //       <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    //       <select
    //         value={selectedCategory}
    //         onChange={(e) => setSelectedCategory(e.target.value)}
    //         className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 bg-white min-w-48"
    //       >
    //         {categories.map((category, index) => (
    //           <option key={`${category}-${index}`} value={category}>
    //             {category}
    //           </option>
    //         ))}
    //       </select>
    //     </div>
    //   </div>
    // </div>
  );

  const PizzaCard = ({ pizza }) => {
    if (!pizza) return null;

    const {
      _id,
      name,
      base,
      sauce,
      cheese,
      veggies = [],
      meat = [],
      price,
      image,
    } = pizza;

    const allIngredients = [base, sauce, cheese, ...veggies, ...meat].filter(
      Boolean
    );

    // Mock stock check - replace with actual stock data
    const isOutOfStock = Math.random() < 0.1; // 10% chance of being out of stock for demo

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2">
        <div className="relative overflow-hidden">
          <img
            src={
              image ||
              "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop"
            }
            alt={name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(_id)}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                favorites.includes(_id)
                  ? "text-red-500 fill-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <Package className="w-12 h-12 text-white mx-auto mb-2" />
                <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                  OUT OF STOCK
                </span>
              </div>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full font-bold text-lg shadow-lg">
              ${price?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-red-600 transition-colors">
              {name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-600 font-medium">4.8</span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="text-sm text-gray-600 mb-4">
            <div className="flex flex-wrap gap-1">
              {allIngredients.slice(0, 4).map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {ingredient}
                </span>
              ))}
              {allIngredients.length > 4 && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  +{allIngredients.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>15-20 min</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Free delivery</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(pizza)}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl"
            }`}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="relative mb-8">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
          <Pizza className="w-16 h-16 text-red-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-red-500 text-xl font-bold">!</span>
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-4">
        {error ? "Unable to Load Menu" : "No Pizzas Available"}
      </h3>
      <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
        {error
          ? "There was an error connecting to our server. Please check your connection and try again."
          : "We're currently out of pizzas! Our kitchen is working hard to prepare fresh varieties for you."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={loadPizzas}
          className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {error ? "Try Again" : "Refresh Menu"}
        </button>
        {!error && (
          <button className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold shadow-lg">
            Notify When Available
          </button>
        )}
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-16">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Pizza className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Pizza Palace</h3>
                <p className="text-gray-400 text-sm">Fresh & Delicious</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Crafting the perfect pizza experience with fresh ingredients,
              authentic recipes, and a passion for flavor that brings people
              together.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4 text-red-400" />
                <span>(555) 123-PIZZA</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4 text-red-400" />
                <span>info@pizzapalace.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-red-400">
              Quick Links
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <button className="hover:text-white transition-colors">
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/custom-pizza")}
                  className="hover:text-white transition-colors"
                >
                  Custom Pizza
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-red-400">
              Location
            </h4>
            <div className="flex items-start space-x-2 text-gray-300">
              <MapPin className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
              <div>
                <p>123 Pizza Street</p>
                <p>Food City, FC 12345</p>
                <p className="text-sm text-gray-400 mt-2">
                  Open Daily: 11AM - 11PM
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 Pizza Palace. All rights reserved. Made with ❤️ for
            pizza lovers.
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-red-600">Delicious</span> Pizzas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our amazing selection of freshly made pizzas, crafted
            with love and the finest ingredients
          </p>
        </div>

        <SearchAndFilter />

        {loading && <LoadingSpinner />}

        {error && !loading && <EmptyState />}

        {!loading && !error && filteredPizzas.length === 0 && !searchTerm && (
          <EmptyState />
        )}

        {!loading && !error && filteredPizzas.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No pizzas found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {!loading && !error && filteredPizzas.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm
                  ? `Search Results (${filteredPizzas.length})`
                  : `All Pizzas (${filteredPizzas.length})`}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredPizzas.map((pizza) => (
                <PizzaCard key={pizza._id} pizza={pizza} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UserPizzaDashboard;
