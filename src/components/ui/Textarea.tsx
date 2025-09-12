import { type TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", fullWidth = false, ...props }, ref) => {
    return (
      <div className={clsx("space-y-1", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500"> *</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={clsx(
            "block w-full rounded-md border-gray-300 shadow-sm",
            "focus:border-blue-500 focus:ring-blue-500",
            "bg-white text-gray-900",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
