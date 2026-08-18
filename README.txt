# HappyBirthday V4 — Interactive Upgrade

Semua fitur lama (V3.1) tetap ada dan tidak diubah tampilannya:
surat, wish, kado, tiup lilin, layar akhir, musik latar, dsb.

## Fitur baru di V6 (terbaru)

- **Kado terakhir sekarang bucket bunga** 💐 — setelah lilin ditiup,
  muncul layar baru "Sebuket bunga, khusus buat kamu" berisi bucket
  kraft dengan pita, dikelilingi 7 tangkai bunga gradasi warna
  (pink, magenta, violet, peach, gold) plus daun dan sprig hijau.
  Tiap tangkai mekar bergantian dengan animasi stagger setiap kali
  layar ini dibuka, dan bergoyang pelan terus-menerus. Baru setelah
  itu lanjut ke pesan ulang tahun terakhir.
- Progress dots, keyboard (panah kanan), dan swipe-kiri semuanya
  sudah menghitung langkah baru ini.

## Fitur V5 — perbaikan & tambahan sebelumnya

- **Tombol "Bagikan surat ini" yang lama (sering gagal karena izin
  clipboard/browser) sudah diganti** dengan baris ikon share yang
  lebih andal di layar akhir:
  - 💬 bagikan langsung ke WhatsApp
  - ✈️ bagikan ke Telegram
  - 🔗 salin link (dengan fallback otomatis + notifikasi toast yang
    selalu memberi tahu berhasil/gagal, tidak lagi diam saja)
  - ⬇️ unduh kartu ucapan sebagai gambar PNG (digambar langsung di
    canvas, tidak bergantung layanan luar)
- **Kartu gores rahasia** ("scratch card") di layar akhir — ada pesan
  tersembunyi yang baru muncul kalau digosok/digores dengan jari atau
  mouse.
- **Visualizer musik** — batang kecil di sebelah tombol musik yang
  benar-benar bergerak mengikuti audio yang sedang diputar.

## Fitur V4

1. **Ambient floating hearts** — hati-hati kecil melayang pelan di
   latar belakang sepanjang halaman (otomatis nonaktif kalau user
   mengaktifkan "reduce motion" di OS).
2. **Shooting star** sesekali muncul di langit bintang.
3. **Progress dots** di bawah layar, menandakan sudah sampai tahap mana
   dari 6 langkah cerita.
4. **Countdown ulang tahun** otomatis di layar depan ("X hari lagi
   menuju hari spesialnya", atau "hari ini hari spesialnya ✦" kalau
   pas tanggalnya).
5. **Personalisasi lewat URL**, tanpa edit kode:
   `index.html?to=Nadia&date=2026-10-22`
   — nama & tanggal otomatis dipakai di judul tab, sapaan, dan countdown.
6. **Tilt 3D ringan** saat mouse digerakkan di atas foto dan kado
   (desktop).
7. **Cursor glow** lembut yang mengikuti mouse (desktop saja).
8. **Efek suara mini** (disintesis langsung di browser, tanpa file
   audio tambahan) untuk tap tombol, buka kado, dan tiup lilin.
   Bisa dimatikan lewat ikon 🔔 di pojok kiri atas layar surat.
9. **Kado lebih hidup**: goyang dulu sebelum terbuka + ledakan confetti
   kecil tepat di posisi kado saat baru dibuka.
10. **Navigasi keyboard** (panah kanan / Enter / Spasi untuk lanjut,
    Esc untuk kembali dari surat) dan **swipe ke kiri** di HP untuk
    maju ke langkah berikutnya (di layar surat & wish).
11. **Tombol share** di layar akhir — pakai share sheet HP kalau ada,
    atau menyalin link ke clipboard.

## Struktur file (tetap sinkron)
- index.html
- style.css
- script.js

## Tetap pertahankan folder project lama
- img/hbd1.png
- music/monokrom.mp3

Semua fitur baru murni CSS + JS vanilla, tidak perlu library atau
build tool tambahan — tinggal upload ulang ke GitHub Pages seperti
biasa.
