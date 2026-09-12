import type {
  Application,
  AppointmentRequest,
  AppStatus,
  BlogPost,
  CmsPage,
  DocumentItem,
  HomeContent,
  Locale,
  SiteMedia,
  User,
} from "./types";
import { DEFAULT_GUIDES, DEFAULT_PAGES, DEFAULT_POSTS, SITE } from "./cms";
import { DEFAULT_HOME } from "./site-content";
import { visaTypeById } from "./visa-catalog";
import { t } from "./i18n";
import { defaultMailSettings, MAIL_EVENTS, type MailEventId, type MailSettings } from "./mail-catalog";
import { notifyMail } from "./notify";

const KEY = "ranz-global-v6";
const LEGACY_KEYS = ["ranz-global-v5"];
const EVENT = "ranz-store";
const DEMO_APP_IDS = new Set(["RG-2026-0142", "RG-2026-0098"]);

const DEMO_USERS: User[] = [
  { id: "u-ayse", name: "Ayşe Demir", email: "ayse@ranz.demo", role: "client", password: "ranz2026" },
  { id: "u-admin", name: "Işıl Yıldırım", email: "yonetici@ranz.demo", role: "admin", password: "ranz2026" },
];

function withoutDemoApplications(apps: Application[] | undefined) {
  return (apps ?? []).filter((app) => !DEMO_APP_IDS.has(app.id));
}

function isRemovedStaff(user: User) {
  return user.id === "u-staff" || user.email.toLowerCase() === "danisman@ranz.demo";
}

type Store = {
  users: User[];
  applications: Application[];
  appointments: AppointmentRequest[];
  pages: CmsPage[];
  posts: BlogPost[];
  guides: CmsPage[];
  home: HomeContent;
  media: SiteMedia[];
  mailSettings: MailSettings;
};

function emptyStore(): Store {
  return {
    users: DEMO_USERS,
    applications: [],
    appointments: [],
    pages: DEFAULT_PAGES,
    posts: DEFAULT_POSTS,
    guides: DEFAULT_GUIDES,
    home: DEFAULT_HOME,
    media: [],
    mailSettings: defaultMailSettings(),
  };
}

function mergeUsers(existing?: User[]) {
  const list = (existing?.length ? [...existing] : [...DEMO_USERS]).filter((user) => !isRemovedStaff(user));
  for (const demo of DEMO_USERS) {
    if (!list.some((u) => u.email.toLowerCase() === demo.email.toLowerCase())) {
      list.push(demo);
    }
  }
  return list;
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

function hydrateStore(parsed: Partial<Store>): Store {
  const users = mergeUsers(parsed.users);
  const staffIds = new Set(users.filter((u) => u.role === "staff").map((u) => u.id));
  return {
    users,
    applications: withoutDemoApplications(parsed.applications).map((a) => {
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
    appointments: (parsed.appointments ?? []).map((a) => ({
      ...a,
      phone: a.phone ?? "",
      message: a.message ?? a.topic ?? "",
    })),
    pages: patchLegalPages(mergeBySlug(parsed.pages, DEFAULT_PAGES)),
    posts: mergeBySlug(parsed.posts, DEFAULT_POSTS),
    guides: mergeBySlug(parsed.guides, DEFAULT_GUIDES),
    home: {
      ...DEFAULT_HOME,
      ...parsed.home,
      destCards: parsed.home?.destCards ?? DEFAULT_HOME.destCards,
      steps: parsed.home?.steps ?? DEFAULT_HOME.steps,
      visaCards: parsed.home?.visaCards ?? DEFAULT_HOME.visaCards,
      galleryIds: parsed.home?.galleryIds ?? DEFAULT_HOME.galleryIds,
    },
    media: parsed.media ?? [],
    mailSettings: { ...defaultMailSettings(), ...(parsed.mailSettings ?? {}) },
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

function write(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(EVENT));
    return true;
  } catch {
    window.alert("Depolama dolu. Daha küçük görsel kullanın veya bir görseli silin.");
    return false;
  }
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

function userById(id?: string) {
  if (!id) return undefined;
  return read().users.find((u) => u.id === id);
}

export function getUsers() {
  return read().users;
}

export function findUser(email: string) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getApplications(userId?: string) {
  const apps = read().applications;
  if (!userId) return apps;
  return apps.filter((a) => a.userId === userId);
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
  if (app.status === "review") {
    return t(locale, "Danışmanınız inceliyor", "Your advisor is reviewing");
  }
  if (app.status === "complete") {
    return t(locale, "Dosya tamamlandı", "File completed");
  }
  return t(locale, "Dosyanız güncel", "Your file is up to date");
}

function deriveStatus(docs: DocumentItem[]): AppStatus {
  if (docs.some((d) => d.required && d.status === "rejected")) return "revision";
  if (docs.some((d) => d.required && d.status === "empty")) return "missing";
  if (docs.filter((d) => d.required).every((d) => d.status === "approved")) return "complete";
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
  app.status = deriveStatus(app.documents);
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: "Evrak yüklendi",
    titleEn: "Document uploaded",
    bodyTr: `${doc.labelTr} yüklendi.`,
    bodyEn: `${doc.labelEn} uploaded.`,
  });
  write(store);
  const client = userById(app.userId);
  const staff = userById(app.assignedTo);
  void notifyMail("doc_status", [client?.email], {
    fileId: app.id,
    docLabel: doc.labelTr,
    status: "uploaded",
    statusLabel: "yüklendi",
    audience: "client",
  });
  void notifyMail("doc_status", [staff?.email], {
    fileId: app.id,
    docLabel: doc.labelTr,
    status: "uploaded",
    statusLabel: "yüklendi",
    audience: "staff",
  });
  const required = app.documents.filter((d) => d.required);
  if (mailOn("all_docs_uploaded") && required.length > 0 && required.every((d) => d.status !== "empty")) {
    void notifyMail("all_docs_uploaded", [staff?.email], { fileId: app.id });
  }
}

export function assignApplication(appId: string, staffId: string) {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  const staff = store.users.find((u) => u.id === staffId && u.role === "staff");
  if (!app || !staff) return;
  const previous = userById(app.assignedTo);
  app.assignedTo = staff.id;
  app.advisorName = staff.name;
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: "Danışman atandı",
    titleEn: "Advisor assigned",
    bodyTr: `Dosya ${staff.name} adlı danışmana atandı.`,
    bodyEn: `File assigned to ${staff.name}.`,
  });
  write(store);
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
  app.status = deriveStatus(app.documents);
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: status === "approved" ? "Evrak onaylandı" : "Evrak revizyon",
    titleEn: status === "approved" ? "Document approved" : "Document needs revision",
    bodyTr: note || doc.labelTr,
    bodyEn: note || doc.labelEn,
  });
  write(store);
  const client = userById(app.userId);
  const staff = userById(app.assignedTo);
  const statusLabel = status === "approved" ? "onaylandı" : "revizyon";
  void notifyMail("doc_status", [client?.email], {
    fileId: app.id,
    docLabel: doc.labelTr,
    status,
    statusLabel,
    note: note || "",
    audience: "client",
  });
  void notifyMail("doc_status", [staff?.email], {
    fileId: app.id,
    docLabel: doc.labelTr,
    status,
    statusLabel,
    note: note || "",
    audience: "staff",
  });
  if (status === "rejected" && note) {
    void notifyMail("advisor_note", [client?.email], { fileId: app.id, note });
  }
  if (mailOn("file_complete") && app.status === "complete") {
    void notifyMail("file_complete", [client?.email], {
      fileId: app.id,
      destination: app.destinationTr,
      audience: "client",
    });
    void notifyMail("file_complete", adminNotifyEmails(), {
      fileId: app.id,
      destination: app.destinationTr,
      audience: "admin",
    });
  }
}

