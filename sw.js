/* =========================================================
   SERVICE WORKER — cache offline
   Strategi:
   - HTML (navigasi): network-first, supaya update terbaru selalu
     diprioritaskan kalau online; fallback ke cache kalau offline.
   - Aset lain (css/js/gambar/musik/font): cache-first, supaya
     kunjungan kedua & seterusnya langsung cepat dan tetap jalan
     offline.
   Naikkan CACHE_VERSION setiap kali file di daftar PRECACHE_URLS
   berubah isinya, supaya device lama tidak nyangkut versi basi.
   ========================================================= */
const CACHE_VERSION = "v22";
const CACHE_NAME = `hbd-cache-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./style.css?v=38",
  "./script.js?v=35",
  "./img/hbd1.png?v=4",
  "./img/polaroid-1.jpg",
  "./img/polaroid-2.jpg",
  "./img/polaroid-3.jpg",
  "./img/polaroid-4.jpg",
  "./img/bouquet.webp?v=1",
  "./img/bouquet.png?v=1"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => { /* kalau salah satu aset gagal (mis. belum diupload), jangan gagalkan seluruh install */ })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navigasi (buka/refresh halaman): coba jaringan dulu biar selalu
  // dapat versi terbaru; kalau gagal (offline), pakai cache.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  // JS/CSS: network-first agar perubahan kode cepat sampai ke device lama.
  // Gambar/font/audio tetap cache-first agar pengalaman offline tetap ringan.
  const isCode = req.destination === "script" || req.destination === "style";
  if (isCode) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok && req.url.startsWith(self.location.origin)) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.ok && req.url.startsWith(self.location.origin)) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
