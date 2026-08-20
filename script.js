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
  // Nama ASLI orang yang lagi ulang tahun (beda dari CONFIG.name di atas,
  // yang bisa berubah-ubah lewat ?to= biar link-nya bisa dipakai siapa aja).
  // Dipakai KHUSUS oleh fitur Poster + GIF Highlight di layar "share" buat
  // membedakan tampilan: kalau ?to= di URL cocok (huruf besar/kecil
  // diabaikan) dengan nama di sini, poster dianggap dibuka oleh sang target
  // dan tampil versi lengkap. Kalau tidak cocok / kosong, poster tampil
  // versi teaser umum (buat pengunjung lain yang lihat link/story-nya).
  // Kosongkan ("") kalau nggak mau ada pembedaan sama sekali.
  posterTargetName: "Us",
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

// Optional personalization via URL, e.g. ?to=Nadia&date=2026-10-22 — makes the
// same page reusable for anyone without touching the code.
(function applyUrlParams() {
  const p = new URLSearchParams(location.search);
  const to = p.get("to");
  const date = p.get("date");
  if (to) CONFIG.name = to;
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) CONFIG.birthday = date + "T00:00:00+07:00";
})();

/* =========================================================
   TIME CAPSULE — seluruh halaman terkunci sampai CONFIG.birthday
   ========================================================= */
// UBAH KE false SAAT SUDAH SIAP DIBAGIKAN SUNGGUHAN — selama true,
// kunci ini dilewati (dilonggarkan) supaya kamu bisa lihat/uji semua
// konten kapan saja. Bisa juga dilonggarkan sementara lewat URL
// dengan menambah ?unlock=1 tanpa mengubah kode ini.
const TIME_CAPSULE_TEST_MODE = true;

/* ---------- real viewport height fix (mobile address-bar bug) ----------
   height:100% / 100vh on mobile browsers is based on the LARGEST possible
   viewport (address bar collapsed), not what's actually visible. When the
   address bar is showing, that mismatch leaves the page taller than the
   screen — causing an unwanted scrollbar, blank space below the card, and
   Android's text auto-boosting kicking in (buttons/text render oversized).
   --vh mirrors the real, currently-visible height in JS; style.css falls
   back to it, and 100dvh (where supported) overrides it with the same
   effect natively. */
function setRealViewportHeight() {
  const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  document.documentElement.style.setProperty("--vh", (h * 0.01) + "px");
}
setRealViewportHeight();
window.addEventListener("resize", setRealViewportHeight);
window.addEventListener("orientationchange", setRealViewportHeight);
if (window.visualViewport) window.visualViewport.addEventListener("resize", setRealViewportHeight);

const $ = (s) => document.querySelector(s);

/* ---------- time capsule: cek & kunci sampai waktunya ---------- */
function isTimeCapsuleUnlocked() {
  const p = new URLSearchParams(location.search);
  if (TIME_CAPSULE_TEST_MODE || p.get("unlock") === "1") return true;
  return new Date() >= new Date(CONFIG.birthday);
}
function formatCapsuleCountdown() {
  const target = new Date(CONFIG.birthday);
  const now = new Date();
  const diffMs = target - now;
  if (diffMs <= 0) return null;
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  if (days > 0) return `<b>${days}</b> hari <b>${hours}</b> jam lagi`;
  if (hours > 0) return `<b>${hours}</b> jam <b>${minutes}</b> menit lagi`;
  return `<b>${Math.max(minutes, 1)}</b> menit lagi`;
}
let capsuleTimer = null;
function initTimeCapsule() {
  const lock = $("#timeCapsuleLock");
  if (!lock) return;
  if (isTimeCapsuleUnlocked()) { lock.classList.add("unlocked"); return; }
  const label = $("#capsuleCountdown");
  const tick = () => {
    if (isTimeCapsuleUnlocked()) {
      lock.classList.add("unlocked");
      clearInterval(capsuleTimer);
      return;
    }
    if (label) label.innerHTML = formatCapsuleCountdown() || "";
  };
  tick();
  capsuleTimer = setInterval(tick, 30000);
}

/* ---------- warm the cache: preload the photos ahead of time so the
   letter & polaroid screens don't stutter waiting for them to load ---------- */
(function preloadAssets() {
  ["img/hbd1.png", "img/polaroid-1.jpg", "img/polaroid-2.jpg", "img/polaroid-3.jpg", "img/polaroid-4.jpg"].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
})();

/* ---------- tiny haptic buzz on supported devices, for the moments that matter ---------- */
function vibrate(pattern) {
  if (navigator.vibrate) { try { navigator.vibrate(pattern); } catch (e) { /* not supported / blocked — fine to skip */ } }
}


const screens = {
  intro: $("#intro"), playlist: $("#playlist"), letter: $("#letter"), wish: $("#wish"), mood: $("#mood"), spirit: $("#spirit"), memories: $("#memories"), polaroid: $("#polaroid"), minigame: $("#minigame"), gift: $("#gift"),
  nope: $("#nope"), candle: $("#candle"), flower: $("#flower-screen"), farewell: $("#farewell"), final: $("#final"), reaction: $("#reaction"), reply: $("#reply"), share: $("#share")
};
const SCREEN_ORDER = ["playlist", "minigame", "intro", "letter", "wish", "mood", "spirit", "memories", "polaroid", "gift", "candle", "flower", "farewell", "final", "reaction", "reply", "share"];
const music = $("#background-music");
let selectedSongIndex = null;

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
let currentScreen = "playlist";
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
      img.src = "hbd1.png";
    } else {
      img.closest(".photo-frame")?.style.setProperty("display", "none");
    }
  });
})();

