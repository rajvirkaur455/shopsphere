import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleCheck as CheckCircle2, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";
import { formatPrice } from "../utils/format.js";

export default function CheckoutPage() {
  const { items, subtotal, savings, itemCount, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep("success");
    clearCart();
    showToast("Order placed successfully!", "success");
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={CreditCard}
          title="Nothing to checkout"
          description="Your cart is empty. Add some products before proceeding to checkout."
          actionLabel="Go Shopping"
          actionTo="/products"
        />
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="container-page py-16">
        <div className="max-w-md mx-auto text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Order Confirmed!</h1>
          <p className="text-sm text-navy-500 mb-6">
            Thank you for your purchase. A confirmation email has been sent to your inbox.
            Your order will be processed and shipped within 1-2 business days.
          </p>
          <div className="card p-4 mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-navy-500">Order Number</span>
              <span className="font-semibold text-navy-800">
                #SP-{Math.random().toString(36).slice(2, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-navy-500">Total Paid</span>
              <span className="font-semibold text-navy-800">{formatPrice(total)}</span>
            </div>
          </div>
          <Link to="/products" className="btn-primary w-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-6 animate-fade-in">
      <Breadcrumb items={[{ label: "Home", link: "/" }, { label: "Cart", link: "/cart" }, { label: "Checkout" }]} />

      <div className="flex items-center justify-between mt-4 mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Checkout</h1>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
              <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <div className="sm:col-span-2">
                <Field label="Street Address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <Field label="City" name="city" value={formData.city} onChange={handleChange} required />
              <Field label="State / Province" name="state" value={formData.state} onChange={handleChange} required />
              <Field label="ZIP / Postal Code" name="zip" value={formData.zip} onChange={handleChange} required />
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>India</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-navy-500" />
              <h2 className="text-lg font-bold text-navy-900">Payment Method</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Name on Card" name="cardName" value={formData.cardName} onChange={handleChange} required />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <Field label="Expiry Date" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="MM/YY" required />
              <Field label="CVV" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" required />
            </div>
            <p className="text-xs text-navy-400 mt-3 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Your payment information is encrypted and secure.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Order Summary</h2>

            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-navy-50 shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-navy-700 font-medium line-clamp-1 text-xs">{item.name}</p>
                    <p className="text-navy-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-navy-800 text-xs">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {savings > 0 && (
              <div className="p-2 rounded-lg bg-success-50 border border-success-100 mb-3">
                <p className="text-xs text-success-700 font-medium">
                  You saved {formatPrice(savings)}!
                </p>
              </div>
            )}

            <div className="space-y-2 text-sm border-t border-navy-100 pt-3">
              <div className="flex justify-between text-navy-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="border-t border-navy-100 mt-3 pt-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-navy-900">Total</span>
                <span className="text-2xl font-bold text-navy-900">{formatPrice(total)}</span>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-5 py-3">
              <CreditCard className="w-5 h-5" />
              Place Order
            </button>

            <p className="text-xs text-navy-400 text-center mt-3 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Secure SSL encrypted checkout
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-1.5">
        {label} {required && <span className="text-accent-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input"
      />
    </div>
  );
}
