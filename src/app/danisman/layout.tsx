"use client";

import { PanelShell } from "@/components/panel-shell";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell mode="staff">{children}</PanelShell>;
}
