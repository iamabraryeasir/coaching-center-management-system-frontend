"use client";

import {
  Building2,
  GraduationCap,
  Home,
  Loader2,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout, isLoggingOut, role } =
    useAuth();

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your coaching operations, profile, and portal access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5",
              )}
            >
              <Home className="size-4" />
              <span>Home Page</span>
            </Link>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="gap-1.5 shadow-sm"
            >
              {isLoggingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-6 w-48 rounded bg-muted" />
              <div className="h-4 w-72 rounded bg-muted" />
            </CardHeader>
            <CardContent className="h-40 rounded bg-muted/40" />
          </Card>
        )}

        {/* Authenticated User Overview */}
        {!isLoading && isAuthenticated && user && (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Primary Profile Card */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg">User Profile</CardTitle>
                  <CardDescription>
                    Your authenticated account information
                  </CardDescription>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="size-3.5" />
                  {role}
                </span>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Account Status:{" "}
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {user.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
                    <Mail className="size-4 text-muted-foreground" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>

                {/* Role Specific Attributes */}
                {user.adminProfile && (
                  <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                      <Building2 className="size-4 text-primary" />
                      <span>Campus / Institution</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {user.adminProfile.institutionName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.adminProfile.institutionAddress}
                    </p>
                  </div>
                )}

                {user.teacherProfile && (
                  <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                      <GraduationCap className="size-4 text-primary" />
                      <span>Faculty Details</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {user.teacherProfile.designation} —{" "}
                      {user.teacherProfile.specialization}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qualification: {user.teacherProfile.qualification}
                    </p>
                  </div>
                )}

                {user.studentProfile && (
                  <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                      <GraduationCap className="size-4 text-primary" />
                      <span>Student Academic Record</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Class Level: {user.studentProfile.classLevel} (Roll #
                      {user.studentProfile.rollNumber})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Guardian: {user.studentProfile.guardianName} (
                      {user.studentProfile.guardianPhone})
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions & Session Management Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Controls</CardTitle>
                <CardDescription>Manage active login sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  You are currently logged into{" "}
                  <span className="font-semibold text-foreground">
                    {siteConfig.name}
                  </span>
                  . Logging out will clear your authenticated session and return
                  you to the home page.
                </p>

                <Button
                  variant="destructive"
                  className="w-full justify-center gap-2"
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" />
                  )}
                  <span>Sign Out Session</span>
                </Button>

                <div className="pt-2 text-center text-xs text-muted-foreground">
                  Need help? Contact {siteConfig.supportEmail}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Unauthenticated Fallback */}
        {!isLoading && !isAuthenticated && (
          <Card className="text-center py-12">
            <CardHeader className="space-y-2">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                <UserIcon className="size-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">Authentication Required</CardTitle>
              <CardDescription>
                You must be logged in to view and manage dashboard data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "font-semibold",
                )}
              >
                Go to Login
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
