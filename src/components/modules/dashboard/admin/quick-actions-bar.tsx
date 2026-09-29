import { cn } from "cn";
import { Banknote, BookOpen, GraduationCap, UserPlus } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const actions = [
  {
    label: "Admit Student",
    icon: UserPlus,
    href: "/dashboard/admin/students",
  },
  {
    label: "Add Teacher",
    icon: GraduationCap,
    href: "/dashboard/admin/teachers",
  },
  {
    label: "Create Batch",
    icon: BookOpen,
    href: "/dashboard/admin/batches",
  },
  {
    label: "Collect Fee",
    icon: Banknote,
    href: "/dashboard/admin/payments",
  },
] as const;

export function QuickActionsBar() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5",
          )}
        >
          <action.icon className="size-3.5" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}
