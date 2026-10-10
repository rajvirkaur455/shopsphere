import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash as Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";
import { formatPrice, calculateDiscount } from "../utils/format.js";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`${product.name} added to cart`, "success");
  };

  const handleRemove = (id, name) => {
    removeFromWishlist(id);
    showToast(`${name} removed from wishlist`, "info");
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist and find them all here later."
          actionLabel="Discover Products"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-6 animate-fade-in">
      <Breadcrumb items={[{ label: "Home", link: "/" }, { label: "Wishlist" }]} />

      <div className="flex items-center justify-between mt-4 mb-6">
        <h1 className="text-2xl font-bold text-navy-900">
          My Wishlist <span className="text-base font-normal text-navy-400">({items.length} item{items.length !== 1 ? "s" : ""})</span>
        </h1>
        <button
          onClick={() => {
            clearWishlist();
            showToast("Wishlist cleared", "info");
          }}
          className="text-sm text-error-600 hover:text-error-700 font-medium"
        >
          Clear wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((product) => {
          const discount = calculateDiscount(product.price, product.originalPrice);
          return (
            <div key={product.id} className="card p-4 flex flex-col">
              <Link
                to={`/product/${product.id}`}
                className="rounded-lg overflow-hidden bg-navy-50 mb-3 aspect-square block"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <span className="text-xs text-navy-400 font-medium">{product.brand}</span>
              <Link
                to={`/product/${product.id}`}
                className="text-sm font-medium text-navy-800 hover:text-accent-600 transition-colors line-clamp-2 mt-1"
              >
                {product.name}
              </Link>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-lg font-bold text-navy-900">
                  {formatPrice(product.price)}
                </span>
                {discount > 0 && (
                  <span className="text-xs text-navy-300 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-3 pt-auto">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn-primary flex-1 text-xs py-2"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(product.id, product.name)}
                  className="btn-outline px-3 py-2"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4 text-error-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
