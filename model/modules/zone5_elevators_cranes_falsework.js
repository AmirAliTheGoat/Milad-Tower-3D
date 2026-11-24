/**
 * Milad Tower (Borj-e Milad) — Zone 5: Construction Slip-Form Ring, Climbing Tower Cranes & 6 Panoramic Elevators
 * Elevation range: 0 m .. 370 m (1:1 metric scale)
 *
 * Verified engineering & operational features:
 *   - Site lattice tower cranes beside the 66 m foundation pit (1997–2003)
 *   - Dynamic hydraulic slip-form platform climbing continuously up the 315 m concrete shaft (2000–2003)
 *   - Twin heavy-lift climbing luffing cranes perched atop the 315 m shaft core assembling the 12-story
 *     steel head and lifting the 120 m antenna mast (2003–2007), dismantled cleanly prior to 2008 inauguration
 *   - 6 High-Speed Panoramic Glass Elevator Cabins (7 m/s, ~45 seconds base to head) gliding smoothly
 *     inside the 3 exterior glazed shaft wings (commissioned 2008)
 */

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function buildTowerCrane({ THREE, mastH, jibLen, counterLen, craneMat, darkMat }) {
  const crane = new THREE.Group();

  // Vertical lattice mast
  const mast = new THREE.Mesh(new THREE.BoxGeometry(2.4, mastH, 2.4), craneMat);
  mast.position.y = mastH * 0.5;
  crane.add(mast);

  // Slewing cabin & apex A-frame
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.0, 3.6), darkMat);
  cabin.position.set(1.2, mastH + 1.5, 0);
  crane.add(cabin);

  const apex = new THREE.Mesh(new THREE.ConeGeometry(1.8, 7.5, 4), craneMat);
  apex.position.set(0, mastH + 5.8, 0);
  crane.add(apex);

  // Horizontal jib boom
  const jib = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, jibLen), craneMat);
  jib.position.set(0, mastH + 2.4, jibLen * 0.5 - 1.5);
  crane.add(jib);

  // Counter-jib & concrete counterweight blocks
  const counterJib = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, counterLen), craneMat);
  counterJib.position.set(0, mastH + 2.4, -counterLen * 0.5 - 0.8);
  crane.add(counterJib);

  const ballast = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 4.2), darkMat);
  ballast.position.set(0, mastH + 1.8, -counterLen + 1.5);
  crane.add(ballast);

  // Forestay & backstay pendant rods
  const addTie = (pA, pB) => {
    const d = new THREE.Vector3().subVectors(pB, pA);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, d.length(), 6), darkMat);
    rod.position.copy(pA).add(pB).multiplyScalar(0.5);
    rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    crane.add(rod);
  };
  addTie(new THREE.Vector3(0, mastH + 9.2, 0), new THREE.Vector3(0, mastH + 3.2, jibLen * 0.72));
  addTie(new THREE.Vector3(0, mastH + 9.2, 0), new THREE.Vector3(0, mastH + 3.2, -counterLen * 0.82));

  return crane;
}

