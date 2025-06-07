import React, { useState } from 'react';
import { Eye, EyeOff, LoaderCircle, Pizza, User, Mail, Lock, Shield } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  // State variables for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');

  // State variables for messages (success/error) and loading state
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State variables to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Added state for input errors (client-side validation feedback)
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required.';
    if (!email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email address is invalid.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required.';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setErrors({}); // Clear previous input errors
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      setMessage('Please correct the errors in the form.');
      setIsError(true);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role,
      });

      setMessage(response.data.message || 'Registration successful! Please check your email to verify your account.');
      setIsError(false);
      // Clear form fields on success
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('user');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (fieldName) => {
    const baseClasses = "w-full pl-12 pr-4 py-4 text-gray-800 bg-gray-50/50 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-gray-400 focus:outline-none focus:ring-0";
    const errorClasses = "border-red-300 bg-red-50/30 focus:border-red-400 focus:bg-red-50/50";
    const normalClasses = "border-gray-200 focus:border-purple-400 focus:bg-white focus:shadow-lg hover:border-gray-300";
    
    return `${baseClasses} ${errors[fieldName] ? errorClasses : normalClasses}`;
  };

  return (
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
            Join PizzaHub
          </h2>
          <p className="text-gray-600 font-medium">Create your account and start ordering!</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-2xl text-sm font-medium backdrop-blur-sm transition-all duration-500 ease-in-out flex items-center gap-3 ${
              isError 
                ? 'bg-red-100/80 text-red-700 border-2 border-red-200/50 shadow-red-100/50 shadow-lg' 
                : 'bg-green-100/80 text-green-700 border-2 border-green-200/50 shadow-green-100/50 shadow-lg'
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
          {/* Name Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <User className={`w-5 h-5 transition-colors duration-200 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
              required
              className={inputClasses('name')}
              placeholder="Full Name"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-2">
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Mail className={`w-5 h-5 transition-colors duration-200 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
              required
              className={inputClasses('email')}
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
              <Lock className={`w-5 h-5 transition-colors duration-200 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
              required
              minLength={6}
              className={inputClasses('password')}
              placeholder="Password (min 6 characters)"
              aria-invalid={errors.password ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg z-10"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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

          {/* Confirm Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Lock className={`w-5 h-5 transition-colors duration-200 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
              required
              className={inputClasses('confirmPassword')}
              placeholder="Confirm Password"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg z-10"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-2">
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-12 pr-8 py-4 text-gray-800 bg-gray-50/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-purple-400 focus:bg-white focus:shadow-lg hover:border-gray-300 appearance-none cursor-pointer"
            >
              <option value="user">🍕 Customer</option>
              <option value="admin">👑 Admin</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
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
              ${isLoading ? 'opacity-80 cursor-not-allowed scale-100 hover:scale-100' : ''}
            `}
          >
            {isLoading && <LoaderCircle className="animate-spin" size={24} />}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="font-bold text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;