/* ---------- screen navigation ---------- */
function updateProgress(name) {
  const idx = SCREEN_ORDER.indexOf(name);
  document.querySelectorAll("#progress i").forEach((dot) => {
    const dotIdx = SCREEN_ORDER.indexOf(dot.dataset.step);
    dot.classList.toggle("on", SCREEN_ORDER[idx] === dot.dataset.step);
    dot.classList.toggle("done", idx > -1 && dotIdx > -1 && dotIdx < idx);
  });
}
function showScreen(name) {
  const target = screens[name];
  if (!target) return;
  Object.values(screens).forEach((x) => x && x.classList.remove("active"));
  target.classList.add("active");
  currentScreen = name;
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
   SHARE — WhatsApp / Telegram / copy link
   ========================================================= */
function shareUrl() {
  const p = new URLSearchParams(location.search);
  if (!p.get("to")) p.set("to", CONFIG.name);
  return location.origin + location.pathname + "?" + p.toString();
}

/* =========================================================
   POSTER + GIF HIGHLIGHT — target ulang tahun vs pengunjung umum
   ========================================================= */
// true kalau nama di URL (?to=) cocok dengan CONFIG.posterTargetName —
// artinya yang buka ini adalah sang target ulang tahun (via link personalnya)
// ATAU kamu sendiri sebagai admin/pembuat lagi preview (asal kamu buka pakai
// link yang sama, ?to=<posterTargetName>, sebelum dikirim ke targetnya).
// Keduanya dianggap "pihak dalam" → dapat versi lengkap. Selain itu (siapa
// pun yang buka linknya tanpa ?to= yang cocok) dianggap penonton umum →
// versi teaser, TANPA slide letter & candle sama sekali (bukan cuma diblur).
function isTargetViewer() {
  const target = (CONFIG.posterTargetName || "").trim().toLowerCase();
  if (!target) return false;
  return (CONFIG.name || "").trim().toLowerCase() === target;
}

// Urutan slide yang direkam jadi highlight di GIF poster, lengkap dengan
// berapa lama tiap slide "ditahan" (ms). Slide letter & candle punya
// censorSelectors — dipakai kalau versi lengkap (target/admin): teksnya
// tetap diblur + dilabeli, TIDAK pernah ditampilkan jelas ke GIF. Untuk
// versi teaser (penonton umum), dua slide ini malah di-skip total —
// lihat buildHighlightGif() / getHighlightReelFor().
const HIGHLIGHT_REEL = [
  { id: "intro", hold: 1100 },
  { id: "letter", hold: 1300, censor: ["#typeText"], censorLabel: "isi surat dirahasiakan" },
  { id: "wish", hold: 900 },
  { id: "mood", hold: 800 },
  { id: "spirit", hold: 900 },
  { id: "memories", hold: 900 },
  { id: "polaroid", hold: 1100 },
  { id: "gift", hold: 800 },
  { id: "candle", hold: 1300, censor: ["#wishNote"], censorLabel: "permintaan dirahasiakan" },
  { id: "flower-screen", hold: 1100 },
  { id: "farewell", hold: 900 },
  { id: "final", hold: 1100 }
];
// Reel yang benar-benar dipakai, tergantung siapa yang buka: target/admin
// dapat semua slide (letter & candle tetap ada tapi diblur); penonton umum
// dapat versi lebih pendek tanpa letter & candle sama sekali.
function getHighlightReelFor(targetView) {
  return targetView ? HIGHLIGHT_REEL : HIGHLIGHT_REEL.filter((item) => !item.censor);
}
function copyText(text) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(resolve).catch(() => fallbackCopy(text, resolve, reject));
    } else {
      fallbackCopy(text, resolve, reject);
    }
  });
}
function fallbackCopy(text, resolve, reject) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0"; ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    ok ? resolve() : reject();
  } catch (e) { reject(); }
}
$("#waShareBtn").onclick = () => {
  playSfx("tap");
  const text = `Ada surat kecil untuk ${CONFIG.name} ♡ ${shareUrl()}`;
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
};
$("#tgShareBtn").onclick = () => {
  playSfx("tap");
  const url = shareUrl();
  const text = `Ada surat kecil untuk ${CONFIG.name} ♡`;
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank", "noopener");
};
$("#copyLinkBtn").onclick = () => {
  copyText(shareUrl())
    .then(() => { playSfx("chime"); showToast("link disalin ✦"); })
    .catch(() => { showToast("gagal menyalin, coba tahan & salin manual", true); });
};

/* =========================================================
   DOWNLOADABLE GREETING CARD (canvas, no external deps)
   ========================================================= */
