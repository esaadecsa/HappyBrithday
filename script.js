/* =========================================================
   CONFIG
   ========================================================= */
const CONFIG = {
  name: "kamu",
  birthday: "2026-10-01T00:00:00+07:00",
  letter: [
    "Hari ini, aku langitkan semua doa baik untuk kamu.",
    "Semoga hal-hal yang membuatmu lelah perlahan berubah menjadi alasan untuk tersenyum.",
    "Semoga langkahmu dimudahkan, rezekimu dilapangkan, dan orang-orang baik selalu menemukan jalan menuju hidupmu.",
    "Dan semoga kamu selalu punya alasan untuk bangga pada dirimu sendiri."
  ],
  // Surat penutup yang muncul di slide sebelum FINAL, tampil dengan animasi ketik.
  farewellLetter: [
    "Aku berhenti mencoba menebak masa depan kita.",
    "Yang aku tahu, setiap orang berhak menemukan jalannya sendiri — dan kamu juga.",
    "Jadi di hari ini, aku titipkan satu harapan: semoga jalanmu selalu membawamu ke tempat yang baik, apa pun arahnya.",
    "Dan semoga, di suatu titik, jalan itu bertemu lagi dengan jalanku."
  ],
  // Ganti dengan endpoint Formspree kamu sendiri, contoh: "https://formspree.io/f/xxxxabcd"
  // Cara dapetin: daftar gratis di https://formspree.io -> New Form -> copy
  // "Form Endpoint"-nya (isinya persis format di atas) -> tempel di sini.
  // Selama masih kosong, catatan permintaan TIDAK akan terkirim ke mana pun
  // (tapi orang yang buka link tetap bisa lanjut menulis & meniup lilin).
  wishFormEndpoint: "",
  // Fallback kalau wishFormEndpoint kosong/gagal: balasan dibuka lewat WhatsApp
  // (format internasional tanpa "+", contoh: "62812xxxxxxx") atau email kamu.
  // Isi salah satu (atau dua-duanya, WhatsApp diprioritaskan) biar tombol
  // "kirim balasan" beneran nyampe ke kamu, bukan cuma tersimpan di HP pengirim.
  replyWhatsapp: "",
  replyEmail: "",
  // PIN gerbang masuk (layar ke-2, setelah time capsule). Kalau PIN yang
  // dimasukkan cocok (persis, case-sensitive), pengunjung dianggap SI TARGET
  // ulang tahun dan dapat pengalaman penuh. Kalau salah, nggak bisa lanjut
  // ke slide berikutnya sama sekali — nggak ada lagi jalur "Anonymous".
  pin: "0000",
  // Playlist ala Spotify di layar pertama. Tambah/ganti sesuka hati:
  // - title/artist: teks yang tampil di kartu lagu
  // - src: path ke file mp3 di folder /music (upload file kamu ke situ)
  // - hue: warna mood (0-360) yang dipakai untuk mewarnai suasana selama
  //   lagu itu diputar — makin lanjut slide-nya, makin terasa nuansanya
  playlist: [
    { id: "monokrom", title: "Terbuang dalam waktu", artist: "Barasuara", src: "./music/terbuang dalam waktu.mp3", hue: 340 },
    { id: "song2", title: "Monokrom", artist: "Tulus", src: "./music/monokrom.mp3", hue: 350 },
    { id: "song3", title: "Somebody's Plesure", artist: "Aziz Hedra", src: "./music/somebody's plesure.mp3", hue: 300 },
    { id: "song4", title: "Hari ini hari Ulang Tahunmu", artist: "Gellen Martadinata", src: "./music/Hari ini hari Ulang Tahunmu.mp3", hue: 280 }
  ]
};

// Mode testing URL: default aman untuk production.
const TIME_CAPSULE_TEST_MODE = false;
const ALLOW_URL_TEST_PARAMS = false;
const IS_LOCAL_DEV = ["localhost", "127.0.0.1", "::1"].includes(location.hostname);

// Satu link buat semua orang sekarang. Parameter testing seperti ?date= dan
// ?unlock=1 hanya aktif di localhost kecuali ALLOW_URL_TEST_PARAMS diubah true.
(function applyUrlParams() {
  if (!ALLOW_URL_TEST_PARAMS && !IS_LOCAL_DEV) return;
  const p = new URLSearchParams(location.search);
  const date = p.get("date");
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) CONFIG.birthday = date + "T00:00:00+07:00";
})();

/* =========================================================
   PIN GATE — PIN selalu bisa diakses.
   Sebelum 1 September, pengunjung boleh sampai layar PIN saja.
   PIN tetap menjadi gerbang utama menuju seluruh cerita.
   ========================================================= */
function initTimeCapsule() {
  const notice = $("#capsuleNotice");
  const eyebrow = $("#pinEyebrow");
  const heading = $("#pinHeading");
  const sub = $("#pinSub");
  const inputGroup = $("#pinInputGroup");
  const input = $("#pinInput");
  const submitBtn = $("#pinSubmitBtn");

  // Time capsule tidak lagi mengunci layar PIN.
  // Pengunjung selalu boleh melihat/mencapai mode PIN.
  // Yang membuka slide berikutnya tetap hanya PIN yang benar.
  if (notice) notice.hidden = true;
  if (eyebrow) eyebrow.textContent = "SATU LANGKAH LAGI";
  if (heading) heading.innerHTML = "Masukkan PIN,<br><em>kalau kamu tahu.</em>";
  if (sub) sub.textContent = "Kalau ini beneran buat kamu, kamu pasti tahu angkanya ✦";
  if (inputGroup) inputGroup.hidden = false;
  input?.removeAttribute("disabled");
  submitBtn?.removeAttribute("disabled");
}

/* ---------- warm the cache: preload the photos ahead of time so the
   letter & polaroid screens don't stutter waiting for them to load ---------- */
(function preloadAssets() {
  ["./img/hbd1.png?v=4", "img/polaroid-1.jpg", "img/polaroid-2.jpg", "img/polaroid-3.jpg", "img/polaroid-4.jpg"].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
})();

/* ---------- tiny haptic buzz on supported devices, for the moments that matter ---------- */
function vibrate(pattern) {
  if (navigator.vibrate) { try { navigator.vibrate(pattern); } catch (e) { /* not supported / blocked — fine to skip */ } }
}


const screens = {
  pin: $("#pin"), intro: $("#intro"), playlist: $("#playlist"), letter: $("#letter"), wish: $("#wish"), mood: $("#mood"), spirit: $("#spirit"), memories: $("#memories"), polaroid: $("#polaroid"), minigame: $("#minigame"), gift: $("#gift"),
  nope: $("#nope"), candle: $("#candle"), flower: $("#flower-screen"), farewell: $("#farewell"), final: $("#final"), reaction: $("#reaction"), reply: $("#reply")
};
const SCREEN_ORDER = ["pin", "playlist", "minigame", "intro", "letter", "wish", "mood", "spirit", "memories", "polaroid", "gift", "candle", "flower", "farewell", "final", "reaction", "reply"];
const music = $("#background-music");
let selectedSongIndex = null;

/* =========================================================
   PIN GATE — dibedakan lewat PIN, bukan lagi lewat URL ?to=
   ========================================================= */
let isTargetUser = false;
function isTargetViewer() { return isTargetUser; }

$("#nameIntro").textContent = CONFIG.name;
$("#nameFinal").textContent = CONFIG.name;
document.title = `For ${CONFIG.name} ♡`;

// Personalize the wax seal monogram: first letter of a real given name,
// or a heart when no name has been supplied.
(function setSealMonogram() {
  const mark = $("#sealMark");
  if (!mark) return;
  const hasRealName = CONFIG.name && CONFIG.name.trim().toLowerCase() !== "kamu";
  mark.textContent = hasRealName ? CONFIG.name.trim()[0].toUpperCase() : "♡";
})();

let noTries = 2;
let sfxOn = true;
let currentScreen = "pin";
let maxReachedIndex = 0;
renderPlaylist();
initTimeCapsule();

/* =========================================================
   TEMA OTOMATIS MENGIKUTI WAKTU NYATA DI DEVICE
   ========================================================= */
function applyTimeOfDayTheme() {
  const hour = new Date().getHours();
  let cls = "time-day";
  if (hour >= 4 && hour < 10) cls = "time-morning";
  else if (hour >= 10 && hour < 17) cls = "time-day";
  else if (hour >= 17 && hour < 20) cls = "time-evening";
  else cls = "time-night";
  document.body.classList.remove("time-morning", "time-day", "time-evening", "time-night");
  document.body.classList.add(cls);
}
applyTimeOfDayTheme();
setInterval(applyTimeOfDayTheme, 15 * 60000);

