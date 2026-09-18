import type {
  Application,
  AppointmentRequest,
  AppStatus,
  BlogPost,
  CmsPage,
  DocumentItem,
  FileAppointment,
  HomeContent,
  Locale,
  RefusalFile,
  SiteMedia,
  User,
} from "./types";
import { DEFAULT_GUIDES, DEFAULT_PAGES, DEFAULT_POSTS, SITE } from "./cms";
import { DEFAULT_HOME } from "./site-content";
import { visaTypeById } from "./visa-catalog";
import { isRegionVisaId, REGION_META, regionByCode, visaIdToRegion } from "./region-countries";
import { t } from "./i18n";
import { defaultMailSettings, MAIL_EVENTS, type MailEventId, type MailSettings } from "./mail-catalog";
import { notifyClient, notifyMail } from "./notify";
import { mergeOps, type OpsPayload } from "./ops-shared";

const KEY = "ranz-global-v6";
const LEGACY_KEYS = ["ranz-global-v5"];
const EVENT = "ranz-store";
const DEMO_APP_IDS = new Set(["RG-2026-0142", "RG-2026-0098"]);

const DEMO_USERS: User[] = [
  { id: "u-admin", name: "Işıl Yıldırım", email: "info@ranzglobal.com", role: "admin", password: "ranz2026" },
];
const LEGACY_ADMIN_EMAIL = "yonetici@ranz.demo";

function withoutDemoApplications(apps: Application[] | undefined) {
  return (apps ?? []).filter((app) => !DEMO_APP_IDS.has(app.id));
}

function isRemovedStaff(user: User) {
  return user.id === "u-staff" || user.email.toLowerCase() === "danisman@ranz.demo";
}

function isRemovedDemoClient(user: { id?: string; email: string }) {
  return user.id === "u-ayse" || user.email.toLowerCase() === "ayse@ranz.demo";
}

export function isPublicSessionUser(user: { id?: string; email: string; role?: string } | null | undefined) {
  if (!user?.email) return false;
  if (isRemovedDemoClient(user)) return false;
  if (user.role === "client" && user.email.toLowerCase().endsWith("@ranz.demo")) return false;
  return true;
}

type Store = {
  users: User[];
  applications: Application[];
  appointments: AppointmentRequest[];
  refusals: RefusalFile[];
  pages: CmsPage[];
  posts: BlogPost[];
  guides: CmsPage[];
  home: HomeContent;
  media: SiteMedia[];
  mailSettings: MailSettings;
  deletedApplicationIds: string[];
  deletedAppointmentIds: string[];
  deletedRefusalIds: string[];
  deletedUserEmails: string[];
};

function uniqueIds(list: string[] | undefined) {
  return [...new Set((list ?? []).map((id) => id.trim()).filter(Boolean))];
}

function uniqueEmails(list: string[] | undefined) {
  return [...new Set((list ?? []).map((email) => email.trim().toLowerCase()).filter(Boolean))];
}

function rememberDeleted(list: string[], id: string) {
  if (!id || list.includes(id)) return list;
  list.push(id);
  return list;
}

function emptyStore(): Store {
  return {
    users: DEMO_USERS,
    applications: [],
    appointments: [],
    refusals: [],
    pages: DEFAULT_PAGES,
    posts: DEFAULT_POSTS,
    guides: DEFAULT_GUIDES,
    home: DEFAULT_HOME,
    media: [],
    mailSettings: defaultMailSettings(),
    deletedApplicationIds: [],
    deletedAppointmentIds: [],
    deletedRefusalIds: [],
    deletedUserEmails: [],
  };
}

function mergeUsers(existing?: User[]) {
  const list = (existing?.length ? [...existing] : [...DEMO_USERS])
    .filter((user) => !isRemovedStaff(user) && !isRemovedDemoClient(user))
    .map((user) => {
      if (user.id === "u-admin" || user.email.toLowerCase() === LEGACY_ADMIN_EMAIL) {
        return { ...user, email: "info@ranzglobal.com", role: "admin" as const };
      }
      return user;
    });
  const byEmail = new Map<string, User>();
  for (const user of list) {
    const key = user.email.toLowerCase();
    const prev = byEmail.get(key);
    if (!prev || user.role === "admin") byEmail.set(key, user);
  }
  const deduped = [...byEmail.values()];
  for (const demo of DEMO_USERS) {
    if (!deduped.some((u) => u.email.toLowerCase() === demo.email.toLowerCase() || u.id === demo.id)) {
      deduped.push(demo);
    }
  }
  return deduped;
}

