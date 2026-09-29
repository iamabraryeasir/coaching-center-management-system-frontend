"use client";

import { Loader2, Trash2, Upload, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { AvatarUploadDropzone } from "@/components/modules/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useAuth,
  useDeleteMyAvatarMutation,
  useUploadMyAvatarMutation,
} from "@/hooks";

export function StudentAvatarCard() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadMutation = useUploadMyAvatarMutation();
  const deleteMutation = useDeleteMyAvatarMutation();

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadMutation.mutateAsync(selectedFile);
      setSelectedFile(null);
    } catch {
      // Handled by hook toast
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
      setSelectedFile(null);
    } catch {
      // Handled by hook toast
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  const isPending = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <Card className="bg-card border-border/80 shadow-2xs overflow-hidden">
      <CardHeader className="border-b border-border/60 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle2 className="size-4 text-primary" />
            <CardTitle className="text-sm font-semibold">
              Student Profile Picture
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-semibold uppercase tracking-wider"
          >
            Cloudinary Storage
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Manage your student avatar visible on test scorecards, merit lists,
          and class attendance rosters.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
          <Avatar className="size-16 ring-4 ring-primary/10 shadow-sm shrink-0">
            <AvatarImage
              src={user?.avatarUrl || undefined}
              alt={user?.name || "Student"}
            />
            <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="font-bold text-sm text-foreground">
                {user?.name || "Student"}
              </span>
              <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                STUDENT
              </span>
              {user?.studentProfile?.rollNumber && (
                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  Roll #{user.studentProfile.rollNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
            <p className="text-[11px] text-muted-foreground/80 pt-0.5">
              {user?.avatarUrl
                ? "Custom Cloudinary photo active"
                : "Using colorful initials fallback"}
            </p>
          </div>

          {user?.avatarUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs text-destructive hover:bg-destructive/10 hover:border-destructive/40 gap-1.5 h-8 shrink-0"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              <span>Remove Photo</span>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <AvatarUploadDropzone
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            currentAvatarUrl={user?.avatarUrl}
            disabled={isPending}
          />

          {selectedFile && (
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
                disabled={isPending}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                disabled={isPending}
                className="text-xs font-semibold gap-1.5 h-8"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="size-3.5" />
                    <span>Save Profile Photo</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
