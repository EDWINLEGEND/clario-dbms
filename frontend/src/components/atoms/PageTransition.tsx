'use client';

import { motion, type Variants, type Transition } from "framer-motion";
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4,
};

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Tab transition variants
export const tabVariants: Variants = {
  initial: {
    opacity: 0,
    x: 10,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -10,
  },
};

export const tabTransition: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.2,
};

// Stagger animation for lists
export const staggerContainer: Variants = {
  initial: {},
  in: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.3,
    },
  },
};

// Micro-interactions
export const hoverScale = {
  scale: 1.02,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
} as const;

export const tapScale = {
  scale: 0.98,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
} as const;

// Loading animation
export const loadingVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};