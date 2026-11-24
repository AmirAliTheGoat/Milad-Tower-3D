/**
 * Surrounding Northwest Tehran, Gisha Hilltop, Arterial Expressways & Alborz Mountains World
 * (`world/paris_1889.js` — preserves drop-in export `createParis1889World` + `createTehranMiladWorld`)
 *
 * Models the authentic geographic and urban context surrounding Iran's 435-meter Milad Tower
 * (Borj-e Milad, Gisha Hilltop, Tehran) in the museum's refined monochrome architectural-sketch
 * and collodion-plate maquette aesthetic (100% real light sources, 0 emissive, distance mist):
 *
 *   1. Gisha Hilltop Plateau & Milad Cultural Plaza:
 *      - Sculpted hilltop crown (`y = 0 m`, radius ~180 m) sloping down to the Tehran basin (`y = -24 m`)
 *      - Circular travertine esplanade around the 66 m tower foundation (`y = 0.05 m`)
 *      - Step-gated excavation perimeter cut during early foundation phases (`step < 1.35`)
 *      - Southern reflecting water basins, landscaped terraced amphitheater, and International Convention Center
 *   2. Encircling Tehran Expressways:
 *      - Hemmat Expressway (North, E–W at `z = -315 m`)
 *      - Hakim Expressway (South, E–W at `z = +325 m`)
 *      - Chamran Expressway (East, N–S at `x = +345 m`)
 *      - Sheikh Fazlollah Nouri Expressway (West, N–S at `x = -335 m`)
 *      - Elevated highway bridges, cloverleaf ramps, and median ink lane contours
 *   3. Northwest Tehran Urban Fabric:
 *      - Stylized modernist terraced residential & commercial blocks across Gisha, Shahrak-e Gharb,
 *        Marzdaran, and Vanak fading smoothly into atmospheric mist
 *   4. Sculpted Alborz Mountains Northern Horizon:
 *      - Multi-layered faceted mountain range (`z = -920 m .. -1950 m`) rising up to 350 m+ Tochal massif
 *        peaks along the northern skyline, crowned with pale limestone ridges and architectural contour ink
 */

import {
  EXHIBITION_FOG_PRESETS,
  WORLD_DISTANCE_LIMITS,
  createWorldMistUniforms,
  updateWorldMistUniformsForMood,
  applyExhibitionDistanceFog,
  createSketchInkLineMaterial,
  auditWorldSketchAndFog,
} from './distance_fog.js';
import {
  PARIS_SKETCH_WORLD_PALETTE,
  createSketchWorldMaterials,
  createSkeletalTreeTrunkGeometry,
  createBotanicalCrownClusterGeometry,
} from './sketch_materials.js';

