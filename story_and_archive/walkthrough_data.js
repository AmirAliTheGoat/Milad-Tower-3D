/**
 * Chronological Story Walkthrough + Hero 3D Showcase Loop Data (`story_and_archive/walkthrough_data.js`)
 * Grounded strictly in verified Milad Tower (Borj-e Milad, Tehran, 1997–2008) facts,
 * real archival photographs, and calibrated 3D cameras in `data/catalog/photo_cameras_3d.json`.
 *
 * Key Guarantees:
 *   - 9 stops forming a seamless chronological loop:
 *       * Stops 1–8 (`#13, #09, #51, #23, #14, #01, #46, #38`): 8 real construction & completion plates
 *       * Stop 9 (`photoId: null`): Unobstructed Complete 435 m Milad Tower 3D Showcase (`step = 11.0`)
 *   - Full English (`en`) and Persian / Farsi (`fa`) copy, with whole-meter dimensions and colon-free titles.
 */

export const WALKTHROUGH_STOPS = Object.freeze([
  {
    stopIndex: 1,
    stopId: 'stop_01_1997_gisha_excavation',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '13',
    calibratedStep: 0.50,
    dateLabel: {
      en: '1997–1999',
      fa: '۱۳۷۶ تا ۱۳۷۸ (1997–1999)',
    },
    shortLabel: {
      en: '1997–1999 · Gisha Excavation',
      fa: '۱۳۷۶ تا ۱۳۷۸ · گودبرداری تپه گیشا',
    },
    elevationSummary: {
      en: '14 m Deep Circular Seismic Pit · Gisha Hilltop Bedrock Bed',
      fa: 'گود دایره‌ای لرزه‌ای ۱۴ متری · بستر سنگی تپه گیشا',
    },
    headline: {
      en: 'Geotechnical Excavation on Gisha Hilltop',
      fa: 'گودبرداری ژئوتکنیکی بر فراز تپه گیشا',
    },
    narrative: {
      en: 'After evaluating 17 candidate locations across Tehran, engineers selected Gisha Hilltop for its elevated bedrock between Hemmat, Hakim, Chamran, and Sheikh Fazlollah Nouri Expressways. Crews excavated a 14-meter-deep circular foundation pit engineered to anchor a 150,000-ton landmark in a high-seismic zone.',
      fa: 'پس از مطالعه ۱۷ نقطه در تهران، تپه گیشا در شمال‌غرب پایتخت به دلیل موقعیت بلند و بستر سنگی در میان بزرگراه‌های همت، حکیم، چمران و شیخ فضل‌الله نوری برگزیده شد. گود دایره‌ای به عمق ۱۴ متر برای مهار سازه‌ای ۱۵۰ هزار تنی در پهنه لرزه‌خیز حفر گردید.',
    },
    placard: {
      normBboxXYWH: [0.03, 0.03, 0.34, 0.28],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 2,
    stopId: 'stop_02_1999_foundation_mat',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '09',
    calibratedStep: 1.05,
    dateLabel: {
      en: '1999–2000',
      fa: '۱۳۷۸ تا ۱۳۷۹ (1999–2000)',
    },
    shortLabel: {
      en: '1999–2000 · 66 m Rebar Mat',
      fa: '۱۳۷۸ تا ۱۳۷۹ · آرماتوربندی پی ۶۶ متری',
    },
    elevationSummary: {
      en: '66 m Circular Rebar Cage (3–5 m Thick) · 63,000 m³ Project Concrete',
      fa: 'قفسه آرماتوربندی ۶۶ متر · ۶۳٬۰۰۰ متر مکعب بتن کل پروژه',
    },
    headline: {
      en: 'The 66-Meter Reinforced Concrete Foundation Mat',
      fa: 'آرماتوربندی فونداسیون ۶۶ متری و جرثقیل مرکزی',
    },
    narrative: {
      en: 'Inside the open 14-meter pit around a central erection tower crane, Boland Payeh crews tied dense concentric rings of vertical and hoop reinforcing steel before pouring the 66-meter-diameter monolithic mat foundation. Across the completed tower, roughly 63,000 cubic meters of structural concrete anchor the structure into Gisha Hill.',
      fa: 'در کف گود ۱۴ متری و پیرامون جرثقیل مرکزی، گروه مهندسی بلندپایه حلقه‌های متراکم آرماتورهای عمودی و محیطی را پیش از بتن‌ریزی پی گسترده ۶۶ متری به هم بافتند. در کل برج حدود ۶۳٬۰۰۰ متر مکعب بتن مسلح نیروها را به بستر تپه منتقل می‌کند.',
    },
    placard: {
      normBboxXYWH: [0.62, 0.03, 0.35, 0.26],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 3,
    stopId: 'stop_03_2000_transition_pedestal',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '51',
    calibratedStep: 1.45,
    dateLabel: {
      en: '2000',
      fa: '۱۳۷۹ (2000)',
    },
    shortLabel: {
      en: '2000 · Conical Transition Pedestal',
      fa: '۱۳۷۹ · پایه انتقالی مخروطی',
    },
    elevationSummary: {
      en: '16-Sided Tapered Pedestal · 16 Radial Shear Buttresses',
      fa: 'پایه شانزده‌ضلعی مخروطی · ۱۶ پشت‌بند شعاعی برشی',
    },
    headline: {
      en: 'Conical Transition Pedestal and Radial Shear Buttresses',
      fa: 'سازه انتقالی مخروطی و پشت‌بندهای شعاعی برشی',
    },
    narrative: {
      en: 'Directly atop the circular foundation raft, workers formed a 16-sided tapered concrete transition cone braced by 16 radial shear buttresses and heavy starter rebar. This transition structure channels bending and seismic forces from the narrow concrete shaft uniformly across the 66-meter mat below.',
      fa: 'مستقیماً بر روی دال دایره‌ای پی، سازه انتقالی شانزده‌وجهی و مخروطی‌شکل همراه با ۱۶ دیوار پشت‌بند شعاعی قالب‌بندی و بتن‌ریزی شد تا نیروهای خمشی و لرزه‌ای بدنه بلند برج را به شکل یکنواخت به فونداسیون ۶۶ متری منتقل کند.',
    },
    placard: {
      normBboxXYWH: [0.62, 0.03, 0.35, 0.26],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 4,
    stopId: 'stop_04_2000_slipform_shaft',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '23',
    calibratedStep: 3.15,
    dateLabel: {
      en: '2000–2002',
      fa: '۱۳۷۹ تا ۱۳۸۱ (2000–2002)',
    },
    shortLabel: {
      en: '2000–2002 · Slip-Formed Shaft',
      fa: '۱۳۷۹ تا ۱۳۸۱ · قالب لغزنده بدنه',
    },
    elevationSummary: {
      en: '8-Lobed Octagonal Core · Hydraulic Climbing Deck · 1,693 Steps',
      fa: 'هسته هشت‌پر بتنی · سکوی قالب لغزنده · ۱٬۶۹۳ پله اضطراری',
    },
    headline: {
      en: 'Slip-Forming the 8-Lobed Concrete Shaft',
      fa: 'اجرای قالب لغزنده بدنه بتنی هشت‌پر',
    },
    narrative: {
      en: 'Encircling the climbing concrete core with a stepped circular steel work deck, continuous hydraulic slip-forming equipment jacked upward around the clock to cast the octagonal spine and four trapezoidal wings—housing six panoramic elevator shafts and a 1,693-step emergency stairwell.',
      fa: 'با سکوی دایره‌ای معلق بر فراز هسته مرکزی، سامانه قالب لغزنده هیدرولیکی به‌صورت پیوسته بالا رفت تا بدنه هشت‌ضلعی و چهار بال ذوزنقه‌ای را با شش چاهک آسانسور شیشه‌ای و ۱٬۶۹۳ پله اضطراری اجرا کند.',
    },
    placard: {
      normBboxXYWH: [0.03, 0.05, 0.26, 0.32],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 5,
    stopId: 'stop_05_2003_shaft_topout',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '14',
    calibratedStep: 4.75,
    dateLabel: {
      en: '2003',
      fa: '۱۳۸۲ (2003)',
    },
    shortLabel: {
      en: '2003 · 315 m Shaft Top-Out',
      fa: '۱۳۸۲ · تکمیل بدنه ۳۱۵ متری',
    },
    elevationSummary: {
      en: '315 m Completed Concrete Shaft · Windowed Elevator Wings',
      fa: 'تکمیل بدنه بتنی ۳۱۵ متری · بال‌های آسانسور و کارگاه پایه',
    },
    headline: {
      en: '315-Meter Concrete Shaft Top-Out Above Gisha',
      fa: 'تکمیل بدنه بتنی ۳۱۵ متری بر فراز گیشا',
    },
    narrative: {
      en: 'Looking steeply downward past the upper climbing work collars as the concrete spine topped out at 315 meters in 2003, the open site below reveals a crucial historical fact: Milad Tower’s 315-meter shaft rose to full height before the surrounding 6-story base lobby was enclosed.',
      fa: 'این نمای هوایی از کنار عرشه‌های بالایی در سال ۱۳۸۲ نشان می‌دهد که بدنه بتنی با پنجره‌های بال‌های آسانسور پیش از تکمیل و پوشش لابی ۶ طبقه پایه، به ارتفاع نهایی ۳۱۵ متر دست یافته بود.',
    },
    placard: {
      normBboxXYWH: [0.03, 0.05, 0.26, 0.32],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 6,
    stopId: 'stop_06_2003_head_steel_struts',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '01',
    calibratedStep: 6.18,
    dateLabel: {
      en: '2003–2005',
      fa: '۱۳۸۲ تا ۱۳۸۴ (2003–2005)',
    },
    shortLabel: {
      en: '2003–2005 · V-Struts & Head Trusses',
      fa: '۱۳۸۲ تا ۱۳۸۴ · دستک‌های پایه و خرپاهای رأس',
    },
    elevationSummary: {
      en: 'Exposed Lobby V-Struts · 247 m to 315 m Steel X-Diagrid Head (60 m Wide)',
      fa: 'دستک‌های V شکل پایه · شبکه خرپاهای بیرونی رأس در تراز ۲۴۷ تا ۳۱۵ متر',
    },
    headline: {
      en: 'Base V-Struts and Exposed 12-Story Steel Head Basket',
      fa: 'دستک‌های V شکل پایه و سبد فولادی ۱۲ طبقه رأس',
    },
    narrative: {
      en: 'From directly beside the exposed diagonal V-struts of the base podium, the camera gazes vertically along the concrete shaft to the 12-story head basket between 247 and 315 meters. Weighing roughly 25,000 tons and spanning 60 meters across, the signature exterior steel X-trusses surround the recessed glass-clad levels.',
      fa: 'از کنار ستون‌های مایل V شکل لابی نیمه‌ساخته پایه، نگاه رو به بالا از امتداد بدنه بتنی به سبد فولادی ۱۲ طبقه رأس در تراز ۲۴۷ تا ۳۱۵ متر می‌رسد؛ جایی که شبکه خرپاهای ضربدری فولادی به عرض ۶۰ متر پیرامون طبقات درونی خودنمایی می‌کند.',
    },
    placard: {
      normBboxXYWH: [0.03, 0.05, 0.26, 0.32],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 7,
    stopId: 'stop_07_2006_antenna_collar',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '46',
    calibratedStep: 7.45,
    dateLabel: {
      en: '2006–2007',
      fa: '۱۳۸۵ تا ۱۳۸۶ (2006–2007)',
    },
    shortLabel: {
      en: '2006–2007 · 315 m Antenna Collar',
      fa: '۱۳۸۵ تا ۱۳۸۶ · غلاف پایه دکل در ۳۱۵ متر',
    },
    elevationSummary: {
      en: '315 m Rooftop Well · Bolted Steel Mast Sleeve · Hemmat–Chamran Interchange',
      fa: 'حوضچه بام ۳۱۵ متر · غلاف پیچ‌شده فولادی دکل · تقاطع همت و چمران',
    },
    headline: {
      en: 'Erecting the 120-Meter Antenna Collar at 315 Meters',
      fa: 'نصب غلاف پایه دکل ۱۲۰ متری در تراز ۳۱۵ متر',
    },
    narrative: {
      en: 'High on the 315-meter concrete roof platform above the sweeping Hemmat and Chamran expressway interchange, steelworkers bolted together the heavy cylindrical steel anchor collar inside an octagonal formwork well—preparing the telescoping launch seat for the 120-meter, 350-ton telecommunications mast.',
      fa: 'بر فراز بام بتنی تراز ۳۱۵ متر مشرف بر گره بزرگراهی همت و چمران، مهندسان غلاف استوانه‌ای سنگین فولادی را با صدها پیچ درون حوضچه هشت‌ضلعی سقف مهار کردند تا سکوی پرتاب دکل ۱۲۰ متری ۳۵۰ تنی آماده شود.',
    },
    placard: {
      normBboxXYWH: [0.03, 0.04, 0.30, 0.28],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 8,
    stopId: 'stop_08_2008_inauguration_alborz',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '38',
    calibratedStep: 11.0,
    dateLabel: {
      en: '7 October 2008',
      fa: '۱۶ مهر ۱۳۸۷ (7 Oct 2008)',
    },
    shortLabel: {
      en: '7 Oct 2008 · 435 m Complete & Alborz',
      fa: '۱۶ مهر ۱۳۸۷ · برج ۴۳۵ متری و البرز',
    },
    elevationSummary: {
      en: '435 m Total Height · 27 m V-Strut Lobby · 276 m Revolving Restaurant · Sky Dome',
      fa: 'ارتفاع ۴۳۵ متر · لابی ستون‌دار ۲۷ متر · رستوران گردان ۲۷۶ متر · گنبد آسمان',
    },
    headline: {
      en: 'Completed 435-Meter Tower Against the Alborz Range',
      fa: 'برج کامل ۴۳۵ متری میلاد در برابر رشته‌کوه البرز',
    },
    narrative: {
      en: 'Inaugurated on 7 October 2008 (16 Mehr 1387 SH), Milad Tower stands 435 meters tall from Gisha Hilltop against the snow-covered Alborz Mountains—uniting its exposed V-strut 6-story base lobby, 315-meter shaft, exposed X-diagrid 12-story head housing the 276 m revolving restaurant and 280 m open terrace, faceted Sky Dome, and 120-meter spire.',
      fa: 'برج میلاد در ۱۶ مهر ۱۳۸۷ (۷ اکتبر ۲۰۰۸) به ارتفاع ۴۳۵ متر بر فراز تپه گیشا و در برابر قله‌های برفی البرز گشایش یافت و لابی ۶ طبقه با دستک‌های V شکل، بدنه ۳۱۵ متری، سبد ۱۲ طبقه با خرپاهای ضربدری، رستوران گردان ۲۷۶ متری، سکوی ۲۸۰ متری، گنبد آسمان و دکل ۱۲۰ متری را به هم پیوند داد.',
    },
    placard: {
      normBboxXYWH: [0.03, 0.05, 0.26, 0.32],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 9,
    stopId: 'stop_09_milad_hero_3d',
    kind: 'hero_3d_model_finale',
    primaryPhotoId: null,
    calibratedStep: 11.0,
    dateLabel: {
      en: '435 m in 3D',
      fa: 'نمای سه‌بعدی ۴۳۵ متری',
    },
    shortLabel: {
      en: '435 m · Complete Tower in 3D',
      fa: '۴۳۵ متر · برج کامل میلاد در ۳بعدی',
    },
    elevationSummary: {
      en: '66 m Mat · 315 m Concrete Shaft · 60 m Head · 435 m Antenna',
      fa: 'فونداسیون ۶۶ متر · بدنه ۳۱۵ متر · رأس ۶۰ متر · قله ۴۳۵ متر',
    },
    headline: {
      en: 'Complete 435-Meter Milad Tower in 3D',
      fa: 'برج کامل ۴۳۵ متری میلاد در فضای سه‌بعدی',
    },
    narrative: {
      en: 'Orbit freely around the completed 435-meter reconstruction above Gisha Hilltop, the four encircling Tehran expressways, and the northern Alborz Mountains, or jump directly to four architectural close-ups from the exposed base V-struts to the Sky Dome and 120-meter antenna mast.',
      fa: 'آزادانه پیرامون بازسازی سه‌بعدی ۴۳۵ متری برج میلاد بر فراز تپه گیشا، چهار بزرگراه پیرامونی تهران و رشته‌کوه البرز بچرخید یا مستقیماً از چهار نمای معماری، از دستک‌های پایه تا گنبد آسمان و دکل ۱۲۰ متری، بازدید کنید.',
    },
    placard: {
      normBboxXYWH: [0.03, 0.08, 0.28, 0.34],
      surfaceTheme: 'light_vellum',
    },
  },
]);

export const HERO_FINALE_PRESETS = Object.freeze([
  {
    presetId: 'overview',
    numeral: '0',
    label: {
      en: 'Full 435 m Elevation',
      fa: 'نمای کامل ۴۳۵ متری',
    },
    caption: {
      en: 'Complete Milad Tower standing above Gisha Hilltop with Tehran expressways and the Alborz Mountains behind.',
      fa: 'نمای کامل برج میلاد بر فراز تپه گیشا با بزرگراه‌های تهران و رشته‌کوه البرز در پس‌زمینه.',
    },
    position: [255.0, 122.0, 565.0],
    target: [0.0, 198.0, 0.0],
    fovYDeg: 44.0,
    enableTurntable: true,
  },
  {
    presetId: 'plinths_shoes',
    numeral: 'I',
    label: {
      en: '6-Story Lobby & V-Struts',
      fa: 'لابی ۶ طبقه و دستک‌های پایه',
    },
    caption: {
      en: '27-meter Iranian geometric lobby pavilion with perimeter diagonal V-struts resting on the 66-meter circular seismic foundation.',
      fa: 'ساختمان لابی ۶ طبقه به ارتفاع ۲۷ متر با ستون‌های مایل V شکل پیرامونی بر روی فونداسیون لرزه‌ای ۶۶ متری.',
    },
    position: [84.0, 22.0, 108.0],
    target: [-4.0, 14.5, 0.0],
    fovYDeg: 38.0,
    enableTurntable: false,
  },
  {
    presetId: 'arch_frieze',
    numeral: 'II',
    label: {
      en: '315 m 8-Lobed Shaft',
      fa: 'بدنه بتنی هشت‌پر ۳۱۵ متری',
    },
    caption: {
      en: 'Slip-formed octagonal concrete core with four projecting wings housing six 7 m/s glass elevators and 1,693 steps.',
      fa: 'هسته بتنی هشت‌ضلعی با چهار بال بیرونی شامل شش آسانسور شیشه‌ای پرسرعت و ۱٬۶۹۳ پله اضطراری.',
    },
    position: [94.0, 152.0, 142.0],
    target: [-5.0, 146.0, 0.0],
    fovYDeg: 38.0,
    enableTurntable: false,
  },
  {
    presetId: 'second_platform',
    numeral: 'III',
    label: {
      en: '12-Story X-Diagrid Head',
      fa: 'سبد خرپایی ۱۲ طبقه رأس برج',
    },
    caption: {
      en: '60-meter-wide exterior steel X-diagrid basket framing the 261 m enclosed gallery, 276 m revolving restaurant, 280 m open deck, and 292 m VIP tier.',
      fa: 'سبد فولادی ۶۰ متری با خرپاهای ضربدری بیرونی دربرگیرنده سکوی ۲۶۱ متر، رستوران گردان ۲۷۶ متر، سکوی ۲۸۰ متر و تراز ۲۹۲ متر.',
    },
    position: [88.0, 266.0, 128.0],
    target: [-4.0, 276.0, 0.0],
    fovYDeg: 38.0,
    enableTurntable: false,
  },
  {
    presetId: 'campanile_phare',
    numeral: 'IV',
    label: {
      en: 'Sky Dome & 435 m Spire',
      fa: 'گنبد آسمان و دکل ۴۳۵ متری',
    },
    caption: {
      en: 'Faceted glass Sky Dome (302–315 m) supporting the 120-meter four-stage steel telecommunications antenna mast.',
      fa: 'گنبد شیشه‌ای آسمان (۳۰۲ تا ۳۱۵ متر) در پایه دکل مخابراتی فولادی ۱۲۰ متری تا ارتفاع ۴۳۵ متر.',
    },
    position: [76.0, 352.0, 124.0],
    target: [-3.0, 366.0, 0.0],
    fovYDeg: 38.0,
    enableTurntable: false,
  },
]);

export function getWalkthroughStop(query) {
  if (query === null || query === undefined) return WALKTHROUGH_STOPS[0];
  if (typeof query === 'number' && Number.isFinite(query)) {
    const clamped = Math.max(1, Math.min(WALKTHROUGH_STOPS.length, Math.round(query)));
    return WALKTHROUGH_STOPS[clamped - 1];
  }
  const key = String(query).trim();
  if (/^\d+$/.test(key)) {
    const idx = Number(key);
    if (idx >= 1 && idx <= WALKTHROUGH_STOPS.length) {
      return WALKTHROUGH_STOPS[idx - 1];
    }
  }
  const byStopId = WALKTHROUGH_STOPS.find((s) => s.stopId === key);
  if (byStopId) return byStopId;

  const photoClean = key.replace(/^photo_|^#/i, '').padStart(2, '0');
  const byPhoto = WALKTHROUGH_STOPS.find((s) => s.primaryPhotoId === photoClean);
  return byPhoto || WALKTHROUGH_STOPS[0];
}

export function getStopForPhotoId(photoId) {
  const clean = String(photoId || '').trim().replace(/^photo_|^#/i, '').padStart(2, '0');
  return WALKTHROUGH_STOPS.find((s) => s.primaryPhotoId === clean) || null;
}
