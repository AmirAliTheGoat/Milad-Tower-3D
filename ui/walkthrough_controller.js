/**
 * Single Chronological Playthrough Controller & Exhibition Bar (`museum_v2` Stage 6)
 *
 * Consolidates all competing legacy Stage 3 playback/chapter/portal/mood controls
 * into strictly ONE chronological visitor playthrough mechanism (`#exhibition-walkthrough-bar`).
 *
 * Stage 6 Guarantees:
 *   1. Post-Load Full 3D Intro + 'Explore' Handoff: Supports `landingMode` holding the
 *      complete 3D Tower (`step = 11.0`, `plateOpacity = 0.0`, `HERO_FINALE_CAMERA`)
 *      until the visitor clicks `Explore` / `کاوش` (with automatic bypass for URL
 *      deep-links and `enterDeterministicMode`).
 *   2. 9-Stop Chronological Loop (`Stops 1..8 = #13..#38` -> `Stop 9 = 3D`):
 *      Starts at Gisha Hilltop excavation (`#13`), builds from `0.50` to `11.0`
 *      through all 8 verified construction & completion photographs, culminates in the
 *      unobstructed 3D Tower Showcase (`Stop 9`), and loops seamlessly back to `Stop 1` (`#13`).
 *   3. Streamlined Neutral Bar:
 *        - Date-only readout (`#walkthrough-stop-date` — ZERO step fraction counter)
 *        - Date + literal colon-free title in detent tooltips & ARIA labels
 *        - Whole-meter dimensions (`0` decimal meter heights)
 *        - Pure achromatic black / white / grey UI (`chroma = 0`)
 *   4. 100% Deterministic JS Virtual Clock (`update(dtSec)`): Bounded 1-pass completion
 *      when `_deterministicMode === true` for headless video recording.
 */

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstepQuintic(t) {
  const x = clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function smoothstepCubic(t) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function normalizeLang(raw) {
  const s = String(raw || '').trim().toLowerCase();
  return s.startsWith('fa') || s === 'persian' || s === 'farsi' ? 'fa' : 'en';
}

function stripColonsFromTitle(raw) {
  const str = String(raw || '').trim();
  if (!str.includes(':')) return str;
  const parts = str
    .split(':')
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 1) return str.replace(/:/g, '').trim();
  const chosen = parts[parts.length - 1];
  return chosen.charAt(0).toUpperCase() + chosen.slice(1);
}

/**
 * Exact calibrated `recommended_global_step` from `data/catalog/photo_cameras_3d.json`
 * so girders & falsework match every glass plate.
 */
export const EXACT_PNP_CALIBRATED_STEPS = Object.freeze({
  '13': 0.50,
  '09': 1.05,
  '51': 1.45,
  '23': 3.15,
  '14': 4.75,
  '01': 6.18,
  '46': 7.45,
  '38': 11.0,
});

/**
 * Mathematically verified Stop 9 Hero 3D Camera Pose
 * framing the full 435 m Milad Tower above Gisha Hilltop against the northern Alborz Mountains.
 */
export const HERO_FINALE_CAMERA = Object.freeze({
  position: Object.freeze([255.0, 122.0, 565.0]),
  target: Object.freeze([0.0, 198.0, 0.0]),
  fov: 44.0,
});

export const HERO_CRAFTSMANSHIP_PRESETS = Object.freeze([
  {
    id: 'overview',
    labelEn: 'Overview — Full 435 m Elevation',
    labelFa: 'نمای کلی — ارتفاع کامل ۴۳۵ متر',
    position: [255.0, 122.0, 565.0],
    target: [0.0, 198.0, 0.0],
    fov: 44.0,
  },
  {
    id: 'plinths_shoes',
    labelEn: 'Detail I — 6-Story Lobby & V-Struts',
    labelFa: 'جزئیات I — لابی ۶ طبقه و دستک‌های پایه',
    position: [84.0, 22.0, 108.0],
    target: [-4.0, 14.5, 0.0],
    fov: 38.0,
  },
  {
    id: 'arch_frieze',
    labelEn: 'Detail II — 315 m 8-Lobed Concrete Shaft',
    labelFa: 'جزئیات II — بدنه بتنی هشت‌پر ۳۱۵ متری',
    position: [94.0, 152.0, 142.0],
    target: [-5.0, 146.0, 0.0],
    fov: 38.0,
  },
  {
    id: 'second_platform',
    labelEn: 'Detail III — 12-Story X-Diagrid Head',
    labelFa: 'جزئیات III — سبد خرپایی ۱۲ طبقه رأس برج',
    position: [88.0, 266.0, 128.0],
    target: [-4.0, 276.0, 0.0],
    fov: 38.0,
  },
  {
    id: 'campanile_phare',
    labelEn: 'Detail IV — Sky Dome & 435 m Antenna Mast',
    labelFa: 'جزئیات IV — گنبد آسمان و دکل ۴۳۵ متری',
    position: [76.0, 352.0, 124.0],
    target: [-3.0, 366.0, 0.0],
    fov: 38.0,
  },
]);

/**
 * Authoritative 9-Stop Exhibition Sequence
 * Stops 1..8 = `#13..#38` Real Archival Construction & Completion Photos -> Stop 9 = Full 3D Tower.
 * Concise, literal stop titles with zero colons (`:`) and rounded whole-meter dimensions.
 */
