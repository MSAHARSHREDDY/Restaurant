import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { OfflineSale } from '../models/OfflineSale.js';
import { OfflineExpense } from '../models/OfflineExpense.js';
import { Notification } from '../models/Notification.js';
import { addSseClient, removeSseClient } from '../utils/sse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const adminMiddleware = async (req: any, res: any, next: any) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error checking admin status" });
  }
};

const router = express.Router();

// Get dashboard metrics
router.get("/metrics", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const offlineSales = await OfflineSale.find();
    const offlineExpenses = await OfflineExpense.find();

    const onlineRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const offlineRevenue = offlineSales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
    const totalRevenue = onlineRevenue + offlineRevenue;
    const totalExpenses = offlineExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    // 1. Monthly Sales Chart Flow Setup
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const salesByMonth: { [key: string]: number } = {};
    const ordersCountByMonth: { [key: string]: number } = {};

    // Initialize last 6 months to make sure chart flow looks uniform
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = monthNames[d.getMonth()];
      salesByMonth[mName] = 0;
      ordersCountByMonth[mName] = 0;
    }

    orders.forEach((order: any) => {
      const date = new Date(order.createdAt || Date.now());
      const mName = monthNames[date.getMonth()];
      if (salesByMonth[mName] !== undefined) {
        salesByMonth[mName] += order.totalAmount || 0;
        ordersCountByMonth[mName] += 1;
      }
    });

    offlineSales.forEach((sale: any) => {
      const date = new Date(sale.date || Date.now());
      const mName = monthNames[date.getMonth()];
      if (salesByMonth[mName] !== undefined) {
        salesByMonth[mName] += sale.amount || 0;
      }
    });

    const monthlySales = Object.keys(salesByMonth).map(month => ({
      month,
      revenue: salesByMonth[month],
      orders: ordersCountByMonth[month],
    }));

    // 2. Category-wise Sales Breakdown
    const categoryRevenue: { [key: string]: number } = {};
    orders.forEach((order: any) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const cat = item.categoryId || "general";
          categoryRevenue[cat] = (categoryRevenue[cat] || 0) + ((item.price || 0) * (item.quantity || 1));
        });
      }
    });

    // Merge offline categories
    offlineSales.forEach((sale: any) => {
      const cat = sale.category ? sale.category.toLowerCase().replace(/\s+/g, '-') : "counter";
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (sale.amount || 0);
    });

    const categorySales = Object.keys(categoryRevenue).map(cat => ({
      category: cat.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      revenue: categoryRevenue[cat]
    }));

    // 3. Top dishes
    const dishSales: { [key: string]: { name: string, quantity: number, revenue: number, image?: string } } = {};
    orders.forEach((order: any) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          if (!dishSales[item.id]) {
            dishSales[item.id] = { name: item.name, quantity: 0, revenue: 0, image: item.image };
          }
          dishSales[item.id].quantity += item.quantity || 0;
          dishSales[item.id].revenue += ((item.price || 0) * (item.quantity || 1));
        });
      }
    });
    const topDishes = Object.values(dishSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 4. Order Status distribution
    const statusBreakdown: { [key: string]: number } = {
      Pending: 0,
      Preparing: 0,
      "Out for Delivery": 0,
      Delivered: 0,
      Cancelled: 0
    };
    orders.forEach((order: any) => {
      const status = order.status || "Pending";
      if (statusBreakdown[status] !== undefined) {
        statusBreakdown[status]++;
      }
    });

    res.json({ 
      totalUsers, 
      totalOrders, 
      totalRevenue,
      onlineRevenue,
      offlineRevenue,
      totalExpenses,
      monthlySales,
      categorySales,
      topDishes,
      statusBreakdown
    });
  } catch (error) {
    console.error("Fetch metrics error:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

// GET /api/admin/offline-sales - Retrieve all offline sales
router.get("/offline-sales", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sales = await OfflineSale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    console.error("Fetch offline sales error:", error);
    res.status(500).json({ error: "Failed to fetch offline sales" });
  }
});

