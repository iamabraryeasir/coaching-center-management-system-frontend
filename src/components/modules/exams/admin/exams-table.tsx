"use client";

import {
  CheckCircle2,
  Clock,
  Edit3,
  FileCheck2,
  GraduationCap,
  Layers,
  MoreVertical,
  Plus,
  Send,
  Trash2,
  Trophy,
  Undo2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAuth,
  useDeleteExamMutation,
  usePublishExamResultsMutation,
  useUnpublishExamResultsMutation,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { Exam, ExamStatus } from "@/types";

interface ExamsTableProps {
  exams: Exam[];
  isLoading?: boolean;
  onOpenCreate?: () => void;
  onEditExam: (exam: Exam) => void;
  onEnterMarks: (exam: Exam) => void;
  onViewResults: (exam: Exam) => void;
}

const STATUS_CONFIG: Record<
  ExamStatus,
  { label: string; badgeClass: string; icon: typeof Clock }
> = {
  UPCOMING: {
    label: "Upcoming",
    badgeClass:
      "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
    icon: Clock,
  },
  ONGOING: {
    label: "Ongoing",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    icon: Clock,
  },
  COMPLETED: {
    label: "Completed",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-muted text-muted-foreground border-border",
    icon: XCircle,
  },
};

export function ExamsTable({
  exams,
  isLoading,
  onOpenCreate,
  onEditExam,
  onEnterMarks,
  onViewResults,
}: ExamsTableProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const deleteMutation = useDeleteExamMutation();
  const publishMutation = usePublishExamResultsMutation();
  const unpublishMutation = useUnpublishExamResultsMutation();

  const handleDeleteConfirm = async () => {
    if (!examToDelete) return;
    await deleteMutation.mutateAsync(examToDelete.id, {
      onSuccess: () => {
        setExamToDelete(null);
      },
    });
  };

  const handleTogglePublish = (exam: Exam) => {
    if (exam.resultStatus === "PUBLISHED") {
      unpublishMutation.mutate(exam.id);
    } else {
      publishMutation.mutate(exam.id);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="min-w-56">Exam Title & Syllabus</TableHead>
              <TableHead className="w-36">Batch</TableHead>
              <TableHead className="w-32">Date</TableHead>
              <TableHead className="w-28 text-center">Marks Scheme</TableHead>
              <TableHead className="w-28 text-center">Status</TableHead>
              <TableHead className="w-28 text-center">Results</TableHead>
              <TableHead className="w-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((skKey) => (
                <TableRow key={skKey}>
                  <TableCell>
                    <Skeleton className="h-4 w-48 mb-1.5" />
                    <Skeleton className="h-3 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="size-8 ml-auto rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : exams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <GraduationCap className="size-8 opacity-40 mb-1" />
                    <p className="font-semibold text-sm text-foreground">
                      No Exams Found
                    </p>
                    <p className="text-xs max-w-sm">
                      No examinations match the current filter criteria.
                      Schedule a new assessment to get started.
                    </p>
                    {onOpenCreate && (
                      <Button
                        type="button"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={onOpenCreate}
                      >
                        <Plus className="size-3.5 mr-1" />
                        Schedule Exam
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => {
                const statusCfg =
                  STATUS_CONFIG[exam.status] || STATUS_CONFIG.UPCOMING;
                const StatusIcon = statusCfg.icon;

                const isPublished = exam.resultStatus === "PUBLISHED";

                return (
                  <TableRow
                    key={exam.id}
                    onClick={() => onViewResults(exam)}
                    className="group cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {/* Title & Description */}
                    <TableCell className="font-medium">
                      <div>
                        <span className="font-semibold text-foreground text-xs block group-hover:text-primary transition-colors">
                          {exam.title}
                        </span>
                        {exam.description && (
                          <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {exam.description}
                          </span>
                        )}
                        {/* Quick stats ribbon indicator if present */}
                        {exam.stats && exam.stats.highestMark !== undefined && (
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-mono">
                            <span className="text-amber-600 dark:text-amber-400">
                              High: {exam.stats.highestMark}
                            </span>
                            <span>•</span>
                            <span>Avg: {exam.stats.averageMark ?? "—"}</span>
                            {exam.stats.passRate !== undefined && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  Pass: {exam.stats.passRate}%
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Batch */}
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <Layers className="size-3 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate">
                          {exam.batch?.name || "Batch"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Exam Date */}
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {new Date(exam.examDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    {/* Marks Scheme */}
                    <TableCell className="text-center text-xs">
                      <span className="font-bold text-foreground">
                        {exam.totalMarks}
                      </span>
                      <span className="text-muted-foreground text-[10px] block">
                        Pass: {exam.passMarks}
                      </span>
                    </TableCell>

                    {/* Lifecycle Status */}
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs",
                          statusCfg.badgeClass,
                        )}
                      >
                        <StatusIcon className="size-3" />
                        <span>{statusCfg.label}</span>
                      </span>
                    </TableCell>

                    {/* Results Status */}
                    <TableCell className="text-center">
                      {isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="size-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          <Clock className="size-3" />
                          Draft
                        </span>
                      )}
                    </TableCell>

                    {/* Context Action Menu */}
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="size-8"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => onEnterMarks(exam)}
                            className="text-xs cursor-pointer gap-2 font-medium text-primary"
                          >
                            <FileCheck2 className="size-3.5" />
                            <span>Enter / Edit Marks</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onViewResults(exam)}
                            className="text-xs cursor-pointer gap-2"
                          >
                            <Trophy className="size-3.5 text-amber-500" />
                            <span>View Merit List</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {(isAdmin || !isPublished) && (
                            <DropdownMenuItem
                              onClick={() => handleTogglePublish(exam)}
                              className="text-xs cursor-pointer gap-2"
                            >
                              {isPublished ? (
                                <>
                                  <Undo2 className="size-3.5 text-amber-500" />
                                  <span>Revert to Draft</span>
                                </>
                              ) : (
                                <>
                                  <Send className="size-3.5 text-emerald-600" />
                                  <span>Publish Results</span>
                                </>
                              )}
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => onEditExam(exam)}
                            className="text-xs cursor-pointer gap-2"
                          >
                            <Edit3 className="size-3.5" />
                            <span>Edit Metadata</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => setExamToDelete(exam)}
                            className="text-xs cursor-pointer gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete Exam</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Exam Confirmation Dialog */}
      <Dialog
        open={Boolean(examToDelete)}
        onOpenChange={(open) => !open && setExamToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <Trash2 className="size-5" />
              </div>
              <div>
                <DialogTitle className="font-heading text-lg font-bold">
                  Delete Examination
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Are you sure you want to delete{" "}
                  <strong className="text-foreground">
                    "{examToDelete?.title}"
                  </strong>
                  ? All recorded marks will be permanently removed.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExamToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
