"use client";

import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  IdCard,
  Loader2,
  Lock,
  Mail,
  Phone,
  Save,
  School,
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
import type { Gender } from "@/types";
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

export function StudentProfileCard() {
  const { user } = useAuth();
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

    const toastId = toast.loading("Saving your profile details...");
    try {
      await updateProfileMutation.mutateAsync(payload);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId });
    }
  };

  const profile = user?.studentProfile;

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/80 shadow-2xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserIcon className="size-4 text-primary" />
              <CardTitle className="text-sm font-semibold">
                Personal Information
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 gap-1"
            >
              <ShieldCheck className="size-3" />
              <span>Verified Learner</span>
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Update your student name, mobile phone, and gender identity.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="student-name" className="text-xs font-semibold">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="student-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sadia Afrin"
                    className="pl-9 h-9 text-sm"
                    disabled={updateProfileMutation.isPending}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="student-email"
                  className="text-xs font-semibold flex items-center justify-between"
                >
                  <span>Email Address</span>
                  <span className="text-[10px] text-muted-foreground font-normal flex items-center gap-1">
                    <Lock className="size-2.5" /> Identity Locked
                  </span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="student-email"
                    value={user?.email || ""}
                    disabled
                    className="pl-9 h-9 text-sm bg-muted/40 cursor-not-allowed text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="student-phone"
                  className="text-xs font-semibold"
                >
                  Contact Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="student-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="pl-9 h-9 text-sm"
                    disabled={updateProfileMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="student-gender"
                  className="text-xs font-semibold"
                >
                  Gender Identity
                </Label>
                <select
                  id="student-gender"
                  value={gender || ""}
                  onChange={(e) =>
                    setGender((e.target.value as Gender) || null)
                  }
                  disabled={updateProfileMutation.isPending}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                >
                  <option value="">Not Specified</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-border/60">
              <Button
                type="submit"
                size="sm"
                disabled={updateProfileMutation.isPending}
                className="gap-2 font-semibold shadow-2xs"
              >
                {updateProfileMutation.isPending ? (
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
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/80 shadow-2xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              <CardTitle className="text-sm font-semibold">
                Academic & Admission Record
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold uppercase"
            >
              Official Record
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Academic placement and guardian details provided during coaching
            center admission.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                <IdCard className="size-3.5 text-primary" />
                <span>Class Roll Number</span>
              </div>
              <p className="font-heading text-base font-bold text-foreground">
                {profile?.rollNumber ? `#${profile.rollNumber}` : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                <BookOpen className="size-3.5 text-primary" />
                <span>Target Class / Level</span>
              </div>
              <p className="font-heading text-base font-bold text-foreground">
                {profile?.classLevel || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                <School className="size-3.5 text-primary" />
                <span>School / Institution</span>
              </div>
              <p className="font-heading text-base font-bold text-foreground truncate">
                {profile?.institutionName || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                <HeartHandshake className="size-3.5 text-primary" />
                <span>Guardian Name</span>
              </div>
              <p className="font-heading text-base font-bold text-foreground">
                {profile?.guardianName || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                <Phone className="size-3.5 text-primary" />
                <span>Guardian Phone</span>
              </div>
              <p className="font-heading text-base font-bold text-foreground">
                {profile?.guardianPhone || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>Enrollment Status</span>
              </div>
              <div className="pt-0.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {user?.status || "ACTIVE"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground italic pt-4">
            Note: To modify your official roll number, class level, or guardian
            contact details, please contact the coaching center administration
            desk.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