// POST /api/admin/offline-sales - Add a manually generated offline sale transaction
router.post("/offline-sales", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { amount, description, date, paymentMethod, category } = req.body;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "A valid positive sale amount is required" });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Transaction description is required" });
    }

    const newSale = new OfflineSale({
      amount: Number(amount),
      description: description.trim(),
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || "Cash",
      category: category || "Counter"
    });

    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    console.error("Create offline sale error:", error);
    res.status(500).json({ error: "Failed to create offline sale transaction" });
  }
});

// DELETE /api/admin/offline-sales/:id - Remove an offline sale record
router.delete("/offline-sales/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await OfflineSale.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Offline transaction record not found" });
    }
    res.json({ message: "Transaction record deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Delete offline sale error:", error);
    res.status(500).json({ error: "Failed to delete offline sale transaction" });
  }
});

// GET /api/admin/offline-expenses - Retrieve all offline expenses
router.get("/offline-expenses", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const expenses = await OfflineExpense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("Fetch offline expenses error:", error);
    res.status(500).json({ error: "Failed to fetch offline expenses" });
  }
});

// POST /api/admin/offline-expenses - Add a manually generated offline expense transaction
router.post("/offline-expenses", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { amount, description, date, category } = req.body;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "A valid positive expense amount is required" });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Expense description is required" });
    }

    const newExpense = new OfflineExpense({
      amount: Number(amount),
      description: description.trim(),
      date: date ? new Date(date) : new Date(),
      category: category || "Ingredients"
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Create offline expense error:", error);
    res.status(500).json({ error: "Failed to create offline expense transaction" });
  }
});

// DELETE /api/admin/offline-expenses/:id - Remove an offline expense record
router.delete("/offline-expenses/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await OfflineExpense.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Offline expense record not found" });
    }
    res.json({ message: "Expense record deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Delete offline expense error:", error);
    res.status(500).json({ error: "Failed to delete offline expense transaction" });
  }
});

// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ _id: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Toggle admin status
router.put("/users/:id/admin", authMiddleware, adminMiddleware, async (req: any, res) => {
  try {
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ error: "Cannot change own admin status" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isAdmin = req.body.isAdmin;
    await user.save();
    res.json({ message: "Admin status updated", user: { id: user._id, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user admin status" });
  }
});

// Get all orders
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update order status
router.put("/orders/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Delete an order
router.delete("/orders/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// GET /api/admin/notifications - Retrieve all notifications (latest first, limit 50)
router.get("/notifications", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
});

// PUT /api/admin/notifications/mark-read - Mark all notifications as read
router.put("/notifications/mark-read", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications read successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to read notifications." });
  }
});

// PUT /api/admin/notifications/:id/read - Mark a single notification as read
router.put("/notifications/:id/read", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification." });
  }
});

// GET /api/admin/notifications/sse - Real-time SSE channel
router.get("/notifications/sse", async (req, res) => {
  const providedToken = (req.query.token as string) || (req.headers.authorization?.split(" ")[1] as string);
  
  if (!providedToken) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production";
    const decoded: any = jwt.verify(providedToken, JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Access denied. Invalid session." });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Privileged session required." });
    }

    // Set connection headers for SSE
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    });

    const connectionId = Math.random().toString(36).substring(2, 10);
    addSseClient(connectionId, res);

    res.write(`comment: Connected to AI Studio Flight Admin SSE notifications connection [${connectionId}]\n\n`);

    const heartbeatInterval = setInterval(() => {
      try {
        res.write(`comment: heartbeat\n\n`);
      } catch (err) {
        clearInterval(heartbeatInterval);
      }
    }, 30000); // 30 seconds

    req.on("close", () => {
      clearInterval(heartbeatInterval);
      removeSseClient(connectionId);
    });
  } catch (error) {
    console.error("SSE connection validation error:", error);
    return res.status(401).json({ error: "Invalid token authentication failed." });
  }
});

export default router;