async function downloadCard() {
  // Make sure the display webfont is actually loaded before we draw text
  // with it onto the canvas — otherwise it silently falls back to the
  // system serif and looks inconsistent with the rest of the page.
  try {
    if (document.fonts && document.fonts.load) {
      await Promise.all([
        document.fonts.load('italic 600 90px "Cormorant Garamond"'),
        document.fonts.load('600 26px "Jost"')
      ]);
    }
  } catch (e) { /* fall back to serif below if this fails */ }

  const W = 1080, H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const displayFont = document.fonts && document.fonts.check && document.fonts.check('italic 600 90px "Cormorant Garamond"')
    ? "Cormorant Garamond" : "Georgia";
  const bodyFont = document.fonts && document.fonts.check && document.fonts.check('600 26px "Jost"')
    ? "Jost" : "Georgia";

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0a0806"); bg.addColorStop(.55, "#14100a"); bg.addColorStop(1, "#1f170d");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 130; i++) {
    ctx.globalAlpha = .12 + Math.random() * .45;
    ctx.fillStyle = "#f4ead9";
    const s = Math.random() * 2 + .5;
    ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H * .7, s, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  const glow = ctx.createRadialGradient(W * .5, H * .28, 10, W * .5, H * .28, 520);
  glow.addColorStop(0, "rgba(201,164,99,.32)"); glow.addColorStop(1, "rgba(201,164,99,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.fillStyle = "#c9a463";
  ctx.font = `600 24px "${bodyFont}"`;
  ctx.fillText("SEBUAH UNDANGAN KECIL, KHUSUS UNTUK", W / 2, 190);

  ctx.fillStyle = "#f4ead9";
  ctx.font = `italic 600 88px "${displayFont}"`;
  ctx.fillText("Happy Birthday,", W / 2, 330);
  ctx.fillStyle = "#f0dcab";
  ctx.font = `italic 600 100px "${displayFont}"`;
  ctx.fillText(CONFIG.name, W / 2, 452);

  ctx.font = `44px "${displayFont}"`; ctx.fillStyle = "#cf93a1";
  ctx.fillText("♡", W / 2, 540);

  ctx.fillStyle = "#cabfae";
  ctx.font = `30px "${bodyFont}"`;
  wrapCanvasText(ctx, "Semoga semua doa baikmu menemukan jalannya.", W / 2, 650, 780, 42);

  ctx.strokeStyle = "rgba(201,164,99,.3)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W * .28, H - 210); ctx.lineTo(W * .72, H - 210); ctx.stroke();

  ctx.fillStyle = "#8a8070";
  ctx.font = `24px "${bodyFont}"`;
  ctx.fillText("for-you.card", W / 2, H - 150);

  const link = document.createElement("a");
  link.download = `happy-birthday-${(CONFIG.name || "kamu").toLowerCase().replace(/\s+/g, "-")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("kartu diunduh ✦");
}
function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "", lines = [];
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w + " "; }
    else line = test;
  }
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l.trim(), x, startY + i * lineHeight));
}
$("#downloadCardBtn").onclick = () => { playSfx("pop"); downloadCard(); };

/* =========================================================
   SECRET SCRATCH-TO-REVEAL CARD
   ========================================================= */
function initScratchCard() {
  const canvas = $("#scratchCanvas");
  const card = $("#secretCard");
  if (!canvas || !card) return;
  const ctx = canvas.getContext("2d");
  let revealed = false;
  let started = false; // true once the person starts scratching
  let lastW = 0, lastH = 0;
  // Overscan: the canvas is drawn a few CSS px larger than the card on every
  // edge (and shifted -OVERSCAN via CSS left/top) then clipped by the card's
  // overflow:hidden. This absorbs any sub-pixel rounding between
  // getBoundingClientRect() and how the browser actually paints the layout,
  // which previously could leave a thin uncovered sliver along the right
  // (or bottom) edge of the scratch overlay on some phones/DPRs.
  const OVERSCAN = 4;

  function size() {
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return; // card not laid out yet (e.g. still hidden)
    // skip no-op resizes so we don't repaint over an in-progress scratch
    if (Math.round(r.width) === lastW && Math.round(r.height) === lastH) return;
    lastW = Math.round(r.width); lastH = Math.round(r.height);
    const dpr = window.devicePixelRatio || 1;
    const w = r.width + OVERSCAN * 2, h = r.height + OVERSCAN * 2;
    // canvas.width/height = internal drawing buffer (crisp on hi-dpi screens);
    // canvas.style.width/height = the box actually shown on screen. Both must
    // be set explicitly — a <canvas> is a replaced element, so without an
    // explicit CSS pixel size it falls back to its buffer size as its layout
    // size, which made the scratch area balloon far outside the visible card.
    // Math.ceil guards against the buffer being truncated smaller than the
    // CSS size (canvas width/height setters floor fractional values).
    canvas.width = Math.ceil(w * dpr); canvas.height = Math.ceil(h * dpr);
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(w, h);
  }
  function paint(w, h) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#2c2417"); g.addColorStop(1, "#1a150d");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(244,234,217,.85)";
    ctx.font = "600 13px 'Jost', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ gores di sini ✦", w / 2, h / 2);
  }
  size();
  // card size can change after this (webfonts finishing load, orientation change,
  // the mobile browser's address bar collapsing, dynamic text, etc) — keep the
  // canvas glued to the card's real size, but only until the person actually
  // starts scratching: once they do, a repaint would wipe their progress and
  // silently re-cover the message, so we stop auto-resizing at that point.
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => { if (!revealed && !started) size(); });
    ro.observe(card);
  }
  window.addEventListener("resize", () => { if (!revealed && !started) size(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (!revealed && !started) size(); });
  }

  function scratchAt(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.fill();
  }
  function checkRevealPercent() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0, total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) { total++; if (data[i] === 0) cleared++; }
    return total ? cleared / total : 0;
  }
  let drawing = false, lastCheck = 0;
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }
  function reveal() {
    revealed = true;
    canvas.classList.add("revealed");
    $("#secretHint").textContent = "pesan sudah kebuka ♡";
    playSfx("chime");
    vibrate(20);
  }
  function onDown(e) { if (revealed) return; started = true; drawing = true; const p = pos(e); scratchAt(p.x, p.y); }
  function onMove(e) {
    if (!drawing || revealed) return;
    const p = pos(e); scratchAt(p.x, p.y);
    const now = Date.now();
    if (now - lastCheck > 220) {
      lastCheck = now;
      if (checkRevealPercent() > .5) reveal();
    }
  }
  function onUp() { drawing = false; }
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  canvas.addEventListener("touchstart", onDown, { passive: true });
  canvas.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("touchend", onUp);

  // re-sync right as the final screen becomes visible, in case the card's
  // size settled while it was hidden (visibility:hidden still lays out, but
  // this is a cheap extra safety net on top of the ResizeObserver above)
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
let touchStartX = 0, touchStartY = 0;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });
document.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && dx < 0) {
    if (["intro", "playlist", "letter", "wish", "memories", "polaroid", "flower", "farewell", "final", "reaction"].includes(currentScreen)) primaryAction();
  }
}, { passive: true });

/* =========================================================
   CONFETTI
   ========================================================= */
function confetti() {
  const layer = $("#confetti");
  const colors = ["#ffb8d1", "#ffd9e6", "#ef8fae", "#faeef2", "#e3a6bd"];
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
  const palette = colors || ["#ffb8d1", "#ffd9e6", "#ef8fae", "#faeef2", "#e3a6bd"];
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
  document.querySelectorAll(".reaction-btn").forEach((b) => { b.classList.remove("picked"); b.disabled = false; });
  $("#reactionThanks").textContent = "";
  $("#replyInput").value = "";
  $("#replyStatus").textContent = "balasanmu cuma buat aku, nggak buat siapa-siapa ✦";
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
    await fetch(CONFIG.wishFormEndpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        pengirim: CONFIG.name,
        reaksi: REACTION_LABELS[key] || key,
        waktu: new Date().toLocaleString("id-ID")
      })
    });
  } catch (e) { /* offline atau diblokir — tidak apa, tetap tampil terpilih secara lokal */ }
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
    await fetch(CONFIG.wishFormEndpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        pengirim: CONFIG.name,
        balasan: text,
        waktu: new Date().toLocaleString("id-ID")
      })
    });
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
$("#replyToShareBtn").onclick = () => { playSfx("tap"); showScreen("share"); };

/* ---------- story card: kartu "momen" format story (potret), didesain ulang
   biar lebih instagramable — dipakai buat preview langsung di slide & buat
   di-share/diunduh, jadi orangnya bisa lihat dulu sebelum bagikan ---------- */
async function loadStoryFonts() {
  try {
    if (document.fonts && document.fonts.load) {
      await Promise.all([
        document.fonts.load('italic 600 70px "Cormorant Garamond"'),
        document.fonts.load('600 22px "Jost"')
      ]);
    }
  } catch (e) { /* fallback font dipakai di bawah */ }
  const displayFont = document.fonts && document.fonts.check && document.fonts.check('italic 600 70px "Cormorant Garamond"')
    ? "Cormorant Garamond" : "Georgia";
  const bodyFont = document.fonts && document.fonts.check && document.fonts.check('600 22px "Jost"')
    ? "Jost" : "Georgia";
  return { displayFont, bodyFont };
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------- background themes — beberapa palet siap pakai, plus foto sendiri ---------- */
const STORY_THEMES = {
  default: { grad: ["#1a0f16", "#20111a", "#0e0710"], blob1: "rgba(227,166,189,.32)", blob2: "rgba(201,164,99,.22)", eyebrow: "#e3a6bd", title: "#faeef2", titleAccent: "#ffd9e6", quote: "#e7d9c8", grain: "#f4ead9" },
  gold:    { grad: ["#241608", "#2c1a0c", "#140b04"], blob1: "rgba(227,180,106,.34)", blob2: "rgba(201,120,99,.2)", eyebrow: "#e3b06a", title: "#fbf1e0", titleAccent: "#ffe3ae", quote: "#e8dcc6", grain: "#f4ecd9" },
  night:   { grad: ["#0b0a1c", "#131230", "#050512"], blob1: "rgba(138,122,224,.34)", blob2: "rgba(99,166,201,.2)", eyebrow: "#a89af0", title: "#f0eefa", titleAccent: "#c9bdff", quote: "#cfc8e8", grain: "#e6e1f7" },
  sunset:  { grad: ["#2a0f10", "#3a1712", "#160708"], blob1: "rgba(242,140,107,.36)", blob2: "rgba(227,90,120,.22)", eyebrow: "#f2a06b", title: "#fff1e6", titleAccent: "#ffcaa6", quote: "#f0d9c8", grain: "#ffe8d9" },
  mono:    { grad: ["#171412", "#1e1a17", "#0d0b0a"], blob1: "rgba(232,221,206,.18)", blob2: "rgba(232,221,206,.10)", eyebrow: "#e8ddce", title: "#f7f2ea", titleAccent: "#e8ddce", quote: "#cfc6b8", grain: "#efe8dc" }
};
let currentStoryTheme = "default";
let customBgImage = null; // Image element kalau user upload foto sendiri (dipakai sebagai BACKGROUND penuh)
let heroPhotoImage = null; // Image element kalau user upload foto buat ditaruh DI DALAM kartu (kayak polaroid), beda dari customBgImage

function restoreStoryBgChoice() {
  try {
    const savedCustom = localStorage.getItem("hbd_story_bg_custom");
    const savedTheme = localStorage.getItem("hbd_story_bg_theme");
    const savedHero = localStorage.getItem("hbd_story_hero_photo");
    if (savedTheme && STORY_THEMES[savedTheme]) currentStoryTheme = savedTheme;
    if (savedCustom) {
      const img = new Image();
      img.onload = () => { customBgImage = img; renderStoryPreview(); };
      img.src = savedCustom;
    }
    if (savedHero) {
      const img2 = new Image();
      img2.onload = () => { heroPhotoImage = img2; renderStoryPreview(); };
      img2.src = savedHero;
    }
  } catch (e) { /* localStorage nggak tersedia — pakai default aja */ }
}
function markPickedSwatch() {
  document.querySelectorAll(".bg-swatch[data-theme]").forEach((b) => {
    b.classList.toggle("picked", !customBgImage && b.dataset.theme === currentStoryTheme);
  });
}

/* ---------- capture 1 slide jadi canvas, buat frame GIF highlight ----------
   Bukan screenshot layar asli (yang lagi aktif belum tentu slide ini) —
   tapi kloningan section-nya sendiri, dipaksa "aktif", digambar offscreen,
   lalu diambil pakai html2canvas. Bagian yang perlu disensor (censorSelectors)
   di-blur + dikasih label sebelum difoto, supaya isi originalnya nggak
   pernah ikut ke GIF sama sekali. */
async function captureSectionCanvas(selector, { width = 480, height = 854, censorSelectors = [], censorLabel = "" } = {}) {
  if (typeof html2canvas === "undefined") return null;
  const original = document.querySelector(selector);
  if (!original) return null;

  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${width}px;height:${height}px;overflow:hidden;pointer-events:none;background:${getComputedStyle(document.body).backgroundColor || "#1a0f16"};`;
  const clone = original.cloneNode(true);
  clone.classList.add("active");
  clone.style.cssText = `position:static;opacity:1;visibility:visible;pointer-events:none;transform:none;inset:auto;width:${width}px;height:${height}px;`;

  // Surat & catatan permintaan: konten aslinya diisi ulang (biar bukan
  // kosong kalau belum pernah dimainkan), lalu langsung diblur + dilabeli —
  // teksnya sendiri tidak pernah tampil jelas di frame hasil capture.
  if (selector === "#letter") {
    const t = clone.querySelector("#typeText");
    if (t) t.textContent = CONFIG.letter.join(" ");
  }
  if (selector === "#candle") {
    const t = clone.querySelector("#wishNoteInput");
    if (t) t.textContent = "•••••• •••• •••••••• ••••••";
    clone.querySelector("#cakeScene")?.classList.remove("locked");
    clone.querySelector(".candle-actions")?.classList.remove("locked");
  }
  censorSelectors.forEach((sel) => {
    const el = clone.querySelector(sel);
    if (!el) return;
    el.style.filter = "blur(11px)";
    el.style.userSelect = "none";
    const label = document.createElement("div");
    label.className = "micro-copy";
    label.style.cssText = "margin-top:10px;opacity:.85;";
    label.textContent = `✦ ${censorLabel || "disensor"} ✦`;
    el.insertAdjacentElement("afterend", label);
  });

  // loading="lazy" nggak akan pernah kepicu di clone yang sengaja diselipkan
  // jauh di luar viewport — matikan biar gambarnya (foto/polaroid) tetap muncul.
  const imgs = Array.from(clone.querySelectorAll("img"));
  imgs.forEach((img) => { img.loading = "eager"; });

  host.appendChild(clone);
  document.body.appendChild(host);
  await Promise.race([
    Promise.all(imgs.map((img) => img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; }))),
    new Promise((r) => setTimeout(r, 700))
  ]);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  let canvas = null;
  try {
    canvas = await html2canvas(clone, { width, height, backgroundColor: null, scale: 1, useCORS: true, logging: false });
  } catch (e) { canvas = null; }
  host.remove();
  return canvas;
}

