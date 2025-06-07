import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const EmailVerification = () => {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Navigation functions
  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  const retryVerification = () => {
    if (isVerifying || isVerified) return; // Prevent multiple calls

    setStatus("verifying");
    setMessage("");
    setCountdown(2);
    setIsVerified(false);
    handleVerifyEmail();
  };

  const handleVerifyEmail = async () => {
    // Prevent multiple verification attempts

    if (isVerifying || isVerified) return;

    const token = searchParams.get("token");

    if (!token) {
      setMessage("Invalid or missing verification token.");
      setStatus("error");
      startCountdown(() => navigateToRegister());
      return;
    }

    setIsVerifying(true);
    setStatus("verifying");

    try {
      console.log("axios  before", Date.now());

      const res = await axios.get(
        `http://localhost:5000/api/auth/verify-email?token=${token}`
      );

      const { code, message: responseMessage } = res.data;

      // Handle different success scenarios
      if (code === "SUCCESS") {
        setMessage(
          responseMessage ||
            "Email verified successfully! You can now sign in to your account."
        );
        setStatus("success");
        setIsVerified(true);
        startCountdown(() => navigateToLogin());
      } else if (code === "ALREADY_VERIFIED") {
        setMessage(
          "Your email has already been verified. You can proceed to login."
        );
        setStatus("success");
        setIsVerified(true);
        startCountdown(() => navigateToLogin());
      }
    } catch (error) {
      const errorCode = error.response?.data?.code;
      const errorMessage = error.response?.data?.message;
      let displayMessage = "Verification failed. ";

      // Handle different error types based on backend response codes
      switch (errorCode) {
        case "NO_TOKEN":
          displayMessage = "Verification token is missing from the URL.";
          break;
        case "INVALID_TOKEN":
          displayMessage =
            "The verification link is invalid or has expired. Please request a new verification email.";
          break;
        case "ALREADY_VERIFIED":
          // This shouldn't happen in catch block, but just in case
          setMessage(
            "Your email has already been verified. You can proceed to login."
          );
          setStatus("success");
          setIsVerified(true);
          startCountdown(() => navigateToLogin());
          return;
        case "SERVER_ERROR":
          displayMessage = "A server error occurred. Please try again later.";
          break;
        default:
          displayMessage +=
            errorMessage || "The verification link is invalid or has expired.";
      }

      setMessage(displayMessage);
      setStatus("error");
      startCountdown(() => navigateToRegister());
    } finally {
      setIsVerifying(false);
    }
  };

  const startCountdown = (callback) => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          callback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Only run verification once when component mounts
    if (!isVerifying && !isVerified) {
      handleVerifyEmail();
    }
  }, []); // Remove dependencies to prevent re-running

  const StatusIcon = () => {
    switch (status) {
      case "verifying":
        return <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />;
      case "success":
        return (
          <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
        );
      case "error":
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Clock className="w-16 h-16 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "verifying":
        return "from-blue-400 to-blue-600";
      case "success":
        return "from-green-400 to-green-600";
      case "error":
        return "from-red-400 to-red-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
              <Mail className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Email Verification
            </h1>
            <p className="text-gray-600">We're verifying your email address</p>
          </div>

          {/* Status Display */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <StatusIcon />
            </div>

            <div
              className={`w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden`}
            >
              <div
                className={`h-full bg-gradient-to-r ${getStatusColor()} transition-all duration-500 ${
                  status === "verifying" ? "animate-pulse" : ""
                }`}
                style={{
                  width:
                    status === "verifying"
                      ? "70%"
                      : status === "success"
                      ? "100%"
                      : "100%",
                }}
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {status === "verifying" && "Verifying..."}
              {status === "success" && "Verification Successful!"}
              {status === "error" && "Verification Failed"}
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {message || "Please wait while we verify your email address."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {status === "success" && (
              <>
                <button
                  onClick={navigateToLogin}
                  disabled={isVerifying}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Continue to Login
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-sm text-gray-500">
                  Redirecting in {countdown} seconds...
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex gap-3">
                  <button
                    onClick={retryVerification}
                    disabled={isVerifying || isVerified}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isVerifying ? "animate-spin" : ""}`}
                    />
                    {isVerifying ? "Retrying..." : "Retry"}
                  </button>
                  <button
                    onClick={navigateToRegister}
                    disabled={isVerifying}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Register Again
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Auto-redirecting to registration in {countdown} seconds...
                </p>
              </>
            )}

            {status === "verifying" && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Having trouble? Contact our{" "}
            <button className="text-indigo-600 hover:text-indigo-700 font-medium underline">
              support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
