import { Link } from "react-router-dom";

const footerLinks = {
  "Shop": [
    { label: "All Products", to: "/products" },
    { label: "Featured", to: "/products?sort=rating" },
    { label: "Deals", to: "/products?deal=true" },
    { label: "New Arrivals", to: "/products?sort=newest" },
  ],
  "Customer Service": [
    { label: "Help Center", to: "#" },
    { label: "Track Order", to: "#" },
    { label: "Returns & Refunds", to: "#" },
    { label: "Shipping Info", to: "#" },
  ],
  "Company": [
    { label: "About Us", to: "#" },
    { label: "Become a Seller", to: "#" },
    { label: "Careers", to: "#" },
    { label: "Contact", to: "#" },
  ],
  "Legal": [
    { label: "Privacy Policy", to: "#" },
    { label: "Terms of Service", to: "#" },
    { label: "Cookie Policy", to: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-300 mt-auto">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="text-xl font-extrabold text-white mb-3 inline-block">
              Shop<span className="text-accent-400">Sphere</span>
              <span className="text-xs font-medium text-navy-400 ml-1">Pro</span>
            </Link>
            <p className="text-sm text-navy-400 leading-relaxed max-w-xs">
              Your trusted multi-vendor marketplace for quality products at unbeatable prices.
            </p>
            <div className="flex gap-2 mt-4">
              {["Facebook", "Twitter", "Instagram", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors"
                >
                  <span className="text-xs font-bold text-navy-300">
                    {social[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white mb-3">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-navy-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-400">
            (c) 2026 ShopSphere Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-navy-500">We accept:</span>
            <div className="flex gap-1.5">
              {["VISA", "MC", "AMEX", "PayPal"].map((method) => (
                <span
                  key={method}
                  className="text-[10px] font-bold text-navy-400 bg-navy-800 rounded px-2 py-1"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
