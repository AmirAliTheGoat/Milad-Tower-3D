/**
 * Curated Bilingual Archival Plate Stories — Milad Tower (Borj-e Milad, 1997–2008)
 * (`story/chapters_1889.js`)
 *
 * Supports English (`en`) and Persian / Farsi (`fa`) with verified facts, dates,
 * and whole-meter elevations matched 1-to-1 with real construction & completion photographs
 * in `data/catalog/photo_cameras_3d.json`.
 */

import { CURATION_ENTRIES_EN } from './chapters_1889_en.js';

export const DEFAULT_LANGUAGE = 'en';

export function normalizeLanguage(lang) {
  const s = typeof lang === 'string' ? lang.trim().toLowerCase() : '';
  if (s.startsWith('fa') || s === 'persian' || s === 'farsi') {
    return 'fa';
  }
  return 'en';
}

export const PHOTO_CHRONOLOGICAL_IDS = Object.freeze([
  '13',
  '09',
  '51',
  '23',
  '14',
  '01',
  '46',
  '38',
]);

export const MILAD_TIMELAPSE_IDS = [
  '51',
  '23',
  '14',
  '01',
  '46',
];

const CURATION_ENTRIES_FA = [
  {
    photoId: '13',
    chronologicalIndex: 0,
    dateLabel: '۱۳۷۶ تا ۱۳۷۸ (1997–1999)',
    title: 'گودبرداری ژئوتکنیکی بر فراز تپه گیشا',
    vantageLabel: 'گود دایره‌ای ۱۴ متری فونداسیون لرزه‌ای، شمال‌غرب تهران',
    caption:
      'پس از بررسی ۱۷ نقطه در تهران، تپه گیشا در میان بزرگراه‌های همت، حکیم، چمران و شیخ فضل‌الله نوری انتخاب شد. گودبرداری دایره‌ای به عمق ۱۴ متر برای تکیه‌گاه سازه‌ای با وزن تقریبی ۱۵۰ هزار تن در پهنه لرزه‌خیز تهران اجرا گردید.',
  },
  {
    photoId: '09',
    chronologicalIndex: 1,
    dateLabel: '۱۳۷۸ تا ۱۳۷۹ (1999–2000)',
    title: 'آرماتوربندی فونداسیون ۶۶ متری و جرثقیل مرکزی',
    vantageLabel: 'حلقه‌های متراکم آرماتور لرزه‌ای در کف گود تپه گیشا',
    caption:
      'پیش از بتن‌ریزی پی گسترده دایره‌ای به قطر ۶۶ متر (ضخامت ۳ تا ۴.۵ متر)، حلقه‌های متراکم آرماتور فولادی پیرامون جرثقیل برجی مرکزی در کف گود بسته شد. در کل برج حدود ۶۳ هزار متر مکعب بتن مسلح بارها را به بستر تپه منتقل می‌کند.',
  },
  {
    photoId: '51',
    chronologicalIndex: 2,
    dateLabel: '۱۳۷۹ (2000)',
    title: 'سازه انتقالی مخروطی و پشت‌بندهای شعاعی برشی',
    vantageLabel: 'پایه شانزده‌وجهی شیب‌دار و دیوارهای تقویت‌کننده شعاعی',
    caption:
      'مستقیماً بر روی پی گسترده دایره‌ای، پایه انتقالی شانزده‌ضلعی و مخروطی‌شکل با ۱۶ پشت‌بند شعاعی بتنی اجرا شد. این سازه، نیروهای شدید باد و زلزله را از بدنه بلند مرکزی به فونداسیون ۶۶ متری زیرین هدایت می‌کند.',
  },
  {
    photoId: '23',
    chronologicalIndex: 3,
    dateLabel: '۱۳۷۹ تا ۱۳۸۱ (2000–2002)',
    title: 'اجرای قالب لغزنده بدنه بتنی هشت‌پر',
    vantageLabel: 'نمای فوقانی از سکوی دایره‌ای کار و قالب لغزنده هیدرولیکی',
    caption:
      'با سامانه قالب لغزنده هیدرولیکی پیوسته و سکوی دایره‌ای پیرامون آن، هسته هشت‌ضلعی و چهار بال متقارن ذوزنقه‌ای شبانه‌روز بالا رفت. سه بال محل حرکت شش آسانسور شیشه‌ای پرسرعت است و بال چهارم ۱٬۶۹۳ پله اضطراری را در بر می‌گیرد.',
  },
  {
    photoId: '14',
    chronologicalIndex: 4,
    dateLabel: '۱۳۸۲ (2003)',
    title: 'تکمیل بدنه بتنی ۳۱۵ متری بر فراز گیشا',
    vantageLabel: 'نمای هوایی رو به پایین از بدنه تکمیل‌شده به سوی کارگاه پایه',
    caption:
      'تا سال ۱۳۸۲ بدنه بتنی با دهانه‌های آسانسور و خرپاهای بالایی به ارتفاع کامل ۳۱۵ متر رسید. در روند واقعی ساخت، ستون بتنی ۳۱۵ متری پیش از شکل‌گیری کامل پوسته لابی ۶ طبقه در پایه، قد برافراشته بود.',
  },
  {
    photoId: '01',
    chronologicalIndex: 5,
    dateLabel: '۱۳۸۲ تا ۱۳۸۴ (2003–2005)',
    title: 'دستک‌های V شکل پایه و سبد فولادی ۱۲ طبقه رأس',
    vantageLabel: 'نگاه از کنار ستون‌های مایل لابی پایه به خرپاهای ضربدری رأس برج',
    caption:
      'در نگاه رو به بالا از کنار ستون‌های مایل V شکل لابی نیمه‌ساخته پایه، سازه رأس ۱۲ طبقه در تراز ۲۴۷ تا ۳۱۵ متر با شبکه بیرونی خرپاهای فولادی ضربدری (تا قطر ۶۰ متر و وزن حدود ۲۵ هزار تن) نمایان می‌شود.',
  },
  {
    photoId: '46',
    chronologicalIndex: 6,
    dateLabel: '۱۳۸۵ تا ۱۳۸۶ (2006–2007)',
    title: 'نصب غلاف پایه دکل ۱۲۰ متری در تراز ۳۱۵ متر',
    vantageLabel: 'بام سازه رأس مشرف بر تقاطع بزرگراه‌های همت و چمران',
    caption:
      'بر فراز بام تراز ۳۱۵ متر مشرف بر گره بزرگراهی همت و چمران، غلاف استوانه‌ای فولادی و پیچ‌شده درون حوضچه هشت‌ضلعی سقف مونتاژ شد تا نخستین بخش دکل مخابراتی ۱۲۰ متری با وزن ۳۵۰ تن بر آن استوار گردد.',
  },
  {
    photoId: '38',
    chronologicalIndex: 7,
    dateLabel: '۱۶ مهر ۱۳۸۷ (7 Oct 2008)',
    title: 'برج کامل ۴۳۵ متری میلاد در برابر رشته‌کوه البرز',
    vantageLabel: 'نمای جنوبی از برج کامل ۴۳۵ متری در پیش‌زمینه قله‌های برفی البرز',
    caption:
      'برج میلاد در ۱۶ مهر ۱۳۸۷ به ارتفاع کامل ۴۳۵ متر گشایش یافت و امروز با لابی ستون‌دار ۲۷ متری، بدنه بتنی ۳۱۵ متری، سبد فولادی با خرپاهای بیرونی، رستوران گردان ۲۷۶ متری، سکوی دید ۲۸۰ متری، گنبد آسمان و دکل ۱۲۰ متری در برابر البرز خودنمایی می‌کند.',
  },
];

export const PHOTO_CURATION_1889 = Object.freeze(
  CURATION_ENTRIES_EN.map((enEntry, idx) => {
    const faEntry = CURATION_ENTRIES_FA[idx] || enEntry;
    return Object.freeze({
      photoId: enEntry.photoId,
      chronologicalIndex: enEntry.chronologicalIndex,
      en: Object.freeze({ ...enEntry }),
      fa: Object.freeze({ ...faEntry }),
    });
  })
);

const CURATION_BY_ID = new Map(PHOTO_CURATION_1889.map((item) => [item.photoId, item]));

export function getPhotoCuration(photoId, lang = DEFAULT_LANGUAGE) {
  const cleanId = String(photoId || '').trim().replace(/^#/, '').padStart(2, '0');
  const entry = CURATION_BY_ID.get(cleanId);
  if (!entry) return null;
  const norm = normalizeLanguage(lang);
  return entry[norm] || entry.en;
}

export function getAllPhotoCurations(lang = DEFAULT_LANGUAGE) {
  const norm = normalizeLanguage(lang);
  return PHOTO_CURATION_1889.map((entry) => entry[norm] || entry.en);
}
