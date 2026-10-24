const CACHE_PREFIX='pwd-tools-';const CACHE='pwd-tools-steel-v47-2026-10-25';const SHELL=['./','./index.html','./settings.html','./profile.html','./library.html','./library-public-catalog.js','./ssr_search.html','./ssr-local-core.js','./app-shell.css','./home-v38.css','./home-v39.css','./civil-calculator-v40.css','./app-global.css','./concrete-ui-polish.css','./app-shell.js','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./pwd_calculators_converters.html','./pwd-unit-data.js','./pwd-calculator-core.js','./pwd-calculator-ui.js','./pwd_retaining_wall_section_quantity.html','./pwd_retaining_walls.html','./pwd_steel_table.html','./pwd-steel-osdag.js','./pwd-steel-osdag-license.html','./pwd-steel-catalog.js','./pwd-steel-core.js','./pwd-steel-compare.js','./pwd-steel-status.js','./pwd-steel-diagram.js','./pwd-steel-app.js','./pwd_pcc_wall_reference.html','./pwd_rcc_wall_reference.html','./rcc-wall-2023-data.js','./rcc-wall-2023-rebar.js','./rcc-wall-2023-section.js','./rcc-wall-2023-app.js','./pwd-retaining-wall-core.js','./pwd-wall-diagrams.js','./pwd_mix_batch_assistant.html','./pwd-batch-core.js','./pwd_concrete_mix_design.html','./pwd_bridge_plans.html','./gr_library.html'];
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
// Shared app has no PDF viewer or user-private document import. Public books
// open as publisher links in the device browser; their bytes are never cached.
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
          // Ignore query for the public HTML shell (e.g. Library filters).
          // This service worker does not cache original publication PDFs.
          const cached=await caches.match(req,{ignoreSearch:true});
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
