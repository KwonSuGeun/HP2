"use client";

import HisAppShell from "@/components/layout/HisAppShell";

export default function HisWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <HisAppShell userId={1}>{children}</HisAppShell>;
}
