import clsx from "clsx";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={clsx(
        "rounded-full bg-blue-600 text-white flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
