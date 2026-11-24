/**
 * Surrounding Tehran World — Sub-Module 3: Alborz Mountains Northern Horizon
 * (`world/w_trocadero.js`)
 *
 * Preserves the exact `buildTrocadero(ctx)` export contract while sculpting the monumental
 * Alborz Mountain Range (Tochal massif & northern foothills) rising behind Milad Tower along
 * the northern horizon (`z = -920 .. -1880 m`, peak heights up to `380–460 m`), complete with
 * faceted alpine stone ridges, pale snow-dusted summit caps, and pen-and-ink contour lines
 * fading gracefully into Tehran's northern atmospheric mist.
 */

export function buildTrocadero(ctx) {
  const { THREE, pal, lineSeg } = ctx;
  const group = new THREE.Group();
  group.name = 'alborz_mountains_horizon';

  const valleyY = -26.0;

  // Build two dramatic layered mountain chains along the northern horizon (-Z):
  //   1. Foothill Ridge (z ~ -1020 m, heights 140 .. 240 m)
  //   2. High Alborz / Tochal Main Massif (z ~ -1480 m, heights 290 .. 460 m, pale snow-dusted peaks)
  function buildMountainChain({
    name,
    zCenter,
    widthX,
    depthZ,
    segsX,
    segsZ,
    peakHeight,
    ridgeFreq,
    phase,
    mat,
    snowCapThreshold,
  }) {
    const geo = new THREE.PlaneGeometry(widthX, depthZ, segsX, segsZ);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Taper smoothly to valley floor at front/back Z edges and far East/West flanks
      const zNorm = 1.0 - Math.min(1.0, Math.abs(z) / (depthZ * 0.5));
      const xNorm = 1.0 - Math.pow(Math.min(1.0, Math.abs(x) / (widthX * 0.52)), 2.2);
      const env = Math.pow(Math.max(0, zNorm), 1.25) * Math.max(0, xNorm);

      // Multi-octave angular alpine ridge synthesis (Tochal-style dramatic silhouette)
      const r1 = Math.abs(Math.sin(x * ridgeFreq + phase));
      const r2 = Math.abs(Math.cos(x * ridgeFreq * 2.15 + z * 0.0045 - phase * 0.7));
      const r3 = Math.sin(x * ridgeFreq * 4.3 + z * 0.009) * 0.5 + 0.5;
      const centralPeakBoost = 1.0 + 0.32 * Math.exp(-Math.pow((x + 120) / 720, 2));

      const ridge = (0.52 * (1.0 - r1) + 0.33 * (1.0 - r2) + 0.15 * r3) * centralPeakBoost;
      const h = env * peakHeight * (0.38 + 0.72 * ridge);

      pos.setY(i, valleyY + h);
    }

    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = name;
    mesh.position.set(0, 0, zCenter);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.userData.noSketchEdges = true;
    group.add(mesh);

    // Subtle pen-and-ink alpine ridge line tracing the highest crest for architectural monograph clarity
    const crestCols = segsX + 1;
    let prevX = null;
    let prevY = null;
    let prevZ = null;
    for (let ix = 0; ix < crestCols; ix++) {
      let bestY = -Infinity;
      let bestX = 0;
      let bestZ = 0;
      for (let iz = 0; iz <= segsZ; iz++) {
        const idx = iz * crestCols + ix;
        const vy = pos.getY(idx);
        if (vy > bestY) {
          bestY = vy;
          bestX = pos.getX(idx);
          bestZ = pos.getZ(idx) + zCenter;
        }
      }
      if (prevX !== null && bestY > valleyY + 35 && prevY > valleyY + 35) {
        lineSeg(group, prevX, prevY + 1.2, prevZ, bestX, bestY + 1.2, bestZ);
      }
      prevX = bestX;
      prevY = bestY;
      prevZ = bestZ;
    }

    // Optional pale snow-dusted upper massif cap (high Alborz peaks above snowCapThreshold)
    if (snowCapThreshold > 0) {
      const snowGeo = geo.clone();
      const sPos = snowGeo.attributes.position;
      for (let i = 0; i < sPos.count; i++) {
        const y = sPos.getY(i);
        if (y < snowCapThreshold) {
          sPos.setY(i, y - 8.0);
        } else {
          sPos.setY(i, y + 1.2);
        }
      }
      snowGeo.computeVertexNormals();
      const snowMesh = new THREE.Mesh(snowGeo, pal.marble);
      snowMesh.position.set(0, 0, zCenter);
      snowMesh.receiveShadow = true;
      snowMesh.userData.noSketchEdges = true;
      group.add(snowMesh);
    }
  }

  // Layer 1: Northern Tehran Foothills (Darband / Darakeh / Farahzad slopes)
  buildMountainChain({
    name: 'alborz_foothills_ridge',
    zCenter: -1060,
    widthX: 3400,
    depthZ: 540,
    segsX: 52,
    segsZ: 10,
    peakHeight: 215,
    ridgeFreq: 0.0022,
    phase: 0.8,
    mat: pal.earth,
    snowCapThreshold: 0,
  });

  // Layer 2: High Alborz Massif & Tochal Crest (rising up to ~440 m on the northern skyline)
  buildMountainChain({
    name: 'alborz_high_massif',
    zCenter: -1480,
    widthX: 3900,
    depthZ: 740,
    segsX: 64,
    segsZ: 12,
    peakHeight: 445,
    ridgeFreq: 0.0017,
    phase: 2.1,
    mat: pal.stone,
    snowCapThreshold: 215,
  });

  function setStep() {}
  function update() {}

  return { group, setStep, update };
}
