import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export default function LoadingSpinner({
  size = 24,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2
        className={clsx("animate-spin text-blue-600", className)}
        size={size}
      />
    </div>
  );
}
