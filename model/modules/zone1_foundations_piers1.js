/**
 * Milad Tower (Borj-e Milad) — Zone 1: Geotechnical Excavation, 66 m Foundation Mat & 6-Story Base Lobby
 * Elevation range: -14 m .. +27 m (1:1 metric scale)
 *
 * Verified architectural & structural facts:
 *   - 14 m deep circular seismic excavation on Gisha Hilltop (1997–1999)
 *   - 66 m diameter reinforced concrete mat foundation & conical transition pedestal (1999–2000)
 *   - 6-story Iranian geometric base lobby (~17,000 m² floor area, rising to ~27 m) with stepped
 *     octagonal-star travertine portals, cantilevered canopies, and glazed entrance courts (2002–2004)
 */

export async function buildZone({ THREE, materials }) {
  const group = new THREE.Group();
  group.name = 'zone1_foundations_piers1';

  const concrete = materials.miladConcrete || materials.concreteSub;
  const concreteDark = materials.miladConcreteRib || materials.concreteSub;
  const travertine = materials.miladTravertine || materials.masonryAshlar;
  const steel = materials.miladHeadSteel || materials.craneSteel;
  const mullion = materials.miladDarkMullion || materials.ironCast;
  const glass = materials.miladTurquoiseGlass || materials.glass1889;

  const pieces = [];

  // ---------------------------------------------------------------------------
  // 1. 66 m Circular Geotechnical Excavation Ring & Shoring (1997–1999)
  // ---------------------------------------------------------------------------
  const excavationGroup = new THREE.Group();
  excavationGroup.name = 'z1_excavation_pit';

  // Retaining perimeter wall around 66 m pit (r = 34.5 m, height 14 m, y = -14 .. 0)
  const pitWall = new THREE.Mesh(
    new THREE.CylinderGeometry(35.2, 33.4, 14.0, 32, 1, true),
    concreteDark
  );
  pitWall.position.y = -7.0;
  excavationGroup.add(pitWall);

  // Pit rim concrete curb collar flush at grade (y = 0 .. 1.1 m)
  const rimRing = new THREE.Mesh(
    new THREE.CylinderGeometry(36.4, 37.8, 1.1, 32),
    concreteDark
  );
  rimRing.position.y = 0.55;
  excavationGroup.add(rimRing);

  // Shoring soldier-pile ribs around pit interior
  const pileGeo = new THREE.BoxGeometry(0.9, 13.4, 1.2);
  const pileInst = new THREE.InstancedMesh(pileGeo, steel, 32);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 33.8, -7.0, Math.sin(a) * 33.8);
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
    label: '14 m Deep Circular Seismic Excavation & Retaining Shoring',
    object3D: excavationGroup,
    phase: 0,
    span: [0.0, 0.48],
    category: 'permanent',
    yMin: -14.0,
    yMax: 1.1,
  });

  // ---------------------------------------------------------------------------
  // 2. 66 m Reinforced Concrete Foundation Mat & Transition Pedestal (1999–2000)
  // ---------------------------------------------------------------------------
  const matGroup = new THREE.Group();
  matGroup.name = 'z1_foundation_mat';

  // Primary 66 m diameter reinforced concrete mat slab (thickness 4.5 m, y = -14 .. -9.5)
  const matSlab = new THREE.Mesh(
    new THREE.CylinderGeometry(33.0, 33.0, 4.5, 32),
    concrete
  );
  matSlab.position.y = -11.75;
  matGroup.add(matSlab);

  // Conical load-transfer transition pedestal rising from mat to grade (-9.5 .. +1.2)
  const pedestalCone = new THREE.Mesh(
    new THREE.CylinderGeometry(18.5, 30.8, 10.7, 16),
    concrete
  );
  pedestalCone.position.y = -4.15;
  matGroup.add(pedestalCone);

  // 16 Radial structural shear buttress ribs transferring shaft loads to 66 m mat
  const ribGeo = new THREE.BoxGeometry(1.6, 10.2, 13.5);
  const ribInst = new THREE.InstancedMesh(ribGeo, concreteDark, 16);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 23.0, -4.4, Math.sin(a) * 23.0);
    dummy.rotation.set(0, -a + Math.PI * 0.5, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    ribInst.setMatrixAt(i, dummy.matrix);
  }
  ribInst.instanceMatrix.needsUpdate = true;
  ribInst.computeBoundingSphere();
  matGroup.add(ribInst);

  // Plaza podium slab covering pit at grade (y = 0.0 .. 1.6 m, r = 42 m octagonal plinth)
  const podiumDeck = new THREE.Mesh(
    new THREE.CylinderGeometry(41.5, 43.5, 1.6, 8),
    travertine
  );
  podiumDeck.rotation.y = Math.PI / 8;
  podiumDeck.position.y = 0.8;
  matGroup.add(podiumDeck);

  group.add(matGroup);
  pieces.push({
    id: 'z1_foundation_mat',
    label: '66 m Reinforced Concrete Foundation Mat & Transition Pedestal',
    object3D: matGroup,
    phase: 1,
    span: [0.55, 1.38],
    category: 'permanent',
    yMin: -14.0,
    yMax: 1.6,
  });

  // ---------------------------------------------------------------------------
  // 3. 6-Story Base Lobby Pavilion — Lower Geometric Galleries (0 .. 17 m)
  // ---------------------------------------------------------------------------
  const lobbyLowerGroup = new THREE.Group();
  lobbyLowerGroup.name = 'z1_lobby_core_lower';

  // Primary 8-sided Iranian geometric base drum (Floors 1–4, y = 1.6 .. 16.5 m)
  const lowerOct = new THREE.Mesh(
    new THREE.CylinderGeometry(31.5, 34.8, 14.9, 8),
    travertine
  );
  lowerOct.rotation.y = Math.PI / 8;
  lowerOct.position.y = 9.05;
  lobbyLowerGroup.add(lowerOct);

  // Interlocking rotated square-star projection (Persian 8-point Girih geometry)
  const starOct = new THREE.Mesh(
    new THREE.CylinderGeometry(33.2, 36.2, 11.2, 8),
    concrete
  );
  starOct.position.y = 7.2;
  lobbyLowerGroup.add(starOct);

  // Glazed curtain-wall gallery bays recessed around the 8 faces
  const lobbyGlassBand = new THREE.Mesh(
    new THREE.CylinderGeometry(32.9, 34.4, 9.6, 16, 1, true),
    glass
  );
  lobbyGlassBand.position.y = 8.4;
  lobbyLowerGroup.add(lobbyGlassBand);

  // 4 Monumental Entrance Portals (North, South, East, West) with Iranian stepped frames
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const portal = new THREE.Group();
    portal.rotation.y = a;

    const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(15.5, 12.6, 6.2), travertine);
    frameOuter.position.set(0, 7.8, 34.2);
    portal.add(frameOuter);

    const frameRecess = new THREE.Mesh(new THREE.BoxGeometry(11.4, 9.8, 6.6), mullion);
    frameRecess.position.set(0, 6.5, 34.3);
    portal.add(frameRecess);

    const portalGlass = new THREE.Mesh(new THREE.BoxGeometry(10.4, 9.0, 0.4), glass);
    portalGlass.position.set(0, 6.3, 37.35);
    portal.add(portalGlass);

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(17.4, 0.9, 5.8), steel);
    canopy.position.set(0, 12.2, 38.2);
    portal.add(canopy);

    // Grand entrance steps
    for (let s = 0; s < 3; s++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(16.0 + s * 1.6, 0.45, 2.2),
        travertine
      );
      step.position.set(0, 0.22 + (2 - s) * 0.45, 39.2 + s * 1.4);
      portal.add(step);
    }

    lobbyLowerGroup.add(portal);
  }

  // Vertical travertine facade pilasters around perimeter
  const pilGeo = new THREE.BoxGeometry(1.1, 14.6, 1.5);
  const pilInst = new THREE.InstancedMesh(pilGeo, travertine, 32);
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 33.8, 9.0, Math.sin(a) * 33.8);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    pilInst.setMatrixAt(i, dummy.matrix);
  }
  pilInst.instanceMatrix.needsUpdate = true;
  pilInst.computeBoundingSphere();
  lobbyLowerGroup.add(pilInst);

  group.add(lobbyLowerGroup);
  pieces.push({
    id: 'z1_lobby_core_lower',
    label: '6-Story Iranian Geometric Base Lobby Pavilion (Levels 1–4)',
    object3D: lobbyLowerGroup,
    phase: 3,
    span: [3.25, 4.10],
    category: 'permanent',
    yMin: 0.0,
    yMax: 16.5,
  });

  // ---------------------------------------------------------------------------
  // 4. Base Lobby Upper Mezzanine Crown & Perimeter Terrace (16.5 .. 27 m)
  // ---------------------------------------------------------------------------
  const lobbyCrownGroup = new THREE.Group();
  lobbyCrownGroup.name = 'z1_lobby_crown_terrace';

  // Flared inverted-frustum crown cornice echoing Milad Tower's upper head silhouette
  const flareCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(35.8, 30.8, 4.2, 16),
    materials.miladHeadCladding || travertine
  );
  flareCollar.position.y = 18.6;
  lobbyCrownGroup.add(flareCollar);

  // Upper glazed mezzanine gallery (Levels 5–6, y = 20.7 .. 25.4 m)
  const upperGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(34.6, 35.4, 4.6, 16, 1, true),
    glass
  );
  upperGlass.position.y = 23.0;
  lobbyCrownGroup.add(upperGlass);

  // Upper facade mullions
  const uMulGeo = new THREE.BoxGeometry(0.45, 4.8, 0.7);
  const uMulInst = new THREE.InstancedMesh(uMulGeo, mullion, 32);
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 35.1, 23.0, Math.sin(a) * 35.1);
    dummy.rotation.set(0, -a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    uMulInst.setMatrixAt(i, dummy.matrix);
  }
  uMulInst.instanceMatrix.needsUpdate = true;
  uMulInst.computeBoundingSphere();
  lobbyCrownGroup.add(uMulInst);

  // Stepped roof slab & shaft collar ring at 27 m
  const roofCap = new THREE.Mesh(
    new THREE.CylinderGeometry(33.2, 35.4, 1.8, 16),
    concrete
  );
  roofCap.position.y = 26.1;
  lobbyCrownGroup.add(roofCap);

  const roofParapet = new THREE.Mesh(
    new THREE.CylinderGeometry(24.5, 27.5, 1.4, 16),
    concreteDark
  );
  roofParapet.position.y = 27.2;
  lobbyCrownGroup.add(roofParapet);

  group.add(lobbyCrownGroup);
  pieces.push({
    id: 'z1_lobby_crown_terrace',
    label: 'Base Lobby Upper Crown Galleries & 27 m Terrace',
    object3D: lobbyCrownGroup,
    phase: 4,
    span: [3.95, 4.65],
    category: 'permanent',
    yMin: 16.5,
    yMax: 27.9,
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
