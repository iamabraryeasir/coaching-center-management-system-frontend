"use client";

import { useForm } from "@tanstack/react-form";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetPasswordSchema } from "@/validators";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token")?.trim();
  const userEmail = searchParams.get("email")?.trim();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          tabIndex={-1}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                      {hasError ? (
                        <FieldError errors={errors} />
                      ) : (
                        <FieldDescription>
                          Must be at least 8 characters long.
                        </FieldDescription>
                      )}
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
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          tabIndex={-1}
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                      {hasError && <FieldError errors={errors} />}
                    </Field>
                  );
                }}
              </resetForm.Field>
            </FieldGroup>

            <resetForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
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
              )}
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
