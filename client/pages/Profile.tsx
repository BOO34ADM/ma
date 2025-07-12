import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Order, OrdersResponse } from "@shared/api";
import { ShoppingBag, Search } from "lucide-react";

export default function Profile() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `/api/orders/user/${encodeURIComponent(email)}`,
      );
      const data = (await response.json()) as OrdersResponse;
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Order History</h1>

        {/* Email Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter the email used for your orders"
                  onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <div className="flex items-end">
                <Button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {orders.length === 0 && !loading ? (
          email && !error ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                No orders found
              </h2>
              <p className="text-gray-500">
                No orders were found for this email address.
              </p>
            </div>
          ) : null
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium capitalize ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                      <p className="text-lg font-bold mt-1">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Contact Information
                      </h4>
                      <p className="text-sm text-gray-600">
                        Email: {order.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {order.phone}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                          >
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-sm text-gray-600">
                                Size: {item.size}, Color: {item.color}, Qty:{" "}
                                {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ${(item.productPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
