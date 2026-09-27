"use client";

import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePasswordMutation } from "@/hooks";
import { changePasswordSchema } from "@/validators";

function getErrorMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Failed to change password. Please verify your current password.";
}

export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordMutation = useChangePasswordMutation();

  const isLengthValid = newPassword.length >= 6;
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message;
      toast.error(firstIssue || "Please check password requirements.");
      return;
    }

    const toastId = toast.loading("Updating your password...");
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Password changed successfully!", { id: toastId });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId });
    }
  };

  return (
    <Card className="border-border/80 bg-card shadow-2xs">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KeyRound className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground font-heading">
              Change Account Password
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Update your administrative login credentials to maintain account
              security.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          {/* Current Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Current Password <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Input
                required
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="h-9 pr-9 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
              >
                {showCurrentPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              New Password <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Input
                required
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                className="h-9 pr-9 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Confirm New Password <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Input
                required
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="h-9 pr-9 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Requirements Checklist */}
          {newPassword.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ShieldAlert className="size-3 text-muted-foreground shrink-0" />
                <span className="font-medium">Password requirements:</span>
              </div>
              <div className="flex items-center gap-2 pl-4">
                <span
                  className={`size-3 rounded-full flex items-center justify-center text-[9px] ${
                    isLengthValid
                      ? "bg-emerald-500 text-white"
                      : "bg-muted-foreground/30 text-transparent"
                  }`}
                >
                  <Check className="size-2" />
                </span>
                <span
                  className={
                    isLengthValid
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }
                >
                  Minimum 6 characters long
                </span>
              </div>
              <div className="flex items-center gap-2 pl-4">
                <span
                  className={`size-3 rounded-full flex items-center justify-center text-[9px] ${
                    isMatch
                      ? "bg-emerald-500 text-white"
                      : "bg-muted-foreground/30 text-transparent"
                  }`}
                >
                  <Check className="size-2" />
                </span>
                <span
                  className={
                    isMatch
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }
                >
                  Passwords match
                </span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              size="sm"
              disabled={
                changePasswordMutation.isPending ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                !isLengthValid ||
                !isMatch
              }
              className="gap-1.5 text-xs font-semibold"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Changing Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="size-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
