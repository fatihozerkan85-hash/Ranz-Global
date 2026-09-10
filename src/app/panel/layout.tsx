"use client";

import { PanelShell } from "@/components/panel-shell";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell mode="client">{children}</PanelShell>;
}
