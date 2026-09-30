"use client";

import { Image as ImageIcon, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvatarUploadDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  currentAvatarUrl?: string | null;
  maxSizeMb?: number;
  disabled?: boolean;
  className?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function AvatarUploadDropzone({
  onFileSelect,
  selectedFile,
  currentAvatarUrl,
  maxSizeMb = 5,
  disabled = false,
  className,
}: AvatarUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate and revoke object preview URL when file changes
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const validateAndSelect = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, or WebP).");
      return;
    }

    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`File size exceeds maximum limit of ${maxSizeMb}MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file) validateAndSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) validateAndSelect(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const activeDisplayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className={cn("space-y-3", className)}>
      <section
        aria-label="Image file drop area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/80 hover:border-border hover:bg-muted/30 bg-muted/10",
          disabled && "opacity-60 pointer-events-none",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          aria-label="Upload profile avatar"
        />

        {activeDisplayUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative size-24 rounded-full overflow-hidden border-2 border-primary/30 shadow-md ring-4 ring-primary/10">
              <Image
                src={activeDisplayUrl}
                alt="Avatar preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">
                {selectedFile ? selectedFile.name : "Current Photo"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB (Ready to upload)`
                  : "Drag a new image or click below to replace"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="h-7 text-xs gap-1.5"
              >
                <UploadCloud className="size-3.5" />
                Change Image
              </Button>
              {selectedFile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40"
                >
                  <X className="size-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5 text-center">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              {isDragOver ? (
                <UploadCloud className="size-6 animate-bounce" />
              ) : (
                <ImageIcon className="size-6 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">
                Drag and drop your photo here, or
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="h-7 text-xs gap-1.5 mt-1"
              >
                <UploadCloud className="size-3.5" />
                Browse Files
              </Button>
              <p className="text-[11px] text-muted-foreground pt-1">
                PNG, JPG, or WebP up to {maxSizeMb}MB
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
