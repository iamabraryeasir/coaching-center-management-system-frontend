"use client";

import { KeyRound, Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  evaluatePassword,
  PasswordStrengthIndicator,
} from "@/components/ui/password-strength-indicator";
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

  const changePasswordMutation = useChangePasswordMutation();

  const { isAllMet } = evaluatePassword(newPassword, confirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message;
      toast.error(firstIssue || "Please satisfy all password requirements.");
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
            <PasswordInput
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="h-9 text-xs"
            />
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              New Password <span className="text-rose-500">*</span>
            </Label>
            <PasswordInput
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
              className="h-9 text-xs"
            />
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Confirm New Password <span className="text-rose-500">*</span>
            </Label>
            <PasswordInput
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="h-9 text-xs"
            />
          </div>

          {/* Live Password Strength & Requirements Checklist */}
          {newPassword.length > 0 && (
            <PasswordStrengthIndicator
              password={newPassword}
              confirmPassword={confirmPassword}
            />
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
                !isAllMet
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
