const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    // const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      // verificationTokenExpires,
    });

    const verifyUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
    await sendEmail(email, "Verify Your Email", `Click here: ${verifyUrl}`);

    res.status(201).json({ message: "Check your email to verify account" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("Verification attempt with token:", token);

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
        code: "NO_TOKEN",
      });
    }

    // Step 1: Try to find by token
    let user = await User.findOne({ verificationToken: token });

    if (!user) {
      // Step 2: If not found, check if already verified
      const verifiedUser = await User.findOne({ isVerified: true });

      if (verifiedUser) {
        return res.status(200).json({
          message: "Email already verified",
          code: "ALREADY_VERIFIED",
          success: true,
        });
      }

      return res.status(400).json({
        message: "Invalid or expired verification token",
        code: "INVALID_TOKEN",
      });
    }

    // Step 3: If user is already verified
    if (user.isVerified) {
      return res.status(200).json({
        message: "Email already verified",
        code: "ALREADY_VERIFIED",
        success: true,
      });
    }

    // Step 4: Verify the user
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      code: "SUCCESS",
      success: true,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Internal server error",
      code: "SERVER_ERROR",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.isVerified)
    return res
      .status(400)
      .json({ message: "Invalid credentials or email not verified" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({ token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
  await sendEmail(email, "Reset Password", `Click here: ${resetUrl}`);

  res.json({ message: "Password reset link sent" });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
};
