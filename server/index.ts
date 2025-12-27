import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { prisma } from '../src/lib/prisma';
import nodemailer from 'nodemailer';
import type { Prisma } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const EMAIL_HOST = process.env.EMAIL_HOST || 'heracles.mxrouting.net';
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 465);
const EMAIL_USER = process.env.EMAIL_USER || 'noreply@midiya.az';
const EMAIL_PASS = process.env.EMAIL_PASS || 'qwe3Q!W@E';
const EMAIL_TO = process.env.EMAIL_TO || 'office@carrentbaku.az';
const EMAIL_SECURE = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : EMAIL_PORT === 465;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:5174',
  'https://baku-drive-planner.vercel.app',
  'https://new.carrentbaku.az',
  'http://new.carrentbaku.az',
  'https://carrentbaku.az',
  'http://carrentbaku.az',
];


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_ROOT = path.resolve(__dirname, '../../public_html');
const UPLOAD_ROOT = path.join(PUBLIC_ROOT, 'uploads');
const fsPromises = fs.promises;

const ensureDirSync = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getQueryParam = (value: unknown): string | null => {
  if (!value) {
    return null;
  }
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : null;
  }
  return typeof value === 'string' ? value : null;
};

const sanitizePathSegment = (segment: string) => segment.replace(/[^a-zA-Z0-9_-]/g, '');

const sanitizeRelativePath = (value: string | null) => {
  if (!value) {
    return '';
  }
  const parts = value
    .split('/')
    .map(part => sanitizePathSegment(part))
    .filter(part => part.length > 0);
  return parts.join('/');
};

const getSafeExtension = (filename: string) => {
  const ext = (path.extname(filename || '') || '').toLowerCase();
  const allowed = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);
  if (allowed.has(ext)) {
    return ext;
  }
  return '.jpg';
};

