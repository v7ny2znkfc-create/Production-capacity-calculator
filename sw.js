const CACHE_NAME='production-capacity-v5-5';
const APP_SHELL=['./','./index.html','./config.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  // Supabase data and config should prefer the network so shared master/report values are fresh.
  const networkFirst=(u.hostname.endsWith('.supabase.co')||u.pathname.endsWith('/config.js'));
  if(networkFirst){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match(e.request)));return;}
  e.respondWith(fetch(e.request).then(r=>{const q=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,q));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
