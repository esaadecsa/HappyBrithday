/* =========================================================
   THREE-FX — lapisan fitur 3D/canggih, terpisah dari script.js
   ---------------------------------------------------------
   Modul ini sepenuhnya OPSIONAL & aman:
   - Kalau device tidak mendukung WebGL, atau user mengaktifkan
     "reduced motion", atau CDN Three.js gagal dimuat (mis. tidak
     ada internet) → seluruh file ini diam-diam tidak melakukan
     apa-apa, dan halaman tetap berjalan normal dengan versi
     2D/CSS aslinya (dari script.js + style.css).
   - Setiap fitur baru menyalakan class ".ready"/".has-3d" HANYA
     setelah render pertamanya berhasil, jadi tidak ada elemen
     3D yang nyangkut kosong/transparan kalau ada error.
   - Tidak mengubah / menggantikan logika di script.js — cuma
     "nempel" di atas lewat MutationObserver & event listener
     tambahan, jadi PIN gate, minigame, playlist, dsb tetap jalan
     seperti biasa.
   ========================================================= */
import * as THREE from "three";

const REDUCE_MOTION =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

/* Nyala/matiin sebuah render loop otomatis mengikuti kelas
   ".active" di <section id="..."> — jadi kalau slide-nya lagi
   tidak dilihat, animasi berhenti (hemat baterai/CPU). */
function onScreenActive(sectionId, cb) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const check = () => cb(el.classList.contains("active"));
  check();
  new MutationObserver(check).observe(el, {
    attributes: true,
    attributeFilter: ["class"]
  });
}

function makeHeartTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.translate(32, 26);
  ctx.beginPath();
  ctx.moveTo(0, 16);
  ctx.bezierCurveTo(0, 0, -32, 0, -32, 16);
  ctx.bezierCurveTo(-32, 26, -10, 40, 0, 52);
  ctx.bezierCurveTo(10, 40, 32, 26, 32, 16);
  ctx.bezierCurveTo(32, 0, 0, 0, 0, 16);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,220,150,.85)");
  g.addColorStop(1, "rgba(255,180,72,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/* =========================================================
   1) BACKGROUND 3D — starfield + hati melayang, parallax
      mengikuti pointer (desktop) / gyro (mobile).
   ========================================================= */
function initBackground() {
  const canvas = document.getElementById("fx3dBg");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power"
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 20;

  function resize() {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  // starfield
  const STAR_COUNT = 220;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 46;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    starPos[i * 3 + 2] = -4 - Math.random() * 26;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xf0e2b8,
    size: 0.09,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // hati melayang
  const heartTex = makeHeartTexture();
  const HEART_COUNT = 14;
  const hearts = [];
  const heartGroup = new THREE.Group();
  function resetHeart(spr) {
    spr.position.set(
      (Math.random() - 0.5) * 30,
      -16 - Math.random() * 8,
      -6 - Math.random() * 14
    );
    spr.userData.speed = 0.35 + Math.random() * 0.5;
    spr.userData.drift = (Math.random() - 0.5) * 0.5;
  }
  for (let i = 0; i < HEART_COUNT; i++) {
    const mat = new THREE.SpriteMaterial({
      map: heartTex,
      color: Math.random() > 0.5 ? 0xeecd8e : 0xe0899f,
      transparent: true,
      opacity: 0.45 + Math.random() * 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const spr = new THREE.Sprite(mat);
    const s = 0.5 + Math.random() * 0.9;
    spr.scale.set(s, s, 1);
    resetHeart(spr);
    heartGroup.add(spr);
    hearts.push(spr);
  }
  scene.add(heartGroup);

  let targetRotX = 0,
    targetRotY = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      targetRotY = (e.clientX / innerWidth - 0.5) * 0.25;
      targetRotX = (e.clientY / innerHeight - 0.5) * 0.15;
    },
    { passive: true }
  );
  window.addEventListener(
    "deviceorientation",
    (e) => {
      if (e.gamma == null || e.beta == null) return;
      targetRotY = THREE.MathUtils.clamp(e.gamma / 45, -1, 1) * 0.2;
      targetRotX = THREE.MathUtils.clamp((e.beta - 45) / 45, -1, 1) * 0.12;
    },
    { passive: true }
  );

  let running = true;
  const clock = new THREE.Clock();
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    scene.rotation.y += (targetRotY - scene.rotation.y) * 0.03;
    scene.rotation.x += (targetRotX - scene.rotation.x) * 0.03;
    starMat.opacity = 0.55 + Math.sin(t * 0.8) * 0.15;

    hearts.forEach((spr) => {
      spr.position.y += spr.userData.speed * 0.02;
      spr.position.x += Math.sin(t + spr.position.y) * 0.002 + spr.userData.drift * 0.002;
      spr.material.rotation += 0.002;
      if (spr.position.y > 16) resetHeart(spr);
    });

    renderer.render(scene, camera);
  }
  tick();
  canvas.classList.add("ready");

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) tick();
  });
}

