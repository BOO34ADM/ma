/**
 * Shared types between client and server for SA9R e-commerce
 */

export interface Product {
  id: string;
  name: string;
  category: "tshirt" | "hoodie";
  price: number;
  sizes: ("S" | "M" | "L")[];
  colors: ("black" | "white")[];
  images: {
    front: string;
    back: string;
  };
  description: string;
}

export interface CartItem {
  productId: string;
  size: "S" | "M" | "L";
  color: "black" | "white";
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  orders: string[];
}

export interface Order {
  id: string;
  userId: string;
  email: string;
  phone: string;
  items: (CartItem & { productName: string; productPrice: number })[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

// API Response types
export interface ProductsResponse {
  products: Product[];
}

export interface CartResponse {
  cart: Cart;
}

export interface OrderResponse {
  order: Order;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
}
