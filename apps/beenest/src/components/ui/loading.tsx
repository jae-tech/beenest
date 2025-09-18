import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin",
        {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg",
        },
        className
      )}
    />
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = "로딩 중..." }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" className="text-yellow-500" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function LoadingButton({
  loading = false,
  children,
  className,
  disabled,
  onClick,
  type = "button",
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "px-4 py-2 rounded-lg font-medium",
        "bg-yellow-500 hover:bg-yellow-600 text-white",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-colors duration-200",
        className
      )}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="p-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100">
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <div className="h-4 bg-gray-100 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg border p-6">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded"></div>
          <div className="h-3 bg-gray-100 rounded w-5/6"></div>
          <div className="h-3 bg-gray-100 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}