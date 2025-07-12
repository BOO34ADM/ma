import { RequestHandler } from "express";
import { Product, ProductsResponse } from "@shared/api";
import fs from "fs";
import path from "path";

const productsPath = path.join(process.cwd(), "server/data/products.json");

function getProducts(): Product[] {
  try {
    const data = fs.readFileSync(productsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

export const handleGetProducts: RequestHandler = (req, res) => {
  const products = getProducts();
  const response: ProductsResponse = { products };
  res.json(response);
};

export const handleGetProductsByCategory: RequestHandler = (req, res) => {
  const { category } = req.params;
  const products = getProducts().filter((p) => p.category === category);
  const response: ProductsResponse = { products };
  res.json(response);
};

export const handleGetProduct: RequestHandler = (req, res) => {
  const { id } = req.params;
  const products = getProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
};
