"use client";

import { ReactNode, forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

// Container 컴포넌트
const containerVariants = cva("mx-auto px-4", {
  variants: {
    size: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
      full: "max-w-full",
      screen: "max-w-screen-2xl",
    },
    padding: {
      none: "px-0",
      sm: "px-2",
      md: "px-4",
      lg: "px-6",
      xl: "px-8",
    },
  },
  defaultVariants: {
    size: "7xl",
    padding: "md",
  },
});

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  children: ReactNode;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size, padding, className }))}
      {...props}
    />
  )
);

Container.displayName = "Container";

// Grid 시스템
const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    },
    responsive: {
      true: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      false: "",
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 4,
    responsive: false,
  },
});

export interface GridProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  children: ReactNode;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, responsive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gridVariants({ cols, gap, responsive, className }))}
      {...props}
    />
  )
);

Grid.displayName = "Grid";

// Flex 시스템
const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      col: "flex-col",
      "col-reverse": "flex-col-reverse",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
    align: {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    },
  },
  defaultVariants: {
    direction: "row",
    wrap: "nowrap",
    align: "start",
    justify: "start",
    gap: 0,
  },
});

export interface FlexProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
  children: ReactNode;
}

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, wrap, align, justify, gap, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        flexVariants({ direction, wrap, align, justify, gap, className })
      )}
      {...props}
    />
  )
);

Flex.displayName = "Flex";

// Section 컴포넌트 (semantic wrapper)
const sectionVariants = cva("", {
  variants: {
    spacing: {
      none: "",
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      xl: "py-20",
      "2xl": "py-24",
    },
    background: {
      transparent: "bg-transparent",
      default: "bg-background",
      muted: "bg-muted",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
  },
  defaultVariants: {
    spacing: "md",
    background: "transparent",
  },
});

export interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  children: ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, background, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, background, className }))}
      {...props}
    />
  )
);

Section.displayName = "Section";

// Stack 컴포넌트 (간단한 수직/수평 레이아웃)
const stackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    direction: "vertical",
    gap: 4,
    align: "start",
  },
});

export interface StackProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  children: ReactNode;
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, gap, align, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(stackVariants({ direction, gap, align, className }))}
      {...props}
    />
  )
);

Stack.displayName = "Stack";

// VStack (수직 스택)
const VStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  ({ ...props }, ref) => <Stack ref={ref} direction="vertical" {...props} />
);

VStack.displayName = "VStack";

// HStack (수평 스택)
const HStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  ({ ...props }, ref) => <Stack ref={ref} direction="horizontal" {...props} />
);

HStack.displayName = "HStack";

export {
  Container,
  Grid,
  Flex,
  Section,
  Stack,
  VStack,
  HStack,
  containerVariants,
  gridVariants,
  flexVariants,
  sectionVariants,
  stackVariants,
};