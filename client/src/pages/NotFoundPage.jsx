import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="text-center max-w-md">
        <p className="text-7xl font-extrabold text-navy-100">404</p>
        <h1 className="text-2xl font-bold text-navy-900 mt-4">Page Not Found</h1>
        <p className="text-sm text-navy-400 mt-2 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link to="/products" className="btn-outline">
            <ArrowLeft className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
