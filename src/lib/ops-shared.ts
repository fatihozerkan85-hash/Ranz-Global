import type { Application, AppointmentRequest, HomeContent, RefusalFile, User } from "./types";

export type OpsPayload = {
  users: User[];
  applications: Application[];
  appointments: AppointmentRequest[];
  refusals?: RefusalFile[];
  home?: HomeContent;
  deletedApplicationIds?: string[];
  deletedAppointmentIds?: string[];
  deletedRefusalIds?: string[];
  deletedUserEmails?: string[];
};

export const EMPTY_OPS: OpsPayload = { users: [], applications: [], appointments: [], refusals: [] };

function uniqueIds(lists: (string[] | undefined)[]) {
  return [...new Set(lists.flatMap((list) => list ?? []).map((id) => id.trim()).filter(Boolean))];
}

function uniqueEmails(lists: (string[] | undefined)[]) {
  return [...new Set(lists.flatMap((list) => list ?? []).map((email) => email.trim().toLowerCase()).filter(Boolean))];
}

function appStamp(app: Application) {
  return app.timeline[0]?.at || app.submittedAt || app.createdAt || "";
}

function later(a?: string, b?: string) {
  if (!a) return b || "";
  if (!b) return a;
  return a >= b ? a : b;
}

const DOC_RANK: Record<string, number> = {
  empty: 0,
  uploaded: 1,
  rejected: 2,
  approved: 3,
};

function mergeDocuments(a: Application["documents"] = [], b: Application["documents"] = []) {
  const map = new Map<string, Application["documents"][number]>();
  const order: string[] = [];
  for (const doc of [...a, ...b]) {
    if (!doc?.key) continue;
    if (!map.has(doc.key)) order.push(doc.key);
    const prev = map.get(doc.key);
    if (!prev) {
      map.set(doc.key, { ...doc });
      continue;
    }
    const takeB = (DOC_RANK[doc.status] ?? 0) >= (DOC_RANK[prev.status] ?? 0);
    const keep = takeB ? doc : prev;
    const other = takeB ? prev : doc;
    map.set(doc.key, {
      ...keep,
      fileName: keep.fileName || other.fileName,
      filePathname: keep.filePathname || other.filePathname,
      fileUrl: keep.fileUrl || other.fileUrl,
      note: keep.note || other.note,
    });
  }
  return order.map((key) => map.get(key)!);
}

function mergeTimeline(a: Application["timeline"] = [], b: Application["timeline"] = []) {
  const map = new Map<string, (typeof a)[number]>();
  for (const item of [...a, ...b]) {
    if (!item) continue;
    map.set(`${item.at}|${item.titleTr}`, item);
  }
  return [...map.values()].sort((x, y) => (y.at || "").localeCompare(x.at || ""));
}

function derivedFileStatus(app: Application): Application["status"] {
  if (app.status === "complete") return "complete";
  const docs = app.documents ?? [];
  if (docs.some((d) => d.required && d.status === "rejected")) return "revision";
  const required = docs.filter((d) => d.required);
  if (required.length && required.every((d) => d.status === "approved")) return "ready";
  if (app.submittedAt || docs.some((d) => d.status === "uploaded" || d.status === "approved")) return "review";
  if (required.some((d) => d.status === "empty")) return "missing";
  return app.status || "draft";
}

function pickApp(a: Application, b: Application): Application {
  const newer = appStamp(a) >= appStamp(b) ? a : b;
  const older = newer === a ? b : a;
  const documents = mergeDocuments(a.documents, b.documents);
  const assignedTo = newer.assignedTo || older.assignedTo || "";
  const merged: Application = {
    ...older,
    ...newer,
    documents,
    timeline: mergeTimeline(a.timeline, b.timeline),
    submittedAt: later(a.submittedAt, b.submittedAt) || undefined,
    reviewedAt: later(a.reviewedAt, b.reviewedAt) || undefined,
    assignedTo,
    advisorName: assignedTo
      ? newer.assignedTo
        ? newer.advisorName
        : older.advisorName || newer.advisorName
      : newer.advisorName || older.advisorName,
    feeTry: Math.max(a.feeTry || 0, b.feeTry || 0),
    paidTry: Math.max(a.paidTry || 0, b.paidTry || 0),
    appointment: newer.appointment || older.appointment,
  };
  merged.status = derivedFileStatus(merged);
  return merged;
}

function pickUser(a: User, b: User): User {
  const admin = a.role === "admin" || b.role === "admin";
  if (admin) {
    const base = a.role === "admin" ? a : b;
    const other = base === a ? b : a;
    return {
      ...base,
      role: "admin",
      password: base.password || other.password,
    };
  }
  const staff = a.role === "staff" || b.role === "staff";
  const newer = b;
  return {
    ...newer,
    role: staff ? "staff" : newer.role,
    password: newer.password || a.password,
    name: newer.name || a.name,
    phone: newer.phone || a.phone,
    titleTr: newer.titleTr || a.titleTr,
    titleEn: newer.titleEn || a.titleEn,
  };
}

