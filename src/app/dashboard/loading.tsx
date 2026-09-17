import AppLogo from "@/assets/svg/logo";
import { siteConfig } from "@/config/site";

export default function DashboardLoading() {
  return (
    <output
      aria-live="polite"
      className="flex min-h-[70vh] w-full flex-1 flex-col items-center justify-center p-6"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="size-12 rounded-2xl bg-primary/10 motion-safe:animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AppLogo size={0.65} priority />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Loading dashboard portal...
          </p>
        </div>

        <span className="sr-only">Loading dashboard portal, please wait</span>
      </div>
    </output>
  );
}
