import { FormPageWrapperProps } from "@/types/forms";
import { cn } from "@/lib/utils";

export function FormPageWrapper({
  children,
  className
}: FormPageWrapperProps) {
  return (
    <div className={cn(
      "p-6 space-y-6 bg-gray-50",
      className
    )}>
      {children}
    </div>
  );
}