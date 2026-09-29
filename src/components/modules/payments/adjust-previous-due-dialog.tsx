"use client";

import {
  AlertCircle,
  Calculator,
  DollarSign,
  History,
  Info,
  Loader2,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdjustBillPreviousDueMutation } from "@/hooks";
import type { MonthlyFeeBill } from "@/types";
import { adjustPreviousDueSchema } from "@/validators";

interface AdjustPreviousDueDialogProps {
  bill: MonthlyFeeBill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
  return "Failed to adjust previous dues.";
}

export function AdjustPreviousDueDialog({
  bill,
  open,
  onOpenChange,
}: AdjustPreviousDueDialogProps) {
  const [previousDueInput, setPreviousDueInput] = useState<string>("0");
  const [remarks, setRemarks] = useState<string>("");

  const adjustMutation = useAdjustBillPreviousDueMutation();

  useEffect(() => {
    if (bill) {
      setPreviousDueInput(String(bill.previousDue || 0));
      setRemarks("");
    }
  }, [bill]);

  if (!bill) return null;

  const student = bill.student || bill.enrollment?.student;
  const batch = bill.batch || bill.enrollment?.batch;
  const monthlyFee = Number(bill.monthlyFee || 0);
  const paidAmount = Number(bill.paidAmount || 0);

  const parsedNewPreviousDue = Number(previousDueInput) || 0;
  const newTotalPayable = monthlyFee + parsedNewPreviousDue;
  const newDueAmount = Math.max(0, newTotalPayable - paidAmount);
  const isInvalidDue = newTotalPayable < paidAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isInvalidDue) {
      toast.error(
        `Total payable (৳${newTotalPayable}) cannot be less than the already collected amount (৳${paidAmount}).`,
      );
      return;
    }

    const payload = {
      previousDue: parsedNewPreviousDue,
      remarks: remarks.trim() || undefined,
    };

    const validation = adjustPreviousDueSchema.safeParse(payload);
    if (!validation.success) {
      const issue = validation.error.issues[0]?.message;
      toast.error(issue || "Please enter a valid previous due amount.");
      return;
    }

    const toastId = toast.loading("Updating student arrears balance...");
    try {
      await adjustMutation.mutateAsync({
        billId: bill.id,
        payload,
      });
      toast.success("Previous dues updated and ledger recalculated!", {
        id: toastId,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err), { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <History className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold font-heading">
                Adjust Opening Arrears & Previous Dues
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Modify opening carry-over debt or correct previous dues for this
                billing cycle.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Student & Batch Context Card */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {student?.name || "Student"}
                </span>
                {student?.rollNumber && (
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Roll #{student.rollNumber}
                  </Badge>
                )}
              </div>
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-semibold text-primary"
              >
                {batch?.name || "Batch"}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-[11px]">
              <div>
                <span className="text-muted-foreground">Monthly Fee</span>
                <p className="font-mono font-bold text-foreground">
                  ৳{monthlyFee.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Arrears</span>
                <p className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  ৳{(bill.previousDue || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Already Paid</span>
                <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ৳{paidAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="previous-due-input"
                className="text-xs font-semibold"
              >
                Adjusted Previous Due / Opening Arrears (৳){" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="previous-due-input"
                  type="number"
                  min="0"
                  step="any"
                  value={previousDueInput}
                  onChange={(e) => setPreviousDueInput(e.target.value)}
                  placeholder="e.g. 2500"
                  className="pl-9 h-9 text-sm font-mono"
                  disabled={adjustMutation.isPending}
                  required
                />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Info className="size-3 shrink-0" />
                <span>
                  Enter 0 if the student has no opening dues from previous
                  sessions.
                </span>
              </p>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="previous-due-remarks"
                className="text-xs font-semibold"
              >
                Adjustment Reason / Audit Remarks
              </Label>
              <Input
                id="previous-due-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Carry-over from offline admission session"
                className="h-9 text-xs"
                disabled={adjustMutation.isPending}
              />
            </div>
          </div>

          {/* Live Calculation Preview Card */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Calculator className="size-3.5" />
              <span>Recalculated Billing Impact</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Base Monthly Fee:</span>
                <span className="font-mono">
                  ৳{monthlyFee.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-medium">
                <span>+ Adjusted Previous Due:</span>
                <span className="font-mono">
                  ৳{parsedNewPreviousDue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between font-bold text-foreground pt-1 border-t border-border/50">
                <span>= New Total Payable:</span>
                <span className="font-mono">
                  ৳{newTotalPayable.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                <span>- Collected So Far:</span>
                <span className="font-mono">
                  ৳{paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between font-bold text-rose-600 dark:text-rose-400 pt-1 border-t border-border/50">
                <span>= Net Remaining Due Balance:</span>
                <span className="font-mono text-sm">
                  ৳{newDueAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {isInvalidDue && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>
                  Error: Total payable cannot be lower than the ৳{paidAmount}{" "}
                  already paid.
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={adjustMutation.isPending}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={adjustMutation.isPending || isInvalidDue}
              className="gap-1.5 text-xs font-semibold h-9 shadow-xs"
            >
              {adjustMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>Apply Dues Adjustment</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