function mergeById<T extends { id: string }>(existing: T[] | undefined, defaults: T[]): T[] {
  const list = existing ?? [];
  const byId = new Map(list.map((item) => [item.id, item]));
  const extras = list.filter((item) => !defaults.some((d) => d.id === item.id));
  return [...defaults.map((item) => byId.get(item.id) ?? item), ...extras];
}

function mergeBySlug<T extends { slug: string }>(existing: T[] | undefined, defaults: T[]) {
  const list = existing?.length ? [...existing] : [...defaults];
  for (const item of defaults) {
    if (!list.some((row) => row.slug === item.slug)) list.push(item);
  }
  return list;
}

function patchLegalPages(pages: CmsPage[]) {
  return pages.map((page) => {
    if (page.slug === "kvkk" && page.bodyTr.includes("yüklenmez")) {
      return DEFAULT_PAGES.find((item) => item.slug === "kvkk") ?? page;
    }
    if (page.slug === "gizlilik" && !page.bodyTr.includes("Vercel Blob")) {
      return DEFAULT_PAGES.find((item) => item.slug === "gizlilik") ?? page;
    }
    return page;
  });
}

function isPlaceholderPhone(phone: string | undefined) {
  const digits = (phone || "").replace(/\D/g, "");
  return !digits || digits === "902120000000" || digits === "2120000000";
}

function patchHomeCopy(home: HomeContent): HomeContent {
  let next = home;
  if (next.ctaSecondaryTr === "Dosyama Gir") {
    next = { ...next, ctaSecondaryTr: DEFAULT_HOME.ctaSecondaryTr, ctaSecondaryEn: DEFAULT_HOME.ctaSecondaryEn };
  }
  if (isPlaceholderPhone(next.phone)) {
    next = { ...next, phone: "" };
  }
  return next;
}

function hydrateStore(parsed: Partial<Store>): Store {
  const deletedUserEmails = uniqueEmails(parsed.deletedUserEmails);
  const deletedEmails = new Set(deletedUserEmails);
  const users = mergeUsers(parsed.users).filter(
    (user) => user.role === "admin" || !deletedEmails.has(user.email.toLowerCase()),
  );
  const staffIds = new Set(users.filter((u) => u.role === "staff").map((u) => u.id));
  const deletedApplicationIds = uniqueIds(parsed.deletedApplicationIds);
  const deletedAppointmentIds = uniqueIds(parsed.deletedAppointmentIds);
  const deletedRefusalIds = uniqueIds(parsed.deletedRefusalIds);
  const deletedApps = new Set(deletedApplicationIds);
  const deletedAppts = new Set(deletedAppointmentIds);
  const deletedRets = new Set(deletedRefusalIds);
  return {
    users,
    applications: withoutDemoApplications(parsed.applications)
      .filter((a) => !deletedApps.has(a.id))
      .map((a) => {
      const assignedTo = a.assignedTo && staffIds.has(a.assignedTo) ? a.assignedTo : "";
      const advisor = users.find((u) => u.id === assignedTo);
      return {
        ...a,
        feeTry: a.feeTry ?? 0,
        paidTry: a.paidTry ?? 0,
        assignedTo,
        advisorName: advisor?.name ?? (assignedTo ? a.advisorName : "Atanmadı"),
      };
    }),
    appointments: (parsed.appointments ?? [])
      .filter((a) => !deletedAppts.has(a.id))
      .map((a) => ({
        ...a,
        phone: a.phone ?? "",
        message: a.message ?? a.topic ?? "",
      })),
    refusals: (parsed.refusals ?? [])
      .filter((row) => !deletedRets.has(row.id))
      .map((row) => ({
        ...row,
        assignedTo: row.assignedTo && staffIds.has(row.assignedTo) ? row.assignedTo : "",
        status: row.assignedTo && staffIds.has(row.assignedTo) ? "assigned" : "new",
      })),
    pages: patchLegalPages(mergeBySlug(parsed.pages, DEFAULT_PAGES)),
    posts: mergeBySlug(parsed.posts, DEFAULT_POSTS),
    guides: mergeBySlug(parsed.guides, DEFAULT_GUIDES),
    home: patchHomeCopy({
      ...DEFAULT_HOME,
      ...parsed.home,
      destCards: mergeById(parsed.home?.destCards, DEFAULT_HOME.destCards),
      steps: parsed.home?.steps ?? DEFAULT_HOME.steps,
      visaCards: mergeById(parsed.home?.visaCards, DEFAULT_HOME.visaCards),
      galleryIds: parsed.home?.galleryIds ?? DEFAULT_HOME.galleryIds,
    }),
    media: parsed.media ?? [],
    mailSettings: { ...defaultMailSettings(), ...(parsed.mailSettings ?? {}) },
    deletedApplicationIds,
    deletedAppointmentIds,
    deletedRefusalIds,
    deletedUserEmails,
  };
}

