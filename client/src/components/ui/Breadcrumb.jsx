export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-1.5">
            {item.link && !isLast ? (
              <a
                href={item.link}
                className="text-navy-400 hover:text-navy-600 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className={isLast ? "text-navy-700 font-medium" : "text-navy-400"}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-navy-200">/</span>}
          </div>
        );
      })}
    </nav>
  );
}