/* ---------- image fallback: img/hbd1.png → hbd1.png → hide ---------- */
(function setupPhotoFallback() {
  const img = $("#birthdayImage");
  if (!img) return;
  img.addEventListener("error", () => {
    if (img.dataset.fallback !== "1") {
      img.dataset.fallback = "1";
      img.src = "./img/hbd1.png?v=4";
    } else {
      img.closest(".photo-frame")?.style.setProperty("display", "none");
    }
  });
})();

/* ---------- screen navigation ---------- */
function getPrettyScreenName(name) {
  return String(name)
    .replace("minigame", "MINI GAME")
    .replace("polaroid", "MEMORIES")
    .replace("farewell", "LAST LETTER")
    .replace("flower", "FLOWERS")
    .replace("reaction", "REACTION")
    .replace("reply", "YOUR REPLY")
    .toUpperCase();
}

function updateProgress(name) {
  const idx = SCREEN_ORDER.indexOf(name);
  const slider = $("#progressSlider");
  const fill = $("#sliderFill");
  const heart = $("#sliderHeart");
  const label = $("#progressLabel");
  const counter = $("#progressCounter");
  const prev = $("#progressPrev");
  const next = $("#progressNext");
  if (!slider || idx < 0) return;

  const maxReach = hasBlownCandle ? SCREEN_ORDER.length - 1 : maxReachedIndex;
  slider.max = String(SCREEN_ORDER.length - 1);
  slider.value = String(Math.min(idx, maxReach));

  const pct = SCREEN_ORDER.length <= 1 ? 0 : (idx / (SCREEN_ORDER.length - 1)) * 100;
  fill?.style.setProperty("width", pct + "%");
  heart?.style.setProperty("--slider-progress", pct + "%");

  const pretty = getPrettyScreenName(name);
  if (label) label.textContent = pretty;
  if (counter) counter.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(SCREEN_ORDER.length).padStart(2, "0")}`;
  heart?.setAttribute("data-label", pretty);

  const canGoPrev = idx > 0;
  const canGoNext = hasBlownCandle
    ? idx < SCREEN_ORDER.length - 1
    : idx < maxReachedIndex;
  if (prev) prev.disabled = !canGoPrev;
  if (next) next.disabled = !canGoNext;

  updateProgressArrows(idx);
}

function updateProgressArrows(idx) {
  const slider = $("#progressSlider");
  if (!slider || idx < 0) return;
  const maxReach = hasBlownCandle ? SCREEN_ORDER.length - 1 : maxReachedIndex;
  slider.max = String(SCREEN_ORDER.length - 1);
  slider.setAttribute("aria-valuetext", `${idx + 1} dari ${SCREEN_ORDER.length}: ${SCREEN_ORDER[idx]}`);
  slider.dataset.maxReach = String(maxReach);
  slider.classList.toggle("unlocked", hasBlownCandle);
}
function showScreen(name) {
  const target = screens[name];
  if (!target) return;
  Object.values(screens).forEach((x) => x && x.classList.remove("active"));
  target.classList.add("active");
  // Reset each screen's internal scroll when entering it. This prevents a
  // previously visited long card from opening halfway down on mobile.
  requestAnimationFrame(() => { try { target.scrollTo({ top: 0, behavior: "instant" }); } catch (_) { target.scrollTop = 0; } });
  currentScreen = name;
  document.body.dataset.screen = name;
  document.body.classList.remove("page-enter");
  void document.body.offsetWidth;
  document.body.classList.add("page-enter");
  const idx = SCREEN_ORDER.indexOf(name);
  if (idx >= 0 && idx > maxReachedIndex) maxReachedIndex = idx;
  updateProgress(name === "nope" ? "gift" : name);
  window.dispatchEvent(new CustomEvent("screenchange", { detail: name }));
  if (name === "flower") {
    const scene = $("#bouquetScene");
    if (scene) {
      scene.classList.remove("bloom-in");
      void scene.offsetWidth; // force reflow so the entrance animation replays every visit
      scene.classList.add("bloom-in");
    }
  }
  if (name === "polaroid") {
    const stack = $("#polaroidStack");
    if (stack) {
      stack.classList.remove("pop-in");
      void stack.offsetWidth; // force reflow so the entrance animation replays every visit
      stack.classList.add("pop-in");
    }
  }
}
function typeWriter(lines, speed = 25, targetSelector = "#typeText") {
  const el = $(targetSelector);
  el.textContent = "";
  let li = 0, ci = 0;
  const tick = () => {
    if (li >= lines.length) return;
    const line = lines[li];
    if (ci < line.length) {
      el.textContent += line[ci++];
      setTimeout(tick, speed);
    } else {
      el.textContent += "\n\n";
      li++; ci = 0;
      setTimeout(tick, 380);
    }
  };
  tick();
}
function startMusic() { return music.play().catch(() => {}); }

/* =========================================================
   PLAYLIST — pilih lagu ala Spotify di layar pertama, lalu
   nuansa warnanya (mood-hue) ikut menemani slide-slide berikutnya
   ========================================================= */
function applyMoodHue(hue) {
  document.documentElement.style.setProperty("--mood-hue", hue);
  $("#moodGlow")?.classList.add("on");
}
function renderPlaylist() {
  const list = $("#playlistList");
  if (!list) return;
  list.innerHTML = "";
  CONFIG.playlist.forEach((song, i) => {
    const btn = document.createElement("button");
    btn.className = "playlist-item";
    btn.type = "button";
    btn.style.setProperty("--item-hue", song.hue);
    btn.innerHTML = `
      <span class="playlist-cover"></span>
      <span class="playlist-meta">
        <span class="playlist-title">${song.title}</span>
        <span class="playlist-artist">${song.artist}</span>
      </span>
      <span class="playlist-play">▶</span>`;
    btn.onclick = () => selectSong(i);
    list.appendChild(btn);
  });
}
function updatePlaylistPlayMarks() {
  document.querySelectorAll(".playlist-item").forEach((el, idx) => {
    const playMark = el.querySelector(".playlist-play");
    if (!playMark) return;
    playMark.textContent = idx === selectedSongIndex && !music.paused ? "❚❚" : "▶";
  });
}
function selectSong(i) {
  const song = CONFIG.playlist[i];
  if (!song) return;

  // Tapping the song that's already selected & playing should pause it
  // (and tapping it again should resume) instead of always restarting.
  if (i === selectedSongIndex && music.getAttribute("src") === song.src) {
    if (!music.paused) { music.pause(); } else { startMusic(); }
    updatePlaylistPlayMarks();
    return;
  }

  selectedSongIndex = i;
  document.querySelectorAll(".playlist-item").forEach((el, idx) => {
    el.classList.toggle("picked", idx === i);
  });
  const isNewSrc = music.getAttribute("src") !== song.src;
  if (isNewSrc) music.src = song.src;
  // Play right away. If the browser can't play yet because the new
  // source hasn't buffered enough (common right after swapping .src),
  // retry the instant it's ready — this still counts as the same user
  // gesture, so it doesn't get blocked by autoplay policies.
  const playNow = () => startMusic();
  playNow().catch(() => {});
  if (isNewSrc) {
    music.addEventListener("canplay", playNow, { once: true });
  }
  applyMoodHue(song.hue);
  const now = $("#playlistNow"), nowText = $("#playlistNowText");
  if (now && nowText) { now.style.display = "flex"; nowText.textContent = `Sedang diputar: ${song.title}`; }
  const nextBtn = $("#playlistNextBtn");
  if (nextBtn) nextBtn.disabled = false;
  updatePlaylistPlayMarks();
}
music.addEventListener("play", updatePlaylistPlayMarks);
music.addEventListener("pause", updatePlaylistPlayMarks);
function goIntro() {
  showScreen("intro");
}

/* =========================================================
   TINY SYNTHESIZED SFX — no audio files needed
   ========================================================= */
let sfxCtx = null;
function getSfxCtx() {
  if (!sfxCtx) sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
  return sfxCtx;
}
function playSfx(type) {
  if (!sfxOn) return;
  try {
    const ctx = getSfxCtx();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    const presets = {
      tap: { f: 520, to: 640, dur: .09, type: "sine", vol: .05 },
      pop: { f: 300, to: 900, dur: .22, type: "triangle", vol: .06 },
      whoosh: { f: 180, to: 60, dur: .35, type: "sawtooth", vol: .035 },
      chime: { f: 660, to: 990, dur: .5, type: "sine", vol: .055 }
    };
    const p = presets[type] || presets.tap;
    o.type = p.type;
    o.frequency.setValueAtTime(p.f, now);
    o.frequency.exponentialRampToValueAtTime(Math.max(p.to, 1), now + p.dur);
    g.gain.setValueAtTime(p.vol, now);
    g.gain.exponentialRampToValueAtTime(.0001, now + p.dur);
    o.start(now); o.stop(now + p.dur + .02);
  } catch (e) { /* audio unavailable, fail silently */ }
}
$("#sfxBtn").onclick = () => {
  sfxOn = !sfxOn;
  $("#sfxBtn").textContent = sfxOn ? "🔔" : "🔕";
  $("#sfxBtn").style.opacity = sfxOn ? "1" : ".5";
  if (sfxOn) playSfx("tap");
};

/* =========================================================
   AMBIENT LAYERS — floating hearts, shooting stars, starfield
   ========================================================= */
function spawnHeart() {
  const layer = $("#hearts");
  if (!layer) return;
  const e = document.createElement("span");
  e.className = "floating-heart";
  e.textContent = Math.random() > .5 ? "♡" : "♥";
  const size = 11 + Math.random() * 18;
  e.style.left = Math.random() * 100 + "vw";
  e.style.fontSize = size + "px";
  e.style.setProperty("--drift", (Math.random() * 140 - 70) + "px");
  e.style.setProperty("--spin", (Math.random() * 40 - 20) + "deg");
  const dur = 10 + Math.random() * 9;
  e.style.animationDuration = dur + "s";
  layer.appendChild(e);
  setTimeout(() => e.remove(), dur * 1000 + 200);
}
setInterval(spawnHeart, 1700);
for (let i = 0; i < 4; i++) setTimeout(spawnHeart, i * 400);

function spawnShootingStar() {
  const layer = $("#stars");
  if (!layer) return;
  const e = document.createElement("span");
  e.className = "shooting-star";
  e.style.left = (20 + Math.random() * 55) + "vw";
  e.style.top = (5 + Math.random() * 30) + "vh";
  layer.appendChild(e);
  setTimeout(() => e.remove(), 1600);
}
setInterval(() => { if (Math.random() < .5) spawnShootingStar(); }, 4400);

(function buildStarfield() {
  const stars = $("#stars");
  if (!stars) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 42; i++) {
    const s = document.createElement("span");
    s.style.position = "absolute";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    const size = 1 + Math.random() * 2;
    s.style.width = s.style.height = size + "px";
    s.style.borderRadius = "50%";
    s.style.background = "rgba(244,234,217,.8)";
    s.style.opacity = (.1 + Math.random() * .5).toFixed(2);
    s.style.animation = `twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`;
    frag.appendChild(s);
  }
  stars.appendChild(frag);
  const st = document.createElement("style");
  st.textContent = "@keyframes twinkle{50%{opacity:.06;transform:scale(.5)}}";
  document.head.appendChild(st);
})();

/* ---------- cursor glow (desktop) ---------- */
if (window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches) {
  const glow = $("#cursorGlow");
  window.addEventListener("pointermove", (e) => {
    glow.style.transform = `translate(${e.clientX - 130}px, ${e.clientY - 130}px)`;
    glow.classList.add("visible");
  });
  window.addEventListener("pointerleave", () => glow.classList.remove("visible"));
} else {
  /* ---------- touch trail (mobile): a soft glow follows the finger while dragging ---------- */
  const glow = $("#cursorGlow");
  let touchFade = null;
  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    glow.style.transform = `translate(${t.clientX - 130}px, ${t.clientY - 130}px)`;
    glow.classList.add("visible");
    clearTimeout(touchFade);
    touchFade = setTimeout(() => glow.classList.remove("visible"), 420);
  }, { passive: true });
}

/* =========================================================
   FIX: NAV CLEARANCE (biar panah ‹ › / tombol Lanjutkan nggak
   ketutup progress-nav)
   ---------------------------------------------------------
   Sebelumnya jarak aman di bawah tiap .screen itu angka mati
   (108px/104px/98px/86px tergantung breakpoint), padahal tinggi
   asli #progressNav bisa berubah-ubah (teks label kepanjangan,
   font baru selesai load, layar sempit bikin baris nav nambah).
   Begitu nav-nya lebih tinggi dari jarak yang disediakan, dia
   NUTUP tombol "Lanjutkan" / panah kanan-kiri secara visual —
   kelihatan kayak tombolnya "nggak berfungsi", padahal cuma
   ketimpa elemen lain. Di sini tinggi nav diukur langsung dari
   DOM lalu dituliskan ke --nav-clearance, dipakai di CSS sebagai
   padding-bottom .screen, jadi selalu presisi di device apa pun.
   ========================================================= */
function updateNavClearance() {
  const nav = $("#progressNav");
  if (!nav) return;
  const rect = nav.getBoundingClientRect();
  if (!rect.height) return;
  const gapFromBottom = Math.max(0, window.innerHeight - rect.top);
  const clearance = Math.ceil(gapFromBottom + 22); // +buffer kecil biar ada napas
  document.documentElement.style.setProperty("--nav-clearance", clearance + "px");
}
updateNavClearance();
window.addEventListener("load", updateNavClearance);
window.addEventListener("resize", updateNavClearance);
window.addEventListener("orientationchange", () => setTimeout(updateNavClearance, 200));
window.addEventListener("screenchange", () => setTimeout(updateNavClearance, 60));
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(updateNavClearance).catch(() => {});
}
setTimeout(updateNavClearance, 400);
setTimeout(updateNavClearance, 1200);

/* =========================================================
   ANIMASI INTERAKTIF DEKORATIF — tap sparkle
   ---------------------------------------------------------
   Setiap kali layar disentuh/diklik (di luar tombol & area
   interaktif lain), muncul percikan kecil hati/bintang yang
   melayang & memudar — sesuai tema hangat/romantis halaman ini,
   tanpa mengganggu tombol/slider yang sudah ada.
   ========================================================= */
(function tapSparkle() {
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const SYMBOLS = ["♡", "✦", "♥", "✧", "✿"];
  const SKIP_SELECTOR = [
    "button", "a", "input", "textarea", "select", "label",
    ".icon-btn", ".progress-arrow", ".love-slider", ".progress-slider",
    ".mood-btn", ".reaction-btn", ".memory-card", ".gift-object",
    ".seal", ".flock-btn", ".polaroid", ".wish-note-seal"
  ].join(",");

  function burst(x, y) {
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "tap-spark";
      el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 22 + Math.random() * 30;
      el.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(1) + "px");
      el.style.setProperty("--dy", (-Math.abs(Math.sin(angle)) * dist - 28).toFixed(1) + "px");
      el.style.setProperty("--rot", (Math.random() * 50 - 25).toFixed(1) + "deg");
      el.style.setProperty("--tap-size", (11 + Math.random() * 9).toFixed(1) + "px");
      el.style.left = x + "px";
      el.style.top = y + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  }

  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest(SKIP_SELECTOR)) return;
    burst(e.clientX, e.clientY);
  }, { passive: true });
})();

/* ---------- 3D tilt on photo + gift box ---------- */
document.querySelectorAll(".tilt-el").forEach((el) => {
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5;
    const py = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(700px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
});

/* ---------- birthday countdown on intro ---------- */
function updateCountdown() {
  const el = $("#countdown");
  if (!el) return;
  const now = new Date();
  const target = new Date(CONFIG.birthday);
  target.setFullYear(now.getFullYear());
  if (target < now) target.setFullYear(now.getFullYear() + 1);
  const diffMs = target - now;
  const days = Math.ceil(diffMs / 86400000);
  const sameDay = target.getMonth() === now.getMonth() && target.getDate() === now.getDate();
  if (days <= 0 || sameDay) {
    el.innerHTML = "✦ hari ini hari spesialnya ✦";
    el.classList.add("today");
  } else {
    el.innerHTML = `<b>${days}</b> hari lagi menuju hari spesialnya`;
    el.classList.remove("today");
  }
}
updateCountdown();
setInterval(updateCountdown, 3600000);

/* =========================================================
   TOAST
   ========================================================= */
let toastTimer = null;
function showToast(msg, isErr) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.toggle("err", !!isErr);
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}


/* =========================================================
   SECRET SCRATCH-TO-REVEAL CARD
   ========================================================= */
function initScratchCard() {
  const canvas = $("#scratchCanvas");
  const card = $("#secretCard");
  if (!canvas || !card) return;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let revealed = false, started = false, lastW = 0, lastH = 0;
  const OVERSCAN = 6;
  const BRUSH = 64;
  const REVEAL_THRESHOLD = 0.38;
  let drawing = false, lastCheck = 0, lastX = null, lastY = null, activePointerId = null;

  function size() {
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = r.width + OVERSCAN * 2, h = r.height + OVERSCAN * 2;
    if (Math.round(w) === lastW && Math.round(h) === lastH) return;
    lastW = Math.round(w); lastH = Math.round(h);
    canvas.width = Math.ceil(w * dpr); canvas.height = Math.ceil(h * dpr);
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(w, h);
  }
  function paint(w, h) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#2c2417"); g.addColorStop(1, "#1a150d");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(244,234,217,.85)";
    ctx.font = "600 13px 'Jost', sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("✦ gores di sini ✦", w / 2, h / 2);
  }
  size();
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => { if (!revealed && !started) size(); });
    ro.observe(card);
  }
  window.addEventListener("resize", () => { if (!revealed && !started) size(); });
  document.fonts?.ready?.then(() => { if (!revealed && !started) size(); });

  function scratchAt(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = BRUSH; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    if (lastX !== null) { ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, y, BRUSH / 2, 0, Math.PI * 2); ctx.fill();
    lastX = x; lastY = y;
  }
  function checkRevealPercent() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    // Anti-aliased strokes often leave alpha values between 1 and 254.
    // Treat all sufficiently transparent pixels as cleared.
    const stride = 4 * 12;
    let cleared = 0, total = 0;
    for (let i = 3; i < data.length; i += stride) {
      total++;
      if (data[i] <= 40) cleared++;
    }
    return total ? cleared / total : 0;
  }
  function reveal() {
    if (revealed) return;
    revealed = true; drawing = false;
    canvas.classList.add("revealed");
    $("#secretHint").textContent = "pesan sudah kebuka ♡";
    playSfx("chime"); vibrate(20);
    // Do not rely on the partial scratch pattern after success: fade the
    // overlay completely so no stubborn pixel patch can cover the message.
    setTimeout(() => { try { ctx.clearRect(0, 0, canvas.width, canvas.height); } catch (_) {} }, 120);
  }
  function maybeReveal(force = false) {
    if (revealed) return;
    const now = Date.now();
    if (!force && now - lastCheck < 120) return;
    lastCheck = now;
    if (checkRevealPercent() >= REVEAL_THRESHOLD) reveal();
  }
  const scrollLockEl = card.closest(".screen") || card;
  let scrollLocked = false;
  function lockScroll(lock) {
    if (lock === scrollLocked) return;
    scrollLocked = lock;
    scrollLockEl.style.overflow = lock ? "hidden" : "";
  }
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }
  function onDown(e) {
    if (revealed) return;
    started = true; drawing = true; lastX = null; lastY = null;
    activePointerId = e.pointerId ?? null;
    if (e.pointerId !== undefined) { try { canvas.setPointerCapture(e.pointerId); } catch (_) {} }
    lockScroll(true);
    const p = pos(e); scratchAt(p.x, p.y);
    maybeReveal(true);
    if (e.cancelable) e.preventDefault();
  }
  function onMove(e) {
    if (!drawing || revealed) return;
    if (e.pointerId !== undefined && activePointerId !== null && e.pointerId !== activePointerId) return;
    const p = pos(e); scratchAt(p.x, p.y); maybeReveal(false);
    if (e.cancelable) e.preventDefault();
  }
  function onUp() {
    if (!drawing) return;
    drawing = false; lastX = null; lastY = null; activePointerId = null;
    lockScroll(false);
    // Final synchronous check fixes the common case where the last stroke
    // ended just before the periodic 120ms check fired.
    maybeReveal(true);
  }
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("touchstart", onDown, { passive: false });
  canvas.addEventListener("touchmove", onMove, { passive: false });
  canvas.addEventListener("touchend", onUp, { passive: false });
  canvas.addEventListener("touchcancel", onUp, { passive: false });
  window.addEventListener("pointerup", onUp);
  window.addEventListener("touchend", onUp, { passive: false });
  window.addEventListener("screenchange", (e) => {
    if (e.detail === "final" && !revealed) requestAnimationFrame(size);
  });
}

initScratchCard();

/* =========================================================
   MUSIC VISUALIZER — real audio-reactive bars
   ========================================================= */
function initVisualizer() {
  const vis = $("#visualizer");
  if (!vis) return;
  let started = false, vAnalyser = null, vData = null;
  function start() {
    if (started) return;
    started = true;
    try {
      const vCtx = getSfxCtx();
      if (vCtx.state === "suspended") vCtx.resume();
      const src = vCtx.createMediaElementSource(music);
      vAnalyser = vCtx.createAnalyser();
      vAnalyser.fftSize = 32;
      src.connect(vAnalyser);
      vAnalyser.connect(vCtx.destination);
      vData = new Uint8Array(vAnalyser.frequencyBinCount);
      loop();
    } catch (e) { /* if routing fails, bars just stay idle */ }
  }
  function loop() {
    requestAnimationFrame(loop);
    if (!vAnalyser) return;
    vAnalyser.getByteFrequencyData(vData);
    const bars = vis.querySelectorAll("i");
    bars.forEach((b, i) => {
      const v = vData[i * 2] || 0;
      b.style.height = (3 + (v / 255) * 15) + "px";
    });
  }
  document.addEventListener("pointerdown", start, { once: true });
  music.addEventListener("play", () => vis.classList.add("playing"));
  music.addEventListener("pause", () => vis.classList.remove("playing"));
}
initVisualizer();

/* =========================================================
   KEYBOARD + SWIPE NAVIGATION
   ========================================================= */
function primaryAction() {
  if (currentScreen === "letter") return goWish();
  if (currentScreen === "intro") return openLetter();
  if (currentScreen === "playlist") return selectedSongIndex !== null && goMinigame();
  if (currentScreen === "wish") return goMood();
  if (currentScreen === "memories") return goPolaroid();
  if (currentScreen === "polaroid") return goGift();
  if (currentScreen === "flower") return goFarewell();
  if (currentScreen === "farewell") return goFinal();
  if (currentScreen === "final") return goReaction();
  if (currentScreen === "reaction") return goReply();
}
document.addEventListener("keydown", (e) => {
  if (["ArrowRight", "Enter", " "].includes(e.key)) {
    if (["intro", "playlist", "letter", "wish", "memories", "polaroid", "flower", "farewell", "final", "reaction"].includes(currentScreen)) { e.preventDefault(); primaryAction(); }
  }
  if (e.key === "Escape" && currentScreen === "letter") showScreen("intro");
});
let touchStartX = null, touchStartY = null, touchStartedOnInteractive = false;
document.addEventListener("touchstart", (e) => {
  const target = e.target;
  touchStartedOnInteractive = !!target.closest("#scratchCanvas, .polaroid-stack, textarea, input, button, a, .playlist-list, .memory-card, .progress-nav");
  if (touchStartedOnInteractive) { touchStartX = null; return; }
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });
document.addEventListener("touchend", (e) => {
  if (touchStartX === null || touchStartedOnInteractive) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  touchStartX = null;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.35) {
    if (dx < 0) navigateRelative(1);
    else navigateRelative(-1);
  }
}, { passive: true });

/* =========================================================
   CONFETTI
   ========================================================= */
function confetti() {
  const layer = $("#confetti");
  const colors = ["#c9a15a", "#eecd8e", "#e2699b", "#f7ece7", "#7c4098", "#f5e6c0"];
  for (let i = 0; i < 150; i++) {
    const e = document.createElement("i"); e.className = "confetti";
    e.style.left = Math.random() * 100 + "vw";
    e.style.setProperty("--x", (Math.random() * 320 - 160) + "px");
    e.style.animationDelay = (Math.random() * .7) + "s";
    e.style.animationDuration = (2.3 + Math.random() * 2) + "s";
    e.style.background = colors[Math.floor(Math.random() * colors.length)];
    e.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(e); setTimeout(() => e.remove(), 5200);
  }
}
function burstMiniConfetti(anchor, colors) {
  const r = anchor.getBoundingClientRect();
  const layer = $("#confetti");
  const palette = colors || ["#c9a15a", "#eecd8e", "#e0899f", "#f7ece7", "#9c3f68", "#f5e6c0"];
  for (let i = 0; i < 26; i++) {
    const e = document.createElement("i"); e.className = "confetti";
    e.style.left = (r.left + r.width / 2) + "px";
    e.style.top = r.top + "px";
    e.style.setProperty("--x", (Math.random() * 220 - 110) + "px");
    e.style.animationDuration = (1.4 + Math.random() * 1.2) + "s";
    e.style.background = palette[Math.floor(Math.random() * palette.length)];
    layer.appendChild(e); setTimeout(() => e.remove(), 2800);
  }
}
/* ---------- variasi burst berupa emoji melayang, dipakai reaksi emoji ---------- */
function burstEmojiParticles(anchor, emojis, count = 18) {
  const r = anchor.getBoundingClientRect();
  const layer = $("#confetti");
  for (let i = 0; i < count; i++) {
    const e = document.createElement("i");
    e.className = "confetti confetti-emoji";
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.left = (r.left + r.width / 2) + "px";
    e.style.top = r.top + "px";
    e.style.setProperty("--x", (Math.random() * 220 - 110) + "px");
    e.style.animationDuration = (1.5 + Math.random() * 1.3) + "s";
    layer.appendChild(e); setTimeout(() => e.remove(), 3000);
  }
}

/* =========================================================
   SPIRIT GENERATOR — draw a random encouragement card
   ========================================================= */
const SPIRIT_QUOTES = [
  "Kamu udah jalan sejauh ini, itu bukan hal kecil.",
  "Nggak apa-apa kalau hari ini belum terasa sempurna.",
  "Satu langkah kecil hari ini, tetap langkah maju.",
  "Kamu boleh capek, tapi jangan berhenti percaya sama dirimu.",
  "Semesta lagi nyusun sesuatu yang baik buat kamu, pelan-pelan.",
  "Kamu lebih kuat dari yang kamu kira selama ini.",
  "Istirahat itu bukan mundur, itu bagian dari proses.",
  "Kamu berharga bukan karena produktif, tapi karena kamu ada.",
  "Jangan lupa kasih dirimu sendiri pelukan hari ini.",
  "Kesalahan hari ini bukan akhir dari cerita kamu.",
  "Kamu udah cukup, bahkan di hari yang berantakan sekalipun.",
  "Terus melangkah, hasil baik memang butuh waktu.",
  "Ada alasan buat kamu tersenyum hari ini, cari dan rayakan itu.",
  "Percaya deh, kamu sedang menuju versi terbaikmu.",
  "Kamu nggak harus baik-baik aja tiap hari untuk tetap berharga."
];
let spiritIdx = -1;
let flockState = "idle"; // idle -> thrown -> opened
const FLOCK_PAPER_COUNT = 10;

function drawSpirit() {
  let i;
  do { i = Math.floor(Math.random() * SPIRIT_QUOTES.length); } while (i === spiritIdx && SPIRIT_QUOTES.length > 1);
  spiritIdx = i;
  $("#spiritText").textContent = SPIRIT_QUOTES[i];
}

// bikin kertas-kertas kecil dan kasih arah terbang acak (sudut + jarak),
// dipanggil ulang tiap kali dilempar biar pola sebarannya selalu beda.
function buildFlockPapers() {
  const wrap = $("#flockPapers");
  wrap.innerHTML = "";
  for (let n = 0; n < FLOCK_PAPER_COUNT; n++) {
    const p = document.createElement("span");
    p.className = "flock-paper";
    const angle = (360 / FLOCK_PAPER_COUNT) * n + (Math.random() * 26 - 13);
    const dist = 78 + Math.random() * 46;
    const rad = (angle * Math.PI) / 180;
    const fx = Math.cos(rad) * dist;
    const fy = Math.sin(rad) * dist;
    const fr = Math.round(Math.random() * 300 - 150);
    p.style.setProperty("--fx", fx.toFixed(1) + "px");
    p.style.setProperty("--fy", fy.toFixed(1) + "px");
    p.style.setProperty("--fr", fr + "deg");
    p.style.transitionDelay = (Math.random() * 0.12).toFixed(2) + "s";
    wrap.appendChild(p);
  }
}

$("#flockBtn").onclick = () => {
  if (flockState !== "idle") return;
  playSfx("tap");
  buildFlockPapers();
  $("#flockStage").classList.add("thrown");
  flockState = "thrown";
  $("#spiritHint").textContent = "lagi beterbangan...";
  setTimeout(() => {
    drawSpirit();
    $("#flockStage").classList.add("opened");
    flockState = "opened";
    playSfx("chime");
    $("#spiritHint").textContent = "semoga kebaca pas kamu lagi butuh ✦";
    $("#spiritAgainBtn").style.display = "inline-flex";
  }, 650);
};
$("#spiritAgainBtn").onclick = () => {
  playSfx("tap");
  $("#flockStage").classList.remove("opened", "thrown");
  flockState = "idle";
  $("#spiritHint").textContent = "tekan tombolnya, biar kertas-kertasnya terbang ✦";
};
$("#spiritNextBtn").onclick = () => { playSfx("tap"); goMemories(); };
function resetSpirit() {
  $("#flockStage").classList.remove("opened", "thrown");
  $("#flockPapers").innerHTML = "";
  flockState = "idle";
  $("#spiritText").textContent = "";
  $("#spiritAgainBtn").style.display = "none";
  $("#spiritHint").textContent = "tekan tombolnya, biar kertas-kertasnya terbang ✦";
}

/* =========================================================
   MINI GAME — memory match using the uploaded photos
   ========================================================= */
const MEMORY_PHOTOS = ["img/polaroid-1.jpg", "img/polaroid-2.jpg", "img/polaroid-3.jpg", "img/polaroid-4.jpg"];
let memoryFirst = null, memoryLock = false, memoryMatches = 0;
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function buildMemoryGrid() {
  const grid = $("#memoryGrid");
  if (!grid) return;
  grid.innerHTML = "";
  memoryFirst = null; memoryLock = false; memoryMatches = 0;
  $("#minigameStatus").textContent = "0 / 4 pasang ditemukan";
  $("#minigameNextBtn").disabled = true;
  const deck = shuffle([...MEMORY_PHOTOS, ...MEMORY_PHOTOS]);
  deck.forEach((src) => {
    const el = document.createElement("div");
    el.className = "memory-card";
    el.dataset.src = src;
    el.innerHTML = `<div class="memory-card-inner">
      <div class="memory-face back">✦</div>
      <div class="memory-face front"><img src="${src}" alt="" loading="lazy"></div>
    </div>`;
    el.addEventListener("click", () => onMemoryCardClick(el));
    grid.appendChild(el);
  });
}
function onMemoryCardClick(el) {
  if (memoryLock || el.classList.contains("flipped") || el.classList.contains("matched")) return;
  el.classList.add("flipped");
  playSfx("tap");
  if (!memoryFirst) { memoryFirst = el; return; }
  memoryLock = true;
  const a = memoryFirst, b = el;
  memoryFirst = null;
  if (a.dataset.src === b.dataset.src) {
    setTimeout(() => {
      a.classList.add("matched"); b.classList.add("matched");
      memoryMatches++;
      $("#minigameStatus").textContent = memoryMatches + " / 4 pasang ditemukan";
      playSfx("chime");
      memoryLock = false;
      if (memoryMatches === 4) {
        $("#minigameStatus").textContent = "semua pasangan ketemu ✦";
        $("#minigameNextBtn").disabled = false;
        burstMiniConfetti($("#minigameNextBtn"));
      }
    }, 380);
  } else {
    setTimeout(() => {
      a.classList.remove("flipped"); b.classList.remove("flipped");
      memoryLock = false;
    }, 750);
  }
}
$("#minigameNextBtn").onclick = () => { playSfx("tap"); goIntro(); };

/* =========================================================
   SCREEN FLOW
   ========================================================= */
function openLetter() { startMusic(); showScreen("letter"); typeWriter(CONFIG.letter); }
function goWish() { showScreen("wish"); }
function goMood() { showScreen("mood"); }
function goMemories() { showScreen("memories"); }
function goPolaroid() { showScreen("polaroid"); }
function goSpirit() { showScreen("spirit"); resetSpirit(); }
function goMinigame() { showScreen("minigame"); buildMemoryGrid(); }
function goGift() {
  showScreen("gift");
  $("#giftTitle").innerHTML = "Ada <em>hadiah kecil</em> buat kamu.";
  $("#giftQuestion").innerHTML = "Tapi sebelum itu...<br><strong>kamu mau menerimanya?</strong>";
  $("#choiceHint").textContent = "sentuh hadiahnya dulu ✦";
}
function goFarewell() {
  showScreen("farewell");
  typeWriter(CONFIG.farewellLetter, 28, "#farewellType");
}
function goFinal() {
  showScreen("final");
  document.body.classList.add("celebrating");
  confetti();
  vibrate([15, 50, 15, 50, 15, 50, 60]);
}
function goReaction() { showScreen("reaction"); }
function goReply() { showScreen("reply"); }

$("#sealBtn").onclick = () => {
  const seal = $("#sealBtn");
  if (seal.classList.contains("cracked")) return;
  seal.classList.add("cracked");
  playSfx("pop");
  vibrate(18);
  setTimeout(openLetter, 380);
};
$("#openBtn").onclick = () => { playSfx("pop"); openLetter(); };
$("#pinSubmitBtn")?.addEventListener("click", () => {
  const input = $("#pinInput");
  const val = (input?.value || "").trim();
  if (!val) { input?.focus(); return; }
  if (val === CONFIG.pin) {
    isTargetUser = true;
    playSfx("chime");
    vibrate(16);
    showScreen("playlist");
  } else {
    playSfx("tap");
    $("#pinError").textContent = "PIN salah, coba lagi ✦";
    input.value = "";
    input.focus();
  }
});
$("#pinInput")?.addEventListener("input", () => { $("#pinError").textContent = ""; });
$("#pinInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") $("#pinSubmitBtn")?.click(); });

/* =========================================================
   PIN REQUEST COUNTDOWN — hitung mundur ke 1 September
   =========================================================
   Selama tanggal sekarang < 1 September (tahun berjalan), countdown
   menghitung ke 1 September tahun itu. Begitu 1 September sudah lewat,
   target otomatis loncat ke 1 September TAHUN BERIKUTNYA — jadi
   countdown "reset" sendiri setiap tahun tanpa perlu ubah kode apa pun. */
function nextPinRequestDate() {
  const now = new Date();
  const year = now.getFullYear();
  const target = new Date(`${year}-09-01T00:00:00+07:00`);
  return now >= target ? new Date(`${year + 1}-09-01T00:00:00+07:00`) : target;
}
function updatePinRequestCountdown() {
  const el = $("#pinCountdown");
  if (!el) return;
  const now = new Date();
  const target = nextPinRequestDate();
  const diffMs = target - now;
  if (diffMs <= 0) {
    el.innerHTML = "✦ sekarang udah bisa minta PIN-nya ✦";
    el.classList.add("today");
    return;
  }
  el.classList.remove("today");
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  if (days > 0) el.innerHTML = `<b>${days}</b> hari <b>${hours}</b> jam lagi`;
  else if (hours > 0) el.innerHTML = `<b>${hours}</b> jam <b>${minutes}</b> menit lagi`;
  else el.innerHTML = `<b>${Math.max(minutes, 1)}</b> menit lagi`;
}
updatePinRequestCountdown();
setInterval(updatePinRequestCountdown, 60000);
$("#playlistNextBtn").onclick = () => { if (selectedSongIndex === null) return; playSfx("tap"); goMinigame(); };
$("#nextBtn").onclick = () => { playSfx("tap"); goWish(); };
$("#giftBtn").onclick = () => { playSfx("tap"); goMood(); };
$("#moodNextBtn").onclick = () => { playSfx("tap"); goSpirit(); };
$("#memoriesNextBtn").onclick = () => { playSfx("tap"); goPolaroid(); };
$("#polaroidNextBtn").onclick = () => { playSfx("tap"); goGift(); };

/* ---------- mood check-in responses ---------- */
const MOOD_RESPONSES = {
  good: "Seneng deh dengernya. Semoga harimu tetep secerah ini ya ✦",
  tired: "Wajar kok capek. Istirahat dulu, nggak semua harus diselesaiin hari ini.",
  heavy: "Aku nggak tau semua yang kamu rasain, tapi aku di sini kalau kamu butuh cerita.",
  neutral: "Nggak apa-apa juga biasa aja. Nggak semua hari harus spesial."
};
$("#moodGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".mood-btn");
  if (!btn) return;
  playSfx("tap");
  document.querySelectorAll(".mood-btn").forEach((b) => b.classList.remove("picked"));
  btn.classList.add("picked");
  const res = $("#moodResponse");
  res.textContent = MOOD_RESPONSES[btn.dataset.mood] || "";
  res.classList.add("show");
  $("#moodNextBtn").disabled = false;
});
$("#closeBtn").onclick = () => { $("#sealBtn").classList.remove("cracked"); showScreen("intro"); };
$("#againBtn").onclick = () => {
  document.body.classList.remove("celebrating");
  $("#sealBtn").classList.remove("cracked");
  reactionPicked = false;
  document.querySelectorAll(".reaction-btn").forEach((b) => { b.classList.remove("picked"); b.disabled = false; b.setAttribute("aria-pressed", "false"); });
  $("#reactionThanks").textContent = "";
  $("#replyInput").value = "";
  $("#replyStatus").textContent = "balasanmu tidak terkirim ke mana pun sebelum tujuan pengiriman diatur ✦";
  showScreen("playlist");
};
$("#musicBtn").onclick = () => {
  if (music.paused) { startMusic(); $("#musicBtn").textContent = "♫"; }
  else { music.pause(); $("#musicBtn").textContent = "Ⅱ"; }
};

let giftOpened = false;
$("#giftObject").addEventListener("click", () => {
  const b = $("#giftObject");
  if (!giftOpened) {
    giftOpened = true;
    playSfx("whoosh");
    vibrate([12, 40, 12, 40, 20]);
    b.classList.add("shaking");
    setTimeout(() => {
      b.classList.remove("shaking");
      b.animate(
        [{ transform: "scale(1)" }, { transform: "scale(.9) rotate(-4deg)" }, { transform: "scale(1.06) rotate(3deg)" }, { transform: "scale(1)" }],
        { duration: 550, easing: "cubic-bezier(.22,1,.36,1)" }
      );
      playSfx("pop");
      vibrate(20);
      burstMiniConfetti(b);
      $("#giftTitle").innerHTML = "Nah... <em>ini buat kamu.</em>";
      $("#giftQuestion").innerHTML = "Sekarang pilih dengan jujur.<br><strong>mau atau nggak?</strong>";
      $("#choiceHint").textContent = "aku lihat pilihanmu 👀";
    }, 430);
  } else {
    b.animate([{ transform: "scale(1)" }, { transform: "scale(.95)" }, { transform: "scale(1)" }], { duration: 250 });
  }
});

$("#yesBtn").onclick = () => { playSfx("chime"); goCandle(); };
$("#noBtn").onclick = () => {
  playSfx("tap");
  noTries--;
  showScreen("nope");
  $("#noCount").textContent = "kesempatan: " + Math.max(noTries, 0);
  if (noTries === 0) {
    $("#nopeTitle").innerHTML = "Masih <em>ga mau?</em>";
    $("#nopeText").innerHTML = "Oke... aku kasih satu pilihan terakhir.<br>Tapi jangan nyesel ya 😛";
  }
};
$("#retryBtn").onclick = () => { giftOpened = false; goGift(); };
$("#reallyNoBtn").onclick = () => {
  const btn = $("#reallyNoBtn");
  $("#nopeTitle").innerHTML = "Yakin banget? <em>😳</em>";
  $("#nopeText").innerHTML = "Aku tunggu 2 detik...<br><strong>...</strong>";
  btn.textContent = "oke, aku berubah pikiran";
  btn.onclick = () => { giftOpened = false; goGift(); };
};

function nudgeWishNote() {
  const note = $("#wishNote");
  if (!note) return;
  $("#wishNoteStatus").textContent = "tulis dulu permintaanmu, baru bisa niup lilinnya ✦";
  note.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
    { duration: 300 }
  );
  $("#wishNoteInput").focus();
}
$("#tapFlameBtn").onclick = () => { if (!wishSealed) { nudgeWishNote(); return; } playSfx("whoosh"); finishCelebration(); };
$("#flameTarget").addEventListener("click", () => { if (!wishSealed) { nudgeWishNote(); return; } playSfx("whoosh"); finishCelebration(); });
$("#flameTarget").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (!wishSealed) { nudgeWishNote(); return; }
    playSfx("whoosh"); finishCelebration();
  }
});
$("#flowerNextBtn").onclick = () => { playSfx("tap"); goFarewell(); };
$("#farewellNextBtn").onclick = () => { playSfx("tap"); goFinal(); };
$("#reactionNextBtn").onclick = () => { playSfx("tap"); goReaction(); };
$("#replyNextBtn").onclick = () => { playSfx("tap"); goReply(); };

/* ---------- reaction slide: kirim reaksi emoji terpilih via Formspree ---------- */
const REACTION_LABELS = {
  love: "terharu",
  happy: "seneng",
  excited: "excited",
  touched: "sampai nangis",
  shy: "malu-malu"
};
// Tiap reaksi punya "rasa" burst visualnya sendiri, biar momen milih
// emoji-nya kerasa dirayakan, bukan cuma nge-submit data diam-diam.
const REACTION_EFFECTS = {
  love: { colors: ["#f0b98c", "#ffd9e6", "#ffe3b8"], emojis: ["🥹", "✦", "♡"] },
  happy: { colors: ["#ffb8d1", "#ef8fae", "#ffd9e6"], emojis: ["❤️", "♡", "✦"] },
  excited: { full: true, colors: ["#ffb8d1", "#ffd9e6", "#f0dcab", "#c9a463", "#faeef2"] },
  touched: { colors: ["#a9c9e6", "#cfe0f0", "#e3c9f7"], emojis: ["💧", "🤍", "✦"] },
  shy: { colors: ["#c9a4e0", "#e3c9f7", "#ffd9e6"], emojis: ["🙈", "✦", "♡"] }
};
function playReactionEffect(anchor, key) {
  const fx = REACTION_EFFECTS[key];
  if (!fx) { burstMiniConfetti(anchor); return; }
  if (fx.full) { confetti(); return; }
  burstMiniConfetti(anchor, fx.colors);
  if (fx.emojis) burstEmojiParticles(anchor, fx.emojis, 14);
}
async function sendReaction(key) {
  if (!CONFIG.wishFormEndpoint) return; // belum dikonfigurasi — lewati diam-diam
  try {
    const response = await fetch(CONFIG.wishFormEndpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        pengirim: CONFIG.name,
        reaksi: REACTION_LABELS[key] || key,
        waktu: new Date().toLocaleString("id-ID")
      })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (e) { /* offline/gagal — pilihan tetap tampil secara lokal */ }
}
let reactionPicked = false;
$("#reactionGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".reaction-btn");
  if (!btn || reactionPicked) return;
  reactionPicked = true;
  playSfx("chime");
  vibrate(16);
  document.querySelectorAll(".reaction-btn").forEach((b) => {
    b.classList.toggle("picked", b === btn);
    b.setAttribute("aria-pressed", b === btn ? "true" : "false");
    if (b !== btn) b.disabled = true;
  });
  playReactionEffect(btn, btn.dataset.reaction);
  lastPickedReaction = btn.dataset.reaction;
  $("#reactionThanks").textContent = "makasih udah kasih tau ✦";
  sendReaction(btn.dataset.reaction);
});

/* ---------- reply letter: kirim balasan teks via Formspree (privat, cuma buat pengirim),
   dengan fallback WhatsApp/email kalau endpoint belum diatur atau lagi offline ---------- */
let lastPickedReaction = null;
async function sendReplyLetter(text) {
  if (!CONFIG.wishFormEndpoint) return false;
  try {
    const response = await fetch(CONFIG.wishFormEndpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        pengirim: CONFIG.name,
        balasan: text,
        waktu: new Date().toLocaleString("id-ID")
      })
    });
    if (!response.ok) return false;
    return true;
  } catch (e) { return false; }
}
$("#sendReplyBtn").onclick = async () => {
  const input = $("#replyInput");
  const text = input.value.trim();
  const status = $("#replyStatus");
  if (!text) { status.textContent = "tulis dulu sesuatu, baru bisa dikirim ✦"; input.focus(); return; }
  playSfx("tap");
  status.textContent = "mengirim...";
  const ok = await sendReplyLetter(text);
  if (ok) {
    status.textContent = "balasanmu udah nyampe ke aku ♡";
  } else if (CONFIG.replyWhatsapp) {
    const msg = encodeURIComponent(`Balasan dari ${CONFIG.name}:\n\n${text}`);
    window.open(`https://wa.me/${CONFIG.replyWhatsapp}?text=${msg}`, "_blank");
    status.textContent = "kebuka di WhatsApp — tinggal tap kirim ya ✦";
  } else if (CONFIG.replyEmail) {
    const subject = encodeURIComponent(`Balasan ulang tahun dari ${CONFIG.name}`);
    const body = encodeURIComponent(text);
    window.location.href = `mailto:${CONFIG.replyEmail}?subject=${subject}&body=${body}`;
    status.textContent = "kebuka di aplikasi email — tinggal tap kirim ya ✦";
  } else {
    try { localStorage.setItem("hbd_saved_reply", text); } catch (e) { /* storage penuh/diblokir — nggak masalah */ }
    status.textContent = "tersimpan di HP kamu — belum ada tujuan pengiriman diatur di situs ini ✦";
  }
  playSfx("chime");
  vibrate(16);
};
$("#replyToShareBtn").onclick = () => {
  playSfx("chime");
  vibrate(16);
  $("#replyToShareBtn").disabled = true;
  $("#replyToShareBtn").querySelector("span").textContent = "sampai jumpa ✦";
  showToast("makasih udah baca sampai sini ♡");
};


