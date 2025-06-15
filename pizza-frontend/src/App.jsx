// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import your components
import Register from "./components/auth/Register";
import EmailVerification from "./components/auth/EmailVerification"; // Your email verification component
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import UserPizzaDashboard from "./components/user/UserPizzaDashboard";
import PizzaInventorySystem from "./components/admin/PizzaInventorySystem";
import AdminRoute from "./components/admin/AdminRoutes";
import CustomPizzaBuilder from "./components/user/CustomPizzaBuilder";
import PizzaCart from "./components/cart/PizzaCart";

// import AdminDashboard from "./components/auth/main/AdminPizzaDashboard";

// Removed Home import since we're redirecting to register

// You can also create a simple NotFound component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
        Go back home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home route - redirect to register */}
          <Route path="/" element={<Navigate to="/register" replace />} />

          {/* Authentication routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Email verification route */}
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Protected routes */}
          <Route path="/dashboard" element={<UserPizzaDashboard />} />
          <Route
            path="/adashboard"
            element={
              <AdminRoute>
                <PizzaInventorySystem />
              </AdminRoute>
            }
          />

          {/* CustomPizzaBuilderRoutes */}
          <Route path="/custom-pizza" element={<CustomPizzaBuilder />} />
          {/* Redirect /home to register as well */}
          <Route path="/cart" element={<PizzaCart/>} />
          {/* <Route path="/home" element={<Navigate to="/register" replace />} /> */}

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
