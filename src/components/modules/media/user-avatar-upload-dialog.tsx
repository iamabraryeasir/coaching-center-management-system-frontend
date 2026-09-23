"use client";

import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUploadUserAvatarMutation } from "@/hooks";
import { AvatarUploadDropzone } from "./avatar-upload-dropzone";

interface UserAvatarUploadDialogProps {
  user: {
    id: string;
    name: string;
    email?: string;
    role?: string;
    avatarUrl?: string | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserAvatarUploadDialog({
  user,
  open,
  onOpenChange,
}: UserAvatarUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadMutation = useUploadUserAvatarMutation();

  const handleClose = () => {
    setSelectedFile(null);
    onOpenChange(false);
  };

  const handleUpload = async () => {
    if (!user || !selectedFile) return;

    try {
      await uploadMutation.mutateAsync({
        targetUserId: user.id,
        file: selectedFile,
      });
      handleClose();
    } catch {
      // Error handled by hook toast
    }
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="space-y-2 pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Upload className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Assign User Avatar
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Upload or replace the profile photo for this account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 my-2">
          <Avatar className="size-11 ring-2 ring-primary/20">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email || user.id}
            </p>
          </div>
          {user.role && (
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-semibold"
            >
              {user.role}
            </Badge>
          )}
        </div>

        {/* Upload Dropzone */}
        <AvatarUploadDropzone
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          currentAvatarUrl={user.avatarUrl}
          disabled={uploadMutation.isPending}
        />

        <DialogFooter className="pt-2 flex sm:flex-row justify-end gap-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={uploadMutation.isPending}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="text-xs font-semibold gap-1.5"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="size-3.5" />
                Save Avatar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
