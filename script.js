<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#090812">
<title>For You ♡</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div id="stars" class="stars" aria-hidden="true"></div>
<div id="hearts" class="hearts-layer" aria-hidden="true"></div>
<div class="grain" aria-hidden="true"></div>
<div id="confetti" class="confetti-layer" aria-hidden="true"></div>
<div id="cursorGlow" class="cursor-glow" aria-hidden="true"></div>
<div id="toast" class="toast" aria-live="polite"></div>

<div id="progress" class="progress-dots" aria-hidden="true">
  <i data-step="intro"></i><i data-step="letter"></i><i data-step="wish"></i><i data-step="gift"></i><i data-step="candle"></i><i data-step="flower"></i><i data-step="final"></i>
</div>

<main class="app">
<section id="intro" class="screen active">
  <div class="orb orb-a"></div><div class="orb orb-b"></div>
  <div class="intro-card">
    <div class="eyebrow">A LITTLE SURPRISE FOR YOU</div>
    <div class="mini-heart">♡</div>
    <h1>Hey, <span id="nameIntro">you</span>.</h1>
    <p class="intro-copy">Aku punya sesuatu kecil yang ingin aku kasih ke kamu.</p>
    <button id="openBtn" class="primary-btn"><span>Buka suratnya</span><span>→</span></button>
    <div class="hint">lebih bagus kalau dibuka pelan-pelan ✦</div>
    <div id="countdown" class="countdown" aria-live="polite"></div>
  </div>
</section>

<section id="letter" class="screen">
  <div class="topbar"><div class="topbar-left"><button id="musicBtn" class="icon-btn">♫</button><div id="visualizer" class="visualizer" aria-hidden="true"><i></i><i></i><i></i><i></i></div><button id="sfxBtn" class="icon-btn">🔔</button></div><span>FOR YOU</span><button id="closeBtn" class="icon-btn">×</button></div>
  <div class="letter-wrap">
    <div class="photo-frame tilt-el"><div class="photo-glow"></div><img src="./img/hbd1.png" alt="Birthday"><span class="photo-label">a little memory ♡</span></div>
    <article class="letter-card">
      <div class="letter-date">22 · OCTOBER</div>
      <h2>Selamat<br><em>ulang tahun.</em></h2>
      <p id="typeText" class="type-text"></p>
      <div class="signature">— someone who wishes you well ♡</div>
    </article>
  </div>
  <button id="nextBtn" class="round-btn">↓</button>
</section>

<section id="wish" class="screen">
  <div class="wish-inner">
    <div class="eyebrow">ONE MORE THING</div>
    <h2>Semoga tahun ini<br><em>lebih baik dari sebelumnya.</em></h2>
    <div class="wish-grid">
      <div class="wish-pill"><span>01</span> lebih banyak senyum</div>
      <div class="wish-pill"><span>02</span> lebih sedikit overthinking</div>
      <div class="wish-pill"><span>03</span> semua yang kamu doakan</div>
    </div>
    <button id="giftBtn" class="primary-btn"><span>Ada satu lagi</span><span>→</span></button>
  </div>
</section>

<section id="gift" class="screen">
  <div class="scene-aura"></div>
  <div class="experience-card">
    <div class="step-label"><span>03</span><i></i><span>?</span></div>
    <button id="giftObject" class="gift-object tilt-el" aria-label="Buka hadiah">
      <span class="gift-lid"></span><span class="gift-body"></span><span class="gift-ribbon-v"></span><span class="gift-ribbon-h"></span><span class="gift-bow">♡</span>
    </button>
    <div class="eyebrow">JUST FOR YOU</div>
    <h2 id="giftTitle">Ada <em>hadiah</em> buat kamu.</h2>
    <p id="giftQuestion">Tapi sebelum itu...<br><strong>kamu mau?</strong></p>
    <div class="choices">
      <button id="yesBtn" class="primary-btn yes-btn"><span>MAU ❤️</span><span>→</span></button>
      <button id="noBtn" class="ghost-btn no-btn">GA MAU 😛</button>
    </div>
    <div id="choiceHint" class="micro-copy">sentuh hadiahnya dulu ✦</div>
  </div>
</section>

<section id="nope" class="screen">
  <div class="scene-aura pink"></div>
  <div class="nope-card">
    <div class="reaction">😮‍💨</div>
    <div class="eyebrow">WAIT...</div>
    <h2 id="nopeTitle">Serius <em>ga mau?</em></h2>
    <p id="nopeText">Aku sudah nyiapin ini khusus buat kamu.<br>Jangan bikin aku malu dong 😭</p>
    <div class="nope-actions">
      <button id="retryBtn" class="primary-btn"><span>Yaudah, mau ❤️</span><span>→</span></button>
      <button id="reallyNoBtn" class="text-btn">tetap ga mau</button>
    </div>
    <div id="noCount" class="micro-copy">kesempatan: 2</div>
  </div>
</section>

