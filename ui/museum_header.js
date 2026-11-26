/**
 * Quiet Top-Right Museum Header (`ui/museum_header.js`)
 *
 * Pure monochrome gallery header containing:
 *   1. `EN · فا` bilingual toggle (English LTR ↔ Persian / Farsi RTL)
 *   2. Quiet Lighting Mood cycle (`Tehran Daylight` · `Alborz Mist` · `Nocturnal`)
 *   3. Discreet Pure View toggle
 */

const HEADER_STRINGS = {
  en: {
    navAria: 'Exhibition language, lighting, and view controls',
    langAria: 'Switch exhibition language (English / فارسی)',
    moodAria: 'Cycle lighting atmosphere (Daylight / Golden Mist / Night)',
    moodLabels: {
      day: 'Day',
      dusk: 'Dusk',
      night: 'Night',
    },
    pureViewTitle: 'Unobstructed exhibition view',
    restoreTitle: 'Restore exhibition interface',
  },
  fa: {
    navAria: 'کنترل‌های زبان، نورپردازی و نمایش نمایشگاه',
    langAria: 'تغییر زبان نمایشگاه (English / فارسی)',
    moodAria: 'تغییر نورپردازی آسمان تهران (روز / غروب البرز / شب)',
    moodLabels: {
      day: 'روز',
      dusk: 'غروب',
      night: 'شب',
    },
    pureViewTitle: 'نمای خالص بدون رابط کاربری',
    restoreTitle: 'بازگردانی رابط نمایشگاه',
  },
};

const MOOD_ORDER = ['day', 'dusk', 'night'];

function normalizeLang(raw) {
  const s = String(raw || '').trim().toLowerCase();
  return s.startsWith('fa') || s === 'persian' || s === 'farsi' ? 'fa' : 'en';
}

export class MuseumHeader {
  constructor({
    container = null,
    parent = null,
    lang = 'fa',
    mood = 'day',
    enablePureViewButton = true,
    onLanguageChange = null,
    onMoodChange = null,
    onPureViewChange = null,
  } = {}) {
    this._lang = normalizeLang(lang);
    this._mood = MOOD_ORDER.includes(mood) ? mood : 'day';
    this._enablePureView = Boolean(enablePureViewButton);
    this._pureViewActive = false;

    this.onLanguageChange = typeof onLanguageChange === 'function' ? onLanguageChange : null;
    this.onMoodChange = typeof onMoodChange === 'function' ? onMoodChange : null;
    this.onPureViewChange = typeof onPureViewChange === 'function' ? onPureViewChange : null;

    this.el = null;
    this._zenExitBtn = null;
    this._dom = {};

    this._mount(container, parent);
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
      root = document.getElementById('museum-header');
    }

    if (!root) {
      root = document.createElement('nav');
      root.id = 'museum-header';
      const host =
        (parent instanceof HTMLElement && parent) ||
        document.getElementById('museum-ui-root') ||
        document.getElementById('monograph-ui') ||
        document.body;
      host.appendChild(root);
    }

    root.className = 'museum-header';
    root.innerHTML = '';

    // 1. EN · فا Language Toggle
    const langBtn = document.createElement('button');
    langBtn.type = 'button';
    langBtn.id = 'btn-lang-toggle';
    langBtn.className = 'museum-header-btn';

    const enSpan = document.createElement('span');
    enSpan.className = 'museum-lang-opt';
    enSpan.dataset.langOpt = 'en';
    enSpan.textContent = 'EN';

    const sepSpan = document.createElement('span');
    sepSpan.className = 'museum-lang-sep';
    sepSpan.setAttribute('aria-hidden', 'true');
    sepSpan.textContent = '·';

    const faSpan = document.createElement('span');
    faSpan.className = 'museum-lang-opt';
    faSpan.dataset.langOpt = 'fa';
    faSpan.textContent = 'فا';

    langBtn.append(enSpan, sepSpan, faSpan);
    langBtn.addEventListener('click', () => {
      const next = this._lang === 'en' ? 'fa' : 'en';
      this.setLanguage(next, { emit: true });
    });

    // 2. Quiet Lighting Mood Cycle Button
    const divMood = document.createElement('span');
    divMood.className = 'museum-header-divider';
    divMood.setAttribute('role', 'separator');
    divMood.setAttribute('aria-hidden', 'true');

