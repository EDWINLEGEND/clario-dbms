"use client";

import { useState, useRef, useEffect } from "react";
import { Input, Button, Kbd } from "@heroui/react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "bordered" | "faded" | "underlined";
  showShortcut?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

export function SearchBar({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  onClear,
  className,
  size = "md",
  variant = "bordered",
  showShortcut = true,
  autoFocus = false,
  disabled = false,
  loading = false,
  suggestions = [],
  onSuggestionSelect
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentValue = onChange ? value : internalValue;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setShowSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleValueChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(currentValue);
    }
    setShowSuggestions(false);
  };

  const handleClear = () => {
    const newValue = "";
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
    if (onClear) {
      onClear();
    }
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    handleValueChange(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(currentValue.toLowerCase())
  ).slice(0, 5);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        onFocus={() => {
          setIsFocused(true);
          if (currentValue.length > 0 && suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        onBlur={() => setIsFocused(false)}
        size={size}
        variant={variant}
        disabled={disabled}
        className={cn(
          "transition-all duration-300",
          "focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "bg-background/50 backdrop-blur-sm",
          isFocused && "shadow-lg scale-[1.02]"
        )}
        classNames={{
          input: "text-sm pl-2 pr-2",
          inputWrapper: "h-10 px-3",
          label: "text-sm font-medium",
          mainWrapper: "h-auto",
        }}
        startContent={
          <motion.div
            animate={{ 
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? "var(--primary-500)" : "var(--muted)"
            }}
            transition={{ duration: 0.2 }}
          >
            <Search className="h-4 w-4" />
          </motion.div>
        }
        endContent={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {currentValue && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={handleClear}
                    className="min-w-unit-6 w-6 h-6 hover:bg-danger/10 hover:text-danger"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {showShortcut && !isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden sm:flex items-center gap-1"
              >
                <Kbd keys={["command"]}>K</Kbd>
              </motion.div>
            )}
            
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
              />
            )}
          </div>
        }
      />
      
      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute top-full left-0 right-0 z-50 mt-2",
              "bg-card border border-border rounded-lg shadow-xl",
              "backdrop-blur-sm overflow-hidden"
            )}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "w-full px-4 py-3 text-left text-sm",
                  "hover:bg-surface-hover transition-colors duration-200",
                  "border-b border-border last:border-b-0",
                  "focus:outline-none focus:bg-surface-hover"
                )}
              >
                <div className="flex items-center gap-3">
                  <Search className="h-3 w-3 text-muted" />
                  <span className="text-foreground">{suggestion}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Specialized search bars for different contexts
export function HeaderSearchBar(props: Omit<SearchBarProps, 'size' | 'variant'>) {
  return (
    <SearchBar
      size="sm"
      variant="bordered"
      className="max-w-md"
      {...props}
    />
  );
}

export function PageSearchBar(props: Omit<SearchBarProps, 'size' | 'variant'>) {
  return (
    <SearchBar
      size="md"
      variant="faded"
      className="max-w-lg"
      {...props}
    />
  );
}

export function CompactSearchBar(props: Omit<SearchBarProps, 'size' | 'showShortcut'>) {
  return (
    <SearchBar
      size="sm"
      showShortcut={false}
      {...props}
    />
  );
}