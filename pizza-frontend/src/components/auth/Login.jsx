import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Pizza,
  Mail,
  Lock,
  CheckCircle,
  X,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State variables for messages (success/error) and loading state
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State variable to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for input errors (client-side validation feedback)
  const [errors, setErrors] = useState({});

  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email address is invalid.";
    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setErrors({});
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      setMessage("Please correct the errors in the form.");
      setIsError(true);
      return;
    }

    try {
      // Simulated API call - replace with actual axios call
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Mock successful login after 2 seconds
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const { token } = response.data;
      const decoded = jwtDecode(token);

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: decoded.email,
          role: decoded.role,
        })
      );

      // Mock response
      //const response = { data: { token: 'mock-jwt-token', message: 'Login successful!' } };

      // Show success popup
      setShowSuccessPopup(true);

      // Store token if provided
      // Note: localStorage not available in artifacts - use state instead
      // console.log("Token stored:", response.data.token);

      // Clear form fields on success
      setEmail("");
      setPassword("");

      // Auto-hide popup and redirect after 3 seconds
      setTimeout(() => {
        if (decoded.role === "admin") {
          navigate("/adashboard");
        } else {
          navigate("/dashboard");
        }
      }, 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (fieldName) => {
    const baseClasses =
      "w-full pl-12 pr-4 py-4 text-gray-800 bg-gray-50/50 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-gray-400 focus:outline-none focus:ring-0";
    const errorClasses =
      "border-red-300 bg-red-50/30 focus:border-red-400 focus:bg-red-50/50";
    const normalClasses =
      "border-gray-200 focus:border-purple-400 focus:bg-white focus:shadow-lg hover:border-gray-300";

    return `${baseClasses} ${errors[fieldName] ? errorClasses : normalClasses}`;
  };

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform animate-bounce">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Login Successful!
              </h3>
              <p className="text-gray-600 mb-4">Welcome back to PizzaHub!</p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
              <Pizza className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 font-medium">
              Sign in to your PizzaHub account
            </p>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`p-4 mb-6 rounded-2xl text-sm font-medium backdrop-blur-sm transition-all duration-500 ease-in-out flex items-center gap-3 ${
                isError
                  ? "bg-red-100/80 text-red-700 border-2 border-red-200/50 shadow-red-100/50 shadow-lg"
                  : "bg-green-100/80 text-green-700 border-2 border-green-200/50 shadow-green-100/50 shadow-lg"
              }`}
              role="alert"
              aria-live="polite"
            >
              {isError ? (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              <span>{message}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Mail
                  className={`w-5 h-5 transition-colors duration-200 ${
                    errors.email ? "text-red-400" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                required
                className={inputClasses("email")}
                placeholder="Email Address"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Lock
                  className={`w-5 h-5 transition-colors duration-200 ${
                    errors.password ? "text-red-400" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                required
                className={inputClasses("password")}
                placeholder="Password"
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg z-10"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm font-medium text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`
                w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl text-white font-bold text-lg
                bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02]
                focus:outline-none focus:ring-4 focus:ring-purple-300/50
                ${
                  isLoading
                    ? "opacity-80 cursor-not-allowed scale-100 hover:scale-100"
                    : ""
                }
              `}
            >
              {isLoading && <LoaderCircle className="animate-spin" size={24} />}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-bold text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Create one here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
