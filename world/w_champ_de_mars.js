/**
 * Surrounding Tehran World — Sub-Module 2: Northwest Tehran Expressways & Urban Fabric
 * (`world/w_champ_de_mars.js`)
 *
 * Preserves the exact `buildChampDeMars(ctx)` export contract while modeling:
 *   - Four cardinal arterial expressways ringing Gisha Hilltop:
 *       * Shahid Hemmat Expressway (North corridor)
 *       * Shahid Hakim Expressway (South corridor)
 *       * Shahid Chamran Expressway (East corridor)
 *       * Sheikh Fazlollah Nouri Expressway (West corridor)
 *   - Sweeping curving interchange ramps and hillside access loops climbing up to Milad Plaza
 *   - Stylized monochrome-sketch modernist Tehran residential & commercial blocks (Gisha & Shahrak-e Gharb)
 */

export function buildChampDeMars(ctx) {
  const { THREE, pal, box, lineSeg, addTree } = ctx;
  const group = new THREE.Group();
  group.name = 'tehran_highways_and_districts';

  const valleyY = -25.8;

  // 1. Four Major Arterial Expressways (Raised Ribbon Decks with Median Strips)
  const addHighwayCorridor = (x, z, lenX, lenZ, rotY = 0) => {
    const deck = box(group, pal.slate, x, valleyY + 0.55, z, lenX, 1.1, lenZ, rotY);
    deck.receiveShadow = true;
    // Median parapet strip
    const isEW = lenX >= lenZ;
    box(
      group,
      pal.stone,
      x,
      valleyY + 1.35,
      z,
      isEW ? lenX : 1.4,
      0.55,
      isEW ? 1.4 : lenZ,
      rotY,
      { noSketchEdges: true }
    );
  };

  // Hemmat Expressway (North, z = -470 m)
  addHighwayCorridor(0, -470, 2600, 28, 0.04);
  // Hakim Expressway (South, z = +490 m)
  addHighwayCorridor(0, 490, 2600, 28, -0.03);
  // Chamran Expressway (East, x = +520 m)
  addHighwayCorridor(520, 0, 26, 2200, 0.05);
  // Sheikh Fazlollah Nouri Expressway (West, x = -500 m)
  addHighwayCorridor(-500, 0, 26, 2200, -0.04);

  // Sweeping Elevated Access Loop climbing from Hakim/Chamran toward Gisha Hilltop
  const rampSegs = 22;
  for (let i = 0; i < rampSegs; i++) {
    const t0 = i / rampSegs;
    const t1 = (i + 1) / rampSegs;
    const a0 = -0.35 + t0 * Math.PI * 1.15;
    const a1 = -0.35 + t1 * Math.PI * 1.15;
    const r0 = 435 - t0 * 285;
    const r1 = 435 - t1 * 285;
    const y0 = valleyY + 1.2 + t0 * 24.4;
    const y1 = valleyY + 1.2 + t1 * 24.4;

    const x0 = Math.cos(a0) * r0;
    const z0 = Math.sin(a0) * r0;
    const x1 = Math.cos(a1) * r1;
    const z1 = Math.sin(a1) * r1;

    const dx = x1 - x0;
    const dz = z1 - z0;
    const segLen = Math.hypot(dx, dz);
    const yaw = Math.atan2(dx, dz);

    box(group, pal.stone, 0.5 * (x0 + x1), 0.5 * (y0 + y1), 0.5 * (z0 + z1), 11.5, 1.4, segLen + 1.6, yaw);
    lineSeg(group, x0, y0 + 0.8, z0, x1, y1 + 0.8, z1);

    // Viaduct concrete support piers along elevated sections
    if (i % 3 === 1 && y0 > valleyY + 3.5) {
      const pierH = y0 - valleyY;
      box(group, pal.cream, x0, valleyY + pierH * 0.5, z0, 2.4, pierH, 2.4, 0);
    }
  }

  // 2. Stylized Modernist Tehran Urban Fabric (Shahrak-e Gharb to the NW/W, Gisha to the S/SE, Vanak to the E)
  // Deterministic pseudo-random helper so city blocks stay 100% reproducible
  let seed = 13870716;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const districts = [
    // Gisha residential grid (South & Southeast)
    { cx: 140, cz: 660, spreadX: 460, spreadZ: 240, count: 52, minH: 14, maxH: 34 },
    { cx: -260, cz: 680, spreadX: 380, spreadZ: 220, count: 44, minH: 16, maxH: 38 },
    // Shahrak-e Gharb modernist high-rises (West & Northwest)
    { cx: -740, cz: 40, spreadX: 320, spreadZ: 560, count: 46, minH: 20, maxH: 58 },
    { cx: -680, cz: -660, spreadX: 360, spreadZ: 260, count: 30, minH: 22, maxH: 54 },
    // Vanak / Saadat Abad / North-East mid-rises
    { cx: 760, cz: -40, spreadX: 320, spreadZ: 540, count: 46, minH: 18, maxH: 56 },
    { cx: 640, cz: -660, spreadX: 380, spreadZ: 260, count: 32, minH: 20, maxH: 50 },
    // Northern foothills residential clusters (south of Alborz slopes)
    { cx: 0, cz: -690, spreadX: 620, spreadZ: 210, count: 38, minH: 16, maxH: 42 },
  ];

  const wallMats = [pal.cream, pal.stone, pal.marble];
  for (const d of districts) {
    for (let i = 0; i < d.count; i++) {
      const bx = d.cx + (rand() - 0.5) * d.spreadX;
      const bz = d.cz + (rand() - 0.5) * d.spreadZ;
      // Keep clear of Gisha hilltop and main highway medians
      if (Math.hypot(bx, bz) < 485) continue;
      if (Math.abs(bz + 470) < 34 || Math.abs(bz - 490) < 34) continue;
      if (Math.abs(bx - 520) < 32 || Math.abs(bx + 500) < 32) continue;

      const wx = 18 + rand() * 34;
      const wz = 18 + rand() * 34;
      const h = d.minH + rand() * (d.maxH - d.minH);
      const rot = (Math.floor(rand() * 4) * Math.PI) / 8 + (rand() - 0.5) * 0.08;
      const mat = wallMats[i % wallMats.length];

      box(group, mat, bx, valleyY + h * 0.5, bz, wx, h, wz, rot);
      // Flat modernist rooftop mechanical penthouse on taller Tehran towers
      if (h > 32) {
        box(group, pal.slate, bx, valleyY + h + 2.2, bz, wx * 0.45, 4.4, wz * 0.45, rot);
      }
    }
  }

  // Parkland tree clusters along Gisha slopes & highway buffers
  for (let i = 0; i < 42; i++) {
    const a = (i / 42) * Math.PI * 2;
    const r = 345 + (i % 3) * 32;
    addTree(Math.cos(a) * r, -21.5, Math.sin(a) * r, 1.15 + (i % 3) * 0.15);
  }

  function setStep() {}
  function update() {}

  return { group, setStep, update };
}
