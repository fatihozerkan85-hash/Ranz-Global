"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { assignRefusal, deleteRefusal, getRefusals, getStaffUsers, subscribeStore } from "@/lib/store";
import type { RefusalFile, User } from "@/lib/types";

export function RefusalQueue({ mode }: { mode: "admin" | "staff" }) {
  const { locale } = useLocale();
  const { user } = useAuth();
  const [rows, setRows] = useState<RefusalFile[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { pullOps } = await import("@/lib/ops-client");
      await pullOps();
      if (!alive) return;
      setRows(getRefusals());
      setStaff(getStaffUsers());
    };
    void load();
    const tick = window.setInterval(() => void load(), 5000);
    const unsub = subscribeStore(() => {
      setRows(getRefusals());
      setStaff(getStaffUsers());
    });
    return () => {
      alive = false;
      window.clearInterval(tick);
      unsub();
    };
  }, []);

  const list = mode === "staff" ? rows.filter((row) => row.assignedTo === user?.id) : rows;
  const admin = mode === "admin";

  return (
    <div>
      <h1 className="font-serif text-4xl">{t(locale, "Vize Ret Dosyaları", "Visa Refusal Files")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {admin
          ? t(locale, "Gelen ret değerlendirmelerini bir danışmana atayın.", "Assign incoming refusal reviews to an advisor.")
          : t(locale, "Size atanan ret dosyaları.", "Refusal files assigned to you.")}
      </p>
      <div className="mt-8 space-y-3">
        {list.map((row) => {
          const assigned = Boolean(row.assignedTo);
          const advisor = staff.find((person) => person.id === row.assignedTo);
          const canEdit = admin && (!assigned || editingId === row.id);
          return (
            <div key={row.id} className={`rounded-xl border px-5 py-4 ${assigned ? "border-gold/40 bg-paper" : "border-line bg-paper"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{row.country}</p>
                  <p className="mt-1 text-xs text-muted">
                    {row.id} · {row.name} · {row.email} · {row.year}
                    {advisor ? ` · ${advisor.name}` : ""}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-soft">{row.article}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {admin && assigned && (
                    <button
                      type="button"
                      className="text-xs font-medium text-gold-deep hover:underline"
                      onClick={() => setEditingId((id) => (id === row.id ? null : row.id))}
                    >
                      {editingId === row.id ? t(locale, "Kapat", "Done") : t(locale, "Danışman değiştir", "Change advisor")}
                    </button>
                  )}
                  {admin && (
                    <button
                      type="button"
                      className="text-xs text-[#8a3b24]"
                      onClick={() => {
                        if (
                          window.confirm(
                            t(locale, "Bu ret dosyasını silmek istiyor musunuz?", "Delete this refusal file?"),
                          )
                        ) {
                          deleteRefusal(row.id);
                        }
                      }}
                    >
                      {t(locale, "Sil", "Delete")}
                    </button>
                  )}
                </div>
              </div>
              {admin && (
                <label className="mt-3 block max-w-md text-xs text-muted">
                  {t(locale, "Danışman", "Advisor")}
                  {staff.length === 0 ? (
                    <p className="mt-1 text-sm text-ink-soft">
                      {t(locale, "Önce Danışmanlar’dan hesap açın.", "Create an advisor account first.")}{" "}
                      <Link href="/yonetim/danismanlar" className="text-gold-deep">
                        {t(locale, "Danışmanlar", "Advisors")}
                      </Link>
                    </p>
                  ) : (
                    <select
                      className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-60"
                      value={row.assignedTo}
                      disabled={!canEdit}
                      onChange={(e) => {
                        if (e.target.value) assignRefusal(row.id, e.target.value);
                        setEditingId(null);
                      }}
                    >
                      <option value="">{t(locale, "Atanmadı", "Unassigned")}</option>
                      {staff.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              )}
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Ret dosyası yok.", "No refusal files.")}</p>
        )}
      </div>
    </div>
  );
}
