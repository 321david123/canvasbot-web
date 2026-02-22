"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "./dashboard-shell";
import { Onboarding } from "./onboarding";

interface DashboardWrapperProps {
  userName: string;
  isNewUser: boolean;
  children: React.ReactNode;
}

export function DashboardWrapper({
  userName,
  isNewUser,
  children,
}: DashboardWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isNewUser) {
      const dismissed = localStorage.getItem("canvasbot_onboarding_done");
      if (!dismissed) {
        setShowOnboarding(true);
      }
    }
  }, [isNewUser]);

  function handleOnboardingComplete() {
    localStorage.setItem("canvasbot_onboarding_done", "true");
    setShowOnboarding(false);
  }

  return (
    <>
      {showOnboarding && (
        <Onboarding userName={userName} onComplete={handleOnboardingComplete} />
      )}
      <DashboardShell userName={userName}>{children}</DashboardShell>
    </>
  );
}