const buildSafeFileName = (requestedName: string | null, originalName: string) => {
  const original = path.parse(originalName);
  const requestParsed = requestedName ? path.parse(requestedName) : null;
  const base = sanitizePathSegment(requestParsed?.name ?? original.name ?? 'upload') || 'upload';
  const extSource = requestParsed?.ext && requestParsed.ext.length > 0 ? requestParsed.ext : original.ext;
  const ext = getSafeExtension(extSource || originalName);
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${base}-${uniqueSuffix}${ext}`;
};

const resolveUploadDirectory = (relative: string | null) => {
  const safeRelative = sanitizeRelativePath(relative);
  if (!safeRelative) {
    return UPLOAD_ROOT;
  }
  const targetDir = path.join(UPLOAD_ROOT, safeRelative);
  if (!targetDir.startsWith(UPLOAD_ROOT)) {
    return UPLOAD_ROOT;
  }
  ensureDirSync(targetDir);
  return targetDir;
};

ensureDirSync(UPLOAD_ROOT);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);
app.use(express.json());

// Serve static files from public_html
app.use(express.static(PUBLIC_ROOT));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderParam = getQueryParam(req.query.folder);
    const directory = resolveUploadDirectory(folderParam);
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const requestedFilename = getQueryParam(req.query.filename);
    const safeName = buildSafeFileName(requestedFilename, file.originalname);
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});


const mailRecipients = EMAIL_TO
  .split(',')
  .map(value => value.trim())
  .filter(value => value.length > 0);

const mailTransporter =
  EMAIL_USER && EMAIL_PASS && mailRecipients.length > 0
    ? nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_SECURE,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      })
    : null;

const formatDateForEmail = (value: Date | string | null | undefined) => {
  if (!value) {
    return 'N/A';
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }
  return date.toLocaleString('en-GB', { timeZone: 'Asia/Baku' });
};

const sendReservationNotification = async (reservation: any) => {
  if (!mailTransporter || mailRecipients.length === 0) {
    return;
  }

  const carName = reservation?.car
    ? `${reservation.car?.brand ?? ''} ${reservation.car?.model ?? ''}`.trim() || 'Naməlum avtomobil'
    : 'Naməlum avtomobil';

  const pickUpDate = formatDateForEmail(reservation?.pickup_date);
  const returnDate = formatDateForEmail(reservation?.return_date);
  const pickupLocation = reservation?.pickup_location ?? 'Gösterilməyib';
  const dropoffLocation = reservation?.dropoff_location ?? 'Gösterilməyib';

  const textLines = [
    'Yeni rezervasiya sorğusu daxil oldu:',
    '',
    `Müştəri: ${reservation?.customer_name ?? 'Naməlum'}`,
    `Telefon: ${reservation?.customer_phone ?? 'Yoxdur'}`,
    `Email: ${reservation?.customer_email ?? 'Yoxdur'}`,
    '',
    `Avtomobil: ${carName}`,
    `Götürmə tarixi: ${pickUpDate}`,
    `Qaytarma tarixi: ${returnDate}`,
    `Götürmə yeri: ${pickupLocation}`,
    `Qaytarma yeri: ${dropoffLocation}`,
    '',
    `Uşaq oturacağı: ${reservation?.child_seat ? 'Bəli' : 'Xeyr'}`,
    `Video qeydiyyat cihazı: ${reservation?.video_recorder ? 'Bəli' : 'Xeyr'}`,
    '',
    'Bu, sistem tərəfindən avtomatik göndərilmiş məktubdur.',
  ];

  const htmlBody = `
    <h2>Yeni rezervasiya sorğusu</h2>
    <p><strong>Müştəri:</strong> ${reservation?.customer_name ?? 'Naməlum'}</p>
    <p><strong>Telefon:</strong> ${reservation?.customer_phone ?? 'Yoxdur'}</p>
    <p><strong>Email:</strong> ${reservation?.customer_email ?? 'Yoxdur'}</p>
    <p><strong>Avtomobil:</strong> ${carName}</p>
    <p><strong>Götürmə tarixi:</strong> ${pickUpDate}</p>
    <p><strong>Qaytarma tarixi:</strong> ${returnDate}</p>
    <p><strong>Götürmə yeri:</strong> ${pickupLocation}</p>
    <p><strong>Qaytarma yeri:</strong> ${dropoffLocation}</p>
    <p><strong>Uşaq oturacağı:</strong> ${reservation?.child_seat ? 'Bəli' : 'Xeyr'}</p>
    <p><strong>Video qeydiyyat cihazı:</strong> ${reservation?.video_recorder ? 'Bəli' : 'Xeyr'}</p>
    <p>Bu, sistem tərəfindən avtomatik göndərilmiş məktubdur.</p>
  `;

  try {
    await mailTransporter.sendMail({
      from: `CarrentBaku.az <${EMAIL_USER}>`,
      to: mailRecipients,
      replyTo: reservation?.customer_email ?? undefined,
      subject: `Yeni rezervasiya - ${carName}`,
      text: textLines.join('\n'),
      html: htmlBody,
    });
  } catch (error) {
    console.error('Failed to send reservation email:', error);
  }
};


const sendContactNotification = async (contactMessage: any) => {
  if (!mailTransporter || mailRecipients.length === 0) {
    return;
  }

  const fullName = `${contactMessage?.first_name ?? ''} ${contactMessage?.last_name ?? ''}`.trim() || 'Naməlum şəxs';
  const submittedAt = formatDateForEmail(contactMessage?.created_at);

  const textLines = [
    'Yeni əlaqə formu mesajı daxil oldu:',
    '',
    `Ad: ${fullName}`,
    `Email: ${contactMessage?.email ?? 'Yoxdur'}`,
    `Telefon: ${contactMessage?.phone ?? 'Yoxdur'}`,
    `Mövzu: ${contactMessage?.subject ?? 'Gösterilməyib'}`,
    `Göndərilmə tarixi: ${submittedAt}`,
    '',
    'Mesaj:',
    contactMessage?.message ?? '(boş)',
    '',
    'Bu, sistem tərəfindən avtomatik göndərilmiş məktubdur.',
  ];

  const htmlBody = `
    <h2>Yeni əlaqə formu mesajı</h2>
    <p><strong>Ad:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${contactMessage?.email ?? 'Yoxdur'}</p>
    <p><strong>Telefon:</strong> ${contactMessage?.phone ?? 'Yoxdur'}</p>
    <p><strong>Mövzu:</strong> ${contactMessage?.subject ?? 'Gösterilməyib'}</p>
    <p><strong>Göndərilmə tarixi:</strong> ${submittedAt}</p>
    <h3>Mesaj məzmunu</h3>
    <p>${(contactMessage?.message ?? '(boş)').replace(/\n/g, '<br />')}</p>
    <p>Bu, sistem tərəfindən avtomatik göndərilmiş məktubdur.</p>
  `;

  try {
    await mailTransporter.sendMail({
      from: `CarrentBaku.az <${EMAIL_USER}>`,
      to: mailRecipients,
      replyTo: contactMessage?.email ?? undefined,
      subject: `Yeni əlaqə mesajı - ${fullName}`,
      text: textLines.join('\n'),
      html: htmlBody,
    });
  } catch (error) {
    console.error('Failed to send contact message email:', error);
  }
};

const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { roles: true },
    });

    if (!user || !user.roles.some(role => role.role === 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    (req as any).user = { id: user.id, email: user.email };
    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const normalizeCategories = (car: { categories?: string[] | null; category?: string | null }) => {
  const normalized: string[] = [];
  if (Array.isArray(car.categories)) {
    car.categories.forEach(item => {
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed && !normalized.includes(trimmed)) {
          normalized.push(trimmed);
        }
      }
    });
  }
  if (typeof car.category === 'string') {
    const trimmed = car.category.trim();
    if (trimmed && !normalized.includes(trimmed)) {
      normalized.push(trimmed);
    }
  }
  return normalized;
};

const parseImageUrls = (imageField: unknown): string[] => {
  if (!imageField) {
    return [];
  }
  if (Array.isArray(imageField)) {
    return imageField
      .map(entry => {
        if (typeof entry === 'string') {
          try {
            const parsed = JSON.parse(entry);
            return parsed?.url ?? entry;
          } catch {
            return entry;
          }
        }
        if (entry && typeof entry === 'object' && 'url' in (entry as any) && typeof (entry as any).url === 'string') {
          return (entry as any).url;
        }
        return '';
      })
      .filter((url): url is string => typeof url === 'string' && url.length > 0);
  }
  if (typeof imageField === 'string') {
    try {
      const parsed = JSON.parse(imageField);
      if (Array.isArray(parsed)) {
        return parsed
          .map(item => {
            if (typeof item === 'string') {
              return item;
            }
            if (item && typeof item === 'object' && 'url' in (item as any) && typeof (item as any).url === 'string') {
              return (item as any).url;
            }
            return '';
          })
          .filter(url => url.length > 0);
      }
      if (parsed && typeof parsed === 'object' && 'url' in (parsed as any) && typeof (parsed as any).url === 'string') {
        return [(parsed as any).url];
      }
    } catch {
      return imageField ? [imageField] : [];
    }
    return imageField ? [imageField] : [];
  }
  if (imageField && typeof imageField === 'object' && 'url' in (imageField as any) && typeof (imageField as any).url === 'string') {
    return [(imageField as any).url];
  }
  return [];
};

const buildCarResponse = (car: any) => {
  const categories = normalizeCategories(car);
  const unavailableDates = sanitizeBusyDates((car as any)?.unavailable_dates);
  return {
    ...car,
    categories,
    category: categories[0] ?? car.category ?? '',
    image_url: parseImageUrls(car.image_url),
    unavailable_dates: unavailableDates,
  };
};

const sanitizeCategoriesInput = (input: unknown) => {
  if (!Array.isArray(input)) {
    return [];
  }
  const normalized: string[] = [];
  for (const value of input) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed && !normalized.includes(trimmed)) {
        normalized.push(trimmed);
      }
    }
  }
  return normalized;
};

const sanitizeBusyDates = (input: unknown): string[] => {
  if (!Array.isArray(input)) {
    return [];
  }
  const normalized = new Set<string>();
  for (const value of input) {
    if (typeof value !== 'string') {
      continue;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }
    const date = new Date(trimmed);
    if (Number.isNaN(date.getTime())) {
      continue;
    }
    normalized.add(date.toISOString().slice(0, 10));
  }
  return Array.from(normalized).sort();
};

const parseDateParam = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }
  const date = new Date(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return trimmed;
};

const buildDateRange = (start: string, end: string): string[] => {
  let current = new Date(`${start}T00:00:00Z`);
  let target = new Date(`${end}T00:00:00Z`);
  if (target < current) {
    const temp = current;
    current = target;
    target = temp;
  }
  const range: string[] = [];
  while (current <= target) {
    range.push(current.toISOString().slice(0, 10));
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }
  return range;
};

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'on'].includes(normalized);
  }
  return Boolean(value);
};

const optionalString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const LANGUAGE_CODES = ['az', 'ru', 'en', 'ar'];
const DEFAULT_LANGUAGE = 'az';

const BLOG_CATEGORIES = new Set(['news', 'blogs']);

const sanitizeBlogCategory = (value: unknown): string => {
  if (typeof value !== 'string') {
    return 'blogs';
  }
  const trimmed = value.trim().toLowerCase();
  if (BLOG_CATEGORIES.has(trimmed)) {
    return trimmed;
  }
  return 'blogs';
};


type LocalizedMap = Record<string, string>;

interface ContactOfficeRecord {
  id: string;
  label: LocalizedMap;
  address: LocalizedMap;
  map_embed_url: string | null;
}

const sanitizeStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') {
      continue;
    }
    const trimmed = item.trim();
    if (trimmed && !result.includes(trimmed)) {
      result.push(trimmed);
    }
  }
  return result;
};

const sanitizeOfficeHours = (input: unknown): Array<{ label: string; value: string }> => {
  if (!Array.isArray(input)) {
    return [];
  }
  const result: Array<{ label: string; value: string }> = [];
  for (const entry of input) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const label = optionalString((entry as any).label);
    const valueStr = optionalString((entry as any).value);
    if (label && valueStr) {
      result.push({ label, value: valueStr });
    }
  }
  return result;
};

const sanitizeSocialLinks = (input: unknown): Record<string, string> => {
  const result: Record<string, string> = {};
  if (!input || typeof input !== 'object') {
    return result;
  }
  for (const [key, rawValue] of Object.entries(input as Record<string, unknown>)) {
    if (typeof key !== 'string') {
      continue;
    }
    const valueStr = optionalString(rawValue);
    if (valueStr) {
      result[key] = valueStr;
    }
  }
  return result;
};

const sanitizeLocalizedInput = (input: unknown, fallback: LocalizedMap): LocalizedMap => {
  let source: any = input;
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed.startsWith('{')) {
      try {
        source = JSON.parse(trimmed);
      } catch {
        source = { [DEFAULT_LANGUAGE]: trimmed };
      }
    } else if (trimmed) {
      source = { [DEFAULT_LANGUAGE]: trimmed };
    } else {
      source = {};
    }
  }

  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    source = {};
  }

  const result: LocalizedMap = {};
  for (const code of LANGUAGE_CODES) {
    const value = optionalString((source as any)[code]);
    if (value) {
      result[code] = value;
    }
  }

  if (Object.keys(result).length === 0) {
    return { ...fallback };
  }

  const fallbackValue = result[DEFAULT_LANGUAGE] ?? Object.values(result)[0] ?? '';
  for (const code of LANGUAGE_CODES) {
    if (!result[code]) {
      if (fallback[code]) {
        result[code] = fallback[code];
      } else if (fallbackValue) {
        result[code] = fallbackValue;
      } else {
        result[code] = '';
      }
    }
  }

  return result;
};

const createLocalizedMap = (value: string): LocalizedMap => {
  const map: LocalizedMap = {};
  for (const code of LANGUAGE_CODES) {
    map[code] = value;
  }
  return map;
};

const createEmptyLocalizedMap = (): LocalizedMap => {
  const map: LocalizedMap = {};
  for (const code of LANGUAGE_CODES) {
    map[code] = '';
  }
  return map;
};

const cloneOffice = (office: ContactOfficeRecord): ContactOfficeRecord => ({
  id: office.id,
  label: { ...office.label },
  address: { ...office.address },
  map_embed_url: office.map_embed_url ?? null,
});

const defaultOffices: ContactOfficeRecord[] = [
  {
    id: 'default-office',
    label: createLocalizedMap('Baş ofis'),
    address: createLocalizedMap('Bakı, Azərbaycan'),
    map_embed_url: 'https://maps.google.com',
  },
];

const parseOfficeInput = (input: unknown): unknown[] => {
  if (Array.isArray(input)) {
    return input;
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && typeof parsed === 'object') {
        return [parsed];
      }
    } catch {
      return [];
    }
  }
  if (input && typeof input === 'object') {
    return [input];
  }
  return [];
};

const sanitizeOfficeEntry = (
  input: any,
  fallback?: ContactOfficeRecord,
): ContactOfficeRecord | null => {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const idSource =
    typeof input.id === 'string' && input.id.trim().length > 0
      ? input.id.trim()
      : fallback?.id ?? randomUUID();

  const label = sanitizeLocalizedInput(
    (input as any).label ?? (input as any).name ?? (input as any).title,
    fallback?.label ?? createEmptyLocalizedMap(),
  );

  const address = sanitizeLocalizedInput(
    (input as any).address,
    fallback?.address ?? createEmptyLocalizedMap(),
  );

  const mapEmbedUrl =
    optionalString((input as any).map_embed_url ?? (input as any).mapEmbedUrl ?? (input as any).map) ??
    fallback?.map_embed_url ??
    null;

  const hasAddress = Object.values(address).some(value => typeof value === 'string' && value.trim().length > 0);
  if (!hasAddress) {
    return null;
  }

  return {
    id: idSource,
    label,
    address,
    map_embed_url: mapEmbedUrl,
  };
};

const sanitizeOfficesForSaving = (input: unknown): ContactOfficeRecord[] => {
  const rawList = parseOfficeInput(input);
  return rawList
    .map(entry => sanitizeOfficeEntry(entry ?? {}))
    .filter((entry): entry is ContactOfficeRecord => Boolean(entry))
    .map(cloneOffice);
};

const deserializeStringList = (value: unknown): string[] => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return sanitizeStringList(value);
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return sanitizeStringList(parsed);
      }
      if (typeof parsed === 'string') {
        return sanitizeStringList([parsed]);
      }
    } catch {
      return sanitizeStringList([value]);
    }
  }
  return [];
};

const deserializeOfficeHours = (value: unknown): Array<{ label: string; value: string }> => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return sanitizeOfficeHours(value);
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return sanitizeOfficeHours(Array.isArray(parsed) ? parsed : []);
    } catch {
      return [];
    }
  }
  if (typeof value === 'object') {
    return sanitizeOfficeHours([value]);
  }
  return [];
};

const deserializeSocialLinks = (value: unknown): Record<string, string> => {
  if (!value) {
    return {};
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return sanitizeSocialLinks(parsed);
    } catch {
      return {};
    }
  }
  return sanitizeSocialLinks(value);
};

const deserializeOffices = (value: unknown): ContactOfficeRecord[] => {
  const sanitized = sanitizeOfficesForSaving(value);
  if (sanitized.length === 0) {
    return defaultOffices.map(cloneOffice);
  }
  return sanitized;
};

const defaultContactInfo = {
  company_name: createLocalizedMap('CARRENTBAKU'),
  tagline: createEmptyLocalizedMap(),
  description: createEmptyLocalizedMap(),
  address: createLocalizedMap('Bakı, Azərbaycan'),
  address_secondary: createLocalizedMap('Nəsimi rayonu, 28 May küç.'),
  map_embed_url: 'https://maps.google.com',
  phones: ['+994 (50) 123 45 67', '+994 (51) 234 56 78'],
  emails: ['info@carrentbaku.az', 'support@carrentbaku.az'],
  whatsapp_numbers: ['+994501234567'],
  office_hours: [
    { label: 'Bazar ertəsi - Şənbə', value: '09:00 - 21:00' },
    { label: 'Bazar', value: '10:00 - 18:00' },
  ],
  social_links: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    whatsapp: 'https://wa.me/994501234567',
  },
  offices: defaultOffices.map(cloneOffice),
};

const defaultAgentConfig = {
  agent_name: 'midiya-ai-chat',
  api_token: '',
  instructions: '',
  company_name: 'CARRENTBAKU',
  site_url: 'https://new.carrentbaku.az',
  agent_endpoint: 'https://xwwxqujbyxojtvb5qzrflqgu.agents.do-ai.run',
  project_id: '11f0c06e-45d7-a6fc-b074-4e013e2ddde4',
  database_id: '0bbb8d8a-f88e-4686-87b4-c1050783ae86',
  knowledge_base_id: '14cffe65-c07a-11f0-b074-4e013e2ddde4',
  embedding_model_id: '18bc9b8f-73c5-11f0-b074-4e013e2ddde4',
};

const buildAgentFinalPrompt = (instructions: string, companyName: string, siteUrl: string) => {
  const sections: string[] = [];
  const trimmedInstructions = optionalString(instructions) ?? '';
  if (trimmedInstructions) {
    sections.push(trimmedInstructions);
  }
  const trimmedCompany = optionalString(companyName) ?? '';
  if (trimmedCompany) {
    sections.push(`Şirkət adı: ${trimmedCompany}`);
  }
  const trimmedSite = optionalString(siteUrl) ?? '';
  if (trimmedSite) {
    sections.push(`Sayt URL: ${trimmedSite}`);
  }
  return sections.join('\n\n').trim();
};

const buildAgentConfigResponse = (record: any | null) => {
  const agentName = optionalString(record?.agent_name) ?? defaultAgentConfig.agent_name;
  const apiToken = optionalString(record?.api_token) ?? defaultAgentConfig.api_token;
  const instructions = optionalString(record?.instructions) ?? defaultAgentConfig.instructions;
  const companyName = optionalString(record?.company_name) ?? defaultAgentConfig.company_name;
  const siteUrl = optionalString(record?.site_url) ?? defaultAgentConfig.site_url;
  const agentEndpoint = optionalString(record?.agent_endpoint) ?? defaultAgentConfig.agent_endpoint;
  const projectId = optionalString(record?.project_id) ?? defaultAgentConfig.project_id;
  const databaseId = optionalString(record?.database_id) ?? defaultAgentConfig.database_id;
  const knowledgeBaseId = optionalString(record?.knowledge_base_id) ?? defaultAgentConfig.knowledge_base_id;
  const embeddingModelId = optionalString(record?.embedding_model_id) ?? defaultAgentConfig.embedding_model_id;

  return {
    id: record?.id ?? null,
    agent_name: agentName,
    api_token: apiToken,
    instructions,
    company_name: companyName,
    site_url: siteUrl,
    agent_endpoint: agentEndpoint,
    project_id: projectId,
    database_id: databaseId,
    knowledge_base_id: knowledgeBaseId,
    embedding_model_id: embeddingModelId,
    final_prompt: buildAgentFinalPrompt(instructions, companyName, siteUrl),
    updated_at: record?.updated_at ?? record?.created_at ?? null,
  };
};

const sanitizeAgentConfigInput = (input: any) => {
  const agentName = optionalString(input?.agent_name ?? input?.agentName);
  const apiToken = optionalString(input?.api_token ?? input?.apiToken);
  const instructions = optionalString(input?.instructions);
  const companyName = optionalString(input?.company_name ?? input?.companyName);
  const siteUrl = optionalString(input?.site_url ?? input?.siteUrl);
  const agentEndpoint = optionalString(input?.agent_endpoint ?? input?.agentEndpoint);
  const projectId = optionalString(input?.project_id ?? input?.projectId);
  const databaseId = optionalString(input?.database_id ?? input?.databaseId);
  const knowledgeBaseId = optionalString(input?.knowledge_base_id ?? input?.knowledgeBaseId);
  const embeddingModelId = optionalString(input?.embedding_model_id ?? input?.embeddingModelId);

  if (!agentName) {
    throw new Error('AGENT_NAME_REQUIRED');
  }
  if (!apiToken) {
    throw new Error('AGENT_TOKEN_REQUIRED');
  }
  if (!instructions) {
    throw new Error('AGENT_INSTRUCTIONS_REQUIRED');
  }
  if (!companyName) {
    throw new Error('AGENT_COMPANY_REQUIRED');
  }
  if (!siteUrl) {
    throw new Error('AGENT_SITE_REQUIRED');
  }

  return {
    agent_name: agentName,
    api_token: apiToken,
    instructions,
    company_name: companyName,
    site_url: siteUrl,
    agent_endpoint: agentEndpoint ?? defaultAgentConfig.agent_endpoint,
    project_id: projectId ?? defaultAgentConfig.project_id,
    database_id: databaseId ?? defaultAgentConfig.database_id,
    knowledge_base_id: knowledgeBaseId ?? defaultAgentConfig.knowledge_base_id,
    embedding_model_id: embeddingModelId ?? defaultAgentConfig.embedding_model_id,
  };
};


const buildContactInfoResponse = (record: any | null) => {
  const companyName = sanitizeLocalizedInput(record?.company_name, defaultContactInfo.company_name);
  const tagline = sanitizeLocalizedInput(record?.tagline, defaultContactInfo.tagline);
  const description = sanitizeLocalizedInput(record?.description, defaultContactInfo.description);
  const address = sanitizeLocalizedInput(record?.address, defaultContactInfo.address);
  const addressSecondary = sanitizeLocalizedInput(record?.address_secondary, defaultContactInfo.address_secondary);
  const mapEmbedUrl = optionalString(record?.map_embed_url) ?? defaultContactInfo.map_embed_url;
  const phones = deserializeStringList(record?.phones);
  const emails = deserializeStringList(record?.emails);
  const whatsappNumbers = deserializeStringList(record?.whatsapp_numbers);
  const officeHours = deserializeOfficeHours(record?.office_hours);
  const socialLinks = Object.keys(record ?? {}).length
    ? deserializeSocialLinks(record?.social_links)
    : { ...defaultContactInfo.social_links };
  const offices = deserializeOffices(record?.offices);

  return {
    id: record?.id ?? null,
    company_name: companyName,
    tagline,
    description,
    address,
    address_secondary: addressSecondary,
    map_embed_url: mapEmbedUrl,
    phones: phones.length ? phones : [...defaultContactInfo.phones],
    emails: emails.length ? emails : [...defaultContactInfo.emails],
    whatsapp_numbers: whatsappNumbers.length ? whatsappNumbers : [...defaultContactInfo.whatsapp_numbers],
    office_hours: officeHours.length ? officeHours : [...defaultContactInfo.office_hours],
    social_links: Object.keys(socialLinks).length ? socialLinks : { ...defaultContactInfo.social_links },
    offices: offices.length ? offices.map(cloneOffice) : defaultContactInfo.offices.map(cloneOffice),
  };
};


const toCategoryNameMap = (record: any): LocalizedMap => ({
  az: optionalString(record?.name_az) ?? '',
  ru: optionalString(record?.name_ru) ?? '',
  en: optionalString(record?.name_en) ?? '',
  ar: optionalString(record?.name_ar) ?? '',
});

const ensureCategoryNameMap = (map: LocalizedMap): LocalizedMap => {
  const cleaned: LocalizedMap = {};
  for (const code of LANGUAGE_CODES) {
    const value = optionalString(map[code]);
    if (value) {
      cleaned[code] = value;
    }
  }
  const fallback = cleaned.az ?? cleaned.en ?? cleaned.ru ?? cleaned.ar ?? '';
  if (!fallback) {
    throw new Error('CATEGORY_NAME_REQUIRED');
  }
  if (!cleaned.az) {
    cleaned.az = fallback;
  }
  return cleaned;
};

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const buildCategoryResponse = (category: any, counts: Record<string, number> = {}) => ({
  id: category.id,
  slug: category.slug,
  name: toCategoryNameMap(category),
  sort_order: category.sort_order ?? 0,
  is_active: Boolean(category.is_active),
  car_count: counts[category.slug] ?? 0,
  created_at: category.created_at,
  updated_at: category.updated_at,
});

const sanitizeCategoryPayload = (input: any, existing?: any) => {
  const existingMap = existing ? toCategoryNameMap(existing) : createEmptyLocalizedMap();
  const rawName = input?.name ?? {
    az: input?.name_az ?? input?.nameAz,
    ru: input?.name_ru ?? input?.nameRu,
    en: input?.name_en ?? input?.nameEn,
    ar: input?.name_ar ?? input?.nameAr,
  };
  const localized = sanitizeLocalizedInput(rawName, existingMap);
  const nameMap = ensureCategoryNameMap(localized);

  const slugSource =
    optionalString(input?.slug) ??
    optionalString(input?.slug_name) ??
    optionalString(input?.slugName) ??
    nameMap.az ??
    nameMap.en ??
    nameMap.ru ??
    nameMap.ar ??
    '';

  const slug = slugify(slugSource);
  if (!slug) {
    throw new Error('CATEGORY_SLUG_REQUIRED');
  }

  let sortOrder = existing?.sort_order ?? 0;
  if (typeof input?.sort_order === 'number' && Number.isFinite(input.sort_order)) {
    sortOrder = Math.round(input.sort_order);
  } else if (typeof input?.sortOrder === 'number' && Number.isFinite(input.sortOrder)) {
    sortOrder = Math.round(input.sortOrder);
  }

  const isActive =
    typeof input?.is_active === 'boolean'
      ? input.is_active
      : typeof input?.isActive === 'boolean'
      ? input.isActive
      : existing?.is_active ?? true;

  return {
    slug,
    nameMap,
    sort_order: sortOrder,
    is_active: Boolean(isActive),
  };
};

const mapCategoryDataForSave = (payload: {
  slug: string;
  nameMap: LocalizedMap;
  sort_order: number;
  is_active: boolean;
}) => ({
  slug: payload.slug,
  name_az: payload.nameMap.az ?? null,
  name_ru: payload.nameMap.ru ?? null,
  name_en: payload.nameMap.en ?? null,
  name_ar: payload.nameMap.ar ?? null,
  sort_order: payload.sort_order,
  is_active: payload.is_active,
});

const computeCategoryCounts = async (slugs?: string[]): Promise<Record<string, number>> => {
  const where =
    slugs && slugs.length > 0
      ? {
          OR: [{ category: { in: slugs } }, { categories: { hasSome: slugs } }],
        }
      : undefined;

  const cars = await prisma.car.findMany({
    where,
    select: { category: true, categories: true },
  });

  const counts: Record<string, number> = {};
  for (const car of cars) {
    const raw: string[] = [];
    if (Array.isArray(car.categories)) {
      raw.push(...car.categories);
    }
    if (typeof car.category === 'string') {
      raw.push(car.category);
    }
    const normalized = sanitizeCategoriesInput(raw).filter(value => value !== 'uncategorized');
    normalized.forEach(value => {
      counts[value] = (counts[value] ?? 0) + 1;
    });
  }

  if (slugs && slugs.length > 0) {
    slugs.forEach(slug => {
      if (!counts[slug]) {
        counts[slug] = 0;
      }
    });
  }

  return counts;
};

const replaceCategorySlugInCars = async (oldSlug: string, newSlug: string) => {
  if (!oldSlug || !newSlug || oldSlug === newSlug) {
    return;
  }

  const cars = await prisma.car.findMany({
    where: {
      OR: [
        { category: oldSlug },
        {
          categories: {
            has: oldSlug,
          },
        },
      ],
    },
    select: {
      id: true,
      category: true,
      categories: true,
    },
  });

  for (const car of cars) {
    const raw: string[] = [];
    if (Array.isArray(car.categories)) {
      raw.push(...car.categories);
    }
    if (typeof car.category === 'string') {
      raw.push(car.category);
    }

    const replaced = sanitizeCategoriesInput(raw.map(value => (value === oldSlug ? newSlug : value))).filter(
      value => value !== 'uncategorized',
    );

    let primaryCategory = typeof car.category === 'string' ? car.category : undefined;
    if (primaryCategory === oldSlug) {
      primaryCategory = newSlug;
    }
    if (!primaryCategory || primaryCategory === 'uncategorized') {
      primaryCategory = replaced[0] ?? 'uncategorized';
    }

    const remaining = replaced.filter(value => value !== primaryCategory);
    const finalCategories =
      primaryCategory && primaryCategory !== 'uncategorized'
        ? [primaryCategory, ...remaining]
        : remaining;

    await prisma.car.update({
      where: { id: car.id },
      data: {
        category: primaryCategory,
        categories: finalCategories,
      },
    });
  }
};

const removeCategorySlugFromCars = async (slug: string) => {
  if (!slug) {
    return;
  }

  const cars = await prisma.car.findMany({
    where: {
      OR: [
        { category: slug },
        {
          categories: {
            has: slug,
          },
        },
      ],
    },
    select: {
      id: true,
      category: true,
      categories: true,
    },
  });

  for (const car of cars) {
    const raw: string[] = [];
    if (Array.isArray(car.categories)) {
      raw.push(...car.categories);
    }
    if (typeof car.category === 'string') {
      raw.push(car.category);
    }

    const filtered = sanitizeCategoriesInput(raw.filter(value => value !== slug)).filter(
      value => value !== 'uncategorized',
    );

    let primaryCategory = typeof car.category === 'string' ? car.category : undefined;
    if (primaryCategory === slug || !primaryCategory || primaryCategory === 'uncategorized') {
      primaryCategory = filtered[0] ?? 'uncategorized';
    }

    const remaining = filtered.filter(value => value !== primaryCategory);
    const finalCategories =
      primaryCategory && primaryCategory !== 'uncategorized'
        ? [primaryCategory, ...remaining]
        : remaining;

    await prisma.car.update({
      where: { id: car.id },
      data: {
        category: primaryCategory,
        categories: finalCategories,
      },
    });
  }
};


const normalizeVideoUrl = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    let videoId = '';

    if (host.includes('youtube.com')) {
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments[0] === 'shorts' && segments[1]) {
        videoId = segments[1];
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/').pop() ?? '';
      } else if (url.searchParams.has('v')) {
        videoId = url.searchParams.get('v') ?? '';
      }
    } else if (host.includes('youtu.be')) {
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments[0] === 'shorts' && segments[1]) {
        videoId = segments[1];
      } else {
        videoId = segments[0] ?? '';
      }
    }

    videoId = videoId.split('?')[0].split('&')[0];

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return trimmed;
  } catch {
    if (trimmed.startsWith('http')) {
      return trimmed;
    }
    return null;
  }
};

const requiredString = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

const sanitizeReviewInput = (input: any) => {
  const ratingValue = Number.parseInt(input?.rating, 10);
  const rating = Number.isFinite(ratingValue) ? Math.min(5, Math.max(1, ratingValue)) : 5;
  const requestedType = typeof input?.review_type === 'string' && input.review_type.trim().toLowerCase() === 'video' ? 'video' : 'text';
  const normalizedVideoUrl = normalizeVideoUrl(input?.video_url);
  const reviewType = requestedType === 'video' && normalizedVideoUrl ? 'video' : 'text';

  const contentAzRaw = requiredString(input?.content_az);
  const contentAz = contentAzRaw || 'Müştəri rəyi';
  const providedTitleAz = requiredString(input?.title_az);
  const baseTitle = (providedTitleAz || contentAz).slice(0, 80) || 'Müştəri rəyi';

  const fallbackLocalizedTitle = (value: unknown) => {
    const localized = optionalString(value);
    if (localized) {
      return localized;
    }
    return baseTitle;
  };

  return {
    customer_name: requiredString(input?.customer_name),
    customer_location: optionalString(input?.customer_location),
    rating,
    title_az: baseTitle,
    title_ru: fallbackLocalizedTitle(input?.title_ru).slice(0, 80),
    title_en: fallbackLocalizedTitle(input?.title_en).slice(0, 80),
    title_ar: fallbackLocalizedTitle(input?.title_ar).slice(0, 80),
    content_az: contentAz,
    content_ru: optionalString(input?.content_ru),
    content_en: optionalString(input?.content_en),
    content_ar: optionalString(input?.content_ar),
    video_url: reviewType === 'video' ? normalizedVideoUrl : null,
    review_type: reviewType,
    verified: toBoolean(input?.verified),
    featured: toBoolean(input?.featured),
  };
};

const buildServiceResponse = (service: any) => {
  if (!service) {
    return null;
  }

  const { cars: serviceCars = [], ...rest } = service;

  let imageUrls: string[] = [];
  if (rest.image_url) {
    try {
      const parsed = typeof rest.image_url === 'string' ? JSON.parse(rest.image_url) : rest.image_url;
      imageUrls = Array.isArray(parsed) ? parsed : [rest.image_url].flat();
    } catch {
      imageUrls = Array.isArray(rest.image_url) ? rest.image_url : [rest.image_url];
    }
  }

  let features: { az?: string[]; ru?: string[]; en?: string[]; ar?: string[] } = {};
  if (rest.features) {
    try {
      const parsed = typeof rest.features === 'string' ? JSON.parse(rest.features) : rest.features;
      features = parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      features = {};
    }
  }

  const cars = Array.isArray(serviceCars)
    ? serviceCars
        .filter(link => link && link.car)
        .map(link => buildCarResponse(link.car))
    : [];

  return {
    ...rest,
    image_url: imageUrls,
    features,
    cars,
  };
};

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is admin
    const isAdmin = user.roles.some(role => role.role === 'admin');
    if (!isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { roles: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isAdmin = user.roles.some(role => role.role === 'admin');
    if (!isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});


// Upload endpoints
app.post('/api/uploads', authenticateAdmin, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const relativePath = path.relative(PUBLIC_ROOT, req.file.path).replace(/\\/g, '/');
    const url = `/${relativePath}`;
    res.json({ url });
  } catch (error) {
    console.error('Error handling upload:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.delete('/api/uploads', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const url = typeof req.body?.url === 'string' ? req.body.url : null;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let relativePath = url;
    if (/^https?:\/\//i.test(url)) {
      const parsed = new URL(url);
      relativePath = parsed.pathname;
    }

    const trimmedPath = relativePath.replace(/^\/+/, '');
    const absolutePath = path.resolve(PUBLIC_ROOT, trimmedPath);

    if (!absolutePath.startsWith(PUBLIC_ROOT)) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    try {
      await fsPromises.unlink(absolutePath);
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting upload:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Cars endpoints
app.get('/api/cars', async (req, res) => {
  try {
    const pickupParam = parseDateParam(req.query.pickup);
    const dropoffParamRaw = parseDateParam(req.query.dropoff);
    const cars = await prisma.car.findMany({
      orderBy: { created_at: 'desc' },
    });
    let carsWithArrayImages = cars.map(buildCarResponse);

    if (pickupParam) {
      const dropoffParam = dropoffParamRaw ?? pickupParam;
      const dateRange = buildDateRange(pickupParam, dropoffParam);
      const rangeSet = new Set(dateRange);
      carsWithArrayImages = carsWithArrayImages.filter(car => {
        const busyDates = sanitizeBusyDates(car.unavailable_dates);
        if (!busyDates.length) {
          return true;
        }
        const busySet = new Set(busyDates);
        for (const date of rangeSet) {
          if (busySet.has(date)) {
            return false;
          }
        }
        return true;
      });
    }

    res.json(carsWithArrayImages);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
    console.log("Query result:", await prisma.car.findUnique({ where: { id: req.params.id } }));
  try {
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
    });
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    const carWithArrayImages = buildCarResponse(car);
    res.json(carWithArrayImages);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

app.post('/api/cars', async (req, res) => {
  try {
    let imageUrlValue: string | null = null;
    if (req.body.image_url) {
      if (Array.isArray(req.body.image_url) && req.body.image_url.length > 0) {
        const urls = req.body.image_url.map((img: any) => {
          if (typeof img === 'string') {
            try {
              const parsed = JSON.parse(img);
              return parsed.url || img;
            } catch {
              return img;
            }
          } else if (typeof img === 'object' && img?.url) {
            return img.url;
          }
          return img;
        });
        imageUrlValue = JSON.stringify(urls);
      } else if (typeof req.body.image_url === 'string') {
        imageUrlValue = req.body.image_url;
      }
    }

    const categoriesInput = sanitizeCategoriesInput(req.body.categories);
    const fallbackCategory = typeof req.body.category === 'string' ? req.body.category.trim() : '';
    const primaryCategory = categoriesInput[0] ?? fallbackCategory;
    const finalCategory = primaryCategory || 'uncategorized';

    const busyDates = sanitizeBusyDates(req.body.unavailable_dates);

    const carData: any = {
      ...req.body,
      category: finalCategory,
      categories: categoriesInput,
      image_url: imageUrlValue,
      unavailable_dates: busyDates,
    };

    const car = await prisma.car.create({
      data: carData,
    });

    res.json(buildCarResponse(car));
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ error: 'Failed to create car' });
  }
});

app.put('/api/cars/:id', async (req, res) => {
  try {
    let imageUrlValue: string | null | undefined = undefined;
    if (req.body.image_url !== undefined) {
      if (Array.isArray(req.body.image_url)) {
        if (req.body.image_url.length > 0) {
          const urls = req.body.image_url.map((img: any) => {
            if (typeof img === 'string') {
              try {
                const parsed = JSON.parse(img);
                return parsed.url || img;
              } catch {
                return img;
              }
            } else if (typeof img === 'object' && img?.url) {
              return img.url;
            }
            return img;
          });
          imageUrlValue = JSON.stringify(urls);
        } else {
          imageUrlValue = null;
        }
      } else if (typeof req.body.image_url === 'string') {
        imageUrlValue = req.body.image_url;
      } else if (req.body.image_url === null) {
        imageUrlValue = null;
      }
    }

    const carData: any = {
      ...req.body,
    };

    if ('unavailable_dates' in req.body) {
      carData.unavailable_dates = sanitizeBusyDates(req.body.unavailable_dates);
    } else {
      delete carData.unavailable_dates;
    }

    if (req.body.categories !== undefined) {
      const categoriesInput = sanitizeCategoriesInput(req.body.categories);
      const fallbackCategory = typeof req.body.category === 'string' ? req.body.category.trim() : '';
      const primaryCategory = categoriesInput[0] ?? fallbackCategory;
      carData.categories = categoriesInput;
      carData.category = (primaryCategory && primaryCategory.length > 0) ? primaryCategory : 'uncategorized';
    } else {
      delete carData.categories;
      if (typeof carData.category === 'string') {
        carData.category = carData.category.trim();
      }
    }

    if (imageUrlValue !== undefined) {
      carData.image_url = imageUrlValue;
    } else {
      delete carData.image_url;
    }

    const car = await prisma.car.update({
      where: { id: req.params.id },
      data: carData,
    });

    res.json(buildCarResponse(car));
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Failed to update car' });
  }
});

app.delete('/api/cars/:id', async (req, res) => {
  try {
    await prisma.car.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

// Reservations endpoints
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { car: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

app.get('/api/reservations/:id', async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: { car: true },
    });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = await prisma.reservation.create({
      data: req.body,
      include: { car: true },
    });
    sendReservationNotification(reservation);
    res.json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

app.put('/api/reservations/:id', async (req, res) => {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: req.params.id },
      data: req.body,
      include: { car: true },
    });
    res.json(reservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

app.delete('/api/reservations/:id', async (req, res) => {
  try {
    await prisma.reservation.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

// Services endpoints
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        cars: {
          include: {
            car: true,
          },
        },
      },
    });

    const parsedServices = services
      .map(buildServiceResponse)
      .filter((service): service is NonNullable<ReturnType<typeof buildServiceResponse>> => Boolean(service));

    res.json(parsedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: {
        cars: {
          include: {
            car: true,
          },
        },
      },
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const parsedService = buildServiceResponse(service);
    res.json(parsedService);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Blog endpoints
app.get('/api/blog', async (req, res) => {
  try {
    const published = req.query.published === 'true';
    const categoryParam = typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : '';
    const normalizedCategory = categoryParam && BLOG_CATEGORIES.has(categoryParam) ? (categoryParam as 'news' | 'blogs') : '';
    const posts = await prisma.blogPost.findMany({
      where: {
        ...(published ? { published: true } : {}),
        ...(normalizedCategory ? { category: normalizedCategory } : {}),
      },
      orderBy: [
        { published_at: 'desc' },
        { created_at: 'desc' },
      ],
    });
    
    // Parse image_url for each post if it's a JSON array
    const postsWithParsedImages = posts.map(post => {
      let imageUrls: string[] = [];
      if (post.image_url) {
        try {
          const parsed = JSON.parse(post.image_url);
          imageUrls = Array.isArray(parsed) ? parsed : [post.image_url];
        } catch {
          imageUrls = [post.image_url];
        }
      }
      
      return {
        ...post,
        image_url: imageUrls.length > 0 ? imageUrls[0] : '', // For backward compatibility, return first image
        image_urls: imageUrls, // Return all images
      };
    });
    
    res.json(postsWithParsedImages);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blog/id/:id', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
    });
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    // Parse image_url if it's a JSON array
    let imageUrls: string[] = [];
    if (post.image_url) {
      try {
        const parsed = JSON.parse(post.image_url);
        imageUrls = Array.isArray(parsed) ? parsed : [post.image_url];
      } catch {
        imageUrls = [post.image_url];
      }
    }
    
    res.json({
      ...post,
      image_url: imageUrls.length > 0 ? imageUrls[0] : '', // For backward compatibility, return first image
      image_urls: imageUrls, // Return all images
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
    });
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    // Parse image_url if it's a JSON array
    let imageUrls: string[] = [];
    if (post.image_url) {
      try {
        const parsed = JSON.parse(post.image_url);
        imageUrls = Array.isArray(parsed) ? parsed : [post.image_url];
      } catch {
        imageUrls = [post.image_url];
      }
    }
    
    res.json({
      ...post,
      image_url: imageUrls.length > 0 ? imageUrls[0] : '', // For backward compatibility, return first image
      image_urls: imageUrls, // Return all images
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Reviews endpoints
app.get('/api/reviews', async (req, res) => {
  try {
    const featured = req.query.featured === 'true';
    const where = featured ? { featured: true } : {};
    const reviews = await prisma.review.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { customer_name, title_az, content_az, review_type, video_url } = req.body || {};

    if (!customer_name || typeof customer_name !== 'string' || !customer_name.trim()) {
      return res.status(400).json({ error: 'customer_name is required' });
    }
    if (!content_az || typeof content_az !== 'string' || !content_az.trim()) {
      return res.status(400).json({ error: 'content_az is required' });
    }
    if (review_type === 'video') {
      if (!video_url || typeof video_url !== 'string' || !video_url.trim()) {
        return res.status(400).json({ error: 'video_url is required for video reviews' });
      }
    }

    const reviewData = sanitizeReviewInput(req.body);
    const review = await prisma.review.create({
      data: reviewData,
    });
    res.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

app.get('/api/reviews/:id', async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

app.put('/api/reviews/:id', async (req, res) => {
  try {
    const { customer_name, title_az, content_az, review_type, video_url } = req.body || {};

    if (!customer_name || typeof customer_name !== 'string' || !customer_name.trim()) {
      return res.status(400).json({ error: 'customer_name is required' });
    }
    if (!content_az || typeof content_az !== 'string' || !content_az.trim()) {
      return res.status(400).json({ error: 'content_az is required' });
    }
    if (review_type === 'video') {
      if (!video_url || typeof video_url !== 'string' || !video_url.trim()) {
        return res.status(400).json({ error: 'video_url is required for video reviews' });
      }
    }

    const reviewData = sanitizeReviewInput(req.body);
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: reviewData,
    });
    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await prisma.review.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

const sanitizeContactField = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
};

// Contact messages endpoints
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const nameField = sanitizeContactField((req.body as any)?.name);
    const firstNameInput = sanitizeContactField((req.body as any)?.first_name);
    const lastNameInput = sanitizeContactField((req.body as any)?.last_name);

    let firstName = firstNameInput;
    let lastName = lastNameInput;

    if (!firstName && nameField) {
      const parts = nameField.split(/\s+/).filter(Boolean);
      firstName = parts.shift() ?? '';
      lastName = parts.join(' ');
    }

    if (!firstName) {
      firstName = 'Qonaq';
    }
    if (!lastName) {
      lastName = 'Müştəri';
    }

    const email = sanitizeContactField((req.body as any)?.email);
    const messageContent = sanitizeContactField((req.body as any)?.message);

    if (!email || !messageContent) {
      return res.status(400).json({ error: 'Email və mesaj tələb olunur' });
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: sanitizeContactField((req.body as any)?.phone) || null,
      subject: sanitizeContactField((req.body as any)?.subject) || null,
      message: messageContent,
      status: 'new',
    };

    const message = await prisma.contactMessage.create({
      data: payload,
    });

    await sendContactNotification(message);

    res.json(message);
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to create contact message' });
  }
});

app.put('/api/contact/:id', async (req, res) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(message);
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ error: 'Failed to update contact message' });
  }
});

// Blog management endpoints (admin only - needs auth middleware in production)
app.post('/api/blog', async (req, res) => {
  try {
    // Convert image_urls array to JSON string if provided
    let imageUrlString: string | null = null;
    if (req.body.image_urls && Array.isArray(req.body.image_urls)) {
      imageUrlString = JSON.stringify(req.body.image_urls);
    } else if (req.body.image_url) {
      // If single image_url provided, convert to array format
      imageUrlString = JSON.stringify([req.body.image_url]);
    }
    
    const postData = {
      ...req.body,
      image_url: imageUrlString,
      category: sanitizeBlogCategory(req.body?.category),
    };
    delete postData.image_urls; // Remove image_urls from data
    
    const post = await prisma.blogPost.create({
      data: postData,
    });
    
    // Parse image_url for response
    let imageUrls: string[] = [];
    if (post.image_url) {
      try {
        const parsed = JSON.parse(post.image_url);
        imageUrls = Array.isArray(parsed) ? parsed : [post.image_url];
      } catch {
        imageUrls = [post.image_url];
      }
    }
    
    res.json({
      ...post,
      image_url: imageUrls.length > 0 ? imageUrls[0] : '',
      image_urls: imageUrls,
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

app.put('/api/blog/:id', async (req, res) => {
  try {
    // Convert image_urls array to JSON string if provided
    let imageUrlString: string | null = null;
    if (req.body.image_urls && Array.isArray(req.body.image_urls)) {
      imageUrlString = JSON.stringify(req.body.image_urls);
    } else if (req.body.image_url) {
      // If single image_url provided, convert to array format
      imageUrlString = JSON.stringify([req.body.image_url]);
    }
    
    const postData = {
      ...req.body,
      image_url: imageUrlString,
      category: sanitizeBlogCategory(req.body?.category),
    };
    delete postData.image_urls; // Remove image_urls from data
    
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: postData,
    });
    
    // Parse image_url for response
    let imageUrls: string[] = [];
    if (post.image_url) {
      try {
        const parsed = JSON.parse(post.image_url);
        imageUrls = Array.isArray(parsed) ? parsed : [post.image_url];
      } catch {
        imageUrls = [post.image_url];
      }
    }
    
    res.json({
      ...post,
      image_url: imageUrls.length > 0 ? imageUrls[0] : '',
      image_urls: imageUrls,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

app.delete('/api/blog/:id', async (req, res) => {
  try {
    await prisma.blogPost.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// About endpoints
app.get('/api/about', async (req, res) => {
  try {
    let about = await prisma.about.findFirst();
    
    if (!about) {
      return res.json(null);
    }
    
    // Parse image_urls
    let imageUrls: string[] = [];
    if (about.image_urls) {
      try {
        const parsed = JSON.parse(about.image_urls);
        imageUrls = Array.isArray(parsed) ? parsed : [];
      } catch {
        imageUrls = [];
      }
    }
    
    // Parse stats
    let stats = null;
    if (about.stats) {
      try {
        stats = JSON.parse(about.stats);
      } catch {
        stats = null;
      }
    }
    
    // Parse values
    let values = null;
    if (about.values) {
      try {
        values = JSON.parse(about.values);
      } catch {
        values = null;
      }
    }
    
    res.json({
      ...about,
      image_urls: imageUrls,
      stats: stats,
      values: values,
    });
  } catch (error) {
    console.error('Error fetching about:', error);
    res.status(500).json({ error: 'Failed to fetch about' });
  }
});

app.put('/api/about', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title_az || !req.body.content_az) {
      return res.status(400).json({ error: 'title_az and content_az are required' });
    }
    
    // Convert image_urls array to JSON string
    let imageUrlString: string | null = null;
    if (req.body.image_urls && Array.isArray(req.body.image_urls)) {
      imageUrlString = JSON.stringify(req.body.image_urls);
    }
    
    let statsString: string | null = null;
    if (Array.isArray(req.body.stats)) {
      statsString = JSON.stringify(req.body.stats);
    } else if (typeof req.body.stats === 'string') {
      statsString = req.body.stats;
    }

    let valuesString: string | null = null;
    if (Array.isArray(req.body.values)) {
      valuesString = JSON.stringify(req.body.values);
    } else if (typeof req.body.values === 'string') {
      valuesString = req.body.values;
    }

    const aboutData = {
      ...req.body,
      image_urls: imageUrlString,
      stats: statsString,
      values: valuesString,
    };
    delete aboutData.id; // Remove id if present
    
    // Check if about exists
    const existing = await prisma.about.findFirst();
    
    let about;
    if (existing) {
      // Update existing
      about = await prisma.about.update({
        where: { id: existing.id },
        data: aboutData,
      });
    } else {
      // Create new
      about = await prisma.about.create({
        data: aboutData,
      });
    }
    
    // Parse for response
    let imageUrls: string[] = [];
    if (about.image_urls) {
      try {
        const parsed = JSON.parse(about.image_urls);
        imageUrls = Array.isArray(parsed) ? parsed : [];
      } catch {
        imageUrls = [];
      }
    }
    
    let stats = null;
    if (about.stats) {
      try {
        stats = JSON.parse(about.stats);
      } catch {
        stats = null;
      }
    }
    
    let values = null;
    if (about.values) {
      try {
        values = JSON.parse(about.values);
      } catch {
        values = null;
      }
    }
    
    res.json({
      ...about,
      image_urls: imageUrls,
      stats: stats,
      values: values,
    });
  } catch (error) {
    console.error('Error saving about:', error);
    res.status(500).json({ error: 'Failed to save about' });
  }
});

app.get('/api/contact-info', async (_req, res) => {
  try {
    const record = await prisma.contactInfo.findFirst({
      orderBy: { created_at: 'asc' },
    });
    const info = buildContactInfoResponse(record ?? null);
    res.json(info);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ error: 'Failed to fetch contact info' });
  }
});

app.put('/api/contact-info', async (req, res) => {
  try {
    const phoneInput = req.body?.phones ?? req.body?.phone_numbers ?? req.body?.phone ?? [];
    const emailInput = req.body?.emails ?? req.body?.email ?? [];
    const whatsappInput = req.body?.whatsapp_numbers ?? req.body?.whatsappNumbers ?? req.body?.whatsapp ?? [];
    const officeHoursInput = req.body?.office_hours ?? req.body?.officeHours ?? [];
    const socialLinksInput = req.body?.social_links ?? req.body?.socialLinks ?? {};

    const phones = sanitizeStringList(Array.isArray(phoneInput) ? phoneInput : [phoneInput]);
    const emails = sanitizeStringList(Array.isArray(emailInput) ? emailInput : [emailInput]);
    const whatsappNumbers = sanitizeStringList(Array.isArray(whatsappInput) ? whatsappInput : [whatsappInput]);
    const officeHours = sanitizeOfficeHours(Array.isArray(officeHoursInput) ? officeHoursInput : [officeHoursInput]);
    const socialLinks = sanitizeSocialLinks(socialLinksInput);

    if (!phones.length) {
      return res.status(400).json({ error: 'At least one phone number is required' });
    }
    if (!emails.length) {
      return res.status(400).json({ error: 'At least one email is required' });
    }

    const companyNameMap = sanitizeLocalizedInput(req.body?.company_name ?? req.body?.companyName, defaultContactInfo.company_name);
    const taglineMap = sanitizeLocalizedInput(req.body?.tagline, defaultContactInfo.tagline);
    const descriptionMap = sanitizeLocalizedInput(req.body?.description, defaultContactInfo.description);
    const addressMap = sanitizeLocalizedInput(req.body?.address, defaultContactInfo.address);
    const addressSecondaryMap = sanitizeLocalizedInput(req.body?.address_secondary ?? req.body?.addressSecondary, defaultContactInfo.address_secondary);
    const mapEmbedUrl = optionalString(req.body?.map_embed_url ?? req.body?.mapEmbedUrl) ?? defaultContactInfo.map_embed_url;
    const officesSanitized = sanitizeOfficesForSaving(req.body?.offices);

    const contactData: Record<string, any> = {
      company_name: JSON.stringify(companyNameMap),
      tagline: JSON.stringify(taglineMap),
      description: JSON.stringify(descriptionMap),
      address: JSON.stringify(addressMap),
      address_secondary: JSON.stringify(addressSecondaryMap),
      map_embed_url: mapEmbedUrl,
      phones: JSON.stringify(phones),
      emails: JSON.stringify(emails),
      whatsapp_numbers: whatsappNumbers.length ? JSON.stringify(whatsappNumbers) : null,
      office_hours: officeHours.length ? JSON.stringify(officeHours) : null,
      social_links: Object.keys(socialLinks).length ? JSON.stringify(socialLinks) : null,
      offices: officesSanitized.length ? JSON.stringify(officesSanitized) : null,
    };

    const existing = await prisma.contactInfo.findFirst();
    let record;
    if (existing) {
      record = await prisma.contactInfo.update({
        where: { id: existing.id },
        data: contactData,
      });
    } else {
      record = await prisma.contactInfo.create({
        data: contactData,
      });
    }

    res.json(buildContactInfoResponse(record));
  } catch (error) {
    console.error('Error saving contact info:', error);
    res.status(500).json({ error: 'Failed to save contact info' });
  }
});


app.get('/api/agent-config/prompt', async (_req, res) => {
  try {
    const record = await prisma.agentConfig.findFirst({
      orderBy: { created_at: 'asc' },
    });
    const response = buildAgentConfigResponse(record ?? null);
    res.json({
      agent_name: response.agent_name,
      final_prompt: response.final_prompt,
      updated_at: response.updated_at,
    });
  } catch (error) {
    console.error('Error fetching agent prompt:', error);
    res.status(500).json({ error: 'Failed to fetch agent prompt' });
  }
});

app.get('/api/agent-config', authenticateAdmin, async (_req, res) => {
  try {
    const record = await prisma.agentConfig.findFirst({
      orderBy: { created_at: 'asc' },
    });
    res.json(buildAgentConfigResponse(record ?? null));
  } catch (error) {
    console.error('Error fetching agent config:', error);
    res.status(500).json({ error: 'Failed to fetch agent config' });
  }
});

app.put('/api/agent-config', authenticateAdmin, async (req, res) => {
  try {
    const payload = sanitizeAgentConfigInput(req.body ?? {});
    const existing = await prisma.agentConfig.findFirst();
    let record;
    if (existing) {
      record = await prisma.agentConfig.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      record = await prisma.agentConfig.create({
        data: { id: randomUUID(), ...payload },
      });
    }

    res.json(buildAgentConfigResponse(record));
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('AGENT_')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error saving agent config:', error);
    res.status(500).json({ error: 'Failed to save agent config' });
  }
});
;

// Service management endpoints
app.post('/api/services', async (req, res) => {
  try {
    if (!req.body.title_az || !req.body.description_az) {
      return res.status(400).json({ error: 'title_az and description_az are required' });
    }

    const carIdsInput = Array.isArray(req.body.carIds) ? req.body.carIds : [];
    const uniqueCarIds = Array.from(new Set(carIdsInput.filter((id: unknown): id is string => typeof id === 'string' && id.trim() !== '')));

    const serviceData: Record<string, any> = { ...req.body };
    delete serviceData.carIds;
    delete serviceData.cars;

    const service = await prisma.service.create({
      data: serviceData,
    });

    if (uniqueCarIds.length > 0) {
      await prisma.serviceCar.createMany({
        data: uniqueCarIds.map(carId => ({ service_id: service.id, car_id: carId })),
        skipDuplicates: true,
      });
    }

    const createdService = await prisma.service.findUnique({
      where: { id: service.id },
      include: {
        cars: {
          include: {
            car: true,
          },
        },
      },
    });

    res.json(buildServiceResponse(createdService));
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const carIdsInput = Array.isArray(req.body.carIds) ? req.body.carIds : null;
    const uniqueCarIds = Array.isArray(carIdsInput)
      ? Array.from(new Set(carIdsInput.filter((id: unknown): id is string => typeof id === 'string' && id.trim() !== '')))
      : null;

    const serviceData: Record<string, any> = { ...req.body };
    delete serviceData.carIds;
    delete serviceData.cars;

    const updatedService = await prisma.service.update({
      where: { id: req.params.id },
      data: serviceData,
    });

    if (uniqueCarIds) {
      if (uniqueCarIds.length === 0) {
        await prisma.serviceCar.deleteMany({
          where: { service_id: updatedService.id },
        });
      } else {
        await prisma.serviceCar.deleteMany({
          where: {
            service_id: updatedService.id,
            NOT: { car_id: { in: uniqueCarIds } },
          },
        });

        const existingLinks = await prisma.serviceCar.findMany({
          where: { service_id: updatedService.id },
          select: { car_id: true },
        });
        const existingIds = new Set(existingLinks.map(link => link.car_id));
        const linksToCreate = uniqueCarIds
          .filter(carId => !existingIds.has(carId))
          .map(carId => ({ service_id: updatedService.id, car_id: carId }));
        if (linksToCreate.length > 0) {
          await prisma.serviceCar.createMany({
            data: linksToCreate,
            skipDuplicates: true,
          });
        }
      }
    }

    const serviceWithRelations = await prisma.service.findUnique({
      where: { id: updatedService.id },
      include: {
        cars: {
          include: {
            car: true,
          },
        },
      },
    });

    res.json(buildServiceResponse(serviceWithRelations));
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    await prisma.service.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Car categories management (get categories from cars)
app.get('/api/categories', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const includeCounts = req.query.includeCounts === 'true';

    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { is_active: true },
      orderBy: [
        { sort_order: 'asc' },
        { name_az: 'asc' },
      ],
    });

    const counts = includeCounts
      ? await computeCategoryCounts(categories.map(category => category.slug))
      : {};

    res.json(categories.map(category => buildCategoryResponse(category, counts)));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const includeCounts = req.query.includeCounts === 'true';
    const counts = includeCounts ? await computeCategoryCounts([category.slug]) : {};
    res.json(buildCategoryResponse(category, counts));
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const payload = sanitizeCategoryPayload(req.body ?? {});
    const existing = await prisma.category.findUnique({
      where: { slug: payload.slug },
    });
    if (existing) {
      return res.status(409).json({ error: 'Category slug already exists' });
    }

    const record = await prisma.category.create({
      data: mapCategoryDataForSave(payload),
    });

    res.status(201).json(buildCategoryResponse(record));
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'CATEGORY_NAME_REQUIRED' || error.message === 'CATEGORY_SLUG_REQUIRED')
    ) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const existing = await prisma.category.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const payload = sanitizeCategoryPayload(req.body ?? {}, existing);

    if (payload.slug !== existing.slug) {
      const slugConflict = await prisma.category.findUnique({
        where: { slug: payload.slug },
      });
      if (slugConflict && slugConflict.id !== existing.id) {
        return res.status(409).json({ error: 'Category slug already exists' });
      }
    }

    const record = await prisma.category.update({
      where: { id: existing.id },
      data: mapCategoryDataForSave(payload),
    });

    if (payload.slug !== existing.slug) {
      await replaceCategorySlugInCars(existing.slug, payload.slug);
    }

    const counts = await computeCategoryCounts([payload.slug]);
    res.json(buildCategoryResponse(record, counts));
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'CATEGORY_NAME_REQUIRED' || error.message === 'CATEGORY_SLUG_REQUIRED')
    ) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const existing = await prisma.category.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const usage = await prisma.car.count({
      where: {
        OR: [
          { category: existing.slug },
          {
            categories: {
              has: existing.slug,
            },
          },
        ],
      },
    });

    const force = req.query.force === 'true';

    if (usage > 0 && !force) {
      return res.status(400).json({
        error: 'Category is currently used by cars',
        car_count: usage,
        slug: existing.slug,
      });
    }

    await removeCategorySlugFromCars(existing.slug);

    await prisma.category.delete({
      where: { id: existing.id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});



async function startServer() {
  try {
    // Prisma connection yoxla və bağla
    const { connectPrisma, checkPrismaConnection } = await import('../src/lib/prisma.js');
    await connectPrisma();
    
    const isConnected = await checkPrismaConnection();
    if (!isConnected) {
      console.error('❌ Prisma connection failed. Server will not start.');
      process.exit(1);
    }
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
