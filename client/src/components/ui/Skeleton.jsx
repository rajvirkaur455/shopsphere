export default function Skeleton({ className = "", rounded = "rounded-md" }) {
  return <div className={`skeleton ${rounded} ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton rounded-lg w-full aspect-square" />
      <div className="skeleton h-3 w-20 rounded-full" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
