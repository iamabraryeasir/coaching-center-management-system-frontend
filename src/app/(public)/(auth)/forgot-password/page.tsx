import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AppLogo from "@/assets/svg/logo";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Reset Password | ${siteConfig.name}`,
  description: "Recover access to your account via email verification link.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <AppLogo size={0.5} />
          {siteConfig.name}
        </Link>
        <Suspense
          fallback={
            <div className="h-80 w-full animate-pulse rounded-xl bg-card" />
          }
        >
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
