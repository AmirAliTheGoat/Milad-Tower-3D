/**
 * Milad Tower (Borj-e Milad) — Zone 2: 315-Meter Lobed Octagonal Concrete Shaft & Delayed Panoramic Glazing
 * Elevation range: 0 m .. 315 m (1:1 metric scale)
 *
 * Verified architectural & structural facts:
 *   - Slip-formed reinforced concrete shaft rising 315 m from ground (2000–2003)
 *   - Signature 8-lobed / 4-wing octagonal star-like cross-section:
 *       * Central concrete structural core
 *       * 3 projecting elevator wings housing 6 high-speed panoramic elevators (7 m/s)
 *       * 1 projecting staircase wing housing the 1,693-step emergency stairwell
 *   - During slip-forming (2000–2005, Stops 4–6), shaft elevator bays remain RAW concrete with
 *     recessed dark openings and structural concrete tie-beams; finished panoramic glass curtain walls
 *     install only in late completion (`z2_shaft_elevator_glazing`, step 8.40–9.60)!
 */

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Builds a single vertically tapered RAW-CONCRETE shaft tier from `y0` to `y1` reproducing
 * Milad Tower's 4-wing octagonal-star cross-section, recessed dark elevator chases with
 * concrete structural tie-beams/window bays, fluted relief ribs, and slip-form pour bands.
 */
