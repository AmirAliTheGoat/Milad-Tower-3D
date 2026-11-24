/**
 * Milad Tower (Borj-e Milad) — Zone 2: 315-Meter Lobed Octagonal Concrete Shaft
 * Elevation range: 0 m .. 315 m (1:1 metric scale)
 *
 * Verified architectural & structural facts:
 *   - Slip-formed reinforced concrete shaft rising 315 m from ground (2000–2003)
 *   - Signature 8-lobed / 4-wing octagonal star-like cross-section:
 *       * Central concrete structural core
 *       * 3 projecting elevator wings housing 6 high-speed panoramic elevators (7 m/s) in glazed slots
 *       * 1 projecting staircase wing housing the 1,693-step emergency stairwell
 *   - Gentle architectural taper from base (~14.4 m outer wing radius) to transition collar (~10.8 m)
 *   - Built in 8 stacked slip-formed tiers so construction scrubbing reveals continuous vertical pour progression
 */

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Builds a single vertically tapered shaft tier from `y0` to `y1` reproducing
 * Milad Tower's 4-wing octagonal-star cross-section, glazed panoramic elevator slots,
 * architectural fluted relief ribs, and horizontal slip-form pour collars.
 */
function buildShaftTier({ THREE, y0, y1, concrete, concreteRib, mullion, glass }) {
  const tier = new THREE.Group();
  const h = y1 - y0;
  const yMid = 0.5 * (y0 + y1);
  const t0 = y0 / 315.0;
  const t1 = y1 / 315.0;

  // Taper factors matching Milad Tower's slender vertical proportion
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

  // 2. Four projecting radial wings (3 panoramic elevator wings at 0°, 90°, 180° + 1 stair wing at 270°)
  const wingRBot = lerp(14.3, 10.7, t0);
  const wingRTop = lerp(14.3, 10.7, t1);
  const wingWBot = lerp(7.2, 5.4, t0);
  const wingWTop = lerp(7.2, 5.4, t1);
  const wingMidR = 0.5 * (wingRBot + wingRTop);
  const wingMidW = 0.5 * (wingWBot + wingWTop);

  for (let w = 0; w < 4; w++) {
    const angle = (w * Math.PI) / 2;
    const isElevatorWing = w !== 3; // 3 panoramic elevator wings, 1 solid concrete stair wing (1,693 steps)
    const wingGroup = new THREE.Group();
    wingGroup.rotation.y = angle;

    // Two flanking concrete cheek-piers per wing
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

      // Subtle vertical bevel fin on outer corner of each wing
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, h, 0.85),
        concreteRib
      );
      fin.position.set(sx * (cheekOffsetX + cheekW * 0.48), yMid, wingMidR - 0.35);
      wingGroup.add(fin);
    }

    if (isElevatorWing) {
      // Recessed dark steel elevator shaft backing + vertical panoramic curtain glass slot (y <= 278 m)
      const slotW = wingMidW * 0.44;
      const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(slotW, h, 0.7),
        mullion
      );
      backWall.position.set(0, yMid, wingMidR - 2.3);
      wingGroup.add(backWall);

      if (y0 < 276.0) {
        const glassH = Math.min(y1, 278.0) - y0;
        const glassMidY = y0 + glassH * 0.5;
        const glassPane = new THREE.Mesh(
          new THREE.BoxGeometry(slotW * 0.96, glassH, 0.22),
          glass
        );
        glassPane.position.set(0, glassMidY, wingMidR - 0.45);
        wingGroup.add(glassPane);

        // Horizontal mullion transoms every ~8 m along the panoramic elevator slot
        const nTransoms = Math.max(1, Math.floor(glassH / 8.0));
        for (let k = 0; k < nTransoms; k++) {
          const ty = y0 + ((k + 0.5) / nTransoms) * glassH;
          const transom = new THREE.Mesh(
            new THREE.BoxGeometry(slotW + 0.3, 0.35, 0.55),
            mullion
          );
          transom.position.set(0, ty, wingMidR - 0.40);
          wingGroup.add(transom);
        }
      }
    } else {
      // Staircase wing (1,693 steps): solid concrete facade with vertical ventilation slit ribs
      const stairFace = new THREE.Mesh(
        new THREE.BoxGeometry(wingMidW * 0.52, h, cheekDepth * 0.92),
        concrete
      );
      stairFace.position.set(0, yMid, cheekZ);
      wingGroup.add(stairFace);

      const stairSlit = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, h, 0.5),
        concreteRib
      );
      stairSlit.position.set(0, yMid, wingMidR - 0.15);
      wingGroup.add(stairSlit);
    }

    tier.add(wingGroup);
  }

  // 3. Four diagonal 45° secondary concrete buttress lobes (creating the true 8-lobed silhouette)
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

  // 4. Horizontal slip-form architectural shadow reveal bands every ~20 m
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

export async function buildZone({ THREE, materials }) {
  const group = new THREE.Group();
  group.name = 'zone2_arches_floor1';

  const concrete = materials.miladConcrete || materials.concreteSub;
  const concreteRib = materials.miladConcreteRib || materials.concreteSub;
  const mullion = materials.miladDarkMullion || materials.ironCast;
  const glass = materials.miladTurquoiseGlass || materials.glass1889;

  const TIER_DEFS = [
    { id: 'z2_shaft_tier_1', label: 'Concrete Shaft Tier 1 (0–40 m)', y0: 0, y1: 40, span: [1.45, 1.92] },
    { id: 'z2_shaft_tier_2', label: 'Concrete Shaft Tier 2 (40–80 m)', y0: 40, y1: 80, span: [1.85, 2.34] },
    { id: 'z2_shaft_tier_3', label: 'Concrete Shaft Tier 3 (80–120 m)', y0: 80, y1: 120, span: [2.26, 2.75] },
    { id: 'z2_shaft_tier_4', label: 'Concrete Shaft Tier 4 (120–160 m)', y0: 120, y1: 160, span: [2.68, 3.12] },
    { id: 'z2_shaft_tier_5', label: 'Concrete Shaft Tier 5 (160–200 m)', y0: 160, y1: 200, span: [3.16, 3.60] },
    { id: 'z2_shaft_tier_6', label: 'Concrete Shaft Tier 6 (200–240 m)', y0: 200, y1: 240, span: [3.54, 3.98] },
    { id: 'z2_shaft_tier_7', label: 'Concrete Shaft Tier 7 (240–280 m)', y0: 240, y1: 280, span: [3.92, 4.38] },
    { id: 'z2_shaft_tier_8', label: 'Concrete Shaft Tier 8 Top-Out (280–315 m)', y0: 280, y1: 315, span: [4.32, 4.72] },
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
      glass,
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

  return {
    zoneId: 'zone2_arches_floor1',
    group,
    pieces,
    stats: {
      pieceCount: pieces.length,
    },
  };
}