/* ---------- barcode/QR kecil buat link di poster ---------- */
let qrCache = { text: null, canvas: null };
async function getQrCanvas(text, size = 240) {
  if (qrCache.text === text && qrCache.canvas) return qrCache.canvas;
  if (typeof QRCode === "undefined") return null;
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-99999px;top:0;";
  document.body.appendChild(host);
  try {
    // eslint-disable-next-line no-new
    new QRCode(host, { text, width: size, height: size, colorDark: "#1a0f16", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    await new Promise((r) => setTimeout(r, 80));
    const src = host.querySelector("canvas") || host.querySelector("img");
    if (src) {
      const out = document.createElement("canvas");
      out.width = size; out.height = size;
      out.getContext("2d").drawImage(src, 0, 0, size, size);
      qrCache = { text, canvas: out };
    }
  } catch (e) { /* gagal bikin QR — poster tetap jalan tanpa barcode */ }
  host.remove();
  return qrCache.text === text ? qrCache.canvas : null;
}

// motif bunga garis tipis, dipakai nyebar halus di background kartu ucapan
// (dekorasi ringan — bukan fokus, cuma nemenin biar nggak polos & tetap senada sama tema flower di web)
function drawTinyFlowerMotif(ctx, cx, cy, r, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * r * .55, cy + Math.sin(a) * r * .55, r * .55, r * .32, a, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, r * .16, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

async function drawStoryCard(ctx, W, H) {
  const { displayFont, bodyFont } = await loadStoryFonts();
  const theme = STORY_THEMES[currentStoryTheme] || STORY_THEMES.default;
  const targetView = isTargetViewer();
  ctx.clearRect(0, 0, W, H);

  // ---------- background ----------
  if (customBgImage) {
    // foto latar sendiri (dari picker "background kartu") tetap dipakai, cover-fit + overlay gelap,
    // sementara foto hero (di picker "foto di kartu") tampil sebagai elemen terpisah di atasnya
    const img = customBgImage;
    const scale = Math.max(W / img.width, H / img.height);
    const iw = img.width * scale, ih = img.height * scale;
    ctx.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih);
    const overlay = ctx.createLinearGradient(0, 0, 0, H);
    overlay.addColorStop(0, "rgba(10,6,10,.6)");
    overlay.addColorStop(.4, "rgba(10,6,10,.5)");
    overlay.addColorStop(1, "rgba(10,6,10,.78)");
    ctx.fillStyle = overlay; ctx.fillRect(0, 0, W, H);
  } else {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, theme.grad[0]); bg.addColorStop(.5, theme.grad[1]); bg.addColorStop(1, theme.grad[2]);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  }

  const blob1 = ctx.createRadialGradient(W * .15, H * .1, 10, W * .15, H * .1, 480);
  blob1.addColorStop(0, theme.blob1); blob1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = blob1; ctx.fillRect(0, 0, W, H);
  const blob2 = ctx.createRadialGradient(W * .88, H * .95, 10, W * .88, H * .95, 520);
  blob2.addColorStop(0, theme.blob2); blob2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = blob2; ctx.fillRect(0, 0, W, H);

  // motif bunga kecil, disebar jarang & pelan biar nggak ramai — cuma tekstur, bukan fokus
  const flowerSeed = [[110, 140, 46], [W - 130, 190, 34], [90, H - 160, 40], [W - 110, H - 620, 30], [W - 90, 260, 26]];
  flowerSeed.forEach(([x, y, r]) => drawTinyFlowerMotif(ctx, x, y, r, theme.eyebrow, .22));

  // grain sangat halus buat tekstur kertas
  for (let i = 0; i < 70; i++) {
    ctx.globalAlpha = .05 + Math.random() * .12;
    ctx.fillStyle = theme.grain;
    const s = Math.random() * 1.6 + .5;
    ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, s, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";

  // eyebrow
  ctx.fillStyle = theme.eyebrow;
  ctx.font = `700 24px "${bodyFont}"`;
  ctx.save(); ctx.letterSpacing = "6px";
  ctx.fillText(targetView ? "SEBUAH KARTU UCAPAN" : "SEBUAH KARTU KECIL", W / 2, 108);
  ctx.restore();

  // ---------- foto hero (kalau ada) — kayak polaroid nempel, foto asli si target ----------
  const photoBoxX = 130, photoBoxY = 168, photoBoxW = W - 260, photoBoxH = 1010;
  if (heroPhotoImage) {
    const img = heroPhotoImage;
    // glow lembut di belakang foto biar dia "pop" dari background
    const glow = ctx.createRadialGradient(W / 2, photoBoxY + photoBoxH * .5, 40, W / 2, photoBoxY + photoBoxH * .5, photoBoxW * .75);
    glow.addColorStop(0, theme.blob1); glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.fillRect(photoBoxX - 60, photoBoxY - 60, photoBoxW + 120, photoBoxH + 120);

    // fit "contain" biar foto (yang background-nya udah dihapus) nggak kepotong
    const scale = Math.min(photoBoxW / img.width, photoBoxH / img.height);
    const iw = img.width * scale, ih = img.height * scale;
    const ix = W / 2 - iw / 2, iy = photoBoxY + (photoBoxH - ih); // rata bawah biar "berdiri" di kartu
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    ctx.drawImage(img, ix, iy, iw, ih);
    ctx.restore();

    // bracket tipis di sudut area foto, senada elemen "corner" di web
    ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 3;
    const bl = 40;
    [[photoBoxX, photoBoxY, 1, 1], [photoBoxX + photoBoxW, photoBoxY, -1, 1]]
      .forEach(([x, y, dx, dy]) => { ctx.beginPath(); ctx.moveTo(x, y + bl * dy); ctx.lineTo(x, y); ctx.lineTo(x + bl * dx, y); ctx.stroke(); });
  } else {
    // fallback kalau belum upload foto: badge emoji reaksi seperti sebelumnya
    const emoji = (lastPickedReaction && document.querySelector(`.reaction-btn[data-reaction="${lastPickedReaction}"]`)?.dataset.emoji) || "♡";
    const badgeCy = photoBoxY + photoBoxH * .42, badgeR = 130;
    const badgeGlow = ctx.createRadialGradient(W / 2, badgeCy, 10, W / 2, badgeCy, badgeR + 50);
    badgeGlow.addColorStop(0, theme.blob1); badgeGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = badgeGlow; ctx.beginPath(); ctx.arc(W / 2, badgeCy, badgeR + 50, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W / 2, badgeCy, badgeR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.stroke();
    ctx.font = `152px "${bodyFont}"`;
    ctx.fillText(emoji, W / 2, badgeCy + 54);
  }

  // ---------- ucapan: judul + kutipan asli dari surat / balasan ----------
  const textTop = photoBoxY + photoBoxH + 96;
  ctx.fillStyle = theme.title;
  ctx.font = `italic 600 72px "${displayFont}"`;
  ctx.fillText(targetView ? `Selamat ulang tahun,` : "Ada ucapan kecil,", W / 2, textTop);
  ctx.fillStyle = theme.titleAccent;
  ctx.font = `italic 600 76px "${displayFont}"`;
  ctx.fillText(targetView ? `${CONFIG.name}. ♡` : "khusus untuk satu orang ♡", W / 2, textTop + 92);

  ctx.strokeStyle = "rgba(255,255,255,.25)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W * .32, textTop + 150); ctx.lineTo(W * .68, textTop + 150); ctx.stroke();

  // kutipan: balasan asli kalau ada, kalau nggak pakai baris pertama surat (CONFIG.letter) — jadi tetap kata-kata beneran, bukan generik
  const replyText = ($("#replyInput")?.value || "").trim();
  const letterLine = (CONFIG.letter && CONFIG.letter[0]) || "Semoga hari ini jadi salah satu hari yang paling kamu suka.";
  const quoteSrc = replyText || letterLine;
  const quote = `“${quoteSrc.length > 115 ? quoteSrc.slice(0, 115).trim() + "…" : quoteSrc}”`;
  ctx.fillStyle = theme.quote;
  ctx.font = `italic 36px "${displayFont}"`;
  wrapCanvasText(ctx, quote, W / 2, textTop + 240, W - 260, 54);

  // tanda tangan
  ctx.fillStyle = "#cabfae";
  ctx.font = `600 28px "${bodyFont}"`;
  ctx.fillText("— seseorang yang selalu mendoakanmu 💕", W / 2, textTop + 486);

  // ---------- footer kecil: QR + link, sengaja diminimalkan biar bukan fokus utama ----------
  const qrSize = 84;
  const footerY = H - 150;
  const qr = await getQrCanvas(shareUrl(), 240);
  ctx.textAlign = "left";
  if (qr) {
    roundRectPath(ctx, 70, footerY - 8, qrSize + 16, qrSize + 16, 12);
    ctx.fillStyle = "#ffffff"; ctx.fill();
    ctx.drawImage(qr, 78, footerY, qrSize, qrSize);
  }
  ctx.fillStyle = "rgba(255,255,255,.55)";
  ctx.font = `500 22px "${bodyFont}"`;
  ctx.fillText("dibuat dengan ♡", 70 + qrSize + 36, footerY + 30);
  ctx.fillStyle = theme.eyebrow;
  ctx.font = `600 20px "${bodyFont}"`;
  ctx.fillText("scan buat baca lengkapnya ✦", 70 + qrSize + 36, footerY + 60);
  ctx.textAlign = "center";
}

async function renderStoryPreview() {
  const canvas = $("#storyPreviewCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  await drawStoryCard(ctx, canvas.width, canvas.height);
  markPickedSwatch();
}
window.addEventListener("screenchange", (e) => { if (e.detail === "share") renderStoryPreview(); });
restoreStoryBgChoice();

/* ---------- ganti background: tema siap pakai atau upload foto sendiri ---------- */
$("#bgSwatchRow")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".bg-swatch[data-theme]");
  if (!btn) return;
  playSfx("tap");
  currentStoryTheme = btn.dataset.theme;
  customBgImage = null;
  try {
    localStorage.setItem("hbd_story_bg_theme", currentStoryTheme);
    localStorage.removeItem("hbd_story_bg_custom");
  } catch (e2) { /* penuh/diblokir — nggak masalah, cuma nggak kesimpan lintas kunjungan */ }
  renderStoryPreview();
});
$("#bgUploadInput")?.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      customBgImage = img;
      playSfx("chime");
      try { localStorage.setItem("hbd_story_bg_custom", reader.result); } catch (e2) { /* foto ketedaan gede buat localStorage — tetep kepake di sesi ini */ }
      renderStoryPreview();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});
