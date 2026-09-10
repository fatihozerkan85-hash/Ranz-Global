import type { Application, AppointmentRequest, AppStatus, BlogPost, CmsPage, DocumentItem, User } from "./types";
import { DEFAULT_PAGES, DEFAULT_POSTS } from "./cms";
import { visaTypeById } from "./visa-catalog";

const KEY = "ranz-global-v3";
const EVENT = "ranz-store";

const DEMO_USERS: User[] = [
  { id: "u-ayse", name: "Ayşe Demir", email: "ayse@ranz.demo", role: "client", password: "ranz2026" },
  { id: "u-staff", name: "Elif Kaya", email: "danisman@ranz.demo", role: "staff", password: "ranz2026" },
  { id: "u-admin", name: "Işıl Yıldırım", email: "yonetici@ranz.demo", role: "admin", password: "ranz2026" },
];

function seedApplications(): Application[] {
  return [
    {
      id: "RG-2026-0142",
      userId: "u-ayse",
      visaFamily: "schengen",
      visaTypeId: "schengen",
      destinationTr: "Schengen ülkeleri",
      destinationEn: "Schengen countries",
      status: "missing",
      createdAt: "2026-08-28",
      advisorName: "Elif Kaya",
      advisorNoteTr:
        "Pasaport ve sigorta uygun. Banka dökümünde son 3 ayın tamamı görünmüyor; lütfen eksik ayı yükleyin. Uçak rezervasyonu henüz yok.",
      advisorNoteEn:
        "Passport and insurance look good. Bank statements are missing a month. Please upload the missing month and a flight reservation.",
      feeTry: 18500,
      paidTry: 9250,
      assignedTo: "u-staff",
      documents: [
        { key: "passport", labelTr: "Pasaport (son 10 yıl, 2 boş sayfa)", labelEn: "Passport", required: true, status: "approved", fileName: "pasaport.pdf" },
        { key: "photo", labelTr: "Biyometrik fotoğraf", labelEn: "Biometric photo", required: true, status: "approved", fileName: "foto.jpg" },
        { key: "form", labelTr: "Başvuru formu", labelEn: "Application form", required: true, status: "uploaded", fileName: "form.pdf" },
        { key: "flight", labelTr: "Uçak rezervasyonu", labelEn: "Flight reservation", required: true, status: "empty" },
        { key: "hotel", labelTr: "Konaklama rezervasyonu", labelEn: "Hotel reservation", required: true, status: "uploaded", fileName: "otel.pdf" },
        { key: "insurance", labelTr: "Seyahat sağlık sigortası", labelEn: "Travel medical insurance", required: true, status: "approved", fileName: "sigorta.pdf" },
        { key: "bank", labelTr: "Banka hesap dökümü (son 3 ay)", labelEn: "Bank statements", required: true, status: "rejected", fileName: "hesap-ocak.pdf", note: "Haziran–Ağustos eksik." },
        { key: "work", labelTr: "İş / gelir belgesi", labelEn: "Employment proof", required: true, status: "uploaded", fileName: "sgk.pdf" },
        { key: "invite", labelTr: "Davet mektubu", labelEn: "Invitation letter", required: false, status: "empty" },
      ],
      timeline: [
        { at: "2026-08-28 10:12", titleTr: "Dosya açıldı", titleEn: "File opened", bodyTr: "Schengen dosyanız oluşturuldu.", bodyEn: "Your Schengen file was created." },
        { at: "2026-08-29 16:40", titleTr: "İlk evraklar alındı", titleEn: "First documents received", bodyTr: "Pasaport ve fotoğraf onaylandı.", bodyEn: "Passport and photo were approved." },
        { at: "2026-09-04 11:05", titleTr: "Eksik bildirildi", titleEn: "Missing items flagged", bodyTr: "Banka dökümü revizyon, uçak rezervasyonu bekleniyor.", bodyEn: "Bank statement needs revision; flight reservation is missing." },
      ],
    },
    {
      id: "RG-2026-0098",
      userId: "u-ayse",
      visaFamily: "usa",
      visaTypeId: "usa",
      destinationTr: "Amerika Birleşik Devletleri",
      destinationEn: "United States",
      status: "complete",
      createdAt: "2026-06-02",
      advisorName: "Elif Kaya",
      advisorNoteTr: "Dosya kapatıldı. Randevu hazırlığı tamam.",
      advisorNoteEn: "File closed. Interview preparation is complete.",
      feeTry: 24500,
      paidTry: 24500,
      assignedTo: "u-staff",
      documents: [
        { key: "passport", labelTr: "Pasaport", labelEn: "Passport", required: true, status: "approved", fileName: "pasaport.pdf" },
        { key: "ds160", labelTr: "DS-160 onay sayfası", labelEn: "DS-160 confirmation", required: true, status: "approved", fileName: "ds160.pdf" },
        { key: "photo", labelTr: "Fotoğraf (5×5 cm)", labelEn: "Photo", required: true, status: "approved", fileName: "foto.jpg" },
        { key: "appointment", labelTr: "Randevu teyidi", labelEn: "Appointment confirmation", required: true, status: "approved", fileName: "randevu.pdf" },
        { key: "finance", labelTr: "Mali durum belgesi", labelEn: "Financial evidence", required: true, status: "approved", fileName: "mali.pdf" },
        { key: "itinerary", labelTr: "Seyahat planı", labelEn: "Travel itinerary", required: true, status: "approved", fileName: "plan.pdf" },
      ],
      timeline: [
        { at: "2026-06-02 09:00", titleTr: "Dosya açıldı", titleEn: "File opened", bodyTr: "ABD dosyası oluşturuldu.", bodyEn: "USA file created." },
        { at: "2026-06-18 14:20", titleTr: "İnceleme tamam", titleEn: "Review complete", bodyTr: "Tüm evraklar onaylandı.", bodyEn: "All documents approved." },
      ],
    },
  ];
}