function hash2(ix, iz) {
  let n = (((ix * 374761393) ^ (iz * 668265263)) | 0);
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(1e-6, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Analytical Gisha Hilltop elevation function `y(x, z)` in meters:
 *   - Flat plateau `y = 0.0` inside `r <= 145 m` (Milad Tower & Cultural Plaza)
 *   - Gentle terraced hillside dropping to `y = -24 m` Tehran basin by `r = 295 m`
 *   - Rising sharply north of `z = -840 m` into the sculpted Alborz Mountains (Tochal massif)
 */
export function sampleTehranElevation(x, z) {
  const r = Math.hypot(x, z);
  // Gisha hilltop plateau (0 m) sloping down to Tehran urban plain (-24 m)
  const hillFalloff = smoothstep(142.0, 295.0, r);
  let y = -24.0 * hillFalloff;

  // Subtle natural hill undulations on the slopes
  if (r > 155 && r < 460) {
    const slopeMask = Math.sin(clamp((r - 155) / 305, 0, 1) * Math.PI);
    y += slopeMask * (2.6 * Math.sin(x * 0.018) * Math.cos(z * 0.016));
  }

  // Northern Alborz Mountains & Tochal massif (`z < -760 m`)
  if (z < -760.0) {
    const northT = smoothstep(-760.0, -1480.0, z);
    const farPeakT = smoothstep(-1050.0, -1820.0, z);
    // Ridged multi-harmonic mountain silhouette spanning the entire northern skyline
    const r1 = 1.0 - Math.abs(Math.sin(x * 0.0021 + 0.65));
    const r2 = 1.0 - Math.abs(Math.sin(x * 0.0049 - 1.15 + z * 0.0014));
    const r3 = 1.0 - Math.abs(Math.cos(x * 0.0095 + z * 0.0028));
    const tochalCenter = Math.exp(-Math.pow((x - 140.0) / 760.0, 2.0));
    const darakehShoulder = Math.exp(-Math.pow((x + 680.0) / 620.0, 2.0));
    const farahzadRidge = Math.exp(-Math.pow((x - 940.0) / 680.0, 2.0));

    const foothills = northT * (78.0 * r1 + 42.0 * r2 + 18.0 * r3);
    const highPeaks =
      farPeakT * (235.0 * tochalCenter + 175.0 * darakehShoulder + 160.0 * farahzadRidge) *
      (0.58 + 0.42 * r1);
    y += foothills + highPeaks;
  }

  return y;
}

function mergeGroupMeshesByMaterial(THREE, grp, castShadowMats) {
  for (const child of grp.children) {
    if (child.isGroup) mergeGroupMeshesByMaterial(THREE, child, castShadowMats);
  }
  const buckets = new Map();
  for (const child of grp.children) {
    if (!child.isMesh || child.isInstancedMesh || child.material?.isShaderMaterial) continue;
    if (child.name === 'tehran_terrain_mesh' || child.name === 'alborz_mountain_range') continue;
    let list = buckets.get(child.material);
    if (!list) buckets.set(child.material, (list = []));
    list.push(child);
  }
  for (const [mat, meshes] of buckets.entries()) {
    const shouldCast = castShadowMats.has(mat);
    if (meshes.length < 2) {
      for (const m of meshes) {
        m.receiveShadow = true;
        m.castShadow = shouldCast;
      }
      continue;
    }
    let vCount = 0;
    let iCount = 0;
    const geos = meshes.map((m) => {
      m.updateMatrix();
      const g = m.geometry.clone();
      g.applyMatrix4(m.matrix);
      const nV = g.attributes.position.count;
      vCount += nV;
      iCount += g.index ? g.index.count : nV;
      grp.remove(m);
      m.geometry.dispose();
      return g;
    });
    const pos = new Float32Array(vCount * 3);
    const nrm = new Float32Array(vCount * 3);
    const uvs = new Float32Array(vCount * 2);
    const idx = vCount > 65535 ? new Uint32Array(iCount) : new Uint16Array(iCount);
    let vOff = 0;
    let iOff = 0;
    for (const g of geos) {
      pos.set(g.attributes.position.array, vOff * 3);
      if (g.attributes.normal) nrm.set(g.attributes.normal.array, vOff * 3);
      if (g.attributes.uv) uvs.set(g.attributes.uv.array, vOff * 2);
      const nV = g.attributes.position.count;
      if (g.index) {
        const gI = g.index.array;
        for (let k = 0; k < gI.length; k++) idx[iOff + k] = gI[k] + vOff;
        iOff += gI.length;
      } else {
        for (let k = 0; k < nV; k++) idx[iOff + k] = vOff + k;
        iOff += nV;
      }
      vOff += nV;
      g.dispose();
    }
    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    merged.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    merged.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    merged.setIndex(new THREE.BufferAttribute(idx, 1));
    merged.computeBoundingSphere();
    const mergedMesh = new THREE.Mesh(merged, mat);
    mergedMesh.receiveShadow = true;
    mergedMesh.castShadow = shouldCast;
    grp.add(mergedMesh);
  }
}

function buildSculptedTehranTerrain({ THREE, pal }) {
  // High-resolution terrain mesh covering Gisha Hilltop, Tehran basin, and Alborz foothills/peaks
  const sizeX = 5200;
  const sizeZ = 5200;
  const segX = 110;
  const segZ = 110;
  const geo = new THREE.PlaneGeometry(sizeX, sizeZ, segX, segZ);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let y = sampleTehranElevation(x, z);
    // Keep central foundation footprint (`r < 34 m`) recessed slightly so Zone 1's 14 m pit/mat stays clean
    const r = Math.hypot(x, z);
    if (r < 36.0) {
      y = -0.35;
    }
    pos.setY(i, y);
  }
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(geo, pal.gravelSkirt);
  mesh.name = 'tehran_terrain_mesh';
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  mesh.userData.noSketchEdges = true;
  return mesh;
}

function buildAlborzRidgeContourLines({ lineSeg, targetGrp }) {
  // Architectural topographic contour strokes along the northern Alborz ridgeline
  const zBands = [-980, -1180, -1400, -1640, -1880];
  for (const zb of zBands) {
    const stepX = 115;
    for (let x = -2200; x < 2200; x += stepX) {
      const x1 = x + stepX;
      const y0 = sampleTehranElevation(x, zb) + 1.2;
      const y1 = sampleTehranElevation(x1, zb) + 1.2;
      lineSeg(targetGrp, x, y0, zb, x1, y1, zb);
    }
  }
  // Vertical mountain spur ridges running down toward northern Tehran
  for (let x = -1800; x <= 1800; x += 260) {
    for (let z = -1850; z < -920; z += 130) {
      const z1 = z + 130;
      const y0 = sampleTehranElevation(x, z) + 1.2;
      const y1 = sampleTehranElevation(x, z1) + 1.2;
      lineSeg(targetGrp, x, y0, z, x, y1, z1);
    }
  }
}

export function createTehranMiladWorld({
  THREE,
  scene = null,
  mood = 'day',
  autoConfigureFog = true,
  skipOverwrittenFloorMaps = false,
  rawWorldMaps = null,
} = {}) {
  if (!THREE) throw new Error('createTehranMiladWorld requires { THREE }.');

  const group = new THREE.Group();
  group.name = 'tehran_milad_world';
  if (scene) scene.add(group);

  const mistUniforms = createWorldMistUniforms(THREE, mood);
  if (scene && autoConfigureFog) {
    if (!scene.fog || scene.fog.isFogExp2) {
      applyExhibitionDistanceFog({ THREE, scene, mood, mistUniforms });
    }
  }

  const pal = createSketchWorldMaterials(THREE, mistUniforms, {
    skipOverwrittenFloorMaps,
    rawWorldMaps,
  });

  const treeList = [];
  const lampList = [];
  const plazaLampList = [];
  const dummy = new THREE.Object3D();

  const explicitSketchMap = new Map();
  const getExplicitBuf = (grp) => {
    let arr = explicitSketchMap.get(grp);
    if (!arr) {
      arr = [];
      explicitSketchMap.set(grp, arr);
    }
    return arr;
  };
  const lineSeg = (targetGrp, x0, y0, z0, x1, y1, z1) => {
    getExplicitBuf(targetGrp).push(x0, y0, z0, x1, y1, z1);
  };
  const ring = (targetGrp, cx, y, cz, rx, rz = rx, segs = 32) => {
    const buf = getExplicitBuf(targetGrp);
    const tau = Math.PI * 2.0;
    for (let i = 0; i < segs; i++) {
      const a0 = (i / segs) * tau;
      const a1 = ((i + 1) / segs) * tau;
      buf.push(
        cx + Math.cos(a0) * rx,
        y,
        cz + Math.sin(a0) * rz,
        cx + Math.cos(a1) * rx,
        y,
        cz + Math.sin(a1) * rz
      );
    }
  };

  const instanced = (parent, geo, mat, tuples, opts = {}) => {
    if (!tuples.length) return null;
    const mesh = new THREE.InstancedMesh(geo, mat, tuples.length);
    for (let i = 0; i < tuples.length; i++) {
      const [x, y, z, sx, sy, sz, ry = 0] = tuples[i];
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, ry, 0);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.receiveShadow = true;
    mesh.castShadow = Boolean(opts.castShadow);
    if (opts.customDepthMaterial) {
      mesh.customDepthMaterial = opts.customDepthMaterial;
    }
    parent.add(mesh);
    return mesh;
  };

  // Sub-groups for permanent Tehran geography vs step-conditional Milad cultural complex
  const terrainGroup = new THREE.Group();
  terrainGroup.name = 'tehran_gisha_alborz';

  const highwaysGroup = new THREE.Group();
  highwaysGroup.name = 'tehran_expressways';

  const urbanFabricGroup = new THREE.Group();
  urbanFabricGroup.name = 'tehran_urban_blocks';

  const plazaGroup = new THREE.Group();
  plazaGroup.name = 'milad_cultural_plaza';

  const siteFenceGroup = new THREE.Group();
  siteFenceGroup.name = 'milad_construction_perimeter';

  group.add(terrainGroup, highwaysGroup, urbanFabricGroup, plazaGroup, siteFenceGroup);

  // -------------------------------------------------------------------------
  // 1. Sculpted Gisha Hilltop, Tehran Basin & Northern Alborz Mountains
  // -------------------------------------------------------------------------
  const terrainMesh = buildSculptedTehranTerrain({ THREE, pal });
  terrainGroup.add(terrainMesh);
  buildAlborzRidgeContourLines({ lineSeg, targetGrp: terrainGroup });

  // Secondary pale limestone snow-cap ridges on the high Tochal massif (> 175 m)
  const peakTuples = [
    [140, sampleTehranElevation(140, -1580) - 22, -1580, 420, 95, 210, 0.12],
    [-580, sampleTehranElevation(-580, -1520) - 24, -1520, 360, 82, 190, -0.18],
    [880, sampleTehranElevation(880, -1620) - 24, -1620, 380, 88, 200, 0.22],
  ];
  instanced(terrainGroup, new THREE.ConeGeometry(0.65, 1.0, 5), pal.marble, peakTuples, {
    castShadow: false,
  });

  // -------------------------------------------------------------------------
  // 2. Encircling Tehran Arterial Expressways (Hemmat, Hakim, Chamran, Nouri)
  // -------------------------------------------------------------------------
  const yBasin = -23.65;
  const addHighwayRibbon = (x, z, lenX, lenZ, rotY = 0) => {
    const deck = new THREE.Mesh(new THREE.BoxGeometry(lenX, 0.7, lenZ), pal.street);
    deck.position.set(x, yBasin, z);
    deck.rotation.y = rotY;
    deck.receiveShadow = true;
    deck.userData.noSketchEdges = true;
    highwaysGroup.add(deck);

    // Center jersey median barrier
    const isEW = lenX > lenZ;
    const med = new THREE.Mesh(
      new THREE.BoxGeometry(isEW ? lenX : 1.4, 1.25, isEW ? 1.4 : lenZ),
      pal.stone
    );
    med.position.set(x, yBasin + 0.55, z);
    med.rotation.y = rotY;
    highwaysGroup.add(med);
  };

  // Hemmat Expressway (North, E-W)
  addHighwayRibbon(0, -325, 2900, 34);
  lineSeg(highwaysGroup, -1450, yBasin + 0.45, -342, 1450, yBasin + 0.45, -342);
  lineSeg(highwaysGroup, -1450, yBasin + 0.45, -308, 1450, yBasin + 0.45, -308);

  // Hakim Expressway (South, E-W)
  addHighwayRibbon(0, 335, 2900, 34);
  lineSeg(highwaysGroup, -1450, yBasin + 0.45, 318, 1450, yBasin + 0.45, 318);
  lineSeg(highwaysGroup, -1450, yBasin + 0.45, 352, 1450, yBasin + 0.45, 352);

  // Chamran Expressway (East, N-S)
  addHighwayRibbon(355, -80, 32, 2400);
  lineSeg(highwaysGroup, 339, yBasin + 0.45, -1080, 339, yBasin + 0.45, 1120);
  lineSeg(highwaysGroup, 371, yBasin + 0.45, -1080, 371, yBasin + 0.45, 1120);

  // Sheikh Fazlollah Nouri Expressway (West, N-S)
  addHighwayRibbon(-345, -60, 32, 2400);
  lineSeg(highwaysGroup, -361, yBasin + 0.45, -1060, -361, yBasin + 0.45, 1140);
  lineSeg(highwaysGroup, -329, yBasin + 0.45, -1060, -329, yBasin + 0.45, 1140);

  // Elevated highway interchange overpasses at the 4 corners
  const interchanges = [
    [355, -325],
    [-345, -325],
    [355, 335],
    [-345, 335],
  ];
  for (const [ix, iz] of interchanges) {
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(58, 2.2, 24), pal.stone);
    bridge.position.set(ix, yBasin + 4.8, iz);
    highwaysGroup.add(bridge);

    // Sweeping cloverleaf ramp loops
    const rampGeo = new THREE.TorusGeometry(42, 4.8, 6, 24);
    rampGeo.rotateX(Math.PI / 2);
    const ramp = new THREE.Mesh(rampGeo, pal.street);
    ramp.scale.set(1, 0.22, 1);
    ramp.position.set(ix + (ix > 0 ? 44 : -44), yBasin + 0.35, iz + (iz > 0 ? 44 : -44));
    ramp.userData.noSketchEdges = true;
    highwaysGroup.add(ramp);
    ring(highwaysGroup, ramp.position.x, yBasin + 0.9, ramp.position.z, 46.5, 46.5, 24);
  }

  // Sweeping hilltop access ring road climbing up Gisha Hill to Milad Cultural Plaza
  const hillLoopGeo = new THREE.RingGeometry(118, 134, 48);
  hillLoopGeo.rotateX(-Math.PI / 2);
  const hillLoop = new THREE.Mesh(hillLoopGeo, pal.street);
  hillLoop.position.y = 0.06;
  hillLoop.receiveShadow = true;
  hillLoop.userData.noSketchEdges = true;
  highwaysGroup.add(hillLoop);
  ring(highwaysGroup, 0, 0.14, 0, 118, 118, 48);
  ring(highwaysGroup, 0, 0.14, 0, 134, 134, 48);

  // -------------------------------------------------------------------------
  // 3. Milad Hilltop Cultural Plaza, Reflecting Pools & Convention Center (step >= 4.0)
  // -------------------------------------------------------------------------
  // Circular travertine esplanade collar around the 66 m foundation & 6-story lobby
  const esplanadeGeo = new THREE.RingGeometry(33.5, 118.0, 48);
  esplanadeGeo.rotateX(-Math.PI / 2);
  const esplanade = new THREE.Mesh(esplanadeGeo, pal.allee);
  esplanade.position.y = 0.08;
  esplanade.receiveShadow = true;
  esplanade.userData.noSketchEdges = true;
  plazaGroup.add(esplanade);
  ring(plazaGroup, 0, 0.16, 0, 62, 62, 40);
  ring(plazaGroup, 0, 0.16, 0, 96, 96, 48);

  // Radial travertine pedestrian avenues on the hilltop (Persian chahar-bagh geometry)
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const path = new THREE.Mesh(new THREE.BoxGeometry(16, 0.18, 82), pal.marble);
    path.position.set(Math.sin(a) * 76, 0.12, Math.cos(a) * 76);
    path.rotation.y = a;
    path.receiveShadow = true;
    plazaGroup.add(path);
  }

  // Pair of ceremonial reflecting water pools flanking the southern promenade
  for (const sx of [-1, 1]) {
    const rim = new THREE.Mesh(new THREE.BoxGeometry(15, 0.65, 52), pal.stone);
    rim.position.set(sx * 24, 0.32, 72);
    plazaGroup.add(rim);

    const pool = new THREE.Mesh(new THREE.PlaneGeometry(13.2, 50.2), pal.water);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(sx * 24, 0.66, 72);
    pool.userData.noSketchEdges = true;
    plazaGroup.add(pool);
  }

  // Milad International Convention Center (modernist stepped travertine pavilion, SW plateau)
  const convBase = new THREE.Mesh(new THREE.BoxGeometry(68, 12, 46), pal.cream);
  convBase.position.set(-88, 6.0, 56);
  convBase.rotation.y = 0.42;
  plazaGroup.add(convBase);

  const convUpper = new THREE.Mesh(new THREE.BoxGeometry(52, 7, 32), pal.stone);
  convUpper.position.set(-88, 15.5, 56);
  convUpper.rotation.y = 0.42;
  plazaGroup.add(convUpper);

  const convRoof = new THREE.Mesh(new THREE.BoxGeometry(56, 1.4, 36), pal.slate);
  convRoof.position.set(-88, 19.7, 56);
  convRoof.rotation.y = 0.42;
  plazaGroup.add(convRoof);

  // Exhibition Hall / Cultural Gallery Wing (SE plateau)
  const eastHall = new THREE.Mesh(new THREE.BoxGeometry(44, 9.5, 28), pal.cream);
  eastHall.position.set(86, 4.75, 52);
  eastHall.rotation.y = -0.38;
  plazaGroup.add(eastHall);

  const eastRoof = new THREE.Mesh(new THREE.BoxGeometry(47, 1.2, 31), pal.slate);
  eastRoof.position.set(86, 10.1, 52);
  eastRoof.rotation.y = -0.38;
  plazaGroup.add(eastRoof);

  // Construction-phase perimeter grading & site office trailers (visible only during early build steps < 4.2)
  const siteWall = new THREE.Mesh(new THREE.CylinderGeometry(78, 78, 2.6, 32, 1, true), pal.wood);
  siteWall.position.y = 1.3;
  siteWall.material = pal.wood;
  siteFenceGroup.add(siteWall);

  for (let i = 0; i < 4; i++) {
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(12, 3.6, 5.2), pal.expoBrick);
    cabin.position.set(58 + i * 14, 1.8, 42);
    siteFenceGroup.add(cabin);
  }

  // -------------------------------------------------------------------------
  // 4. Northwest Tehran Urban Fabric (Gisha, Shahrak-e Gharb, Marzdaran, Vanak)
  // -------------------------------------------------------------------------
  const blocksLight = [];
  const blocksMid = [];
  const roofs = [];

  for (let gx = -1250; gx <= 1250; gx += 78) {
    for (let gz = -760; gz <= 1180; gz += 78) {
      const r = Math.hypot(gx, gz);
      // Keep Gisha Hilltop slopes clear (`r < 390`)
      if (r < 395) continue;
      // Keep expressway corridors clear
      if (Math.abs(gz + 325) < 48 || Math.abs(gz - 335) < 48) continue;
      if (Math.abs(gx - 355) < 46 || Math.abs(gx + 345) < 46) continue;
      if (r > 1420) continue;

      const h1 = hash2(gx, gz);
      if (h1 < 0.24) continue; // Parks, courtyards, and neighborhood streets

      const h2 = hash2(gx + 19, gz - 31);
      const h3 = hash2(gx - 43, gz + 17);
      const jx = gx + (h2 - 0.5) * 26;
      const jz = gz + (h3 - 0.5) * 26;
      const groundY = sampleTehranElevation(jx, jz);

      const w = 18 + h1 * 28;
      const d = 18 + h2 * 26;
      // Shahrak-e Gharb (NW) & Vanak (NE) feature taller modernist towers; Gisha (S/SW) mid-rise blocks
      const isTowerCluster = (jx < -400 && jz < -360) || (jx > 420 && jz < -360);
      const h = isTowerCluster ? 22 + h3 * 46 : 11 + h3 * 22;

      const tuple = [jx, groundY + h * 0.5 - 1.5, jz, w, h, d, (h1 > 0.7 ? 0.08 : 0)];
      if (h2 > 0.48) {
        blocksLight.push(tuple);
      } else {
        blocksMid.push(tuple);
      }
      roofs.push([jx, groundY + h - 1.2, jz, w * 0.96, 1.0, d * 0.96, tuple[6]]);
    }
  }

  instanced(urbanFabricGroup, new THREE.BoxGeometry(1, 1, 1), pal.cityWall, blocksLight, {
    castShadow: true,
  });
  instanced(urbanFabricGroup, new THREE.BoxGeometry(1, 1, 1), pal.cityWallWarm, blocksMid, {
    castShadow: true,
  });
  instanced(urbanFabricGroup, new THREE.BoxGeometry(1, 1, 1), pal.slate, roofs, {
    castShadow: false,
  });

  // -------------------------------------------------------------------------
  // 5. Persian Plane & Cypress Park Trees + Plaza Lighting Standards
  // -------------------------------------------------------------------------
  // Hilltop promenade & terraced park trees encircling Gisha Hill
  for (let i = 0; i < 42; i++) {
    const a = (i / 42) * Math.PI * 2;
    const rad = 104 + (i % 3) * 8;
    const tx = Math.cos(a) * rad;
    const tz = Math.sin(a) * rad;
    // Leave main axial entries open
    if (Math.abs(tx) < 15 || Math.abs(tz) < 15) continue;
    treeList.push([tx, 0.0, tz, 0.95 + (i % 4) * 0.14]);
  }
  // Hillside greenbelt trees (Pardisan / Gisha slopes)
  for (let i = 0; i < 95; i++) {
    const a = (i * 2.39996) % (Math.PI * 2);
    const rad = 148 + (i % 15) * 10.5;
    const tx = Math.cos(a) * rad;
    const tz = Math.sin(a) * rad;
    const ty = sampleTehranElevation(tx, tz);
    treeList.push([tx, ty, tz, 0.88 + (i % 5) * 0.14]);
  }

  // Plaza architectural light standards
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.PI / 16;
    plazaLampList.push([Math.cos(a) * 64, 0.08, Math.sin(a) * 64, 1.15]);
  }
  for (let s = -2; s <= 2; s++) {
    if (s === 0) continue;
    lampList.push([s * 160, yBasin + 0.4, -325, 1.3]);
    lampList.push([s * 160, yBasin + 0.4, 335, 1.3]);
  }

  // -------------------------------------------------------------------------
  // 6. Pen-and-Ink Architectural Outlines + Mesh Merging
  // -------------------------------------------------------------------------
  const permanentTopGroups = new Set([terrainGroup, highwaysGroup, urbanFabricGroup]);
  const archEdgeMats = new Set([pal.stone, pal.cream, pal.marble, pal.slate, pal.expoBrick]);

  const ownerEdgeChunks = new Map();
  const invOwnerMat = new THREE.Matrix4();
  const relMat = new THREE.Matrix4();

  group.updateMatrixWorld(true);
  group.traverse((obj) => {
    if (!obj.isMesh || obj.isInstancedMesh) return;
    if (obj.userData.noSketchEdges) return;
    if (!archEdgeMats.has(obj.material)) return;

    let owner = group;
    let cur = obj.parent;
    while (cur && cur !== group) {
      if (cur.isGroup && !permanentTopGroups.has(cur)) {
        owner = cur;
        break;
      }
      cur = cur.parent;
    }

    invOwnerMat.copy(owner.matrixWorld).invert();
    relMat.multiplyMatrices(invOwnerMat, obj.matrixWorld);
    const eGeo = new THREE.EdgesGeometry(obj.geometry, 24);
    eGeo.applyMatrix4(relMat);
    const arr = eGeo.attributes.position?.array;
    if (arr && arr.length > 0) {
      let chunks = ownerEdgeChunks.get(owner);
      if (!chunks) ownerEdgeChunks.set(owner, (chunks = []));
      chunks.push(new Float32Array(arr));
    }
    eGeo.dispose();
  });

  for (const [grp, explicitArr] of explicitSketchMap.entries()) {
    if (!explicitArr.length) continue;
    const owner = permanentTopGroups.has(grp) ? group : grp;
    let chunks = ownerEdgeChunks.get(owner);
    if (!chunks) ownerEdgeChunks.set(owner, (chunks = []));
    chunks.push(new Float32Array(explicitArr));
  }

  const castShadowMats = new Set([pal.stone, pal.cream, pal.marble, pal.slate, pal.expoBrick]);
  mergeGroupMeshesByMaterial(THREE, group, castShadowMats);

  const inkLineMaterial = createSketchInkLineMaterial(THREE, mistUniforms, {
    name: 'tehran_sketch_ink_line',
    opacity: 0.48,
  });
  const sketchEdgeGroups = [];
  let rootSketchEdges = null;
  let totalEdgeSegments = 0;

  for (const [owner, chunks] of ownerEdgeChunks.entries()) {
    let totalFloats = 0;
    for (const c of chunks) totalFloats += c.length;
    if (totalFloats === 0) continue;

    const combined = new Float32Array(totalFloats);
    let off = 0;
    for (const c of chunks) {
      combined.set(c, off);
      off += c.length;
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(combined, 3));
    lineGeo.computeBoundingSphere();

    const lines = new THREE.LineSegments(lineGeo, inkLineMaterial);
    lines.name = owner === group ? 'tehran_sketch_edges' : `${owner.name || 'sub'}_sketch_edges`;
    lines.renderOrder = 1;
    owner.add(lines);
    sketchEdgeGroups.push(lines);
    totalEdgeSegments += Math.floor(totalFloats / 6);
    if (owner === group) rootSketchEdges = lines;
  }

  // Multi-branched skeletal trees
  const trunkTuples = [];
  const crownTuples = [];
  for (const [x, y, z, s] of treeList) {
    const yaw = (x * 0.17 + z * 0.11) % (Math.PI * 2.0);
    trunkTuples.push([x, y, z, s, s, s, yaw]);
    crownTuples.push([x, y, z, s, s * 1.05, s, yaw]);
  }
  instanced(group, createSkeletalTreeTrunkGeometry(THREE), pal.bark, trunkTuples, {
    castShadow: true,
  });
  instanced(group, createBotanicalCrownClusterGeometry(THREE), pal.foliage, crownTuples, {
    castShadow: true,
    customDepthMaterial: pal.foliageDepthMaterial,
  });

  // Minimalist modern Tehran street & plaza light masts (`0` emissive opaline globes)
  const buildLampBatch = (list, batchName, targetParent = group) => {
    const g = new THREE.Group();
    g.name = batchName;
    const shafts = [];
    const globes = [];
    for (const [x, y, z, s] of list) {
      shafts.push([x, y + 3.2 * s, z, 0.14 * s, 6.4 * s, 0.14 * s, 0]);
      globes.push([x, y + 6.5 * s, z, 0.34 * s, 0.24 * s, 0.34 * s, 0]);
    }
    instanced(g, new THREE.CylinderGeometry(0.45, 0.72, 1, 8), pal.expoIron, shafts);
    instanced(g, new THREE.SphereGeometry(1, 10, 8), pal.gasGlobe, globes);
    targetParent.add(g);
    return g;
  };
  buildLampBatch(lampList, 'tehran_expressway_lamps', group);
  const plazaLampGroup = buildLampBatch(plazaLampList, 'milad_plaza_lamps', plazaGroup);

  let currentStep = 11.0;
  let edgesVisible = true;

  function setStep(step = 11.0) {
    const s = Number.isFinite(Number(step)) ? Number(step) : 11.0;
    currentStep = s;
    // Show Milad Cultural Plaza & reflecting pools once the 315m shaft & base lobby finish (`step >= 4.2`)
    plazaGroup.visible = s >= 4.2;
    plazaLampGroup.visible = s >= 7.5;
    // Show construction site hoarding & cabins only during early foundation/shaft years (`step < 4.5`)
    siteFenceGroup.visible = s < 4.5;
  }

  function setVisible(visible) {
    group.visible = Boolean(visible);
  }

  function setEdgesVisible(visible) {
    edgesVisible = Boolean(visible);
    for (const segs of sketchEdgeGroups) {
      segs.visible = edgesVisible;
    }
  }

  function setMood(nextMood = 'day') {
    if (scene) {
      applyExhibitionDistanceFog({ THREE, scene, mood: nextMood, mistUniforms });
    } else {
      updateWorldMistUniformsForMood(mistUniforms, nextMood);
    }
  }

  function setNightFactor() {
    // Strictly 0 emissive in exhibition mode
  }

  function update(dt = 0) {
    if (pal.water?.normalMap && dt > 0) {
      pal.water.normalMap.offset.x = (pal.water.normalMap.offset.x + dt * 0.014) % 1;
      pal.water.normalMap.offset.y = (pal.water.normalMap.offset.y + dt * 0.009) % 1;
    }
  }

  function getMetrics() {
    return {
      step: currentStep,
      edgesVisible,
      sketchLineGroupCount: sketchEdgeGroups.length,
      sketchLineSegments: totalEdgeSegments,
      treeCount: treeList.length,
      lampCount: lampList.length + plazaLampList.length,
      distanceLimits: WORLD_DISTANCE_LIMITS,
    };
  }

  const api = {
    group,
    sketchEdges: rootSketchEdges,
    sketchEdgeGroups,
    mistUniforms,
    materials: pal,
    setVisible,
    setEdgesVisible,
    setStep,
    setMood,
    setNightFactor,
    update,
    getMetrics,
    audit: () => auditWorldSketchAndFog({ THREE, scene, parisWorld: api }),
  };

  setStep(11.0);
  return api;
}

// Preserve drop-in export symbol expected by `app.js` and `perf/`
export const createParis1889World = createTehranMiladWorld;

export {
  EXHIBITION_FOG_PRESETS,
  WORLD_DISTANCE_LIMITS,
  PARIS_SKETCH_WORLD_PALETTE,
  applyExhibitionDistanceFog,
  auditWorldSketchAndFog,
};