function buildShaftTier({ THREE, y0, y1, concrete, concreteRib, mullion }) {
  const tier = new THREE.Group();
  const h = y1 - y0;
  const yMid = 0.5 * (y0 + y1);
  const t0 = y0 / 315.0;
  const t1 = y1 / 315.0;

  const coreRBot = lerp(10.6, 8.2, t0);
  const coreRTop = lerp(10.6, 8.2, t1);

  // 1. Central octagonal reinforced concrete core
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(coreRTop, coreRBot, h, 8),
    concrete
  );
  core.position.y = yMid;
  core.rotation.y = Math.PI / 8;
  tier.add(core);

  // 2. Four projecting radial wings (3 elevator wings at 0°, 90°, 180° + 1 stair wing at 270°)
  const wingRBot = lerp(14.3, 10.7, t0);
  const wingRTop = lerp(14.3, 10.7, t1);
  const wingWBot = lerp(7.2, 5.4, t0);
  const wingWTop = lerp(7.2, 5.4, t1);
  const wingMidR = 0.5 * (wingRBot + wingRTop);
  const wingMidW = 0.5 * (wingWBot + wingWTop);

  for (let w = 0; w < 4; w++) {
    const angle = (w * Math.PI) / 2;
    const isElevatorWing = w !== 3; // 3 elevator wings, 1 solid concrete stair wing (1,693 steps)
    const wingGroup = new THREE.Group();
    wingGroup.rotation.y = angle;

    const cheekDepth = Math.max(2.6, wingMidR - 0.5 * (coreRBot + coreRTop) + 2.4);
    const cheekW = isElevatorWing ? wingMidW * 0.28 : wingMidW * 0.46;
    const cheekOffsetX = isElevatorWing ? wingMidW * 0.36 : wingMidW * 0.24;
    const cheekZ = wingMidR - cheekDepth * 0.5;

    for (const sx of [-1, 1]) {
      const cheek = new THREE.Mesh(
        new THREE.BoxGeometry(cheekW, h, cheekDepth),
        concrete
      );
      cheek.position.set(sx * cheekOffsetX, yMid, cheekZ);
      wingGroup.add(cheek);

      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, h, 0.85),
        concreteRib
      );
      fin.position.set(sx * (cheekOffsetX + cheekW * 0.48), yMid, wingMidR - 0.35);
      wingGroup.add(fin);
    }

    if (isElevatorWing) {
      // Raw-concrete recessed dark elevator shaft chase (NO premature glazing during slip-forming!)
      const slotW = wingMidW * 0.44;
      const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(slotW, h, 0.8),
        mullion
      );
      backWall.position.set(0, yMid, wingMidR - 2.45);
      wingGroup.add(backWall);

      // Rhythmic concrete horizontal tie-lintels across the elevator bay every ~10 m (matching
      // the rectangular recessed window openings visible along the shaft in Stops 5 & 6 photos)
      const nTies = Math.max(1, Math.floor(h / 10.0));
      for (let k = 0; k < nTies; k++) {
        const ty = y0 + ((k + 0.5) / nTies) * h;
        const lintel = new THREE.Mesh(
          new THREE.BoxGeometry(slotW + 0.4, 2.2, 1.35),
          concrete
        );
        lintel.position.set(0, ty, wingMidR - 0.72);
        wingGroup.add(lintel);
      }
    } else {
      // Staircase wing (1,693 steps): solid raw concrete facade with recessed rhythmic vent openings
      const stairFace = new THREE.Mesh(
        new THREE.BoxGeometry(wingMidW * 0.52, h, cheekDepth * 0.92),
        concrete
      );
      stairFace.position.set(0, yMid, cheekZ);
      wingGroup.add(stairFace);

      const nVents = Math.max(1, Math.floor(h / 10.0));
      for (let k = 0; k < nVents; k++) {
        const vy = y0 + ((k + 0.5) / nVents) * h;
        const vent = new THREE.Mesh(
          new THREE.BoxGeometry(1.15, 2.6, 0.55),
          mullion
        );
        vent.position.set(0, vy, wingMidR - 0.12);
        wingGroup.add(vent);
      }
    }

    tier.add(wingGroup);
  }

  // 3. Four diagonal 45° secondary concrete buttress lobes (true 8-lobed silhouette)
  const diagRBot = lerp(12.2, 9.4, t0);
  const diagRTop = lerp(12.2, 9.4, t1);
  const diagMidR = 0.5 * (diagRBot + diagRTop);
  for (let d = 0; d < 4; d++) {
    const a = (d * Math.PI) / 2 + Math.PI / 4;
    const lobe = new THREE.Mesh(
      new THREE.BoxGeometry(3.1, h, 3.6),
      concreteRib
    );
    lobe.position.set(Math.cos(a) * (diagMidR - 1.5), yMid, Math.sin(a) * (diagMidR - 1.5));
    lobe.rotation.y = -a + Math.PI / 2;
    tier.add(lobe);
  }

  // 4. Horizontal slip-form architectural pour reveal bands every ~20 m
  const bandStep = 20.0;
  for (let by = Math.ceil(y0 / bandStep) * bandStep; by <= y1 - 0.5; by += bandStep) {
    if (by <= 1.0) continue;
    const bt = by / 315.0;
    const br = lerp(11.3, 8.75, bt);
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(br, br, 0.65, 8),
      concreteRib
    );
    band.rotation.y = Math.PI / 8;
    band.position.y = by;
    tier.add(band);
  }

  return tier;
}

/**
 * Builds the delayed late-stage panoramic curtain-wall glazing & transoms (`y = 20 .. 278 m`)
 * installed inside the 3 elevator wings AFTER the concrete shaft & steel head assembly (`step 8.4–9.6`).
 */