$("#bgResetBtn")?.addEventListener("click", () => {
  playSfx("tap");
  currentStoryTheme = "default";
  customBgImage = null;
  try {
    localStorage.removeItem("hbd_story_bg_custom");
    localStorage.removeItem("hbd_story_bg_theme");
  } catch (e2) { /* nggak masalah */ }
  const input = $("#bgUploadInput"); if (input) input.value = "";
  renderStoryPreview();
});

/* ---------- foto hero di dalam kartu (beda dari foto background) ---------- */
$("#heroPhotoInput")?.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      heroPhotoImage = img;
      playSfx("chime");
      try { localStorage.setItem("hbd_story_hero_photo", reader.result); } catch (e2) { /* foto kegedean buat localStorage — tetep kepake di sesi ini */ }
      renderStoryPreview();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});
$("#heroPhotoResetBtn")?.addEventListener("click", () => {
  playSfx("tap");
  heroPhotoImage = null;
  try { localStorage.removeItem("hbd_story_hero_photo"); } catch (e2) { /* nggak masalah */ }
  const input = $("#heroPhotoInput"); if (input) input.value = "";
  renderStoryPreview();
});

/* =========================================================
   POSTER + GIF HIGHLIGHT — render animasi dari semua slide
   Frame 1 & terakhir: poster (kartu + barcode + link).
   Frame tengah: highlight tiap slide (letter & candle disensor/blur).
   ========================================================= */