/* =========================================================
   CANDLE — microphone "blow to extinguish" with tap fallback
   ========================================================= */
let celebrationDone = false;
let wishSealed = false;
// Sekali true (lilin sudah pernah ditiup), tetap true seterusnya — dot
// navigasi jadi bebas dipakai ke halaman mana pun, maju atau mundur.
let hasBlownCandle = false;
let micStream = null, audioCtx = null, analyser = null, blowLoop = null, micLastRms = 0;

/* ---------- sealed wish note: must be written before the candle unlocks ---------- */
async function sendWishNote(text) {
  if (!CONFIG.wishFormEndpoint) return; // not configured — skip silently
  try {
    const response = await fetch(CONFIG.wishFormEndpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        pengirim: CONFIG.name,
        harapan: text,
        waktu: new Date().toLocaleString("id-ID")
      })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (e) { /* offline/gagal — harapan tetap tersegel secara lokal */ }
}
function unlockCandle() {
  $("#cakeScene").classList.remove("locked");
  $("#candle .candle-actions").classList.remove("locked");
  $("#blowBtn").disabled = false;
  $("#tapFlameBtn").disabled = false;
  $("#micStatus").textContent = "izin mikrofon opsional · tap api selalu bisa";
}
function sealWishNote() {
  if (wishSealed) return;
  const input = $("#wishNoteInput");
  const text = input.value.trim();
  if (!text) { nudgeWishNote(); return; }
  wishSealed = true;
  input.disabled = true;
  $("#sealWishBtn").disabled = true;
  $("#sealWishBtn").textContent = "tersegel ✦";
  $("#wishNote").classList.add("sealed");
  $("#wishNoteStatus").textContent = "permintaanmu sudah tersegel ♡ sekarang tiup lilinnya";
  playSfx("chime");
  vibrate(16);
  sendWishNote(text);
  unlockCandle();
}
$("#sealWishBtn").onclick = sealWishNote;

