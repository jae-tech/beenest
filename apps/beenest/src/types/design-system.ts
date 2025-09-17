import { type LucideIcon } from "lucide-react";

export type ColorVariant = "blue" | "green" | "yellow" | "purple" | "red";

export type StatItem = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: ColorVariant;
};

export type StatusBadge = {
  label: string;
  color: string;
};

export type ActionButton = {
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
};

export type PageLayoutProps = {
  title: string;
  actionText: string;
  stats: StatItem[];
  children: React.ReactNode;
  onAction?: () => void;
  showExport?: boolean;
  onFilter?: () => void;
  onExport?: () => void;
};