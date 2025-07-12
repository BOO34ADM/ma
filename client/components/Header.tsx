import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  cartItemCount?: number;
}

export default function Header({ cartItemCount = 0 }: HeaderProps) {
  return (
    <header className="bg-black text-white px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold tracking-wider hover:text-gray-300 transition-colors"
        >
          SA9R
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/profile">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-300 hover:bg-gray-800"
            >
              <User className="h-6 w-6" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>

          <Link to="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-300 hover:bg-gray-800"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Shopping Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
