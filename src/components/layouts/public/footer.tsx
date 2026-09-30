import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import AppLogo from "@/assets/svg/logo";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/60 bg-card/40 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
              aria-label={`${siteConfig.name} Home`}
            >
              <AppLogo size={0.65} priority />
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {siteConfig.tagline}. High-precision academic lifecycle management
              for coaching administrators, teachers, and enrolled students.
            </p>

            <div className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Institutional Access &amp; Verified Portals</span>
            </div>
          </div>

          {/* Direct Portal Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
              Portal Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/onboard-student"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Student Self-Admission
                </Link>
              </li>
              <li>
                <Link
                  href="/forgot-password"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset Forgotten Password
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Administrative Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Campus Coordinates */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
              Campus Support
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <span>{siteConfig.campusAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary shrink-0" />
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="hover:text-foreground transition-colors"
                >
                  {siteConfig.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-primary shrink-0" />
                <a
                  href={`tel:${siteConfig.supportPhone.replace(/\s+/g, "")}`}
                  className="hover:text-foreground transition-colors"
                >
                  {siteConfig.supportPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </span>
            <span>Academic Session {siteConfig.academicYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