async function startMic() {
  if (celebrationDone || !wishSealed) return;
  const status = $("#micStatus");
  const blowBtn = $("#blowBtn");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    status.textContent = "Browser tidak mengizinkan mikrofon · tap api saja ✦";
    return;
  }

  blowBtn.disabled = true;
  status.textContent = "menyiapkan mikrofon...";

  // Create + resume the AudioContext synchronously, still inside this click
  // gesture, BEFORE the async getUserMedia permission prompt. On several
  // mobile browsers (iOS Safari especially) the "user gesture" flag needed
  // to unlock audio is lost once an await happens — so a context created
  // only after getUserMedia resolves can stay suspended forever and the
  // mic never registers anything. Doing it first avoids that.
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") await audioCtx.resume();
  } catch (e) { /* retried again below once the stream is ready */ }

  try {
    status.textContent = "meminta izin mikrofon... 🎙️";
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false, channelCount: 1 }
    });
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") await audioCtx.resume();

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = .2;
    const source = audioCtx.createMediaStreamSource(micStream);
    source.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);
    let strong = 0;
    const startedAt = performance.now();
    status.textContent = "Sudah siap. Tiup ke mikrofon sekarang... 💨";

    blowLoop = setInterval(() => {
      if (!analyser || celebrationDone) return;
      analyser.getByteTimeDomainData(data);
      let sum = 0, peak = 0;
      for (const v of data) {
        const n = Math.abs((v - 128) / 128);
        sum += n * n;
        if (n > peak) peak = n;
      }
      const rms = Math.sqrt(sum / data.length);
      const spike = Math.max(0, rms - micLastRms);
      micLastRms = rms;
      const elapsed = performance.now() - startedAt;

      // Live level feedback so the person can see the mic is actually
      // listening, instead of staring at a static "sudah siap" message.
      if (elapsed > 350) {
        const level = Math.max(1, Math.min(5, Math.round(rms * 45)));
        status.textContent = "mendengarkan " + "●".repeat(level) + "○".repeat(5 - level) + " · tiup lebih kuat 💨";
      }

      // Blow = sustained air noise, not just one tap/click. Thresholds kept
      // fairly forgiving so quieter phone mics still register a real blow.
      if (rms > .055 && (peak > .22 || spike > .018)) strong++;
      else strong = Math.max(0, strong - 1);

      if (elapsed > 300 && strong >= 3) {
        playSfx("whoosh");
        finishCelebration();
      }
    }, 45);
  } catch (e) {
    stopMic();
    blowBtn.disabled = false;
    status.textContent = "Izin mikrofon tidak tersedia · tap api saja ✦";
  }
}
function stopMic() {
  if (blowLoop) { clearInterval(blowLoop); blowLoop = null; }
  if (micStream) { micStream.getTracks().forEach((t) => t.stop()); micStream = null; }
  if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; }
  analyser = null;
  micLastRms = 0;
  const blowBtn = $("#blowBtn");
  if (blowBtn) blowBtn.disabled = false;
}

