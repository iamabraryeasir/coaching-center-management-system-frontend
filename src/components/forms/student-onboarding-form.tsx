"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  Phone,
  School,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGoogleOnboardingMutation } from "@/hooks/use-auth";
import type { GoogleOnboardDto } from "@/types";
import { type GoogleOnboardInput, googleOnboardSchema } from "@/validators";

interface GoogleProfile {
  // TODO(security): Backend should issue an HttpOnly onboarding_session cookie
  // on isNewUser response so googleId does not need to pass through sessionStorage (C-1).
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}

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
  return String(error);
}

export function StudentOnboardingForm() {
  const router = useRouter();
  const [googleProfile, setGoogleProfile] = useState<GoogleProfile | null>(
    null,
  );
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] =
    useState<Partial<GoogleOnboardDto> | null>(null);

  const onboardMutation = useGoogleOnboardingMutation();

  // Load any pending Google user stored from login or One-Tap
  // Protect route: Only users verified via Google OAuth with pending admission may enter
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("pending_google_user");
      if (stored) {
        const parsed = JSON.parse(stored) as GoogleProfile;
        if (parsed.email) {
          setGoogleProfile(parsed);
          setIsCheckingAuth(false);
          return;
        }
      }
    } catch {
      // sessionStorage empty or invalid
    }

    // Direct access or unauthenticated visit -> notify and redirect to home page
    toast.error("Please sign in with Google to apply for student admission.");
    router.replace("/");
  }, [router]);

  const form = useForm({
    defaultValues: {
      googleId: googleProfile?.googleId || "",
      email: googleProfile?.email || "",
      name: googleProfile?.name || "",
      phone: "",
      guardianName: "",
      guardianPhone: "",
      institutionName: "",
      classLevel: "",
      rollNumber: "",
      avatarUrl: googleProfile?.avatarUrl || null,
      gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
    } as GoogleOnboardInput,
    validators: {
      onSubmit: googleOnboardSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Submitting admission application...");

      try {
        const payload: GoogleOnboardDto = {
          // googleId: backend derives this from its own OAuth/session state (C-1)
          googleId: googleProfile?.googleId || "",
          email: (value.email || googleProfile?.email || "")
            .trim()
            .toLowerCase(),
          name: (value.name || googleProfile?.name || "").trim(),
          phone: value.phone.trim().replace(/[\s-]/g, ""),
          guardianName: value.guardianName.trim(),
          guardianPhone: value.guardianPhone.trim().replace(/[\s-]/g, ""),
          institutionName: value.institutionName.trim(),
          classLevel: value.classLevel.trim(),
          rollNumber: value.rollNumber.trim(),
          avatarUrl: value.avatarUrl || googleProfile?.avatarUrl || null,
          gender: value.gender,
        };

        await onboardMutation.mutateAsync(payload);

        // Clear temporary Google session
        sessionStorage.removeItem("pending_google_user");

        setSubmittedData(payload);
        setIsSubmitted(true);

        toast.success(
          "Application submitted successfully! Awaiting administrative approval.",
          { id: toastId },
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to submit admission application. Please check your inputs.";
        toast.error(message, { id: toastId });
      }
    },
  });

  // Keep form values in sync when googleProfile is loaded/updated
  useEffect(() => {
    if (googleProfile) {
      if (googleProfile.googleId) {
        form.setFieldValue("googleId", googleProfile.googleId);
      }
      if (googleProfile.email) {
        form.setFieldValue("email", googleProfile.email);
      }
      if (googleProfile.name) {
        form.setFieldValue("name", googleProfile.name);
      }
      if (googleProfile.avatarUrl) {
        form.setFieldValue("avatarUrl", googleProfile.avatarUrl);
      }
    }
  }, [googleProfile, form]);

  // View 1: Application Successfully Submitted (Awaiting Approval)
  if (isSubmitted) {
    return (
      <Card className="w-full max-w-lg shadow-lg border-border/80">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight font-heading">
            Application Submitted!
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Your student admission application has been registered and is
            currently awaiting administrative review.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-semibold">
              <Clock className="size-4 shrink-0" />
              <span>Status: PENDING_ACTIVATION</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              An administrator will review your application details shortly.
              Once approved, you will be able to log in directly with your
              Google account (
              <span className="font-semibold text-foreground">
                {submittedData?.email}
              </span>
              ) to access your class schedule, batch routines, and payments.
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2.5 text-xs">
            <p className="font-semibold text-foreground">Application Summary</p>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div>
                <span className="text-[11px] block text-muted-foreground/80">
                  Student Name
                </span>
                <span className="font-medium text-foreground">
                  {submittedData?.name}
                </span>
              </div>
              <div>
                <span className="text-[11px] block text-muted-foreground/80">
                  Institution
                </span>
                <span className="font-medium text-foreground">
                  {submittedData?.institutionName}
                </span>
              </div>
              <div>
                <span className="text-[11px] block text-muted-foreground/80">
                  Class / Level
                </span>
                <span className="font-medium text-foreground">
                  {submittedData?.classLevel}
                </span>
              </div>
              <div>
                <span className="text-[11px] block text-muted-foreground/80">
                  Roll / ID Number
                </span>
                <span className="font-medium text-foreground">
                  {submittedData?.rollNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" className="w-full">
              <Button className="w-full gap-2 font-medium" size="default">
                <span>Go to Student Login</span>
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full gap-2 text-xs"
                size="sm"
              >
                <ArrowLeft className="size-3.5" />
                <span>Return to Homepage</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Guard: If authentication is being verified or unauthenticated, show loading state while redirecting
  if (isCheckingAuth || !googleProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">
          Verifying Google admission session...
        </p>
      </div>
    );
  }

  // View 2: Complete Admission Profile Form (Google Verified)
  return (
    <Card className="w-full max-w-xl shadow-lg border-border/80">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-xs font-semibold text-primary">
              <GraduationCap className="size-3" />
              <span>Step 2 of 2: Admission Form</span>
            </div>
            <CardTitle className="text-xl font-bold font-heading">
              Student Profile & Details
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter your academic and guardian details to complete your
              enrollment request.
            </CardDescription>
          </div>

          {/* Google Verified Account Badge */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/40 border border-border/60 shrink-0">
            {googleProfile.avatarUrl ? (
              <Image
                unoptimized
                src={googleProfile.avatarUrl}
                alt={googleProfile.name}
                width={36}
                height={36}
                className="rounded-full size-9 object-cover border border-border"
              />
            ) : (
              <div className="size-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                {googleProfile.name?.slice(0, 2).toUpperCase() || "ST"}
              </div>
            )}
            <div className="hidden sm:block text-left text-[11px] leading-tight max-w-32.5 truncate">
              <p className="font-semibold text-foreground truncate">
                {googleProfile.name}
              </p>
              <Badge
                variant="outline"
                className="text-[9px] px-1 py-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              >
                Google Verified
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form
          id="student-onboard-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* Section 1: Academic & Institution */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 pb-1 border-b border-border/60">
              <School className="size-3.5 text-primary" />
              <span>Academic Information</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Institution Name */}
              <form.Field name="institutionName">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const firstError = field.state.meta.errors[0];
                  return (
                    <Field className="space-y-1 sm:col-span-2">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        School / College Name{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. Dhaka City College, Notre Dame College"
                        aria-invalid={isInvalid}
                        className="h-9 text-xs"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={[{ message: getErrorMessage(firstError) }]}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Class / Academic Level */}
              <form.Field name="classLevel">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const firstError = field.state.meta.errors[0];
                  return (
                    <Field className="space-y-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Class / Academic Level{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. HSC-2025, Class 10"
                        aria-invalid={isInvalid}
                        className="h-9 text-xs"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={[{ message: getErrorMessage(firstError) }]}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Student Roll / ID */}
              <form.Field name="rollNumber">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const firstError = field.state.meta.errors[0];
                  return (
                    <Field className="space-y-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Roll / Student ID{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. 105, 2024-A-12"
                        aria-invalid={isInvalid}
                        className="h-9 text-xs"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={[{ message: getErrorMessage(firstError) }]}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
          </div>

          {/* Section 2: Personal & Contact */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 pb-1 border-b border-border/60">
              <UserIcon className="size-3.5 text-primary" />
              <span>Personal & Contact Information</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const firstError = field.state.meta.errors[0];
                  return (
                    <Field className="space-y-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Student Full Name{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Full Name"
                        aria-invalid={isInvalid}
                        className="h-9 text-xs"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={[{ message: getErrorMessage(firstError) }]}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Verified Email (Readonly) */}
              <form.Field name="email">
                {(field) => (
                  <Field className="space-y-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-medium"
                    >
                      Google Verified Email
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      readOnly
                      disabled
                      className="h-9 text-xs bg-muted/50 cursor-not-allowed font-mono text-muted-foreground"
                    />
                  </Field>
                )}
              </form.Field>

              {/* Student Phone */}
              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const firstError = field.state.meta.errors[0];
                  return (
                    <Field className="space-y-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Student Mobile Phone{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="017XXXXXXXX"
                        aria-invalid={isInvalid}
                        className="h-9 text-xs"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={[{ message: getErrorMessage(firstError) }]}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Gender */}
              <form.Field name="gender">
                {(field) => (
                  <Field className="space-y-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-medium"
                    >
                      Gender <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(val as "MALE" | "FEMALE" | "OTHER")
                      }
                    >
                      <SelectTrigger id={field.name} className="h-9 text-xs">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
            </div>
          </div>

          {/* Section 3: Guardian Details */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 pb-1 border-b border-border/60">
              <Phone className="size-3.5 text-primary" />
              <span>Parent / Guardian Information</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Guardian Name */}
              <form.Field name="guardianName">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const firstError = field.state.meta.errors[0];
                  return (
                    <Field className="space-y-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Guardian Name{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Father / Mother / Guardian"
                        aria-invalid={isInvalid}
                        className="h-9 text-xs"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={[{ message: getErrorMessage(firstError) }]}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Guardian Phone */}
              <form.Field name="guardianPhone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const firstError = field.state.meta.errors[0];
                  return (
                    <Field className="space-y-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Guardian Mobile Phone{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="018XXXXXXXX"
                        aria-invalid={isInvalid}
                        className="h-9 text-xs"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={[{ message: getErrorMessage(firstError) }]}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
          </div>

          {/* Form Actions */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <div className="pt-3 space-y-2">
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full gap-2 font-medium"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  <span>
                    {isSubmitting
                      ? "Submitting Application..."
                      : "Submit Admission Application"}
                  </span>
                </Button>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem("pending_google_user");
                      setGoogleProfile(null);
                      router.replace("/");
                    }}
                    className="hover:text-destructive hover:underline text-[11px]"
                  >
                    Cancel & Return Home
                  </button>
                  <Link
                    href="/login"
                    className="hover:text-primary hover:underline text-[11px]"
                  >
                    Already admitted? Log in &rarr;
                  </Link>
                </div>
              </div>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
