import Link from "next/link";
import AppLogo from "@/assets/svg/logo";
import { LoginForm } from "@/components/forms/login-form";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
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
        <LoginForm />
      </div>
    </div>
  );
}
