import { type ReactNode } from "react";
import clsx from "clsx";

interface ReportCardProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export default function ReportCard({
  title,
  children,
  className,
  actions,
}: ReportCardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg shadow-sm p-4 flex flex-col",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">{title}</h2>
        {actions}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
