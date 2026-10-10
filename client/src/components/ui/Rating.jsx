import { Star, StarHalf } from "lucide-react";

export default function Rating({ value = 0, count, size = "sm" }) {
  const sizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };
  const iconSize = sizes[size] || sizes.sm;

  const fullStars = Math.floor(value);
  const hasHalf = value % 1 >= 0.25 && value % 1 < 0.75;
  const totalStars = 5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: totalStars }).map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className={`${iconSize} fill-accent-400 text-accent-400`} />;
          }
          if (i === fullStars && hasHalf) {
            return <StarHalf key={i} className={`${iconSize} fill-accent-400 text-accent-400`} />;
          }
          return <Star key={i} className={`${iconSize} text-navy-200`} />;
        })}
      </div>
      {count != null && (
        <span className="text-xs text-navy-400 font-medium">
          {value.toFixed(1)} ({count.toLocaleString()})
        </span>
      )}
      {count == null && (
        <span className="text-xs text-navy-400 font-medium">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
