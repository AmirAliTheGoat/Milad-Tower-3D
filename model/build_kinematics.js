/**
 * Physically Grounded 1997–2008 Milad Tower Construction Kinematics Engine (`model/build_kinematics.js`)
 *
 * Animates Milad Tower's authentic construction sequence across `step ∈ [0.0 .. 11.0]`:
 *   1. Geotechnical excavation & 66 m reinforced concrete foundation mat pour (`0.00 .. 1.40`)
 *   2. Continuous vertical concrete slip-forming of the 315 m 8-lobed shaft (`1.45 .. 4.72`)
 *   3. 6-story Iranian geometric travertine base lobby assembly (`3.25 .. 4.65`)
 *   4. Heavy-lift steel collar & 12-story diagrid basket head assembly (`4.88 .. 6.98`)
 *   5. Four-stage telescopic lifting of the 120 m steel antenna mast to 435 m (`7.15 .. 8.80`)
 *   6. 276 m revolving restaurant, 280 m open deck, 292 m enclosed gallery & 315 m Sky Dome (`8.85 .. 10.55`)
 *   7. 6 high-speed panoramic elevators commissioned (`9.75 .. 10.45`) & cranes dismantled prior to Oct 2008 inauguration
 */

export const CALIBRATED_PNP_STEPS = Object.freeze([
  0.50, // Stop 02 — 1997–1999: 14 m Circular Seismic Excavation
  1.40, // Stop 03 — 1999–2000: 66 m Concrete Foundation Mat & Transition Pedestal
  3.15, // Stop 04 — 2000–2002: Slip-Forming the 8-Lobed Concrete Shaft
  4.75, // Stop 05 — 2002–2003: 315 m Shaft Top-Out & 6-Story Base Lobby
  6.15, // Stop 06 — 2003–2005: Heavy-Lift 12-Story Steel Head Structure
  7.05, // Stop 07 — 2005–2006: Faceted Iranian Basket Cladding (60 m Span)
  8.85, // Stop 08 — 2006–2007: 120 m Four-Stage Telescopic Steel Antenna Mast
  9.85, // Stop 09 — 2007–2008: 276 m Revolving Restaurant & 280/292 m Decks
  10.60, // Stop 10 — 2008: 315 m Glass Sky Dome & 7 m/s Panoramic Elevators
  11.0, // Stops 01, 11, 12 — Complete 435 m Milad Tower (7 Oct 2008 Inauguration)
]);

export const MECHANISM_FAMILIES = Object.freeze({
  EXCAVATION_CUT: 'excavation_cut',
  CONCRETE_SLIPFORM_RISE: 'concrete_slipform_rise',
  STEEL_HEAD_LIFT: 'steel_head_lift',
  ANTENNA_TELESCOPE: 'antenna_telescope',
  PROGRESSIVE_BAY_ERECTION: 'progressive_bay_erection',
  TEMPORARY_CRANE_RIGGING: 'temporary_crane_rigging',
});

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep01(t) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export function computeSafeWidenedSpan(_pieceId, rawSpan) {
  const t0 = Number(rawSpan?.[0] ?? 0);
  const t1 = Number(rawSpan?.[1] ?? t0 + 0.25);
  return [t0, t1];
}

export function computeSafeWidenedVanishSpan(_pieceId, rawVanishSpan) {
  if (!Array.isArray(rawVanishSpan) || rawVanishSpan.length !== 2) return null;
  return [Number(rawVanishSpan[0]), Number(rawVanishSpan[1])];
}

export function classifyPieceMechanism(piece) {
  const id = String(piece?.id || '');
  const cat = String(piece?.category || 'permanent');
  if (cat === 'temporary_crane' || cat === 'temporary_falsework' || id.startsWith('z5_temp_')) {
    return MECHANISM_FAMILIES.TEMPORARY_CRANE_RIGGING;
  }
  if (id.includes('excavation') || id.includes('foundation_mat')) {
    return MECHANISM_FAMILIES.EXCAVATION_CUT;
  }
  if (id.startsWith('z2_shaft_tier_')) {
    return MECHANISM_FAMILIES.CONCRETE_SLIPFORM_RISE;
  }
  if (id.startsWith('z4_antenna_')) {
    return MECHANISM_FAMILIES.ANTENNA_TELESCOPE;
  }
  if (id.startsWith('z3_head_')) {
    return MECHANISM_FAMILIES.STEEL_HEAD_LIFT;
  }
  return MECHANISM_FAMILIES.PROGRESSIVE_BAY_ERECTION;
}

