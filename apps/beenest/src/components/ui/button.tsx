import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-[hsl(var(--brand-accent))] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-[hsl(var(--brand-primary))]",
        destructive:
          "bg-destructive text-destructive-foreground rounded-md shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-[0.98] focus-visible:ring-destructive",
        outline:
          "border-0 bg-background shadow-sm rounded-xl hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-[hsl(var(--brand-primary))]",
        secondary:
          "bg-secondary text-secondary-foreground rounded-xl shadow-sm hover:bg-secondary/80 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-secondary",
        ghost:
          "rounded-xl hover:bg-accent hover:text-accent-foreground hover:shadow-sm active:scale-[0.98] focus-visible:ring-accent",
        link:
          "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
        // Beenest 브랜드 시맨틱 컬러 variants
        success:
          "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] rounded-md shadow-sm hover:bg-[hsl(var(--success))]/90 hover:shadow-md active:scale-[0.98] focus-visible:ring-[hsl(var(--success))]",
        warning:
          "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] rounded-md shadow-sm hover:bg-[hsl(var(--warning))]/90 hover:shadow-md active:scale-[0.98] focus-visible:ring-[hsl(var(--warning))]",
        error:
          "bg-[hsl(var(--error))] text-[hsl(var(--error-foreground))] rounded-md shadow-sm hover:bg-[hsl(var(--error))]/90 hover:shadow-md active:scale-[0.98] focus-visible:ring-[hsl(var(--error))]",
        info:
          "bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] rounded-md shadow-sm hover:bg-[hsl(var(--info))]/90 hover:shadow-md active:scale-[0.98] focus-visible:ring-[hsl(var(--info))]",
      },
      size: {
        default: "h-10 px-4 py-2", /* 표준 높이를 40px로 통일 */
        sm: "h-8 px-3 py-1 text-xs gap-1.5",
        lg: "h-12 px-6 py-3 text-base gap-3",
        icon: "size-10", /* 아이콘 버튼도 표준 크기로 */
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
