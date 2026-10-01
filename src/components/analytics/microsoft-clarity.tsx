"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { identifyClarityUser, initClarity } from "@/lib/clarity";

/**
 * Microsoft Clarity Analytics Provider Component
 *
 * Initializes Microsoft Clarity tracking when NEXT_PUBLIC_CLARITY_PROJECT_ID is provided.
 * Automatically synchronizes authenticated user metadata (ID, Name, Role: ADMIN/TEACHER/STUDENT)
 * allowing targeted session filtering and heatmap analytics in the Clarity dashboard.
 */
export function MicrosoftClarity() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const { user, isAuthenticated } = useAuth();

  // 1. Initialize Clarity once on client mount
  useEffect(() => {
    if (clarityId) {
      initClarity(clarityId);
    }
  }, [clarityId]);

  // 2. Synchronize user metadata (ID, Name, Role: ADMIN/TEACHER/STUDENT) to Clarity session
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      identifyClarityUser({
        id: user.id,
        name: user.name,
        role: user.role,
      });
    }
  }, [user, isAuthenticated]);

  return null;
}