function cloneMaterialForClipping(baseMat, planes) {
  if (!baseMat || typeof baseMat.clone !== 'function') return baseMat;
  const cloned = baseMat.clone();
  if (typeof baseMat.onBeforeCompile === 'function') {
    cloned.onBeforeCompile = baseMat.onBeforeCompile;
  }
  if (typeof baseMat.customProgramCacheKey === 'function') {
    cloned.customProgramCacheKey = baseMat.customProgramCacheKey;
  }
  if (cloned.emissive && typeof cloned.emissive.setHex === 'function') {
    cloned.emissive.setHex(0x000000);
  }
  if ('emissiveIntensity' in cloned) {
    cloned.emissiveIntensity = 0.0;
  }
  if ('emissiveMap' in cloned) {
    cloned.emissiveMap = null;
  }
  cloned.clippingPlanes = planes;
  cloned.clipShadows = true;
  cloned.needsUpdate = true;
  return cloned;
}

export class BuildKinematicsEngine {
  constructor({ THREE, rootGroup, zones, pieces, materials, widenSpans = true } = {}) {
    if (!THREE || !rootGroup) {
      throw new Error('BuildKinematicsEngine requires { THREE, rootGroup }.');
    }
    this.THREE = THREE;
    this.rootGroup = rootGroup;
    this.zones = zones;
    this.materials = materials;
    this.widenSpans = widenSpans !== false;
    this.records = [];

    this._lastTelemetry = {
      step: 11.0,
      activeAppearIds: [],
      activeVanishIds: [],
      activeRiggingCount: 0,
      activeClippedPieceCount: 0,
      minPiecePlungeM: 0.0,
    };

    if (Array.isArray(pieces) && pieces.length > 0) {
      this._buildPieceRecords(pieces);
    }
  }

