"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  placement?: "center" | "top" | "bottom";
  backdrop?: "transparent" | "blur" | "opaque";
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  motionPreset?: "scale" | "slide-up" | "slide-down" | "fade" | "flip";
}

const sizeClasses = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full mx-4"
};

const placementClasses = {
  center: "items-center justify-center",
  top: "items-start justify-center pt-16",
  bottom: "items-end justify-center pb-16"
};

const backdropClasses = {
  transparent: "bg-transparent",
  blur: "bg-background/80 backdrop-blur-md",
  opaque: "bg-background/95"
};

const motionVariants = {
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  },
  "slide-up": {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  },
  "slide-down": {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  flip: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: 90 }
  }
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = "md",
  placement = "center",
  backdrop = "blur",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  hideCloseButton = false,
  className,
  overlayClassName,
  motionPreset = "scale"
}: ModalProps) {
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (typeof window === "undefined") return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-50 flex",
            placementClasses[placement],
            backdropClasses[backdrop],
            overlayClassName
          )}
          onClick={closeOnBackdropClick ? onClose : undefined}
        >
          <motion.div
            {...motionVariants[motionPreset]}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full mx-4 my-auto",
              "bg-card border border-border rounded-xl shadow-2xl",
              "max-h-[90vh] overflow-hidden",
              "focus:outline-none",
              sizeClasses[size],
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
          >
            {/* Header */}
            {(title || !hideCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex-1">
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-xl font-semibold text-foreground"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="modal-description"
                      className="mt-1 text-sm text-muted-foreground"
                    >
                      {description}
                    </p>
                  )}
                </div>
                
                {!hideCloseButton && (
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={onClose}
                    className="ml-4 hover:bg-danger/10 hover:text-danger transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
              {children}
            </div>

            {/* Focus trap elements */}
            <div
              tabIndex={0}
              onFocus={() => {
                const focusableElements = document.querySelectorAll(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
                lastElement?.focus();
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

// Specialized modal components
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger"
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
}) {
  const variantClasses = {
    danger: "bg-danger text-danger-foreground hover:bg-danger/90",
    warning: "bg-warning text-warning-foreground hover:bg-warning/90",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90"
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      motionPreset="scale"
    >
      <div className="p-6">
        <p className="text-foreground mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="light"
            onPress={onClose}
          >
            {cancelText}
          </Button>
          <Button
            className={variantClasses[variant]}
            onPress={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  isLoading = false,
  ...props
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
} & Omit<ModalProps, 'isOpen' | 'onClose' | 'title' | 'children'>) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      {...props}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        <div className="p-6">
          {children}
        </div>
        
        {onSubmit && (
          <div className="flex gap-3 justify-end p-6 border-t border-border bg-surface/50">
            <Button
              variant="light"
              onPress={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
            >
              {submitText}
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
}

export function DrawerModal({
  isOpen,
  onClose,
  children,
  title,
  placement = "right",
  ...props
}: {
  placement?: "left" | "right" | "top" | "bottom";
} & Omit<ModalProps, 'motionPreset' | 'size' | 'placement'>) {
  const motionVariants = {
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" }
    },
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" }
    },
    top: {
      initial: { y: "-100%" },
      animate: { y: 0 },
      exit: { y: "-100%" }
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="full"
      placement={placement === "top" || placement === "bottom" ? placement : "center"}
      className={cn(
        "max-w-none h-full max-h-none rounded-none",
        (placement === "left" || placement === "right") && "w-96 my-0",
        placement === "left" && "ml-0 mr-auto",
        placement === "right" && "mr-0 ml-auto",
        (placement === "top" || placement === "bottom") && "w-full mx-0",
        placement === "top" && "mt-0 mb-auto h-1/2",
        placement === "bottom" && "mb-0 mt-auto h-1/2"
      )}
      {...props}
    >
      {children}
    </Modal>
  );
}