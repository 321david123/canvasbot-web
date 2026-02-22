"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "./dashboard-shell";
import { Onboarding } from "./onboarding";

interface DashboardWrapperProps {
  userName: string;
  children: React.ReactNode;
}

export function DashboardWrapper({
  userName,
  children,
}: DashboardWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem("canvasbot_onboarding_done");
    if (!dismissed) {
      setShowOnboarding(true);
    }
  }, []);

  function handleOnboardingComplete() {
    localStorage.setItem("canvasbot_onboarding_done", "true");
    setShowOnboarding(false);
  }

  return (
    <>
      {mounted && showOnboarding && (
        <Onboarding userName={userName} onComplete={handleOnboardingComplete} />
      )}
      <DashboardShell userName={userName}>{children}</DashboardShell>
    </>
  );
}