function read(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return hydrateStore(JSON.parse(raw) as Partial<Store>);

    for (const legacyKey of LEGACY_KEYS) {
      const legacy = localStorage.getItem(legacyKey);
      if (!legacy) continue;
      const migrated = hydrateStore(JSON.parse(legacy) as Partial<Store>);
      localStorage.setItem(KEY, JSON.stringify(migrated));
      localStorage.removeItem(legacyKey);
      return migrated;
    }

    const seeded = emptyStore();
    localStorage.setItem(KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return emptyStore();
  }
}

function write(store: Store, opts?: { skipHub?: boolean; flushHub?: boolean }) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(EVENT));
    if (!opts?.skipHub) {
      void import("./ops-client").then((mod) => mod.scheduleOpsPush(Boolean(opts?.flushHub)));
    }
    return true;
  } catch {
    window.alert("Depolama dolu. Daha küçük görsel kullanın veya bir görseli silin.");
    return false;
  }
}

export function getOpsSnapshot(): OpsPayload {
  const store = read();
  return {
    users: store.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
    })),
    applications: store.applications.map((app) => ({
      ...app,
      documents: (app.documents ?? []).map((doc) => ({
        ...doc,
        fileUrl: undefined,
      })),
    })),
    appointments: store.appointments ?? [],
    refusals: store.refusals ?? [],
    home: store.home,
    deletedApplicationIds: store.deletedApplicationIds ?? [],
    deletedAppointmentIds: store.deletedAppointmentIds ?? [],
    deletedRefusalIds: store.deletedRefusalIds ?? [],
    deletedUserEmails: store.deletedUserEmails ?? [],
  };
}

export function ingestOps(incoming: OpsPayload) {
  if (typeof window === "undefined") return;
  const store = read();
  const merged = mergeOps(
    {
      users: store.users,
      applications: store.applications,
      appointments: store.appointments,
      refusals: store.refusals,
      deletedApplicationIds: store.deletedApplicationIds,
      deletedAppointmentIds: store.deletedAppointmentIds,
      deletedRefusalIds: store.deletedRefusalIds,
      deletedUserEmails: store.deletedUserEmails,
    },
    incoming,
  );
  store.deletedApplicationIds = uniqueIds(merged.deletedApplicationIds);
  store.deletedAppointmentIds = uniqueIds(merged.deletedAppointmentIds);
  store.deletedRefusalIds = uniqueIds(merged.deletedRefusalIds);
  store.deletedUserEmails = uniqueEmails(merged.deletedUserEmails);
  const deletedEmails = new Set(store.deletedUserEmails);
  store.users = mergeUsers(merged.users).filter(
    (user) => user.role === "admin" || !deletedEmails.has(user.email.toLowerCase()),
  );
  store.applications = withoutDemoApplications(merged.applications).map((app) => ({
    ...app,
    documents: app.documents ?? [],
    timeline: app.timeline ?? [],
  }));
  store.appointments = merged.appointments;
  store.refusals = merged.refusals ?? [];
  if (incoming.home) {
    const localAt = store.home.updatedAt || "";
    const remoteAt = incoming.home.updatedAt || "";
    if (!localAt || remoteAt >= localAt) {
      store.home = hydrateStore({ home: incoming.home }).home;
    }
  }
  write(store, { skipHub: true });
}

