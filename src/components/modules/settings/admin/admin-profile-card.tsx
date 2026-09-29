"use client";

import { Loader2, Mail, Phone, Save, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

export function AdminProfileCard() {
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

    const toastId = toast.loading("Saving your profile...");
    try {
      await updateProfileMutation.mutateAsync(payload);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId });
    }
  };

  return (
    <Card className="border-border/80 bg-card shadow-2xs">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserIcon className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground font-heading">
              Personal Account Profile
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Update your individual administrator account name and contact
              number.
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
                Your email address is your permanent login identifier and cannot
                be changed directly.
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
                  placeholder="e.g. Abrar Yeasir"
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
                  <span>Save Personal Details</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