// Reset candle state every time the candle screen opens.
function goCandle() {
  showScreen("candle");
  stopMic();

  // Setelah lilin pernah dipadamkan, halaman ini tetap terbuka sebagai
  // halaman yang sudah selesai; jangan mengunci ulang hanya karena user
  // kembali memakai navigasi.
  if (hasBlownCandle) {
    celebrationDone = true;
    wishSealed = true;
    $("#cakeScene").classList.remove("locked");
    $("#cakeScene").classList.add("blown");
    $("#candle .candle-actions").classList.add("locked");
    $("#blowBtn").disabled = true;
    $("#tapFlameBtn").disabled = true;
    $("#wishNoteInput").disabled = true;
    $("#sealWishBtn").disabled = true;
    $("#wishNote").classList.add("sealed");
    $("#wishNoteStatus").textContent = "harapan sudah tersegel ♡";
    $("#micStatus").textContent = "Lilin sudah padam ✦ wish made";
    return;
  }

  celebrationDone = false;
  wishSealed = false;
  $("#cakeScene").classList.add("locked");
  $("#cakeScene").classList.remove("blown");
  $("#candle .candle-actions").classList.add("locked");
  $("#blowBtn").disabled = true;
  $("#tapFlameBtn").disabled = true;
  $("#wishNoteInput").disabled = false;
  $("#wishNoteInput").value = "";
  $("#sealWishBtn").disabled = false;
  $("#sealWishBtn").textContent = "segel harapan 🔒";
  $("#wishNote").classList.remove("sealed");
  $("#wishNoteStatus").textContent = "tulis dulu, baru bisa niup lilinnya";
  $("#micStatus").textContent = "izin mikrofon opsional · tap api selalu bisa";
}
function finishCelebration() {
  if (celebrationDone) return;
  celebrationDone = true;
  hasBlownCandle = true;
  $("#progressNav")?.classList.add("nav-unlocked");
  updateProgressArrows(SCREEN_ORDER.indexOf(currentScreen));
  stopMic();
  $("#cakeScene").classList.add("blown");
  $("#micStatus").textContent = "Lilin padam ✦ wish made";
  vibrate([10, 30, 10, 30, 30]);
  setTimeout(() => { showScreen("flower"); playSfx("chime"); }, 850);
}
$("#blowBtn").onclick = startMic;