type Store = {
  users: User[];
  applications: Application[];
  appointments: AppointmentRequest[];
  pages: CmsPage[];
  posts: BlogPost[];
};

function emptyStore(): Store {
  return {
    users: DEMO_USERS,
    applications: seedApplications(),
    appointments: [],
    pages: DEFAULT_PAGES,
    posts: DEFAULT_POSTS,
  };
}

function read(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seeded = emptyStore();
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      users: parsed.users?.length ? parsed.users : DEMO_USERS,
      applications: (parsed.applications ?? seedApplications()).map((a) => ({
        ...a,
        feeTry: a.feeTry ?? 0,
        paidTry: a.paidTry ?? 0,
        assignedTo: a.assignedTo ?? "u-staff",
      })),
      appointments: (parsed.appointments ?? []).map((a) => ({
        ...a,
        phone: a.phone ?? "",
        message: a.message ?? a.topic ?? "",
      })),
      pages: parsed.pages?.length ? parsed.pages : DEFAULT_PAGES,
      posts: parsed.posts?.length ? parsed.posts : DEFAULT_POSTS,
    };
  } catch {
    return emptyStore();
  }
}

function write(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(EVENT));
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

export function nextAction(app: Application, locale: "tr" | "en") {
  const missing = app.documents.filter((d) => d.required && (d.status === "empty" || d.status === "rejected"));
  if (missing.length) {
    return locale === "tr"
      ? `${missing.length} evrak sizi bekliyor`
      : `${missing.length} documents need your attention`;
  }
  if (app.status === "review") {
    return locale === "tr" ? "Danışmanınız inceliyor" : "Your advisor is reviewing";
  }
  if (app.status === "complete") {
    return locale === "tr" ? "Dosya tamamlandı" : "File completed";
  }
  return locale === "tr" ? "Dosyanız güncel" : "Your file is up to date";
}

function deriveStatus(docs: DocumentItem[]): AppStatus {
  if (docs.some((d) => d.required && d.status === "rejected")) return "revision";
  if (docs.some((d) => d.required && d.status === "empty")) return "missing";
  if (docs.filter((d) => d.required).every((d) => d.status === "approved")) return "complete";
  return "review";
}

export function uploadDocument(appId: string, key: string, fileName: string) {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  if (!app) return;
  const doc = app.documents.find((d) => d.key === key);
  if (!doc) return;
  doc.status = "uploaded";
  doc.fileName = fileName;
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
}

export function createApplication(userId: string, visaTypeId: string) {
  const type = visaTypeById(visaTypeId);
  if (!type) return null;
  const store = read();
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
    advisorName: "Elif Kaya",
    advisorNoteTr: "Evrak listenizi yükledikçe kontrol edeceğiz. Zorunlu olanlarla başlayın.",
    advisorNoteEn: "We will review as you upload. Start with the required documents.",
    feeTry: type.feeTry,
    paidTry: 0,
    assignedTo: "u-staff",
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
  return app;
}

export function addUser(name: string, email: string, password: string): User {
  const store = read();
  const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;
  const user: User = { id: `u-${Date.now()}`, name, email, role: "client", password };
  store.users.push(user);
  write(store);
  return user;
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

export function setApplicationFee(appId: string, paidTry: number) {
  const store = read();
  const app = store.applications.find((a) => a.id === appId);
  if (!app) return;
  app.paidTry = paidTry;
  write(store);
}
