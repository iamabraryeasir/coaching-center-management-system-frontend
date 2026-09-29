"use client";

import { KeyRound, Settings, User as UserIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveSessionsCard } from "./active-sessions-card";
import { ChangePasswordCard } from "./change-password-card";
import { StudentAvatarCard } from "./student-avatar-card";
import { StudentProfileCard } from "./student-profile-card";

interface StudentSettingsViewProps {
  defaultTab?: "profile" | "security";
}

export function StudentSettingsView({
  defaultTab = "profile",
}: StudentSettingsViewProps = {}) {
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab") as "profile" | "security" | null;

  const [activeTab, setActiveTab] = useState<string>(queryTab || defaultTab);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Settings className="size-3" />
            <span>Learner Profile & Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Student Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your personal profile, student photo, and account security.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="profile" className="gap-1.5 text-xs">
            <UserIcon className="size-3.5" />
            <span>My Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs">
            <KeyRound className="size-3.5" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <StudentAvatarCard />
          <StudentProfileCard />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <ChangePasswordCard />
          <ActiveSessionsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
