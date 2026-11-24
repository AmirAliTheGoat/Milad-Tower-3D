/**
 * Chronological Story Walkthrough + Hero 3D Showcase Loop Data (`story_and_archive/walkthrough_data.js`)
 * Grounded strictly in verified Milad Tower (Borj-e Milad, Tehran, 1997–2008) facts and
 * calibrated 3D architectural cameras in `data/catalog/photo_cameras_3d.json`.
 *
 * Key Guarantees:
 *   - 12 stops forming a seamless loop starting and ending on the full 435-meter Tower (`step = 11.0`):
 *       * Stop 1 (`#55`): Master 435 m Architectural Elevation & Cross-Section Blueprint
 *       * Stops 2–11 (`#13, #09, #51, #23, #14, #01, #46, #18, #36, #38`): 10 verified 1997–2008 milestones
 *       * Stop 12 (`photoId: null`): Unobstructed Complete 435 m Milad Tower 3D Showcase (`step = 11.0`)
 *   - Full English (`en`) and Persian / Farsi (`fa`) copy, with whole-meter dimensions and colon-free titles.
 */

export const WALKTHROUGH_STOPS = Object.freeze([
  {
    stopIndex: 1,
    stopId: 'stop_01_design_elevation_1889',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '55',
    calibratedStep: 11.0,
    dateLabel: {
      en: '1994–2008',
      fa: '۱۳۷۳ تا ۱۳۸۷ (1994–2008)',
    },
    shortLabel: {
      en: '1994–2008 · Master Elevation',
      fa: '۱۳۷۳ تا ۱۳۸۷ · نقشه نمای کل برج',
    },
    elevationSummary: {
      en: '66 m Foundation · 315 m Concrete Shaft · 12-Story Head · 435 m Spire',
      fa: 'فونداسیون ۶۶ متر · بدنه ۳۱۵ متر · رأس ۱۲ طبقه · نوک دکل ۴۳۵ متر',
    },
    headline: {
      en: 'Designing the 435-Meter Milad Tower',
      fa: 'طراحی برج ۴۳۵ متری میلاد تهران',
    },
    narrative: {
      en: 'Conceived by Iranian architect Dr. Mohammad Reza Hafezi and built for the Municipality of Tehran under Yadman Sazeh, Milad Tower merges Persian octagonal geometry with modern telecommunications engineering across a 315-meter concrete shaft, a 60-meter-wide 12-story head, and a 120-meter steel antenna reaching 435 meters.',
      fa: 'برج میلاد به طراحی دکتر محمدرضا حافظی و کارفرمایی شهرداری تهران (یادمان سازه)، هندسه هشت‌ضلعی معماری ایرانی را با مهندسی مخابراتی مدرن در بدنه بتنی ۳۱۵ متری، سازه رأس ۱۲ طبقه به قطر ۶۰ متر و دکل فولادی ۱۲۰ متری تا ارتفاع ۴۳۵ متر ترکیب می‌کند.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.08, 0.28, 0.34],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 2,
    stopId: '1887_05_caissons',
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
      en: '14 m Deep Seismic Pit · Gisha Hilltop Bedrock Bed',
      fa: 'گود لرزه‌ای ۱۴ متری · بستر سنگی تپه گیشا',
    },
    headline: {
      en: 'Geotechnical Excavation on Gisha Hilltop',
      fa: 'گودبرداری ژئوتکنیکی بر فراز تپه گیشا',
    },
    narrative: {
      en: 'After evaluating 17 candidate sites across Tehran, planners chose Gisha Hilltop in northwest Tehran for its elevated bedrock between Hemmat, Hakim, Chamran, and Sheikh Fazlollah Nouri Expressways. Crews excavated a 14-meter-deep circular foundation bed designed to anchor a 150,000-ton landmark in an active seismic zone.',
      fa: 'پس از مطالعه ۱۷ نقطه در تهران، تپه گیشا در شمال‌غرب پایتخت به دلیل موقعیت بلند و بستر مناسب در میان بزرگراه‌های همت، حکیم، چمران و شیخ فضل‌الله نوری برگزیده شد. گود دایره‌ای به عمق ۱۴ متر برای مهار سازه‌ای ۱۵۰ هزار تنی در پهنه لرزه‌خیز حفر گردید.',
    },
    placard: {
      normBboxXYWH: [0.03, 0.04, 0.36, 0.28],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 3,
    stopId: '1887_07_base_shoes',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '09',
    calibratedStep: 1.40,
    dateLabel: {
      en: '1999–2000',
      fa: '۱۳۷۸ تا ۱۳۷۹ (1999–2000)',
    },
    shortLabel: {
      en: '1999–2000 · 66 m Foundation Mat',
      fa: '۱۳۷۸ تا ۱۳۷۹ · فونداسیون ۶۶ متری',
    },
    elevationSummary: {
      en: '66 m Circular Concrete Mat · 63,000 m³ Project Concrete',
      fa: 'فونداسیون دایره‌ای ۶۶ متر · ۶۳٬۰۰۰ متر مکعب بتن پروژه',
    },
    headline: {
      en: 'The 66-Meter Reinforced Concrete Foundation Mat',
      fa: 'فونداسیون گسترده بتنی به قطر ۶۶ متر',
    },
    narrative: {
      en: 'General contractor Boland Payeh Co. cast the massive 66-meter-diameter circular reinforced concrete raft and tapered transition pedestal at the pit floor. Across the completed tower, approximately 63,000 cubic meters of high-strength concrete and dense seismic reinforcement carry wind and earthquake forces safely into Gisha Hill.',
      fa: 'پیمانکار عمومی، شرکت بلندپایه، پی گسترده دایره‌ای بتنی به قطر ۶۶ متر و پایه انتقالی شیب‌دار را در کف گود بتن‌ریزی کرد. در کل برج حدود ۶۳٬۰۰۰ متر مکعب بتن مقاوم و شبکه آرماتوربندی سنگین نیروهای باد و زلزله را به تپه گیشا منتقل می‌کند.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.04, 0.36, 0.28],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 4,
    stopId: '1888_01_14_lattice_closeup',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '51',
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
      en: '8-Lobed Octagonal Core · 4 Trapezoidal Wings · 1,693 Steps',
      fa: 'هسته هشت‌پر بتنی · ۴ بال ذوزنقه‌ای · ۱٬۶۹۳ پله اضطراری',
    },
    headline: {
      en: 'Slip-Forming the 8-Lobed Concrete Shaft',
      fa: 'اجرای قالب لغزنده بدنه بتنی هشت‌پر',
    },
    narrative: {
      en: 'From 2000 onward, hydraulic slip-forming equipment climbed continuously upward to cast the octagonal central shaft and four projecting trapezoidal wings. Three wings house six high-speed panoramic glass elevator shafts, while the fourth wing encloses an emergency concrete stairwell of 1,693 steps.',
      fa: 'از سال ۱۳۷۹، سامانه قالب لغزنده هیدرولیکی به صورت پیوسته بالا رفت و هسته مرکزی هشت‌ضلعی به همراه چهار بال ذوزنقه‌ای را اجرا کرد. سه بال محل حرکت شش آسانسور شیشه‌ای پرسرعت است و بال چهارم راهپله اضطراری با ۱٬۶۹۳ پله را در خود جای می‌دهد.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.06, 0.34, 0.30],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 5,
    stopId: '1888_01_07_first_stage_timelapse_1',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '23',
    calibratedStep: 4.75,
    dateLabel: {
      en: '2002–2003',
      fa: '۱۳۸۱ تا ۱۳۸۲ (2002–2003)',
    },
    shortLabel: {
      en: '2002–2003 · 315 m Shaft & Lobby',
      fa: '۱۳۸۱ تا ۱۳۸۲ · بدنه ۳۱۵ متری و لابی',
    },
    elevationSummary: {
      en: '315 m Concrete Shaft Top-Out · 27 m 6-Story Base Lobby',
      fa: 'تکمیل بدنه بتنی ۳۱۵ متر · ساختمان لابی ۶ طبقه ۲۷ متری',
    },
    headline: {
      en: '315-Meter Shaft Top-Out and 6-Story Base Lobby',
      fa: 'تکمیل بدنه ۳۱۵ متری و لابی ۶ طبقه پایه',
    },
    narrative: {
      en: 'By 2003 the slip-formed concrete shaft reached its full 315-meter height, establishing the vertical structural spine of Tehran’s skyline. Surrounding its base rose the 27-meter-high, 6-story travertine and glass lobby pavilion housing entrance halls, ticket concourses, commercial galleries, and Iranian geometric arches.',
      fa: 'تا سال ۱۳۸۲ بدنه بتنی به ارتفاع نهایی ۳۱۵ متر رسید و ستون فقرات سازه‌ای برج را بر فراز تهران تثبیت کرد. در پیرامون پایه آن، ساختمان لابی ۶ طبقه به ارتفاع ۲۷ متر با سنگ تراورتن، شیشه و طاق‌های هندسی ایرانی برای پذیرش و نمایشگاه‌ها شکل گرفت.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.05, 0.34, 0.30],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 6,
    stopId: '1888_06_12_second_stage_timelapse_2',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '14',
    calibratedStep: 6.15,
    dateLabel: {
      en: '2003–2005',
      fa: '۱۳۸۲ تا ۱۳۸۴ (2003–2005)',
    },
    shortLabel: {
      en: '2003–2005 · 12-Story Steel Head',
      fa: '۱۳۸۲ تا ۱۳۸۴ · نصب سازه فولادی رأس',
    },
    elevationSummary: {
      en: '247 m to 315 m Elevation · ~2,000 Tons Structural Steel · 12,000 m²',
      fa: 'تراز ۲۴۷ تا ۳۱۵ متر · حدود ۲٬۰۰۰ تن فولاد · ۱۲٬۰۰۰ متر مربع زیربنا',
    },
    headline: {
      en: 'Heavy-Lift Steel Assembly of the 12-Story Head',
      fa: 'نصب سنگین سازه فولادی ۱۲ طبقه رأس برج',
    },
    narrative: {
      en: 'Between 2003 and 2005, twin climbing cranes hoisted roughly 2,000 tons of fabricated steel trusses into position around the upper shaft from 247 to 315 meters. The cantilevered 12-story head structure encloses 12,000 square meters of floor area—making it one of the largest tower heads ever constructed.',
      fa: 'میان سال‌های ۱۳۸۲ تا ۱۳۸۴، دو جرثقیل بالارونده حدود ۲٬۰۰۰ تن خرپای فولادی پیش‌ساخته را در تراز ۲۴۷ تا ۳۱۵ متر پیرامون بدنه بتنی نصب کردند. این سازه رأس ۱۲ طبقه با ۱۲٬۰۰۰ متر مربع زیربنا یکی از بزرگ‌ترین رأس‌های برج‌های مخابراتی جهان است.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.05, 0.32, 0.34],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 7,
    stopId: '1888_09_14_self_supporting_timelapse_3',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '01',
    calibratedStep: 7.05,
    dateLabel: {
      en: '2005–2006',
      fa: '۱۳۸۴ تا ۱۳۸۵ (2005–2006)',
    },
    shortLabel: {
      en: '2005–2006 · 60 m Basket Facade',
      fa: '۱۳۸۴ تا ۱۳۸۵ · نمای ۶۰ متری رأس',
    },
    elevationSummary: {
      en: '60 m Maximum Head Width at 280 m · Muqarnas-Inspired Geometry',
      fa: 'بیشینه قطر ۶۰ متر در تراز ۲۸۰ متر · هندسه الهام‌گرفته از مقرنس',
    },
    headline: {
      en: 'Iranian Geometric Basket Cladding at 60-Meter Span',
      fa: 'نمای سبد هندسی ایرانی با قطر ۶۰ متر',
    },
    narrative: {
      en: 'Inspired by classical Persian muqarnas corbeling and eight-fold symmetry, the steel basket flares gracefully from the shaft collar to a 60-meter maximum width at 280 meters before stepping inward toward its summit. Metallic architectural cladding and reflective turquoise-tinted curtain glass seal all 12 stories.',
      fa: 'با الهام از مقرنس‌کاری کلاسیک ایرانی و تقارن هشت‌گانه، سبد فولادی رأس از یقه بدنه به بیرون باز شده و در تراز ۲۸۰ متر به بیشینه عرض ۶۰ متر می‌رسد. پنل‌های فلزی معماری و شیشه‌های کرتین‌وال فیروزه‌ای‌فام، هر ۱۲ طبقه را در بر می‌گیرند.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.05, 0.32, 0.36],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 8,
    stopId: '1888_12_26_winter_ascent_timelapse_4',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '46',
    calibratedStep: 8.85,
    dateLabel: {
      en: '2006–2007',
      fa: '۱۳۸۵ تا ۱۳۸۶ (2006–2007)',
    },
    shortLabel: {
      en: '2006–2007 · 120 m Antenna Mast',
      fa: '۱۳۸۵ تا ۱۳۸۶ · دکل ۱۲۰ متری',
    },
    elevationSummary: {
      en: '315 m to 435 m Spire · 4 Telescopic Steel Stages · 350 Tons',
      fa: 'تراز ۳۱۵ تا ۴۳۵ متر · ۴ بخش تلسکوپی فولادی · وزن ۳۵۰ تن',
    },
    headline: {
      en: 'Four-Stage Telescopic Lift of the 120-Meter Antenna Mast',
      fa: 'بالابری تلسکوپی چهارمرحله‌ای دکل ۱۲۰ متری',
    },
    narrative: {
      en: 'Between 2006 and 2007, engineers erected the 120-meter, 350-ton steel telecommunications mast in four telescoping sections rising from 315 meters to the 435-meter tip. The mast carries national television and digital radio transmitters, microwave relay dishes, aviation beacons, and weather sensors.',
      fa: 'در سال‌های ۱۳۸۵ و ۱۳۸۶، دکل مخابراتی فولادی ۱۲۰ متری با وزن ۳۵۰ تن در چهار بخش تلسکوپی از تراز ۳۱۵ متر تا قله ۴۳۵ متری نصب شد. این دکل فرستنده‌های رادیویی، تلویزیونی، لینک‌های مایکروویو و سامانه‌های هواشناسی را پشتیبانی می‌کند.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.05, 0.32, 0.38],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 9,
    stopId: '1889_05_completed_axial_timelapse_5',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '18',
    calibratedStep: 9.85,
    dateLabel: {
      en: '2007–2008',
      fa: '۱۳۸۶ تا ۱۳۸۷ (2007–2008)',
    },
    shortLabel: {
      en: '2007–2008 · Observation & Dining',
      fa: '۱۳۸۶ تا ۱۳۸۷ · رستوران و سکوهای دید',
    },
    elevationSummary: {
      en: '276 m Revolving Restaurant · 280 m Open Deck · 292 m Gallery',
      fa: 'رستوران گردان ۲۷۶ متر · سکوی باز ۲۸۰ متر · گالری بسته ۲۹۲ متر',
    },
    headline: {
      en: 'Revolving Restaurant and Panoramic Observation Decks',
      fa: 'رستوران گردان و سکوهای دید پانورامای تهران',
    },
    narrative: {
      en: 'Interior completion unlocked the public destination floors high above Tehran: the 276-meter revolving restaurant completing one full 360-degree rotation per hour, the 280-meter open-air observation deck overlooking the entire metropolis, and the 292-meter enclosed panoramic gallery and museum.',
      fa: 'تکمیل فضاهای داخلی طبقات عمومی برج را آماده بهره‌برداری کرد: رستوران گردان در تراز ۲۷۶ متر با یک دور چرخش ۳۶۰ درجه در ساعت، سکوی دید باز در تراز ۲۸۰ متر با چشم‌انداز کامل پایتخت و گالری دید بسته و موزه در تراز ۲۹۲ متر.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.05, 0.34, 0.36],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 10,
    stopId: '1889_summer_under_the_arch',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '36',
    calibratedStep: 10.60,
    dateLabel: {
      en: '2008',
      fa: '۱۳۸۷ (2008)',
    },
    shortLabel: {
      en: '2008 · Sky Dome & 7 m/s Lifts',
      fa: '۱۳۸۷ · گنبد آسمان و آسانسورها',
    },
    elevationSummary: {
      en: '302 m–315 m Glass Sky Dome · 6 Panoramic Elevators at 7 m/s',
      fa: 'گنبد شیشه‌ای ۳۰۲ تا ۳۱۵ متر · ۶ آسانسور پرسرعت ۷ متر بر ثانیه',
    },
    headline: {
      en: 'Glass Sky Dome and 7 m/s Panoramic Elevators',
      fa: 'گنبد آسمان شیشه‌ای و آسانسورهای ۷ متر بر ثانیه',
    },
    narrative: {
      en: 'Crowning the 12th level between 302 and 315 meters, the faceted glass-and-steel Sky Dome opens straight upward beneath the mast root. In the three exterior glazed shaft wings, six high-speed panoramic elevators traveling at 7 meters per second transport visitors from base to head in about 45 seconds.',
      fa: 'در طبقه دوازدهم میان تراز ۳۰۲ تا ۳۱۵ متر، گنبد آسمان شیشه‌ای-فولادی تاج سازه رأس را شکل می‌دهد. در سه بال شیشه‌ای بدنه، شش آسانسور پانورامای پرسرعت با سرعت ۷ متر بر ثانیه مسافران را در حدود ۴۵ ثانیه از لابی به رأس برج می‌رسانند.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.06, 0.34, 0.34],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 11,
    stopId: '1889_summer_coutan_basin',
    kind: 'calibrated_archival_photo',
    primaryPhotoId: '38',
    calibratedStep: 11.0,
    dateLabel: {
      en: '7 October 2008',
      fa: '۱۶ مهر ۱۳۸۷ (7 Oct 2008)',
    },
    shortLabel: {
      en: '7 Oct 2008 · Inauguration',
      fa: '۱۶ مهر ۱۳۸۷ · گشایش رسمی',
    },
    elevationSummary: {
      en: '435 m Total Height · Iran’s Tallest Structure · Alborz Backdrop',
      fa: 'ارتفاع کل ۴۳۵ متر · بلندترین سازه ایران · چشم‌انداز البرز',
    },
    headline: {
      en: 'Official Inauguration Over Tehran and the Alborz Horizon',
      fa: 'گشایش رسمی بر فراز تهران و افق البرز',
    },
    narrative: {
      en: 'Following eleven years of engineering and construction, Milad Tower officially opened on 7 October 2008 (16 Mehr 1387 SH) as the centerpiece of the Tehran International Trade and Convention Center. Rising 435 meters above Gisha Hilltop, it stands as Iran’s tallest structure framed against the Alborz Mountains.',
      fa: 'پس از یازده سال مهندسی و ساخت، برج میلاد در ۱۶ مهر ۱۳۸۷ (۷ اکتبر ۲۰۰۸) به عنوان کانون مرکز ارتباطات بین‌المللی تهران رسماً گشایش یافت و با ارتفاع ۴۳۵ متر بر فراز تپه گیشا به بلندترین سازه ایران در پس‌زمینه رشته‌کوه البرز تبدیل شد.',
    },
    placard: {
      normBboxXYWH: [0.04, 0.06, 0.34, 0.34],
      surfaceTheme: 'light_vellum',
    },
  },
  {
    stopIndex: 12,
    stopId: '1889_hero_3d_showcase_finale',
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
      en: 'Orbit freely around the completed 435-meter reconstruction above Gisha Hilltop, the four encircling Tehran expressways, and the northern Alborz Mountains, or jump directly to four structural close-ups from the 6-story travertine lobby to the Sky Dome and 120-meter antenna mast.',
      fa: 'آزادانه پیرامون بازسازی سه‌بعدی ۴۳۵ متری برج میلاد بر فراز تپه گیشا، چهار بزرگراه پیرامونی تهران و رشته‌کوه البرز بچرخید یا مستقیماً از چهار نمای معماری، از لابی ۶ طبقه تا گنبد آسمان و دکل ۱۲۰ متری، بازدید کنید.',
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
      en: '6-Story Lobby & 66 m Mat',
      fa: 'لابی ۶ طبقه و پی ۶۶ متری',
    },
    caption: {
      en: '27-meter Iranian geometric travertine lobby pavilion resting on the 66-meter circular seismic foundation mat.',
      fa: 'ساختمان لابی ۶ طبقه به ارتفاع ۲۷ متر با هندسه ایرانی بر روی فونداسیون لرزه‌ای ۶۶ متری.',
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
      en: '12-Story Head at 280 m',
      fa: 'سازه رأس ۱۲ طبقه در ۲۸۰ متر',
    },
    caption: {
      en: '60-meter-wide cantilevered steel basket housing the 276 m revolving restaurant, 280 m open deck, and 292 m gallery.',
      fa: 'سبد فولادی به قطر ۶۰ متر شامل رستوران گردان ۲۷۶ متر، سکوی دید باز ۲۸۰ متر و گالری ۲۹۲ متر.',
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

export const LEGACY_CHAPTER_TO_STOP_MAP = Object.freeze({
  ch1_vision: 1,
  stop_01_design_elevation_1889: 1,
  stop_12_full_elevation_1889: 1,
  ch1_foundations: 2,
  ch2_foundations: 2,
  ch2_piers: 3,
  ch3_first_platform: 4,
  ch3_first_stage: 5,
  ch4_second_stage: 6,
  ch4_second_platform: 7,
  ch5_summit_ascent: 8,
  ch5_upper_shaft: 8,
  ch6_exposition: 9,
  ch6_inauguration: 11,
  ch7_legacy: 12,
  ch7_hero_finale: 12,
  '1889_hero_3d_showcase_finale': 12,
});

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
  if (LEGACY_CHAPTER_TO_STOP_MAP[key]) {
    return WALKTHROUGH_STOPS[LEGACY_CHAPTER_TO_STOP_MAP[key] - 1];
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
