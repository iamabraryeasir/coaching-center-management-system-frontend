import { CalendarDays, CreditCard, GraduationCap, Layers } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Timetable",
    icon: CalendarDays,
    href: "/dashboard/student/routines",
  },
  {
    label: "Exams",
    icon: GraduationCap,
    href: "/dashboard/student/exams",
  },
  {
    label: "Fees",
    icon: CreditCard,
    href: "/dashboard/student/payments",
  },
  {
    label: "Batches",
    icon: Layers,
    href: "/dashboard/student/batches",
  },
];

export function StudentQuickActionsBar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-xs font-semibold gap-1.5 h-8 bg-card shadow-2xs hover:border-primary/40",
            )}
          >
            <Icon className="size-3.5 text-primary" />
            <span>{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
