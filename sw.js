const PDFJS_CACHE='pwd-public-pdfjs-offline-v1';const CACHE_PREFIX='pwd-tools-';const CACHE='pwd-tools-retaining-wall-field-sheet-2026-10-19';const SHELL=['./','./index.html','./settings.html','./profile.html','./library.html','./library-drive-catalog.js','./library-offline.js','./pdf_viewer.html','./bridge-local-source.js','./library-private-pdf.js','./bridge-pdf-canvas.js','./app-shell.css','./app-global.css','./concrete-ui-polish.css','./app-shell.js','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./pwd_calculators_converters.html','./pwd-unit-data.js','./pwd_retaining_wall_section_quantity.html','./pwd-retaining-wall-core.js','./pwd_mix_batch_assistant.html','./pwd-batch-core.js','./pwd_concrete_mix_design.html','./pwd_bridge_plans.html','./bridge_book_2002.html','./bridge-2002-drawing-audit.js','./bridge_book_2023.html','./bridge-2023-drawing-audit.js','./pwd_rule_book.html','./morth_reader.html','./morth-section-2500.js','./morth-section-2600.js','./morth-section-2611-2612.js','./morth-section-2613-2615.js','./morth-section-2700.js','./morth-section-2800.js','./morth-section-2900.js','./morth-section-3000.js','./morth-section-3100.js','./morth-section-100-300.js','./red_book_reader.html','./gr_library.html'];
self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(SHELL))
      .then(async()=>{
        // Optional, public PDF.js preload. An offline install still succeeds;
        // users can explicitly retry from Library > Prepare offline reader.
        try{
          const renderer=await caches.open(PDFJS_CACHE);
          await Promise.allSettled([...PDFJS_CDN_ASSETS].map(async(url)=>{
            const request=new Request(url,{mode:'cors',credentials:'omit'});
            if(await renderer.match(request))return;
            const response=await fetch(request);
            if(response.ok&&response.type!=='opaque')await renderer.put(request,response);
          }));
        }catch{}
        await self.skipWaiting();
      })
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
// Only the two version-pinned, public PDF.js assets may enter the app cache.
// No PDF files from the user's Google Drive are ever cached here.
const PDFJS_CDN_ASSETS=new Set([
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
]);
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin){
    if(!PDFJS_CDN_ASSETS.has(url.href))return;
    // Pinned public renderer assets are cached independently from app updates.
    // Originals and Drive preview URLs are never intercepted. Browser support varies.
    event.respondWith((async()=>{
      const cache=await caches.open(PDFJS_CACHE);
      const saved=await cache.match(req);
      if(saved)return saved;
      const response=await fetch(req);
      if(response.ok)await cache.put(req,response.clone());
      return response;
    })());
    return;
  }

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
          // Ignore query only for offline HTML navigation so PDFs selected by
          // ?file=<ID>, ?doc=bridge2023 and Library ?section=ssr use the
          // already installed HTML shell. Private PDF bytes remain in IndexedDB.
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
