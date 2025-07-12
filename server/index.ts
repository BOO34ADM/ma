import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleGetProducts,
  handleGetProductsByCategory,
  handleGetProduct,
} from "./routes/products";
import {
  handleGetCart,
  handleAddToCart,
  handleUpdateCartItem,
  handleClearCart,
} from "./routes/cart";
import {
  handleCreateOrder,
  handleGetUserOrders,
  handleGetAllOrders,
  handleUpdateOrderStatus,
} from "./routes/orders";
import { handleAdminLogin, handleAdminVerify } from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from SA9R API server!" });
  });

  app.get("/api/demo", handleDemo);

  // Products routes
  app.get("/api/products", handleGetProducts);
  app.get("/api/products/category/:category", handleGetProductsByCategory);
  app.get("/api/products/:id", handleGetProduct);

  // Cart routes
  app.get("/api/cart/:cartId?", handleGetCart);
  app.post("/api/cart/:cartId?/add", handleAddToCart);
  app.put("/api/cart/:cartId?/update", handleUpdateCartItem);
  app.delete("/api/cart/:cartId?/clear", handleClearCart);

  // Order routes
  app.post("/api/orders", handleCreateOrder);
  app.get("/api/orders/user/:email", handleGetUserOrders);
  app.get("/api/orders", handleGetAllOrders);
  app.put("/api/orders/:orderId/status", handleUpdateOrderStatus);

  // Admin routes
  app.post("/api/admin/login", handleAdminLogin);
  app.get("/api/admin/verify", handleAdminVerify);

  return app;
}
