import express from "express";
import Stripe from "stripe";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

let stripeClient: Stripe | null = null;

function getStripe(): Stripe | null {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secret);
  }
  return stripeClient;
}

router.post("/create-payment-intent", authMiddleware, async (req: any, res) => {
  try {
    const { amount, currency = "inr" } = req.body;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const stripe = getStripe();
    if (!stripe) {
      console.warn("Stripe Keys are missing. Operating in dynamic preview sandbox mode.");
      return res.json({
        clientSecret: `demo_sec_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`,
        publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_demo_key_unconfigured_kvr",
        isDemo: true,
        message: "Stripe Demo mode active. Enter any 4242 4242 card number."
      });
    }

    const amountInSmallestUnit = Math.round(Number(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      metadata: {
        userId: req.user?.userId || "guest",
        customerEmail: req.user?.email || "anonymous"
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
      isDemo: false
    });
  } catch (error: any) {
    console.error("Stripe payment intent creation failed:", error);
    res.status(500).json({ error: error.message || "Failed to create Stripe payment intent" });
  }
});

export default router;
