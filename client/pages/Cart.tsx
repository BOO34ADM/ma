import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cart as CartType, CartItem, Product } from "@shared/api";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

interface CartItemWithProduct extends CartItem {
  product: Product;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartType | null>(null);
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart/default");
      const data = await response.json();
      setCart(data.cart);

      // Fetch product details for each cart item
      const itemsWithProducts = await Promise.all(
        data.cart.items.map(async (item: CartItem) => {
          const productResponse = await fetch(
            `/api/products/${item.productId}`,
          );
          const product = await productResponse.json();
          return { ...item, product };
        }),
      );

      setCartItems(itemsWithProducts);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    size: string,
    color: string,
    newQuantity: number,
    price: number,
  ) => {
    try {
      if (newQuantity <= 0) {
        // Remove item
        const response = await fetch("/api/cart/default/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            size,
            color,
            quantity: 0,
            price,
          }),
        });

        if (response.ok) {
          await fetchCart();
        }
      } else {
        // Update quantity
        const response = await fetch("/api/cart/default/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            size,
            color,
            quantity: newQuantity,
            price,
          }),
        });

        if (response.ok) {
          await fetchCart();
        }
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart/default/clear", {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={totalItems} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">Add some items to get started!</p>
            <Link to="/">
              <Button className="bg-black text-white hover:bg-gray-800">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images.front}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Size: {item.size}</span>
                          <span>
                            Color:{" "}
                            <span className="capitalize">{item.color}</span>
                          </span>
                        </div>
                        <div className="font-semibold text-lg">
                          ${item.product.price}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity - 1,
                              item.product.price,
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity + 1,
                              item.product.price,
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            0,
                            item.product.price,
                          )
                        }
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cart Summary */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal ({totalItems} items):</span>
                    <span className="font-semibold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="flex-1"
                    >
                      Clear Cart
                    </Button>
                    <Button
                      onClick={() => navigate("/checkout")}
                      className="bg-black text-white hover:bg-gray-800 flex-1"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="text-center">
              <Link
                to="/"
                className="text-black hover:underline inline-flex items-center gap-2"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