function buildElevatorGlazing({ THREE, glass, mullion }) {
  const grp = new THREE.Group();
  grp.name = 'z2_shaft_elevator_glazing';

  const SEG_H = 32.0;
  for (let y0 = 20.0; y0 < 276.0; y0 += SEG_H) {
    const y1 = Math.min(278.0, y0 + SEG_H);
    const segH = y1 - y0;
    const yMid = 0.5 * (y0 + y1);
    const tMid = yMid / 315.0;
    const wingR = lerp(14.3, 10.7, tMid);
    const wingW = lerp(7.2, 5.4, tMid);
    const slotW = wingW * 0.44;

    for (let w = 0; w < 3; w++) {
      const angle = (w * Math.PI) / 2;
      const wg = new THREE.Group();
      wg.rotation.y = angle;

      const glassPane = new THREE.Mesh(
        new THREE.BoxGeometry(slotW * 0.96, segH, 0.24),
        glass
      );
      glassPane.position.set(0, yMid, wingR - 0.36);
      wg.add(glassPane);

      const nTransoms = Math.max(1, Math.floor(segH / 8.0));
      for (let k = 0; k < nTransoms; k++) {
        const ty = y0 + ((k + 0.5) / nTransoms) * segH;
        const transom = new THREE.Mesh(
          new THREE.BoxGeometry(slotW + 0.28, 0.32, 0.52),
          mullion
        );
        transom.position.set(0, ty, wingR - 0.30);
        wg.add(transom);
      }
      grp.add(wg);
    }
  }

  return grp;
}

export async function buildZone({ THREE, materials }) {
  const group = new THREE.Group();
  group.name = 'zone2_arches_floor1';

  const concrete = materials.miladConcrete || materials.concreteSub;
  const concreteRib = materials.miladConcreteRib || materials.concreteSub;
  const mullion = materials.miladDarkMullion || materials.ironCast;
  const glass = materials.miladTurquoiseGlass || materials.glass1889;

  const TIER_DEFS = [
    { id: 'z2_shaft_tier_1', label: 'Concrete Shaft Tier 1 (0–40 m)', y0: 0, y1: 40, span: [1.50, 1.84] },
    { id: 'z2_shaft_tier_2', label: 'Concrete Shaft Tier 2 (40–80 m)', y0: 40, y1: 80, span: [1.80, 2.15] },
    { id: 'z2_shaft_tier_3', label: 'Concrete Shaft Tier 3 (80–120 m)', y0: 80, y1: 120, span: [2.12, 2.48] },
    { id: 'z2_shaft_tier_4', label: 'Concrete Shaft Tier 4 (120–160 m)', y0: 120, y1: 160, span: [2.44, 2.82] },
    { id: 'z2_shaft_tier_5', label: 'Concrete Shaft Tier 5 (160–200 m)', y0: 160, y1: 200, span: [2.78, 3.15] },
    { id: 'z2_shaft_tier_6', label: 'Concrete Shaft Tier 6 (200–240 m)', y0: 200, y1: 240, span: [3.20, 3.68] },
    { id: 'z2_shaft_tier_7', label: 'Concrete Shaft Tier 7 (240–280 m)', y0: 240, y1: 280, span: [3.64, 4.18] },
    { id: 'z2_shaft_tier_8', label: 'Concrete Shaft Tier 8 Top-Out (280–315 m)', y0: 280, y1: 315, span: [4.14, 4.72] },
  ];

  const pieces = [];
  for (let i = 0; i < TIER_DEFS.length; i++) {
    const def = TIER_DEFS[i];
    const obj = buildShaftTier({
      THREE,
      y0: def.y0,
      y1: def.y1,
      concrete,
      concreteRib,
      mullion,
    });
    obj.name = def.id;
    group.add(obj);
    pieces.push({
      id: def.id,
      label: def.label,
      object3D: obj,
      phase: 2,
      span: def.span,
      category: 'permanent',
      yMin: def.y0,
      yMax: def.y1,
    });
  }

  // Late-stage panoramic elevator curtain glazing (installs after head cladding & antenna collar)
  const glazingObj = buildElevatorGlazing({ THREE, glass, mullion });
  group.add(glazingObj);
  pieces.push({
    id: 'z2_shaft_elevator_glazing',
    label: 'Panoramic Elevator Wing Curtain Glazing (20–278 m)',
    object3D: glazingObj,
    phase: 8,
    span: [8.40, 9.60],
    category: 'permanent',
    yMin: 20.0,
    yMax: 278.0,
  });

  return {
    zoneId: 'zone2_arches_floor1',
    group,
    pieces,
    stats: {
      pieceCount: pieces.length,
    },
  };
}
