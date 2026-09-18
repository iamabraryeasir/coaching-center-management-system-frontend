"use client";

import { Check, Loader2, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDirectEnrollStudentMutation, useStudents } from "@/hooks";
import type { User } from "@/types";

interface DirectEnrollDialogProps {
  batchId: string;
  batchName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

export function DirectEnrollDialog({
  batchId,
  batchName,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: DirectEnrollDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // Search active students
  const { data, isLoading } = useStudents({
    search: search.trim() || undefined,
    status: "ACTIVE",
    limit: 8,
  });

  const enrollMutation = useDirectEnrollStudentMutation();
  const students = data?.data || [];

  const handleEnroll = async () => {
    if (!selectedStudent) return;
    await enrollMutation.mutateAsync(
      {
        batchId,
        studentId: selectedStudent.id,
        payload: {
          studentId: selectedStudent.id,
        },
      },
      {
        onSuccess: () => {
          setSelectedStudent(null);
          setSearch("");
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger render={trigger} />}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="size-4" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg">
                Direct Batch Enrollment
              </DialogTitle>
              <DialogDescription className="text-xs">
                Enroll an active student directly into{" "}
                <span className="font-medium text-foreground">{batchName}</span>
                .
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search active students by name, email, or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 h-9 text-xs"
            />
          </div>

          {/* Student selection list */}
          <div className="rounded-lg border border-border/70 overflow-hidden divide-y divide-border/60 max-h-64 overflow-y-auto">
            {isLoading && (
              <div className="p-3 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Loading skeleton
                  <div key={i} className="flex items-center gap-2.5">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-36" />
                      <Skeleton className="h-2.5 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && students.length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No active students found matching &quot;{search}&quot;.
              </div>
            )}

            {!isLoading &&
              students.map((student) => {
                const isSelected = selectedStudent?.id === student.id;
                const profile = student.studentProfile;

                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full text-left p-3 transition-colors flex items-center justify-between gap-3 hover:bg-muted/40 ${
                      isSelected ? "bg-primary/5 border-l-2 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {student.name
                          ? student.name.charAt(0).toUpperCase()
                          : "S"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {student.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                          <span className="truncate">{student.email}</span>
                          {profile?.rollNumber && (
                            <span className="shrink-0 font-mono">
                              Roll: {profile.rollNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" />
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-muted-foreground border-border"
                        >
                          Select
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Selected student preview */}
          {selectedStudent && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs flex items-center justify-between">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Ready to enroll:
                </span>
                <span className="font-semibold text-foreground">
                  {selectedStudent.name}
                </span>{" "}
                <span className="text-muted-foreground">
                  ({selectedStudent.email})
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary text-[10px]"
              >
                Selected
              </Badge>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedStudent(null);
              setIsOpen(false);
            }}
            disabled={enrollMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleEnroll}
            disabled={!selectedStudent || enrollMutation.isPending}
          >
            {enrollMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                <span>Enrolling...</span>
              </>
            ) : (
              "Confirm Enrollment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
