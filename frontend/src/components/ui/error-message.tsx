import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: "card" | "inline" | "banner";
  className?: string;
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  onDismiss,
  variant = "card",
  className
}: ErrorMessageProps) {
  const errorMessage = message || (typeof error === 'string' ? error : error?.message) || "An unexpected error occurred";

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center space-x-2 text-red-600 dark:text-red-400 p-2", className)}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm">{errorMessage}</span>
        {onRetry && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onRetry}
            className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={cn("bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4", className)}>
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{title}</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMessage}</p>
          </div>
          <div className="flex items-center space-x-2">
            {onRetry && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onRetry}
                className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-800/30"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-800/30"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className={cn("border-red-200 dark:border-red-800", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <CardTitle className="text-base text-red-800 dark:text-red-200">{title}</CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              {errorMessage}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {(onRetry || onDismiss) && (
        <CardContent className="pt-0">
          <div className="flex space-x-2">
            {onRetry && (
              <Button
                size="sm"
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button
                size="sm"
                variant="outline"
                onClick={onDismiss}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Dismiss
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}