<section id="candle" class="screen">
  <div class="candle-aura"></div>
  <div class="candle-card">
    <div class="eyebrow">MAKE A WISH</div>
    <h2>Satu permintaan.<br><em>Satu lilin.</em></h2>
    <p>Matikan apinya untuk membuka kejutan terakhir.</p>
    <div id="cakeScene" class="cake-scene">
      <div class="flame-wrap" id="flameTarget" aria-label="Api lilin">
        <div class="flame"><span></span></div>
      </div>
      <div class="wick"></div>
      <div class="candle-stick"></div>
      <div class="cake-top"></div>
      <div class="cake-body"><span class="cream cream1"></span><span class="cream cream2"></span><span class="sprinkles">•　•　•　•　•</span></div>
      <div class="plate"></div>
    </div>
    <div class="candle-actions">
      <button id="blowBtn" class="primary-btn"><span>🎙️ Tiup lilinnya</span></button>
      <button id="tapFlameBtn" class="ghost-btn">atau tap apinya ✦</button>
    </div>
    <div id="micStatus" class="micro-copy">izin mikrofon opsional · tap api selalu bisa</div>
  </div>
</section>

<section id="flower" class="screen">
  <div class="scene-aura peach"></div>
  <div class="flower-card">
    <div class="eyebrow">ONE LAST SURPRISE</div>
    <h2>Sebuket bunga,<br><em>khusus buat kamu.</em></h2>
    <p>Semoga harum dan warnanya bikin harimu makin cerah.</p>

    <div class="bouquet-scene" id="bouquetScene">
      <div class="bucket">
        <span class="bucket-shine"></span>
        <span class="ribbon"></span>
        <span class="ribbon-knot"></span>
      </div>
      <div class="stems" aria-hidden="true">
        <span class="sprig sprig-l"></span>
        <span class="sprig sprig-r"></span>
        <div class="flower f1" style="--x:14%;--h:150px;--hue:336;--d:.02s">
          <span class="stem"></span><span class="leaf ll"></span>
          <div class="bloom"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>
        </div>
        <div class="flower f2" style="--x:66%;--h:158px;--hue:264;--d:.1s">
          <span class="stem"></span><span class="leaf lr"></span>
          <div class="bloom"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>
        </div>
        <div class="flower f3" style="--x:38%;--h:180px;--hue:346;--d:.18s">
          <span class="stem"></span><span class="leaf ll"></span><span class="leaf lr"></span>
          <div class="bloom"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>
        </div>
        <div class="flower f4" style="--x:53%;--h:132px;--hue:24;--d:.26s">
          <span class="stem"></span>
          <div class="bloom small"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>
        </div>
        <div class="flower f5" style="--x:24%;--h:112px;--hue:300;--d:.34s">
          <span class="stem"></span><span class="leaf lr"></span>
          <div class="bloom small"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>
        </div>
        <div class="flower f6" style="--x:78%;--h:126px;--hue:350;--d:.42s">
          <span class="stem"></span><span class="leaf ll"></span>
          <div class="bloom small"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>
        </div>
        <div class="flower f7" style="--x:46%;--h:96px;--hue:44;--d:.5s">
          <span class="stem"></span>
          <div class="bloom tiny"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>
        </div>
      </div>
    </div>

    <button id="flowerNextBtn" class="primary-btn"><span>Buka kartunya</span><span>→</span></button>
    <div class="micro-copy">tiap tangkai mewakili satu doa baik ✦</div>
  </div>
</section>

<section id="final" class="screen">
  <div class="celebrate-aura"></div>
  <div class="final-inner">
    <div class="final-cake">🎂</div>
    <div class="eyebrow">WISH GRANTED</div>
    <h2>Happy Birthday,<br><em id="nameFinal">you</em> ♡</h2>
    <p>Semoga semua doa baikmu<br>menemukan jalannya.</p>

    <div class="secret-card" id="secretCard">
      <p class="secret-message" id="secretMessage">Pesan kecil yang nggak selalu sempat aku bilang langsung: aku bersyukur kamu ada, dan aku ikut senang setiap kali harimu baik. ♡</p>
      <canvas id="scratchCanvas" class="scratch-canvas"></canvas>
      <div class="secret-hint" id="secretHint">gores kotaknya buat baca pesan rahasia ✦</div>
    </div>

    <div class="final-actions">
      <div class="share-row" role="group" aria-label="Bagikan">
        <button id="waShareBtn" class="icon-btn share-icon" aria-label="Bagikan ke WhatsApp">💬</button>
        <button id="tgShareBtn" class="icon-btn share-icon" aria-label="Bagikan ke Telegram">✈️</button>
        <button id="copyLinkBtn" class="icon-btn share-icon" aria-label="Salin link">🔗</button>
        <button id="downloadCardBtn" class="icon-btn share-icon" aria-label="Unduh kartu ucapan">⬇️</button>
      </div>
      <button id="againBtn" class="ghost-btn">ulang dari awal ↗</button>
    </div>
  </div>
</section>
</main>

<audio id="background-music" src="./music/monokrom.mp3" preload="auto" loop></audio>
<script src="script.js"></script>
</body>
</html>
