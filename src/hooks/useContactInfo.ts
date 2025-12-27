import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type ContactOfficeHour = { label: string; value: string };

export const LANGUAGE_CODES = ['az', 'ru', 'en', 'ar'] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export interface LocalizedStrings {
  [code: string]: string;
}

export interface ContactOffice {
  id: string;
  label: LocalizedStrings;
  address: LocalizedStrings;
  map_embed_url: string | null;
}

export interface ContactInfo {
  id: string | null;
  company_name: LocalizedStrings;
  tagline: LocalizedStrings;
  description: LocalizedStrings;
  address: LocalizedStrings;
  address_secondary: LocalizedStrings;
  map_embed_url: string | null;
  phones: string[];
  emails: string[];
  whatsapp_numbers: string[];
  office_hours: ContactOfficeHour[];
  social_links: Record<string, string>;
  offices: ContactOffice[];
}

const createLocalizedMap = (value: string): LocalizedStrings => {
  const map: LocalizedStrings = {};
  for (const code of LANGUAGE_CODES) {
    map[code] = value;
  }
  return map;
};

const createEmptyLocalizedMap = (): LocalizedStrings => {
  const map: LocalizedStrings = {};
  for (const code of LANGUAGE_CODES) {
    map[code] = "";
  }
  return map;
};

const cloneOffice = (office: ContactOffice): ContactOffice => ({
  id: office.id,
  label: { ...office.label },
  address: { ...office.address },
  map_embed_url: office.map_embed_url ?? null,
});

const DEFAULT_OFFICES: ContactOffice[] = [
  {
    id: 'default-office',
    label: createLocalizedMap("Baş ofis"),
    address: createLocalizedMap("Bakı, Azərbaycan"),
    map_embed_url: "https://maps.google.com",
  },
];

export const defaultContactInfo: ContactInfo = {
  id: null,
  company_name: createLocalizedMap("CARRENTBAKU"),
  tagline: createEmptyLocalizedMap(),
  description: createEmptyLocalizedMap(),
  address: createLocalizedMap("Bakı, Azərbaycan"),
  address_secondary: createLocalizedMap("Nəsimi rayonu, 28 May küç."),
  map_embed_url: "https://maps.google.com",
  phones: ["+994 (50) 123 45 67", "+994 (51) 234 56 78"],
  emails: ["info@carrentbaku.az", "support@carrentbaku.az"],
  whatsapp_numbers: ["+994501234567"],
  office_hours: [
    { label: "Bazar ertəsi - Şənbə", value: "09:00 - 21:00" },
    { label: "Bazar", value: "10:00 - 18:00" },
  ],
  social_links: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    whatsapp: "https://wa.me/994501234567",
  },
  offices: DEFAULT_OFFICES.map(cloneOffice),
};

const normalizeArray = (value: unknown): string[] => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === "string" ? item.trim() : ""))
      .filter((item, index, arr) => item && arr.indexOf(item) === index);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  return [];
};

const normalizeOfficeHours = (value: unknown): ContactOfficeHour[] => {
  if (!Array.isArray(value)) {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return normalizeOfficeHours(parsed);
        }
      } catch {
        return [];
      }
    } else if (value && typeof value === "object") {
      return normalizeOfficeHours([value]);
    }
    return [];
  }
  const result: ContactOfficeHour[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const label = typeof (entry as any).label === "string" ? (entry as any).label.trim() : "";
    const val = typeof (entry as any).value === "string" ? (entry as any).value.trim() : "";
    if (label && val) {
      result.push({ label, value: val });
    }
  }
  return result;
};

const parseOfficeInput = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && typeof parsed === "object") {
        return [parsed];
      }
    } catch {
      return [];
    }
  }
  if (value && typeof value === "object") {
    return [value];
  }
  return [];
};

const generateOfficeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `office-${Math.random().toString(36).slice(2, 10)}`;
};

const normalizeOfficeEntry = (entry: any, index: number): ContactOffice | null => {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const label = normalizeLocalizedStrings(
    (entry as any).label ?? (entry as any).name ?? (entry as any).title,
    createEmptyLocalizedMap(),
  );

  const address = normalizeLocalizedStrings(
    (entry as any).address,
    createEmptyLocalizedMap(),
  );

  const hasAddress = LANGUAGE_CODES.some(code => {
    const value = address[code];
    return typeof value === "string" && value.trim().length > 0;
  });

  if (!hasAddress) {
    return null;
  }

  const idRaw =
    typeof (entry as any).id === "string" && (entry as any).id.trim().length > 0
      ? (entry as any).id.trim()
      : generateOfficeId();

  const mapField =
    typeof (entry as any).map_embed_url === "string"
      ? (entry as any).map_embed_url
      : typeof (entry as any).mapEmbedUrl === "string"
      ? (entry as any).mapEmbedUrl
      : typeof (entry as any).map === "string"
      ? (entry as any).map
      : null;

  const map_embed_url = mapField && mapField.trim().length > 0 ? mapField.trim() : null;

  return {
    id: idRaw || `office-${index}`,
    label,
    address,
    map_embed_url,
  };
};

