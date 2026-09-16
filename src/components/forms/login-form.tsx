"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { loginUser } from "@/api";
import { Button } from "@/components/ui/button";
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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authKeys } from "@/constants/query-keys";
import { authChannel } from "@/lib/auth-channel";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/validators";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const toastId = toast.loading("Logging in to your account...");

      try {
        const response = await loginUser(value);
        if (response?.data?.user) {
          queryClient.setQueryData(authKeys.currentUser(), response.data.user);
        }

        // Notify other browser tabs that a session has started
        authChannel.postMessage({ type: "LOGIN" });

        toast.success(response?.message || "Login successful! Redirecting...", {
          id: toastId,
        });

        // Determine destination URL preserving original query context
        const redirectParam = searchParams.get("redirect");
        const safeDestination =
          redirectParam?.startsWith("/") && !redirectParam.startsWith("//")
            ? redirectParam
            : "/dashboard";

        router.push(safeDestination);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to log in. Please check your credentials and try again.";
        setServerError(message);
        toast.error(message, {
          id: toastId,
        });
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {serverError && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-center text-sm font-medium text-destructive dark:bg-destructive/20"
                >
                  {serverError}
                </div>
              )}

              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="m@example.com"
                        autoComplete="email"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Field>
                    <Button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                    <FieldDescription className="text-center">
                      Want to get new admission?{" "}
                      <Link
                        href="/onboard-student"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Apply
                      </Link>
                    </FieldDescription>
                  </Field>
                )}
              </form.Subscribe>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Field>
                <Button variant="outline" type="button" className="w-full">
                  <Image
                    src="/google-logo.png"
                    alt="Google Login"
                    width={18}
                    height={18}
                    className="mr-2"
                  />
                  Login with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
