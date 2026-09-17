import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
