"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          fontSize: "0.875rem",
          fontWeight: "500",
          boxShadow: "0 4px 12px oklch(0 0 0 / 10%)",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "oklch(0.623 0.214 259.815)",
            secondary: "white",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "var(--destructive)",
            secondary: "white",
          },
        },
        loading: {
          iconTheme: {
            primary: "var(--primary)",
            secondary: "white",
          },
        },
      }}
    />
  );
}
