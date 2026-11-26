/**
 * Milad Tower (Borj-e Milad) — Zone 5: Open-Lattice Tower Cranes, Synchronized Circular Slip-Form Rig & Elevators
 * Elevation range: -13 m .. 370 m (1:1 metric scale)
 *
 * Verified engineering & photographic fidelity:
 *   - Stop 1 (`step = 0.50`): Left-apron mobile telescoping crane/pump boom beside SW excavation bays
 *   - Stops 2 & 3 (`step = 1.05, 1.45`): Single slim OPEN-LATTICE central pit tower crane rising from core
 *   - Stops 4 & 5 (`step = 3.15, 4.75`): Wide circular cantilevered steel slip-form working deck with
 *     16 radial underside diagonal struts, multi-tier upper climbing formwork drum, and external open-lattice
 *     climbing crane mast synchronized directly to the exact active concrete shaft top (`y = 200 m -> 315 m`)
 *   - Stop 6 (`step = 6.18`): Lightweight mid-shaft diamond-braced hoist/maintenance collar; clean head silhouette
 *   - Stop 7 (`step = 7.45`): Far-side rooftop open-lattice crane & angled dark luffing boom clear of camera lens
 *   - Stops 8 & 9 (`step = 11.0`): All temporary cranes dismantled; 6 high-speed panoramic glass elevator cabins active
 */

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Exact piecewise synchronization matching `zone2_arches_floor1.js` TIER_DEFS so the
 * slip-form working deck ALWAYS crowns the active concrete pour top without lagging behind!
 */
const SHAFT_TIER_SPANS = [
  [1.50, 1.84, 0, 40],
  [1.80, 2.15, 40, 80],
  [2.12, 2.48, 80, 120],
  [2.44, 2.82, 120, 160],
  [2.78, 3.15, 160, 200],
  [3.20, 3.68, 200, 240],
  [3.64, 4.18, 240, 280],
  [4.14, 4.72, 280, 315],
];

function getActiveShaftTopY(step) {
  if (step <= 1.50) return 6.0;
  let topY = 6.0;
  for (const [t0, t1, y0, y1] of SHAFT_TIER_SPANS) {
    if (step >= t1) {
      topY = Math.max(topY, y1);
    } else if (step > t0) {
      const u = clamp((step - t0) / Math.max(1e-4, t1 - t0), 0, 1);
      const s = u * u * (3 - 2 * u);
      topY = Math.max(topY, lerp(y0, y1, s));
    }
  }
  return topY;
}

/**
 * Helper: appends a strut transform between 3D points `pA` and `pB` into an array of matrices
 * for batched `InstancedMesh` rendering (open-lattice chords, diagonals, and bracing).
 */
function pushStrutMatrix(THREE, matrices, pA, pB, radius) {
  const dir = new THREE.Vector3().subVectors(pB, pA);
  const len = dir.length();
  if (len < 0.04) return;
  const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize()
  );
  const scale = new THREE.Vector3(radius, len, radius);
  const m = new THREE.Matrix4().compose(mid, quat, scale);
  matrices.push(m);
}

function finalizeInstancedStruts(THREE, parent, matrices, mat, radialSegs = 6) {
  if (!matrices.length) return null;
  const geo = new THREE.CylinderGeometry(1, 1, 1, radialSegs);
  const inst = new THREE.InstancedMesh(geo, mat, matrices.length);
  for (let i = 0; i < matrices.length; i++) {
    inst.setMatrixAt(i, matrices[i]);
  }
  inst.instanceMatrix.needsUpdate = true;
  inst.computeBoundingSphere();
  parent.add(inst);
  return inst;
}

/**
 * Builds a true OPEN-LATTICE TRUSS tower crane (4 slender vertical corner chords + horizontal
 * battens + diagonal X-lacing on all 4 mast faces + open triangular lattice horizontal jib).
 * Zero bulky solid rectangular blocks!
 */