export const CANONICAL_WALKTHROUGH_STOPS = Object.freeze([
  {
    stopNumber: 1,
    stopId: 'stop_01_1997_gisha_excavation',
    kind: 'calibrated_archival_photo',
    photoId: '13',
    calibratedStep: 0.50,
    flightDurationSec: 2.9,
    dateShortEn: '1997–1999',
    dateShortFa: '۱۳۷۶ تا ۱۳۷۸',
    shortTitleEn: 'Geotechnical Excavation on Gisha Hilltop',
    shortTitleFa: 'گودبرداری ژئوتکنیکی بر فراز تپه گیشا',
    headlineEn: 'Geotechnical Excavation on Gisha Hilltop',
    headlineFa: 'گودبرداری ژئوتکنیکی بر فراز تپه گیشا',
    placardBbox: [0.03, 0.03, 0.34, 0.28],
    placardSurface: 'light',
  },
  {
    stopNumber: 2,
    stopId: 'stop_02_1999_foundation_mat',
    kind: 'calibrated_archival_photo',
    photoId: '09',
    calibratedStep: 1.05,
    flightDurationSec: 2.7,
    dateShortEn: '1999–2000',
    dateShortFa: '۱۳۷۸ تا ۱۳۷۹',
    shortTitleEn: 'The 66-Meter Concrete Foundation Mat',
    shortTitleFa: 'آرماتوربندی فونداسیون ۶۶ متری و جرثقیل مرکزی',
    headlineEn: 'The 66-Meter Reinforced Concrete Foundation Mat',
    headlineFa: 'آرماتوربندی فونداسیون ۶۶ متری و جرثقیل مرکزی',
    placardBbox: [0.62, 0.03, 0.35, 0.26],
    placardSurface: 'light',
  },
  {
    stopNumber: 3,
    stopId: 'stop_03_2000_transition_pedestal',
    kind: 'calibrated_archival_photo',
    photoId: '51',
    calibratedStep: 1.45,
    flightDurationSec: 3.4,
    dateShortEn: '2000',
    dateShortFa: '۱۳۷۹',
    shortTitleEn: 'Conical Transition Pedestal and Radial Buttresses',
    shortTitleFa: 'سازه انتقالی مخروطی و پشت‌بندهای شعاعی برشی',
    headlineEn: 'Conical Transition Pedestal and Radial Shear Buttresses',
    headlineFa: 'سازه انتقالی مخروطی و پشت‌بندهای شعاعی برشی',
    placardBbox: [0.62, 0.03, 0.35, 0.26],
    placardSurface: 'light',
  },
  {
    stopNumber: 4,
    stopId: 'stop_04_2000_slipform_shaft',
    kind: 'calibrated_archival_photo',
    photoId: '23',
    calibratedStep: 3.15,
    flightDurationSec: 3.1,
    dateShortEn: '2000–2002',
    dateShortFa: '۱۳۷۹ تا ۱۳۸۱',
    shortTitleEn: 'Slip-Forming the 8-Lobed Concrete Shaft',
    shortTitleFa: 'اجرای قالب لغزنده بدنه بتنی هشت‌پر',
    headlineEn: 'Slip-Forming the 8-Lobed Concrete Shaft',
    headlineFa: 'اجرای قالب لغزنده بدنه بتنی هشت‌پر',
    placardBbox: [0.03, 0.05, 0.26, 0.32],
    placardSurface: 'light',
  },
  {
    stopNumber: 5,
    stopId: 'stop_05_2003_shaft_topout',
    kind: 'calibrated_archival_photo',
    photoId: '14',
    calibratedStep: 4.75,
    flightDurationSec: 3.4,
    dateShortEn: '2003',
    dateShortFa: '۱۳۸۲',
    shortTitleEn: '315-Meter Concrete Shaft Top-Out Above Gisha',
    shortTitleFa: 'تکمیل بدنه بتنی ۳۱۵ متری بر فراز گیشا',
    headlineEn: '315-Meter Concrete Shaft Top-Out Above Gisha',
    headlineFa: 'تکمیل بدنه بتنی ۳۱۵ متری بر فراز گیشا',
    placardBbox: [0.03, 0.05, 0.26, 0.32],
    placardSurface: 'light',
  },
  {
    stopNumber: 6,
    stopId: 'stop_06_2003_head_steel_struts',
    kind: 'calibrated_archival_photo',
    photoId: '01',
    calibratedStep: 6.18,
    flightDurationSec: 3.4,
    dateShortEn: '2003–2005',
    dateShortFa: '۱۳۸۲ تا ۱۳۸۴',
    shortTitleEn: 'Base V-Struts and 12-Story Steel Head Basket',
    shortTitleFa: 'دستک‌های V شکل پایه و سبد فولادی ۱۲ طبقه رأس',
    headlineEn: 'Base V-Struts and Exposed 12-Story Steel Head Basket',
    headlineFa: 'دستک‌های V شکل پایه و سبد فولادی ۱۲ طبقه رأس',
    placardBbox: [0.03, 0.05, 0.26, 0.32],
    placardSurface: 'light',
  },
  {
    stopNumber: 7,
    stopId: 'stop_07_2006_antenna_collar',
    kind: 'calibrated_archival_photo',
    photoId: '46',
    calibratedStep: 7.45,
    flightDurationSec: 3.3,
    dateShortEn: '2006–2007',
    dateShortFa: '۱۳۸۵ تا ۱۳۸۶',
    shortTitleEn: 'Erecting the 120-Meter Antenna Collar at 315 m',
    shortTitleFa: 'نصب غلاف پایه دکل ۱۲۰ متری در تراز ۳۱۵ متر',
    headlineEn: 'Erecting the 120-Meter Antenna Collar at 315 Meters',
    headlineFa: 'نصب غلاف پایه دکل ۱۲۰ متری در تراز ۳۱۵ متر',
    placardBbox: [0.03, 0.04, 0.30, 0.28],
    placardSurface: 'light',
  },
  {
    stopNumber: 8,
    stopId: 'stop_08_2008_inauguration_alborz',
    kind: 'calibrated_archival_photo',
    photoId: '38',
    calibratedStep: 11.00,
    flightDurationSec: 3.4,
    dateShortEn: '7 October 2008',
    dateShortFa: '۱۶ مهر ۱۳۸۷',
    shortTitleEn: 'Completed 435-Meter Tower Against Alborz Range',
    shortTitleFa: 'برج کامل ۴۳۵ متری میلاد در برابر رشته‌کوه البرز',
    headlineEn: 'Completed 435-Meter Tower Against the Alborz Range',
    headlineFa: 'برج کامل ۴۳۵ متری میلاد در برابر رشته‌کوه البرز',
    placardBbox: [0.03, 0.05, 0.26, 0.32],
    placardSurface: 'light',
  },
  {
    stopNumber: 9,
    stopId: 'stop_09_milad_hero_3d',
    kind: 'hero_3d_model_finale',
    photoId: null,
    calibratedStep: 11.00,
    flightDurationSec: 2.8,
    dateShortEn: '435 m in 3D',
    dateShortFa: '۴۳۵ متر در ۳بعدی',
    shortTitleEn: 'Complete 435-Meter Milad Tower in 3D',
    shortTitleFa: 'برج کامل ۴۳۵ متری میلاد در فضای سه‌بعدی',
    headlineEn: 'Complete 435-Meter Milad Tower in 3D',
    headlineFa: 'برج کامل ۴۳۵ متری میلاد در فضای سه‌بعدی',
    placardBbox: [0.03, 0.08, 0.28, 0.34],
    placardSurface: 'light',
  },
]);

const WALKTHROUGH_STRINGS = {
  en: {
    regionAria: 'Chronological Milad Tower exhibition walkthrough',
    prevAria: 'Previous exhibition stop',
    nextAria: 'Next exhibition stop',
    playAria: 'Play exhibition from master blueprint to completed 435-meter tower',
    pauseAria: 'Pause chronological exhibition',
    playLabel: 'Play',
    pauseLabel: 'Pause',
    playHint: 'Press Play to watch the tower build, or pick a date along the timeline',
    playHintDismissAria: 'Dismiss playback hint',
    railAria: 'Exhibition sequence from architectural elevation to completed 435-meter Milad Tower',
    reveal3dLabel: 'Reveal 3D',
    reveal3dAria: 'Reveal aligned 3D Milad Tower structure behind this archival plate',
    showPlateLabel: 'Show Plate',
    showPlateAria: 'Restore full architectural plate',
    resetHeroLabel: 'Reset View',
    resetHeroAria: 'Return to full 435-meter 3D monument view',
  },
  fa: {
    regionAria: 'سیر زمان‌بندی ساخت برج میلاد تهران',
    prevAria: 'ایستگاه قبلی نمایشگاه',
    nextAria: 'ایستگاه بعدی نمایشگاه',
    playAria: 'پخش خودکار از نقشه معماری تا برج کامل ۴۳۵ متری',
    pauseAria: 'توقف پخش خودکار نمایشگاه',
    playLabel: 'پخش',
    pauseLabel: 'توقف',
    playHint: 'برای تماشای خودکار ساخت برج، دکمه پخش را بزنید یا روی نوار زمان کلیک کنید',
    playHintDismissAria: 'بستن راهنمای پخش',
    railAria: 'نوار زمان ساخت برج میلاد از طراحی تا گشایش ۴۳۵ متری',
    reveal3dLabel: 'نمای سه‌بعدی',
    reveal3dAria: 'نمایش مدل سه‌بعدی هم‌تراز در پس این نقشه آرشیوی',
    showPlateLabel: 'نمایش نقشه',
    showPlateAria: 'بازگردانی تصویر آرشیوی کامل',
    resetHeroLabel: 'بازنشانی نما',
    resetHeroAria: 'بازگشت به نمای کامل ۴۳۵ متری برج میلاد',
  },
};

const BEAT_A_YIELD_SEC = 1.1;
const BEAT_A_HERO_YIELD_SEC = 0.45;
const BEAT_C_DISSOLVE_SEC = 1.3;
const BEAT_D_HOLD_SEC = 2.6;
const FINALE_SHOWCASE_HOLD_SEC = 4.0;
const REVEAL_PEEK_OPACITY = 0.12;
const REVEAL_CROSSFADE_SEC = 0.65;

