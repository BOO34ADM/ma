import { RequestHandler } from "express";
import { Cart, CartItem } from "@shared/api";

// In-memory cart storage (in production, use Redis or database)
const carts = new Map<string, Cart>();

export const handleGetCart: RequestHandler = (req, res) => {
  const cartId = req.params.cartId || "default";

  let cart = carts.get(cartId);
  if (!cart) {
    cart = {
      id: cartId,
      items: [],
      total: 0,
    };
    carts.set(cartId, cart);
  }

  res.json({ cart });
};

export const handleAddToCart: RequestHandler = (req, res) => {
  const cartId = req.params.cartId || "default";
  const { productId, size, color, quantity, price } = req.body;

  let cart = carts.get(cartId);
  if (!cart) {
    cart = {
      id: cartId,
      items: [],
      total: 0,
    };
  }

  // Check if item already exists
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.productId === productId &&
      item.size === size &&
      item.color === color,
  );

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId,
      size,
      color,
      quantity,
    });
  }

  // Calculate total
  cart.total = cart.items.reduce(
    (total, item) => total + price * item.quantity,
    0,
  );

  carts.set(cartId, cart);
  res.json({ cart });
};

export const handleUpdateCartItem: RequestHandler = (req, res) => {
  const cartId = req.params.cartId || "default";
  const { productId, size, color, quantity, price } = req.body;

  const cart = carts.get(cartId);
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.productId === productId &&
      item.size === size &&
      item.color === color,
  );

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found in cart" });
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  // Recalculate total
  cart.total = cart.items.reduce(
    (total, item) => total + price * item.quantity,
    0,
  );

  carts.set(cartId, cart);
  res.json({ cart });
};

export const handleClearCart: RequestHandler = (req, res) => {
  const cartId = req.params.cartId || "default";

  const cart = {
    id: cartId,
    items: [],
    total: 0,
  };

  carts.set(cartId, cart);
  res.json({ cart });
};
