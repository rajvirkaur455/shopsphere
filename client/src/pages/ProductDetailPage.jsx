import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronRight,
  Package,
} from "lucide-react";
import { fetchProductById, fetchRelatedProducts } from "../services/api.js";
import Rating from "../components/ui/Rating.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";
import { ProductCardSkeleton } from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { formatPrice, calculateDiscount } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setQuantity(1);
    Promise.all([fetchProductById(id), fetchRelatedProducts("", id, 4)]).then(
      ([p, r]) => {
        setProduct(p);
        if (p) {
          fetchRelatedProducts(p.category, id, 4).then(setRelated);
        } else {
          setRelated(r);
        }
        setLoading(false);
      }
    );
  }, [id]);

  if (loading) {
    return (
      <div className="container-page py-6">
        <div className="skeleton h-5 w-48 mb-6" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="skeleton rounded-xl aspect-square" />
          <div className="space-y-4">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-8 w-full" />
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-10 w-28" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={Package}
          title="Product not found"
          description="The product you're looking for may have been removed or is no longer available."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.originalPrice);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${quantity} x ${product.name} added to cart`, "success");
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    showToast(
      inWishlist ? "Removed from wishlist" : "Added to wishlist",
      inWishlist ? "info" : "success"
    );
  };

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    ...(product.category
      ? [{ label: product.category.charAt(0).toUpperCase() + product.category.slice(1), link: `/products?category=${product.category}` }]
      : []),
    { label: product.name },
  ];

  return (
    <div className="animate-fade-in">
      <div className="container-page py-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid lg:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <div className="card overflow-hidden aspect-square bg-navy-50">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover animate-scale-in"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? "border-accent-400 ring-2 ring-accent-100"
                      : "border-navy-100 hover:border-navy-200"
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <span className="text-sm font-medium text-navy-400">
                {product.brand}
              </span>
              <h1 className="text-2xl lg:text-3xl font-bold text-navy-900 mt-1 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <Rating value={product.rating} count={product.reviewCount} size="md" />
                {product.inStock ? (
                  <span className="badge-success">
                    <Check className="w-3 h-3" />
                    In Stock
                  </span>
                ) : (
                  <span className="badge-error">Out of Stock</span>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-3 py-4 border-y border-navy-100">
              <span className="text-3xl font-bold text-navy-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-navy-300 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="badge-accent">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="text-sm text-navy-600 leading-relaxed">
              {product.description}
            </p>

            <div>
              <h3 className="text-sm font-semibold text-navy-900 mb-2">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-navy-600">
                    <Check className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-navy-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-navy-600 hover:bg-navy-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-navy-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-navy-600 hover:bg-navy-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-navy-400">
                {product.stockCount} available
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-primary flex-1 py-3"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`btn-outline px-4 py-3 ${inWishlist ? "border-accent-300 text-accent-600 bg-accent-50" : ""}`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-accent-500" : ""}`} />
              </button>
            </div>

            <Link
              to="/checkout"
              className="btn bg-navy-800 text-white hover:bg-navy-900 w-full py-3"
              onClick={() => addToCart(product, quantity)}
            >
              Buy Now
            </Link>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-navy-100">
              <div className="text-center">
                <Truck className="w-6 h-6 text-navy-500 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-navy-700">Free Shipping</p>
                <p className="text-[10px] text-navy-400">Orders over $50</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-navy-500 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-navy-700">30-Day Returns</p>
                <p className="text-[10px] text-navy-400">No questions asked</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="w-6 h-6 text-navy-500 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-navy-700">Secure Payment</p>
                <p className="text-[10px] text-navy-400">Protected checkout</p>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-navy-900">Related Products</h2>
              <Link
                to={`/products?category=${product.category}`}
                className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
              >
                See more
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
