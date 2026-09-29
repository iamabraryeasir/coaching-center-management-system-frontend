"use client";

import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useUpdateMyProfileMutation } from "@/hooks";
import type { Gender, TeacherPermission } from "@/types";
import { updateMyProfileSchema } from "@/validators";

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
  return "Failed to update profile information.";
}

export function TeacherProfileCard() {
  const { user, hasPermission } = useAuth();
  const updateProfileMutation = useUpdateMyProfileMutation();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState<Gender>(user?.gender || null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setGender(user.gender || null);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      gender: gender || null,
    };

    const validation = updateMyProfileSchema.safeParse(payload);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message;
      toast.error(firstIssue || "Please check your profile details.");
      return;
    }

    const toastId = toast.loading("Saving your profile...");
    try {
      await updateProfileMutation.mutateAsync(payload);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId });
    }
  };

  const profile = user?.teacherProfile;

  const permissionsList: {
    permission: TeacherPermission;
    label: string;
    description: string;
  }[] = [
    {
      permission: "MANAGE_ATTENDANCE",
      label: "Student Attendance",
      description: "Take and modify daily student attendance records",
    },
    {
      permission: "MANAGE_EXAMS",
      label: "Exams & Results",
      description: "Create exams, record bulk marks, and publish report cards",
    },
    {
      permission: "MANAGE_ROUTINES",
      label: "Class Routines",
      description:
        "Full management of weekly timetable schedules and class slots",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Academic Credentials & Delegation Matrix Card */}
      <Card className="border-border/80 bg-card shadow-2xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground font-heading">
                Academic Credentials & Faculty Role
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Your assigned academic designations, subject specializations,
                and delegated authority.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="size-3.5 text-primary" />
                <span>Designation</span>
              </span>
              <p className="text-sm font-semibold text-foreground font-heading truncate">
                {profile?.designation || "Faculty Instructor"}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-primary" />
                <span>Specialization</span>
              </span>
              <p className="text-sm font-semibold text-foreground font-heading truncate">
                {profile?.specialization || "General Subjects"}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Award className="size-3.5 text-primary" />
                <span>Qualification</span>
              </span>
              <p className="text-sm font-semibold text-foreground font-heading truncate">
                {profile?.qualification || "Verified Degree"}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                <span>Joining Date</span>
              </span>
              <p className="text-sm font-semibold text-foreground font-heading truncate">
                {profile?.joiningDate
                  ? new Date(profile.joiningDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Active Staff"}
              </p>
            </div>
          </div>

          {/* Delegated Administrative Permissions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Delegated Faculty Permissions</span>
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Managed by Institution Administrator
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {permissionsList.map(({ permission, label, description }) => {
                const granted = hasPermission(permission);
                return (
                  <div
                    key={permission}
                    className={`rounded-xl border p-3.5 space-y-2 transition-colors ${
                      granted
                        ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10"
                        : "border-border/60 bg-muted/10 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        {label}
                      </span>
                      {granted ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] gap-1 px-1.5 py-0"
                        >
                          <CheckCircle2 className="size-2.5" />
                          <span>Active</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-muted text-muted-foreground border-border/60 text-[10px] gap-1 px-1.5 py-0"
                        >
                          <ShieldAlert className="size-2.5" />
                          <span>Not Assigned</span>
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Personal Information Edit Form Card */}
      <Card className="border-border/80 bg-card shadow-2xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserIcon className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground font-heading">
                Personal Contact Details
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Update your personal name, phone number, and gender preferences.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Email (Read Only) */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    readOnly
                    disabled
                    value={user?.email || ""}
                    className="h-9 pl-8.5 text-xs bg-muted/30 cursor-not-allowed text-muted-foreground"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Your email address is your permanent faculty login identifier
                  and cannot be changed directly.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Full Name <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Jane Doe"
                    className="h-9 pl-8.5 text-xs"
                  />
                </div>
              </div>

              {/* Personal Phone */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Contact Phone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801700000000"
                    className="h-9 pl-8.5 text-xs"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-foreground">
                  Gender (Optional)
                </Label>
                <div className="flex gap-2">
                  {(["MALE", "FEMALE", "OTHER"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(gender === g ? null : g)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        gender === g
                          ? "border-primary bg-primary/10 text-primary shadow-2xs"
                          : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      {g === "MALE"
                        ? "Male"
                        : g === "FEMALE"
                          ? "Female"
                          : "Other"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={updateProfileMutation.isPending || !name.trim()}
                className="gap-1.5 text-xs font-semibold"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>Save Contact Details</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
