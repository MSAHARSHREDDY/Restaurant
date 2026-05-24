import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import authRoutes from "./server/routes/auth.js";
import ordersRoutes from "./server/routes/orders.js";
import adminRoutes from "./server/routes/admin.js";
import reservationsRoutes from "./server/routes/reservations.js";
import paymentRoutes from "./server/routes/payment.js";
import { authMiddleware } from "./server/middleware/auth.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- API Routes ---

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/payment", paymentRoutes);

// Since the cart is just client side, we can optionally save order history or track items in backend.
// For now, let's keep cart checkout API as a placeholder that requires auth
app.post("/api/checkout", authMiddleware, async (req, res) => {
  // Normally you would process the items, create an order in DB, and handle payment here
  res.json({ success: true, message: "Order placed successfully!" });
});

async function startServer() {
  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && mongoUri !== "*****") {
    mongoose.connect(mongoUri)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } else {
    console.warn("MongoDB URI not provided or is set to default '*****'. Database features will be unavailable.");
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
