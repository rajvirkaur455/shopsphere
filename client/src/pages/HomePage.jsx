import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone, Laptop, Watch, Shirt, Home as HomeIcon, Sparkles, ArrowRight,
  Truck, ShieldCheck, RotateCcw, Headphones, Flame, ChevronRight, Star,
  TrendingUp, Zap, Heart, ShoppingBag, Search, Tag, BadgePercent,
} from "lucide-react";
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

const heroSlides = [
  {
    badge: "Mega Sale Live Now",
    title: "Everything you need,",
    highlight: "all in one place",
    subtitle: "Discover thousands of products from top brands and trusted sellers. Shop electronics, fashion, home goods, and more at unbeatable prices.",
    image: "https://images.pexels.com/photos/36730470/pexels-photo-36730470.jpeg?auto=compress&cs=tinysrgb&h=900&w=900",
    cta: "Start Shopping",
    ctaLink: "/products",
    secondaryCta: "Today's Deals",
    secondaryLink: "/products?deal=true",
  },
  {
    badge: "New Tech Arrivals",
    title: "Latest gadgets,",
    highlight: "unbeatable prices",
    subtitle: "From flagship smartphones to premium laptops, get the tech you love at prices you'll love even more. Free shipping on orders over $50.",
    image: "https://images.pexels.com/photos/12935042/pexels-photo-12935042.jpeg?auto=compress&cs=tinysrgb&h=900&w=900",
    cta: "Shop Electronics",
    ctaLink: "/products?category=electronics",
    secondaryCta: "View All",
    secondaryLink: "/products",
  },
  {
    badge: "Fashion Week Special",
    title: "Style that speaks,",
    highlight: "trends that last",
    subtitle: "Refresh your wardrobe with the season's hottest fashion. Clothing, shoes, and accessories from brands you trust, all in one place.",
    image: "https://images.pexels.com/photos/6969616/pexels-photo-6969616.jpeg?auto=compress&cs=tinysrgb&h=900&w=900",
    cta: "Shop Fashion",
    ctaLink: "/products?category=fashion",
    secondaryCta: "New Arrivals",
    secondaryLink: "/products",
  },
];

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
      <BrandMarquee />
      <FeatureBar />

      <CategorySection categories={categories} loading={loading} />

      <FeaturedSection featured={featured} loading={loading} />

      <DealsSection deals={deals} loading={loading} />

      <StatsBanner />

      <PromoBanner />
    </div>
  );
}

