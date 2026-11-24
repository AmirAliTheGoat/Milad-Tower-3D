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
  // 1. 302–315 m Faceted Glass-and-Steel Sky Dome
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
    span: [9.85, 10.55],
    category: 'permanent',
    yMin: 302.5,
    yMax: 315.4,
  });

  // ---------------------------------------------------------------------------
  // 2. 120-Meter Four-Stage Steel Antenna Mast (315 m .. 435 m, erected 2006–2007)
  // ---------------------------------------------------------------------------

  // Stage 1: Heavy Steel Mast Base & Telecom Maintenance Platforms (315 m .. 350 m)
  const ant1 = new THREE.Group();
  ant1.name = 'z4_antenna_stage_1';

  const core1 = new THREE.Mesh(new THREE.CylinderGeometry(2.65, 3.85, 35.0, 12), steel);
  core1.position.y = 332.5;
  ant1.add(core1);

  // Exterior stiffening ribs + microwave platform rings at 326 m and 348 m
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.28, 34.0, 0.55), mullion);
    fin.position.set(Math.cos(a) * 3.3, 332.5, Math.sin(a) * 3.3);
    fin.rotation.y = -a;
    ant1.add(fin);
  }
  for (const [py, pr] of [
    [326.0, 4.9],
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

  // Parabolic microwave dishes around 326 m platform
  const dishGeo = new THREE.CylinderGeometry(1.1, 0.25, 0.45, 12);
  dishGeo.rotateX(Math.PI / 2);
  const dishInst = new THREE.InstancedMesh(dishGeo, cladding, 8);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 4.5, 327.2, Math.sin(a) * 4.5);
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
    label: 'Antenna Mast Stage 1 — Heavy Base & Microwave Ring (315–350 m)',
    object3D: ant1,
    phase: 7,
    span: [7.15, 7.62],
    category: 'permanent',
    yMin: 315.0,
    yMax: 350.0,
  });

  // Stage 2: Second Tapered Broadcast Section (350 m .. 382 m)
  const ant2 = new THREE.Group();
  ant2.name = 'z4_antenna_stage_2';

  const core2 = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 2.55, 32.0, 12), steel);
  core2.position.y = 366.0;
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
    label: 'Antenna Mast Stage 2 — Broadcast Dipole Array (350–382 m)',
    object3D: ant2,
    phase: 7,
    span: [7.58, 8.02],
    category: 'permanent',
    yMin: 350.0,
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
    phase: 7,
    span: [7.98, 8.42],
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
    phase: 7,
    span: [8.38, 8.80],
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
