import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-gray-100 bg-white px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/20 hover:border-gray-100 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
