/**
 * Post-Load Monochrome Intro & 'Explore' Entry Overlay (`ui/landing_intro.js`)
 *
 * Presents the full completed 435-meter Milad Tower (`step = 11.0`) standing above
 * Gisha Hilltop and the Alborz Mountains unobstructed in the 3D background with a calm,
 * pure monochrome (`chroma = 0`) museum title & 'Explore' / 'کاوش' button.
 */

const INTRO_STRINGS = Object.freeze({
  en: {
    regionAria: 'Milad Tower exhibition introduction',
    eyebrow: '1997–2008 · Gisha Hilltop, Tehran',
    title: 'Milad Tower — 435 Meters',
    subtitle:
      'Iran’s tallest telecommunications tower designed by Dr. Mohammad Reza Hafezi, reconstructed from verified architectural elevations, structural engineering milestones, and Tehran’s Alborz skyline.',
    exploreLabel: 'Explore',
    exploreAria: 'Explore the 1997–2008 Milad Tower exhibition',
    exploreHint: 'Enter the 1997–2008 timeline from excavation to completion, then press Play.',
  },
  fa: {
    regionAria: 'معرفی نمایشگاه برج میلاد تهران',
    eyebrow: '۱۳۷۶ تا ۱۳۸۷ · تپه گیشا، تهران',
    title: 'برج میلاد — ۴۳۵ متر',
    subtitle:
      'بلندترین برج مخابراتی ایران به طراحی دکتر محمدرضا حافظی، بازسازی‌شده بر اساس مستندات مهندسی سازه، جدول زمانی ساخت و چشم‌انداز رشته‌کوه البرز.',
    exploreLabel: 'کاوش',
    exploreAria: 'کاوش نمایشگاه سه‌بعدی برج میلاد تهران',
    exploreHint: 'برای ورود به جدول زمانی ساخت و تماشای خودکار مراحل کلیک کنید.',
  },
});

function normalizeLang(raw) {
  const s = String(raw || '').trim().toLowerCase();
  return s.startsWith('fa') || s === 'persian' || s === 'farsi' ? 'fa' : 'en';
}

function isTruthyParam(val) {
  const s = String(val || '').trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes';
}

function isFalsyParam(val) {
  const s = String(val || '').trim().toLowerCase();
  return s === '0' || s === 'false' || s === 'no';
}

export function shouldStartInLandingMode(searchString = undefined) {
  const raw =
    searchString !== undefined
      ? String(searchString || '')
      : typeof window !== 'undefined' && window.location
      ? window.location.search
      : '';
  if (!raw) return true;

  try {
    const params = new URLSearchParams(raw);
    if (params.has('intro') && isFalsyParam(params.get('intro'))) return false;
    if (params.has('skipIntro') && isTruthyParam(params.get('skipIntro'))) return false;
    if (params.has('stop') && String(params.get('stop') || '').trim() !== '') return false;
    if (params.has('photo') && String(params.get('photo') || '').trim() !== '') return false;
    if (isTruthyParam(params.get('autoplay'))) return false;
    if (isTruthyParam(params.get('record'))) return false;
    if (isTruthyParam(params.get('deterministic'))) return false;
    if (isTruthyParam(params.get('debug'))) return false;
  } catch {
    return true;
  }
  return true;
}

export class LandingIntro {
  constructor({
    container = null,
    parent = null,
    lang = 'fa',
    active = true,
    onExplore = null,
  } = {}) {
    this._lang = normalizeLang(lang);
    this._active = Boolean(active);
    this.onExplore = typeof onExplore === 'function' ? onExplore : null;

    this.el = null;
    this._eyebrowEl = null;
    this._titleEl = null;
    this._subtitleEl = null;
    this._exploreBtn = null;
    this._exploreLabelEl = null;
    this._exploreHintEl = null;

    this._mount(container, parent);
    this._syncDom();
  }

