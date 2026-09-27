"use client";

import {
  Building2,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useInstitutionProfile } from "@/hooks";

export function TeacherInstitutionCard() {
  const { data: profileResponse, isLoading } = useInstitutionProfile();
  const profile = profileResponse?.data;

  const institutionName = profile?.institutionName || siteConfig.name;
  const institutionAddress =
    profile?.institutionAddress || siteConfig.campusAddress;
  const institutionPhone = profile?.institutionPhone || siteConfig.supportPhone;
  const institutionEmail = profile?.institutionEmail || siteConfig.supportEmail;
  const tagline = profile?.tagline || siteConfig.tagline;

  const stats = profile?.stats || {
    totalStudents: profile?.totalStudents ?? 0,
    totalTeachers: profile?.totalTeachers ?? 0,
    totalBatches: profile?.totalBatches ?? 0,
  };

  return (
    <div className="space-y-6">
      {/* 1. Institution Identity Header */}
      <Card className="border-border/80 bg-card shadow-2xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground font-heading">
                Campus & Institution Details
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Official coaching center branding, campus directory, and contact
                helplines.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary font-heading text-xl shrink-0">
              {(institutionName || siteConfig.shortName)
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {institutionName}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Sparkles className="size-3 text-primary" />
                <span>{tagline}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                <span>Campus Location</span>
              </span>
              <p className="text-xs font-semibold text-foreground leading-relaxed">
                {institutionAddress}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Phone className="size-3.5 text-primary" />
                <span>Official Helpline</span>
              </span>
              <p className="text-xs font-semibold text-foreground">
                <a
                  href={`tel:${institutionPhone}`}
                  className="hover:text-primary transition-colors font-mono"
                >
                  {institutionPhone}
                </a>
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" />
                <span>Official Email</span>
              </span>
              <p className="text-xs font-semibold text-foreground truncate">
                <a
                  href={`mailto:${institutionEmail}`}
                  className="hover:text-primary transition-colors"
                >
                  {institutionEmail}
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Institutional Academic Size Ribbon */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Total Students</span>
            <GraduationCap className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground font-heading">
            {isLoading ? "..." : (stats.totalStudents ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Faculty Members</span>
            <UserCheck className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground font-heading">
            {isLoading ? "..." : (stats.totalTeachers ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Active Batches</span>
            <Layers className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground font-heading">
            {isLoading ? "..." : (stats.totalBatches ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
