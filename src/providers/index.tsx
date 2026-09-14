import type { ReactNode } from "react";
import QueryProvider from "./query-provider";
import ToastProvider from "./toast-provider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <ToastProvider />
    </QueryProvider>
  );
}