export async function buildZone({ THREE, materials }) {
  const group = new THREE.Group();
  group.name = 'zone5_elevators_cranes_falsework';

  const craneMat = materials.miladCraneSteel || materials.craneSteel;
  const steel = materials.miladHeadSteel || materials.craneSteel;
  const darkMat = materials.miladDarkMullion || materials.ironCast;
  const glass = materials.miladSkyDomeGlass || materials.glass1889;
  const gold = materials.goldAccent || steel;

  const pieces = [];

  // ---------------------------------------------------------------------------
  // 1. Two Site Lattice Tower Cranes beside the 66 m Foundation Pit (1997–2003)
  // ---------------------------------------------------------------------------
  const siteCranesGroup = new THREE.Group();
  siteCranesGroup.name = 'z5_temp_excavation_cranes';

  const craneA = buildTowerCrane({
    THREE,
    mastH: 58.0,
    jibLen: 46.0,
    counterLen: 16.0,
    craneMat,
    darkMat,
  });
  craneA.position.set(34.0, 0.0, 22.0);
  craneA.rotation.y = -Math.PI * 0.68;
  siteCranesGroup.add(craneA);

  const craneB = buildTowerCrane({
    THREE,
    mastH: 48.0,
    jibLen: 42.0,
    counterLen: 15.0,
    craneMat,
    darkMat,
  });
  craneB.position.set(-35.0, 0.0, -18.0);
  craneB.rotation.y = Math.PI * 0.34;
  siteCranesGroup.add(craneB);

  group.add(siteCranesGroup);
  pieces.push({
    id: 'z5_temp_excavation_cranes',
    label: 'Temporary Site Tower Cranes (1997–2003)',
    object3D: siteCranesGroup,
    phase: 0,
    span: [0.22, 0.48],
    vanishSpan: [4.68, 5.15],
    category: 'temporary_crane',
    yMin: 0.0,
    yMax: 68.0,
  });

  // ---------------------------------------------------------------------------
  // 2. Dynamic Hydraulic Slip-Form Collar Climbing the 315 m Concrete Shaft
  // ---------------------------------------------------------------------------
  const slipformGroup = new THREE.Group();
  slipformGroup.name = 'z5_temp_slipform_collar';

  const slipPlatform = new THREE.Mesh(
    new THREE.CylinderGeometry(16.8, 17.2, 4.2, 8),
    craneMat
  );
  slipformGroup.add(slipPlatform);

  const slipDeck = new THREE.Mesh(
    new THREE.CylinderGeometry(18.2, 18.2, 0.65, 8),
    darkMat
  );
  slipDeck.position.y = 2.2;
  slipformGroup.add(slipDeck);

  // Hydraulic climbing yoke frames around the 4 wings
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const yoke = new THREE.Mesh(new THREE.BoxGeometry(6.8, 6.2, 3.6), steel);
    yoke.position.set(Math.sin(a) * 15.8, 0.8, Math.cos(a) * 15.8);
    yoke.rotation.y = a;
    slipformGroup.add(yoke);
  }

  group.add(slipformGroup);
  pieces.push({
    id: 'z5_temp_slipform_collar',
    label: 'Hydraulic Climbing Slip-Form Concrete Platform (2000–2003)',
    object3D: slipformGroup,
    phase: 2,
    span: [1.45, 1.62],
    vanishSpan: [4.70, 5.00],
    category: 'temporary_falsework',
    yMin: 0.0,
    yMax: 318.0,
  });

  // ---------------------------------------------------------------------------
  // 3. Twin Heavy-Lift Climbing Cranes Atop the 315 m Shaft (2003–2007)
  // ---------------------------------------------------------------------------
  const headCranesGroup = new THREE.Group();
  headCranesGroup.name = 'z5_temp_head_cranes';

  const topCrane1 = buildTowerCrane({
    THREE,
    mastH: 38.0,
    jibLen: 36.0,
    counterLen: 14.0,
    craneMat,
    darkMat,
  });
  topCrane1.position.set(9.2, 308.0, 6.5);
  topCrane1.rotation.y = Math.PI * 0.25;
  headCranesGroup.add(topCrane1);

  const topCrane2 = buildTowerCrane({
    THREE,
    mastH: 34.0,
    jibLen: 34.0,
    counterLen: 13.0,
    craneMat,
    darkMat,
  });
  topCrane2.position.set(-9.2, 308.0, -6.5);
  topCrane2.rotation.y = -Math.PI * 0.72;
  headCranesGroup.add(topCrane2);

  group.add(headCranesGroup);
  pieces.push({
    id: 'z5_temp_head_cranes',
    label: 'Heavy-Lift Head & Antenna Climbing Cranes (2003–2007)',
    object3D: headCranesGroup,
    phase: 5,
    span: [4.68, 4.92],
    vanishSpan: [8.85, 9.40],
    category: 'temporary_crane',
    yMin: 308.0,
    yMax: 356.0,
  });

  // ---------------------------------------------------------------------------
  // 4. Six High-Speed Panoramic Glass Elevator Cabins (7 m/s, 3 Wings × 2 Cabins)
  // ---------------------------------------------------------------------------
  const elevatorsGroup = new THREE.Group();
  elevatorsGroup.name = 'z5_panoramic_elevators';

  const cabins = [];
  const cabinPhaseOffsets = [0.08, 0.56, 0.24, 0.74, 0.40, 0.88];
  let idx = 0;

  for (let w = 0; w < 3; w++) {
    const angle = (w * Math.PI) / 2;
    for (const lane of [-1, 1]) {
      const cab = new THREE.Group();
      cab.name = `milad_elevator_cabin_${idx}`;

      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.15, 3.4, 1.45), darkMat);
      const cabGlass = new THREE.Mesh(new THREE.BoxGeometry(0.96, 2.7, 1.52), glass);
      const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.35, 1.58), gold);
      cabRoof.position.y = 1.8;
      cab.add(frame, cabGlass, cabRoof);

      const phase = cabinPhaseOffsets[idx];
      const yInit = lerp(16.0, 270.0, phase);
      const t = yInit / 315.0;
      const wingR = lerp(14.3, 10.7, t) - 1.15;
      const laneOff = lane * 0.82;

      cab.rotation.y = angle;
      cab.position.set(
        Math.sin(angle) * wingR + Math.cos(angle) * laneOff,
        yInit,
        Math.cos(angle) * wingR - Math.sin(angle) * laneOff
      );

      elevatorsGroup.add(cab);
      cabins.push({ cab, angle, lane, phase });
      idx++;
    }
  }

  group.add(elevatorsGroup);
  pieces.push({
    id: 'z5_panoramic_elevators',
    label: '6 High-Speed Panoramic Elevators (7 m/s)',
    object3D: elevatorsGroup,
    phase: 9,
    span: [9.75, 10.45],
    category: 'permanent',
    yMin: 12.0,
    yMax: 276.0,
  });

  // Dynamic positioning of slip-form collar & elevator cabins across steps
  function setConstructionState(step) {
    const s = clamp(Number(step) || 0, 0, 11);

    // Slip-form collar tracks concrete shaft pour height smoothly from y = 8 m -> 313 m over step [1.45 .. 4.72]
    const shaftU = clamp((s - 1.45) / (4.72 - 1.45), 0, 1);
    const slipY = lerp(8.0, 313.0, shaftU);
    const slipScale = lerp(1.0, 0.78, shaftU);
    slipformGroup.position.set(0, slipY, 0);
    slipformGroup.scale.set(slipScale, 1.0, slipScale);

    // Subtle crane boom rotation during construction steps
    topCrane1.rotation.y = Math.PI * 0.25 + Math.sin(s * 1.4) * 0.45;
    topCrane2.rotation.y = -Math.PI * 0.72 + Math.cos(s * 1.1) * 0.45;
  }

  function updateElevators(elapsedSec, step) {
    if (step < 10.0) return;
    for (let i = 0; i < cabins.length; i++) {
      const c = cabins[i];
      // Smooth continuous triangle-wave travel (base to 274 m in ~45 s real time, gently paced here)
      const cycle = (c.phase + elapsedSec * 0.022) % 2.0;
      const tri = cycle <= 1.0 ? cycle : 2.0 - cycle;
      const eased = tri * tri * (3 - 2 * tri);
      const y = lerp(16.0, 272.0, eased);
      const t = y / 315.0;
      const wingR = lerp(14.3, 10.7, t) - 1.15;
      const laneOff = c.lane * 0.82;
      c.cab.position.set(
        Math.sin(c.angle) * wingR + Math.cos(c.angle) * laneOff,
        y,
        Math.cos(c.angle) * wingR - Math.sin(c.angle) * laneOff
      );
    }
  }

  return {
    zoneId: 'zone5_elevators_cranes_falsework',
    group,
    pieces,
    setConstructionState,
    updateSummitAmbient: updateElevators,
    stats: {
      pieceCount: pieces.length,
    },
  };
}
