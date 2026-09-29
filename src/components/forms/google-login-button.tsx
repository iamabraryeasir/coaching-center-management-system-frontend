"use client";

import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";

import { useGoogleAuthMutation } from "@/hooks/use-auth";
import { getSafeRedirect } from "@/lib/safe-redirect";
import { cn } from "@/lib/utils";
import type { GoogleAuthResponseData } from "@/types";

interface GoogleLoginButtonProps {
  className?: string;
  label?: string;
  redirectUrl?: string;
}

export function GoogleLoginButton({
  className,
  redirectUrl,
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleMutation = useGoogleAuthMutation();

  const handleCredentialSuccess = useCallback(
    async (credential: string) => {
      const toastId = toast.loading("Verifying Google account...");
      try {
        const result = await googleMutation.mutateAsync({
          idToken: credential,
        });

        const data: GoogleAuthResponseData | undefined = result?.data;

        if (data?.isNewUser) {
          // Case 1: First-time student applicant needs onboarding
          toast.success("Google account verified! Please complete admission.", {
            id: toastId,
          });

          // TODO(security): Backend should issue a short-lived HttpOnly
          // `onboarding_session` cookie on `isNewUser` responses so this
          // sessionStorage usage can be removed entirely (Security Review C-1).
          // When the backend is updated, remove this block and rely on the cookie.
          const onboardingData = {
            // googleId intentionally NOT stored here — minimise PII in sessionStorage.
            // The backend must derive identity from its own session on form submit.
            email: data.email || "",
            name: data.name || "",
            avatarUrl: data.avatarUrl || null,
          };
          sessionStorage.setItem(
            "pending_google_user",
            JSON.stringify(onboardingData),
          );

          router.push("/onboard-student");
        } else {
          // Case 2: Existing approved student logged in directly
          toast.success("Welcome back! Redirecting to student dashboard...", {
            id: toastId,
          });

          // Validate the redirect target to prevent open redirect attacks (C-2)
          const target = getSafeRedirect(
            redirectUrl ?? searchParams.get("redirect"),
            "/dashboard",
          );
          router.push(target);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Google authentication failed. Please try again.";
        toast.error(message, { id: toastId });
      }
    },
    [googleMutation, redirectUrl, router, searchParams],
  );

  return (
    <div
      className={cn(
        "w-full flex items-center justify-center min-h-10 overflow-hidden [&>div]:max-w-full [&_iframe]:max-w-full [&_iframe]:rounded-lg",
        className,
      )}
    >
      <GoogleLogin
        onSuccess={(credentialResponse: CredentialResponse) => {
          if (credentialResponse.credential) {
            handleCredentialSuccess(credentialResponse.credential);
          } else {
            toast.error(
              "Google authentication failed. No credential received.",
            );
          }
        }}
        onError={() => {
          toast.error(
            "Google sign-in was cancelled or failed. Please try again.",
          );
        }}
        type="standard"
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="center"
        width="320"
      />
    </div>
  );
}
