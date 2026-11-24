/**
 * Surrounding Tehran World — Sub-Module 1: Gisha Hilltop Plateau, Plaza & Milad Cultural Complex
 * (`world/w_parvis_seine.js`)
 *
 * Replaces the Seine/Parvis module while preserving the exact `buildParvisAndSeine(ctx)` export contract.
 * Models:
 *   - Elevated Gisha Hilltop rocky plateau (summit terrace at y = 0 m sloping naturally to -26 m valley floor)
 *   - Ceremonial octagonal travertine plaza & grand pedestrian approaches around Milad Tower
 *   - Milad International Convention Center modernist sculpted shell pavilion beside the base
 *   - Landscaped hilltop terraces, retaining stone walls, cypress/plane trees & architectural lamps
 */

export function buildParvisAndSeine(ctx) {
  const { THREE, pal, box, cyl, ring, lineSeg, addTree, addLamp } = ctx;
  const group = new THREE.Group();
  group.name = 'gisha_hilltop_plaza';

  // 1. Broad Tehran Valley Floor Skirt (y = -26 m, extending well beyond mist closure ring)
  const valleyFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(4200, 4200, 1, 1),
    pal.gravel
  );
  valleyFloor.rotation.x = -Math.PI / 2;
  valleyFloor.position.y = -26.0;
  valleyFloor.receiveShadow = true;
  valleyFloor.userData.noSketchEdges = true;
  group.add(valleyFloor);

  // 2. Sculpted Multi-Tiered Gisha Hilltop Massif (rising from -26 m Tehran valley to 0 m summit plaza)
  const hillTiers = [
    { rt: 138, rb: 190, h: 6.5, y: -3.25, seg: 16, mat: pal.gravel },
    { rt: 185, rb: 268, h: 7.5, y: -10.25, seg: 16, mat: pal.earth },
    { rt: 262, rb: 365, h: 7.0, y: -17.5, seg: 16, mat: pal.turf },
    { rt: 358, rb: 485, h: 5.5, y: -23.5, seg: 16, mat: pal.earth },
  ];
  for (const t of hillTiers) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(t.rt, t.rb, t.h, t.seg), t.mat);
    m.position.y = t.y;
    m.receiveShadow = true;
    m.userData.noSketchEdges = true;
    group.add(m);
    // Topographic architectural pen-and-ink contour line around each hillside terrace
    ring(group, 0, t.y + t.h * 0.5 + 0.08, 0, t.rt * 1.002, t.rt * 1.002, 24);
  }

  // 3. Summit Ceremonial Plaza Deck (y = -0.35 .. 0.0 m, radius ~136 m)
  const summitPlaza = new THREE.Mesh(
    new THREE.CylinderGeometry(135, 139, 0.7, 24),
    pal.stone
  );
  summitPlaza.position.y = -0.35;
  summitPlaza.receiveShadow = true;
  summitPlaza.userData.noSketchEdges = true;
  group.add(summitPlaza);

  // Concentric Iranian geometric stone plaza inlays
  ring(group, 0, 0.05, 0, 56, 56, 16);
  ring(group, 0, 0.05, 0, 88, 88, 16);
  ring(group, 0, 0.05, 0, 128, 128, 24);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    lineSeg(group, Math.cos(a) * 44, 0.06, Math.sin(a) * 44, Math.cos(a) * 128, 0.06, Math.sin(a) * 128);
  }

  // 4. Milad International Convention Center (Modernist cultural hall flanking East-Southeast of tower)
  const complexGroup = new THREE.Group();
  complexGroup.name = 'milad_convention_complex';

  // Main stepped stone convention hall plinth & faceted curved roof shell
  box(complexGroup, pal.cream, 118, 4.5, 48, 56, 9.0, 42, -0.22);
  box(complexGroup, pal.stone, 118, 10.5, 48, 48, 3.2, 34, -0.22);
  box(complexGroup, pal.glass, 118, 5.2, 68.2, 38, 6.2, 1.4, -0.22);

  // Adjacent Exhibition Gallery Wing (West-Southwest flank)
  box(complexGroup, pal.cream, -112, 3.8, 54, 44, 7.6, 30, 0.24);
  box(complexGroup, pal.slate, -112, 8.2, 54, 46, 1.2, 32, 0.24);

  // Ceremonial Reflecting Pool on the Southern Forecourt axis
  const poolRim = new THREE.Mesh(new THREE.BoxGeometry(24, 0.65, 58), pal.marble);
  poolRim.position.set(0, 0.32, 92);
  poolRim.receiveShadow = true;
  complexGroup.add(poolRim);

  const poolWater = new THREE.Mesh(new THREE.PlaneGeometry(21.4, 55.4), pal.water);
  poolWater.rotation.x = -Math.PI / 2;
  poolWater.position.set(0, 0.68, 92);
  poolWater.receiveShadow = true;
  poolWater.userData.noSketchEdges = true;
  complexGroup.add(poolWater);

  group.add(complexGroup);

  // 5. Hilltop Terraced Cypress & Tehran Plane Trees + Plaza Luminaires
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    if (Math.abs(Math.sin(a)) < 0.25 && Math.cos(a) > 0) continue; // Keep clear of convention hall
    const r = 104 + (i % 3) * 10;
    addTree(Math.cos(a) * r, 0.0, Math.sin(a) * r, 0.95 + (i % 4) * 0.12);
  }
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.12;
    const r = 68;
    addLamp(Math.cos(a) * r, 0.0, Math.sin(a) * r, 1.05, false);
  }

  // Construction excavation pit collar visible only during early build steps (< 1.2)
  const pitVisualGroup = new THREE.Group();
  pitVisualGroup.name = 'milad_excavation_berm';
  cyl(pitVisualGroup, pal.earth, 0, 0.9, 0, 42, 46, 1.8, 24, { noSketchRings: true });
  group.add(pitVisualGroup);

  function setStep(step = 11.0) {
    const s = Number.isFinite(Number(step)) ? Number(step) : 11.0;
    pitVisualGroup.visible = s < 1.35;
    complexGroup.visible = s >= 4.2;
  }

  function update() {}

  setStep(11.0);
  return { group, setStep, update };
}
