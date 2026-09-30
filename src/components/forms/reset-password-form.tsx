"use client";

import { useForm } from "@tanstack/react-form";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { resetPassword } from "@/api";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import {
  evaluatePassword,
  PasswordStrengthIndicator,
} from "@/components/ui/password-strength-indicator";
import { cn } from "@/lib/utils";
import { resetPasswordSchema } from "@/validators";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token")?.trim();
  const userEmail = searchParams.get("email")?.trim();

  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const resetForm = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!resetToken) {
        setServerError(
          "Password reset token is missing. Please use the link provided in your email or request a new one.",
        );
        return;
      }

      setServerError(null);
      const toastId = toast.loading("Updating your password...");

      try {
        await resetPassword({
          password: value.password,
          token: resetToken,
        });
        setIsSuccess(true);
        toast.success("Password updated successfully!", { id: toastId });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to reset password. The reset link may have expired or is invalid.";
        setServerError(message);
        toast.error(message, { id: toastId });
      }
    },
  });

  // State 1: Password Reset Successful
  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-border/80 shadow-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-6" />
            </div>
            <CardTitle className="font-heading text-xl">
              Password Reset Complete
            </CardTitle>
            <CardDescription className="text-sm">
              Your password has been changed successfully. You can now log in
              with your new credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-10 shadow-sm",
              )}
            >
              Sign In to Your Account
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // State 2: Missing Token in URL
  if (!resetToken) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-border/80 shadow-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-6" />
            </div>
            <CardTitle className="font-heading text-xl">
              Invalid or Missing Link
            </CardTitle>
            <CardDescription className="text-xs">
              This password reset link is missing a verification token. Please
              request a new link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/forgot-password"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-10 shadow-sm",
              )}
            >
              Request New Reset Link
            </Link>
            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // State 3: Active Reset Form with Token
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/80 shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <KeyRound className="size-6" />
          </div>
          <CardTitle className="font-heading text-xl">
            Set New Password
          </CardTitle>
          <CardDescription className="text-xs">
            {userEmail ? (
              <span>
                Resetting password for{" "}
                <span className="font-medium text-foreground">{userEmail}</span>
              </span>
            ) : (
              "Please choose a strong password to secure your account."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              resetForm.handleSubmit();
            }}
            className="space-y-4"
          >
            {serverError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
                {serverError}
              </div>
            )}

            <FieldGroup className="space-y-4">
              <resetForm.Field name="password">
                {(field) => {
                  const isTouched = field.state.meta.isTouched;
                  const errors = field.state.meta.errors;
                  const hasError = isTouched && errors.length > 0;

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                      <PasswordInput
                        id={field.name}
                        name={field.name}
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={hasError}
                      />
                      {hasError && <FieldError errors={errors} />}
                    </Field>
                  );
                }}
              </resetForm.Field>

              <resetForm.Field name="confirmPassword">
                {(field) => {
                  const isTouched = field.state.meta.isTouched;
                  const errors = field.state.meta.errors;
                  const hasError = isTouched && errors.length > 0;

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Confirm New Password
                      </FieldLabel>
                      <PasswordInput
                        id={field.name}
                        name={field.name}
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={hasError}
                      />
                      {hasError && <FieldError errors={errors} />}
                    </Field>
                  );
                }}
              </resetForm.Field>
            </FieldGroup>

            {/* Live Password Strength and Requirements Checklist */}
            <resetForm.Subscribe
              selector={(state) => [
                state.values.password,
                state.values.confirmPassword,
              ]}
            >
              {([password, confirmPassword]) => (
                <PasswordStrengthIndicator
                  password={password}
                  confirmPassword={confirmPassword}
                />
              )}
            </resetForm.Subscribe>

            <resetForm.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
                password: state.values.password,
                confirmPassword: state.values.confirmPassword,
              })}
            >
              {({ canSubmit, isSubmitting, password, confirmPassword }) => {
                const { isAllMet } = evaluatePassword(
                  password,
                  confirmPassword,
                );
                return (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || !isAllMet}
                    className="w-full h-10 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Saving New Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                );
              }}
            </resetForm.Subscribe>

            <div className="text-center pt-1">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
