"use client";

import { Chip, ChipProps } from "@heroui/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomBadgeProps extends Omit<ChipProps, "startContent" | "endContent"> {
  icon?: LucideIcon;
  pulse?: boolean;
}

export function CustomBadge({
  children,
  icon: Icon,
  pulse = false,
  className,
  ...props
}: CustomBadgeProps) {
  return (
    <Chip
      {...props}
      className={cn(
        "font-medium transition-all duration-200",
        pulse && "animate-pulse",
        className
      )}
      startContent={Icon ? <Icon className="h-3 w-3" /> : undefined}
    >
      {children}
    </Chip>
  );
}

// Predefined badge variants for common use cases
export function LevelBadge({ level }: { level: 'beginner' | 'intermediate' | 'advanced' }) {
  const variants = {
    beginner: { color: "success" as const, text: "Beginner" },
    intermediate: { color: "warning" as const, text: "Intermediate" },
    advanced: { color: "danger" as const, text: "Advanced" },
  };

  const variant = variants[level];

  return (
    <CustomBadge color={variant.color} variant="flat" size="sm">
      {variant.text}
    </CustomBadge>
  );
}

export function StatusBadge({ status }: { status: 'published' | 'draft' | 'archived' }) {
  const variants = {
    published: { color: "success" as const, text: "Published" },
    draft: { color: "warning" as const, text: "Draft" },
    archived: { color: "default" as const, text: "Archived" },
  };

  const variant = variants[status];

  return (
    <CustomBadge color={variant.color} variant="flat" size="sm">
      {variant.text}
    </CustomBadge>
  );
}