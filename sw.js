/* PWD Field Engineer Assistant V2: public field tools cache. */
const CACHE_PREFIX='pwd-v2-public-fieldtools-';
const CACHE='pwd-v2-public-fieldtools-2026-09-28-v3';
const SHELL=['./','./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./pwd_calculators_converters.html','./pwd_retaining_wall_section_quantity.html','./pwd_route_distance_chainage.html','./bridge_hydraulic_calculator.html','./pwd_gps_engineering_camera.html','./pwd_mix_batch_assistant.html','./pwd_concrete_mix_design.html'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==location.origin)return;event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response})))});
