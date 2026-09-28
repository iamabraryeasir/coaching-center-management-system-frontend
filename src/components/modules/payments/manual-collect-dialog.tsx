"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Loader2, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManualCollectPaymentMutation } from "@/hooks";
import type { ManualCollectPaymentDto, MonthlyFeeBill } from "@/types";
import {
  type MANUAL_PAYMENT_METHODS,
  manualCollectFormSchema,
} from "@/validators";

interface ManualCollectDialogProps {
  bill: MonthlyFeeBill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billingMonth: number;
  billingYear: number;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Cash (Hand-to-Hand)",
  BKASH: "bKash (MFS)",
  NAGAD: "Nagad (MFS)",
  ROCKET: "Rocket (Dutch-Bangla)",
  BANK_TRANSFER: "Bank Transfer / Deposit",
};

export function ManualCollectDialog({
  bill,
  open,
  onOpenChange,
  billingMonth,
  billingYear,
}: ManualCollectDialogProps) {
  const collectMutation = useManualCollectPaymentMutation();
  const isSubmitting = collectMutation.isPending;

  const dueAmount = bill?.dueAmount ?? 0;
  const studentName =
    bill?.student?.name || bill?.enrollment?.student?.name || "Student";
  const rollNumber =
    bill?.student?.rollNumber ||
    bill?.student?.studentProfile?.rollNumber ||
    bill?.enrollment?.student?.studentProfile?.rollNumber;
  const batchName =
    bill?.batch?.name || bill?.enrollment?.batch?.name || "Academic Batch";

  const form = useForm({
    defaultValues: {
      amount: dueAmount > 0 ? dueAmount : 0,
      paymentMethod: "CASH" as (typeof MANUAL_PAYMENT_METHODS)[number],
      notes: "",
    },
    validators: {
      onSubmit: manualCollectFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!bill?.enrollmentId) {
        toast.error("Missing enrollment reference.");
        return;
      }

      const toastId = toast.loading("Recording fee collection...");

      try {
        const payload: ManualCollectPaymentDto = {
          enrollmentId: bill.enrollmentId,
          amount: Number(value.amount),
          paymentMethod: value.paymentMethod,
          notes: value.notes?.trim() || undefined,
          billingMonth,
          billingYear,
        };

        const response = await collectMutation.mutateAsync(payload);
        const receiptNumber = response.data?.receiptNumber;

        toast.success(
          receiptNumber
            ? `Payment collected successfully! Receipt: ${receiptNumber}`
            : "Payment recorded successfully!",
          { id: toastId },
        );
        onOpenChange(false);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to record manual payment.";
        toast.error(message, { id: toastId });
      }
    },
  });

  if (!bill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Receipt className="size-5" />
            <span>Record Manual Payment</span>
          </div>
          <DialogTitle className="text-lg">
            Collect Fee — {studentName}
          </DialogTitle>
          <DialogDescription>
            Record cash, mobile financial service (bKash/Nagad), or bank
            transfer payments. An instant digital receipt will be generated.
          </DialogDescription>
        </DialogHeader>

        {/* Student & Bill Summary Card */}
        <div className="rounded-lg border border-border/80 bg-muted/40 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Batch & Student:</span>
            <span className="font-semibold text-foreground">
              {batchName} {rollNumber && `(Roll: ${rollNumber})`}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60">
            <div>
              <span className="text-muted-foreground block text-[11px]">
                Monthly Fee
              </span>
              <span className="font-medium text-foreground">
                ৳{bill.monthlyFee.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">
                Previous Due
              </span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                ৳{bill.previousDue.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">
                Current Due
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                ৳{bill.dueAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 pt-1"
        >
          {/* Amount Field */}
          <form.Field name="amount">
            {(field) => (
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Collection Amount (BDT ৳) *
                </FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                    ৳
                  </span>
                  <Input
                    type="number"
                    min={1}
                    max={bill.dueAmount * 2 || 100000}
                    step={1}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="pl-7"
                    placeholder="Enter collected amount"
                    disabled={isSubmitting}
                  />
                </div>
                {/* Quick select buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="text-[11px] h-6 px-2 text-primary"
                    onClick={() => field.handleChange(bill.dueAmount)}
                  >
                    Pay Full Due (৳{bill.dueAmount})
                  </Button>
                  {bill.dueAmount > 100 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="text-[11px] h-6 px-2 text-muted-foreground"
                      onClick={() =>
                        field.handleChange(Math.floor(bill.dueAmount / 2))
                      }
                    >
                      Pay 50% (৳{Math.floor(bill.dueAmount / 2)})
                    </Button>
                  )}
                </div>
                {field.state.meta.errors.length > 0 && (
                  <FieldError className="text-xs">
                    {field.state.meta.errors.join(", ")}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Payment Method */}
          <form.Field name="paymentMethod">
            {(field) => (
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Payment Method Channel *
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(val) =>
                    field.handleChange(
                      val as (typeof MANUAL_PAYMENT_METHODS)[number],
                    )
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Payment Channel">
                      {(val: string | null) =>
                        val
                          ? PAYMENT_METHOD_LABELS[val] || val
                          : "Select Payment Channel"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash (Hand-to-Hand)</SelectItem>
                    <SelectItem value="BKASH">bKash (MFS)</SelectItem>
                    <SelectItem value="NAGAD">Nagad (MFS)</SelectItem>
                    <SelectItem value="ROCKET">
                      Rocket (Dutch-Bangla)
                    </SelectItem>
                    <SelectItem value="BANK_TRANSFER">
                      Bank Transfer / Deposit
                    </SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <FieldError className="text-xs">
                    {field.state.meta.errors.join(", ")}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Notes / Transaction ID */}
          <form.Field name="notes">
            {(field) => (
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Notes / Transaction ID (Optional)
                </FieldLabel>
                <Input
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. bKash TrxID: TX998124 or Cash Received by Admin"
                  disabled={isSubmitting}
                />
                {field.state.meta.errors.length > 0 && (
                  <FieldError className="text-xs">
                    {field.state.meta.errors.join(", ")}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          <DialogFooter className="gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Confirm Collection</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