/* =========================================================
   2) KADO 3D — kotak hadiah low-poly yang bisa dimiringkan
      (ikut pointer), dan "kebuka" beneran (tutup terangkat +
      partikel meledak) pas ditap, sinkron dengan interaksi asli.
   ========================================================= */
function initGift() {
  const wrap = document.getElementById("giftObject");
  const canvas = document.getElementById("giftCanvas");
  if (!wrap || !canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 1.05, 5.6);
  camera.lookAt(0, 0.25, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.PointLight(0xe6a8bd, 1.1, 20);
  key.position.set(2, 3, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0x9c3f68, 0.85, 20);
  rim.position.set(-3, -1, -3);
  scene.add(rim);

  const boxMat = new THREE.MeshStandardMaterial({ color: 0x7a2f48, roughness: 0.35, metalness: 0.15 });
  const lidMat = new THREE.MeshStandardMaterial({ color: 0xc9a15a, roughness: 0.3, metalness: 0.2 });
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xc9a15a,
    roughness: 0.25,
    metalness: 0.35,
    emissive: 0x3a2410,
    emissiveIntensity: 0.15
  });

  const group = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.35, 1.5), boxMat);
  body.position.y = -0.1;
  group.add(body);

  const ribbonV = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.4, 1.56), ribbonMat);
  ribbonV.position.y = -0.1;
  group.add(ribbonV);
  const ribbonH = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.32, 1.56), ribbonMat);
  ribbonH.position.y = -0.1;
  group.add(ribbonH);

  // tutup punya pivot sendiri di tepi belakang biar bisa "terungkit" terbuka
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.62, -0.75);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.34, 1.62), lidMat);
  lid.position.set(0, 0, 0.75);
  lidPivot.add(lid);
  group.add(lidPivot);

  const bowMat = ribbonMat.clone();
  const bow = new THREE.Mesh(new THREE.TorusKnotGeometry(0.2, 0.075, 60, 8, 2, 3), bowMat);
  bow.position.set(0, 0.85, 0);
  bow.scale.setScalar(0.85);
  group.add(bow);

  scene.add(group);

  // partikel ledakan pas kado dibuka
  const PARTICLE_COUNT = 60;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PARTICLE_COUNT * 3);
  const pVel = Array.from({ length: PARTICLE_COUNT }, () => new THREE.Vector3());
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xeccdd6,
    size: 0.09,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);
  let burstActive = false;
  let burstT = 0;

  function resize() {
    const r = wrap.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let targetTiltX = 0,
    targetTiltY = 0,
    tiltX = 0,
    tiltY = 0;
  wrap.addEventListener("pointermove", (e) => {
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    targetTiltY = px * 0.5;
    targetTiltX = -py * 0.35;
  });
  wrap.addEventListener("pointerleave", () => {
    targetTiltX = 0;
    targetTiltY = 0;
  });

  function animateOpen() {
    const start = performance.now();
    const dur = 650;
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - t, 3);
      lidPivot.rotation.x = -ease * 2.1;
      bow.position.y = 0.85 + ease * 1.4;
      bow.material.opacity = 1 - ease * 0.3;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Dengar klik yang sama dengan script.js (listener tambahan, tidak
  // menggantikan logika yes/no/shake yang sudah ada di sana).
  let opened = false;
  wrap.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    setTimeout(() => {
      animateOpen();
      burstActive = true;
      burstT = 0;
      pMat.opacity = 1;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1.2 + Math.random() * 2.2;
        pVel[i].set(Math.cos(a) * s, 1.6 + Math.random() * 2.2, Math.sin(a) * s * 0.6);
        pPos[i * 3] = 0;
        pPos[i * 3 + 1] = 0.5;
        pPos[i * 3 + 2] = 0;
      }
      pGeo.attributes.position.needsUpdate = true;
    }, 420); // selaras dengan animasi "shaking" ~430ms di script.js
  });

  let running = true;
  let spin = 0;
  const clock = new THREE.Clock();
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    spin += dt * 0.3;
    tiltX += (targetTiltX - tiltX) * 0.08;
    tiltY += (targetTiltY - tiltY) * 0.08;
    group.rotation.y = spin * 0.35 + tiltY;
    group.rotation.x = tiltX;

    if (burstActive) {
      burstT += dt;
      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        arr[i * 3] += pVel[i].x * dt;
        arr[i * 3 + 1] += pVel[i].y * dt;
        arr[i * 3 + 2] += pVel[i].z * dt;
        pVel[i].y -= dt * 3.2;
      }
      pGeo.attributes.position.needsUpdate = true;
      pMat.opacity = Math.max(0, 1 - burstT / 1.1);
      if (burstT > 1.1) burstActive = false;
    }

    renderer.render(scene, camera);
  }

  wrap.classList.add("has-3d");
  canvas.classList.add("ready");
  onScreenActive("gift", (active) => {
    running = active;
    if (active) tick();
  });
}