function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[active];

  return (
    <section className="relative overflow-hidden bg-navy-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      <div
        className="absolute inset-0 opacity-30 bg-[linear-gradient(110deg,transparent_35%,rgba(239,90,22,0.15)_50%,transparent_65%)] bg-[length:200%_100%] animate-gradient-shift"
      />

      {/* Floating decorative orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-navy-400/10 rounded-full blur-2xl animate-float-slow" />

      <div className="container-page relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] py-16 lg:py-24">
          {/* Left: text content */}
          <div key={active} className="space-y-6 animate-slide-up">
            <span className="badge bg-accent-500/20 text-accent-300 border border-accent-500/30 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              {slide.badge}
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
              {slide.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">
                {slide.highlight}
              </span>
            </h1>
            <p className="text-navy-200 text-lg lg:text-xl max-w-lg leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={slide.ctaLink}
                className="btn bg-accent-500 text-white hover:bg-accent-600 active:scale-[0.98] px-6 py-3 text-base shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 transition-all duration-300 group"
              >
                {slide.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={slide.secondaryLink}
                className="btn border-2 border-navy-500 text-white hover:bg-navy-700 hover:border-navy-400 active:scale-[0.98] px-6 py-3 text-base backdrop-blur-sm transition-all duration-300"
              >
                <Flame className="w-5 h-5 text-accent-400" />
                {slide.secondaryCta}
              </Link>
            </div>

            {/* Slide indicators */}
            <div className="flex items-center gap-3 pt-4">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-10 bg-accent-500"
                      : "w-2 bg-navy-600 hover:bg-navy-500"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: image with floating cards */}
          <div key={`img-${active}`} className="hidden lg:flex justify-center animate-scale-in">
            <div className="relative">
              {/* Pulse ring behind image */}
              <div className="absolute inset-0 rounded-3xl bg-accent-500/20 animate-pulse-ring" />

              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src={slide.image}
                  alt="Shopping"
                  className="w-full max-w-lg h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
              </div>

              {/* Floating card: discount */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
                    <BadgePercent className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-navy-900">Up to 70%</p>
                    <p className="text-xs text-navy-400">Off this week</p>
                  </div>
                </div>
              </div>

              {/* Floating card: rating */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-900">Secure Payment</p>
                    <p className="text-xs text-navy-400">100% protected</p>
                  </div>
                </div>
              </div>

              {/* Floating card: live shoppers */}
              <div className="absolute top-1/2 -right-8 bg-white rounded-xl shadow-lg px-3 py-2 animate-float">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
                  </span>
                  <p className="text-xs font-semibold text-navy-700">2,847 shopping now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator at bottom */}
      <div className="relative z-10">
        <svg viewBox="0 0 1440 60" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="#f0f4f8" />
        </svg>
      </div>
    </section>
  );
}

function BrandMarquee() {
  const brands = ["AuraSound", "Galaxy", "UltraBook", "PulseFit", "StrideMax", "TrekPro", "BrewCraft", "OpticPro", "SoundWave", "Lumina", "TypeForge", "ChargePro"];
  const doubled = [...brands, ...brands];

  return (
    <section className="bg-navy-50 py-6 overflow-hidden border-b border-navy-100">
      <div className="container-page mb-3">
        <p className="text-center text-xs font-medium text-navy-400 uppercase tracking-widest">
          Trusted by top brands worldwide
        </p>
      </div>
      <div className="relative">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {doubled.map((brand, i) => (
            <span
              key={i}
              className="text-xl font-bold text-navy-300 hover:text-navy-500 transition-colors cursor-default"
            >
              {brand}
            </span>
          ))}
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
    <section className="bg-white border-b border-navy-100">
      <div className="container-page">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-navy-100">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="flex items-center gap-3 px-4 py-5 hover:bg-navy-50/50 transition-colors group animate-slide-up-delayed"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center shrink-0 group-hover:bg-accent-50 group-hover:scale-110 transition-all duration-300">
                <f.icon className="w-6 h-6 text-navy-600 group-hover:text-accent-600 transition-colors" />
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

function CategorySection({ categories, loading }) {
  return (
    <section className="container-page py-14">
      <SectionHeader
        title="Shop by Category"
        subtitle="Explore our wide range of curated categories"
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-xl" />
            ))
          : categories.map((cat, i) => {
            const Icon = categoryIcons[cat.icon] || Smartphone;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="card p-5 flex flex-col items-center text-center group hover:shadow-lg hover:border-accent-200 transition-all duration-300 hover:-translate-y-1 animate-slide-up-delayed"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center mb-3 group-hover:bg-accent-50 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-navy-500 group-hover:text-accent-500 transition-colors" />
                </div>
                <span className="text-sm font-medium text-navy-700 leading-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
      </div>
    </section>
  );
}

function FeaturedSection({ featured, loading }) {
  return (
    <section className="container-page py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-accent-500" />
            <span className="text-sm font-semibold text-accent-600 uppercase tracking-wide">Trending Now</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-900">Featured Products</h2>
          <p className="text-base text-navy-400 mt-2">Handpicked favorites loved by our customers</p>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((product, i) => (
            <div
              key={product.id}
              className="animate-slide-up-delayed"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function DealsSection({ deals, loading }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="bg-gradient-to-b from-navy-50 to-white py-14">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/30">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900">Today's Deals</h2>
              <p className="text-sm text-navy-400 mt-1">Limited time offers — don't miss out</p>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-navy-500 font-medium hidden sm:inline">Ends in</span>
            <div className="flex items-center gap-1.5">
              {[
                { label: "HRS", value: pad(timeLeft.hours) },
                { label: "MIN", value: pad(timeLeft.minutes) },
                { label: "SEC", value: pad(timeLeft.seconds) },
              ].map((t, i) => (
                <div key={t.label} className="flex items-center gap-1.5">
                  <div className="bg-navy-900 text-white rounded-lg px-3 py-2 text-center min-w-[44px]">
                    <p className="text-lg font-bold tabular-nums leading-none">{t.value}</p>
                    <p className="text-[9px] text-navy-300 mt-0.5">{t.label}</p>
                  </div>
                  {i < 2 && <span className="text-navy-400 font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {deals.slice(0, 4).map((product, i) => (
              <div
                key={product.id}
                className="animate-slide-up-delayed"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/products?deal=true"
            className="btn-primary px-6 py-3 text-base group"
          >
            See all deals
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatsBanner() {
  const stats = [
    { value: "10k+", label: "Products", icon: ShoppingBag },
    { value: "500+", label: "Brands", icon: Tag },
    { value: "50k+", label: "Happy Customers", icon: Heart },
    { value: "99%", label: "Satisfaction", icon: Star },
  ];

  return (
    <section className="relative overflow-hidden bg-navy-900 py-14">
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center animate-slide-up-delayed"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="inline-flex w-14 h-14 rounded-2xl bg-white/10 items-center justify-center mb-3 backdrop-blur-sm">
                <stat.icon className="w-7 h-7 text-accent-400" />
              </div>
              <p className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">{stat.value}</p>
              <p className="text-sm text-navy-300 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="container-page py-14">
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Seller promo */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 p-8 text-white min-h-[220px] flex flex-col justify-center group hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-accent-500/10 rounded-full -mb-20 -mr-20 group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute right-10 top-6 w-20 h-20 bg-accent-500/5 rounded-full" />
          <div className="relative z-10">
            <span className="badge bg-accent-500/20 text-accent-300 mb-4 border border-accent-500/30">
              <Zap className="w-3 h-3" />
              New Seller Program
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">
              Become a Seller
            </h3>
            <p className="text-sm text-navy-200 mb-5 max-w-xs">
              Reach millions of customers. Start selling on ShopSphere Pro today with zero setup fees.
            </p>
            <Link
              to="/register"
              className="btn bg-white text-navy-800 hover:bg-navy-100 text-sm group/btn"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Member promo */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 p-8 text-white min-h-[220px] flex flex-col justify-center group hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/10 rounded-full -mb-20 -mr-20 group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute right-10 top-6 w-20 h-20 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <span className="badge bg-white/20 text-white mb-4 border border-white/20">
              <Sparkles className="w-3 h-3" />
              Member Exclusive
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">
              Sign Up & Save 15%
            </h3>
            <p className="text-sm text-accent-100 mb-5 max-w-xs">
              Create an account today and get an exclusive discount on your first order plus early access to sales.
            </p>
            <Link
              to="/register"
              className="btn bg-white text-accent-600 hover:bg-accent-50 text-sm group/btn"
            >
              Create Account
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl lg:text-4xl font-bold text-navy-900">{title}</h2>
      {subtitle && <p className="text-base text-navy-400 mt-2">{subtitle}</p>}
    </div>
  );
}
