// 서비스워커 — 설치 가능 조건 충족 + 정적 자원 캐시(오프라인 대비)
const CACHE = 'hcheck-v1';
const ASSETS = [
  '/', '/index.html', '/styles.css',
  '/app.js', '/nav.js', '/stats.js', '/hospital.js', '/glucose-guide.js',
  '/pwa.js', '/icon.svg', '/manifest.webmanifest'
];

self.addEventListener('install', (e)=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  // API 요청은 서비스워커가 관여하지 않음(항상 네트워크)
  if(url.pathname.startsWith('/api/')) return;
  if(e.request.method !== 'GET') return;

  // 네트워크 우선, 실패하면 캐시 (앱 업데이트가 막히지 않도록)
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
