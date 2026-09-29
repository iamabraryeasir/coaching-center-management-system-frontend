"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword, resetPassword } from "@/api";
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
import { forgotPasswordSchema, resetPasswordSchema } from "@/validators";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  // Mode 1: Request Password Recovery Link
  const forgotForm = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const toastId = toast.loading("Sending recovery instructions...");

      try {
        await forgotPassword({ email: value.email.trim().toLowerCase() });
        setIsSuccess(true);
        setSuccessMessage(
          `We have sent a password recovery link to ${value.email}. Please check your inbox and spam folder.`,
        );
        toast.success("Recovery email sent successfully!", { id: toastId });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to send password recovery email. Please check the email address and try again.";
        setServerError(message);
        toast.error(message, { id: toastId });
      }
    },
  });

  // Mode 2: Reset Password using Token
  const resetForm = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const toastId = toast.loading("Resetting your password...");

      try {
        await resetPassword({
          password: value.password,
          token: resetToken || undefined,
        });
        setIsSuccess(true);
        setSuccessMessage(
          "Your password has been successfully reset. You can now log in with your new password.",
        );
        toast.success("Password reset successfully!", { id: toastId });
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

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-border/80 shadow-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-6" />
            </div>
            <CardTitle className="font-heading text-xl">
              {resetToken ? "Password Reset Complete" : "Check Your Email"}
            </CardTitle>
            <CardDescription className="text-sm">
              {successMessage}
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
              Return to Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If token is provided in URL, show Set New Password form
  if (resetToken) {
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
              Please enter your new password below to regain access.
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
                        <FieldLabel htmlFor={field.name}>
                          New Password
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          placeholder="••••••••"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                        />
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
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
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
                        Saving Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                )}
              </resetForm.Subscribe>

              <div className="text-center">
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

  // Default mode: Request Recovery Link
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/80 shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-6" />
          </div>
          <CardTitle className="font-heading text-xl">
            Reset Password
          </CardTitle>
          <CardDescription className="text-xs">
            Enter your registered email address and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              forgotForm.handleSubmit();
            }}
            className="space-y-4"
          >
            {serverError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
                {serverError}
              </div>
            )}

            <FieldGroup className="space-y-4">
              <forgotForm.Field name="email">
                {(field) => {
                  const isTouched = field.state.meta.isTouched;
                  const errors = field.state.meta.errors;
                  const hasError = isTouched && errors.length > 0;

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={hasError}
                      />
                      {hasError ? (
                        <FieldError errors={errors} />
                      ) : (
                        <FieldDescription>
                          We&apos;ll never share your email with anyone else.
                        </FieldDescription>
                      )}
                    </Field>
                  );
                }}
              </forgotForm.Field>
            </FieldGroup>

            <forgotForm.Subscribe
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
                      Sending Instructions...
                    </>
                  ) : (
                    "Send Recovery Link"
                  )}
                </Button>
              )}
            </forgotForm.Subscribe>

            <div className="text-center">
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
