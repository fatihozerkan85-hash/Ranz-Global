export type Role = "client" | "staff" | "admin";
export type Locale = "tr" | "en";
export type VisaFamily = "europe" | "america";
export type AppStatus = "draft" | "missing" | "review" | "revision" | "complete";
export type DocStatus = "empty" | "uploaded" | "approved" | "rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
};

export type DocumentItem = {
  key: string;
  labelTr: string;
  labelEn: string;
  required: boolean;
  status: DocStatus;
  fileName?: string;
  note?: string;
};

export type TimelineItem = {
  at: string;
  titleTr: string;
  titleEn: string;
  bodyTr: string;
  bodyEn: string;
};

export type Application = {
  id: string;
  userId: string;
  visaFamily: VisaFamily;
  visaTypeId: string;
  destinationTr: string;
  destinationEn: string;
  status: AppStatus;
  createdAt: string;
  advisorName: string;
  advisorNoteTr: string;
  advisorNoteEn: string;
  feeTry: number;
  paidTry: number;
  assignedTo: string;
  documents: DocumentItem[];
  timeline: TimelineItem[];
};

export type AppointmentRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  locale: Locale;
  createdAt: string;
  status: "new" | "done";
};

export type CmsPage = {
  slug: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  bodyTr: string;
  bodyEn: string;
  ogTitle?: string;
  ogDescription?: string;
  status: "published" | "draft";
};

export type BlogPost = {
  slug: string;
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  bodyTr: string;
  bodyEn: string;
  coverAltTr: string;
  coverAltEn: string;
  publishedAt: string;
  status: "published" | "draft" | "scheduled";
};

export type VisaType = {
  id: string;
  family: VisaFamily;
  titleTr: string;
  titleEn: string;
  hintTr: string;
  titleHintEn: string;
  feeTry: number;
  documents: Omit<DocumentItem, "status" | "fileName" | "note">[];
};