let gifWorkerBlobUrl = null;
async function getGifWorkerUrl() {
  if (gifWorkerBlobUrl) return gifWorkerBlobUrl;
  const res = await fetch("https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js");
  if (!res.ok) throw new Error("gagal ambil gif.worker.js");
  const blob = await res.blob();
  gifWorkerBlobUrl = URL.createObjectURL(blob);
  return gifWorkerBlobUrl;
}

async function buildHighlightGif(onProgress) {
  if (typeof GIF === "undefined") throw new Error("Pustaka GIF belum termuat (cek koneksi internet)");
  const W = 540, H = 960; // 9:16, separuh resolusi poster (1080x1920) — cukup ringan buat GIF
  const workerScript = await getGifWorkerUrl();
  const gif = new GIF({ workers: 2, quality: 14, width: W, height: H, workerScript, background: "#1a0f16" });

  onProgress?.("menyiapkan poster ✦ 0%");
  const targetView = isTargetViewer();
  const reel = getHighlightReelFor(targetView); // target/admin: semua slide (letter & candle diblur). publik: tanpa keduanya.
  const posterFull = document.createElement("canvas");
  posterFull.width = 1080; posterFull.height = 1920;
  await drawStoryCard(posterFull.getContext("2d"), 1080, 1920);
  const posterFrame = document.createElement("canvas");
  posterFrame.width = W; posterFrame.height = H;
  posterFrame.getContext("2d").drawImage(posterFull, 0, 0, W, H);
  gif.addFrame(posterFrame, { delay: 2400, copy: true });

  const total = reel.length;
  for (let i = 0; i < total; i++) {
    const item = reel[i];
    onProgress?.(`merekam highlight ${i + 1}/${total} ✦ ${Math.round(((i + 1) / (total + 2)) * 80)}%`);
    const shot = await captureSectionCanvas(`#${item.id}`, { censorSelectors: item.censor, censorLabel: item.censorLabel });
    const frame = document.createElement("canvas");
    frame.width = W; frame.height = H;
    const fctx = frame.getContext("2d");
    fctx.fillStyle = "#1a0f16"; fctx.fillRect(0, 0, W, H);
    if (shot) {
      const s = Math.max(W / shot.width, H / shot.height);
      const sw = shot.width * s, sh = shot.height * s;
      fctx.drawImage(shot, (W - sw) / 2, (H - sh) / 2, sw, sh);
    }
    gif.addFrame(frame, { delay: item.hold || 900, copy: true });
  }

  onProgress?.("menambahkan barcode & link ✦ 85%");
  gif.addFrame(posterFrame, { delay: 2400, copy: true }); // penutup, poster lagi biar loop-nya enak dilihat

  return new Promise((resolve, reject) => {
    gif.on("progress", (p) => onProgress?.(`merender GIF ✦ ${Math.round(p * 100)}%`));
    gif.on("finished", (blob) => resolve(blob));
    try { gif.render(); } catch (e) { reject(e); }
  });
}

