"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword } from "@/api";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
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
import { forgotPasswordSchema } from "@/validators";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  if (resetToken) {
    return <ResetPasswordForm className={className} {...props} />;
  }

  return <ForgotPasswordRequestForm className={className} {...props} />;
}

function ForgotPasswordRequestForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

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
        setSuccessEmail(value.email.trim());
        setIsSuccess(true);
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

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-border/80 shadow-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-6" />
            </div>
            <CardTitle className="font-heading text-xl">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-sm">
              We have sent password recovery instructions to{" "}
              <span className="font-medium text-foreground">
                {successEmail}
              </span>
              . Please check your inbox and spam folder.
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/80 shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-6" />
          </div>
          <CardTitle className="font-heading text-xl">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-xs">
            Enter your registered email address and we will send you a link to
            reset your password.
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
                      <FieldLabel htmlFor={field.name}>
                        Email Address
                      </FieldLabel>
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