function buildLatticeTowerCrane({
  THREE,
  mastH,
  mastW = 1.75,
  jibLen = 32.0,
  counterLen = 11.5,
  craneMat,
  darkMat,
  includeJib = true,
}) {
  const crane = new THREE.Group();
  const half = mastW * 0.5;
  const strutMats = [];
  const darkStruts = [];

  // 1. Four vertical corner chord rails
  const corners = [
    [-half, -half],
    [half, -half],
    [half, half],
    [-half, half],
  ];
  for (const [cx, cz] of corners) {
    pushStrutMatrix(
      THREE,
      strutMats,
      new THREE.Vector3(cx, 0, cz),
      new THREE.Vector3(cx, mastH, cz),
      0.11
    );
  }

  // 2. Open-lattice horizontal girts & alternating diagonal lacing across every 2.4 m vertical bay
  const bayH = 2.4;
  const nBays = Math.max(2, Math.floor(mastH / bayH));
  const stepH = mastH / nBays;

  for (let b = 0; b < nBays; b++) {
    const y0 = b * stepH;
    const y1 = (b + 1) * stepH;
    for (let f = 0; f < 4; f++) {
      const [x0, z0] = corners[f];
      const [x1, z1] = corners[(f + 1) % 4];
      const p00 = new THREE.Vector3(x0, y0, z0);
      const p10 = new THREE.Vector3(x1, y0, z1);
      const p01 = new THREE.Vector3(x0, y1, z0);
      const p11 = new THREE.Vector3(x1, y1, z1);

      // Horizontal top batten
      pushStrutMatrix(THREE, strutMats, p01, p11, 0.065);
      // Alternating diagonal brace
      if ((b + f) % 2 === 0) {
        pushStrutMatrix(THREE, strutMats, p00, p11, 0.06);
      } else {
        pushStrutMatrix(THREE, strutMats, p10, p01, 0.06);
      }
    }
  }

  if (includeJib) {
    const jibY = mastH + 1.4;
    const jibTopY = jibY + 1.55;
    const jHalf = 0.72;

    // Slewing ring & compact side operator cab
    const slewRing = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.9, 12), darkMat);
    slewRing.position.set(0, mastH + 0.45, 0);
    crane.add(slewRing);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 2.2), darkMat);
    cab.position.set(1.45, mastH + 1.35, 0.4);
    crane.add(cab);

    // Open-lattice A-frame apex cathead above mast
    const apexPt = new THREE.Vector3(0, mastH + 7.2, 0);
    for (const [cx, cz] of corners) {
      pushStrutMatrix(THREE, strutMats, new THREE.Vector3(cx, mastH, cz), apexPt, 0.09);
    }

    // Triangular open-lattice horizontal jib boom (2 lower chords + 1 upper spine + diagonal web)
    pushStrutMatrix(
      THREE,
      strutMats,
      new THREE.Vector3(-jHalf, jibY, -1.2),
      new THREE.Vector3(-jHalf, jibY, jibLen),
      0.085
    );
    pushStrutMatrix(
      THREE,
      strutMats,
      new THREE.Vector3(jHalf, jibY, -1.2),
      new THREE.Vector3(jHalf, jibY, jibLen),
      0.085
    );
    pushStrutMatrix(
      THREE,
      strutMats,
      new THREE.Vector3(0, jibTopY, -1.2),
      new THREE.Vector3(0, jibTopY, jibLen * 0.92),
      0.09
    );

    const jibBays = Math.max(4, Math.floor(jibLen / 2.6));
    const jStep = jibLen / jibBays;
    for (let i = 0; i < jibBays; i++) {
      const z0 = i * jStep;
      const z1 = (i + 1) * jStep;
      const topZ1 = Math.min(z1, jibLen * 0.92);
      const topZ0 = Math.min(z0, jibLen * 0.92);
      pushStrutMatrix(
        THREE,
        strutMats,
        new THREE.Vector3(-jHalf, jibY, z0),
        new THREE.Vector3(0, jibTopY, topZ1),
        0.055
      );
      pushStrutMatrix(
        THREE,
        strutMats,
        new THREE.Vector3(jHalf, jibY, z0),
        new THREE.Vector3(0, jibTopY, topZ1),
        0.055
      );
      pushStrutMatrix(
        THREE,
        strutMats,
        new THREE.Vector3(-jHalf, jibY, z1),
        new THREE.Vector3(jHalf, jibY, z1),
        0.05
      );
      if (i < jibBays - 1) {
        pushStrutMatrix(
          THREE,
          strutMats,
          new THREE.Vector3(-jHalf, jibY, z1),
          new THREE.Vector3(0, jibTopY, topZ0),
          0.05
        );
      }
    }

    // Counter-jib lattice & concrete ballast slabs
    pushStrutMatrix(
      THREE,
      strutMats,
      new THREE.Vector3(-jHalf, jibY, 0),
      new THREE.Vector3(-jHalf, jibY, -counterLen),
      0.085
    );
    pushStrutMatrix(
      THREE,
      strutMats,
      new THREE.Vector3(jHalf, jibY, 0),
      new THREE.Vector3(jHalf, jibY, -counterLen),
      0.085
    );
    for (let c = 1; c <= 4; c++) {
      const cz = -(c / 4) * counterLen;
      pushStrutMatrix(
        THREE,
        strutMats,
        new THREE.Vector3(-jHalf, jibY, cz),
        new THREE.Vector3(jHalf, jibY, cz),
        0.06
      );
    }

    const ballast = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.2, 3.0), darkMat);
    ballast.position.set(0, jibY + 0.35, -counterLen + 1.4);
    crane.add(ballast);

    // Forestay & backstay pendant tie-rods
    pushStrutMatrix(THREE, darkStruts, apexPt, new THREE.Vector3(0, jibTopY, jibLen * 0.68), 0.065);
    pushStrutMatrix(
      THREE,
      darkStruts,
      apexPt,
      new THREE.Vector3(0, jibY + 0.6, -counterLen * 0.85),
      0.065
    );

    // Trolley & hook block hanging from jib
    const trolleyZ = jibLen * 0.56;
    pushStrutMatrix(
      THREE,
      darkStruts,
      new THREE.Vector3(0, jibY, trolleyZ),
      new THREE.Vector3(0, jibY - 7.5, trolleyZ),
      0.045
    );
    const hookBlock = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.7), darkMat);
    hookBlock.position.set(0, jibY - 7.8, trolleyZ);
    crane.add(hookBlock);
  }

  finalizeInstancedStruts(THREE, crane, strutMats, craneMat, 6);
  finalizeInstancedStruts(THREE, crane, darkStruts, darkMat, 5);
  return crane;
}