$("#storyShareBtn").onclick = async () => {
  playSfx("pop");
  const status = $("#shareStatus");
  await renderStoryPreview(); // refresh preview poster di layar
  let blob;
  try {
    blob = await buildHighlightGif((msg) => { status.textContent = msg; });
  } catch (e) {
    status.textContent = "gagal bikin GIF, coba lagi ya";
    return;
  }
  const file = new File([blob], `poster-birthday-${(CONFIG.name || "kamu").toLowerCase().replace(/\s+/g, "-")}.gif`, { type: "image/gif" });

  // Web Share API dengan file: di HP, share sheet native biasanya
  // langsung nawarin opsi "Add to Story" WhatsApp/Instagram kalau
  // app-nya terpasang — jadi pengalaman paling "keren" & langsung.
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "For You ♡", text: "Ada poster kecil buat dibagikan ✦" });
      status.textContent = "poster GIF-nya siap dibagikan ✦";
      return;
    } catch (e) { /* dibatalkan / gagal — lanjut ke fallback unduh di bawah */ }
  }
  // Fallback: browser tanpa dukungan share file (desktop, atau iOS lama) — unduh biasa.
  const link = document.createElement("a");
  link.download = file.name;
  link.href = URL.createObjectURL(blob);
  link.click();
  status.textContent = "GIF diunduh — tinggal upload manual ke story ✦";
};

