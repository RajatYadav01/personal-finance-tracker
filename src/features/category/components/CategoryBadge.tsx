interface CategoryBadgeProps {
  category: {
    id: string;
    name: string;
    color: string;
  };
  size?: "sm" | "md" | "lg";
}

export default function CategoryBadge({
  category,
  size = "md",
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeClasses[size]}`}
      style={{ backgroundColor: `${category.color}20`, color: category.color }}
    >
      {category.name}
    </span>
  );
}
