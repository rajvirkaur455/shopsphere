import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown, PackageSearch } from "lucide-react";
import { fetchProducts, getAllBrands, getPriceRange } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import { ProductGridSkeleton } from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";
import { formatPrice } from "../utils/format.js";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

const categoryLabels = {
  electronics: "Electronics",
  computers: "Computers",
  wearables: "Wearables",
  fashion: "Fashion",
  home: "Home & Living",
  beauty: "Beauty",
};

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "featured";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const brand = searchParams.get("brand") || "";

  const brands = useMemo(() => getAllBrands(), []);
  const priceRange = useMemo(() => getPriceRange(), []);

  const [localMin, setLocalMin] = useState(minPrice || "");
  const [localMax, setLocalMax] = useState(maxPrice || "");

  useEffect(() => {
    setLocalMin(minPrice || "");
    setLocalMax(maxPrice || "");
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category,
      search,
      sort,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      brand,
    }).then((result) => {
      setProducts(result);
      setLoading(false);
    });
  }, [category, search, sort, minPrice, maxPrice, brand]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const applyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    if (localMin) next.set("minPrice", localMin);
    else next.delete("minPrice");
    if (localMax) next.set("maxPrice", localMax);
    else next.delete("maxPrice");
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setLocalMin("");
    setLocalMax("");
  };

  const hasActiveFilters = category || search || minPrice || maxPrice || brand;

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    ...(category ? [{ label: categoryLabels[category] || category }] : []),
  ];

  return (
    <div className="animate-fade-in">
      <div className="container-page py-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex items-center justify-between mt-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">
              {category ? categoryLabels[category] || category : "All Products"}
            </h1>
            <p className="text-sm text-navy-400 mt-1">
              {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
              {search && ` for "${search}"`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="btn-outline lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="appearance-none pl-3 pr-9 py-2.5 rounded-lg border border-navy-200 bg-white text-sm font-medium text-navy-700 cursor-pointer hover:bg-navy-50 transition-colors focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-navy-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterPanel
              category={category}
              brands={brands}
              brand={brand}
              priceRange={priceRange}
              localMin={localMin}
              localMax={localMax}
              setLocalMin={setLocalMin}
              setLocalMax={setLocalMax}
              applyPriceFilter={applyPriceFilter}
              updateParam={updateParam}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No products found"
                description="Try adjusting your filters or search terms to find what you're looking for."
                actionLabel="Clear Filters"
                actionTo="/products"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-900/50 animate-fade-in"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl animate-slide-down overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-navy-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-navy-900">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1.5 rounded-lg hover:bg-navy-50 text-navy-400"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                category={category}
                brands={brands}
                brand={brand}
                priceRange={priceRange}
                localMin={localMin}
                localMax={localMax}
                setLocalMin={setLocalMin}
                setLocalMax={setLocalMax}
                applyPriceFilter={applyPriceFilter}
                updateParam={updateParam}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="btn-primary w-full mt-4"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  category,
  brands,
  brand,
  priceRange,
  localMin,
  localMax,
  setLocalMin,
  setLocalMax,
  applyPriceFilter,
  updateParam,
  clearFilters,
  hasActiveFilters,
}) {
  const catOptions = [
    { id: "", name: "All Categories" },
    { id: "electronics", name: "Electronics" },
    { id: "computers", name: "Computers" },
    { id: "wearables", name: "Wearables" },
    { id: "fashion", name: "Fashion" },
    { id: "home", name: "Home & Living" },
    { id: "beauty", name: "Beauty" },
  ];

  return (
    <div className="space-y-5">
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-accent-600 hover:text-accent-700 font-medium flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          Clear all filters
        </button>
      )}

      <div>
        <h3 className="text-sm font-semibold text-navy-900 mb-3">Category</h3>
        <div className="space-y-1.5">
          {catOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.id)}
              className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                category === cat.id
                  ? "bg-accent-50 text-accent-700 font-medium"
                  : "text-navy-600 hover:bg-navy-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-navy-100 pt-5">
        <h3 className="text-sm font-semibold text-navy-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              className="input py-2 text-sm"
              min={priceRange.min}
              max={priceRange.max}
            />
            <span className="text-navy-300">-</span>
            <input
              type="number"
              placeholder="Max"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              className="input py-2 text-sm"
              min={priceRange.min}
              max={priceRange.max}
            />
          </div>
          <button onClick={applyPriceFilter} className="btn-secondary w-full text-sm">
            Apply Price
          </button>
          <p className="text-xs text-navy-400">
            Range: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
          </p>
        </div>
      </div>

      <div className="border-t border-navy-100 pt-5">
        <h3 className="text-sm font-semibold text-navy-900 mb-3">Brand</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateParam("brand", "")}
            className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
              !brand
                ? "bg-accent-50 text-accent-700 font-medium"
                : "text-navy-600 hover:bg-navy-50"
            }`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => updateParam("brand", b)}
              className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                brand === b
                  ? "bg-accent-50 text-accent-700 font-medium"
                  : "text-navy-600 hover:bg-navy-50"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
