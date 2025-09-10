"use client";

import { Button, ButtonProps } from "@heroui/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends Omit<ButtonProps, "startContent" | "endContent"> {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  loading?: boolean;
  loadingText?: string;
}

export function CustomButton({
  children,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  loadingText,
  className,
  disabled,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "font-medium transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        className
      )}
      disabled={disabled || loading}
      startContent={
        loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : LeftIcon ? (
          <LeftIcon className="h-4 w-4" />
        ) : undefined
      }
      endContent={!loading && RightIcon ? <RightIcon className="h-4 w-4" /> : undefined}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}