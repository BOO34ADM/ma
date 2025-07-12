import { RequestHandler } from "express";
import { AuthResponse } from "@shared/api";

// Simple admin credentials (in production, use proper authentication)
const ADMIN_USERNAME = "sa9r";
const ADMIN_PASSWORD = "sa9r2024";

export const handleAdminLogin: RequestHandler = (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const response: AuthResponse = {
      success: true,
      message: "Login successful",
    };
    res.json(response);
  } else {
    const response: AuthResponse = {
      success: false,
      message: "Invalid credentials",
    };
    res.status(401).json(response);
  }
};

export const handleAdminVerify: RequestHandler = (req, res) => {
  // Simple verification for now
  const response: AuthResponse = {
    success: true,
    message: "Admin access verified",
  };
  res.json(response);
};