/* ---------- LOVE SLIDER NAVIGATION ----------
   Satu hati menggantikan panah + dot. Bisa digeser kiri/kanan.
   Sebelum lilin ditiup, slider hanya boleh kembali ke halaman yang sudah dilewati.
   Setelah lilin ditiup, seluruh cerita bebas dijelajahi. */
const STEP_GOTO = {
  pin: () => showScreen("pin"),
  playlist: () => showScreen("playlist"),
  minigame: goMinigame,
  intro: goIntro,
  letter: openLetter,
  wish: goWish,
  mood: goMood,
  spirit: goSpirit,
  memories: goMemories,
  polaroid: goPolaroid,
  gift: goGift,
  candle: goCandle,
  flower: () => showScreen("flower"),
  farewell: goFarewell,
  final: goFinal,
  reaction: goReaction,
  reply: goReply
};

function navigateToIndex(idx, fromSlider = false) {
  idx = Math.max(0, Math.min(SCREEN_ORDER.length - 1, Number(idx)));
  const currentIdx = SCREEN_ORDER.indexOf(currentScreen);
  const maxReach = hasBlownCandle ? SCREEN_ORDER.length - 1 : maxReachedIndex;
  if (idx > maxReach) {
    const slider = $("#progressSlider");
    if (slider) slider.value = String(maxReach);
    updateProgress(currentScreen);
    if (fromSlider) playSfx("tap");
    return;
  }
  const step = SCREEN_ORDER[idx];
  if (step === currentScreen) return;
  const fn = STEP_GOTO[step];
  playSfx("tap");
  if (fn) fn(); else showScreen(step);
}

