import type { ReactNode } from "react";
import Footer from "@/components/layouts/public/footer";
import Header from "@/components/layouts/public/header";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <Header />

      {/* Inner Page Content */}
      <main className="flex-1">{children}</main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
