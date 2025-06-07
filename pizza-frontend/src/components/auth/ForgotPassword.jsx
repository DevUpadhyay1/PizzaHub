import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email
      });

      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 p-5">
      <div className="bg-white rounded-2xl p-10 shadow-2xl w-full max-w-md text-center">
        <div className="text-5xl mb-5">🍕</div>
        <h2 className="text-gray-800 mb-3 text-3xl font-semibold">Forgot Password</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="text-left">
            <label htmlFor="email" className="block mb-2 text-gray-800 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg border-l-4 border-red-500 text-sm">
              {error}
            </div>
          )}
          
          {message && (
            <div className="bg-green-50 text-green-800 p-3 rounded-lg border-l-4 border-green-500 text-sm">
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className={`bg-gradient-to-r from-red-500 to-orange-500 text-white border-none py-4 px-6 rounded-lg text-base font-semibold transition-all duration-200 ${
              loading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 cursor-pointer'
            }`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-gray-200">
          <a 
            href="/login" 
            className="text-red-500 no-underline font-medium transition-colors duration-300 hover:text-red-600 hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;