function normalizeStopsList(customStops) {
  if (!Array.isArray(customStops) || customStops.length === 0) {
    return CANONICAL_WALKTHROUGH_STOPS.map((s) => ({ ...s }));
  }
  return customStops.map((raw, idx) => {
    const fallback =
      CANONICAL_WALKTHROUGH_STOPS[idx] ||
      CANONICAL_WALKTHROUGH_STOPS[CANONICAL_WALKTHROUGH_STOPS.length - 1];
    const hasExplicitPhotoField =
      raw.photoId !== undefined ||
      raw.primaryPhotoId !== undefined ||
      raw.primary_photo_id !== undefined;
    const rawPhoto = hasExplicitPhotoField
      ? (raw.photoId ?? raw.primaryPhotoId ?? raw.primary_photo_id)
      : fallback.photoId ?? null;
    const photoId = rawPhoto ? String(rawPhoto).replace(/^#|^photo_/i, '').padStart(2, '0') : null;
    const calibratedStep = Number.isFinite(Number(raw.calibratedStep))
      ? Number(raw.calibratedStep)
      : photoId && EXACT_PNP_CALIBRATED_STEPS[photoId] !== undefined
      ? EXACT_PNP_CALIBRATED_STEPS[photoId]
      : fallback.calibratedStep;

    const rawShortEn =
      raw.shortTitleEn ||
      raw.headline?.en ||
      raw.headlineEn ||
      raw.shortLabel?.en ||
      raw.headline_en ||
      fallback.shortTitleEn;
    const rawShortFa =
      raw.shortTitleFa ||
      raw.headline?.fa ||
      raw.headlineFa ||
      raw.shortLabel?.fa ||
      raw.headline_fa ||
      raw.shortTitleFr ||
      fallback.shortTitleFa;
    const rawHeadEn = raw.headlineEn || raw.headline?.en || raw.headline_en || fallback.headlineEn;
    const rawHeadFa =
      raw.headlineFa ||
      raw.headline?.fa ||
      raw.headline_fa ||
      raw.headlineFr ||
      fallback.headlineFa;

    return {
      ...fallback,
      ...raw,
      stopNumber: idx + 1,
      stopId: raw.stopId || raw.stop_id || fallback.stopId,
      kind: raw.kind || (photoId ? 'calibrated_archival_photo' : 'hero_3d_model_finale'),
      photoId,
      calibratedStep,
      dateShortEn:
        raw.dateShortEn || raw.dateLabel?.en || raw.date_label_en || fallback.dateShortEn,
      dateShortFa:
        raw.dateShortFa ||
        raw.dateLabel?.fa ||
        raw.date_label_fa ||
        raw.dateShortFr ||
        fallback.dateShortFa,
      shortTitleEn: stripColonsFromTitle(rawShortEn),
      shortTitleFa: stripColonsFromTitle(rawShortFa),
      headlineEn: stripColonsFromTitle(rawHeadEn),
      headlineFa: stripColonsFromTitle(rawHeadFa),
    };
  });
}

export class WalkthroughController {
  constructor({
    container = null,
    parent = null,
    stops = null,
    lang = 'fa',
    initialStopIndex = 0,
    speedMultiplier = 1.0,
    bindKeyboard = true,
    landingMode = false,
    appAdapter = null,
    onStopChange = null,
    onStepChange = null,
    onPortalStateChange = null,
    onHeroFinaleActivate = null,
    onPlacardVisibilityChange = null,
    onPlayStateChange = null,
    onReveal3DChange = null,
    onLandingModeChange = null,
    onExploreRequest = null,
  } = {}) {
    this._stops = normalizeStopsList(stops);
    this._lang = normalizeLang(lang);
    this._speedMultiplier = clamp(Number(speedMultiplier) || 1.0, 0.1, 8.0);
    this._app = appAdapter || null;

    this.onStopChange = typeof onStopChange === 'function' ? onStopChange : null;
    this.onStepChange = typeof onStepChange === 'function' ? onStepChange : null;
    this.onPortalStateChange = typeof onPortalStateChange === 'function' ? onPortalStateChange : null;
    this.onHeroFinaleActivate = typeof onHeroFinaleActivate === 'function' ? onHeroFinaleActivate : null;
    this.onPlacardVisibilityChange =
      typeof onPlacardVisibilityChange === 'function' ? onPlacardVisibilityChange : null;
    this.onPlayStateChange = typeof onPlayStateChange === 'function' ? onPlayStateChange : null;
    this.onReveal3DChange = typeof onReveal3DChange === 'function' ? onReveal3DChange : null;
    this.onLandingModeChange = typeof onLandingModeChange === 'function' ? onLandingModeChange : null;
    this.onExploreRequest = typeof onExploreRequest === 'function' ? onExploreRequest : null;

    this._landingMode = Boolean(landingMode);
    this._stopIndex = clamp(Number(initialStopIndex) || 0, 0, this._stops.length - 1);
    this._tau = this._stopIndex;
    this._step = this._landingMode ? 11.0 : this._stops[this._stopIndex].calibratedStep;
    this._isPlaying = false;
    this._isFinished = false;

    // 4-Beat state machine (`idle` | `hold_d` | `beat_a_yield` | `beat_b_flight` | `beat_c_lock` | `finale_orbit`)
    this._beat = 'idle';
    this._beatTimer = 0;
    this._beatDuration = 0;
    this._fromStopIndex = this._stopIndex;
    this._toStopIndex = this._stopIndex;

    // Deterministic plate & placard opacities (JS-driven, zero CSS transition dependence)
    this._plateOpacity =
      this._landingMode || !this._stops[this._stopIndex].photoId ? 0.0 : 1.0;
    this._targetPlateOpacity = this._plateOpacity;
    this._placardOpacity = this._landingMode ? 0.0 : 1.0;
    this._isRevealing3D = false;
    this._revealAnimActive = false;

    // Virtual clock for deterministic capture
    this._deterministicMode = false;
    this._virtualTimeSec = 0;
    this._totalDurationSec = this._computeTotalCycleDurationSec();

    // Rail scrubbing & press-hold state
    this._railDragging = false;
    this._revealPointerDownMs = 0;
    this._hoveredStopIndex = null;
    this._playHintDismissed = false;

    this.el = null;
    this._dom = {};
    this._boundKeydown = null;

    this._mount(container, parent);
    if (bindKeyboard) {
      this.bindKeyboardShortcuts();
    }
    this._syncBarDom();
  }

  _computeTotalCycleDurationSec() {
    let sum = 2.4;
    for (let i = 0; i < this._stops.length - 1; i++) {
      const fromStop = this._stops[i];
      const toStop = this._stops[i + 1];
      const flightSec = Number(fromStop.flightDurationSec) || 3.4;
      const yieldSec = fromStop.photoId ? BEAT_A_YIELD_SEC : BEAT_A_HERO_YIELD_SEC;
      const lockSec = toStop.photoId ? BEAT_C_DISSOLVE_SEC : 1.1;
      const isFinalStop = i === this._stops.length - 2;
      const holdSec = !toStop.photoId || isFinalStop ? FINALE_SHOWCASE_HOLD_SEC : BEAT_D_HOLD_SEC;
      sum += yieldSec + flightSec + lockSec + holdSec;
    }
    return Number(sum.toFixed(2));
  }

  setAppAdapter(adapter) {
    this._app = adapter || null;
  }

  isLandingMode() {
    return this._landingMode;
  }

  setLandingMode(active, { silent = false } = {}) {
    const next = Boolean(active);
    if (this._landingMode === next) return this._landingMode;
    this._landingMode = next;
    if (next) {
      this.pause();
      this._step = 11.0;
      this._plateOpacity = 0.0;
      this._targetPlateOpacity = 0.0;
      this._placardOpacity = 0.0;
      this._emitStep(11.0, { stopIndex: this._stopIndex, beat: 'landing_intro', progress: 1.0 });
      this._emitPortalBlendOnly(0.0);
      this._emitPlacardOpacity(0.0, this._stopIndex);
    } else {
      this._placardOpacity = 1.0;
      this._emitPlacardOpacity(1.0, this._stopIndex);
    }
    this._syncBarDom();
    if (!silent && this.onLandingModeChange) {
      this.onLandingModeChange(this._landingMode);
    }
    return this._landingMode;
  }

  // ===========================================================================
  // DOM Construction — Strictly ONE Playthrough Bar (`#exhibition-walkthrough-bar`)
  // ===========================================================================

  _mount(container, parent) {
    if (typeof document === 'undefined') return;

    let root = null;
    if (typeof container === 'string') {
      root = document.querySelector(container);
    } else if (container instanceof HTMLElement) {
      root = container;
    }
    if (!root) {
      root = document.getElementById('exhibition-walkthrough-bar');
    }
    if (!root) {
      root = document.createElement('footer');
      root.id = 'exhibition-walkthrough-bar';
      const host =
        (parent instanceof HTMLElement && parent) ||
        document.getElementById('museum-ui-root') ||
        document.getElementById('monograph-ui') ||
        document.body;
      host.appendChild(root);
    }

    root.className = 'exhibition-walkthrough-bar';
    root.setAttribute('role', 'region');
    root.innerHTML = '';

    // 1. Left Transport Cluster (`Prev`, `Play/Pause`, `Next`)
    const transport = document.createElement('div');
    transport.className = 'walkthrough-transport';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.id = 'btn-walkthrough-prev';
    prevBtn.className = 'walkthrough-btn';
    prevBtn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="14.5 18 8.5 12 14.5 6" />
      </svg>
    `;
    prevBtn.addEventListener('click', () => {
      this._playHintDismissed = true;
      this.pause();
      this.prev({ immediate: false, reason: 'button' });
    });

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.id = 'btn-walkthrough-play';
    playBtn.className = 'walkthrough-btn walkthrough-btn--play';
    playBtn.setAttribute('aria-pressed', 'false');
    playBtn.innerHTML = `
      <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true">
        <polygon points="8.5 5.5 18.5 12 8.5 18.5" fill="currentColor" stroke="none" />
      </svg>
      <svg class="icon-pause hidden" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="5.5" width="3.5" height="13" fill="currentColor" stroke="none" />
        <rect x="13.5" y="5.5" width="3.5" height="13" fill="currentColor" stroke="none" />
      </svg>
      <span class="walkthrough-play-label"></span>
    `;
    playBtn.addEventListener('click', () => this.togglePlay());

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.id = 'btn-walkthrough-next';
    nextBtn.className = 'walkthrough-btn';
    nextBtn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="9.5 18 15.5 12 9.5 6" />
      </svg>
    `;
    nextBtn.addEventListener('click', () => {
      this._playHintDismissed = true;
      this.pause();
      this.next({ immediate: false, reason: 'button' });
    });

    transport.append(prevBtn, playBtn, nextBtn);

    const playHint = document.createElement('div');
    playHint.id = 'walkthrough-play-hint';
    playHint.className = 'walkthrough-play-hint';
    playHint.setAttribute('role', 'note');

    const playHintBtn = document.createElement('button');
    playHintBtn.type = 'button';
    playHintBtn.className = 'walkthrough-play-hint-body';
    playHintBtn.addEventListener('click', () => {
      this._playHintDismissed = true;
      this.play();
    });

    const playHintClose = document.createElement('button');
    playHintClose.type = 'button';
    playHintClose.className = 'walkthrough-play-hint-close';
    playHintClose.textContent = '×';
    playHintClose.addEventListener('click', (e) => {
      e.stopPropagation();
      this._playHintDismissed = true;
      this._syncBarDom();
    });

    const playHintArrow = document.createElement('span');
    playHintArrow.className = 'walkthrough-play-hint-arrow';
    playHintArrow.setAttribute('aria-hidden', 'true');

    playHint.append(playHintBtn, playHintClose, playHintArrow);

    // 2. Active Exhibit Readout (Historical Date ONLY — zero step fraction counter)
    const readout = document.createElement('div');
    readout.className = 'walkthrough-readout';

    const dateEl = document.createElement('span');
    dateEl.id = 'walkthrough-stop-date';
    dateEl.className = 'walkthrough-date';

    readout.appendChild(dateEl);

    // 3. Unified Chronological Progress Rail (`tau in [0..N-1]` + gallery detents)
    const railWrap = document.createElement('div');
    railWrap.id = 'walkthrough-rail';
    railWrap.className = 'walkthrough-rail-wrap';
    railWrap.setAttribute('role', 'slider');
    railWrap.setAttribute('tabindex', '0');
    railWrap.setAttribute('aria-valuemin', '1');
    railWrap.setAttribute('aria-valuemax', String(this._stops.length));

    const railTrack = document.createElement('div');
    railTrack.className = 'walkthrough-rail-track';
    railTrack.setAttribute('aria-hidden', 'true');

    const railFill = document.createElement('div');
    railFill.id = 'walkthrough-rail-fill';
    railFill.className = 'walkthrough-rail-fill';
    railTrack.appendChild(railFill);

    const detentsLayer = document.createElement('div');
    detentsLayer.className = 'walkthrough-detents-layer';

    const detentButtons = [];
    const maxIdx = Math.max(1, this._stops.length - 1);
    this._stops.forEach((stop, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        idx === this._stops.length - 1
          ? 'walkthrough-detent walkthrough-detent--finale'
          : 'walkthrough-detent';
      btn.dataset.stopIndex = String(idx);
      btn.style.left = `${(idx / maxIdx) * 100}%`;
      btn.tabIndex = -1;

      const mark = document.createElement('span');
      mark.className = 'walkthrough-detent-mark';
      mark.setAttribute('aria-hidden', 'true');
      btn.appendChild(mark);

      btn.addEventListener('pointerenter', () => this._showDetentTooltip(idx));
      btn.addEventListener('pointerleave', () => this._hideDetentTooltip());
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._playHintDismissed = true;
        this.pause();
        this.goToStop(idx, { immediate: false, reason: 'detent' });
      });

      detentsLayer.appendChild(btn);
      detentButtons.push(btn);
    });

    const tooltip = document.createElement('div');
    tooltip.id = 'walkthrough-detent-tooltip';
    tooltip.className = 'walkthrough-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.innerHTML = `
      <span class="walkthrough-tooltip-eyebrow"></span>
      <span class="walkthrough-tooltip-title"></span>
    `;

    railWrap.append(railTrack, detentsLayer, tooltip);
    this._bindRailScrubEvents(railWrap);

    // 4. Contextual 3D Reveal / Reset Hero View Button
    const contextWrap = document.createElement('div');
    contextWrap.className = 'walkthrough-context';

    const revealBtn = document.createElement('button');
    revealBtn.type = 'button';
    revealBtn.id = 'btn-walkthrough-reveal';
    revealBtn.className = 'walkthrough-reveal-btn';
    revealBtn.setAttribute('aria-pressed', 'false');
    revealBtn.innerHTML = `
      <svg class="icon-reveal-layers" viewBox="0 0 24 24" aria-hidden="true">
        <polygon points="12 3.5 21 8.5 12 13.5 3 8.5 12 3.5" />
        <polyline points="3 14.5 12 19.5 21 14.5" />
      </svg>
      <svg class="icon-reset-frame hidden" viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="4 9 4 4 9 4" />
        <polyline points="15 4 20 4 20 9" />
        <polyline points="20 15 20 20 15 20" />
        <polyline points="9 20 4 20 4 15" />
      </svg>
      <span class="walkthrough-reveal-label"></span>
    `;
    this._bindRevealButtonEvents(revealBtn);
    contextWrap.appendChild(revealBtn);

    root.append(playHint, transport, readout, railWrap, contextWrap);

    this.el = root;
    this._dom = {
      playHint,
      playHintBtn,
      playHintClose,
      prevBtn,
      playBtn,
      playLabel: playBtn.querySelector('.walkthrough-play-label'),
      iconPlay: playBtn.querySelector('.icon-play'),
      iconPause: playBtn.querySelector('.icon-pause'),
      nextBtn,
      dateEl,
      railWrap,
      railTrack,
      railFill,
      detentButtons,
      tooltip,
      tooltipEyebrow: tooltip.querySelector('.walkthrough-tooltip-eyebrow'),
      tooltipTitle: tooltip.querySelector('.walkthrough-tooltip-title'),
      revealBtn,
      iconLayers: revealBtn.querySelector('.icon-reveal-layers'),
      iconFrame: revealBtn.querySelector('.icon-reset-frame'),
      revealLabel: revealBtn.querySelector('.walkthrough-reveal-label'),
    };
  }

  _bindRailScrubEvents(railWrap) {
    const computeTauFromClientX = (clientX) => {
      const rect = this._dom.railTrack.getBoundingClientRect();
      if (rect.width <= 1) return this._tau;
      const u = clamp((clientX - rect.left) / rect.width, 0, 1);
      return u * (this._stops.length - 1);
    };

    railWrap.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.walkthrough-detent')) return;
      e.preventDefault();
      this._playHintDismissed = true;
      this.pause();
      this._railDragging = true;
      try {
        railWrap.setPointerCapture(e.pointerId);
      } catch {
        // Ignore synthetic test events without pointerId
      }
      const nextTau = computeTauFromClientX(e.clientX);
      this.setTau(nextTau, { immediate: true, scrubbing: true });
      this._showDetentTooltip(Math.round(nextTau));
    });

    railWrap.addEventListener('pointermove', (e) => {
      if (!this._railDragging) return;
      e.preventDefault();
      const nextTau = computeTauFromClientX(e.clientX);
      this.setTau(nextTau, { immediate: true, scrubbing: true });
      this._showDetentTooltip(Math.round(nextTau));
    });

    const endScrub = (e) => {
      if (!this._railDragging) return;
      this._railDragging = false;
      try {
        railWrap.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
      this._hideDetentTooltip();
      const nearestIdx = clamp(Math.round(this._tau), 0, this._stops.length - 1);
      this.goToStop(nearestIdx, { immediate: false, reason: 'scrub_snap' });
    };

    railWrap.addEventListener('pointerup', endScrub);
    railWrap.addEventListener('pointercancel', endScrub);

    railWrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.pause();
        this.next({ immediate: false, reason: 'keyboard' });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.pause();
        this.prev({ immediate: false, reason: 'keyboard' });
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.pause();
        this.goToStop(0, { immediate: false, reason: 'keyboard' });
      } else if (e.key === 'End') {
        e.preventDefault();
        this.pause();
        this.goToStop(this._stops.length - 1, { immediate: false, reason: 'keyboard' });
      }
    });
  }

  _bindRevealButtonEvents(revealBtn) {
    revealBtn.addEventListener('pointerdown', (e) => {
      const activePhotoId = this._getEffectivePhotoId();
      if (!activePhotoId) return;
      if (e.button !== undefined && e.button !== 0) return;
      this._revealPointerDownMs = performance.now();
      if (!this._isRevealing3D) {
        this._wasRevealingOnDown = false;
        this.setReveal3D(true, { immediate: false });
      } else {
        this._wasRevealingOnDown = true;
      }
    });

    const finishPress = () => {
      const activePhotoId = this._getEffectivePhotoId();
      if (!activePhotoId) return;
      if (!this._revealPointerDownMs) return;
      const heldMs = performance.now() - this._revealPointerDownMs;
      this._revealPointerDownMs = 0;

      if (heldMs >= 260) {
        this.setReveal3D(false, { immediate: false });
      } else if (this._wasRevealingOnDown) {
        this.setReveal3D(false, { immediate: false });
      }
    };

    revealBtn.addEventListener('pointerup', finishPress);
    revealBtn.addEventListener('pointercancel', finishPress);

    revealBtn.addEventListener('click', (e) => {
      const stop = this.getActiveStop();
      if (!stop) return;
      const activePhotoId = this._getEffectivePhotoId();
      if (!activePhotoId) {
        // Stop 9 Hero 3D Showcase -> Reset Hero Camera View
        this._activateHeroFinale({ immediate: false, presetId: 'overview' });
        return;
      }
      if (e.detail === 0) {
        this.toggleReveal3D();
      }
    });
  }

  _showDetentTooltip(stopIndex) {
    const idx = clamp(stopIndex, 0, this._stops.length - 1);
    const stop = this._stops[idx];
    if (!stop || !this._dom.tooltip) return;

    this._hoveredStopIndex = idx;
    const total = this._stops.length;
    const dateStr = this._lang === 'fa' ? stop.dateShortFa : stop.dateShortEn;
    const titleStr = this._lang === 'fa' ? stop.shortTitleFa : stop.shortTitleEn;

    this._dom.tooltipEyebrow.textContent = dateStr;
    this._dom.tooltipTitle.textContent = stripColonsFromTitle(titleStr);

    const maxIdx = Math.max(1, total - 1);
    const pct = clamp((idx / maxIdx) * 100, 12, 88);
    this._dom.tooltip.style.left = `${pct}%`;
    this._dom.tooltip.classList.add('is-visible');
    this._dom.tooltip.setAttribute('aria-hidden', 'false');
  }

  _hideDetentTooltip() {
    this._hoveredStopIndex = null;
    if (!this._dom.tooltip) return;
    this._dom.tooltip.classList.remove('is-visible');
    this._dom.tooltip.setAttribute('aria-hidden', 'true');
  }

  _syncBarDom() {
    if (!this.el) return;
    const t = WALKTHROUGH_STRINGS[this._lang] || WALKTHROUGH_STRINGS.en;
    const stop = this.getActiveStop();
    const total = this._stops.length;
    const idx = this._stopIndex;

    this.el.setAttribute('aria-label', t.regionAria);

    // Closed loop (`Stop 1 <-> Stop 9`): Prev & Next remain enabled across all stops
    this._dom.prevBtn.disabled = false;
    this._dom.prevBtn.setAttribute('aria-label', t.prevAria);
    this._dom.prevBtn.title = t.prevAria;

    this._dom.nextBtn.disabled = false;
    this._dom.nextBtn.setAttribute('aria-label', t.nextAria);
    this._dom.nextBtn.title = t.nextAria;

    this._dom.playBtn.setAttribute('aria-pressed', this._isPlaying ? 'true' : 'false');
    this._dom.playBtn.setAttribute('aria-label', this._isPlaying ? t.pauseAria : t.playAria);
    this._dom.playBtn.title = this._isPlaying ? t.pauseAria : t.playAria;
    if (this._dom.playLabel) {
      this._dom.playLabel.textContent = this._isPlaying ? t.pauseLabel : t.playLabel;
    }
    this._dom.iconPlay.classList.toggle('hidden', this._isPlaying);
    this._dom.iconPause.classList.toggle('hidden', !this._isPlaying);

    if (this._dom.playHint) {
      const showHint = !this._isPlaying && !this._playHintDismissed && !this._landingMode;
      this._dom.playHint.hidden = !showHint;
      this._dom.playHint.setAttribute('aria-hidden', showHint ? 'false' : 'true');
      this._dom.playHint.classList.toggle('is-visible', showHint);
      if (this._dom.playHintBtn) {
        this._dom.playHintBtn.textContent = t.playHint;
      }
      if (this._dom.playHintClose) {
        this._dom.playHintClose.setAttribute('aria-label', t.playHintDismissAria);
        this._dom.playHintClose.title = t.playHintDismissAria;
      }
    }

    const dateStr = this._lang === 'fa' ? stop.dateShortFa : stop.dateShortEn;
    const shortTitle = stripColonsFromTitle(
      this._lang === 'fa' ? stop.shortTitleFa : stop.shortTitleEn
    );
    this._dom.dateEl.textContent = dateStr;

    const maxTau = Math.max(1, total - 1);
    const fillPct = clamp((this._tau / maxTau) * 100, 0, 100);
    this._dom.railFill.style.width = `${fillPct.toFixed(2)}%`;

    this._dom.railWrap.setAttribute('aria-label', t.railAria);
    this._dom.railWrap.setAttribute('aria-valuenow', String(idx + 1));
    this._dom.railWrap.setAttribute('aria-valuetext', `${dateStr} — ${shortTitle}`);

    this._dom.detentButtons.forEach((btn, i) => {
      const s = this._stops[i];
      const dLabel = this._lang === 'fa' ? s.dateShortFa : s.dateShortEn;
      const tLabel = stripColonsFromTitle(this._lang === 'fa' ? s.shortTitleFa : s.shortTitleEn);
      btn.setAttribute('aria-label', `${dLabel} — ${tLabel}`);
      btn.classList.toggle('is-active', i === idx);
      btn.classList.toggle('is-visited', i < idx || i <= Math.floor(this._tau + 0.02));
    });

    // Contextual right button (`Reveal 3D` vs `Show Plate` vs `Reset View` on Stop 9)
    const activePhotoId = this._getEffectivePhotoId();
    if (!activePhotoId) {
      this._dom.iconLayers.classList.add('hidden');
      this._dom.iconFrame.classList.remove('hidden');
      this._dom.revealLabel.textContent = t.resetHeroLabel;
      this._dom.revealBtn.setAttribute('aria-label', t.resetHeroAria);
      this._dom.revealBtn.title = t.resetHeroAria;
      this._dom.revealBtn.setAttribute('aria-pressed', 'false');
      this._dom.revealBtn.classList.remove('is-active');
    } else {
      this._dom.iconLayers.classList.remove('hidden');
      this._dom.iconFrame.classList.add('hidden');
      const showing3d = this._isRevealing3D;
      this._dom.revealLabel.textContent = showing3d ? t.showPlateLabel : t.reveal3dLabel;
      this._dom.revealBtn.setAttribute('aria-label', showing3d ? t.showPlateAria : t.reveal3dAria);
      this._dom.revealBtn.title = showing3d ? t.showPlateAria : t.reveal3dAria;
      this._dom.revealBtn.setAttribute('aria-pressed', showing3d ? 'true' : 'false');
      this._dom.revealBtn.classList.toggle('is-active', showing3d);
    }
  }

  // ===========================================================================
  // Public Navigation, Auto-Play & Continuous Scrub API
  // ===========================================================================

  getStops() {
    return this._stops.slice();
  }

  getStopIndex() {
    return this._stopIndex;
  }

  getActiveStop() {
    return this._stops[this._stopIndex] || this._stops[0];
  }

  getTau() {
    return this._tau;
  }

  getStep() {
    return this._step;
  }

  isPlaying() {
    return this._isPlaying;
  }

  setLanguage(lang) {
    this._lang = normalizeLang(lang);
    this._syncBarDom();
    if (this._hoveredStopIndex !== null) {
      this._showDetentTooltip(this._hoveredStopIndex);
    }
    return this._lang;
  }

  getLanguage() {
    return this._lang;
  }

  setSpeedMultiplier(mult) {
    const val = clamp(Number(mult) || 1.0, 0.1, 8.0);
    this._speedMultiplier = val;
    return this._speedMultiplier;
  }

  getSpeedMultiplier() {
    return this._speedMultiplier;
  }

  resolveStopIndex(stopIndexOrId) {
    if (typeof stopIndexOrId === 'number' && Number.isFinite(stopIndexOrId)) {
      return clamp(Math.round(stopIndexOrId), 0, this._stops.length - 1);
    }
    const q = String(stopIndexOrId ?? '').trim();
    if (!q) return this._stopIndex;

    const lower = q.toLowerCase();
    const cleanPhoto = q.replace(/^#|^photo_/i, '').padStart(2, '0');
    const byId = this._stops.findIndex(
      (s) => s.stopId.toLowerCase() === lower || s.photoId === cleanPhoto
    );
    if (byId >= 0) return byId;

    if (/^\d+$/.test(q)) {
      const n = Number(q);
      if (n >= 0 && n < this._stops.length) return n;
      if (n === this._stops.length) return this._stops.length - 1;
    }
    return this._stopIndex;
  }

  async goToStop(
    stopIndexOrId,
    { immediate = false, reason = 'programmatic', keepLanding = false } = {}
  ) {
    const navToken = (this._navSeq = (this._navSeq || 0) + 1);

    // Preserve post-load full-3D landing intro on initial `reason === 'boot'` call
    if (this._landingMode && reason === 'boot') {
      this._stopIndex = 0;
      this._fromStopIndex = 0;
      this._toStopIndex = 0;
      this._tau = 0;
      this._step = 11.0;
      this._isRevealing3D = false;
      this._revealAnimActive = false;
      this._isFinished = false;
      this._plateOpacity = 0.0;
      this._targetPlateOpacity = 0.0;
      this._placardOpacity = 0.0;

      this._emitStep(11.0, { stopIndex: 0, beat: 'landing_intro', progress: 1.0 });
      this._emitPlacardOpacity(0.0, 0);
      await this._activateHeroFinale({ immediate: true, presetId: 'overview' });
      this._syncBarDom();
      this._app?.requestFrame?.();
      return this._stops[0];
    }

    if (this._landingMode && !keepLanding) {
      this.setLandingMode(false);
    }

    const nextIdx = this.resolveStopIndex(stopIndexOrId);
    const prevIdx = this._stopIndex;
    const stop = this._stops[nextIdx];

    this._stopIndex = nextIdx;
    this._fromStopIndex = prevIdx;
    this._toStopIndex = nextIdx;
    this._tau = nextIdx;
    this._step = stop.calibratedStep;
    this._isRevealing3D = false;
    this._revealAnimActive = false;
    this._isFinished = false;

    if (!this._isPlaying) {
      this._beat = 'idle';
      this._beatTimer = 0;
    }

    this._plateOpacity = stop.photoId ? 1.0 : 0.0;
    this._targetPlateOpacity = this._plateOpacity;
    this._placardOpacity = 1.0;

    this._emitStep(this._step, { stopIndex: nextIdx, beat: 'settled', progress: 1.0 });
    this._emitPlacardOpacity(1.0, nextIdx);

    if (stop.photoId) {
      await this._applyPortalLock(stop.photoId, {
        plateOpacity: 1.0,
        immediate,
        beat: 'settled',
      });
    } else {
      await this._activateHeroFinale({ immediate, presetId: 'overview' });
    }

    if (navToken !== this._navSeq) {
      return this.getActiveStop();
    }

    this._syncBarDom();
    if (this.onStopChange) {
      this.onStopChange({
        stopIndex: nextIdx,
        stopNumber: nextIdx + 1,
        stop,
        tau: this._tau,
        step: this._step,
        immediate,
        reason,
      });
    }
    this._app?.requestFrame?.();
    return stop;
  }

  next({ immediate = false, reason = 'user' } = {}) {
    const wrapping = this._stopIndex >= this._stops.length - 1;
    const nextIdx = wrapping ? 0 : this._stopIndex + 1;
    const resolvedReason =
      wrapping && (reason === 'user' || reason === 'button' || reason === 'keyboard')
        ? 'loop'
        : reason;
    return this.goToStop(nextIdx, { immediate, reason: resolvedReason });
  }

  prev({ immediate = false, reason = 'user' } = {}) {
    const wrapping = this._stopIndex <= 0;
    const prevIdx = wrapping ? this._stops.length - 1 : this._stopIndex - 1;
    const resolvedReason =
      wrapping && (reason === 'user' || reason === 'button' || reason === 'keyboard')
        ? 'loop'
        : reason;
    return this.goToStop(prevIdx, { immediate, reason: resolvedReason });
  }

  setTau(tau, { immediate = true, scrubbing = false } = {}) {
    if (this._landingMode) {
      this.setLandingMode(false);
    }

    const maxTau = Math.max(1, this._stops.length - 1);
    const clampedTau = clamp(Number(tau) || 0, 0, maxTau);
    this._tau = clampedTau;

    const i0 = Math.min(Math.floor(clampedTau), this._stops.length - 1);
    const i1 = Math.min(i0 + 1, this._stops.length - 1);
    const frac = clampedTau - i0;

    const s0 = this._stops[i0].calibratedStep;
    const s1 = this._stops[i1].calibratedStep;
    this._step = lerp(s0, s1, smoothstepCubic(frac));
    this._stopIndex = Math.round(clampedTau);

    if (scrubbing) {
      const distFromStop = Math.abs(clampedTau - Math.round(clampedTau));
      const scrubOpacity = this._stops[this._stopIndex].photoId
        ? clamp(1.0 - distFromStop * 1.65, 0.14, 1.0)
        : 0.0;
      this._plateOpacity = scrubOpacity;
      this._emitPortalBlendOnly(scrubOpacity);
    }

    this._emitStep(this._step, {
      stopIndex: this._stopIndex,
      beat: scrubbing ? 'scrub' : 'tau',
      progress: frac,
    });
    this._syncBarDom();

    if (!scrubbing && immediate) {
      this.goToStop(this._stopIndex, { immediate: true, reason: 'setTau' });
    } else {
      this._app?.requestFrame?.();
    }
    return this._tau;
  }

  play() {
    this._playHintDismissed = true;
    if (this._landingMode) {
      this.setLandingMode(false);
    }

    // At Stop 9: deterministic capture resets immediately; interactive play loops smoothly into Stop 1 (#13)
    if (this._stopIndex >= this._stops.length - 1) {
      if (this._deterministicMode) {
        this.goToStop(0, { immediate: true, reason: 'replay_from_start' });
      } else {
        this._isPlaying = true;
        this._isFinished = false;
        this._isRevealing3D = false;
        this._revealAnimActive = false;
        this._fromStopIndex = this._stopIndex;
        this._toStopIndex = 0;
        this._startBeat('beat_a_yield', BEAT_A_HERO_YIELD_SEC);
        this._syncBarDom();
        if (this.onPlayStateChange) this.onPlayStateChange(true);
        this._app?.requestFrame?.();
        return;
      }
    }

    this._isPlaying = true;
    this._isFinished = false;
    this._isRevealing3D = false;
    this._revealAnimActive = false;

    if (this._beat === 'idle') {
      const initialHold = this._stopIndex === 0 && this._virtualTimeSec < 0.05 ? 2.4 : 1.2;
      this._startBeat('hold_d', initialHold);
    }

    this._syncBarDom();
    if (this.onPlayStateChange) this.onPlayStateChange(true);
    this._app?.requestFrame?.();
  }

  pause() {
    if (!this._isPlaying) return;
    this._isPlaying = false;
    this._syncBarDom();
    if (this.onPlayStateChange) this.onPlayStateChange(false);
  }

  togglePlay() {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this._isPlaying;
  }

  _getEffectivePhotoId() {
    if (this._landingMode) return null;
    return this.getActiveStop()?.photoId || null;
  }

  setReveal3D(active, { immediate = false } = {}) {
    if (this._landingMode) return false;
    const stop = this.getActiveStop();
    const activePhotoId = this._getEffectivePhotoId();
    if (!stop || !activePhotoId) return false;

    if (active && this._isPlaying) {
      this.pause();
    }

    this._isRevealing3D = Boolean(active);
    this._targetPlateOpacity = this._isRevealing3D ? REVEAL_PEEK_OPACITY : 1.0;

    if (immediate) {
      this._plateOpacity = this._targetPlateOpacity;
      this._revealAnimActive = false;
      this._emitPortalBlendOnly(this._plateOpacity);
    } else {
      this._revealAnimActive = true;
    }

    this._syncBarDom();
    if (this.onReveal3DChange) {
      this.onReveal3DChange({
        isRevealing3D: this._isRevealing3D,
        targetOpacity: this._targetPlateOpacity,
        stop,
        photoId: activePhotoId,
      });
    }
    this._app?.requestFrame?.();
    return this._isRevealing3D;
  }

  toggleReveal3D() {
    return this.setReveal3D(!this._isRevealing3D, { immediate: false });
  }

  /**
   * Dragging on the 3D canvas pauses auto-play and releases the photograph overlay smoothly.
   */
  notifyCanvasDragStart() {
    if (this._isPlaying) {
      this.pause();
    }
    if (!this._landingMode && this._getEffectivePhotoId() && !this._isRevealing3D) {
      this._isRevealing3D = true;
      this._targetPlateOpacity = 0.0;
      this._revealAnimActive = true;
      this._syncBarDom();
      if (this.onReveal3DChange) {
        this.onReveal3DChange({
          isRevealing3D: true,
          targetOpacity: 0.0,
          stop: this.getActiveStop(),
          photoId: this._getEffectivePhotoId(),
        });
      }
    }
  }

  // ===========================================================================
  // 4-Beat Choreography & Deterministic Frame-Stepped Clock (`update(dtSec)`)
  // ===========================================================================

  _startBeat(beatName, durationSec) {
    this._beat = beatName;
    this._beatTimer = 0;
    this._beatDuration = Math.max(0.01, durationSec);
  }

  enterDeterministicMode({ fps = 30, startStop = 1 } = {}) {
    if (this._landingMode) {
      this.setLandingMode(false);
    }
    this._deterministicMode = true;
    this._virtualTimeSec = 0;
    this._isFinished = false;
    const startIdx = clamp((Number(startStop) || 1) - 1, 0, this._stops.length - 1);
    this.goToStop(startIdx, { immediate: true, reason: 'deterministic_init' });
    if (startIdx >= this._stops.length - 1) {
      this._isPlaying = true;
      this._startBeat('finale_orbit', FINALE_SHOWCASE_HOLD_SEC);
      this._syncBarDom();
      if (this.onPlayStateChange) this.onPlayStateChange(true);
      this._app?.requestFrame?.();
    } else {
      this.play();
    }
    return {
      fps,
      startStop: startIdx + 1,
      totalDurationSec: this._totalDurationSec,
    };
  }

  exitDeterministicMode() {
    this._deterministicMode = false;
  }

  hasActiveMotion() {
    return this._isPlaying || this._revealAnimActive || this._railDragging;
  }

  update(rawDtSec = 0) {
    const dt = clamp(Number(rawDtSec) || 0, 0, 0.25) * this._speedMultiplier;
    if (dt <= 0) return;

    // 1. Smooth `Reveal 3D` / `Show Plate` manual cross-dissolve (0.65s)
    if (this._revealAnimActive && !this._isPlaying) {
      const rate = dt / REVEAL_CROSSFADE_SEC;
      const diff = this._targetPlateOpacity - this._plateOpacity;
      if (Math.abs(diff) <= rate) {
        this._plateOpacity = this._targetPlateOpacity;
        this._revealAnimActive = false;
      } else {
        this._plateOpacity += Math.sign(diff) * rate;
      }
      this._emitPortalBlendOnly(this._plateOpacity);
    }

    if (!this._isPlaying) return;

    this._virtualTimeSec += dt;
    this._beatTimer += dt;
    const u = clamp(this._beatTimer / this._beatDuration, 0, 1);

    if (this._beat === 'hold_d') {
      if (u >= 1.0) {
        if (this._stopIndex >= this._stops.length - 1) {
          this._startBeat('finale_orbit', FINALE_SHOWCASE_HOLD_SEC);
        } else {
          this._fromStopIndex = this._stopIndex;
          this._toStopIndex = this._stopIndex + 1;
          const fromStop = this._stops[this._fromStopIndex];
          const yieldSec = fromStop?.photoId ? BEAT_A_YIELD_SEC : BEAT_A_HERO_YIELD_SEC;
          this._startBeat('beat_a_yield', yieldSec);
        }
      }
      return;
    }

    if (this._beat === 'beat_a_yield') {
      const fromStop = this._stops[this._fromStopIndex];
      const fadeOut = fromStop?.photoId ? 1.0 - smoothstepCubic(u) : 0.0;
      this._plateOpacity = fadeOut;
      this._placardOpacity = clamp(1.0 - u * 1.4, 0, 1);
      if (fromStop?.photoId) {
        this._emitPortalBlendOnly(this._plateOpacity);
      }
      this._emitPlacardOpacity(this._placardOpacity, this._fromStopIndex);

      if (u >= 1.0) {
        const toStop = this._stops[this._toStopIndex];
        const flightSec = Number(fromStop?.flightDurationSec) || 3.4;
        this._startBeat('beat_b_flight', flightSec);

        if (toStop.photoId) {
          this._applyPortalLock(toStop.photoId, {
            plateOpacity: 0.0,
            immediate: false,
            duration: flightSec,
            beat: 'beat_b_flight',
          });
        } else {
          this._activateHeroFinale({ immediate: false, duration: flightSec, presetId: 'overview' });
        }
      }
      return;
    }

    if (this._beat === 'beat_b_flight') {
      const fromStop = this._stops[this._fromStopIndex];
      const toStop = this._stops[this._toStopIndex];
      const eased = smoothstepQuintic(u);

      this._tau = lerp(this._fromStopIndex, this._toStopIndex, eased);
      this._step = lerp(fromStop.calibratedStep, toStop.calibratedStep, eased);
      this._plateOpacity = 0.0;

      this._emitStep(this._step, {
        stopIndex: this._toStopIndex,
        beat: 'beat_b_flight',
        progress: eased,
      });
      this._syncBarDom();

      if (u >= 1.0) {
        this._stopIndex = this._toStopIndex;
        this._tau = this._stopIndex;
        this._step = toStop.calibratedStep;
        this._emitStep(this._step, { stopIndex: this._stopIndex, beat: 'beat_c_lock', progress: 1.0 });

        if (this.onStopChange) {
          this.onStopChange({
            stopIndex: this._stopIndex,
            stopNumber: this._stopIndex + 1,
            stop: toStop,
            tau: this._tau,
            step: this._step,
            immediate: false,
            reason: 'autoplay',
          });
        }

        const cDur = toStop.photoId ? BEAT_C_DISSOLVE_SEC : 1.1;
        this._startBeat('beat_c_lock', cDur);
      }
      return;
    }

    if (this._beat === 'beat_c_lock') {
      const stop = this._stops[this._stopIndex];
      const fadeIn = smoothstepCubic(u);
      this._plateOpacity = stop.photoId ? fadeIn : 0.0;
      this._placardOpacity = fadeIn;

      if (stop.photoId) {
        this._emitPortalBlendOnly(this._plateOpacity);
      }
      this._emitPlacardOpacity(this._placardOpacity, this._stopIndex);
      this._syncBarDom();

      if (u >= 1.0) {
        if (this._stopIndex >= this._stops.length - 1) {
          this._startBeat('finale_orbit', FINALE_SHOWCASE_HOLD_SEC);
        } else {
          const holdSec = stop.photoId ? BEAT_D_HOLD_SEC : FINALE_SHOWCASE_HOLD_SEC;
          this._startBeat('hold_d', holdSec);
        }
      }
      return;
    }

    if (this._beat === 'finale_orbit') {
      if (u >= 1.0) {
        if (this._deterministicMode) {
          // Bounded 1-pass completion for deterministic video recording
          this._isFinished = true;
          this.pause();
          this._beat = 'idle';
        } else {
          // Interactive autoplay loops seamlessly from Stop 9 (3D Tower) back to Stop 1 (#13)
          this._fromStopIndex = this._stopIndex;
          this._toStopIndex = 0;
          this._startBeat('beat_a_yield', BEAT_A_HERO_YIELD_SEC);
        }
      }
    }
  }

  getPlaythroughState() {
    const stop = this.getActiveStop();
    return {
      virtualTimeSec: Number(this._virtualTimeSec.toFixed(3)),
      totalDurationSec: this._totalDurationSec,
      stopIndex: this._stopIndex,
      stopNumber: this._stopIndex + 1,
      stopId: stop.stopId,
      photoId: this._landingMode ? null : stop.photoId,
      tau: Number(this._tau.toFixed(4)),
      step: Number(this._step.toFixed(4)),
      beat: this._landingMode ? 'landing_intro' : this._beat,
      isPlaying: this._isPlaying,
      isRevealing3D: this._isRevealing3D,
      isLandingMode: this._landingMode,
      plateOpacity: Number(this._plateOpacity.toFixed(3)),
      placardOpacity: Number(this._placardOpacity.toFixed(3)),
      isFinished: this._isFinished,
      heroCameraPose: HERO_FINALE_CAMERA,
    };
  }

  // ===========================================================================
  // Internal Signal Emitters & Optional App Adapter Wiring
  // ===========================================================================

  _emitStep(step, meta) {
    if (this._app) {
      if (typeof this._app.setStep === 'function') {
        this._app.setStep(step, { skipChapterSync: true });
      } else {
        this._app.towerController?.setStep?.(step);
        this._app.parisWorld?.setStep?.(step);
        this._app.portalSystem?.setActiveStep?.(step);
      }
    }
    if (this.onStepChange) {
      this.onStepChange(step, meta);
    }
  }

  async _applyPortalLock(
    photoId,
    { plateOpacity = 1.0, immediate = false, duration = undefined, beat = 'settled' } = {}
  ) {
    if (this._app) {
      if (typeof this._app.enterPortal === 'function') {
        await this._app.enterPortal(photoId, { immediate, blend: plateOpacity, duration });
      } else if (this._app.portalSystem?.enterPortal) {
        await this._app.portalSystem.enterPortal(photoId, { immediate, blend: plateOpacity, duration });
      }
    }
    if (this.onPortalStateChange) {
      this.onPortalStateChange({
        photoId,
        plateOpacity,
        immediate,
        beat,
        stopIndex: this._stopIndex,
      });
    }
  }

  _emitPortalBlendOnly(plateOpacity) {
    if (this._app) {
      if (typeof this._app.setBlend === 'function') {
        this._app.setBlend(plateOpacity);
      } else if (this._app.portalSystem?.setBlend) {
        this._app.portalSystem.setBlend(plateOpacity);
      }
    }
    if (this.onPortalStateChange) {
      this.onPortalStateChange({
        photoId: this._getEffectivePhotoId(),
        plateOpacity,
        immediate: true,
        beat: this._beat,
        blendOnly: true,
        stopIndex: this._stopIndex,
      });
    }
  }

  async _activateHeroFinale({ immediate = false, duration = undefined, presetId = 'overview' } = {}) {
    const preset =
      HERO_CRAFTSMANSHIP_PRESETS.find((p) => p.id === presetId) || HERO_CRAFTSMANSHIP_PRESETS[0];

    const isPortraitViewport =
      preset.id === 'overview' &&
      typeof window !== 'undefined' &&
      window.innerWidth / Math.max(1, window.innerHeight) < 0.75;

    const targetPos = isPortraitViewport ? [360, 145, 760] : preset.position;
    const targetLook = isPortraitViewport ? [0, 195, 0] : preset.target;
    const targetFov = isPortraitViewport ? 52 : preset.fov;

    if (this._app) {
      if (typeof this._app.setCameraPose === 'function') {
        await this._app.setCameraPose({
          position: targetPos,
          target: targetLook,
          fov: targetFov,
          duration,
          immediate,
        });
      } else {
        if (typeof this._app.exitPortal === 'function' && this._app.getActivePortalId?.()) {
          await this._app.exitPortal({ keepPinnedIn3D: false, immediate: true });
        } else if (this._app.portalSystem?.getActivePortalId?.()) {
          this._app.portalSystem.exitPortal({ keepPinnedIn3D: false, reason: 'hero_finale' });
        }
      }
    }

    if (this.onHeroFinaleActivate) {
      this.onHeroFinaleActivate({
        presetId: preset.id,
        cameraPose: {
          position: [...targetPos],
          target: [...targetLook],
          fov: targetFov,
        },
        immediate,
      });
    }
  }

  _emitPlacardOpacity(opacity, stopIndex) {
    if (this.onPlacardVisibilityChange) {
      this.onPlacardVisibilityChange({
        opacity: clamp(opacity, 0, 1),
        stopIndex,
        stop: this._stops[stopIndex],
      });
    }
  }

  bindKeyboardShortcuts() {
    if (typeof window === 'undefined' || this._boundKeydown) return;
    this._boundKeydown = (e) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) {
        return;
      }
      const archiveEl =
        document.querySelector('.m2-archive-drawer:not([hidden])') ||
        document.querySelector('.m2-lightbox:not([hidden])') ||
        document.getElementById('archive-gallery-drawer') ||
        document.querySelector('.archive-drawer');
      if (archiveEl && !archiveEl.classList.contains('hidden') && archiveEl.offsetParent !== null) {
        return;
      }

      if (this._landingMode) {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          if (typeof this.onExploreRequest === 'function') {
            this.onExploreRequest();
          } else {
            this.goToStop(0, { immediate: false, reason: 'explore' });
          }
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.pause();
        this.next({ immediate: false, reason: 'keyboard' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.pause();
        this.prev({ immediate: false, reason: 'keyboard' });
      } else if (e.key === 'v' || e.key === 'V') {
        const stop = this.getActiveStop();
        if (stop?.photoId) {
          e.preventDefault();
          this.toggleReveal3D();
        }
      }
    };
    window.addEventListener('keydown', this._boundKeydown);
  }

  dispose() {
    if (this._boundKeydown && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this._boundKeydown);
      this._boundKeydown = null;
    }
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    this.el = null;
  }
}

export function createWalkthroughController(options = {}) {
  return new WalkthroughController(options);
}
