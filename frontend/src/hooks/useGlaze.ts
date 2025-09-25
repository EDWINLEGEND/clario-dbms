import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface GlazeConfig {
  theme?: 'light' | 'dark' | 'auto'
  animations?: boolean
  reducedMotion?: boolean
}

interface GlazeStyles {
  glass: string
  card: string
  button: string
  input: string
  overlay: string
  gradient: string
}

export function useGlaze(config: GlazeConfig = {}) {
  const {
    theme = 'auto',
    animations = true,
    reducedMotion = false,
  } = config

  const styles = useMemo<GlazeStyles>(() => {
    const baseTransition = animations && !reducedMotion 
      ? 'transition-all duration-200 ease-in-out' 
      : ''

    return {
      glass: cn(
        'backdrop-blur-md bg-white/10 border border-white/20',
        'dark:bg-black/10 dark:border-white/10',
        baseTransition
      ),
      card: cn(
        'bg-white/80 backdrop-blur-sm border border-gray-200/50',
        'dark:bg-gray-900/80 dark:border-gray-700/50',
        'shadow-lg hover:shadow-xl',
        baseTransition
      ),
      button: cn(
        'bg-gradient-to-r from-blue-500 to-purple-600',
        'hover:from-blue-600 hover:to-purple-700',
        'text-white font-medium',
        'shadow-md hover:shadow-lg',
        baseTransition
      ),
      input: cn(
        'bg-white/50 backdrop-blur-sm border border-gray-300/50',
        'dark:bg-gray-800/50 dark:border-gray-600/50',
        'focus:bg-white/80 focus:border-blue-500/50',
        'dark:focus:bg-gray-800/80 dark:focus:border-blue-400/50',
        baseTransition
      ),
      overlay: cn(
        'bg-black/20 backdrop-blur-sm',
        'dark:bg-black/40',
        baseTransition
      ),
      gradient: cn(
        'bg-gradient-to-br from-blue-50 via-white to-purple-50',
        'dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20'
      ),
    }
  }, [theme, animations, reducedMotion])

  const applyGlaze = (variant: keyof GlazeStyles, additionalClasses?: string) => {
    return cn(styles[variant], additionalClasses)
  }

  return {
    styles,
    applyGlaze,
    theme,
    animations,
    reducedMotion,
  }
}

export default useGlaze