$("#downloadStoryBtn").onclick = async () => {
  playSfx("pop");
  const status = $("#shareStatus");
  await renderStoryPreview();
  let blob;
  try {
    blob = await buildHighlightGif((msg) => { status.textContent = msg; });
  } catch (e) {
    status.textContent = "gagal bikin GIF, coba lagi ya";
    return;
  }
  const link = document.createElement("a");
  link.download = `poster-birthday-${(CONFIG.name || "kamu").toLowerCase().replace(/\s+/g, "-")}.gif`;
  link.href = URL.createObjectURL(blob);
  link.click();
  status.textContent = "poster + GIF highlight diunduh ✦";
};

/* =========================================================
   CANDLE — microphone "blow to extinguish" with tap fallback
   ========================================================= */
let celebrationDone = false;
let wishSealed = false;
let micStream = null, audioCtx = null, analyser = null, blowLoop = null, micLastRms = 0;

/* ---------- sealed wish note: must be written before the candle unlocks ---------- */
async function sendWishNote(text) {
  if (!CONFIG.wishFormEndpoint) return; // not configured — skip silently
  try {
    await fetch(CONFIG.wishFormEndpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        pengirim: CONFIG.name,
        harapan: text,
        waktu: new Date().toLocaleString("id-ID")
      })
    });
  } catch (e) { /* offline or blocked — the note stays sealed locally either way */ }
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
  celebrationDone = false;
  wishSealed = false;
  stopMic();
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
  stopMic();
  $("#cakeScene").classList.add("blown");
  $("#micStatus").textContent = "Lilin padam ✦ wish made";
  vibrate([10, 30, 10, 30, 30]);
  setTimeout(() => { showScreen("flower"); playSfx("chime"); }, 850);
}
$("#blowBtn").onclick = startMic;

/* ---------- progress dots: tap a completed (or current) dot to jump back ---------- */
const STEP_GOTO = {
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
document.querySelectorAll("#progress i").forEach((dot) => {
  dot.setAttribute("role", "button");
  dot.setAttribute("tabindex", "0");
  dot.setAttribute("aria-label", "Kembali ke bagian ini");
  const jump = () => {
    // Only completed or current steps are reachable — no skipping ahead.
    if (!dot.classList.contains("done") && !dot.classList.contains("on")) return;
    const fn = STEP_GOTO[dot.dataset.step];
    if (fn) { playSfx("tap"); fn(); }
  };
  dot.addEventListener("click", jump);
  dot.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(); }
  });
});

/* ---------- unlock music on first tap anywhere (only if a song is already loaded) ---------- */
document.addEventListener("pointerdown", () => { if (music.getAttribute("src")) startMusic(); }, { once: true });

updateProgress("playlist");

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