/* =========================================================
   3) API LILIN 3D — partikel api asli (naik, berkedip, additive
      glow), otomatis jadi asap begitu #cakeScene dapat class
      "blown" (dari logic tiup/mic yang sudah ada di script.js).
   ========================================================= */
function initFlame() {
  const cakeScene = document.getElementById("cakeScene");
  const canvas = document.getElementById("flameCanvas");
  if (!cakeScene || !canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1.4, -0.6, 0.1, 10);
  camera.position.z = 3;

  const glowTex = makeGlowTexture();

  const COUNT = 34;
  const positions = new Float32Array(COUNT * 3);
  const velocities = [];
  const life = new Float32Array(COUNT);
  const maxLife = new Float32Array(COUNT);
  function spawnParticle(i) {
    positions[i * 3] = (Math.random() - 0.5) * 0.12;
    positions[i * 3 + 1] = -0.35 + Math.random() * 0.1;
    positions[i * 3 + 2] = 0;
    velocities[i] = new THREE.Vector3((Math.random() - 0.5) * 0.25, 0.9 + Math.random() * 0.6, 0);
    maxLife[i] = 0.5 + Math.random() * 0.4;
    life[i] = 0;
  }
  for (let i = 0; i < COUNT; i++) spawnParticle(i);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    map: glowTex,
    size: 0.5,
    color: 0xc9a15a,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  scene.add(new THREE.Points(geo, mat));

  const core = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xf5e6c0,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  core.scale.set(0.5, 0.72, 1);
  core.position.set(0, -0.2, 0.01);
  scene.add(core);

  function resize() {
    const r = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
  }
  resize();
  window.addEventListener("resize", resize);

  let extinguished = false;

  function syncState() {
    const locked = cakeScene.classList.contains("locked");
    const blown = cakeScene.classList.contains("blown");
    canvas.classList.toggle("hide-locked", locked);
    if (blown && !extinguished) {
      extinguished = true;
    } else if (!blown && !locked && extinguished) {
      extinguished = false;
      mat.opacity = 0.9;
      mat.color.set(0xc9a15a);
      for (let i = 0; i < COUNT; i++) spawnParticle(i);
    }
  }
  new MutationObserver(syncState).observe(cakeScene, {
    attributes: true,
    attributeFilter: ["class"]
  });
  syncState();

  let running = true;
  const clock = new THREE.Clock();
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    core.material.opacity = extinguished ? 0 : 0.85 + Math.sin(t * 14) * 0.12;
    core.scale.set(0.5 + Math.sin(t * 10) * 0.04, 0.72 + Math.sin(t * 13) * 0.06, 1);

    const arr = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      life[i] += dt;
      if (life[i] > maxLife[i]) {
        if (extinguished) continue; // biarkan padam, tidak respawn
        spawnParticle(i);
      }
      arr[i * 3] += velocities[i].x * dt + Math.sin(t * 4 + i) * 0.002;
      arr[i * 3 + 1] += velocities[i].y * dt * (extinguished ? 2.2 : 1);
      if (extinguished) velocities[i].x *= 1.01;
    }
    geo.attributes.position.needsUpdate = true;
    if (extinguished) {
      mat.opacity = Math.max(0, mat.opacity - dt * 0.9);
      mat.color.lerp(new THREE.Color(0x8f8686), dt * 1.5);
    }

    renderer.render(scene, camera);
  }

  canvas.classList.add("ready");
  onScreenActive("candle", (active) => {
    running = active;
    if (active) tick();
  });
}