  _mount(container, parent) {
    if (typeof document === 'undefined') return;

    let root = null;
    if (typeof container === 'string') {
      root = document.querySelector(container);
    } else if (container instanceof HTMLElement) {
      root = container;
    }
    if (!root) {
      root = document.getElementById('museum-landing-intro');
    }
    if (!root) {
      root = document.createElement('section');
      root.id = 'museum-landing-intro';
      const host =
        (parent instanceof HTMLElement && parent) ||
        document.getElementById('museum-ui-root') ||
        document.getElementById('monograph-ui') ||
        document.body;
      host.appendChild(root);
    }

    root.className = 'm2-landing-intro';
    root.setAttribute('role', 'region');
    root.replaceChildren();

    const eyebrow = document.createElement('div');
    eyebrow.id = 'landing-intro-eyebrow';
    eyebrow.className = 'm2-landing-eyebrow';

    const title = document.createElement('h1');
    title.id = 'landing-intro-title';
    title.className = 'm2-landing-title';

    const subtitle = document.createElement('p');
    subtitle.id = 'landing-intro-subtitle';
    subtitle.className = 'm2-landing-subtitle';

    const exploreBtn = document.createElement('button');
    exploreBtn.type = 'button';
    exploreBtn.id = 'btn-landing-explore';
    exploreBtn.className = 'm2-landing-explore-btn';

    const exploreLabel = document.createElement('span');
    exploreLabel.className = 'm2-landing-explore-label';

    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('viewBox', '0 0 24 24');
    arrowSvg.setAttribute('aria-hidden', 'true');
    arrowSvg.classList.add('m2-landing-explore-icon');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '5');
    line.setAttribute('y1', '12');
    line.setAttribute('x2', '19');
    line.setAttribute('y2', '12');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    poly.setAttribute('points', '13 6 19 12 13 18');
    arrowSvg.append(line, poly);

    exploreBtn.append(exploreLabel, arrowSvg);
    exploreBtn.addEventListener('click', () => {
      if (!this._active) return;
      if (typeof this.onExplore === 'function') {
        this.onExplore();
      }
    });

    const exploreHint = document.createElement('p');
    exploreHint.id = 'landing-intro-hint';
    exploreHint.className = 'm2-landing-hint';

    root.append(eyebrow, title, subtitle, exploreBtn, exploreHint);

    this.el = root;
    this._eyebrowEl = eyebrow;
    this._titleEl = title;
    this._subtitleEl = subtitle;
    this._exploreBtn = exploreBtn;
    this._exploreLabelEl = exploreLabel;
    this._exploreHintEl = exploreHint;
  }

  _syncDom() {
    if (!this.el) return;
    const copy = INTRO_STRINGS[this._lang] || INTRO_STRINGS.en;

    this.el.setAttribute('aria-label', copy.regionAria);
    this._eyebrowEl.textContent = copy.eyebrow;
    this._titleEl.textContent = copy.title;
    this._subtitleEl.textContent = copy.subtitle;
    this._exploreLabelEl.textContent = copy.exploreLabel;
    this._exploreBtn.setAttribute('aria-label', copy.exploreAria);
    if (this._exploreHintEl) {
      this._exploreHintEl.textContent = copy.exploreHint;
    }

    this.el.hidden = !this._active;
    this.el.setAttribute('aria-hidden', this._active ? 'false' : 'true');
    this.el.classList.toggle('is-active', this._active);

    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('landing-intro-active', this._active);
    }
  }

  isActive() {
    return this._active;
  }

  setActive(active) {
    const next = Boolean(active);
    this._active = next;
    this._syncDom();
    return this._active;
  }

  setLanguage(lang) {
    this._lang = normalizeLang(lang);
    this._syncDom();
    return this._lang;
  }

  getLanguage() {
    return this._lang;
  }

  dispose() {
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('landing-intro-active');
    }
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    this.el = null;
  }
}

export function createLandingIntro(options = {}) {
  return new LandingIntro(options);
}
