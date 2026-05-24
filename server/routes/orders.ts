import express from "express";
import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";
import { notifyAdmin } from "../utils/notifyAdmin.js";

const router = express.Router();

router.get("/", authMiddleware, async (req: any, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const { items, totalAmount, customerName, customerEmail, customerPhone, address, paymentMethod, paymentStatus, stripePaymentIntentId } = req.body;
    
    let finalPhone = customerPhone || "";
    if (!finalPhone && req.user && req.user.userId) {
      try {
        const user = await User.findById(req.user.userId);
        if (user && user.mobile) {
          finalPhone = user.mobile;
        }
      } catch (dbErr) {
        console.warn("Could not retrieve user mobile fallback:", dbErr);
      }
    }

    const order = new Order({
      userId: req.user.userId,
      customerName,
      customerEmail,
      customerPhone: finalPhone,
      address,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "Counter",
      paymentStatus: paymentStatus || "Pending",
      stripePaymentIntentId: stripePaymentIntentId || undefined,
      status: paymentStatus === "Paid" ? "Confirmed" : "Pending"
    });
    await order.save();
    
    // Notify admin
    try {
      await notifyAdmin({
        type: "new_order",
        title: "New Order Secured",
        message: `${customerName} ordered tickets worth ₹${totalAmount.toLocaleString()} via ${paymentMethod || "Counter"}`,
        metadata: { orderId: order._id, totalAmount, customerName }
      });
    } catch (notifErr) {
      console.error("Delayed or failed admin system broadcast notification:", notifErr);
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
