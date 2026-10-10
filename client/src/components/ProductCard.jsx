import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import Rating from "./ui/Rating.jsx";
import { formatPrice, calculateDiscount } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const discount = calculateDiscount(product.price, product.originalPrice);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.name} added to cart`, "success");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      inWishlist ? "Removed from wishlist" : "Added to wishlist",
      inWishlist ? "info" : "success"
    );
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="card p-4 group hover:shadow-md transition-all duration-200 hover:border-navy-200 flex flex-col"
    >
      <div className="relative overflow-hidden rounded-lg bg-navy-50 mb-3 aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-accent-500 text-white">-{discount}%</span>
          )}
          {product.isDeal && (
            <span className="badge bg-navy-800 text-white">Deal</span>
          )}
        </div>

        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              inWishlist ? "fill-accent-500 text-accent-500" : "text-navy-400"
            }`}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="flex-1 btn-primary py-2 text-xs shadow-lg"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <span className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <Eye className="w-4 h-4 text-navy-500" />
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <span className="text-xs text-navy-400 font-medium mb-1">
          {product.brand}
        </span>
        <h3 className="text-sm font-medium text-navy-800 line-clamp-2 mb-1.5 leading-snug">
          {product.name}
        </h3>

        <Rating value={product.rating} count={product.reviewCount} size="sm" />

        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-lg font-bold text-navy-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-navy-300 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
