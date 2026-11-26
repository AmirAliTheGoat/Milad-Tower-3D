/**
 * Milad Tower (Borj-e Milad) — Zone 1: Geotechnical Excavation, 66 m Rebar Mat, Transition Pedestal & V-Strut Lobby
 * Elevation range: -14 m .. +27 m (1:1 metric scale)
 *
 * Verified architectural & structural facts:
 *   - 14 m deep open circular seismic excavation on Gisha Hilltop (1997–1999) with SW concrete apron bays
 *   - 66 m diameter circular dense radial & concentric rebar cage & concrete mat foundation (1999) + rim batching silos
 *   - Conical transition pedestal with 16 radial shear buttress ribs & starter rebar dowels (1999–2000)
 *   - 6-story Iranian geometric base lobby (~17,000 m² floor area, rising to ~27 m) with
 *     bold exposed diagonal V-struts supporting the flared circular upper galleries above a recessed glazed court
 */

export async function buildZone({ THREE, materials }) {
  const group = new THREE.Group();
  group.name = 'zone1_foundations_piers1';

  const concrete = materials.miladConcrete || materials.concreteSub;
  const concreteDark = materials.miladConcreteRib || materials.concreteSub;
  const travertine = materials.miladTravertine || materials.masonryAshlar;
  const steel = materials.miladHeadSteel || materials.craneSteel;
  const craneSteel = materials.miladCraneSteel || materials.craneSteel;
  const mullion = materials.miladDarkMullion || materials.ironCast;
  const glass = materials.miladTurquoiseGlass || materials.glass1889;

  const pieces = [];
  const dummy = new THREE.Object3D();

  const addStrut = (parent, pA, pB, radius, mat) => {
    const dir = new THREE.Vector3().subVectors(pB, pA);
    const len = dir.length();
    if (len < 0.05) return;
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 8), mat);
    mesh.position.copy(pA).add(pB).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    parent.add(mesh);
  };

  // ---------------------------------------------------------------------------
  // 1. 66 m Open Circular Geotechnical Excavation Pit & Retaining Shoring (1997–1999)
  // ---------------------------------------------------------------------------
  const excavationGroup = new THREE.Group();
  excavationGroup.name = 'z1_excavation_pit';

  // True thick hollow retaining shotcrete wall around the 14 m circular pit (LatheGeometry so inner face
  // has inward-facing outward normals — completely open in center, zero backface culling, zero solid cap!)
  const wallProfile = [
    new THREE.Vector2(33.4, -14.1),
    new THREE.Vector2(35.0, 0.0),
    new THREE.Vector2(35.0, 0.72),
    new THREE.Vector2(37.8, 0.72),
    new THREE.Vector2(38.4, -0.25),
    new THREE.Vector2(36.4, -14.1),
    new THREE.Vector2(33.4, -14.1),
  ];
  const pitWall = new THREE.Mesh(new THREE.LatheGeometry(wallProfile, 56), concreteDark);
  excavationGroup.add(pitWall);

  // Horizontal geotechnical strata / shotcrete tie-back waler bands along the inner retaining wall
  for (const [wy, wr] of [
    [-3.4, 34.55],
    [-7.0, 34.15],
    [-10.6, 33.75],
  ]) {
    const waler = new THREE.Mesh(new THREE.TorusGeometry(wr, 0.28, 6, 56), mullion);
    waler.rotation.x = Math.PI / 2;
    waler.position.y = wy;
    excavationGroup.add(waler);
  }

  // Graded earthen pit floor bed (`y = -14.2 .. -13.7 m`)
  const pitFloor = new THREE.Mesh(
    new THREE.CylinderGeometry(33.6, 33.8, 0.5, 48),
    travertine
  );
  pitFloor.position.y = -14.0;
  excavationGroup.add(pitFloor);

  // Shoring soldier-pile ribs ringing the interior of the 14 m shotcrete wall
  const pileGeo = new THREE.BoxGeometry(0.65, 13.6, 0.95);
  const pileInst = new THREE.InstancedMesh(pileGeo, steel, 48);
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 34.1, -7.0, Math.sin(a) * 34.1);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    pileInst.setMatrixAt(i, dummy.matrix);
  }
  pileInst.instanceMatrix.needsUpdate = true;
  pileInst.computeBoundingSphere();
  excavationGroup.add(pileInst);

  group.add(excavationGroup);
  pieces.push({
    id: 'z1_excavation_pit',
    label: '14 m Deep Open Circular Seismic Excavation & Retaining Shoring',
    object3D: excavationGroup,
    phase: 0,
    span: [0.0, 0.44],
    category: 'permanent',
    yMin: -14.3,
    yMax: 0.8,
  });

  // ---------------------------------------------------------------------------
  // 1b. Early Excavation Concrete Apron Bays, Rebar Stubs & Soil Berm (Stop 1, vanishes before Stop 2)
  // ---------------------------------------------------------------------------
  const excavBaysGroup = new THREE.Group();
  excavBaysGroup.name = 'z1_temp_excavation_bays';

  // Foreground structural concrete starter bays along the SW/W excavation edge (matching Stop 1 photo)
  for (let i = 0; i < 5; i++) {
    const bx = -24.0 + i * 6.4;
    const bz = 17.5 + i * 1.9;
    const bayWall = new THREE.Mesh(new THREE.BoxGeometry(5.6, 5.4, 7.2), concrete);
    bayWall.position.set(bx, -11.1, bz);
    bayWall.rotation.y = 0.34;
    excavBaysGroup.add(bayWall);

    // Recessed darker interior formwork shadow & protruding vertical starter rebar stubs
    const bayTop = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.55, 6.4), concreteDark);
    bayTop.position.set(bx, -8.25, bz);
    bayTop.rotation.y = 0.34;
    excavBaysGroup.add(bayTop);
  }

  // Vertical rebar starter stubs along the concrete bays
  const bayStubGeo = new THREE.BoxGeometry(0.16, 2.8, 0.16);
  const bayStubInst = new THREE.InstancedMesh(bayStubGeo, mullion, 40);
  let bsIdx = 0;
  for (let i = 0; i < 5; i++) {
    const bx = -24.0 + i * 6.4;
    const bz = 17.5 + i * 1.9;
    for (let k = 0; k < 8; k++) {
      const lx = ((k % 4) - 1.5) * 1.3;
      const lz = (Math.floor(k / 4) - 0.5) * 4.4;
      dummy.position.set(bx + lx, -7.2, bz + lz);
      dummy.rotation.set(0, 0.34, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      bayStubInst.setMatrixAt(bsIdx++, dummy.matrix);
    }
  }
  bayStubInst.instanceMatrix.needsUpdate = true;
  bayStubInst.computeBoundingSphere();
  excavBaysGroup.add(bayStubInst);

  // Stacked timber/steel site materials & soil ramp berm inside the pit floor
  const soilBerm = new THREE.Mesh(new THREE.ConeGeometry(11.5, 4.6, 9), concreteDark);
  soilBerm.scale.set(1.5, 1.0, 0.9);
  soilBerm.position.set(-15.5, -12.1, -6.5);
  excavBaysGroup.add(soilBerm);

  for (let s = 0; s < 3; s++) {
    const stack = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.85, 2.2), steel);
    stack.position.set(4.5 + s * 3.8, -13.3, 4.0 - s * 3.5);
    stack.rotation.y = 0.45 + s * 0.25;
    excavBaysGroup.add(stack);
  }

  group.add(excavBaysGroup);
  pieces.push({
    id: 'z1_temp_excavation_bays',
    label: 'Excavation Floor Concrete Apron Bays & Work Ramp (1997–1999)',
    object3D: excavBaysGroup,
    phase: 0,
    span: [0.06, 0.46],
    vanishSpan: [0.64, 0.88],
    category: 'temporary_falsework',
    yMin: -14.0,
    yMax: -5.5,
  });

  // ---------------------------------------------------------------------------
  // 2. 66 m Foundation Mat Blinding & Dense Circular + Octagonal Rebar Cage (1999)
  // ---------------------------------------------------------------------------
  const matGroup = new THREE.Group();
  matGroup.name = 'z1_foundation_mat';

  // Primary 66 m diameter concrete blinding slab (`y = -13.9 .. -12.6 m`)
  const matSlab = new THREE.Mesh(
    new THREE.CylinderGeometry(33.1, 33.1, 1.3, 48),
    concrete
  );
  matSlab.position.y = -13.25;
  matGroup.add(matSlab);

  // Dense radial bottom rebar grid across the 66 m circular mat floor (Stop 2 signature visual)
  const floorBars = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const midR = 20.5;
    floorBars.push([Math.cos(a) * midR, -12.45, Math.sin(a) * midR, 23.0, 0.16, 0.18, -a]);
  }
  const floorBarGeo = new THREE.BoxGeometry(1, 1, 1);
  const floorBarInst = new THREE.InstancedMesh(floorBarGeo, mullion, floorBars.length);
  for (let i = 0; i < floorBars.length; i++) {
    const [x, y, z, sx, sy, sz, ry] = floorBars[i];
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, ry, 0);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    floorBarInst.setMatrixAt(i, dummy.matrix);
  }
  floorBarInst.instanceMatrix.needsUpdate = true;
  floorBarInst.computeBoundingSphere();
  matGroup.add(floorBarInst);

  // Concentric bottom mat rebar rings across the floor
  for (const rFloor of [14.0, 17.0, 20.0, 23.0, 26.0, 29.0, 31.6]) {
    const fHoop = new THREE.Mesh(new THREE.TorusGeometry(rFloor, 0.16, 5, 48), mullion);
    fHoop.rotation.x = Math.PI / 2;
    fHoop.position.y = -12.38;
    matGroup.add(fHoop);
  }

  // Dense concentric vertical steel rebar curtains:
  //   - Outer circular mat perimeter ring (r = 28.5 m)
  //   - Middle circular transfer ring (r = 21.8 m)
  //   - Inner OCTAGONAL core wall rebar cage (r = 12.6 m, matching Stop 2 photo!)
  const rebarBars = [];
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    rebarBars.push([Math.cos(a) * 28.4, -9.8, Math.sin(a) * 28.4, 0.22, 5.2, 0.22, -a]);
  }
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    rebarBars.push([Math.cos(a) * 21.4, -9.0, Math.sin(a) * 21.4, 0.24, 6.8, 0.24, -a]);
  }
  // Octagonal inner wall rebar curtain (8 flat sides × 10 bars per side = 80 dense vertical bars)
  const octR = 12.8;
  for (let side = 0; side < 8; side++) {
    const a0 = (side / 8) * Math.PI * 2 + Math.PI / 8;
    const a1 = ((side + 1) / 8) * Math.PI * 2 + Math.PI / 8;
    const x0 = Math.cos(a0) * octR;
    const z0 = Math.sin(a0) * octR;
    const x1 = Math.cos(a1) * octR;
    const z1 = Math.sin(a1) * octR;
    for (let k = 0; k < 10; k++) {
      const t = k / 10;
      const rx = x0 + (x1 - x0) * t;
      const rz = z0 + (z1 - z0) * t;
      rebarBars.push([rx, -7.8, rz, 0.24, 9.2, 0.24, -a0]);
    }
  }

  const rebarGeo = new THREE.BoxGeometry(1, 1, 1);
  const rebarInst = new THREE.InstancedMesh(rebarGeo, mullion, rebarBars.length);
  for (let i = 0; i < rebarBars.length; i++) {
    const [x, y, z, sx, sy, sz, ry] = rebarBars[i];
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, ry, 0);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    rebarInst.setMatrixAt(i, dummy.matrix);
  }
  rebarInst.instanceMatrix.needsUpdate = true;
  rebarInst.computeBoundingSphere();
  matGroup.add(rebarInst);

  // Horizontal rebar hoop ties around the circular & octagonal cages
  for (const [hr, hy, segs] of [
    [28.4, -8.0, 48],
    [28.4, -9.8, 48],
    [28.4, -11.2, 48],
    [21.4, -6.5, 48],
    [21.4, -8.8, 48],
    [21.4, -10.8, 48],
    [12.4, -4.2, 8],
    [12.4, -6.6, 8],
    [12.4, -9.0, 8],
  ]) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(hr, 0.20, 6, segs), mullion);
    hoop.rotation.x = Math.PI / 2;
    if (segs === 8) hoop.rotation.z = Math.PI / 8;
    hoop.position.y = hy;
    matGroup.add(hoop);
  }

  group.add(matGroup);
  pieces.push({
    id: 'z1_foundation_mat',
    label: '66 m Foundation Mat Slab & Seismic Rebar Cage',
    object3D: matGroup,
    phase: 1,
    span: [0.55, 1.05],
    category: 'permanent',
    yMin: -13.9,
    yMax: -3.0,
  });

  // ---------------------------------------------------------------------------
  // 2b. Twin Rim Cement Batching Silos (visible on upper-left rim in Stops 2 & 3 photos)
  // ---------------------------------------------------------------------------
  const silosGroup = new THREE.Group();
  silosGroup.name = 'z1_temp_batching_silos';

  const siloPositions = [
    [-47.0, 0.0, -8.0, 18.5, 2.5],
    [-43.0, 0.0, -18.5, 15.5, 2.1],
    [-39.5, 0.0, -21.5, 15.0, 2.0],
  ];
  for (const [sx, sy, sz, sh, sr] of siloPositions) {
    // Support steel leg base
    const base = new THREE.Mesh(new THREE.BoxGeometry(sr * 2.1, 4.2, sr * 2.1), mullion);
    base.position.set(sx, sy + 2.1, sz);
    silosGroup.add(base);

    // Tall cylindrical cement silo drum
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(sr, sr, sh - 4.2, 16), craneSteel);
    drum.position.set(sx, sy + 4.2 + (sh - 4.2) * 0.5, sz);
    silosGroup.add(drum);

    // Conical hopper bottom & top cap
    const cap = new THREE.Mesh(new THREE.ConeGeometry(sr * 1.02, 1.8, 16), concreteDark);
    cap.position.set(sx, sy + sh + 0.9, sz);
    silosGroup.add(cap);
  }

  // Batching plant mixer hopper & aggregate conveyor beside silos
  const plantHouse = new THREE.Mesh(new THREE.BoxGeometry(10.5, 5.2, 7.0), concreteDark);
  plantHouse.position.set(-45.5, 2.6, -13.5);
  plantHouse.rotation.y = 0.25;
  silosGroup.add(plantHouse);

  group.add(silosGroup);
  pieces.push({
    id: 'z1_temp_batching_silos',
    label: 'Gisha Site Concrete Batching Silos (1999–2001)',
    object3D: silosGroup,
    phase: 1,
    span: [0.54, 0.86],
    vanishSpan: [2.20, 2.75],
    category: 'temporary_falsework',
    yMin: 0.0,
    yMax: 21.0,
  });

  // ---------------------------------------------------------------------------
  // 3. Conical Transition Pedestal & 16 Radial Shear Buttresses (1999–2000)
  // ---------------------------------------------------------------------------
  const pedestalGroup = new THREE.Group();
  pedestalGroup.name = 'z1_transition_pedestal';

  // Full 4.3 m thick poured reinforced concrete foundation mat (`y = -13.5 .. -9.2 m`)
  const pouredMat = new THREE.Mesh(
    new THREE.CylinderGeometry(32.8, 33.0, 4.3, 48),
    concrete
  );
  pouredMat.position.y = -11.35;
  pedestalGroup.add(pouredMat);

  // Exposed perimeter rebar ring around the poured circular mat edge (visible in Stop 3 photo)
  for (const [pr, py] of [
    [31.4, -8.5],
    [30.5, -8.8],
    [29.6, -8.5],
  ]) {
    const pRing = new THREE.Mesh(new THREE.TorusGeometry(pr, 0.24, 6, 48), mullion);
    pRing.rotation.x = Math.PI / 2;
    pRing.position.y = py;
    pedestalGroup.add(pRing);
  }

  // 16-sided conical load-transfer transition pedestal rising from mat (`-9.2 .. +0.6 m`)
  const pedestalCone = new THREE.Mesh(
    new THREE.CylinderGeometry(16.4, 28.4, 9.8, 16),
    concrete
  );
  pedestalCone.position.y = -4.3;
  pedestalGroup.add(pedestalCone);

  // 16 Radial structural shear buttress ribs transferring shaft loads to 66 m mat
  const ribGeo = new THREE.BoxGeometry(1.45, 9.4, 13.6);
  const ribInst = new THREE.InstancedMesh(ribGeo, concreteDark, 16);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 22.4, -4.5, Math.sin(a) * 22.4);
    dummy.rotation.set(0, -a + Math.PI * 0.5, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    ribInst.setMatrixAt(i, dummy.matrix);
  }
  ribInst.instanceMatrix.needsUpdate = true;
  ribInst.computeBoundingSphere();
  pedestalGroup.add(ribInst);

  // Perimeter formwork walkway collar & sloping timber formwork ribs around cone top
  const radialWalk = new THREE.Mesh(
    new THREE.TorusGeometry(24.2, 0.72, 6, 32),
    steel
  );
  radialWalk.rotation.x = Math.PI / 2;
  radialWalk.position.y = -2.6;
  pedestalGroup.add(radialWalk);

  const upperCollarWalk = new THREE.Mesh(
    new THREE.TorusGeometry(17.6, 0.55, 6, 32),
    steel
  );
  upperCollarWalk.rotation.x = Math.PI / 2;
  upperCollarWalk.position.y = 0.2;
  pedestalGroup.add(upperCollarWalk);

  // Dense vertical starter rebar dowels projecting from pedestal crown (`y = 0.6 .. 6.2 m`, matching Stop 3 photo)
  const dowelGeo = new THREE.BoxGeometry(0.18, 5.6, 0.18);
  const dowelInst = new THREE.InstancedMesh(dowelGeo, mullion, 64);
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const dr = i % 2 === 0 ? 13.6 : 11.4;
    dummy.position.set(Math.cos(a) * dr, 3.2, Math.sin(a) * dr);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    dowelInst.setMatrixAt(i, dummy.matrix);
  }
  dowelInst.instanceMatrix.needsUpdate = true;
  dowelInst.computeBoundingSphere();
  pedestalGroup.add(dowelInst);

  group.add(pedestalGroup);
  pieces.push({
    id: 'z1_transition_pedestal',
    label: 'Conical Load-Transfer Pedestal & 16 Radial Buttresses',
    object3D: pedestalGroup,
    phase: 1,
    span: [1.12, 1.45],
    category: 'permanent',
    yMin: -13.5,
    yMax: 6.2,
  });

  // ---------------------------------------------------------------------------
  // 4. 6-Story Base Lobby Structural Frame & Exposed Diagonal V-Struts (0 .. 26 m)
  //    (Built AFTER the 315 m shaft & steel head basket; V-struts stay exposed on completion!)
  // ---------------------------------------------------------------------------
  const lobbyVStrutGroup = new THREE.Group();
  lobbyVStrutGroup.name = 'z1_lobby_vstrut_frame';

  // Grade podium slab capping the pit (`y = 0.0 .. 1.6 m`, r = 42 m)
  const podiumDeck = new THREE.Mesh(
    new THREE.CylinderGeometry(41.5, 43.5, 1.6, 24),
    travertine
  );
  podiumDeck.position.y = 0.8;
  lobbyVStrutGroup.add(podiumDeck);

  // Recessed octagonal inner structural lobby core (`r = 25.5 m` -> well inside the `r = 35.8 m` V-strut ring)
  const innerCore = new THREE.Mesh(
    new THREE.CylinderGeometry(25.2, 26.8, 16.0, 16),
    concreteDark
  );
  innerCore.position.y = 9.6;
  lobbyVStrutGroup.add(innerCore);

  // Horizontal circular structural deck belt supporting the V-strut crown (`y = 17.8 m`, `r = 35.8 m`)
  const vStrutRingSlab = new THREE.Mesh(
    new THREE.CylinderGeometry(36.0, 35.2, 1.8, 32),
    concrete
  );
  vStrutRingSlab.position.y = 17.8;
  lobbyVStrutGroup.add(vStrutRingSlab);

  // Lower horizontal tension ring beam at the foot of the V-struts (`y = 2.0 m`, `r = 28.4 m`)
  const vFootRing = new THREE.Mesh(
    new THREE.TorusGeometry(28.5, 0.72, 6, 32),
    concrete
  );
  vFootRing.rotation.x = Math.PI / 2;
  vFootRing.position.y = 2.2;
  lobbyVStrutGroup.add(vFootRing);

  // 16 Bold Pairs of Exposed Diagonal V-Struts (Signature Milad Base Architecture!)
  const V_COUNT = 16;
  for (let i = 0; i < V_COUNT; i++) {
    const aMid = (i / V_COUNT) * Math.PI * 2;
    const aLeft = ((i - 0.45) / V_COUNT) * Math.PI * 2;
    const aRight = ((i + 0.45) / V_COUNT) * Math.PI * 2;

    const pBot = new THREE.Vector3(Math.cos(aMid) * 28.4, 1.8, Math.sin(aMid) * 28.4);
    const pTopL = new THREE.Vector3(Math.cos(aLeft) * 35.4, 17.4, Math.sin(aLeft) * 35.4);
    const pTopR = new THREE.Vector3(Math.cos(aRight) * 35.4, 17.4, Math.sin(aRight) * 35.4);

    addStrut(lobbyVStrutGroup, pBot, pTopL, 0.88, concrete);
    addStrut(lobbyVStrutGroup, pBot, pTopR, 0.88, concrete);
  }

  // Upper structural skeleton columns & ring beam (`y = 18.5 .. 26.2 m`) visible before cladding
  const upperSkeletonRing = new THREE.Mesh(
    new THREE.TorusGeometry(34.6, 0.65, 6, 32),
    concreteDark
  );
  upperSkeletonRing.rotation.x = Math.PI / 2;
  upperSkeletonRing.position.y = 25.8;
  lobbyVStrutGroup.add(upperSkeletonRing);

  const skelColGeo = new THREE.BoxGeometry(0.75, 7.6, 0.95);
  const skelColInst = new THREE.InstancedMesh(skelColGeo, steel, 32);
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 34.4, 22.0, Math.sin(a) * 34.4);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    skelColInst.setMatrixAt(i, dummy.matrix);
  }
  skelColInst.instanceMatrix.needsUpdate = true;
  skelColInst.computeBoundingSphere();
  lobbyVStrutGroup.add(skelColInst);

  group.add(lobbyVStrutGroup);
  pieces.push({
    id: 'z1_lobby_vstrut_frame',
    label: '6-Story Base Lobby Structural Core & Exposed Diagonal V-Struts',
    object3D: lobbyVStrutGroup,
    phase: 5,
    span: [5.25, 6.18],
    category: 'permanent',
    yMin: 0.0,
    yMax: 26.5,
  });

  // ---------------------------------------------------------------------------
  // 4b. Unfinished Upper Lobby Perimeter Rebar & Scaffolding Crown (Stop 6, vanishes as lobby encloses)
  // ---------------------------------------------------------------------------
  const lobbyRebarGroup = new THREE.Group();
  lobbyRebarGroup.name = 'z1_temp_lobby_rebar';

  // Dense vertical rebar & scaffolding uprights rising above the V-strut ring (`y = 18.5 .. 27.2 m`)
  const lRebarGeo = new THREE.BoxGeometry(0.18, 8.6, 0.18);
  const lRebarInst = new THREE.InstancedMesh(lRebarGeo, mullion, 128);
  for (let i = 0; i < 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    const rad = i % 2 === 0 ? 35.6 : 33.8;
    const hJitter = 0.85 + ((i * 7) % 5) * 0.08;
    dummy.position.set(Math.cos(a) * rad, 18.6 + 4.3 * hJitter, Math.sin(a) * rad);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, hJitter, 1);
    dummy.updateMatrix();
    lRebarInst.setMatrixAt(i, dummy.matrix);
  }
  lRebarInst.instanceMatrix.needsUpdate = true;
  lRebarInst.computeBoundingSphere();
  lobbyRebarGroup.add(lRebarInst);

  // Horizontal tubular scaffolding ledger rings encircling the unfinished upper lobby
  for (const hy of [20.0, 22.0, 24.0, 25.8]) {
    const scafRing = new THREE.Mesh(new THREE.TorusGeometry(35.8, 0.16, 5, 48), mullion);
    scafRing.rotation.x = Math.PI / 2;
    scafRing.position.y = hy;
    lobbyRebarGroup.add(scafRing);
  }

  group.add(lobbyRebarGroup);
  pieces.push({
    id: 'z1_temp_lobby_rebar',
    label: 'Unfinished Upper Lobby Rebar & Scaffolding Crown (2003–2005)',
    object3D: lobbyRebarGroup,
    phase: 5,
    span: [5.40, 6.10],
    vanishSpan: [7.60, 8.15],
    category: 'temporary_falsework',
    yMin: 18.4,
    yMax: 27.6,
  });

  // ---------------------------------------------------------------------------
  // 5. Base Lobby Enclosure, Glazed Curtain Galleries & 27 m Roof Terrace (0 .. 27.8 m)
  // ---------------------------------------------------------------------------
  const lobbyCrownGroup = new THREE.Group();
  lobbyCrownGroup.name = 'z1_lobby_crown_terrace';

  // Recessed glazed entrance court curtain wall behind the exposed V-struts (`r = 27.0 m`)
  const lowerRecessedGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(26.6, 27.6, 15.6, 24, 1, true),
    glass
  );
  lowerRecessedGlass.position.y = 9.4;
  lobbyCrownGroup.add(lowerRecessedGlass);

  // 4 Monumental Iranian Geometric Entrance Portals (N, S, E, W)
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const portal = new THREE.Group();
    portal.rotation.y = a;

    const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(14.8, 12.2, 5.4), travertine);
    frameOuter.position.set(0, 7.6, 30.8);
    portal.add(frameOuter);

    const frameRecess = new THREE.Mesh(new THREE.BoxGeometry(10.8, 9.4, 5.8), mullion);
    frameRecess.position.set(0, 6.4, 30.9);
    portal.add(frameRecess);

    const portalGlass = new THREE.Mesh(new THREE.BoxGeometry(9.8, 8.6, 0.4), glass);
    portalGlass.position.set(0, 6.2, 33.6);
    portal.add(portalGlass);

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(16.6, 0.85, 5.2), steel);
    canopy.position.set(0, 12.0, 34.4);
    portal.add(canopy);

    lobbyCrownGroup.add(portal);
  }

  // Upper flared circular lobby gallery glazing & cornice bands (y = 18.4 .. 25.8 m)
  const upperBandBase = new THREE.Mesh(
    new THREE.CylinderGeometry(36.2, 35.2, 2.2, 32),
    materials.miladHeadCladding || travertine
  );
  upperBandBase.position.y = 19.4;
  lobbyCrownGroup.add(upperBandBase);

  const upperGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(35.4, 35.8, 4.8, 32, 1, true),
    glass
  );
  upperGlass.position.y = 22.9;
  lobbyCrownGroup.add(upperGlass);

  const uMulGeo = new THREE.BoxGeometry(0.4, 5.0, 0.65);
  const uMulInst = new THREE.InstancedMesh(uMulGeo, mullion, 32);
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 35.7, 22.9, Math.sin(a) * 35.7);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    uMulInst.setMatrixAt(i, dummy.matrix);
  }
  uMulInst.instanceMatrix.needsUpdate = true;
  uMulInst.computeBoundingSphere();
  lobbyCrownGroup.add(uMulInst);

  // Finished stepped 27 m roof slab & shaft collar parapet
  const roofCap = new THREE.Mesh(
    new THREE.CylinderGeometry(33.4, 35.8, 1.8, 32),
    travertine
  );
  roofCap.position.y = 26.2;
  lobbyCrownGroup.add(roofCap);

  const roofParapet = new THREE.Mesh(
    new THREE.CylinderGeometry(24.5, 27.5, 1.4, 16),
    concreteDark
  );
  roofParapet.position.y = 27.3;
  lobbyCrownGroup.add(roofParapet);

  group.add(lobbyCrownGroup);
  pieces.push({
    id: 'z1_lobby_crown_terrace',
    label: 'Base Lobby Curtain Glazing, Portals & 27 m Terrace',
    object3D: lobbyCrownGroup,
    phase: 8,
    span: [7.80, 9.20],
    category: 'permanent',
    yMin: 0.0,
    yMax: 28.0,
  });

  return {
    zoneId: 'zone1_foundations_piers1',
    group,
    pieces,
    stats: {
      pieceCount: pieces.length,
    },
  };
}
