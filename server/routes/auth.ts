import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User } from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const getJwtSecret = () => process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account with that email address exists." });
    }

    // Generate dynamic 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 600000); // Expires in 10 minutes
    await user.save();

    // Send email with OTP
    const mailOptions = {
      from: `"KVR Flight" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Password Reset OTP Code",
      text: `You requested a password reset. Your 6-digit verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0d0d0e; color: #ffffff; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #d4af37;">
          <h2 style="color: #d4af37; text-align: center; font-family: 'Playfair Display', serif;">KVR Flight Gourmet</h2>
          <hr style="border-top: 1px solid #1f1f23;" />
          <p style="font-size: 16px; line-height: 1.5; color: #cbd5e1;">You requested a password reset. Please use the following 6-digit verification code to complete the process:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 24px; background-color: #1a1a1d; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 8px; color: #d4af37; display: inline-block;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send reset email due to server error." });
      } else {
        console.log("Email sent: " + info.response);
        return res.json({ message: "A 6-digit OTP code has been sent to your email." });
      }
    });

  } catch (error: any) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to process forgot password request" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired 6-digit verification code." });
    }

    res.json({ success: true, message: "Code verified successfully!" });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "Failed to verify OTP code" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password, email } = req.body;
    if (!token || !password) return res.status(400).json({ error: "Token and new password required" });

    const query: any = {
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    };
    if (email) {
      query.email = email;
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ error: "Password reset token is invalid or has expired." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been successfully updated!" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, getJwtSecret(), { expiresIn: "7d" });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, isAdmin: user.isAdmin } });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Force promotion of user to admin if email matches
    if (user.email === "saharshreddym59@gmail.com" && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, getJwtSecret(), { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, isAdmin: user.isAdmin } });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login", details: error.message, stack: error.stack });
  }
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Force promotion of user to admin if email matches
    if (user.email === "saharshreddym59@gmail.com" && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }
    
    res.json({ user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, isAdmin: user.isAdmin } });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/profile", authMiddleware, async (req: any, res) => {
  try {
    const { name, mobile } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (name) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, isAdmin: user.isAdmin } });
  } catch (error: any) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