  _buildPieceRecords(pieces) {
    const { THREE } = this;
    this.rootGroup.updateMatrixWorld(true);

    this.records = pieces.map((p, index) => {
      const obj = p.object3D;
      obj.position.copy(p.basePos);
      obj.quaternion.copy(p.baseQuat);
      obj.scale.copy(p.baseScale);
      obj.visible = true;
      obj.updateMatrixWorld(true);

      const worldBox = new THREE.Box3().setFromObject(obj);
      if (worldBox.isEmpty()) {
        worldBox.min.set(-1, p.yMin ?? 0, -1);
        worldBox.max.set(1, p.yMax ?? 10, 1);
      }

      const meshBindings = [];
      obj.traverse((child) => {
        if ((child.isMesh || child.isInstancedMesh) && child.material) {
          meshBindings.push({
            mesh: child,
            origMaterial: child.material,
            clippedMaterial: null,
          });
        }
      });

      const mechanism = classifyPieceMechanism(p);
      const yMin = Number.isFinite(p.yMin) ? p.yMin : worldBox.min.y;
      const yMax = Number.isFinite(p.yMax) ? p.yMax : worldBox.max.y;

      const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), yMax + 5.0);

      return {
        index,
        piece: p,
        id: p.id,
        obj,
        mechanism,
        span: computeSafeWidenedSpan(p.id, p.span),
        vanishSpan: computeSafeWidenedVanishSpan(p.id, p.vanishSpan),
        basePos: p.basePos.clone(),
        baseQuat: p.baseQuat.clone(),
        baseScale: p.baseScale.clone(),
        restWorldMinY: yMin,
        restWorldMaxY: yMax,
        isDynamicSubRig: p.id === 'z5_temp_slipform_collar' || p.id === 'z5_panoramic_elevators',
        clipPlane,
        clipPlanesArray: [clipPlane],
        isClippedActive: false,
        meshBindings,
      };
    });
  }

  _enablePieceClipping(rec, yCutWorld) {
    rec.clipPlane.normal.set(0, -1, 0);
    rec.clipPlane.constant = yCutWorld;

    if (!rec.isClippedActive || rec.meshBindings.some((b) => b.mesh.material !== b.clippedMaterial)) {
      for (let i = 0; i < rec.meshBindings.length; i++) {
        const b = rec.meshBindings[i];
        if (b.mesh.material && b.mesh.material !== b.origMaterial && b.mesh.material !== b.clippedMaterial) {
          b.origMaterial = b.mesh.material;
          b.clippedMaterial = null;
        }
        if (!b.clippedMaterial) {
          if (Array.isArray(b.origMaterial)) {
            b.clippedMaterial = b.origMaterial.map((m) =>
              cloneMaterialForClipping(m, rec.clipPlanesArray)
            );
          } else {
            b.clippedMaterial = cloneMaterialForClipping(b.origMaterial, rec.clipPlanesArray);
          }
        }
        b.mesh.material = b.clippedMaterial;
      }
      rec.isClippedActive = true;
    }
  }

  _restorePieceMaterials(rec) {
    if (!rec.isClippedActive) return;
    for (let i = 0; i < rec.meshBindings.length; i++) {
      const b = rec.meshBindings[i];
      if (b.mesh.material && b.mesh.material !== b.clippedMaterial) {
        b.origMaterial = b.mesh.material;
        b.clippedMaterial = null;
      } else {
        b.mesh.material = b.origMaterial;
      }
    }
    rec.isClippedActive = false;
  }

  _setCanonicalRest(rec, visible) {
    this._restorePieceMaterials(rec);
    rec.obj.visible = visible;
    if (!rec.isDynamicSubRig) {
      rec.obj.position.copy(rec.basePos);
      rec.obj.quaternion.copy(rec.baseQuat);
      rec.obj.scale.copy(rec.baseScale);
    }
  }

  applyStep(step, _elapsedSec = 0) {
    const s = clamp(Number.isFinite(step) ? step : 11.0, 0.0, 11.0);
    const activeAppearIds = [];
    const activeVanishIds = [];
    let activeClippedCount = 0;

    for (let i = 0; i < this.records.length; i++) {
      const rec = this.records[i];
      const [t0, t1] = rec.span;

      if (s < t0) {
        this._setCanonicalRest(rec, false);
        continue;
      }

      if (rec.vanishSpan) {
        const [v0, v1] = rec.vanishSpan;
        if (s >= v1) {
          this._setCanonicalRest(rec, false);
          continue;
        }
        if (s > v0) {
          const uv = smoothstep01((s - v0) / Math.max(1e-4, v1 - v0));
          activeVanishIds.push(rec.id);
          rec.obj.visible = true;
          if (!rec.isDynamicSubRig) {
            rec.obj.position.copy(rec.basePos);
            rec.obj.quaternion.copy(rec.baseQuat);
            rec.obj.scale.copy(rec.baseScale);
            const yCut = lerp(rec.restWorldMaxY + 0.5, rec.restWorldMinY - 0.5, uv);
            this._enablePieceClipping(rec, yCut);
            activeClippedCount++;
          } else {
            this._restorePieceMaterials(rec);
            const sc = Math.max(0.01, 1.0 - uv);
            rec.obj.scale.set(sc, sc, sc);
          }
          continue;
        }
      }

      if (s >= t1) {
        this._setCanonicalRest(rec, true);
        continue;
      }

      // Active appearance progression in (t0, t1)
      const u = smoothstep01((s - t0) / Math.max(1e-4, t1 - t0));
      activeAppearIds.push(rec.id);
      rec.obj.visible = true;

      if (rec.isDynamicSubRig) {
        this._restorePieceMaterials(rec);
        continue;
      }

      if (rec.mechanism === MECHANISM_FAMILIES.ANTENNA_TELESCOPE) {
        // Telescopic upward hydraulic lift of the 4-stage steel antenna sections
        this._restorePieceMaterials(rec);
        const h = Math.max(6.0, rec.restWorldMaxY - rec.restWorldMinY);
        rec.obj.position.set(rec.basePos.x, rec.basePos.y - (1.0 - u) * h * 0.55, rec.basePos.z);
        rec.obj.quaternion.copy(rec.baseQuat);
        rec.obj.scale.copy(rec.baseScale);
        this._enablePieceClipping(rec, rec.restWorldMinY + u * (h + 2.0));
        activeClippedCount++;
      } else if (rec.mechanism === MECHANISM_FAMILIES.STEEL_HEAD_LIFT) {
        // Vertical hydraulic heavy-lift rise into place on the 315 m shaft
        rec.obj.position.set(rec.basePos.x, rec.basePos.y - (1.0 - u) * 14.0, rec.basePos.z);
        rec.obj.quaternion.copy(rec.baseQuat);
        rec.obj.scale.copy(rec.baseScale);
        const yCut = lerp(rec.restWorldMinY - 14.0, rec.restWorldMaxY + 1.0, Math.min(1, u * 1.15));
        this._enablePieceClipping(rec, yCut);
        activeClippedCount++;
      } else {
        // Continuous vertical concrete slip-form / progressive floor erection using world-Y clip plane
        rec.obj.position.copy(rec.basePos);
        rec.obj.quaternion.copy(rec.baseQuat);
        rec.obj.scale.copy(rec.baseScale);
        const yCut = lerp(rec.restWorldMinY - 0.3, rec.restWorldMaxY + 0.5, u);
        this._enablePieceClipping(rec, yCut);
        activeClippedCount++;
      }
    }

    this._lastTelemetry = {
      step: Number(s.toFixed(4)),
      activeAppearIds,
      activeVanishIds,
      activeRiggingCount: 0,
      activeClippedPieceCount: activeClippedCount,
      minPiecePlungeM: 0.0,
    };
  }

  getTelemetry() {
    return this._lastTelemetry;
  }
}
