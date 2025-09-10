"use client";

import { Avatar, AvatarProps } from "@heroui/react";
import { cn, getInitials } from "@/lib/utils";

interface CustomAvatarProps extends Omit<AvatarProps, "name"> {
  name: string;
  src?: string;
  showBorder?: boolean;
  status?: "online" | "offline" | "away" | "busy";
}

export function CustomAvatar({
  name,
  src,
  showBorder = false,
  status,
  className,
  size = "md",
  ...props
}: CustomAvatarProps) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500",
  };

  const statusSizeMap = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  return (
    <div className="relative inline-block">
      <Avatar
        {...props}
        src={src}
        name={getInitials(name)}
        size={size}
        className={cn(
          "transition-all duration-200",
          showBorder && "ring-2 ring-white dark:ring-gray-800",
          className
        )}
        classNames={{
          base: cn(
            "bg-gradient-to-br from-primary-100 to-primary-200",
            "dark:from-primary-800 dark:to-primary-900"
          ),
          name: "text-primary-700 dark:text-primary-300 font-semibold",
        }}
      />
      {status && (
        <div
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800",
            statusColors[status],
            statusSizeMap[size as keyof typeof statusSizeMap]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

// Avatar group component for showing multiple avatars
interface AvatarGroupProps {
  users: Array<{ name: string; src?: string }>;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarGroup({ users, max = 3, size = "md", className }: AvatarGroupProps) {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {displayUsers.map((user, index) => (
        <CustomAvatar
          key={index}
          name={user.name}
          src={user.src}
          size={size}
          showBorder
          className="hover:z-10 hover:scale-110"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800",
            "border-2 border-white dark:border-gray-800",
            "text-xs font-medium text-gray-600 dark:text-gray-300",
            sizeMap[size as keyof typeof sizeMap]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
} as const;