import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const categories = [
  { name: "Electronics", id: "electronics" },
  { name: "Computers", id: "computers" },
  { name: "Wearables", id: "wearables" },
  { name: "Fashion", id: "fashion" },
  { name: "Home & Living", id: "home" },
  { name: "Beauty", id: "beauty" },
];

export default function Header({ searchQuery, onSearchChange }) {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("You've been signed out", "info");
    navigate("/");
  };

  return (
    <header className="bg-navy-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="container-page">
        <div className="flex items-center gap-4 h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-extrabold tracking-tight">
              Shop<span className="text-accent-400">Sphere</span>
              <span className="text-xs font-medium text-navy-300 ml-1">Pro</span>
            </span>
          </Link>

          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
          </div>

          <nav className="flex items-center gap-1 ml-auto">
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-navy-100 hover:bg-navy-700 transition-colors relative"
            >
              <HeartIcon />
              <span className="hidden lg:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-navy-100 hover:bg-navy-700 transition-colors relative"
            >
              <CartIcon />
              <span className="hidden lg:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-navy-100 hover:bg-navy-700 transition-colors"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                  ) : (
                    <UserIcon />
                  )}
                  <span className="hidden lg:inline max-w-[100px] truncate">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-navy-100 hover:bg-navy-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-navy-100 hover:bg-navy-700 transition-colors"
              >
                <UserIcon />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="md:hidden pb-3">
          <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
        </div>
      </div>

      <div className="bg-navy-700 border-t border-navy-600">
        <div className="container-page">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide h-10">
            <Link
              to="/products"
              className="px-3 py-1.5 text-xs font-medium text-navy-100 hover:text-white hover:bg-navy-600 rounded-md transition-colors whitespace-nowrap"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="px-3 py-1.5 text-xs font-medium text-navy-100 hover:text-white hover:bg-navy-600 rounded-md transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="relative">
      <SearchIcon />
      <input
        type="text"
        placeholder="Search for products, brands and categories..."
        value={searchQuery || ""}
        onChange={(e) => onSearchChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const q = e.target.value.trim();
            if (q) window.location.href = `/products?search=${encodeURIComponent(q)}`;
          }
        }}
        className="w-full h-9 pl-9 pr-3 rounded-md bg-navy-600 text-white placeholder-navy-300 text-sm border border-navy-500 focus:border-accent-400 focus:bg-navy-500 transition-colors outline-none"
      />
    </div>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
