"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  /**
   * Optional custom toggle button class
   */
  toggleClassName?: string;
}

export function PasswordInput({
  className,
  toggleClassName,
  disabled,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative w-full">
      <Input
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setShowPassword((prev) => !prev)}
        tabIndex={-1}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className={cn(
          "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground focus:outline-none focus-visible:text-foreground transition-colors disabled:pointer-events-none disabled:opacity-50",
          toggleClassName,
        )}
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
}
