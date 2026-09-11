import type { ReactNode } from "react";
import QueryProvider from "./query-provider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
