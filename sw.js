const CACHE_PREFIX='pwd-tools-';const CACHE='pwd-tools-bridge-2002-visual-pages-2026-10-18';const SHELL=['./','./index.html','./settings.html','./profile.html','./qc.html','./library.html','./pdf_viewer.html','./app-shell.css','./app-global.css','./concrete-ui-polish.css','./gps-cam-v3.css','./app-shell.js','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./pwd_calculators_converters.html','./pwd_retaining_wall_section_quantity.html','./pwd_route_distance_chainage.html','./pwd_gps_engineering_camera.html','./pwd_mix_batch_assistant.html','./pwd_concrete_mix_design.html','./pwd_bridge_plans.html','./bridge_book_2002.html','./bridge-2002-drawing-audit.js','./bridge_book_2023.html','./bridge-2023-drawing-audit.js','./pwd_rule_book.html','./morth_reader.html','./morth-section-2500.js','./morth-section-2600.js','./morth-section-2611-2612.js','./morth-section-2613-2615.js','./morth-section-2700.js','./morth-section-2800.js','./morth-section-2900.js','./morth-section-3000.js','./morth-section-3100.js','./morth-section-100-300.js','./morth-qc-2610.js','./morth-qc-2700.js','./morth-qc-2800.js','./morth-qc-2900.js','./morth-qc-3000.js','./morth-qc-3100.js','./morth-qc-100-300.js','./red_book_reader.html','./gr_library.html'];
self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(SHELL))
      .then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys
        .filter(k=>(k.startsWith(CACHE_PREFIX)||k.startsWith('pwd-v2-public-fieldtools-'))&&k!==CACHE)
        .map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;

  if(req.mode==='navigate'){
    // Fetch page updates when online; fall back only to cached HTML offline.
    event.respondWith(
      fetch(req)
        .then(async response=>{
          if(response.ok){
            const cache=await caches.open(CACHE);
            await cache.put(req,response.clone());
          }
          return response;
        })
        .catch(async()=>{
          const cached=await caches.match(req);
          if(cached)return cached;
          const fallback=await caches.match('./index.html');
          return fallback||Response.error();
        })
    );
    return;
  }

  // Never return index.html as a JS, CSS, image or manifest response.
  event.respondWith(
    caches.match(req).then(cached=>{
      if(cached)return cached;
      return fetch(req).then(async response=>{
        if(response.ok){
          const cache=await caches.open(CACHE);
          await cache.put(req,response.clone());
        }
        return response;
      });
    })
  );
});