/* =========================================================
   4) CAROUSEL POLAROID 3D — foto-foto yang sudah ada di
      #polaroidStack dipakai sebagai tekstur, disusun melengkung
      (coverflow), bisa digeser (drag/swipe) dengan inersia.
   ========================================================= */
function initPolaroid() {
  const stack = document.getElementById("polaroidStack");
  const canvas = document.getElementById("polaroidCanvas");
  const captionEl = document.getElementById("polaroidCaption3d");
  if (!stack || !canvas) return;

  const items = Array.from(stack.querySelectorAll(".polaroid")).map((fig) => ({
    src: fig.querySelector("img")?.getAttribute("src") || "",
    caption: fig.querySelector("figcaption")?.textContent || ""
  }));
  if (!items.length) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
  camera.position.set(0, 0, 7);

  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const key = new THREE.PointLight(0xffffff, 0.5, 30);
  key.position.set(2, 3, 6);
  scene.add(key);

  const loader = new THREE.TextureLoader();
  const group = new THREE.Group();
  scene.add(group);

  const cards = items.map((item) => {
    const cardGroup = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 2.35, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xf4ecdf, roughness: 0.85 })
    );
    cardGroup.add(frame);
    const photoMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 1.72), photoMat);
    photo.position.set(0, 0.28, 0.03);
    cardGroup.add(photo);
    loader.load(
      item.src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        photoMat.map = tex;
        photoMat.color.set(0xffffff);
        photoMat.needsUpdate = true;
      },
      undefined,
      () => {} // foto gagal dimuat -> biarkan kotak abu-abu, tidak error
    );
    group.add(cardGroup);
    return cardGroup;
  });

  const RADIUS = 4.4;
  function layout(activeFloat) {
    const n = cards.length;
    cards.forEach((c, i) => {
      let d = i - activeFloat;
      d = ((d % n) + n) % n;
      if (d > n / 2) d -= n;
      const angle = d * (Math.PI / 5.2);
      c.position.x = Math.sin(angle) * RADIUS;
      c.position.z = Math.cos(angle) * RADIUS - RADIUS;
      c.rotation.y = angle;
      const focus = 1 - Math.min(1, Math.abs(d));
      const s = 0.72 + focus * 0.34;
      c.scale.setScalar(s);
    });
  }

  let active = 0;
  let activeIndex = 0;
  function updateCaption() {
    if (captionEl) captionEl.textContent = items[activeIndex].caption;
  }
  layout(active);
  updateCaption();

  function resize() {
    const r = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let dragging = false,
    startX = 0,
    startActive = 0,
    lastX = 0,
    lastT = 0,
    velocity = 0,
    snapping = false,
    snapTarget = 0;

  function snapTo(idx) {
    const n = items.length;
    snapTarget = idx;
    activeIndex = ((idx % n) + n) % n;
    snapping = true;
    updateCaption();
  }

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    startActive = active;
    lastX = e.clientX;
    lastT = performance.now();
    velocity = 0;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    active = startActive - dx / 130;
    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    velocity = (e.clientX - lastX) / dt;
    lastX = e.clientX;
    lastT = now;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    snapTo(Math.round(active - velocity * 2.4));
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", () => {
    if (dragging) endDrag();
  });

  let running = true;
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    if (!dragging && snapping) {
      active += (snapTarget - active) * 0.18;
      if (Math.abs(snapTarget - active) < 0.002) {
        active = snapTarget;
        snapping = false;
      }
    }
    layout(active);
    renderer.render(scene, camera);
  }
  tick();

  stack.classList.add("has-3d");
  canvas.classList.add("ready");
  if (captionEl) captionEl.classList.add("ready");
  onScreenActive("polaroid", (isActive) => {
    running = isActive;
    if (isActive) tick();
  });
}

/* =========================================================
   INIT — cuma nyala kalau device sanggup & user tidak minta
   motion dikurangi.
   ========================================================= */
if (!REDUCE_MOTION && hasWebGL()) {
  try {
    initBackground();
  } catch (e) {
    console.warn("three-fx: background 3D gagal diinit", e);
  }
  try {
    initGift();
  } catch (e) {
    console.warn("three-fx: kado 3D gagal diinit", e);
  }
  try {
    initFlame();
  } catch (e) {
    console.warn("three-fx: api lilin 3D gagal diinit", e);
  }
  try {
    initPolaroid();
  } catch (e) {
    console.warn("three-fx: carousel polaroid 3D gagal diinit", e);
  }
}
