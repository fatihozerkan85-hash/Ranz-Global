export type Role = "client" | "staff" | "admin";
export type Locale = "tr" | "en" | "ar" | "zh" | "ru" | "de" | "fr" | "es";
export type VisaCountry = "schengen" | "asia" | "africa" | "usa" | "uae" | "china" | "russia" | "uk" | "canada";
export type AppStatus = "draft" | "missing" | "review" | "revision" | "ready" | "complete";
export type DocStatus = "empty" | "uploaded" | "approved" | "rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  phone?: string;
  titleTr?: string;
  titleEn?: string;
};

export type FileAppointment = {
  date: string;
  time: string;
  cityTr: string;
  cityEn: string;
  venueTr: string;
  venueEn: string;
  bringTr: string;
  bringEn: string;
  mapsUrl?: string;
  docUrl?: string;
};

export type DocumentItem = {
  key: string;
  labelTr: string;
  labelEn: string;
  required: boolean;
  status: DocStatus;
  fileName?: string;
  filePathname?: string;
  fileUrl?: string;
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
  visaFamily: VisaCountry;
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
  submittedAt?: string;
  reviewedAt?: string;
  appointment?: FileAppointment;
};

export type AppointmentRequest = {
  id: string;
  name: string;
  phone: string;
  message: string;
  email?: string;
  country?: string;
  origin?: string;
  travelDate?: string;
  topic?: string;
  locale: Locale;
  createdAt: string;
  status: "new" | "done";
};

export type RefusalFile = {
  id: string;
  name: string;
  email: string;
  country: string;
  year: string;
  article: string;
  locale: Locale;
  createdAt: string;
  status: "new" | "assigned";
  assignedTo: string;
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
  imageId?: string;
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
  imageId?: string;
  publishedAt: string;
  status: "published" | "draft" | "scheduled";
};

export type SiteMedia = {
  id: string;
  name: string;
  dataUrl: string;
};

export type HomeCard = {
  id: string;
  titleTr: string;
  titleEn: string;
  hintTr: string;
  hintEn: string;
};

export type HomeStep = {
  id: string;
  n: string;
  titleTr: string;
  titleEn: string;
  bodyTr: string;
  bodyEn: string;
};

export type HomeReview = {
  id: string;
  bodyTr: string;
  bodyEn: string;
  whoTr: string;
  whoEn: string;
};

export type HomeContent = {
  heroTitleTr: string;
  heroTitleEn: string;
  heroLeadTr: string;
  heroLeadEn: string;
  heroImageId?: string;
  ctaPrimaryTr: string;
  ctaPrimaryEn: string;
  ctaSecondaryTr: string;
  ctaSecondaryEn: string;
  destTitleTr: string;
  destTitleEn: string;
  destNoteTr: string;
  destNoteEn: string;
  destCards: HomeCard[];
  stepsTitleTr: string;
  stepsTitleEn: string;
  steps: HomeStep[];
  visaEyebrowTr: string;
  visaEyebrowEn: string;
  visaTitleTr: string;
  visaTitleEn: string;
  visaLeadTr: string;
  visaLeadEn: string;
  visaCards: HomeCard[];
  contactEyebrowTr: string;
  contactEyebrowEn: string;
  contactTitleTr: string;
  contactTitleEn: string;
  contactLeadTr: string;
  contactLeadEn: string;
  trustTitleTr: string;
  trustTitleEn: string;
  trustBodyTr: string;
  trustBodyEn: string;
  reviews: HomeReview[];
  galleryIds: string[];
  email: string;
  phone: string;
  cityTr: string;
  cityEn: string;
  footerNoteTr: string;
  footerNoteEn: string;
  updatedAt?: string;
};

export type VisaType = {
  id: VisaCountry;
  family: VisaCountry;
  titleTr: string;
  titleEn: string;
  hintTr: string;
  titleHintEn: string;
  feeTry: number;
  documents: Omit<DocumentItem, "status" | "fileName" | "filePathname" | "fileUrl" | "note">[];
};
