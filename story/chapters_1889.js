/**
 * Curated Bilingual Archival Plate Stories — Milad Tower (Borj-e Milad, 1994–2008)
 * (`story/chapters_1889.js`)
 *
 * Supports English (`en`) and Persian / Farsi (`fa`) with verified facts, dates,
 * and whole-meter elevations grounded in `data/catalog/photo_cameras_3d.json`.
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
  '55',
  '13',
  '09',
  '51',
  '23',
  '14',
  '01',
  '46',
  '18',
  '36',
  '38',
]);

export const CHAMP_DE_MARS_TIMELAPSE_IDS = [
  '23',
  '14',
  '01',
  '46',
  '18',
];

const CURATION_ENTRIES_FA = [
  {
    photoId: '55',
    chronologicalIndex: 0,
    dateLabel: '۱۳۷۳ تا ۱۳۸۷ (1994–2008)',
    title: 'طراحی برج ۴۳۵ متری میلاد تهران',
    vantageLabel: 'نقشه نمای معماری و مقطع سازه‌ای کل برج',
    caption:
      'برج میلاد به طراحی دکتر محمدرضا حافظی و کارفرمایی شهرداری تهران (یادمان سازه)، هندسه هشت‌ضلعی معماری ایرانی را با بدنه بتنی ۳۱۵ متری، سازه رأس ۱۲ طبقه با عرض ۶۰ متر و دکل مخابراتی ۱۲۰ متری تا ارتفاع ۴۳۵ متر ترکیب می‌کند.',
  },
  {
    photoId: '13',
    chronologicalIndex: 1,
    dateLabel: '۱۳۷۶ تا ۱۳۷۸ (1997–1999)',
    title: 'گودبرداری ژئوتکنیکی بر فراز تپه گیشا',
    vantageLabel: 'گود دایره‌ای ۱۴ متری فونداسیون لرزه‌ای، شمال‌غرب تهران',
    caption:
      'پس از بررسی ۱۷ نقطه در تهران، تپه گیشا در میان بزرگراه‌های همت، حکیم، چمران و شیخ فضل‌الله نوری انتخاب شد. گودبرداری دایره‌ای به عمق ۱۴ متر برای تکیه‌گاه سازه‌ای با وزن تقریبی ۱۵۰ هزار تن در پهنه لرزه‌خیز تهران اجرا گردید.',
  },
  {
    photoId: '09',
    chronologicalIndex: 2,
    dateLabel: '۱۳۷۸ تا ۱۳۷۹ (1999–2000)',
    title: 'فونداسیون گسترده بتنی به قطر ۶۶ متر',
    vantageLabel: 'پد پی گسترده و پایه انتقالی بر تپه گیشا',
    caption:
      'شرکت بلندپایه پی گسترده بتنی به قطر ۶۶ متر و سازه انتقالی پایه را در کف گود اجرا کرد. در کل پروژه حدود ۶۳ هزار متر مکعب بتن مسلح با آرماتوربندی سنگین، بارهای باد و زلزله را به بستر تپه منتقل می‌کند.',
  },
  {
    photoId: '51',
    chronologicalIndex: 3,
    dateLabel: '۱۳۷۹ تا ۱۳۸۱ (2000–2002)',
    title: 'اجرای قالب لغزنده بدنه بتنی هشت‌پر',
    vantageLabel: 'قالب‌بندی لغزنده هیدرولیکی پیوسته بر فراز تهران',
    caption:
      'با استفاده از سامانه قالب لغزنده هیدرولیکی پیوسته، هسته مرکزی هشت‌ضلعی و چهار بال متقارن ذوزنقه‌ای ساخته شدند. سه بال محل حرکت شش آسانسور شیشه‌ای پرسرعت است و بال چهارم راهپله اضطراری با ۱٬۶۹۳ پله را در بر می‌گیرد.',
  },
  {
    photoId: '23',
    chronologicalIndex: 4,
    dateLabel: '۱۳۸۱ تا ۱۳۸۲ (2002–2003)',
    title: 'تکمیل بدنه ۳۱۵ متری و لابی ۶ طبقه پایه',
    vantageLabel: 'نمای جنوبی رو به شمال و رشته‌کوه البرز',
    caption:
      'در سال ۱۳۸۲ (۲۰۰۳) بدنه بتنی در تراز ۳۱۵ متر به پایان رسید. در پیرامون پایه برج، ساختمان لابی ۶ طبقه به ارتفاع ۲۷ متر با سنگ تراورتن، شیشه و نقوش هندسی ایرانی شامل گالری‌ها و تالارهای پذیرش ساخته شد.',
  },
  {
    photoId: '14',
    chronologicalIndex: 5,
    dateLabel: '۱۳۸۲ تا ۱۳۸۴ (2003–2005)',
    title: 'نصب سنگین سازه فولادی ۱۲ طبقه رأس برج',
    vantageLabel: 'مطالعه سازه‌ای سبد فولادی در تراز ۲۴۷ تا ۳۱۵ متر',
    caption:
      'سازه رأس ۱۲ طبقه با حدود ۲٬۰۰۰ تن فولاد ساختمانی به صورت قطعه‌قطعه ساخته و در تراز ۲۴۷ تا ۳۱۵ متر بر روی بدنه بتنی نصب شد. این سبد فولادی با زیربنای ۱۲٬۰۰۰ متر مربع، یکی از بزرگ‌ترین سازه‌های رأس برج‌های مخابراتی جهان است.',
  },
  {
    photoId: '01',
    chronologicalIndex: 6,
    dateLabel: '۱۳۸۴ تا ۱۳۸۵ (2005–2006)',
    title: 'نمای سبد هندسی ایرانی با قطر ۶۰ متر',
    vantageLabel: 'نمای جنوب‌شرقی جداره چندوجهی سازه رأس',
    caption:
      'سازه رأس با الهام از مقرنس‌کاری و تناسبات هندسی سنتی ایران، از تراز ۲۴۷ متر به سمت بیرون باز شده و در تراز ۲۸۰ متر به بیشینه قطر ۶۰ متر می‌رسد و با پنل‌های فلزی و شیشه کرتین‌وال پوشانده شده است.',
  },
  {
    photoId: '46',
    chronologicalIndex: 7,
    dateLabel: '۱۳۸۵ تا ۱۳۸۶ (2006–2007)',
    title: 'بالابری تلسکوپی چهارمرحله‌ای دکل ۱۲۰ متری',
    vantageLabel: 'بخش فوقانی برج و دکل مخابراتی چهاربخشی فولادی',
    caption:
      'در سال‌های ۱۳۸۵ و ۱۳۸۶، دکل فولادی ۱۲۰ متری به وزن حدود ۳۵۰ تن در چهار مرحله تلسکوپی بر فراز بدنه ۳۱۵ متری نصب شد و ارتفاع کل برج میلاد را برای پوشش رادیویی، تلویزیونی و مخابراتی به ۴۳۵ متر رساند.',
  },
  {
    photoId: '18',
    chronologicalIndex: 8,
    dateLabel: '۱۳۸۶ تا ۱۳۸۷ (2007–2008)',
    title: 'رستوران گردان و سکوهای دید پانورامای تهران',
    vantageLabel: 'نمای ترازهای ۲۷۶، ۲۸۰ و ۲۹۲ متری سازه رأس',
    caption:
      'تجهیز فضاهای داخلی رأس ۱۲ طبقه شامل رستوران گردان در تراز ۲۷۶ متر با یک دور چرخش کامل در ساعت، سکوی دید باز در تراز ۲۸۰ متر و گالری دید بسته و موزه در تراز ۲۹۲ متر تکمیل گردید.',
  },
  {
    photoId: '36',
    chronologicalIndex: 9,
    dateLabel: '۱۳۸۷ (2008)',
    title: 'گنبد آسمان شیشه‌ای و آسانسورهای ۷ متر بر ثانیه',
    vantageLabel: 'نمای تاج شیشه‌ای تراز ۳۰۲ تا ۳۱۵ متر و بال‌های آسانسور',
    caption:
      'در تراز ۳۰۲ تا ۳۱۵ متر، گنبد آسمان شیشه‌ای-فولادی تاج سازه رأس را شکل می‌دهد. شش آسانسور شیشه‌ای پرسرعت با سرعت ۷ متر بر ثانیه بازدیدکنندگان را در حدود ۴۵ ثانیه از لابی به طبقات دید منتقل می‌کنند.',
  },
  {
    photoId: '38',
    chronologicalIndex: 10,
    dateLabel: '۱۶ مهر ۱۳۸۷ (7 Oct 2008)',
    title: 'گشایش رسمی بر فراز تهران و افق البرز',
    vantageLabel: 'چشم‌انداز گسترده از تپه گیشا به سوی قله‌های البرز',
    caption:
      'در ۱۶ مهر ۱۳۸۷ (۷ اکتبر ۲۰۰۸)، برج میلاد به عنوان کانون مرکز ارتباطات بین‌المللی تهران رسماً گشایش یافت و با ارتفاع ۴۳۵ متر به بلندترین سازه ایران و نماد مدرن پایتخت در برابر رشته‌کوه البرز بدل شد.',
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
      fr: Object.freeze({ ...faEntry }),
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
