"use client";

import { PanelShell } from "@/components/panel-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell mode="admin">{children}</PanelShell>;
}
