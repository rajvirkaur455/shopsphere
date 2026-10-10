import { Link } from "react-router-dom";
import { Minus, Plus, Trash as Trash2, ShoppingBag, ArrowRight, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";
import { formatPrice } from "../utils/format.js";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, savings, itemCount, clearCart } =
    useCart();
  const { showToast } = useToast();

  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleRemove = (id, name) => {
    removeFromCart(id);
    showToast(`${name} removed from cart`, "info");
  };

  const handleClear = () => {
    clearCart();
    showToast("Cart cleared", "info");
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse our products and find something you love."
          actionLabel="Start Shopping"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-6 animate-fade-in">
      <Breadcrumb items={[{ label: "Home", link: "/" }, { label: "Cart" }]} />

      <div className="flex items-center justify-between mt-4 mb-6">
        <h1 className="text-2xl font-bold text-navy-900">
          Shopping Cart <span className="text-base font-normal text-navy-400">({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
        </h1>
        <button
          onClick={handleClear}
          className="text-sm text-error-600 hover:text-error-700 font-medium"
        >
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link
                to={`/product/${item.id}`}
                className="w-24 h-24 rounded-lg overflow-hidden bg-navy-50 shrink-0"
              >
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs text-navy-400 font-medium">{item.brand}</span>
                    <Link
                      to={`/product/${item.id}`}
                      className="block text-sm font-medium text-navy-800 hover:text-accent-600 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className="p-1.5 rounded-lg text-navy-300 hover:text-error-600 hover:bg-error-50 transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-3">
                  <div className="flex items-center border border-navy-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-navy-600 hover:bg-navy-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-navy-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-navy-600 hover:bg-navy-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-bold text-navy-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.originalPrice > item.price && (
                      <p className="text-xs text-navy-300 line-through">
                        {formatPrice(item.originalPrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700 mt-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Continue Shopping
          </Link>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Order Summary</h2>

            {savings > 0 && (
              <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-success-50 border border-success-100">
                <Tag className="w-4 h-4 text-success-600" />
                <p className="text-sm text-success-700 font-medium">
                  You save {formatPrice(savings)} on this order!
                </p>
              </div>
            )}

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-navy-600">
                <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                <span className="font-medium text-navy-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>Shipping</span>
                <span className="font-medium text-navy-800">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-accent-600 bg-accent-50 rounded-md p-2">
                  Add {formatPrice(50 - subtotal)} more to get free shipping!
                </p>
              )}
              <div className="flex justify-between text-navy-600">
                <span>Estimated Tax</span>
                <span className="font-medium text-navy-800">{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="border-t border-navy-100 mt-4 pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-base font-semibold text-navy-900">Total</span>
                <span className="text-2xl font-bold text-navy-900">{formatPrice(total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full mt-5 py-3">
              <ShoppingCart className="w-5 h-5" />
              Proceed to Checkout
            </Link>

            <p className="text-xs text-navy-400 text-center mt-3">
              Secure checkout with SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
