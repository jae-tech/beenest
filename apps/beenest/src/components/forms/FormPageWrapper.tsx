import type { FormPageWrapperProps } from "@/types/forms";
import { cn } from "@/lib/utils";

export function FormPageWrapper({
  children,
  className
}: FormPageWrapperProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gray-50/50 p-8 space-y-8",
      className
    )}>
      {children}
    </div>
  );
}