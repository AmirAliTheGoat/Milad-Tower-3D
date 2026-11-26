/**
 * Milad Tower (Borj-e Milad) — Zone 4: 302–315 m Sky Dome & 120-Meter Steel Antenna Mast
 * Elevation range: 302 m .. 435 m (1:1 metric scale)
 *
 * Verified architectural & structural facts:
 *   - Faceted Glass-and-Steel Sky Dome (302 m .. 315 m, crowning the 12th story of the head)
 *   - 120-Meter Four-Stage Steel Telecommunication Antenna Mast (315 m .. 435 m, ~350 tons)
 *     erected via four-stage telescopic lifting during 2006–2007:
 *       * Stage 1 (315–350 m): Heavy structural steel mast base & microwave platform rings
 *       * Stage 2 (350–382 m): Broadcast lattice & dipole antenna drum
 *       * Stage 3 (382–412 m): Slender UHF/FM transmission mast & stabilizer collars
 *       * Stage 4 (412–435 m): Top spire needle, lightning arrestor & aviation crown at 435 m
 */

export async function buildZone({ THREE, materials }) {
  const group = new THREE.Group();
  group.name = 'zone4_upper_shaft_summit';

  const steel = materials.miladHeadSteel || materials.craneSteel;
  const cladding = materials.miladHeadCladding || materials.miladConcrete;
  const mullion = materials.miladDarkMullion || materials.ironCast;
  const domeGlass = materials.miladSkyDomeGlass || materials.glass1889;
  const gold = materials.goldAccent || cladding;

  const pieces = [];
  const dummy = new THREE.Object3D();

  // ---------------------------------------------------------------------------
  // 1. 302.5–315 m Rooftop Recessed Octagonal Well & Bolted Steel Antenna Base Collar (2006)
  // ---------------------------------------------------------------------------
  const collarGroup = new THREE.Group();
  collarGroup.name = 'z4_antenna_base_collar';

  const concrete = materials.miladConcrete || cladding;
  const concreteDark = materials.miladConcreteRib || mullion;
  const craneMat = materials.miladCraneSteel || steel;

  // Lower concrete head roof deck (`y = 302.5 .. 311.6 m`)
  const roofTerraceDeck = new THREE.Mesh(
    new THREE.CylinderGeometry(18.6, 19.0, 2.4, 16),
    cladding
  );
  roofTerraceDeck.position.y = 303.7;
  collarGroup.add(roofTerraceDeck);

  const upperDeckBase = new THREE.Mesh(
    new THREE.CylinderGeometry(16.4, 18.0, 6.8, 16),
    concrete
  );
  upperDeckBase.position.y = 308.3;
  collarGroup.add(upperDeckBase);

  // True hollow annular 315 m working roof deck surrounding the RECESSED OCTAGONAL PIT (`r = 7.4 .. 16.4 m`, `y = 311.7 .. 314.9 m`)
  const annularDeckProfile = [
    new THREE.Vector2(7.35, 311.7),
    new THREE.Vector2(7.35, 314.95),
    new THREE.Vector2(16.25, 314.95),
    new THREE.Vector2(16.45, 311.7),
    new THREE.Vector2(7.35, 311.7),
  ];
  const annularDeck = new THREE.Mesh(new THREE.LatheGeometry(annularDeckProfile, 16), concrete);
  collarGroup.add(annularDeck);

  // Crisp recessed octagonal formwork liner wall inside the well (`r = 7.15 m`, `y = 311.7 .. 315.1 m`)
  const wellProfile = [
    new THREE.Vector2(6.95, 311.7),
    new THREE.Vector2(6.95, 315.12),
    new THREE.Vector2(7.42, 315.12),
    new THREE.Vector2(7.42, 311.7),
    new THREE.Vector2(6.95, 311.7),
  ];
  const octagonalWell = new THREE.Mesh(new THREE.LatheGeometry(wellProfile, 8), craneMat);
  octagonalWell.rotation.y = Math.PI / 8;
  collarGroup.add(octagonalWell);

  // Dark pit floor inside the recessed octagonal well (`y = 311.8 m`)
  const wellFloor = new THREE.Mesh(new THREE.CylinderGeometry(7.0, 7.0, 0.35, 8), concreteDark);
  wellFloor.rotation.y = Math.PI / 8;
  wellFloor.position.y = 311.85;
  collarGroup.add(wellFloor);

  // Thick hollow double-sided cylindrical bolted steel antenna base sleeve (`y = 311.8 .. 324.4 m`, `r = 4.25 .. 4.65 m`)
  // Built via LatheGeometry so BOTH the outer bolted shell AND the hollow dark interior cavity render cleanly!
  const sleeveProfile = [
    new THREE.Vector2(4.28, 311.9),
    new THREE.Vector2(4.28, 324.4),
    new THREE.Vector2(4.65, 324.4),
    new THREE.Vector2(4.65, 311.9),
    new THREE.Vector2(4.28, 311.9),
  ];
  const sleeveWall = new THREE.Mesh(new THREE.LatheGeometry(sleeveProfile, 24), steel);
  collarGroup.add(sleeveWall);

  // Inner recessed structural stiffening ring collar near top of open hollow sleeve
  const innerRingProfile = [
    new THREE.Vector2(3.62, 322.2),
    new THREE.Vector2(3.62, 322.85),
    new THREE.Vector2(4.32, 322.85),
    new THREE.Vector2(4.32, 322.2),
    new THREE.Vector2(3.62, 322.2),
  ];
  const innerRing = new THREE.Mesh(new THREE.LatheGeometry(innerRingProfile, 24), mullion);
  collarGroup.add(innerRing);

  // 16 Vertical bolted splice flange strips around exterior + 12 interior vertical stiffener ribs
  const spliceGeo = new THREE.BoxGeometry(0.32, 12.4, 0.24);
  const spliceInst = new THREE.InstancedMesh(spliceGeo, mullion, 28);
  let spIdx = 0;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 4.72, 318.15, Math.sin(a) * 4.72);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    spliceInst.setMatrixAt(spIdx++, dummy.matrix);
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 4.10, 317.8, Math.sin(a) * 4.10);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(0.85, 0.92, 1.4);
    dummy.updateMatrix();
    spliceInst.setMatrixAt(spIdx++, dummy.matrix);
  }
  spliceInst.instanceMatrix.needsUpdate = true;
  spliceInst.computeBoundingSphere();
  collarGroup.add(spliceInst);

  // Horizontal bolted flange seams around the steel sleeve
  for (const hy of [315.2, 319.8, 323.9]) {
    const boltRing = new THREE.Mesh(new THREE.TorusGeometry(4.68, 0.12, 6, 32), mullion);
    boltRing.rotation.x = Math.PI / 2;
    boltRing.position.y = hy;
    collarGroup.add(boltRing);
  }

  // Exterior steel access ladder leaning against front-right side of sleeve (matching Stop 7 photo)
  const ladderGroup = new THREE.Group();
  ladderGroup.rotation.y = 0.92;
  for (const lx of [-0.36, 0.36]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.10, 12.6, 0.14), mullion);
    rail.position.set(lx, 318.2, 5.05);
    rail.rotation.x = -0.07;
    ladderGroup.add(rail);
  }
  const rungGeo = new THREE.BoxGeometry(0.76, 0.08, 0.08);
  const rungInst = new THREE.InstancedMesh(rungGeo, mullion, 22);
  for (let r = 0; r < 22; r++) {
    const frac = r / 21;
    dummy.position.set(0, 312.4 + frac * 11.6, 5.45 - frac * 0.80);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    rungInst.setMatrixAt(r, dummy.matrix);
  }
  rungInst.instanceMatrix.needsUpdate = true;
  rungInst.computeBoundingSphere();
  ladderGroup.add(rungInst);
  collarGroup.add(ladderGroup);

  // Small rooftop stacked formwork planks & work boxes around deck edge (Stop 7 site detail)
  for (const [px, pz, ry, sx, sy, sz] of [
    [1.8, 9.6, 0.32, 3.2, 0.55, 1.8],
    [-4.8, 8.2, -0.48, 4.4, 0.48, 1.4],
    [8.2, 4.2, 0.85, 2.8, 1.2, 1.6],
  ]) {
    const stack = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), concreteDark);
    stack.position.set(px, 315.0 + sy * 0.5, pz);
    stack.rotation.y = ry;
    collarGroup.add(stack);
  }

  group.add(collarGroup);
  pieces.push({
    id: 'z4_antenna_base_collar',
    label: '315 m Rooftop Recessed Well & Bolted Steel Antenna Base Collar',
    object3D: collarGroup,
    phase: 7,
    span: [7.00, 7.45],
    category: 'permanent',
    yMin: 302.5,
    yMax: 325.8,
  });

  // ---------------------------------------------------------------------------
  // 2. 302–315 m Faceted Glass-and-Steel Sky Dome (closes cleanly around completed antenna root)
  // ---------------------------------------------------------------------------
  const skyDomeGroup = new THREE.Group();
  skyDomeGroup.name = 'z4_sky_dome_structure';

  // Translucent faceted geodesic hemisphere glass shell (y = 302.5 .. 315.0 m, r = 18.6 m -> h = 12.5 m)
  const domeShell = new THREE.Mesh(
    new THREE.SphereGeometry(18.4, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
    domeGlass
  );
  domeShell.scale.y = 12.4 / 18.4;
  domeShell.position.y = 302.5;
  skyDomeGroup.add(domeShell);

  // 16 Meridional structural steel ribs arching to the 315 m antenna collar
  for (let i = 0; i < 16; i++) {
    const az = (i / 16) * Math.PI * 2;
    const ca = Math.cos(az);
    const sa = Math.sin(az);
    const steps = 6;
    for (let s = 0; s < steps; s++) {
      const el0 = (s / steps) * Math.PI * 0.44;
      const el1 = ((s + 1) / steps) * Math.PI * 0.44;
      const p0 = new THREE.Vector3(
        ca * Math.cos(el0) * 18.55,
        302.5 + Math.sin(el0) * 12.55,
        sa * Math.cos(el0) * 18.55
      );
      const p1 = new THREE.Vector3(
        ca * Math.cos(el1) * 18.55,
        302.5 + Math.sin(el1) * 12.55,
        sa * Math.cos(el1) * 18.55
      );
      const dir = new THREE.Vector3().subVectors(p1, p0);
      const len = dir.length();
      const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, len, 6), mullion);
      rib.position.copy(p0).add(p1).multiplyScalar(0.5);
      rib.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      skyDomeGroup.add(rib);
    }
  }

  // Concentric Sky Dome tension rings
  for (const frac of [0.16, 0.34, 0.56, 0.78]) {
    const el = frac * Math.PI * 0.44;
    const rRing = Math.cos(el) * 18.55;
    const yRing = 302.5 + Math.sin(el) * 12.55;
    const purlin = new THREE.Mesh(new THREE.TorusGeometry(rRing, 0.20, 6, 32), mullion);
    purlin.rotation.x = Math.PI / 2;
    purlin.position.y = yRing;
    skyDomeGroup.add(purlin);
  }

  // Central Sky Dome sculptural glass-roof compression collar at 315 m
  const domeCrownCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(4.4, 5.2, 2.2, 16),
    cladding
  );
  domeCrownCollar.position.y = 314.2;
  skyDomeGroup.add(domeCrownCollar);

  group.add(skyDomeGroup);
  pieces.push({
    id: 'z4_sky_dome_structure',
    label: '302–315 m Faceted Glass-and-Steel Sky Dome',
    object3D: skyDomeGroup,
    phase: 9,
    span: [9.60, 10.45],
    category: 'permanent',
    yMin: 302.5,
    yMax: 315.4,
  });

  // ---------------------------------------------------------------------------
  // 3. 120-Meter Four-Stage Steel Antenna Mast (325 m .. 435 m, erected 2006–2007)
  // ---------------------------------------------------------------------------

  // Stage 1: Heavy Steel Mast Base & Telecom Maintenance Platforms (324 m .. 352 m)
  const ant1 = new THREE.Group();
  ant1.name = 'z4_antenna_stage_1';

  const core1 = new THREE.Mesh(new THREE.CylinderGeometry(2.65, 3.85, 29.0, 12), steel);
  core1.position.y = 338.5;
  ant1.add(core1);

  // Exterior stiffening ribs + microwave platform rings at 328 m and 348 m
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.28, 28.0, 0.55), mullion);
    fin.position.set(Math.cos(a) * 3.3, 338.5, Math.sin(a) * 3.3);
    fin.rotation.y = -a;
    ant1.add(fin);
  }
  for (const [py, pr] of [
    [328.0, 4.9],
    [348.5, 4.2],
  ]) {
    const plat = new THREE.Mesh(new THREE.CylinderGeometry(pr, pr * 0.94, 0.85, 16), cladding);
    plat.position.y = py;
    ant1.add(plat);
    const guard = new THREE.Mesh(new THREE.TorusGeometry(pr - 0.1, 0.1, 6, 24), mullion);
    guard.rotation.x = Math.PI / 2;
    guard.position.y = py + 1.1;
    ant1.add(guard);
  }

  // Parabolic microwave dishes around 328 m platform
  const dishGeo = new THREE.CylinderGeometry(1.1, 0.25, 0.45, 12);
  dishGeo.rotateX(Math.PI / 2);
  const dishInst = new THREE.InstancedMesh(dishGeo, cladding, 8);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 4.5, 329.2, Math.sin(a) * 4.5);
    dummy.rotation.set(0, -a + Math.PI / 2, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    dishInst.setMatrixAt(i, dummy.matrix);
  }
  dishInst.instanceMatrix.needsUpdate = true;
  dishInst.computeBoundingSphere();
  ant1.add(dishInst);

  group.add(ant1);
  pieces.push({
    id: 'z4_antenna_stage_1',
    label: 'Antenna Mast Stage 1 — Heavy Base & Microwave Ring (324–352 m)',
    object3D: ant1,
    phase: 8,
    span: [7.62, 8.20],
    category: 'permanent',
    yMin: 324.0,
    yMax: 352.0,
  });

  // Stage 2: Second Tapered Broadcast Section (352 m .. 382 m)
  const ant2 = new THREE.Group();
  ant2.name = 'z4_antenna_stage_2';

  const core2 = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 2.55, 31.0, 12), steel);
  core2.position.y = 366.5;
  ant2.add(core2);

  // Stepped collar & broadcast dipole panels
  const collar2 = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.8, 0.9, 12), cladding);
  collar2.position.y = 381.5;
  ant2.add(collar2);

  const dipoleGeo = new THREE.BoxGeometry(0.32, 3.2, 0.22);
  const dipoleInst = new THREE.InstancedMesh(dipoleGeo, cladding, 24);
  let di = 0;
  for (const dy of [358.0, 366.0, 374.0]) {
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 2.45, dy, Math.sin(a) * 2.45);
      dummy.rotation.set(0, -a, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      dipoleInst.setMatrixAt(di++, dummy.matrix);
    }
  }
  dipoleInst.instanceMatrix.needsUpdate = true;
  dipoleInst.computeBoundingSphere();
  ant2.add(dipoleInst);

  group.add(ant2);
  pieces.push({
    id: 'z4_antenna_stage_2',
    label: 'Antenna Mast Stage 2 — Broadcast Dipole Array (352–382 m)',
    object3D: ant2,
    phase: 8,
    span: [8.14, 8.66],
    category: 'permanent',
    yMin: 352.0,
    yMax: 382.0,
  });

  // Stage 3: Slender UHF/FM Transmission Mast (382 m .. 412 m)
  const ant3 = new THREE.Group();
  ant3.name = 'z4_antenna_stage_3';

  const core3 = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.65, 30.0, 12), cladding);
  core3.position.y = 397.0;
  ant3.add(core3);

  for (const [cy, cr] of [
    [392.0, 1.85],
    [402.0, 1.55],
    [411.5, 1.35],
  ]) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(cr, cr, 0.65, 12), mullion);
    ring.position.y = cy;
    ant3.add(ring);
  }

  group.add(ant3);
  pieces.push({
    id: 'z4_antenna_stage_3',
    label: 'Antenna Mast Stage 3 — UHF/FM Transmission Collar (382–412 m)',
    object3D: ant3,
    phase: 8,
    span: [8.60, 9.10],
    category: 'permanent',
    yMin: 382.0,
    yMax: 412.0,
  });

  // Stage 4: Topmost Spire Needle, Aviation Crown & Lightning Rod (412 m .. 435 m)
  const ant4 = new THREE.Group();
  ant4.name = 'z4_antenna_stage_4_tip';

  const spireTube = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.88, 18.0, 10), cladding);
  spireTube.position.y = 421.0;
  ant4.add(spireTube);

  const lightningRod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.28, 5.0, 8), gold);
  lightningRod.position.y = 432.5;
  ant4.add(lightningRod);

  const finialSphere = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), gold);
  finialSphere.position.y = 430.2;
  ant4.add(finialSphere);

  group.add(ant4);
  pieces.push({
    id: 'z4_antenna_stage_4_tip',
    label: 'Antenna Mast Stage 4 — 435 m Spire & Lightning Arrestor',
    object3D: ant4,
    phase: 8,
    span: [9.04, 9.55],
    category: 'permanent',
    yMin: 412.0,
    yMax: 435.0,
  });

  // Gentle living summit ambient hook (rotates the 276 m revolving restaurant ring subtly!)
  function updateSummitAmbient(elapsedSec, step) {
    if (step < 9.5) return;
    const root = group.parent;
    if (!root) return;
    const rotRing = root.getObjectByName('milad_revolving_restaurant_ring');
    if (rotRing) {
      // Real restaurant makes 1 full revolution/hour; accelerated subtly so motion is perceptible in showcase
      rotRing.rotation.y = (elapsedSec * 0.08) % (Math.PI * 2);
    }
  }

  return {
    zoneId: 'zone4_upper_shaft_summit',
    group,
    pieces,
    updateSummitAmbient,
    stats: {
      pieceCount: pieces.length,
    },
  };
}
