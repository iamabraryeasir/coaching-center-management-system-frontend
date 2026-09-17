import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthListener from "./auth-listener";
import QueryProvider from "./query-provider";
import ToastProvider from "./toast-provider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <AuthListener />
      <ToastProvider />
    </QueryProvider>
  );
}
