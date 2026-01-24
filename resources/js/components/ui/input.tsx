import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<React.ComponentProps<"input">, "prefix"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  prefix?: string; 
  suffix?: string;
  onSuffixClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onEndIconClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Input({
  className,
  type = "text",
  startIcon,
  endIcon,
  prefix,
  suffix,
  onSuffixClick,
  onEndIconClick,
  ...props
}: InputProps) {
  const hasLeftAdornment = Boolean(startIcon || prefix);
  const hasRightAdornment = Boolean(endIcon || suffix);

  return (
    <div
      className={cn(  
        "flex items-center w-full rounded-md bg-transparent",
        "border border-input px-3 py-1.5 h-9",
        "focus-within:ring-blue/70 focus-within:ring-1",
        className
      )}
    >
      {/* Left icon or prefix (decorative) */}
      {startIcon && (
        <span
          className="me-2 pointer-events-none text-muted-foreground flex items-center"
          aria-hidden="true"
        >
          {startIcon}
        </span>
      )}

      {prefix && (
        <span
          className="pointer-events-none text-muted-foreground text-sm"
          aria-hidden="true"
        >
          {prefix}
        </span>
      )}

      {/* Input element with padding to avoid overlap with adornments */}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "w-full bg-transparent outline-none text-base md:text-sm",
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      />

      {/* Right suffix (text) or clickable suffix */}
      {suffix && (
        onSuffixClick ? (
          <button
            type="button"
            onClick={onSuffixClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm flex items-center"
            aria-label="suffix action"
          >
            {suffix}
          </button>
        ) : (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm flex items-center pointer-events-none"
            aria-hidden="true"
          >
            {suffix}
          </span>
        )
      )}

      {/* Right icon (clickable) */}
      {endIcon && (
        <button
          type="button"
          onClick={onEndIconClick}
          className="text-muted-foreground flex items-center cursor-pointer"
          aria-label="end icon"
        >
          {endIcon}
        </button>
      )}
    </div>
  );
}
