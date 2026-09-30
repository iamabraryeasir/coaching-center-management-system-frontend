"use client";

import { Check, ShieldAlert, X } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordStrengthIndicatorProps
  extends React.ComponentProps<"div"> {
  password: string;
  confirmPassword?: string;
  showChecklist?: boolean;
}

export function evaluatePassword(
  password: string,
  confirmPassword?: string,
): {
  requirements: PasswordRequirement[];
  score: number;
  label: string;
  colorClass: string;
  barColorClass: string;
  isAllMet: boolean;
} {
  const reqs: PasswordRequirement[] = [
    {
      id: "length",
      label: "8 to 128 characters long",
      met: password.length >= 8 && password.length <= 128,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "At least one digit (0-9)",
      met: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "At least one special character (!@#$%...)",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  if (confirmPassword !== undefined) {
    reqs.push({
      id: "match",
      label: "Passwords match",
      met: Boolean(password && confirmPassword && password === confirmPassword),
    });
  }

  const metCount = reqs.filter((r) => r.met).length;
  const baseReqsCount =
    confirmPassword !== undefined ? reqs.length - 1 : reqs.length;
  const baseMetCount = reqs.slice(0, baseReqsCount).filter((r) => r.met).length;

  let score = 0;
  let label = "Weak";
  let colorClass = "text-rose-500 dark:text-rose-400";
  let barColorClass = "bg-rose-500";

  if (password.length > 0) {
    if (baseMetCount <= 2) {
      score = 1;
      label = "Weak";
      colorClass = "text-rose-500 dark:text-rose-400";
      barColorClass = "bg-rose-500";
    } else if (baseMetCount === 3 || baseMetCount === 4) {
      score = 2;
      label = "Medium";
      colorClass = "text-amber-500 dark:text-amber-400";
      barColorClass = "bg-amber-500";
    } else if (baseMetCount === 5) {
      score = 3;
      label = "Strong";
      colorClass = "text-emerald-500 dark:text-emerald-400";
      barColorClass = "bg-emerald-500";
    }
  }

  const isAllMet = metCount === reqs.length;

  return {
    requirements: reqs,
    score,
    label,
    colorClass,
    barColorClass,
    isAllMet,
  };
}

export function PasswordStrengthIndicator({
  password,
  confirmPassword,
  showChecklist = true,
  className,
  ...props
}: PasswordStrengthIndicatorProps) {
  const { requirements, score, label, colorClass, barColorClass } =
    evaluatePassword(password, confirmPassword);

  if (!password && !confirmPassword) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border/70 bg-muted/30 p-3 space-y-2.5 text-xs transition-all",
        className,
      )}
      {...props}
    >
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            <ShieldAlert className="size-3" />
            Password Strength:
          </span>
          <span className={cn("font-semibold", colorClass)}>{label}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div
            className={cn(
              "h-1.5 rounded-full transition-colors",
              score >= 1 ? barColorClass : "bg-muted-foreground/20",
            )}
          />
          <div
            className={cn(
              "h-1.5 rounded-full transition-colors",
              score >= 2 ? barColorClass : "bg-muted-foreground/20",
            )}
          />
          <div
            className={cn(
              "h-1.5 rounded-full transition-colors",
              score >= 3 ? barColorClass : "bg-muted-foreground/20",
            )}
          />
        </div>
      </div>

      {/* Interactive Checklist */}
      {showChecklist && (
        <div className="space-y-1 pt-1 border-t border-border/50 text-[11px]">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={cn(
                "flex items-center gap-2 transition-colors",
                req.met
                  ? "text-foreground font-medium"
                  : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-3.5 rounded-full flex items-center justify-center text-[9px] transition-colors shrink-0",
                  req.met
                    ? "bg-emerald-500 text-white dark:bg-emerald-600"
                    : "bg-muted-foreground/20 text-muted-foreground",
                )}
              >
                {req.met ? (
                  <Check className="size-2.5 stroke-[3]" />
                ) : (
                  <X className="size-2 opacity-50" />
                )}
              </span>
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
