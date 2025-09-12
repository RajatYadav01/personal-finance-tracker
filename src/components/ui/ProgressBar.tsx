import clsx from "clsx";

interface ProgressBarProps {
  value: number;
  variant?: "primary" | "success" | "warning" | "danger";
  className?: string;
}

export default function ProgressBar({
  value,
  variant = "primary",
  className = "",
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const variantClasses = {
    primary: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-yellow-500",
    danger: "bg-red-600",
  };

  return (
    <div
      className={clsx(
        "w-full bg-gray-200 rounded-full h-2.5",
        className
      )}
    >
      <div
        className={clsx("h-2.5 rounded-full", variantClasses[variant])}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
