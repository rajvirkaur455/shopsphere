import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Registration failed", "error");
        return;
      }
      loginWithCredentials(data);
      showToast(`Welcome to ShopSphere, ${data.name}!`, "success");
      navigate("/");
    } catch {
      showToast("Could not connect to server. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const passwordMismatch =
    formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-navy-900">
            Shop<span className="text-accent-500">Sphere</span>
            <span className="text-xs font-medium text-navy-400 ml-1">Pro</span>
          </Link>
          <h1 className="text-2xl font-bold text-navy-900 mt-6">Create Account</h1>
          <p className="text-sm text-navy-400 mt-1">Join ShopSphere Pro and start shopping today</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="input pl-9"
              />
            </div>
          </div>

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
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                required
                minLength="8"
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
            {formData.password && formData.password.length < 8 && (
              <p className="text-xs text-warning-600 mt-1">Password must be at least 8 characters</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className={`input pl-9 ${passwordMismatch ? "border-error-400 focus:ring-error-100" : ""}`}
              />
            </div>
            {passwordMismatch && (
              <p className="text-xs text-error-600 mt-1">Passwords do not match</p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm text-navy-600">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
              className="w-4 h-4 rounded border-navy-300 text-accent-500 focus:ring-accent-400 mt-0.5"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="text-accent-600 hover:text-accent-700 font-medium">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-accent-600 hover:text-accent-700 font-medium">Privacy Policy</a>
            </span>
          </label>

          <button
            type="submit"
            disabled={!formData.agreeTerms || passwordMismatch || submitting}
            className="btn-primary w-full py-3 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create Account"}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-navy-200" />
          <span className="text-xs text-navy-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-navy-200" />
        </div>

        <GoogleLoginButton text="Sign up with Google" />

        <p className="text-center text-sm text-navy-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-600 hover:text-accent-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
