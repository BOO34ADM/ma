import { RequestHandler } from "express";
import { Order, User, OrderResponse, OrdersResponse } from "@shared/api";
import fs from "fs";
import path from "path";

const ordersPath = path.join(process.cwd(), "server/data/orders.json");
const usersPath = path.join(process.cwd(), "server/data/users.json");

function getOrders(): Order[] {
  try {
    const data = fs.readFileSync(ordersPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  try {
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("Error saving orders:", error);
  }
}

function getUsers(): User[] {
  try {
    const data = fs.readFileSync(usersPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

function saveUsers(users: User[]): void {
  try {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

export const handleCreateOrder: RequestHandler = (req, res) => {
  const { email, phone, items, total } = req.body;

  if (!email || !phone || !items || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const order: Order = {
    id: orderId,
    userId,
    email,
    phone,
    items,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // Save order
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  // Update or create user
  const users = getUsers();
  let user = users.find((u) => u.email === email);

  if (user) {
    user.orders.push(orderId);
  } else {
    user = {
      id: userId,
      email,
      phone,
      orders: [orderId],
    };
    users.push(user);
  }

  saveUsers(users);

  const response: OrderResponse = { order };
  res.json(response);
};

export const handleGetUserOrders: RequestHandler = (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const orders = getOrders();
  const userOrders = orders.filter((order) => order.email === email);

  const response: OrdersResponse = { orders: userOrders };
  res.json(response);
};

export const handleGetAllOrders: RequestHandler = (req, res) => {
  const orders = getOrders();
  const response: OrdersResponse = { orders };
  res.json(response);
};

export const handleUpdateOrderStatus: RequestHandler = (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (
    !status ||
    !["pending", "confirmed", "shipped", "delivered"].includes(status)
  ) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const orders = getOrders();
  const orderIndex = orders.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  orders[orderIndex].status = status;
  saveOrders(orders);

  const response: OrderResponse = { order: orders[orderIndex] };
  res.json(response);
};
