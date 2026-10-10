import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-navy-900">
            Shop<span className="text-accent-500">Sphere</span>
            <span className="text-xs font-medium text-navy-400 ml-1">Pro</span>
          </Link>
          <h1 className="text-2xl font-bold text-navy-900 mt-6">Welcome Back</h1>
          <p className="text-sm text-navy-400 mt-1">Sign in to your account to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input pl-9"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-navy-700">Password</label>
              <a href="#" className="text-xs text-accent-600 hover:text-accent-700 font-medium">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="input pl-9 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-navy-600">
            <input type="checkbox" className="w-4 h-4 rounded border-navy-300 text-accent-500 focus:ring-accent-400" />
            Remember me for 30 days
          </label>

          <button type="submit" className="btn-primary w-full py-3">
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-navy-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent-600 hover:text-accent-700 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
