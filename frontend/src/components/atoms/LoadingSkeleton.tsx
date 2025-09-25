"use client";

import { Card, CardBody, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "stats" | "course" | "track" | "project";
  count?: number;
  className?: string;
}

export const LoadingSkeleton = ({
  variant = "card",
  count = 1,
  className = "",
}: LoadingSkeletonProps) => {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <Card className="w-full space-y-5 p-4" radius="lg">
            <Skeleton className="rounded-lg">
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </Card>
        );

      case "list":
        return (
          <Card className="w-full p-4" radius="lg">
            <CardBody className="flex flex-row items-center gap-4">
              <Skeleton className="flex rounded-full w-12 h-12" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </CardBody>
          </Card>
        );

      case "stats":
        return (
          <Card className="w-full p-4" radius="lg">
            <CardBody className="flex flex-row items-center gap-4">
              <Skeleton className="flex rounded-lg w-12 h-12" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/2 rounded-lg" />
                <Skeleton className="h-6 w-3/4 rounded-lg" />
              </div>
            </CardBody>
          </Card>
        );

      case "course":
        return (
          <Card className="w-full space-y-4 p-4" radius="lg">
            <Skeleton className="rounded-lg">
              <div className="h-40 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-16 h-4 rounded-lg" />
              </div>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-4 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <div className="flex items-center justify-between">
                <Skeleton className="w-20 h-3 rounded-lg" />
                <Skeleton className="w-16 h-3 rounded-lg" />
              </div>
            </div>
          </Card>
        );

      case "track":
        return (
          <Card className="w-full space-y-4 p-4" radius="lg">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="w-16 h-5 rounded-full" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
            <Skeleton className="rounded-lg">
              <div className="h-32 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-full rounded-lg">
                <div className="h-3 w-full rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-3/4 rounded-lg">
                <div className="h-3 w-3/4 rounded-lg bg-default-200"></div>
              </Skeleton>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="w-24 h-3 rounded-lg" />
                <Skeleton className="w-20 h-3 rounded-lg" />
              </div>
            </div>
          </Card>
        );

      case "project":
        return (
          <Card className="w-full space-y-4 p-4" radius="lg">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="w-20 h-5 rounded-full" />
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>
            <Skeleton className="rounded-lg">
              <div className="h-36 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-full rounded-lg">
                <div className="h-3 w-full rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/3 rounded-lg">
                <div className="h-3 w-2/3 rounded-lg bg-default-200"></div>
              </Skeleton>
              <div className="flex items-center gap-2 pt-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-24 h-3 rounded-lg" />
              </div>
            </div>
          </Card>
        );

      default:
        return (
          <Card className="w-full space-y-5 p-4" radius="lg">
            <Skeleton className="rounded-lg">
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
            </div>
          </Card>
        );
    }
  };

  return (
    <div
      className={`grid gap-4 ${className}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
        >
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Specialized skeleton components
export const CourseGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <LoadingSkeleton
    variant="course"
    count={count}
    className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  />
);

export const TrackGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <LoadingSkeleton
    variant="track"
    count={count}
    className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
  />
);

export const ProjectGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <LoadingSkeleton
    variant="project"
    count={count}
    className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  />
);

export const StatsGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <LoadingSkeleton
    variant="stats"
    count={count}
    className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  />
);

export const ListSkeleton = ({ count = 5 }: { count?: number }) => (
  <LoadingSkeleton
    variant="list"
    count={count}
    className="grid-cols-1"
  />
);