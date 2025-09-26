"use client";

import { ReactNode, forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      body: "text-sm leading-6",
      bodyLarge: "text-base leading-7",
      bodySmall: "text-xs leading-5",
      caption: "text-xs text-muted-foreground",
      label: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      quote: "mt-6 border-l-2 pl-6 italic",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    color: {
      default: "",
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
    align: "left",
    color: "default",
  },
});

type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label"
  | "blockquote"
  | "ul"
  | "code";

const getElementTag = (variant: string): TypographyElement => {
  switch (variant) {
    case "h1": return "h1";
    case "h2": return "h2";
    case "h3": return "h3";
    case "h4": return "h4";
    case "h5": return "h5";
    case "h6": return "h6";
    case "label": return "label";
    case "quote": return "blockquote";
    case "list": return "ul";
    case "code": return "code";
    default: return "p";
  }
};

export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  children: ReactNode;
  as?: TypographyElement;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "p", align, color, as, children, ...props }, ref) => {
    const Element = as || getElementTag(variant || "p");

    return (
      <Element
        ref={ref}
        className={cn(typographyVariants({ variant, align, color, className }))}
        {...(props as any)}
      >
        {children}
      </Element>
    );
  }
);

Typography.displayName = "Typography";

// 편의를 위한 특화된 컴포넌트들
const H1 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h1"
      className={className}
      {...props}
    />
  )
);

const H2 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h2"
      className={className}
      {...props}
    />
  )
);

const H3 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h3"
      className={className}
      {...props}
    />
  )
);

const H4 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h4"
      className={className}
      {...props}
    />
  )
);

const P = forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="p"
      className={className}
      {...props}
    />
  )
);

const Body = forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="body"
      className={className}
      {...props}
    />
  )
);

const Caption = forwardRef<HTMLSpanElement, Omit<TypographyProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="caption"
      as="span"
      className={className}
      {...props}
    />
  )
);

const Label = forwardRef<HTMLLabelElement, Omit<TypographyProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="label"
      as="label"
      className={className}
      {...props}
    />
  )
);

H1.displayName = "H1";
H2.displayName = "H2";
H3.displayName = "H3";
H4.displayName = "H4";
P.displayName = "P";
Body.displayName = "Body";
Caption.displayName = "Caption";
Label.displayName = "Label";

export {
  Typography,
  H1,
  H2,
  H3,
  H4,
  P,
  Body,
  Caption,
  Label,
  typographyVariants,
};