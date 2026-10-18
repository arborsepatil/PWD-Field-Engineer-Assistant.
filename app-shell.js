(()=>{
  const root=document.documentElement;
  const store=window.localStorage;
  const ACCENTS={blue:'#0b6cff',teal:'#0f9f94',orange:'#e58a00',violet:'#7c4dff',red:'#e34a5f'};
  function applyPrefs(){const mode=store.getItem('pwd_theme')||'system';const dark=mode==='dark'||(mode==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);root.dataset.theme=dark?'dark':'light';root.style.setProperty('--accent',ACCENTS[store.getItem('pwd_accent')]||ACCENTS.blue);root.style.setProperty('--font-scale',store.getItem('pwd_font_scale')||'1');const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?'#07111f':'#f5f8fc'}
  applyPrefs();matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if((store.getItem('pwd_theme')||'system')==='system')applyPrefs()});window.PWDUI={applyPrefs,ACCENTS};
  function recents(){try{return JSON.parse(store.getItem('pwd_recent_tools')||'[]')}catch{return[]}}function track(a){const id=a.dataset.toolId,name=a.dataset.toolName,href=a.getAttribute('href');if(!id||!name||!href)return;let list=recents().filter(x=>x.id!==id);list.unshift({id,name,href,icon:a.dataset.toolIcon||'🛠️'});store.setItem('pwd_recent_tools',JSON.stringify(list.slice(0,8)))}document.addEventListener('click',e=>{const a=e.target.closest('a[data-tool-id]');if(a)track(a)});
  if(!document.querySelector('.fab-stack')&&document.body.dataset.pwdShell!=='off'){const s=document.createElement('div');s.className='fab-stack';s.innerHTML='<button class="fab" id="pwdCalcFab" aria-label="Calculator">🧮</button>';document.body.appendChild(s)}
  function makeSheet(id,title,body){let back=document.getElementById(id);if(back)return back;back=document.createElement('div');back.id=id;back.className='sheet-backdrop';back.innerHTML='<div class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><h3>'+title+'</h3>'+body+'</div>';back.addEventListener('click',e=>{if(e.target===back)back.classList.remove('open')});document.body.appendChild(back);return back}
  let calcExpr='';function renderCalc(){const d=document.getElementById('pwdCalcDisplay');if(d)d.textContent=calcExpr||'0'}function calcPress(k){if(k==='C')calcExpr='';else if(k==='⌫')calcExpr=calcExpr.slice(0,-1);else if(k==='='){try{const clean=calcExpr.replaceAll('×','*').replaceAll('÷','/').replaceAll('−','-').replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');if(!/^[0-9+\-*/().\s]+$/.test(clean))throw 0;const r=Function('"use strict";return ('+clean+')')();if(!Number.isFinite(r))throw 0;calcExpr=String(Number(r.toPrecision(12)))}catch{calcExpr='Error'}}else{if(calcExpr==='Error')calcExpr='';calcExpr+=k}renderCalc()}
  function openCalc(){const keys=['C','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','(',')','='];const buttons=keys.map(k=>'<button data-k="'+k+'" class="'+(k==='='?'eq':/[÷×−+%]/.test(k)?'op':'')+'">'+k+'</button>').join('');const back=makeSheet('pwdCalcSheet','Quick Calculator','<p>Fast arithmetic without leaving the current engineering screen.</p><div id="pwdCalcDisplay" class="calc-display">0</div><div class="calc-keys">'+buttons+'</div>');back.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>calcPress(b.dataset.k));back.classList.add('open');renderCalc()}
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
  document.getElementById('pwdCalcFab')?.addEventListener('click',openCalc);window.PWDUI.openCalc=openCalc;document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.sheet-backdrop.open').forEach(x=>x.classList.remove('open'))});
})();