"use client";

import { GraduationCap, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";

const DEMO_PERSONAS = [
  {
    role: "Admin",
    email: "admin@gmail.com",
    password: "Admin@123456",
    icon: ShieldCheck,
  },
  {
    role: "Teacher",
    email: "teacher1@gmail.com",
    password: "Teacher@123456",
    icon: GraduationCap,
  },
  {
    role: "Student",
    email: "student1@gmail.com",
    password: "Student@123456",
    icon: User,
  },
];

interface DemoLoginSectionProps {
  onSelectPersona: (credentials: { email: string; password: string }) => void;
  disabled?: boolean;
}

/**
 * Feature-Flagged Quick Demo Credentials Section
 *
 * Controlled exclusively by NEXT_PUBLIC_ENABLE_DEMO_LOGIN.
 * Displays 3 clean, minimal demo login buttons (Admin, Teacher, Student).
 */
export function DemoLoginSection({
  onSelectPersona,
  disabled,
}: DemoLoginSectionProps) {
  const isDemoEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === "true";

  if (!isDemoEnabled) {
    return null;
  }

  return (
    <div className="space-y-2.5 pt-1">
      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-xs">
        <span className="text-muted-foreground font-medium text-[11px]">
          Demo Login
        </span>
      </FieldSeparator>

      <div className="grid grid-cols-3 gap-2 mt-6">
        {DEMO_PERSONAS.map((persona) => {
          const Icon = persona.icon;

          return (
            <Button
              key={persona.role}
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() =>
                onSelectPersona({
                  email: persona.email,
                  password: persona.password,
                })
              }
              className="h-8.5 px-2 gap-1.5 text-xs font-medium border-border/80 hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Icon className="size-3.5 shrink-0 text-primary" />
              <span>{persona.role}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
