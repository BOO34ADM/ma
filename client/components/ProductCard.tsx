import { Link } from "react-router-dom";
import { Product } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-gray-100 relative">
            <img
              src={product.images.front}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 flex flex-col items-start">
        <Link
          to={`/product/${product.id}`}
          className="hover:underline group-hover:text-blue-600 transition-colors"
        >
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        </Link>

        <div className="flex items-center justify-between w-full">
          <span className="text-xl font-bold">${product.price}</span>
          <div className="flex gap-1">
            {product.colors.map((color) => (
              <div
                key={color}
                className={`w-4 h-4 rounded-full border-2 border-gray-300 ${
                  color === "black" ? "bg-black" : "bg-white"
                }`}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-1">
          Sizes: {product.sizes.join(", ")}
        </div>

        <Link to={`/product/${product.id}`} className="w-full mt-3">
          <Button className="w-full bg-black text-white hover:bg-gray-800">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