export function subscribeStore(cb: () => void) {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getMailSettings() {
  return read().mailSettings;
}

export function setMailEventEnabled(id: MailEventId, enabled: boolean) {
  const meta = MAIL_EVENTS.find((item) => item.id === id);
  if (meta?.locked && !enabled) return;
  const store = read();
  store.mailSettings[id] = enabled;
  write(store);
}

function mailOn(id: MailEventId) {
  return read().mailSettings[id] !== false;
}

function adminNotifyEmails() {
  return [...read().users.filter((u) => u.role === "admin").map((u) => u.email), SITE.email];
}

export function getUserById(id?: string) {
  if (!id) return undefined;
  return read().users.find((u) => u.id === id);
}

function userById(id?: string) {
  return getUserById(id);
}

export function getUsers() {
  return read().users;
}

export function findUser(email: string) {
  const value = email.trim().toLowerCase();
  const lookup = value === LEGACY_ADMIN_EMAIL ? "info@ranzglobal.com" : value;
  return getUsers().find((u) => u.email.toLowerCase() === lookup);
}

export function setAccountPassword(email: string, password: string): string | null {
  if (password.length < 6) return "Şifre en az 6 karakter olmalı.";
  const store = read();
  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return "Bu tarayıcıda bu hesap yok. Bağlantıyı hesabın açıldığı cihazda açın.";
  }
  user.password = password;
  write(store);
  return null;
}

export function getApplications(userId?: string) {
  const apps = read().applications;
  if (!userId) return apps;
  return apps.filter((a) => a.userId === userId);
}

export function deleteApplication(id: string) {
  const store = read();
  store.applications = store.applications.filter((app) => app.id !== id);
  rememberDeleted(store.deletedApplicationIds, id);
  write(store, { flushHub: true });
}

export function getApplication(id: string) {
  return read().applications.find((a) => a.id === id);
}

export function progressOf(app: Application) {
  const required = app.documents.filter((d) => d.required);
  const done = required.filter((d) => d.status === "approved" || d.status === "uploaded").length;
  return { done, total: required.length, missing: required.filter((d) => d.status === "empty" || d.status === "rejected") };
}

export function nextAction(app: Application, locale: Locale) {
  const missing = app.documents.filter((d) => d.required && (d.status === "empty" || d.status === "rejected"));
  if (missing.length) {
    return `${missing.length} ${t(locale, "evrak sizi bekliyor", "documents need your attention")}`;
  }
  if (app.submittedAt) {
    return t(locale, "Evraklarınız gönderildi. İnceleme kuyruğundayız.", "Your documents were sent. They are in the review queue.");
  }
  if (app.status === "review") {
    return t(locale, "Danışmanınız inceliyor", "Your advisor is reviewing");
  }
  if (app.status === "complete") {
    return t(locale, "Dosya tamamlandı", "File completed");
  }
  return t(locale, "Dosyanız güncel", "Your file is up to date");
}

function deriveStatus(docs: DocumentItem[], previous?: AppStatus): AppStatus {
  if (docs.some((d) => d.required && d.status === "rejected")) return "revision";
  if (docs.some((d) => d.required && d.status === "empty")) return "missing";
  if (docs.filter((d) => d.required).every((d) => d.status === "approved") && docs.some((d) => d.required)) {
    return previous === "complete" ? "complete" : "ready";
  }
  return "review";
}

export function uploadDocument(
  appId: string,
  key: string,
  fileName: string,
  file?: { pathname?: string; url?: string },
) {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  if (!app) return;
  const doc = app.documents.find((d) => d.key === key);
  if (!doc) return;
  doc.status = "uploaded";
  doc.fileName = fileName;
  doc.filePathname = file?.pathname;
  doc.fileUrl = file?.url;
  doc.note = undefined;
  app.status = deriveStatus(app.documents, app.status);
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: "Evrak yüklendi",
    titleEn: "Document uploaded",
    bodyTr: `${doc.labelTr} yüklendi.`,
    bodyEn: `${doc.labelEn} uploaded.`,
  });
  write(store, { flushHub: true });
}

