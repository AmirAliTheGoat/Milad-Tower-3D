/**
 * Milad Tower (Borj-e Milad) — Zone 3: 12-Story Steel & Glass Head Structure
 * Elevation range: 247 m .. 303 m (1:1 metric scale; max diameter 60 m at 280 m)
 *
 * Verified architectural & structural facts:
 *   - 12-story steel-and-concrete head pod (~25,000 tons total weight, 12,000 m² floor area —
 *     the largest floor area of any telecommunications tower head in the world at completion)
 *   - Transition collar at 247 m transferring radial loads onto the 315 m concrete shaft
 *   - Iranian geometric basket-like inverted-trapezoid diagrid lower steel frame (247 m .. 276 m)
 *   - 276 m Revolving Restaurant (rotating panoramic floor ring completing 1 revolution/hour)
 *   - 280 m Open-Air Observation Deck (60 m maximum exterior diameter with perimeter promenade)
 *   - 284 m Cafeteria, 288 m Telecom/VIP, 292 m Enclosed Observation Deck, 297 m Mechanical Crown
 */

export async function buildZone({ THREE, materials }) {
  const group = new THREE.Group();
  group.name = 'zone3_middle_floor2_merger';

  const steel = materials.miladHeadSteel || materials.craneSteel;
  const cladding = materials.miladHeadCladding || materials.miladConcrete;
  const concreteRib = materials.miladConcreteRib || materials.concreteSub;
  const mullion = materials.miladDarkMullion || materials.ironCast;
  const glass = materials.miladTurquoiseGlass || materials.glass1889;
  const gold = materials.goldAccent || cladding;

  const pieces = [];
  const dummy = new THREE.Object3D();

  // Helper to place a structural strut cylinder between two 3D points
  const addStrut = (parent, pA, pB, radius, mat) => {
    const dir = new THREE.Vector3().subVectors(pB, pA);
    const len = dir.length();
    if (len < 0.05) return;
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 6), mat);
    mesh.position.copy(pA).add(pB).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    parent.add(mesh);
  };

  // ---------------------------------------------------------------------------
  // 1. Structural Transition Collar & Corbel Ring (247 m .. 256 m)
  // ---------------------------------------------------------------------------
  const collarGroup = new THREE.Group();
  collarGroup.name = 'z3_head_transition_collar';

  const baseCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(16.2, 11.4, 9.0, 16),
    steel
  );
  baseCollar.position.y = 251.5;
  collarGroup.add(baseCollar);

  // 16 Radial steel corbel haunches gripping the concrete shaft
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const pBot = new THREE.Vector3(Math.cos(a) * 10.6, 246.8, Math.sin(a) * 10.6);
    const pTop = new THREE.Vector3(Math.cos(a) * 16.5, 256.2, Math.sin(a) * 16.5);
    addStrut(collarGroup, pBot, pTop, 0.52, steel);
  }

  group.add(collarGroup);
  pieces.push({
    id: 'z3_head_transition_collar',
    label: '247 m Structural Steel Transition Collar & Corbel Brackets',
    object3D: collarGroup,
    phase: 5,
    span: [4.88, 5.42],
    category: 'permanent',
    yMin: 246.5,
    yMax: 256.5,
  });

  // ---------------------------------------------------------------------------
  // 2. 12-Story Lower Basket Diagrid Steel Truss Frame (255 m .. 278 m, r -> 30 m)
  // ---------------------------------------------------------------------------
  const basketSteelGroup = new THREE.Group();
  basketSteelGroup.name = 'z3_head_lower_basket_steel';

  const N_SIDES = 16;
  const LEVELS = [
    { y: 255.5, r: 16.2 },
    { y: 263.0, r: 21.4 },
    { y: 270.5, r: 26.2 },
    { y: 276.0, r: 29.6 },
  ];

  for (let li = 0; li < LEVELS.length; li++) {
    const { y, r } = LEVELS[li];
    // Horizontal ring girder & floor deck plate
    const ringDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(r - 0.5, r - 0.5, 0.85, N_SIDES),
      concreteRib
    );
    ringDeck.position.y = y;
    basketSteelGroup.add(ringDeck);

    for (let i = 0; i < N_SIDES; i++) {
      const a0 = (i / N_SIDES) * Math.PI * 2;
      const a1 = ((i + 1) / N_SIDES) * Math.PI * 2;
      const p0 = new THREE.Vector3(Math.cos(a0) * r, y, Math.sin(a0) * r);
      const p1 = new THREE.Vector3(Math.cos(a1) * r, y, Math.sin(a1) * r);
      addStrut(basketSteelGroup, p0, p1, 0.38, steel);

      if (li < LEVELS.length - 1) {
        const next = LEVELS[li + 1];
        const aMid = ((i + 0.5) / N_SIDES) * Math.PI * 2;
        const pNext0 = new THREE.Vector3(Math.cos(a0) * next.r, next.y, Math.sin(a0) * next.r);
        const pNext1 = new THREE.Vector3(Math.cos(a1) * next.r, next.y, Math.sin(a1) * next.r);
        const pNextMid = new THREE.Vector3(Math.cos(aMid) * next.r, next.y, Math.sin(aMid) * next.r);

        // Signature Iranian diamond / muqarnas diagrid basket struts
        addStrut(basketSteelGroup, p0, pNext0, 0.42, steel);
        addStrut(basketSteelGroup, p0, pNextMid, 0.32, steel);
        addStrut(basketSteelGroup, p1, pNextMid, 0.32, steel);
        addStrut(basketSteelGroup, p0, pNext1, 0.22, mullion);
      }
    }
  }

  group.add(basketSteelGroup);
  pieces.push({
    id: 'z3_head_lower_basket_steel',
    label: 'Heavy-Lift Diagrid Steel Basket Structure (255–276 m)',
    object3D: basketSteelGroup,
    phase: 6,
    span: [5.38, 6.12],
    category: 'permanent',
    yMin: 255.0,
    yMax: 276.5,
  });

  // ---------------------------------------------------------------------------
  // 3. Faceted Iranian Basket Cladding & Technical Floors (255 m .. 274 m)
  // ---------------------------------------------------------------------------
  const claddingGroup = new THREE.Group();
  claddingGroup.name = 'z3_head_basket_cladding';

  // Inner faceted metallic cladding shell wrapping the technical & fire-proof floors
  const lowerClad1 = new THREE.Mesh(
    new THREE.CylinderGeometry(21.1, 15.9, 7.6, 16),
    cladding
  );
  lowerClad1.position.y = 259.2;
  claddingGroup.add(lowerClad1);

  const lowerClad2 = new THREE.Mesh(
    new THREE.CylinderGeometry(25.8, 21.1, 7.4, 16),
    cladding
  );
  lowerClad2.position.y = 266.7;
  claddingGroup.add(lowerClad2);

  // Narrow turquoise ribbon glazing band at 271 m (Art Gallery / VIP Level)
  const vipGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(28.5, 26.2, 3.8, 16, 1, true),
    glass
  );
  vipGlass.position.y = 272.2;
  claddingGroup.add(vipGlass);

  // Architectural faceted crown ribs highlighting the 16-sided geometry
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const pA = new THREE.Vector3(Math.cos(a) * 16.3, 255.5, Math.sin(a) * 16.3);
    const pB = new THREE.Vector3(Math.cos(a) * 29.8, 275.8, Math.sin(a) * 29.8);
    addStrut(claddingGroup, pA, pB, 0.34, mullion);
  }

  group.add(claddingGroup);
  pieces.push({
    id: 'z3_head_basket_cladding',
    label: 'Iranian Geometric Basket Cladding & 271 m Gallery Band',
    object3D: claddingGroup,
    phase: 7,
    span: [6.22, 6.98],
    category: 'permanent',
    yMin: 255.0,
    yMax: 276.0,
  });

  // ---------------------------------------------------------------------------
  // 4. 276 m Revolving Restaurant Drum & 280 m Open Observation Deck (60 m Width)
  // ---------------------------------------------------------------------------
  const restaurantDeckGroup = new THREE.Group();
  restaurantDeckGroup.name = 'z3_head_revolving_restaurant';

  // Revolving restaurant floor slab (276 m, r = 29.6 m -> 59.2 m diameter)
  const restFloor = new THREE.Mesh(
    new THREE.CylinderGeometry(29.8, 29.0, 1.2, 32),
    cladding
  );
  restFloor.position.y = 275.6;
  restaurantDeckGroup.add(restFloor);

  // Rotating interior restaurant seating ring (animated gently in ambient mode)
  const rotatingRing = new THREE.Group();
  rotatingRing.name = 'milad_revolving_restaurant_ring';
  rotatingRing.position.y = 276.5;

  const rotTableGeo = new THREE.BoxGeometry(1.4, 1.2, 2.2);
  const rotTableInst = new THREE.InstancedMesh(rotTableGeo, gold, 24);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 26.2, 0.6, Math.sin(a) * 26.2);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    rotTableInst.setMatrixAt(i, dummy.matrix);
  }
  rotTableInst.instanceMatrix.needsUpdate = true;
  rotTableInst.computeBoundingSphere();
  rotatingRing.add(rotTableInst);
  restaurantDeckGroup.add(rotatingRing);

  // Panoramic glazed curtain wall of the 276 m Revolving Restaurant (y = 276.2 .. 280.0 m)
  const restGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(30.0, 29.6, 3.8, 32, 1, true),
    glass
  );
  restGlass.position.y = 278.1;
  restaurantDeckGroup.add(restGlass);

  // 32 Fine dark vertical mullions around the revolving restaurant panoramic ring
  const rMulGeo = new THREE.BoxGeometry(0.28, 4.0, 0.48);
  const rMulInst = new THREE.InstancedMesh(rMulGeo, mullion, 32);
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 29.9, 278.1, Math.sin(a) * 29.9);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    rMulInst.setMatrixAt(i, dummy.matrix);
  }
  rMulInst.instanceMatrix.needsUpdate = true;
  rMulInst.computeBoundingSphere();
  restaurantDeckGroup.add(rMulInst);

  // 280 m Open-Air Observation Deck (60 m maximum exterior diameter: r = 30.0 m!)
  const openDeckSlab = new THREE.Mesh(
    new THREE.CylinderGeometry(30.2, 30.0, 1.3, 32),
    cladding
  );
  openDeckSlab.position.y = 280.4;
  restaurantDeckGroup.add(openDeckSlab);

  // Open-Air Observation Deck perimeter safety balustrade & wind-guard ring
  const railRing = new THREE.Mesh(
    new THREE.TorusGeometry(29.85, 0.16, 8, 48),
    mullion
  );
  railRing.rotation.x = Math.PI / 2;
  railRing.position.y = 282.35;
  restaurantDeckGroup.add(railRing);

  const railPostGeo = new THREE.BoxGeometry(0.16, 1.5, 0.16);
  const railPostInst = new THREE.InstancedMesh(railPostGeo, mullion, 48);
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 29.85, 281.65, Math.sin(a) * 29.85);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    railPostInst.setMatrixAt(i, dummy.matrix);
  }
  railPostInst.instanceMatrix.needsUpdate = true;
  railPostInst.computeBoundingSphere();
  restaurantDeckGroup.add(railPostInst);

  group.add(restaurantDeckGroup);
  pieces.push({
    id: 'z3_head_revolving_restaurant',
    label: '276 m Revolving Restaurant & 280 m Open Observation Deck (60 m Span)',
    object3D: restaurantDeckGroup,
    phase: 8,
    span: [8.85, 9.55],
    category: 'permanent',
    yMin: 275.0,
    yMax: 282.6,
  });

  // ---------------------------------------------------------------------------
  // 5. Stepped Upper Head Tiers: 284 m Cafeteria, 292 m Enclosed Deck & 297 m Crown (281 .. 303 m)
  // ---------------------------------------------------------------------------
  const upperHeadGroup = new THREE.Group();
  upperHeadGroup.name = 'z3_head_upper_decks_292';

  // Setback inner wall for 284 m Cafeteria & 288 m Telecom/VIP levels
  const tierMidCore = new THREE.Mesh(
    new THREE.CylinderGeometry(26.6, 27.6, 7.6, 16),
    cladding
  );
  tierMidCore.position.y = 284.8;
  upperHeadGroup.add(tierMidCore);

  const tierMidGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(27.4, 27.8, 3.6, 32, 1, true),
    glass
  );
  tierMidGlass.position.y = 285.0;
  upperHeadGroup.add(tierMidGlass);

  // 292 m Enclosed Panoramic Observation Gallery (stepped inward drum)
  const deck292Floor = new THREE.Mesh(
    new THREE.CylinderGeometry(26.4, 27.0, 1.3, 16),
    cladding
  );
  deck292Floor.position.y = 289.2;
  upperHeadGroup.add(deck292Floor);

  const deck292Glass = new THREE.Mesh(
    new THREE.CylinderGeometry(25.2, 26.0, 4.4, 32, 1, true),
    glass
  );
  deck292Glass.position.y = 292.0;
  upperHeadGroup.add(deck292Glass);

  // Mullions around 292 m Enclosed Observation Deck
  const m292Geo = new THREE.BoxGeometry(0.28, 4.6, 0.44);
  const m292Inst = new THREE.InstancedMesh(m292Geo, mullion, 32);
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 25.7, 292.0, Math.sin(a) * 25.7);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    m292Inst.setMatrixAt(i, dummy.matrix);
  }
  m292Inst.instanceMatrix.needsUpdate = true;
  m292Inst.computeBoundingSphere();
  upperHeadGroup.add(m292Inst);

  // Tapered upper mechanical & cornice crown (294.5 m .. 302.5 m)
  const crownStep1 = new THREE.Mesh(
    new THREE.CylinderGeometry(22.4, 25.6, 4.2, 16),
    cladding
  );
  crownStep1.position.y = 296.3;
  upperHeadGroup.add(crownStep1);

  const crownStep2 = new THREE.Mesh(
    new THREE.CylinderGeometry(19.2, 22.0, 4.2, 16),
    steel
  );
  crownStep2.position.y = 300.4;
  upperHeadGroup.add(crownStep2);

  // Fine horizontal architectural cornice bands
  for (const [cy, cr] of [
    [289.6, 26.8],
    [294.4, 25.4],
    [298.5, 22.4],
    [302.4, 19.3],
  ]) {
    const cornice = new THREE.Mesh(
      new THREE.TorusGeometry(cr, 0.28, 6, 32),
      mullion
    );
    cornice.rotation.x = Math.PI / 2;
    cornice.position.y = cy;
    upperHeadGroup.add(cornice);
  }

  group.add(upperHeadGroup);
  pieces.push({
    id: 'z3_head_upper_decks_292',
    label: '292 m Enclosed Observation Deck & Tapered Upper Crown',
    object3D: upperHeadGroup,
    phase: 8,
    span: [9.15, 9.82],
    category: 'permanent',
    yMin: 281.0,
    yMax: 302.6,
  });

  return {
    zoneId: 'zone3_middle_floor2_merger',
    group,
    pieces,
    stats: {
      pieceCount: pieces.length,
    },
  };
}
