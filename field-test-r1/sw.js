const CACHE='pwd-tools-field-r1-2026-10-03';
const SHELL=[
'./','./index.html','./manifest.json','./app-shell.css','./app-shell.js','./road-structure.css',
'./pwd_road_structures.html','./pwd_route_distance_chainage.html','./road_structure_guide.html','./road_video_survey.html',
'./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pwd-tools-field-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET') return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin) return;
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
   if(res && res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
   return res;
 }).catch(()=>caches.match('./index.html'))));
});