export function submitDocuments(appId: string): string | null {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  if (!app) return "Dosya bulunamadı.";
  const sentDocs = app.documents.filter((d) => d.status !== "empty");
  if (!sentDocs.length) return "Önce en az bir evrak yükleyin.";
  app.submittedAt = new Date().toISOString();
  app.status = deriveStatus(app.documents, app.status);
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: "Evraklar gönderildi",
    titleEn: "Documents submitted",
    bodyTr: "Müşteri evrak paketini gönderdi. İnceleme kuyruğuna düştü.",
    bodyEn: "The client submitted the document pack. It is in the review queue.",
  });
  write(store, { flushHub: true });
  const client = userById(app.userId);
  const docs = sentDocs.map((d) => d.labelTr).join(", ");
  void notifyMail("docs_submitted", [client?.email], {
    fileId: app.id,
    clientName: client?.name || "",
    audience: "client",
  });
  void notifyMail("docs_submitted", adminNotifyEmails(), {
    fileId: app.id,
    clientName: client?.name || "",
    clientEmail: client?.email || "",
    destination: app.destinationTr,
    docs,
    audience: "admin",
  });
  return null;
}

export function assignApplication(appId: string, staffId: string) {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  const staff = store.users.find((u) => u.id === staffId && u.role === "staff");
  if (!app || !staff) return;
  const previous = userById(app.assignedTo);
  app.assignedTo = staff.id;
  app.advisorName = staff.name;
  app.status = deriveStatus(app.documents, app.status);
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: "Danışman atandı",
    titleEn: "Advisor assigned",
    bodyTr: `Dosya ${staff.name} adlı danışmana atandı.`,
    bodyEn: `File assigned to ${staff.name}.`,
  });
  write(store, { flushHub: true });
  const client = userById(app.userId);
  void notifyMail("advisor_assigned", [staff.email], {
    fileId: app.id,
    destination: app.destinationTr,
    clientName: client?.name || "",
  });
  if (mailOn("assignment_left") && previous && previous.id !== staff.id) {
    void notifyMail("assignment_left", [previous.email], { fileId: app.id });
  }
}

export function reviewDocument(appId: string, key: string, status: "approved" | "rejected", note?: string) {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  if (!app) return;
  const doc = app.documents.find((d) => d.key === key);
  if (!doc) return;
  doc.status = status;
  doc.note = note;
  app.status = deriveStatus(app.documents, app.status);
  app.reviewedAt = new Date().toISOString();
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: status === "approved" ? "Evrak onaylandı" : "Evrak revizyon",
    titleEn: status === "approved" ? "Document approved" : "Document needs revision",
    bodyTr: note || doc.labelTr,
    bodyEn: note || doc.labelEn,
  });
  write(store, { flushHub: true });
  const client = userById(app.userId);
  const staff = userById(app.assignedTo);
  const statusLabel = status === "approved" ? "onaylandı" : "revizyon";
  const revisionCount = String(app.documents.filter((d) => d.status === "rejected").length);
  notifyClient("doc_status", client, {
    fileId: app.id,
    docLabel: doc.labelTr,
    status,
    statusLabel,
    note: note || "",
    destination: app.destinationTr,
    revisionCount,
  });
  void notifyMail("doc_status", [staff?.email], {
    fileId: app.id,
    docLabel: doc.labelTr,
    status,
    statusLabel,
    note: note || "",
    audience: "staff",
  });
}