const normalizeOffices = (value: unknown): ContactOffice[] => {
  const rawList = parseOfficeInput(value);
  const normalized = rawList
    .map((entry, index) => normalizeOfficeEntry(entry, index))
    .filter((entry): entry is ContactOffice => Boolean(entry))
    .map(cloneOffice);

  if (normalized.length === 0) {
    return DEFAULT_OFFICES.map(cloneOffice);
  }

  return normalized;
};

const normalizeLocalizedStrings = (value: unknown, fallback: LocalizedStrings): LocalizedStrings => {
  let source: any = value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith('{')) {
      try {
        source = JSON.parse(trimmed);
      } catch {
        source = { az: trimmed };
      }
    } else if (trimmed) {
      source = { az: trimmed };
    } else {
      source = {};
    }
  }

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    source = {};
  }

  const result: LocalizedStrings = { ...createEmptyLocalizedMap() };
  for (const code of LANGUAGE_CODES) {
    const raw = (source as any)[code];
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed) {
        result[code] = trimmed;
      }
    }
  }

  const hasValue = LANGUAGE_CODES.some(code => result[code]);
  if (!hasValue) {
    return { ...fallback };
  }

  const fallbackValue = result.az || result.en || result.ru || result.ar || Object.values(result).find(Boolean) || "";
  for (const code of LANGUAGE_CODES) {
    if (!result[code]) {
      if (fallback[code]) {
        result[code] = fallback[code];
      } else if (fallbackValue) {
        result[code] = fallbackValue;
      } else {
        result[code] = "";
      }
    }
  }

  return result;
};

export const resolveLocalizedValue = (values: LocalizedStrings, language: LanguageCode): string => {
  return values[language] || values.az || values.en || values.ru || values.ar || "";
};

export const normalizeContactInfo = (data: any): ContactInfo => {
  if (!data || typeof data !== "object") {
    return { ...defaultContactInfo, id: null };
  }

  const phones = normalizeArray((data as any).phones);
  const emails = normalizeArray((data as any).emails);
  const whatsapp = normalizeArray((data as any).whatsapp_numbers ?? (data as any).whatsappNumbers);
  const officeHours = normalizeOfficeHours((data as any).office_hours ?? (data as any).officeHours);
  const offices = normalizeOffices((data as any).offices);
  const socialLinksRaw = (data as any).social_links ?? (data as any).socialLinks;
  let socialLinks: Record<string, string> = {};
  if (socialLinksRaw && typeof socialLinksRaw === "object") {
    socialLinks = {};
    for (const [key, raw] of Object.entries(socialLinksRaw)) {
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (trimmed) {
          socialLinks[key] = trimmed;
        }
      }
    }
  }

  return {
    id: typeof (data as any).id === "string" ? (data as any).id : null,
    company_name: normalizeLocalizedStrings((data as any).company_name, defaultContactInfo.company_name),
    tagline: normalizeLocalizedStrings((data as any).tagline, defaultContactInfo.tagline),
    description: normalizeLocalizedStrings((data as any).description, defaultContactInfo.description),
    address: normalizeLocalizedStrings((data as any).address, defaultContactInfo.address),
    address_secondary: normalizeLocalizedStrings((data as any).address_secondary ?? (data as any).addressSecondary, defaultContactInfo.address_secondary),
    map_embed_url: typeof (data as any).map_embed_url === "string" ? (data as any).map_embed_url : defaultContactInfo.map_embed_url,
    phones: phones.length ? phones : [...defaultContactInfo.phones],
    emails: emails.length ? emails : [...defaultContactInfo.emails],
    whatsapp_numbers: whatsapp.length ? whatsapp : [...defaultContactInfo.whatsapp_numbers],
    office_hours: officeHours.length ? officeHours : [...defaultContactInfo.office_hours],
    social_links: Object.keys(socialLinks).length ? socialLinks : { ...defaultContactInfo.social_links },
    offices: offices.length ? offices.map(cloneOffice) : DEFAULT_OFFICES.map(cloneOffice),
  };
};

export const CONTACT_INFO_QUERY_KEY = ["contact-info"];

export const useContactInfo = () => {
  return useQuery<ContactInfo>({
    queryKey: CONTACT_INFO_QUERY_KEY,
    queryFn: async () => {
      const response = await api.contactInfo.get();
      return normalizeContactInfo(response);
    },
    placeholderData: () => ({
      ...defaultContactInfo,
      id: null,
      company_name: { ...defaultContactInfo.company_name },
      tagline: { ...defaultContactInfo.tagline },
      description: { ...defaultContactInfo.description },
      address: { ...defaultContactInfo.address },
      address_secondary: { ...defaultContactInfo.address_secondary },
      phones: [...defaultContactInfo.phones],
      emails: [...defaultContactInfo.emails],
      whatsapp_numbers: [...defaultContactInfo.whatsapp_numbers],
      office_hours: defaultContactInfo.office_hours.map(item => ({ ...item })),
      social_links: { ...defaultContactInfo.social_links },
      offices: defaultContactInfo.offices.map(cloneOffice),
    }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