export function createApplication(userId: string, visaTypeId: string) {
  const type = visaTypeById(visaTypeId);
  if (!type) return null;
  const store = read();
  const staff = store.users.find((u) => u.role === "staff");
  const id = `RG-2026-${String(1000 + store.applications.length).slice(-4)}`;
  const app: Application = {
    id,
    userId,
    visaFamily: type.family,
    visaTypeId: type.id,
    destinationTr: type.titleTr,
    destinationEn: type.titleEn,
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
  write(store);
  if (mailOn("file_opened")) {
    const client = userById(userId);
    void notifyMail("file_opened", [staff?.email, ...adminNotifyEmails()], {
      fileId: app.id,
      destination: app.destinationTr,
      clientName: client?.name || "",
    });
  }
  return app;
}

export function addUser(name: string, email: string, password: string): User {
  const store = read();
  const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;
  const user: User = { id: `u-${Date.now()}`, name, email, role: "client", password };
  store.users.push(user);
  write(store);
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
  };
  store.users.push(user);
  write(store);
  if (mailOn("staff_created")) {
    void notifyMail("staff_created", [user.email], {
      name: user.name,
      email: user.email,
      password,
    });
  }
  return { user };
}

export function setStaffPassword(userId: string, password: string): string | null {
  if (password.length < 6) return "Şifre en az 6 karakter olmalı.";
  const store = read();
  const user = store.users.find((u) => u.id === userId && u.role === "staff");
  if (!user) return "Danışman bulunamadı.";
  user.password = password;
  write(store);
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
  write(store);
  if (mailOn("contact_form")) {
    void notifyMail("contact_form", adminNotifyEmails(), {
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      message: data.message,
    });
  }
}

export function getAppointments() {
  return read().appointments;
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
  return read().home;
}

export function saveHome(home: HomeContent) {
  const store = read();
  store.home = home;
  write(store);
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
  write(store);
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
  app.timeline.unshift({
    at: nowStamp(),
    titleTr: "Danışman notu",
    titleEn: "Advisor note",
    bodyTr: text,
    bodyEn: text,
  });
  write(store);
  const client = userById(app.userId);
  void notifyMail("advisor_note", [client?.email], { fileId: app.id, note: text });
}
