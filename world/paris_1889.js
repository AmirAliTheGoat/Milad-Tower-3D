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

  // Northern Alborz Mountains & Tochal massif (`z < -720 m`)
  // Sculpted dramatic multi-ridge northern wall rising to 480–575 m behind Milad Tower
  if (z < -720.0) {
    const northT = smoothstep(-720.0, -1180.0, z);
    const highRidgeT = smoothstep(-920.0, -1480.0, z);
    const farWallT = smoothstep(-1150.0, -1720.0, z);
    const r1 = 1.0 - Math.abs(Math.sin(x * 0.0023 + 0.55));
    const r2 = 1.0 - Math.abs(Math.sin(x * 0.0054 - 1.12 + z * 0.0018));
    const r3 = 1.0 - Math.abs(Math.cos(x * 0.0108 + z * 0.0032));
    const tochalCenter = Math.exp(-Math.pow((x - 95.0) / 720.0, 2.0));
    const darakehShoulder = Math.exp(-Math.pow((x + 620.0) / 580.0, 2.0));
    const kolakchalEast = Math.exp(-Math.pow((x - 840.0) / 620.0, 2.0));

    const foothills = northT * (145.0 * r1 + 68.0 * r2 + 28.0 * r3);
    const mainMassif =
      highRidgeT *
      (295.0 * tochalCenter + 235.0 * darakehShoulder + 225.0 * kolakchalEast) *
      (0.62 + 0.38 * r1);
    const highCrown = farWallT * (135.0 * tochalCenter + 95.0 * darakehShoulder + 85.0 * kolakchalEast) * (0.5 + 0.5 * r2);
    y += foothills + mainMassif + highCrown;
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
  const segX = 160;
  const segZ = 160;
  const geo = new THREE.PlaneGeometry(sizeX, sizeZ, segX, segZ);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let y = sampleTehranElevation(x, z);
    // Open true 14 m excavation depression cleanly inside `r < 44 m` (bridged by `pitGradeCollar` at r = 35..62 m)
    // so NO coarse terrain triangle ever intrudes into the circular excavation pit!
    const r = Math.hypot(x, z);
    if (r < 44.0) {
      y = -15.2;
    } else if (r < 60.0) {
      const t = smoothstep(44.0, 60.0, r);
      y = -15.2 * (1.0 - t) + y * t;
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

/**
 * Dedicated higher-resolution faceted Alborz Mountain massif (`z = -740 .. -1720 m`)
 * overlaying the northern foothills with crisp angular slate-rock facets (`pal.alborzRock`)
 * and sunlit snow-dusted ridge caps (`pal.alborzSnow`) for bold silhouettes in Stops 8 & 9.
 */
function buildSculptedAlborzMassif({ THREE, pal }) {
  const grp = new THREE.Group();
  grp.name = 'alborz_massif_group';

  const widthX = 3600;
  const depthZ = 980;
  const zCenter = -1230;
  const rockGeo = new THREE.PlaneGeometry(widthX, depthZ, 78, 28);
  rockGeo.rotateX(-Math.PI / 2);

  const rPos = rockGeo.attributes.position;
  for (let i = 0; i < rPos.count; i++) {
    const x = rPos.getX(i);
    const z = rPos.getZ(i) + zCenter;
    let y = sampleTehranElevation(x, z) + 2.2;
    // Add crisp angular geological crag facets on upper slopes
    const crag =
      Math.sin(x * 0.017 + z * 0.011) * 14.0 +
      Math.cos(x * 0.031 - z * 0.019) * 8.5;
    const slopeGain = smoothstep(-780.0, -1080.0, z);
    // Feather front & back edges cleanly below base terrain so no seam appears
    const edgeFeather =
      smoothstep(-740.0, -810.0, z) * smoothstep(-1720.0, -1620.0, z);
    y = y + crag * slopeGain - (1.0 - edgeFeather) * 18.0;
    rPos.setZ(i, z);
    rPos.setY(i, y);
  }
  rockGeo.computeVertexNormals();

  const rockMesh = new THREE.Mesh(rockGeo, pal.alborzRock);
  rockMesh.name = 'alborz_mountain_range';
  rockMesh.receiveShadow = true;
  rockMesh.castShadow = false;
  rockMesh.userData.noSketchEdges = true;
  grp.add(rockMesh);

  // High-elevation faceted snow-dusted ridge crests (`y > 235 m`, matching winter Alborz snow streaks)
  const snowGeo = new THREE.PlaneGeometry(3100, 620, 64, 18);
  snowGeo.rotateX(-Math.PI / 2);
  const sPos = snowGeo.attributes.position;
  for (let i = 0; i < sPos.count; i++) {
    const x = sPos.getX(i);
    const z = sPos.getZ(i) - 1340;
    const baseH = sampleTehranElevation(x, z);
    const ridgeMask = smoothstep(235.0, 320.0, baseH);
    const gully = 0.5 + 0.5 * Math.sin(x * 0.024 + z * 0.016);
    const y = baseH + 3.4 + (gully - 0.35) * 12.0 * ridgeMask - (1.0 - ridgeMask) * 48.0;
    sPos.setZ(i, z);
    sPos.setY(i, y);
  }
  snowGeo.computeVertexNormals();

  const snowMesh = new THREE.Mesh(snowGeo, pal.alborzSnow);
  snowMesh.name = 'alborz_snow_caps';
  snowMesh.receiveShadow = true;
  snowMesh.castShadow = false;
  snowMesh.userData.noSketchEdges = true;
  grp.add(snowMesh);

  return grp;
}

function buildAlborzRidgeContourLines({ lineSeg, targetGrp }) {
  // Architectural topographic contour strokes along the bold northern Alborz ridgeline
  const zBands = [-880, -1040, -1200, -1360, -1540];
  for (const zb of zBands) {
    const stepX = 95;
    for (let x = -1900; x < 1900; x += stepX) {
      const x1 = x + stepX;
      const y0 = sampleTehranElevation(x, zb) + 5.5;
      const y1 = sampleTehranElevation(x1, zb) + 5.5;
      lineSeg(targetGrp, x, y0, zb, x1, y1, zb);
    }
  }
  // Mountain spur ridges running down toward northern Tehran
  for (let x = -1650; x <= 1650; x += 220) {
    for (let z = -1560; z < -820; z += 110) {
      const z1 = z + 110;
      const y0 = sampleTehranElevation(x, z) + 5.5;
      const y1 = sampleTehranElevation(x, z1) + 5.5;
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

  // Crisp grade collar rimming the 66 m circular pit (`r = 35.0 .. 62.0 m` at `y = -0.05 m`)
  const pitGradeCollarGeo = new THREE.RingGeometry(35.0, 62.0, 64);
  pitGradeCollarGeo.rotateX(-Math.PI / 2);
  const pitGradeCollar = new THREE.Mesh(pitGradeCollarGeo, pal.gravelSkirt);
  pitGradeCollar.position.y = -0.05;
  pitGradeCollar.receiveShadow = true;
  pitGradeCollar.userData.noSketchEdges = true;
  terrainGroup.add(pitGradeCollar);

  // Dedicated sculpted faceted Alborz Mountain rock wall & snow-dusted upper peaks
  terrainGroup.add(buildSculptedAlborzMassif({ THREE, pal }));
  buildAlborzRidgeContourLines({ lineSeg, targetGrp: terrainGroup });

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

  // Elevated highway interchange overpasses & full 4-petal cloverleaf ramps at the 4 corners
  const interchanges = [
    [355, -325],
    [-345, -325],
    [355, 335],
    [-345, 335],
  ];
  for (const [ix, iz] of interchanges) {
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(66, 2.4, 26), pal.stone);
    bridge.position.set(ix, yBasin + 5.0, iz);
    highwaysGroup.add(bridge);

    // 4 Sweeping cloverleaf ramp petals (clearly visible from 315 m rooftop in Stop 7!)
    const petalOffsets = [
      [42, 42],
      [-42, 42],
      [42, -42],
      [-42, -42],
    ];
    for (const [ox, oz] of petalOffsets) {
      const rampGeo = new THREE.TorusGeometry(36, 4.6, 6, 24);
      rampGeo.rotateX(Math.PI / 2);
      const ramp = new THREE.Mesh(rampGeo, pal.street);
      ramp.scale.set(1, 0.22, 1);
      ramp.position.set(ix + ox, yBasin + 0.38, iz + oz);
      ramp.userData.noSketchEdges = true;
      highwaysGroup.add(ramp);
      ring(highwaysGroup, ix + ox, yBasin + 0.92, iz + oz, 40.5, 40.5, 24);
      ring(highwaysGroup, ix + ox, yBasin + 0.92, iz + oz, 31.5, 31.5, 24);
    }
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
    // Clamp northern city fabric strictly south of Alborz foothills (`gz >= -640`) so ZERO blocks ever float!
    for (let gz = -640; gz <= 1180; gz += 78) {
      const r = Math.hypot(gx, gz);
      // Keep Gisha Hilltop slopes clear (`r < 395`)
      if (r < 395) continue;
      // Keep expressway & cloverleaf interchange corridors clear
      if (Math.abs(gz + 325) < 52 || Math.abs(gz - 335) < 52) continue;
      if (Math.abs(gx - 355) < 50 || Math.abs(gx + 345) < 50) continue;
      if (Math.hypot(gx + 345, gz + 325) < 105 || Math.hypot(gx - 355, gz + 325) < 105) continue;
      if (r > 1380) continue;

      const h1 = hash2(gx, gz);
      if (h1 < 0.24) continue; // Parks, courtyards, and neighborhood streets

      const h2 = hash2(gx + 19, gz - 31);
      const h3 = hash2(gx - 43, gz + 17);
      const jx = gx + (h2 - 0.5) * 24;
      const jz = gz + (h3 - 0.5) * 24;
      if (jz < -680) continue;
      const groundY = sampleTehranElevation(jx, jz);
      // Never place urban boxes on steep rising northern foothills
      if (groundY > -14.0) continue;

      const w = 18 + h1 * 28;
      const d = 18 + h2 * 26;
      // Shahrak-e Gharb (NW) & Vanak (NE) feature taller modernist towers; Gisha (S/SW) mid-rise blocks
      const isTowerCluster = (jx < -400 && jz < -360) || (jx > 420 && jz < -360);
      const h = isTowerCluster ? 22 + h3 * 46 : 11 + h3 * 22;

      // Embed every block 6 m deep into the Tehran basin floor so zero buildings ever float on undulations
      const skirtDepth = 6.0;
      const totalH = h + skirtDepth;
      const tuple = [jx, groundY + (h - skirtDepth) * 0.5, jz, w, totalH, d, (h1 > 0.7 ? 0.08 : 0)];
      if (h2 > 0.48) {
        blocksLight.push(tuple);
      } else {
        blocksMid.push(tuple);
      }
      roofs.push([jx, groundY + h + 0.2, jz, w * 0.96, 1.0, d * 0.96, tuple[6]]);
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
    // Show finished Milad Cultural Plaza & reflecting pools once the base lobby encloses (`step >= 7.8`)
    plazaGroup.visible = s >= 7.8;
    plazaLampGroup.visible = s >= 8.5;
    // Keep construction perimeter hoarding & site cabins active through head & lobby assembly (`step < 8.2`)
    siteFenceGroup.visible = s < 8.2;
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
