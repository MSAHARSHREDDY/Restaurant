import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
});

const Cart: mongoose.Model<any> = mongoose.models.Cart || mongoose.model("Cart", cartSchema, "carts");

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/kvr");
  const userId = new mongoose.Types.ObjectId();
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // Set 3 items
  cart.items = [
    { id: "1", name: "Veg", price: 10, quantity: 1 },
    { id: "2", name: "NonVeg", price: 20, quantity: 2 },
    { id: "3", name: "Drink", price: 5, quantity: 3 },
  ];
  await cart.save();
  
  const savedCart = await Cart.findOne({ userId });
  console.log("Saved items length:", savedCart.items.length);
  console.log("Document count:", await Cart.countDocuments());
  process.exit(0);
}

test().catch(e => {
  console.error(e);
  process.exit(1);
});
