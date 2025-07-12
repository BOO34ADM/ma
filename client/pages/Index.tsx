import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4 tracking-wide">
            SA9R
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             Eagles are magnificent birds of prey, known for their strength, sharp vision, and regal appearance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* T-Shirt Category */}
          <Link
            to="/products/tshirt"
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src="public\Image\wmremove-transformed (3).png"
                alt="SA9R T-Shirts Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white">
                <h2 className="text-3xl font-bold mb-2">T-Shirts</h2>
                <p className="mb-4 text-sm opacity-90">
                  Premium cotton tees with the SA9R signature style
                </p>
                <div className="text-xs opacity-75">
                  Available in S, M, L • Black & White
                </div>
              </div>
            </div>
            <div className="p-6">
              <Button className="w-full bg-black text-white hover:bg-gray-800 group-hover:bg-gray-700">
                Shop T-Shirts
              </Button>
            </div>
          </Link>

          {/* Hoodie Category */}
          <Link
            to="/products/hoodie"
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src="public\Image\watermarkremover-transformed.png"
                alt="SA9R Hoodies Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white">
                <h2 className="text-3xl font-bold mb-2">Hoodies</h2>
                <p className="mb-4 text-sm opacity-90">
                  Cozy hoodies perfect for any streetwear look
                </p>
                <div className="text-xs opacity-75">
                  Available in S, M, L • Black & White
                </div>
              </div>
            </div>
            <div className="p-6">
              <Button className="w-full bg-black text-white hover:bg-gray-800 group-hover:bg-gray-700">
                Shop Hoodies
              </Button>
            </div>
          </Link>
        </div>

        {/* Admin link at bottom */}
        <div className="text-center mt-20">
          <Link
            to="/admin"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            admin
          </Link>
        </div>
      </main>
    </div>
  );
}
