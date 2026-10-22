(()=>{
  const root=document.documentElement;
  const store=window.localStorage;
  const ACCENTS={blue:'#0b6cff',teal:'#0f9f94',orange:'#e58a00',violet:'#7c4dff',red:'#e34a5f'};
  function applyPrefs(){const mode=store.getItem('pwd_theme')||'system';const dark=mode==='dark'||(mode==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);root.dataset.theme=dark?'dark':'light';root.style.setProperty('--accent',ACCENTS[store.getItem('pwd_accent')]||ACCENTS.blue);root.style.setProperty('--font-scale',store.getItem('pwd_font_scale')||'1');const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?'#07111f':'#f5f8fc'}
  applyPrefs();matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if((store.getItem('pwd_theme')||'system')==='system')applyPrefs()});window.PWDUI={applyPrefs,ACCENTS};
  // Resilient MoRTH extensions: one unavailable script must not block all later sections.
  // Source-backed modules remain isolated; no private PDF is bundled with the PWA.
  function loadMoRTHExtensions(files){
    let nextIndex=0;
    const failed=[];
    function next(){
      if(nextIndex===files.length){
        if(failed.length){
          const notice=document.createElement('p');
          notice.id='morth-extension-warning';
          notice.className='note warn';
          notice.setAttribute('role','alert');
          notice.textContent='Some MoRTH reference modules could not load: '+failed.map(file=>file.slice(2)).join(', ')+'. Check the connection or refresh. Other available sections remain usable.';
          (document.querySelector('main')||document.body).prepend(notice);
        }
        return;
      }
      const file=files[nextIndex++];
      const script=document.createElement('script');
      script.src=file;
      script.onload=next;
      script.onerror=()=>{failed.push(file);next()};
      document.body.appendChild(script);
    }
    next();
  }
  if(location.pathname.endsWith('/morth_reader.html')){
    loadMoRTHExtensions([
      './morth-section-2500.js','./morth-section-2600.js',
      './morth-section-2611-2612.js','./morth-section-2613-2615.js',
      './morth-section-2700.js','./morth-section-2800.js',
      './morth-section-2900.js','./morth-section-3000.js',
      './morth-section-3100.js','./morth-section-100-300.js'
    ]);
  }
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.sheet-backdrop.open').forEach(x=>x.classList.remove('open'))});
})();
