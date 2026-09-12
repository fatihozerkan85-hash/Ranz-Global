"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { whatsappHref } from "@/lib/contact";
import { t } from "@/lib/i18n";
import { BrandMark } from "@/components/site-chrome";
import { LanguageSwitcher } from "@/components/language-switcher";
import { FileStack, LayoutDashboard, LogOut, MessageCircle, Plus, Search, FileText, Users, Wallet } from "lucide-react";

export function PanelShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "client" | "staff" | "admin";
}) {
  const { user, logout, ready } = useAuth();
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/giris");
      return;
    }
    const seoRoute = pathname === "/yonetim/seo" || pathname.startsWith("/yonetim/seo/");
    if (mode === "staff" && user.role === "admin") {
      if (pathname === "/danisman" || pathname === "/danisman/") {
        router.replace("/yonetim/kuyruk");
      } else if (pathname.startsWith("/danisman/")) {
        router.replace(`/yonetim${pathname.slice("/danisman".length)}`);
      }
      return;
    }
    if (mode === "staff" && user.role !== "staff") router.replace("/panel");
    if (mode === "admin" && user.role !== "admin") {
      if (user.role === "staff" && seoRoute) return;
      router.replace(user.role === "staff" ? "/danisman" : "/panel");
    }
    if (mode === "client" && user.role !== "client") {
      router.replace(user.role === "admin" ? "/yonetim/erp" : "/danisman");
    }
  }, [ready, user, mode, router, pathname]);

  if (!ready || !user) {
    return <div className="grid min-h-screen place-items-center text-muted">…</div>;
  }

  const seoRoute = pathname === "/yonetim/seo" || pathname.startsWith("/yonetim/seo/");
  if (mode === "staff" && user.role !== "staff") return null;
  if (mode === "admin" && user.role !== "admin" && !(user.role === "staff" && seoRoute)) return null;
  if (mode === "client" && user.role !== "client") return null;

  const items =
    user.role === "admin"
      ? [
          { href: "/yonetim/erp", label: t(locale, "Mini ERP", "Mini ERP"), icon: Wallet },
          { href: "/yonetim/danismanlar", label: t(locale, "Danışmanlar", "Advisors"), icon: Users },
          { href: "/yonetim/site", label: t(locale, "Site içeriği", "Site content"), icon: FileText },
          { href: "/yonetim/seo", label: t(locale, "SEO paneli", "SEO panel"), icon: Search },
          { href: "/yonetim/kuyruk", label: t(locale, "Dosya kuyruğu", "Queue"), icon: LayoutDashboard },
        ]
      : mode === "staff" || user.role === "staff"
        ? [
            { href: "/danisman", label: t(locale, "Kuyruk", "Queue"), icon: LayoutDashboard },
            { href: "/yonetim/seo", label: t(locale, "SEO paneli", "SEO panel"), icon: Search },
          ]
        : [
          { href: "/panel", label: t(locale, "Özet", "Overview"), icon: LayoutDashboard },
          { href: "/panel/yeni", label: t(locale, "Yeni dosya", "New file"), icon: Plus },
          { href: "/panel/evraklar", label: t(locale, "Evrak kasası", "Document vault"), icon: FileStack },
        ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-line bg-paper md:flex md:flex-col">
          <div className="border-b border-line px-5 py-5">
            <BrandMark />
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {items.map((item) => {
              const active =
                item.href === "/yonetim"
                  ? pathname === "/yonetim"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm ${
                    active ? "bg-navy text-cream" : "text-ink-soft hover:bg-cream"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-line p-4 text-xs text-muted">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
              {user.role === "admin"
                ? t(locale, "Yönetici", "Admin")
                : user.role === "staff"
                  ? t(locale, "Danışman", "Advisor")
                  : t(locale, "Müşteri", "Client")}
            </p>
            <p className="mt-1 font-medium text-ink">{user.name}</p>
            <p>{user.email}</p>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between gap-2 border-b border-line bg-paper/90 px-4 backdrop-blur md:px-8">
            <div className="md:hidden">
              <BrandMark />
            </div>
            <p className="hidden text-sm text-muted md:block">
              {t(locale, "Bugün yalnızca sıradaki adıma bakın.", "Focus on the next step only.")}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <a
                href={whatsappHref(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white sm:flex"
              >
                <MessageCircle size={14} />
              </a>
              <LanguageSwitcher compact />
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="grid h-9 w-9 place-items-center rounded-full bg-navy text-cream hover:bg-navy-hover"
                aria-label="logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">{children}</main>
          <nav className="sticky bottom-0 flex gap-1 border-t border-line bg-paper px-2 py-2 md:hidden">
            {items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-md py-2 text-[10px] ${
                    active ? "text-ink" : "text-muted"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