export async function buildZone({ THREE, materials }) {
  const group = new THREE.Group();
  group.name = 'zone5_elevators_cranes_falsework';

  const craneMat = materials.miladCraneSteel || materials.craneSteel;
  const steel = materials.miladHeadSteel || materials.craneSteel;
  const concrete = materials.miladConcrete || steel;
  const darkMat = materials.miladDarkMullion || materials.ironCast;
  const glass = materials.miladSkyDomeGlass || materials.glass1889;
  const gold = materials.goldAccent || steel;

  const pieces = [];

  // ---------------------------------------------------------------------------
  // 1. Stop 1 Left-Apron Mobile Telescoping Crane / Pump Boom (1997–1999)
  //    Replaces the two oversized solid box columns that blocked Stops 1–3!
  // ---------------------------------------------------------------------------
  const excavBoomGroup = new THREE.Group();
  excavBoomGroup.name = 'z5_temp_excavation_cranes';

  // Mobile crane truck chassis parked beside the SW concrete apron bays (`(-22, -13.6, 11)`)
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.8, 3.0), darkMat);
  chassis.position.set(-21.5, -12.6, 11.5);
  chassis.rotation.y = 0.42;
  excavBoomGroup.add(chassis);

  const boomTurret = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.4), craneMat);
  boomTurret.position.set(-20.2, -10.8, 10.8);
  boomTurret.rotation.y = 0.42;
  excavBoomGroup.add(boomTurret);

  // Angled telescoping boom + jib arm reaching cleanly up-left over the pit apron (matching Stop 1 photo)
  const boomStruts = [];
  const pBoomRoot = new THREE.Vector3(-20.2, -10.0, 10.8);
  const pBoomKnuckle = new THREE.Vector3(-25.8, 6.2, -6.5);
  const pBoomTip = new THREE.Vector3(-34.2, 9.6, -18.5);
  pushStrutMatrix(THREE, boomStruts, pBoomRoot, pBoomKnuckle, 0.34);
  pushStrutMatrix(THREE, boomStruts, pBoomKnuckle, pBoomTip, 0.20);
  finalizeInstancedStruts(THREE, excavBoomGroup, boomStruts, darkMat, 8);

  group.add(excavBoomGroup);
  pieces.push({
    id: 'z5_temp_excavation_cranes',
    label: 'Mobile Excavation Crane & Concrete Pump Boom (1997–1999)',
    object3D: excavBoomGroup,
    phase: 0,
    span: [0.12, 0.46],
    vanishSpan: [0.64, 0.88],
    category: 'temporary_crane',
    yMin: -13.8,
    yMax: 11.0,
  });

  // ---------------------------------------------------------------------------
  // 1b. Central Open-Lattice Foundation Pit Tower Crane (1999–2000, Stops 2 & 3)
  // ---------------------------------------------------------------------------
  const pitCenterCrane = buildLatticeTowerCrane({
    THREE,
    mastH: 43.0,
    mastW: 1.85,
    jibLen: 30.0,
    counterLen: 10.5,
    craneMat,
    darkMat,
  });
  pitCenterCrane.name = 'z5_temp_pit_center_crane';
  pitCenterCrane.position.set(0.4, -13.0, -0.4);
  pitCenterCrane.rotation.y = Math.PI * 0.56;

  group.add(pitCenterCrane);
  pieces.push({
    id: 'z5_temp_pit_center_crane',
    label: 'Central Foundation Pit Open-Lattice Tower Crane (1999–2000)',
    object3D: pitCenterCrane,
    phase: 1,
    span: [0.56, 0.94],
    vanishSpan: [1.54, 1.92],
    category: 'temporary_crane',
    yMin: -13.0,
    yMax: 38.0,
  });

  // ---------------------------------------------------------------------------
  // 2. Wide Circular Cantilevered Slip-Form Deck & Climbing Lattice Crane (Stops 4 & 5)
  //    Synchronized directly to the exact active concrete shaft top!
  // ---------------------------------------------------------------------------
  const slipformGroup = new THREE.Group();
  slipformGroup.name = 'z5_temp_slipform_collar';

  // Wide circular cantilevered steel working deck ring (`r = 11.4 .. 20.6 m`, `y = 0.0 m`)
  const deckProfile = [
    new THREE.Vector2(11.2, -0.55),
    new THREE.Vector2(11.2, 0.35),
    new THREE.Vector2(20.6, 0.35),
    new THREE.Vector2(20.6, -0.55),
    new THREE.Vector2(11.2, -0.55),
  ];
  const cantDeck = new THREE.Mesh(new THREE.LatheGeometry(deckProfile, 36), darkMat);
  slipformGroup.add(cantDeck);

  // Outer deck perimeter toe-board & double safety handrail
  for (const ry of [0.85, 1.55]) {
    const hRail = new THREE.Mesh(new THREE.TorusGeometry(20.35, 0.11, 5, 36), steel);
    hRail.rotation.x = Math.PI / 2;
    hRail.position.y = ry;
    slipformGroup.add(hRail);
  }

  // 16 Bold Radial Underside Diagonal Knee-Struts bracing the cantilevered deck back to the shaft
  // (Signature angled reddish/steel raker struts clearly seen beneath the circular deck in Stop 4!)
  const kneeStruts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const pShaft = new THREE.Vector3(Math.cos(a) * 11.2, -7.8, Math.sin(a) * 11.2);
    const pRim = new THREE.Vector3(Math.cos(a) * 19.6, -0.45, Math.sin(a) * 19.6);
    pushStrutMatrix(THREE, kneeStruts, pShaft, pRim, 0.28);

    // Secondary horizontal tie-strut back to shaft
    const pMid = new THREE.Vector3(Math.cos(a) * 11.2, -0.5, Math.sin(a) * 11.2);
    pushStrutMatrix(THREE, kneeStruts, pMid, pRim, 0.18);
  }
  finalizeInstancedStruts(THREE, slipformGroup, kneeStruts, craneMat, 6);

  // Multi-tier stepped circular climbing formwork scaffold rings above the cantilevered deck
  const midDrum = new THREE.Mesh(new THREE.CylinderGeometry(13.2, 13.8, 3.8, 24), concrete);
  midDrum.position.y = 2.1;
  slipformGroup.add(midDrum);

  for (const [ry, rr] of [
    [4.6, 15.0],
    [7.2, 14.6],
    [9.4, 13.4],
  ]) {
    const scafTier = new THREE.Mesh(new THREE.TorusGeometry(rr, 0.42, 6, 32), steel);
    scafTier.rotation.x = Math.PI / 2;
    scafTier.position.y = ry;
    slipformGroup.add(scafTier);
  }

  // Uppermost cylindrical steel slip-form shuttering drum (`y = 6.5 .. 12.6 m`, `r = 10.6 m`, open hollow top!)
  const shutterProfile = [
    new THREE.Vector2(9.9, 6.2),
    new THREE.Vector2(9.9, 12.6),
    new THREE.Vector2(10.5, 12.6),
    new THREE.Vector2(10.5, 6.2),
    new THREE.Vector2(9.9, 6.2),
  ];
  const shutterDrum = new THREE.Mesh(new THREE.LatheGeometry(shutterProfile, 24), steel);
  slipformGroup.add(shutterDrum);

  // Vertical scaffold standards encircling the multi-tier upper climbing rig
  const scafPosts = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    pushStrutMatrix(
      THREE,
      scafPosts,
      new THREE.Vector3(Math.cos(a) * 14.8, 0.3, Math.sin(a) * 14.8),
      new THREE.Vector3(Math.cos(a) * 14.2, 9.8, Math.sin(a) * 14.2),
      0.13
    );
  }
  finalizeInstancedStruts(THREE, slipformGroup, scafPosts, darkMat, 5);

  // External open-lattice climbing crane mast hugging the right side of the shaft (Stops 4 & 5 signature!)
  const climbCrane = buildLatticeTowerCrane({
    THREE,
    mastH: 54.0,
    mastW: 2.1,
    jibLen: 26.0,
    counterLen: 9.0,
    craneMat,
    darkMat,
    includeJib: true,
  });
  climbCrane.position.set(13.6, -24.0, -5.2);
  climbCrane.rotation.y = -Math.PI * 0.32;
  slipformGroup.add(climbCrane);

  // Secondary inner open-lattice hoist tower right beside the core (visible in Stop 4 center-left)
  const hoistTower = buildLatticeTowerCrane({
    THREE,
    mastH: 14.5,
    mastW: 1.5,
    craneMat,
    darkMat,
    includeJib: false,
  });
  hoistTower.position.set(-4.5, 0.2, 13.8);
  slipformGroup.add(hoistTower);

  group.add(slipformGroup);
  pieces.push({
    id: 'z5_temp_slipform_collar',
    label: 'Cantilevered Circular Hydraulic Slip-Form Rig & Climbing Crane (2000–2003)',
    object3D: slipformGroup,
    phase: 2,
    span: [1.50, 1.66],
    vanishSpan: [4.84, 5.15],
    category: 'temporary_falsework',
    yMin: 0.0,
    yMax: 350.0,
  });

  // ---------------------------------------------------------------------------
  // 2b. Mid-Shaft Climbing Hoist / Maintenance Collar (visible in Stop 6 photo halfway up shaft)
  // ---------------------------------------------------------------------------
  const hoistCollarGroup = new THREE.Group();
  hoistCollarGroup.name = 'z5_temp_shaft_hoist_collar';
  hoistCollarGroup.position.y = 74.0;

  const hRing = new THREE.Mesh(new THREE.TorusGeometry(14.6, 0.45, 6, 16), steel);
  hRing.rotation.x = Math.PI / 2;
  hoistCollarGroup.add(hRing);

  const hcStruts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const aNext = ((i + 1) / 8) * Math.PI * 2;
    pushStrutMatrix(
      THREE,
      hcStruts,
      new THREE.Vector3(Math.cos(a) * 13.0, -5.5, Math.sin(a) * 13.0),
      new THREE.Vector3(Math.cos(aNext) * 14.8, 0.2, Math.sin(aNext) * 14.8),
      0.16
    );
    pushStrutMatrix(
      THREE,
      hcStruts,
      new THREE.Vector3(Math.cos(aNext) * 13.0, -5.5, Math.sin(aNext) * 13.0),
      new THREE.Vector3(Math.cos(a) * 14.8, 0.2, Math.sin(a) * 14.8),
      0.16
    );
  }
  finalizeInstancedStruts(THREE, hoistCollarGroup, hcStruts, darkMat, 5);

  group.add(hoistCollarGroup);
  pieces.push({
    id: 'z5_temp_shaft_hoist_collar',
    label: 'Mid-Shaft Exterior Maintenance & Hoist Collar (2003–2006)',
    object3D: hoistCollarGroup,
    phase: 5,
    span: [5.30, 5.85],
    vanishSpan: [7.00, 7.50],
    category: 'temporary_falsework',
    yMin: 68.0,
    yMax: 80.0,
  });

  // ---------------------------------------------------------------------------
  // 3. Far-Side Rooftop Open-Lattice Head/Antenna Crane & Angled Boom (Stop 7)
  //    Positioned STRICTLY behind the antenna sleeve relative to Stop 7 camera (`[12, 333.5, 19.5]`)
  //    so ZERO mast ever blocks the bolted steel cylinder! Starts at step 6.45 so Stop 6 stays clean.
  // ---------------------------------------------------------------------------
  const headCranesGroup = new THREE.Group();
  headCranesGroup.name = 'z5_temp_head_cranes';

  // Far-back-side compact luffing derrick boom peeking cleanly over the back rim (Stop 7 signature!)
  const derrickPedestal = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.4, 2.6), darkMat);
  derrickPedestal.position.set(-1.5, 316.8, -11.6);
  headCranesGroup.add(derrickPedestal);

  const derrickBoom = [];
  pushStrutMatrix(
    THREE,
    derrickBoom,
    new THREE.Vector3(-1.5, 319.2, -11.6),
    new THREE.Vector3(10.5, 327.6, -15.2),
    0.58
  );
  pushStrutMatrix(
    THREE,
    derrickBoom,
    new THREE.Vector3(10.5, 327.6, -15.2),
    new THREE.Vector3(10.5, 320.5, -15.2),
    0.09
  );
  finalizeInstancedStruts(THREE, headCranesGroup, derrickBoom, craneMat, 8);

  // Far-side open-lattice heavy-lift mast positioned well off-axis behind & right (`(13.8, 308, -7.8)`)
  const topCraneFar = buildLatticeTowerCrane({
    THREE,
    mastH: 36.0,
    mastW: 1.75,
    jibLen: 32.0,
    counterLen: 11.0,
    craneMat,
    darkMat,
  });
  topCraneFar.position.set(14.2, 308.0, -7.5);
  topCraneFar.rotation.y = -Math.PI * 0.72;
  headCranesGroup.add(topCraneFar);

  group.add(headCranesGroup);
  pieces.push({
    id: 'z5_temp_head_cranes',
    label: 'Heavy-Lift Rooftop Derrick & Open-Lattice Climbing Crane (2006–2007)',
    object3D: headCranesGroup,
    phase: 7,
    span: [6.45, 6.95],
    vanishSpan: [9.55, 10.10],
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

  // Dynamic positioning of slip-form collar synchronized directly to active concrete shaft top!
  function setConstructionState(step) {
    const s = clamp(Number(step) || 0, 0, 11);
    const activeTopY = getActiveShaftTopY(s);
    const slipY = Math.max(8.0, activeTopY - 2.2);
    const shaftFrac = clamp(activeTopY / 315.0, 0, 1);
    const slipScale = lerp(1.0, 0.80, shaftFrac);
    slipformGroup.position.set(0, slipY, 0);
    slipformGroup.scale.set(slipScale, 1.0, slipScale);

    // Gentle deterministic slewing of rooftop far-side crane away from camera sightline
    topCraneFar.rotation.y = -Math.PI * 0.72 + Math.sin(s * 0.9) * 0.18;
  }

  function updateElevators(elapsedSec, step) {
    if (step < 10.0) return;
    for (let i = 0; i < cabins.length; i++) {
      const c = cabins[i];
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
