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
  stop_01_1997_gisha_excavation: 4.2,
  stop_02_1999_foundation_mat: 4.4,
  stop_03_2000_transition_pedestal: 4.4,
  stop_04_2000_slipform_shaft: 4.6,
  stop_05_2002_shaft_topout: 4.8,
  stop_06_2003_head_steel_base_struts: 4.8,
  stop_07_2006_antenna_collar: 4.8,
  stop_08_2008_inauguration_alborz: 4.6,
  stop_09_milad_hero_3d: 3.6,
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
