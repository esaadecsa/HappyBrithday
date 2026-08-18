// ===============================
// EDIT BAGIAN INI
// ===============================
const CONFIG = {
  name: "kamu",
  birthday: "2026-10-22T00:00:00+07:00",
  letter: [
    "Hari ini, aku langitkan semua doa baik untuk kamu.",
    "Semoga hal-hal yang membuatmu lelah perlahan berubah menjadi alasan untuk tersenyum.",
    "Semoga langkahmu dimudahkan, rezekimu dilapangkan, dan orang-orang baik selalu menemukan jalan menuju hidupmu.",
    "Dan semoga kamu selalu punya alasan untuk bangga pada dirimu sendiri."
  ]
};

// ===============================
// APP
// ===============================
const $ = (s) => document.querySelector(s);
const screens = {
  intro: $("#intro"),
  letter: $("#letter"),
  wish: $("#wish"),
  gift: $("#gift"),
  nope: $("#nope"),
  candle: $("#candle"),
  final: $("#final")
};

const music = $("#background-music");
const nameIntro = $("#nameIntro");
const nameFinal = $("#nameFinal");
const nameCandle = $("#nameCandle");
const typeText = $("#typeText");

nameIntro.textContent = CONFIG.name;
nameFinal.textContent = CONFIG.name;
nameCandle.textContent = CONFIG.name + ".";

function showScreen(next) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[next].classList.add("active");
}

function typeWriter(lines, speed = 28) {
  typeText.textContent = "";
  let lineIndex = 0;
  let charIndex = 0;

  function tick() {
    if (lineIndex >= lines.length) return;
    const line = lines[lineIndex];

    if (charIndex < line.length) {
      typeText.textContent += line[charIndex++];
      setTimeout(tick, speed);
    } else {
      typeText.textContent += "\n\n";
      lineIndex++;
      charIndex = 0;
      setTimeout(tick, 450);
    }
  }
  tick();
}

function startMusic() {
  music.play().catch(() => {});
}

function confetti() {
  const layer = $("#confetti");
  const pieces = 90;
  for (let i = 0; i < pieces; i++) {
    const el = document.createElement("i");
    el.className = "confetti";
    el.style.left = Math.random() * 100 + "vw";
    el.style.setProperty("--x", (Math.random() * 260 - 130) + "px");
    el.style.animationDelay = (Math.random() * .8) + "s";
    el.style.animationDuration = (2.2 + Math.random() * 1.8) + "s";
    el.style.background = [
      "#ff8db6", "#ffb8d1", "#9d8cff", "#ffffff", "#ffd166"
    ][Math.floor(Math.random() * 5)];
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

function openLetter() {
  startMusic();
  showScreen("letter");
  typeWriter(CONFIG.letter);
}

function goWish() {
  showScreen("wish");
}

function goGift() {
  showScreen("gift");
  document.body.classList.remove("celebrating");
}

function goCandle() {
  showScreen("candle");
  const btn = $("#flameBtn");
  btn.classList.remove("blown");
  $("#blowHint").textContent = "tap apinya ✨";
}

function goFinal() {
  showScreen("final");
  document.body.classList.add("celebrating");
  confetti();
}

$("#openBtn").addEventListener("click", openLetter);
$("#nextBtn").addEventListener("click", goWish);
$("#giftBtn").addEventListener("click", goGift);

$("#yesBtn").addEventListener("click", goCandle);

$("#noBtn").addEventListener("click", () => {
  showScreen("nope");
  $("#nopeText").textContent = "Padahal sudah disiapin khusus buat kamu... tega banget 😭";
});

$("#retryBtn").addEventListener("click", goGift);

$("#reallyNoBtn").addEventListener("click", () => {
  showScreen("gift");
  $("#giftQuestion").innerHTML = "Serius? 😭<br>aku kasih kesempatan terakhir deh...";
  $("#choiceHint").textContent = "jawaban terakhir, jangan nyesel 😛";
});

$("#flameBtn").addEventListener("click", () => {
  const btn = $("#flameBtn");
  if (btn.classList.contains("blown")) return;
  btn.classList.add("blown");
  $("#blowHint").textContent = "wish made... ✨";
  setTimeout(goFinal, 850);
});

$("#againBtn").addEventListener("click", () => {
  showScreen("intro");
});

$("#closeBtn").addEventListener("click", () => {
  showScreen("intro");
});

$("#musicBtn").addEventListener("click", () => {
  if (music.paused) {
    startMusic();
    $("#musicBtn").textContent = "♫";
  } else {
    music.pause();
    $("#musicBtn").textContent = "Ⅱ";
  }
});

// Mobile browsers block autoplay. First touch/click starts music.
document.addEventListener("pointerdown", () => startMusic(), { once: true });

// Small star field
const stars = $("#stars");
for (let i = 0; i < 35; i++) {
  const s = document.createElement("span");
  s.style.position = "absolute";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.width = s.style.height = (1 + Math.random() * 2) + "px";
  s.style.borderRadius = "50%";
  s.style.background = "rgba(255,255,255,.75)";
  s.style.opacity = (0.15 + Math.random() * .65).toFixed(2);
  s.style.animation = `twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`;
  stars.appendChild(s);
}

const style = document.createElement("style");
style.textContent = "@keyframes twinkle{50%{opacity:.1;transform:scale(.55)}}";
document.head.appendChild(style);
