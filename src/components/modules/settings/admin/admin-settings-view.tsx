"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { AdminAvatarCard } from "@/components/modules/media";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/config/site";
import { useInstitutionProfile, useUpdateInstitutionMutation } from "@/hooks";
import { updateInstitutionSchema } from "@/validators";

import { ActiveSessionsCard } from "../shared/active-sessions-card";
import { ChangePasswordCard } from "../shared/change-password-card";
import { AdminProfileCard } from "./admin-profile-card";

function getErrorMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Failed to update institution profile.";
}

export function AdminSettingsView() {
  const { data: profileResponse } = useInstitutionProfile();
  const updateMutation = useUpdateInstitutionMutation();

  const profile = profileResponse?.data;

  // Form State
  const [institutionName, setInstitutionName] = useState(siteConfig.name);
  const [institutionEmail, setInstitutionEmail] = useState(
    siteConfig.supportEmail,
  );
  const [institutionPhone, setInstitutionPhone] = useState(
    siteConfig.supportPhone,
  );
  const [institutionAddress, setInstitutionAddress] = useState(
    siteConfig.campusAddress,
  );
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [tagline, setTagline] = useState(siteConfig.tagline);

  // Sync form when backend data loads
  useEffect(() => {
    if (profile) {
      if (profile.institutionName) setInstitutionName(profile.institutionName);
      if (profile.institutionEmail)
        setInstitutionEmail(profile.institutionEmail);
      if (profile.institutionPhone)
        setInstitutionPhone(profile.institutionPhone);
      if (profile.institutionAddress)
        setInstitutionAddress(profile.institutionAddress);
      if (profile.adminName) setAdminName(profile.adminName);
      if (profile.adminPhone) setAdminPhone(profile.adminPhone);
      if (profile.tagline) setTagline(profile.tagline);
    }
  }, [profile]);

  const handleReset = () => {
    if (profile) {
      setInstitutionName(profile.institutionName || siteConfig.name);
      setInstitutionEmail(profile.institutionEmail || siteConfig.supportEmail);
      setInstitutionPhone(profile.institutionPhone || siteConfig.supportPhone);
      setInstitutionAddress(
        profile.institutionAddress || siteConfig.campusAddress,
      );
      setAdminName(profile.adminName || "");
      setAdminPhone(profile.adminPhone || "");
      setTagline(profile.tagline || siteConfig.tagline);
    } else {
      setInstitutionName(siteConfig.name);
      setInstitutionEmail(siteConfig.supportEmail);
      setInstitutionPhone(siteConfig.supportPhone);
      setInstitutionAddress(siteConfig.campusAddress);
      setAdminName("");
      setAdminPhone("");
      setTagline(siteConfig.tagline);
    }
    toast.success("Form reset to saved profile.");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      institutionName: institutionName.trim(),
      institutionAddress: institutionAddress.trim(),
      institutionPhone: institutionPhone.trim(),
      institutionEmail: institutionEmail.trim(),
      adminName: adminName.trim() || undefined,
      adminPhone: adminPhone.trim() || undefined,
      tagline: tagline.trim() || undefined,
    };

    const validation = updateInstitutionSchema.safeParse(payload);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message;
      toast.error(firstIssue || "Please check the form inputs.");
      return;
    }

    const toastId = toast.loading("Updating institution profile...");
    try {
      await updateMutation.mutateAsync(payload);
      toast.success("Institution profile updated successfully!", {
        id: toastId,
      });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err), { id: toastId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Settings className="size-3" />
            <span>Settings & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Admin Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your personal profile, institution branding, and account
            security.
          </p>
        </div>
      </div>

      {/* 2. Settings Navigation Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile" className="gap-1.5 text-xs">
            <UserIcon className="size-3.5" />
            <span>My Profile</span>
          </TabsTrigger>
          <TabsTrigger value="institution" className="gap-1.5 text-xs">
            <Building2 className="size-3.5" />
            <span>Institution</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs">
            <KeyRound className="size-3.5" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Personal Profile & Avatar */}
        <TabsContent value="profile" className="space-y-6">
          <AdminAvatarCard />
          <AdminProfileCard />
        </TabsContent>

        {/* Tab 2: Institution Branding & Campus */}
        <TabsContent value="institution" className="space-y-6">
          <form
            id="institution-settings-form"
            onSubmit={handleSave}
            className="space-y-6"
          >
            <Card className="p-5 sm:p-6 bg-card border-border/80 shadow-2xs space-y-6">
              {/* Brand & Identity */}
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-4">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="size-4 text-primary" />
                    <span>Brand & Identity</span>
                  </h2>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    <span>Live Database Sync</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary font-heading text-xl shrink-0">
                    {(institutionName || siteConfig.shortName)
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {institutionName || siteConfig.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {siteConfig.shortName} • {siteConfig.defaultCurrency}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-medium text-foreground">
                      Institution Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      required
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. Radiant Way Coaching Home"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-medium text-foreground">
                      Official Tagline / Slogan
                    </Label>
                    <Input
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Nurturing academic excellence since 2018"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Campus Location & Contact */}
              <div>
                <h2 className="text-sm font-semibold text-foreground border-b border-border/60 pb-2 mb-4 flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  <span>Campus Location & Contact</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">
                      Official Contact Email{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        required
                        type="email"
                        value={institutionEmail}
                        onChange={(e) => setInstitutionEmail(e.target.value)}
                        placeholder="info@institution.edu.bd"
                        className="pl-8.5 h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">
                      Official Contact Phone{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        required
                        value={institutionPhone}
                        onChange={(e) => setInstitutionPhone(e.target.value)}
                        placeholder="+880 1700-000000"
                        className="pl-8.5 h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-medium text-foreground">
                      Physical Campus Address{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        required
                        value={institutionAddress}
                        onChange={(e) => setInstitutionAddress(e.target.value)}
                        placeholder="Ambagan, Khulshi, Chattagram"
                        className="pl-8.5 h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative In-Charge Profile */}
              <div>
                <h2 className="text-sm font-semibold text-foreground border-b border-border/60 pb-2 mb-4 flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <span>Administrative Contact In-Charge</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">
                      Admin In-Charge Name
                    </Label>
                    <Input
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Abrar Yeasir"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">
                      Admin In-Charge Phone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="e.g. +880 1800-000000"
                        className="pl-8.5 h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Environment Defaults */}
              <div>
                <h2 className="text-sm font-semibold text-foreground border-b border-border/60 pb-2 mb-4 flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  <span>System & Currency Standards</span>
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
                        className="pl-8.5 h-9 text-xs bg-muted/20 cursor-not-allowed"
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
                        className="pl-8.5 h-9 text-xs bg-muted/20 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="border-t border-border/60 pt-4 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={updateMutation.isPending}
                  className="gap-1.5 text-xs font-medium"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset</span>
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={updateMutation.isPending}
                  className="gap-1.5 text-xs font-semibold"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="size-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        </TabsContent>

        {/* Tab 3: Security, Password & Active Sessions */}
        <TabsContent value="security" className="space-y-6">
          <ChangePasswordCard />
          <ActiveSessionsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