    const moodBtn = document.createElement('button');
    moodBtn.type = 'button';
    moodBtn.id = 'btn-mood-toggle';
    moodBtn.className = 'museum-header-btn';
    moodBtn.addEventListener('click', () => {
      const idx = MOOD_ORDER.indexOf(this._mood);
      const nextMood = MOOD_ORDER[(idx + 1) % MOOD_ORDER.length];
      this.setMood(nextMood, { emit: true });
    });

    root.append(langBtn, divMood, moodBtn);

    // 3. Optional Pure View Button
    let zenBtn = null;
    if (this._enablePureView) {
      const div2 = document.createElement('span');
      div2.className = 'museum-header-divider';
      div2.setAttribute('role', 'separator');
      div2.setAttribute('aria-hidden', 'true');

      zenBtn = document.createElement('button');
      zenBtn.type = 'button';
      zenBtn.id = 'btn-zen-enter';
      zenBtn.className = 'museum-header-btn museum-header-btn--icon';
      zenBtn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      `;
      zenBtn.addEventListener('click', () => {
        this.setPureView(true, { emit: true });
      });
      root.append(div2, zenBtn);

      let exitBtn = document.getElementById('btn-zen-exit');
      if (!exitBtn) {
        exitBtn = document.createElement('button');
        exitBtn.type = 'button';
        exitBtn.id = 'btn-zen-exit';
        exitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        `;
        document.body.appendChild(exitBtn);
      }
      exitBtn.addEventListener('click', () => {
        this.setPureView(false, { emit: true });
      });
      this._zenExitBtn = exitBtn;
    }

    this.el = root;
    this._dom = {
      langBtn,
      enSpan,
      faSpan,
      moodBtn,
      zenBtn,
    };

    this._syncStrings();
  }

  _syncStrings() {
    if (!this.el) return;
    const t = HEADER_STRINGS[this._lang] || HEADER_STRINGS.en;
    this.el.setAttribute('aria-label', t.navAria);
    this._dom.langBtn.setAttribute('aria-label', t.langAria);
    this._dom.langBtn.title = t.langAria;
    this._dom.enSpan.classList.toggle('is-active', this._lang === 'en');
    this._dom.faSpan.classList.toggle('is-active', this._lang === 'fa');

    if (this._dom.moodBtn) {
      const mLabel = t.moodLabels[this._mood] || t.moodLabels.day;
      this._dom.moodBtn.textContent = mLabel;
      this._dom.moodBtn.setAttribute('aria-label', t.moodAria);
      this._dom.moodBtn.title = t.moodAria;
    }

    if (this._dom.zenBtn) {
      this._dom.zenBtn.setAttribute('aria-label', t.pureViewTitle);
      this._dom.zenBtn.title = t.pureViewTitle;
    }
    if (this._zenExitBtn) {
      this._zenExitBtn.setAttribute('aria-label', t.restoreTitle);
      this._zenExitBtn.title = t.restoreTitle;
    }
  }

  setLanguage(lang, { emit = false } = {}) {
    const next = normalizeLang(lang);
    this._lang = next;
    this._syncStrings();
    if (emit && this.onLanguageChange) {
      this.onLanguageChange(next);
    }
    return this._lang;
  }

  getLanguage() {
    return this._lang;
  }

  setMood(mood, { emit = false } = {}) {
    const key = String(mood || 'day').toLowerCase().trim();
    this._mood = MOOD_ORDER.includes(key) ? key : 'day';
    this._syncStrings();
    if (emit && this.onMoodChange) {
      this.onMoodChange(this._mood);
    }
    return this._mood;
  }

  getMood() {
    return this._mood;
  }

  setArchiveCount(_count) {}

  setPureView(active, { emit = false } = {}) {
    this._pureViewActive = Boolean(active);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('zen-mode', this._pureViewActive);
    }
    if (emit && this.onPureViewChange) {
      this.onPureViewChange(this._pureViewActive);
    }
    return this._pureViewActive;
  }

  getPureView() {
    return this._pureViewActive;
  }

  dispose() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    this.el = null;
  }
}

export function createMuseumHeader(options = {}) {
  return new MuseumHeader(options);
}