const progressSlider = $("#progressSlider");

function navigateRelative(delta) {
  const currentIdx = SCREEN_ORDER.indexOf(currentScreen);
  if (currentIdx < 0) return;
  const maxReach = hasBlownCandle ? SCREEN_ORDER.length - 1 : maxReachedIndex;
  const targetIdx = Math.max(0, Math.min(maxReach, currentIdx + delta));
  if (targetIdx === currentIdx) return;
  navigateToIndex(targetIdx, true);
}

if (progressSlider) {
  progressSlider.addEventListener("input", (e) => {
    const idx = Number(e.target.value);
    const maxReach = hasBlownCandle ? SCREEN_ORDER.length - 1 : maxReachedIndex;
    const safeIdx = Math.max(0, Math.min(maxReach, idx));
    e.target.value = String(safeIdx);

    const pct = SCREEN_ORDER.length <= 1 ? 0 : (safeIdx / (SCREEN_ORDER.length - 1)) * 100;
    $("#sliderFill")?.style.setProperty("width", pct + "%");
    $("#sliderHeart")?.style.setProperty("--slider-progress", pct + "%");

    const pretty = getPrettyScreenName(SCREEN_ORDER[safeIdx]);
    $("#progressLabel") && ($("#progressLabel").textContent = pretty);
    $("#progressCounter") && ($("#progressCounter").textContent =
      `${String(safeIdx + 1).padStart(2, "0")} / ${String(SCREEN_ORDER.length).padStart(2, "0")}`);
    $("#sliderHeart")?.setAttribute("data-label", pretty);
  });

  progressSlider.addEventListener("change", (e) => navigateToIndex(e.target.value, true));
  progressSlider.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) e.stopPropagation();
  });
}

