/**
 * Milad Tower Exhibition Construction Pacing & Beat-B Easing Choreography (`model/walkthrough_pacing.js`)
 */

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstepCubic(t) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export const STAGE2_BEAT_B_FLIGHT_DURATIONS_SEC = Object.freeze({
  stop_01_design_elevation_1889: 5.4,
  '1887_05_caissons': 4.4,
  '1887_07_base_shoes': 4.8,
  '1888_01_14_lattice_closeup': 4.6,
  '1888_01_07_first_stage_timelapse_1': 4.8,
  '1888_06_12_second_stage_timelapse_2': 4.8,
  '1888_09_14_self_supporting_timelapse_3': 4.6,
  '1888_12_26_winter_ascent_timelapse_4': 5.0,
  '1889_05_completed_axial_timelapse_5': 4.2,
  '1889_summer_under_the_arch': 4.0,
  '1889_summer_coutan_basin': 4.2,
  '1889_hero_3d_showcase_finale': 3.6,
  stop_01_design_elevation_milad: 5.4,
  '1997_excavation_gisha': 4.4,
  '1999_foundation_mat': 4.8,
  '2001_concrete_shaft_slipform': 4.6,
  '2003_shaft_topout_lobby': 4.8,
  '2004_steel_head_lift': 4.8,
  '2005_head_basket_cladding': 4.6,
  '2006_antenna_mast_erection': 5.0,
  '2007_revolving_restaurant_decks': 4.2,
  '2008_sky_dome_elevators': 4.0,
  '2008_inauguration_tehran': 4.2,
  '2008_hero_3d_showcase_finale': 3.6,
});

export const STAGE2_RAW_SCRUB_STEPS_PER_SEC = 0.16;

export function easeConstructionBeatB(u) {
  const x = clamp(u, 0, 1);
  if (x <= 0 || x >= 1) return x;
  const collar = 0.12;
  const m = 1.0 / (1.0 - collar);
  let ramp;
  if (x < collar) {
    ramp = (m * x * x) / (2.0 * collar);
  } else if (x > 1.0 - collar) {
    const dx = 1.0 - x;
    ramp = 1.0 - (m * dx * dx) / (2.0 * collar);
  } else {
    ramp = m * (x - 0.5 * collar);
  }
  return clamp(0.74 * ramp + 0.26 * smoothstepCubic(x), 0, 1);
}

export function applyStage2BuildPacing(walkthroughController, { debugDrawer = null, speedScale = 1.0 } = {}) {
  const scale = Number.isFinite(speedScale) && speedScale > 0 ? speedScale : 1.0;

  if (walkthroughController && Array.isArray(walkthroughController._stops)) {
    for (const stop of walkthroughController._stops) {
      const targetSec = STAGE2_BEAT_B_FLIGHT_DURATIONS_SEC[stop.stopId];
      if (Number.isFinite(targetSec)) {
        stop.flightDurationSec = Number((targetSec / scale).toFixed(3));
      }
    }
    if (typeof walkthroughController._computeTotalCycleDurationSec === 'function') {
      walkthroughController._totalDurationSec = walkthroughController._computeTotalCycleDurationSec();
    }

    if (!walkthroughController._stage2PacingInstalled && typeof walkthroughController._emitStep === 'function') {
      const origEmitStep = walkthroughController._emitStep.bind(walkthroughController);
      walkthroughController._emitStep = function stage2PacedEmitStep(rawStep, meta = {}) {
        if (
          meta &&
          meta.beat === 'beat_b_flight' &&
          this._beat === 'beat_b_flight' &&
          this._beatDuration > 1e-4
        ) {
          const uRaw = clamp(this._beatTimer / this._beatDuration, 0, 1);
          if (uRaw > 0 && uRaw < 1) {
            const fromStop = this._stops[this._fromStopIndex];
            const toStop = this._stops[this._toStopIndex];
            if (fromStop && toStop && fromStop.calibratedStep !== toStop.calibratedStep) {
              const pacedProgress = easeConstructionBeatB(uRaw);
              const pacedStep = lerp(fromStop.calibratedStep, toStop.calibratedStep, pacedProgress);
              this._step = pacedStep;
              return origEmitStep(pacedStep, { ...meta, progress: pacedProgress });
            }
          }
        }
        return origEmitStep(rawStep, meta);
      };
      walkthroughController._stage2PacingInstalled = true;
    }
  }

  if (debugDrawer && typeof debugDrawer === 'object' && !debugDrawer._stage2ScrubPatched) {
    if (typeof debugDrawer._rawScrubSpeed === 'number' && Math.abs(debugDrawer._rawScrubSpeed - 1.0) < 1e-3) {
      debugDrawer._rawScrubSpeed = Number((STAGE2_RAW_SCRUB_STEPS_PER_SEC / 0.85).toFixed(4));
    }
    debugDrawer._stage2ScrubPatched = true;
  }

  return {
    flightDurationsSec: STAGE2_BEAT_B_FLIGHT_DURATIONS_SEC,
    rawScrubStepsPerSec: STAGE2_RAW_SCRUB_STEPS_PER_SEC,
  };
}