export function mergeOps(base: OpsPayload, incoming: OpsPayload): OpsPayload {
  const users = new Map<string, User>();
  for (const user of [...base.users, ...incoming.users]) {
    if (!user?.email) continue;
    const key = user.email.trim().toLowerCase();
    const prev = users.get(key);
    users.set(key, prev ? pickUser(prev, user) : user);
  }

  const applications = new Map<string, Application>();
  for (const app of [...base.applications, ...incoming.applications]) {
    const prev = applications.get(app.id);
    applications.set(app.id, prev ? pickApp(prev, app) : app);
  }

  const appointments = new Map<string, AppointmentRequest>();
  for (const row of [...base.appointments, ...incoming.appointments]) {
    appointments.set(row.id, row);
  }

  const refusals = new Map<string, RefusalFile>();
  for (const row of [...(base.refusals ?? []), ...(incoming.refusals ?? [])]) {
    if (!row?.id) continue;
    refusals.set(row.id, row);
  }

  const deletedApplicationIds = uniqueIds([base.deletedApplicationIds, incoming.deletedApplicationIds]);
  const deletedAppointmentIds = uniqueIds([base.deletedAppointmentIds, incoming.deletedAppointmentIds]);
  const deletedRefusalIds = uniqueIds([base.deletedRefusalIds, incoming.deletedRefusalIds]);
  const deletedUserEmails = uniqueEmails([base.deletedUserEmails, incoming.deletedUserEmails]);
  const deletedApps = new Set(deletedApplicationIds);
  const deletedAppts = new Set(deletedAppointmentIds);
  const deletedRets = new Set(deletedRefusalIds);
  const deletedEmails = new Set(deletedUserEmails);

  return {
    users: [...users.values()].filter((user) => user.role === "admin" || !deletedEmails.has(user.email.trim().toLowerCase())),
    applications: [...applications.values()]
      .filter((app) => !deletedApps.has(app.id))
      .sort((a, b) => appStamp(b).localeCompare(appStamp(a))),
    appointments: [...appointments.values()]
      .filter((row) => !deletedAppts.has(row.id))
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    refusals: [...refusals.values()]
      .filter((row) => !deletedRets.has(row.id))
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    home: incoming.home
      ? (() => {
          const digits = (incoming.home.phone || "").replace(/\D/g, "");
          const phone =
            !digits || digits === "902120000000" || digits === "2120000000"
              ? "+90 530 925 88 92"
              : incoming.home.phone;
          if (incoming.home.ctaSecondaryTr === "Dosyama Gir") {
            return { ...incoming.home, ctaSecondaryTr: "Müşteri Paneli", ctaSecondaryEn: "Client Portal", phone };
          }
          return phone === incoming.home.phone ? incoming.home : { ...incoming.home, phone };
        })()
      : base.home,
    deletedApplicationIds,
    deletedAppointmentIds,
    deletedRefusalIds,
    deletedUserEmails,
  };
}

export function isOpsPayload(value: unknown): value is OpsPayload {
  if (!value || typeof value !== "object") return false;
  const row = value as OpsPayload;
  return Array.isArray(row.users) && Array.isArray(row.applications);
}

export function coerceOps(value: unknown): OpsPayload | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (row.application && typeof row.application === "object") {
    const users = Array.isArray(row.users) ? [...(row.users as User[])] : [];
    if (row.user && typeof row.user === "object") users.push(row.user as User);
    return {
      users,
      applications: [row.application as Application],
      appointments: [],
      refusals: [],
    };
  }
  if (!Array.isArray(row.users) || !Array.isArray(row.applications)) return null;
  return {
    users: row.users as User[],
    applications: row.applications as Application[],
    appointments: Array.isArray(row.appointments) ? (row.appointments as AppointmentRequest[]) : [],
    refusals: Array.isArray(row.refusals) ? (row.refusals as RefusalFile[]) : [],
    home: row.home && typeof row.home === "object" ? (row.home as HomeContent) : undefined,
    deletedApplicationIds: Array.isArray(row.deletedApplicationIds) ? (row.deletedApplicationIds as string[]) : [],
    deletedAppointmentIds: Array.isArray(row.deletedAppointmentIds) ? (row.deletedAppointmentIds as string[]) : [],
    deletedRefusalIds: Array.isArray(row.deletedRefusalIds) ? (row.deletedRefusalIds as string[]) : [],
    deletedUserEmails: Array.isArray(row.deletedUserEmails) ? (row.deletedUserEmails as string[]) : [],
  };
}