/* =========================================================
   SECTION DECOR — partikel ambience di tiap section/slide
   Biar tiap "halaman" (section .screen) nggak polos/flat, tiap
   section otomatis dikasih beberapa item kecil (✦/✧/♡/✿/titik)
   yang melayang pelan di belakang kartu. Jalan otomatis buat
   SEMUA .screen yang ada — nggak perlu tambah markup manual di
   tiap section satu-satu. Murni visual, ringan (CSS animation),
   dan otomatis di-pause untuk slide yang lagi nggak aktif (lihat
   ".screen:not(.active) .section-decor .deco-item" di style.css).
   ========================================================= */
function initSectionDecor() {
  const GLYPHS = ["✦", "✧", "♡", "✿"];
  const COLORS = ["var(--gold)", "var(--gold-bright)", "var(--rose)", "var(--peach)"];
  const rand = (min, max) => min + Math.random() * (max - min);

  document.querySelectorAll(".screen").forEach((screen) => {
    if (screen.querySelector(".section-decor")) return; // sudah ada, jangan dobel

    const wrap = document.createElement("div");
    wrap.className = "section-decor";
    wrap.setAttribute("aria-hidden", "true");

    const count = 6 + Math.floor(Math.random() * 3); // 6–8 partikel per section
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      const isDot = Math.random() < 0.35;
      el.className = "deco-item" + (isDot ? " dot" : "");
      if (!isDot) el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

      const size = isDot ? rand(3, 7) : rand(10, 24);
      el.style.setProperty("--dx", rand(6, 92).toFixed(1) + "%");
      el.style.setProperty("--dy", rand(6, 92).toFixed(1) + "%");
      el.style.setProperty("--dsize", size.toFixed(1) + "px");
      el.style.setProperty("--dcolor", COLORS[Math.floor(Math.random() * COLORS.length)]);
      el.style.setProperty("--ddur", rand(5, 11).toFixed(2) + "s");
      el.style.setProperty("--ddelay", (-rand(0, 8)).toFixed(2) + "s"); // mulai di posisi acak dalam siklus
      el.style.setProperty("--dxm", rand(-16, 16).toFixed(0) + "px");
      el.style.setProperty("--dym", (-rand(18, 42)).toFixed(0) + "px");
      el.style.setProperty("--drot", rand(-12, 12).toFixed(0) + "deg");
      el.style.setProperty("--dop", rand(0.28, 0.62).toFixed(2));

      wrap.appendChild(el);
    }

    // masukin di paling depan section, di belakang scene-aura/orb/card
    screen.insertBefore(wrap, screen.firstChild);
  });
}
initSectionDecor();

$("#progressPrev")?.addEventListener("click", () => {
  playSfx("tap");
  navigateRelative(-1);
});
$("#progressNext")?.addEventListener("click", () => {
  playSfx("tap");
  navigateRelative(1);
});

/* ---------- unlock music on first tap anywhere (only if a song is already loaded) ---------- */
document.addEventListener("pointerdown", () => { if (music.getAttribute("src")) startMusic(); }, { once: true });

updateProgress("pin");

/* =========================================================
   CACHE OFFLINE — service worker
   Bikin halaman ini kebuka lebih cepat (dan tetap kebuka meski
   sinyal jelek/offline) di kunjungan berikutnya, karena aset
   utama (html/css/js/font/musik/foto) sudah tersimpan di device.
   ========================================================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => { /* gagal daftar — situs tetap jalan normal, cuma tanpa cache offline */ });
  });
}

/* =========================================================
   MATERIAL RIPPLE — flat Material Design tap feedback
   Delegated listener, works on every button/pill added to the
   DOM now or later (playlist items, memory cards, dynamic wish
   pills, etc). Purely visual, doesn't touch any app logic.
   ========================================================= */
(function () {
  const RIPPLE_SELECTOR = ".primary-btn,.ghost-btn,.icon-btn,.round-btn,.mood-btn,.playlist-item,.reaction-btn,.wish-pill,.polaroid,.flock-btn";
  function spawnRipple(target, x, y) {
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const ripple = document.createElement("span");
    ripple.className = "md-ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (x - rect.left - size / 2) + "px";
    ripple.style.top = (y - rect.top - size / 2) + "px";
    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }
  document.addEventListener("pointerdown", (e) => {
    const target = e.target.closest(RIPPLE_SELECTOR);
    if (!target || target.disabled) return;
    spawnRipple(target, e.clientX, e.clientY);
  });
})();
