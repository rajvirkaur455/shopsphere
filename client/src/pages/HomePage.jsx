import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone, Laptop, Watch, Shirt, Dome as HomeIcon, Sparkles, ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones, Flame, ChevronRight } from "lucide-react";
import {
  fetchFeaturedProducts,
  fetchDealProducts,
  fetchCategories,
} from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import { ProductGridSkeleton } from "../components/ui/Skeleton.jsx";
import { formatPrice, calculateDiscount } from "../utils/format.js";

const categoryIcons = {
  Smartphone,
  Laptop,
  Watch,
  Shirt,
  Home: HomeIcon,
  Sparkles,
};

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFeaturedProducts(), fetchDealProducts(), fetchCategories()])
      .then(([f, d, c]) => {
        setFeatured(f);
        setDeals(d);
        setCategories(c);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in">
      <Hero />

      <FeatureBar />

      <section className="container-page py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || Smartphone;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="card p-4 flex flex-col items-center text-center group hover:shadow-md hover:border-navy-200 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center mb-2 group-hover:bg-accent-50 transition-colors">
                  <Icon className="w-6 h-6 text-navy-500 group-hover:text-accent-500 transition-colors" />
                </div>
                <span className="text-xs font-medium text-navy-700 leading-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">Featured Products</h2>
            <p className="text-sm text-navy-400 mt-1">Handpicked favorites loved by our customers</p>
          </div>
          <Link
            to="/products"
            className="btn-outline hidden sm:inline-flex"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <DealsSection deals={deals} loading={loading} />

      <PromoBanner />
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-r from-navy-800 to-navy-700 text-white">
      <div className="container-page py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-slide-up">
            <span className="badge bg-accent-500/20 text-accent-300 border border-accent-500/30">
              <Sparkles className="w-3 h-3" />
              Welcome to ShopSphere Pro
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Everything you need, <br />
              <span className="text-accent-400">all in one place</span>
            </h1>
            <p className="text-navy-200 text-base lg:text-lg max-w-md">
              Discover thousands of products from top brands and trusted sellers. Shop electronics, fashion, home goods, and more at unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?deal=true"
                className="btn border border-navy-500 text-white hover:bg-navy-600 transition-colors"
              >
                <Flame className="w-4 h-4 text-accent-400" />
                Today's Deals
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div>
                <p className="text-2xl font-bold text-white">10k+</p>
                <p className="text-xs text-navy-300">Products</p>
              </div>
              <div className="w-px h-10 bg-navy-600" />
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-navy-300">Brands</p>
              </div>
              <div className="w-px h-10 bg-navy-600" />
              <div>
                <p className="text-2xl font-bold text-white">99%</p>
                <p className="text-xs text-navy-300">Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-500/20 rounded-full blur-3xl" />
              <img
                src="https://images.pexels.com/photos/16888144/pexels-photo-16888144.jpeg?auto=compress&cs=tinysrgb&h=600&w=600"
                alt="Featured products"
                className="relative rounded-2xl shadow-2xl w-full max-w-md object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy-800">Secure Payment</p>
                  <p className="text-[10px] text-navy-400">100% protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBar() {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "Encrypted checkout" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <section className="border-b border-navy-100 bg-white">
      <div className="container-page">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-navy-100">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 px-4 py-4">
              <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-navy-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-800">{f.title}</p>
                <p className="text-xs text-navy-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DealsSection({ deals, loading }) {
  return (
    <section className="bg-navy-50 py-10">
      <div className="container-page">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-accent-500" />
            <h2 className="text-2xl font-bold text-navy-900">Today's Deals</h2>
          </div>
          <Link
            to="/products?deal=true"
            className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
          >
            See all deals
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {deals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="container-page py-10">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-navy-800 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <span className="badge bg-accent-500/20 text-accent-300 mb-3">
              New Seller Program
            </span>
            <h3 className="text-xl font-bold text-white mb-2">
              Become a Seller
            </h3>
            <p className="text-sm text-navy-200 mb-4 max-w-xs">
              Reach millions of customers. Start selling on ShopSphere Pro today.
            </p>
            <Link
              to="/register"
              className="btn bg-white text-navy-800 hover:bg-navy-100 text-sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-accent-500/10 rounded-full -mb-12 -mr-12" />
        </div>

        <div className="bg-accent-500 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <span className="badge bg-white/20 text-white mb-3">
              Member Exclusive
            </span>
            <h3 className="text-xl font-bold text-white mb-2">
              Sign Up & Save 15%
            </h3>
            <p className="text-sm text-accent-100 mb-4 max-w-xs">
              Create an account today and get an exclusive discount on your first order.
            </p>
            <Link
              to="/register"
              className="btn bg-white text-accent-600 hover:bg-accent-50 text-sm"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full -mb-12 -mr-12" />
        </div>
      </div>
    </section>
  );
}
