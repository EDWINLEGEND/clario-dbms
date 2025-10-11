import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Hook to check if the user prefers reduced motion
 * Respects the prefers-reduced-motion media query for accessibility
 */
export function useReducedMotion() {
  return useFramerReducedMotion();
}

/**
 * Hook to automatically adjust animation variants based on user's motion preferences
 * If user prefers reduced motion, returns variants that skip animations
 * 
 * @param variants - Framer Motion animation variants object
 * @returns Modified variants object that respects reduced motion preference
 */
export function useAnimationVariants<T extends Record<string, any>>(variants: T): T | { initial: string; animate: string } {
  const shouldReduceMotion = useFramerReducedMotion();
  
  if (shouldReduceMotion) {
    // Return static variants that skip animations
    return {
      initial: 'visible',
      animate: 'visible',
    } as any;
  }
  
  return variants;
}

/**
 * Hook to get transition props that respect reduced motion
 * Returns instant transitions if user prefers reduced motion
 * 
 * @param transition - Framer Motion transition configuration
 * @returns Modified transition that respects reduced motion preference
 */
export function useAccessibleTransition(transition?: any) {
  const shouldReduceMotion = useFramerReducedMotion();
  
  if (shouldReduceMotion) {
    return { duration: 0 };
  }
  
  return transition;
}

