"use client";

import { Progress, ProgressProps } from "@heroui/react";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends Omit<ProgressProps, "value"> {
  value: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  showLabel = false,
  showPercentage = false,
  label,
  animated = false,
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full space-y-1">
      {(showLabel || showPercentage) && (
        <div className="flex justify-between text-sm">
          {showLabel && (
            <span className="font-medium text-foreground">
              {label || "Progress"}
            </span>
          )}
          {showPercentage && (
            <span className="text-muted-foreground">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <Progress
        {...props}
        value={clampedValue}
        className={cn(
          "w-full",
          animated && "transition-all duration-500 ease-out",
          className
        )}
        classNames={{
          indicator: cn(
            "transition-all duration-500 ease-out",
            animated && "animate-pulse"
          ),
        }}
      />
    </div>
  );
}

// Circular progress variant
interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  color?: string;
  className?: string;
}

export function CircularProgress({
  value,
  size = 60,
  strokeWidth = 4,
  showPercentage = true,
  color = "currentColor",
  className,
}: CircularProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
    </div>
  );
}