export function createApplication(userId: string, visaTypeId: string, memberCode?: string) {
  const type = visaTypeById(visaTypeId);
  if (!type) return null;
  const store = read();
  const staff = store.users.find((u) => u.role === "staff");
  const id = `RG-${new Date().getFullYear()}-${Date.now().toString(36)}`;
  const region = isRegionVisaId(type.family) ? visaIdToRegion(type.family) : undefined;
  const member = region ? regionByCode(region, memberCode) : undefined;
  const meta = region ? REGION_META[region] : undefined;
  const app: Application = {
    id,
    userId,
    visaFamily: type.family,
    visaTypeId: type.id,
    destinationTr: member && meta ? `${member.tr} (${meta.labelTr})` : type.titleTr,
    destinationEn: member && meta ? `${member.en} (${meta.labelEn})` : type.titleEn,
    status: "draft",
    createdAt: new Date().toISOString().slice(0, 10),
    advisorName: staff?.name ?? "Atanmadı",
    advisorNoteTr: "Evrak listenizi yükledikçe kontrol edeceğiz. Zorunlu olanlarla başlayın.",
    advisorNoteEn: "We will review as you upload. Start with the required documents.",
    feeTry: type.feeTry,
    paidTry: 0,
    assignedTo: staff?.id ?? "",
    documents: type.documents.map((d) => ({ ...d, status: "empty" as const })),
    timeline: [
      {
        at: nowStamp(),
        titleTr: "Dosya açıldı",
        titleEn: "File opened",
        bodyTr: `${type.titleTr} dosyanız oluşturuldu.`,
        bodyEn: `Your ${type.titleEn} file was created.`,
      },
    ],
  };
  store.applications.unshift(app);
  write(store, { flushHub: true });
  return app;
}

export function addUser(name: string, email: string, password: string, phone?: string): User | null {
  const store = read();
  const existing = store.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) return null;
  const user: User = {
    id: `u-${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    role: "client",
    password,
    phone: phone?.replace(/\D/g, "") || undefined,
  };
  store.users.push(user);
  write(store, { flushHub: true });
  void notifyMail("signup", [email], { name });
  return user;
}

export function getStaffUsers() {
  return getUsers().filter((u) => u.role === "staff");
}

function slugEmailLocal(firstName: string, lastName: string) {
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    â: "a",
    î: "i",
    û: "u",
  };
  const fold = (s: string) =>
    s
      .toLowerCase()
      .split("")
      .map((ch) => map[ch] ?? ch)
      .join("")
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "");
  const local = [fold(firstName), fold(lastName)].filter(Boolean).join(".") || "danisman";
  return local;
}

export function addStaffAdvisor(input: {
  firstName: string;
  lastName: string;
  password: string;
  email?: string;
  titleTr?: string;
  titleEn?: string;
}): { user: User; error?: undefined } | { user?: undefined; error: string } {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const password = input.password;
  if (!firstName || !lastName) return { error: "Ad ve soyad gerekli." };
  if (password.length < 6) return { error: "Şifre en az 6 karakter olmalı." };

  const store = read();
  let email = (input.email || "").trim().toLowerCase();
  if (!email) {
    const local = slugEmailLocal(firstName, lastName);
    email = `${local}@ranz.staff`;
    let n = 2;
    while (store.users.some((u) => u.email.toLowerCase() === email)) {
      email = `${local}${n}@ranz.staff`;
      n += 1;
    }
  } else if (store.users.some((u) => u.email.toLowerCase() === email)) {
    return { error: "Bu e-posta zaten kayıtlı." };
  }

  const user: User = {
    id: `u-staff-${Date.now()}`,
    name: `${firstName} ${lastName}`.replace(/\s+/g, " ").trim(),
    email,
    role: "staff",
    password,
    titleTr: input.titleTr?.trim() || "Vize uzmanı",
    titleEn: input.titleEn?.trim() || "Visa specialist",
  };
  store.deletedUserEmails = store.deletedUserEmails.filter((row) => row !== email);
  store.users.push(user);
  write(store, { flushHub: true });
  if (mailOn("staff_created")) {
    void notifyMail("staff_created", [user.email], {
      name: user.name,
      email: user.email,
      password,
    });
  }
  return { user };
}

export function deleteStaffAdvisor(userId: string): string | null {
  const store = read();
  const user = store.users.find((row) => row.id === userId && row.role === "staff");
  if (!user) return "Danışman bulunamadı.";
  const email = user.email.trim().toLowerCase();
  store.users = store.users.filter((row) => row.id !== userId);
  rememberDeleted(store.deletedUserEmails, email);
  for (const app of store.applications) {
    if (app.assignedTo === userId) {
      app.assignedTo = "";
      app.advisorName = "Atanmadı";
    }
  }
  for (const row of store.refusals) {
    if (row.assignedTo === userId) {
      row.assignedTo = "";
      row.status = "new";
    }
  }
  write(store, { flushHub: true });
  return null;
}

export function setStaffPassword(userId: string, password: string): string | null {
  if (password.length < 6) return "Şifre en az 6 karakter olmalı.";
  const store = read();
  const user = store.users.find((u) => u.id === userId && u.role === "staff");
  if (!user) return "Danışman bulunamadı.";
  user.password = password;
  write(store, { flushHub: true });
  if (mailOn("staff_created")) {
    void notifyMail("staff_created", [user.email], {
      name: user.name,
      email: user.email,
      password,
    });
  }
  return null;
}

function nowStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const DEMO_PASSWORD = "ranz2026";

export function addAppointment(data: Omit<AppointmentRequest, "id" | "createdAt" | "status">) {
  const store = read();
  store.appointments.unshift({
    ...data,
    id: `APT-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  });
  write(store, { flushHub: true });
  if (mailOn("contact_form")) {
    void notifyMail("contact_form", adminNotifyEmails(), {
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      message: data.message,
    });
  }
  if (mailOn("contact_form_client") && data.email) {
    void notifyMail("contact_form_client", [data.email], {
      name: data.name,
      locale: data.locale,
    });
  }
}

