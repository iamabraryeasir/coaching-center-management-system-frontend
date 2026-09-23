"use client";

import {
  Calendar,
  DollarSign,
  Info,
  Mail,
  MapPin,
  Phone,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";

export function AdminSettingsView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <Settings className="size-3" />
          <span>Administration</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
          Institution Settings
        </h1>
        <p className="text-xs text-muted-foreground">
          View your institution profile and white-label branding information.
        </p>
      </div>

      {/* 2. Notice Banner */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-4 flex items-start gap-3">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-foreground">
            In-app editing in progress
          </p>
          <p className="text-muted-foreground">
            Dynamic profile editing will be available in a future release.
            Current details are loaded from your system configuration.
          </p>
        </div>
      </div>

      {/* 3. Main Form Card */}
      <Card className="p-6 bg-card border-border/80 shadow-2xs space-y-6">
        {/* Brand Identity */}
        <div>
          <h2 className="text-sm font-semibold text-foreground border-b border-border/60 pb-2 mb-4">
            Brand & Identity
          </h2>

          <div className="flex items-center gap-4 mb-5">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary font-heading text-xl shrink-0">
              {siteConfig.shortName.slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {siteConfig.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {siteConfig.shortName} • {siteConfig.defaultCurrency}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Institution Name
              </Label>
              <Input
                readOnly
                value={siteConfig.name}
                className="h-9 text-xs bg-muted/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Short Name / Acronym
              </Label>
              <Input
                readOnly
                value={siteConfig.shortName}
                className="h-9 text-xs bg-muted/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Logo Asset Path
              </Label>
              <Input
                readOnly
                value={siteConfig.logo.src}
                className="h-9 text-xs bg-muted/20 font-mono"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Tagline
              </Label>
              <Input
                readOnly
                value={siteConfig.tagline}
                className="h-9 text-xs bg-muted/20"
              />
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div>
          <h2 className="text-sm font-semibold text-foreground border-b border-border/60 pb-2 mb-4">
            Contact & Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Support Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  readOnly
                  value={siteConfig.supportEmail}
                  className="pl-8.5 h-9 text-xs bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Contact Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  readOnly
                  value={siteConfig.supportPhone}
                  className="pl-8.5 h-9 text-xs bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Campus Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  readOnly
                  value={siteConfig.campusAddress}
                  className="pl-8.5 h-9 text-xs bg-muted/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic & Operations */}
        <div>
          <h2 className="text-sm font-semibold text-foreground border-b border-border/60 pb-2 mb-4">
            Academic & Operations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Billing Currency
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  readOnly
                  value={siteConfig.defaultCurrency}
                  className="pl-8.5 h-9 text-xs bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Academic Session
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  readOnly
                  value={siteConfig.academicYear}
                  className="pl-8.5 h-9 text-xs bg-muted/20"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
