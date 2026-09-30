"use client";

import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
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
import { useAuth } from "@/hooks";

export interface LogoutConfirmationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  onConfirm?: () => void;
}

export function LogoutConfirmationDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  onConfirm,
}: LogoutConfirmationDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { logout, isLoggingOut } = useAuth();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  const handleLogout = async () => {
    try {
      if (onConfirm) {
        onConfirm();
      }
      await logout();
      setOpen?.(false);
    } catch {
      // Handled via useAuth mutation toasts
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-w-sm gap-4 p-5">
        <DialogHeader className="text-left space-y-2">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-2xs">
            <LogOut className="size-5" />
          </div>
          <DialogTitle className="font-heading text-lg font-bold text-foreground">
            Sign Out of Account?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to end your active session? You will need to
            enter your credentials again to access the portal.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen?.(false)}
            disabled={isLoggingOut}
            className="text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