export function getAppointments() {
  return read().appointments;
}

export function deleteAppointment(id: string) {
  const store = read();
  store.appointments = store.appointments.filter((row) => row.id !== id);
  rememberDeleted(store.deletedAppointmentIds, id);
  write(store, { flushHub: true });
}

export function addRefusal(data: Omit<RefusalFile, "id" | "createdAt" | "status" | "assignedTo">) {
  const store = read();
  const row: RefusalFile = {
    ...data,
    id: `RET-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
    assignedTo: "",
  };
  store.refusals.unshift(row);
  write(store, { flushHub: true });
  if (mailOn("refusal_form")) {
    void notifyMail("refusal_form", adminNotifyEmails(), {
      name: data.name,
      email: data.email,
      country: data.country,
      year: data.year,
      article: data.article,
      fileId: row.id,
    });
  }
  if (mailOn("refusal_form_client") && data.email) {
    void notifyMail("refusal_form_client", [data.email], {
      name: data.name,
      locale: data.locale,
      country: data.country,
      year: data.year,
      article: data.article,
    });
  }
}

export function getRefusals() {
  return read().refusals;
}

export function deleteRefusal(id: string) {
  const store = read();
  store.refusals = store.refusals.filter((row) => row.id !== id);
  rememberDeleted(store.deletedRefusalIds, id);
  write(store, { flushHub: true });
}

export function assignRefusal(id: string, staffId: string) {
  const store = read();
  const row = store.refusals.find((item) => item.id === id);
  const staff = store.users.find((u) => u.id === staffId && u.role === "staff");
  if (!row || !staff) return;
  const previous = userById(row.assignedTo);
  row.assignedTo = staff.id;
  row.status = "assigned";
  write(store, { flushHub: true });
  void notifyMail("advisor_assigned", [staff.email], {
    fileId: row.id,
    destination: `Vize ret · ${row.country}`,
    clientName: row.name,
  });
  if (mailOn("assignment_left") && previous && previous.id !== staff.id) {
    void notifyMail("assignment_left", [previous.email], { fileId: row.id });
  }
}

export function getPages() {
  return read().pages;
}

export function getPage(slug: string) {
  return getPages().find((p) => p.slug === slug);
}

export function savePage(page: CmsPage) {
  const store = read();
  const i = store.pages.findIndex((p) => p.slug === page.slug);
  if (i >= 0) store.pages[i] = page;
  else store.pages.push(page);
  write(store);
}

export function getPosts() {
  return read().posts.filter((p) => p.status === "published");
}

export function getAllPosts() {
  return read().posts;
}

export function getPost(slug: string) {
  return read().posts.find((p) => p.slug === slug);
}

export function savePost(post: BlogPost) {
  const store = read();
  const i = store.posts.findIndex((p) => p.slug === post.slug);
  if (i >= 0) store.posts[i] = post;
  else store.posts.unshift(post);
  write(store);
}

export function deletePage(slug: string) {
  const store = read();
  store.pages = store.pages.filter((p) => p.slug !== slug);
  write(store);
}

export function deletePost(slug: string) {
  const store = read();
  store.posts = store.posts.filter((p) => p.slug !== slug);
  write(store);
}

export function getGuides() {
  return read().guides;
}

export function getGuide(slug: string) {
  return getGuides().find((p) => p.slug === slug);
}

export function saveGuide(page: CmsPage) {
  const store = read();
  const i = store.guides.findIndex((p) => p.slug === page.slug);
  if (i >= 0) store.guides[i] = page;
  else store.guides.push(page);
  write(store);
}

export function deleteGuide(slug: string) {
  const store = read();
  store.guides = store.guides.filter((p) => p.slug !== slug);
  write(store);
}

export function getHome() {
  return patchHomeCopy(read().home);
}

export function saveHome(home: HomeContent) {
  const store = read();
  store.home = { ...patchHomeCopy(home), updatedAt: new Date().toISOString() };
  return write(store, { flushHub: true });
}

export function getMedia() {
  return read().media;
}

export function getMediaById(id?: string) {
  if (!id) return undefined;
  return getMedia().find((m) => m.id === id);
}

export function addMedia(item: SiteMedia) {
  const store = read();
  store.media.unshift(item);
  write(store);
}

export function deleteMedia(id: string) {
  const store = read();
  store.media = store.media.filter((m) => m.id !== id);
  if (store.home.heroImageId === id) store.home.heroImageId = undefined;
  store.home.galleryIds = store.home.galleryIds.filter((g) => g !== id);
  write(store);
}

export function setApplicationFee(appId: string, feeTry: number) {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  if (!app) return;
  const next = Math.max(0, Math.round(feeTry));
  if (app.feeTry === next) return;
  app.feeTry = next;
  if (app.paidTry > next) app.paidTry = next;
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: "Hizmet bedeli güncellendi",
    titleEn: "Service fee updated",
    bodyTr: `Hizmet bedeli ${next.toLocaleString("tr-TR")} TL olarak kaydedildi.`,
    bodyEn: `Service fee set to ${next.toLocaleString("tr-TR")} TL.`,
  });
  write(store, { flushHub: true });
  if (mailOn("fee_changed")) {
    void notifyMail("fee_changed", adminNotifyEmails(), {
      fileId: app.id,
      fee: String(next),
    });
  }
}

export function setAdvisorNote(appId: string, note: string) {
  const text = note.trim();
  if (!text) return;
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  if (!app) return;
  app.advisorNoteTr = text;
  app.advisorNoteEn = text;
  app.reviewedAt = new Date().toISOString();
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: "Danışman notu",
    titleEn: "Advisor note",
    bodyTr: text,
    bodyEn: text,
  });
  write(store, { flushHub: true });
  const client = userById(app.userId);
  notifyClient("advisor_note", client, { fileId: app.id, note: text, destination: app.destinationTr });
}

export function setFileAppointment(appId: string, appointment: FileAppointment) {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  if (!app) return;
  app.appointment = appointment;
  app.reviewedAt = new Date().toISOString();
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: "Randevu kaydedildi",
    titleEn: "Appointment saved",
    bodyTr: `${appointment.date} ${appointment.time} · ${appointment.cityTr}`,
    bodyEn: `${appointment.date} ${appointment.time} · ${appointment.cityEn}`,
  });
  write(store, { flushHub: true });
  const client = userById(app.userId);
  notifyClient("advisor_note", client, {
    fileId: app.id,
    destination: app.destinationTr,
    note: `Randevu: ${appointment.date} ${appointment.time}, ${appointment.venueTr}, ${appointment.cityTr}.`,
  });
}

export function markFileOutcome(appId: string, status: "ready" | "complete") {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  if (!app) return;
  app.status = status;
  app.reviewedAt = new Date().toISOString();
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: status === "complete" ? "Dosya sonuçlandı" : "Dosya başvuruya hazır",
    titleEn: status === "complete" ? "File closed" : "File ready to apply",
    bodyTr: status === "complete" ? "Süreç panelde kapatıldı." : "Danışman dosyayı başvuruya hazır işaretledi.",
    bodyEn: status === "complete" ? "The file was closed in the portal." : "The advisor marked the file ready to apply.",
  });
  write(store, { flushHub: true });
  const client = userById(app.userId);
  if (mailOn("file_complete")) {
    notifyClient("file_complete", client, { fileId: app.id, destination: app.destinationTr });
  }
}
