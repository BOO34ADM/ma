import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@shared/api";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L">("M");
  const [selectedColor, setSelectedColor] = useState<"black" | "white">(
    "black",
  );
  const [showBack, setShowBack] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
        if (productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
      } else {
        console.error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      const response = await fetch("/api/cart/default/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          size: selectedSize,
          color: selectedColor,
          quantity: 1,
          price: product.price,
        }),
      });

      if (response.ok) {
        // Show success message or navigate to cart
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAdding(false);
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 hover:bg-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="aspect-square relative cursor-pointer overflow-hidden"
                  onClick={() => setShowBack(!showBack)}
                >
                  <img
                    src={showBack ? product.images.back : product.images.front}
                    alt={`${product.name} - ${showBack ? "Back" : "Front"}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded text-sm">
                    Click to {showBack ? "see front" : "see back"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowBack(false)}
                className={`p-1 rounded border-2 transition-colors overflow-hidden ${
                  !showBack ? "border-black" : "border-gray-300"
                }`}
              >
                <div className="aspect-square relative">
                  <img
                    src={product.images.front}
                    alt={`${product.name} - Front thumbnail`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">
                      Front
                    </span>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setShowBack(true)}
                className={`p-1 rounded border-2 transition-colors overflow-hidden ${
                  showBack ? "border-black" : "border-gray-300"
                }`}
              >
                <div className="aspect-square relative">
                  <img
                    src={product.images.back}
                    alt={`${product.name} - Back thumbnail`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">
                      Back
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-black">${product.price}</p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor === color
                        ? "border-black scale-110"
                        : "border-gray-300"
                    } ${color === "black" ? "bg-black" : "bg-white"}`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {adding ? "Adding..." : "Add to Cart"}
            </Button>

            {/* Product Details */}
            <div className="border-t pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Sizes:</span>
                <span>{product.sizes.join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Colors:</span>
                <span className="capitalize">{product.colors.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
