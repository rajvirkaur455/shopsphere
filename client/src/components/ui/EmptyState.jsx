import { Link } from "react-router-dom";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-navy-300" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-navy-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-navy-400 max-w-sm mb-6">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
