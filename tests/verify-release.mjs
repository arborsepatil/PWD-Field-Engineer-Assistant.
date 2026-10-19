/**
 * PWD public PWA release smoke checks.
 * Run: node tests/verify-release.mjs
 * No third-party dependencies or private standards required.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root=path.resolve(import.meta.dirname,'..');
const load=name=>fs.readFileSync(path.join(root,name),'utf8');
const sw=load('sw.js');
new vm.Script(sw,{filename:'sw.js'});
const shell=vm.runInNewContext(sw+'\nSHELL', {self:{addEventListener(){}}});
assert.ok(Array.isArray(shell)&&shell.length>0,'Service worker shell must be populated');
assert.equal(shell.length,new Set(shell).size,'No duplicate pre-cache assets');
for(const item of shell){
  assert.ok(item.startsWith('./'),'Shell paths must be same-origin relative');
  const relative=item.slice(2);
  if(!relative)continue;
  assert.ok(!relative.includes('..'),'No traversal paths in pre-cache');
  assert.ok(fs.existsSync(path.join(root,relative)), 'PWA missing pre-cache asset: '+item);
}

// The offline fallback may serve HTML for navigation only.
// Static scripts, styles and JSON must reject when not cached and offline.
const events={};
let online=false;
const offlineShell={kind:'offline-page'};
const swTestContext={
  URL,
  Response,
  self:{
    location:{origin:'https://test.example'},
    addEventListener(name,handler){events[name]=handler}
  },
  caches:{
    match:async (target,options)=>{
      if(target==='./index.html')return offlineShell;
      if(options?.ignoreSearch&&/\/(?:library|pdf_viewer)\.html\?/.test(target.url||''))return {kind:'cached-offline-reader'};
      return undefined;
    },
    open:async()=>({put:async()=>{}})
  },
  fetch:async request=>{
    if(!online)throw new Error('network offline');
    return {kind:'network-page',ok:true,clone(){return this}};
  }
};
vm.runInNewContext(sw,swTestContext,{filename:'sw.js'});
assert.equal(typeof events.fetch,'function','Fetch handler was not registered');
const exercise=async (mode,filename)=>{
  let result;
  const request={method:'GET',mode,url:'https://test.example/app/'+filename};
  events.fetch({request,respondWith(p){result=p}});
  assert.ok(result instanceof Promise,'Fetch event was not handled');
  return result;
};
const navFallback=await exercise('navigate','offline-page.html');
assert.equal(navFallback.kind,'offline-page','Offline navigation must return cached HTML fallback');
const libraryOffline=await exercise('navigate','library.html?section=ssr');
assert.equal(libraryOffline.kind,'cached-offline-reader','SSR Library query route must open cached page offline');
const pdfOffline=await exercise('navigate','pdf_viewer.html?file=private-catalog-id');
assert.equal(pdfOffline.kind,'cached-offline-reader','Selected PDF viewer query route must open offline');

await assert.rejects(
  exercise('same-origin','uncached-script.js'),
  /network offline/,
  'Offline uncached scripts must NOT receive index HTML'
);
online=true;
const onlineNav=await exercise('navigate','fresh-page.html');
assert.equal(onlineNav.kind,'network-page','Online navigation should fetch an updated page');
process.stdout.write('Service-worker navigation/static fallback isolation passed\n');

const home=load('index.html');
assert.ok(home.includes('rel="manifest"'),'App manifest not linked from home');
assert.ok(home.includes('serviceWorker.register'),'App service worker not registered');
assert.ok(home.includes('id="installHelp"'),'Android installation instructions missing from app');

const manifest=JSON.parse(load('manifest.json'));
assert.equal(manifest.display,'standalone');
assert.ok(manifest.name&&manifest.short_name&&manifest.start_url,'Manifest identity missing');
for(const icon of manifest.icons||[]){
  assert.ok(fs.existsSync(path.join(root,icon.src)), 'Manifest icon missing: '+icon.src);
}
const app=load('app-shell.js');
new vm.Script(app,{filename:'app-shell.js'});
for(const sec of ['2500','2600','2611-2612','2613-2615','2700','2800','2900','3000','3100']){
  assert.ok(app.includes('./morth-section-'+sec+'.js'),'MoRTH reader loader missing '+sec);
}
// MoRTH app-shell extension loader: failure of one source script cannot hide later clauses.
{
 const start=app.indexOf('  // Resilient MoRTH extensions:');
 const end=app.indexOf("  document.getElementById('pwdCalcFab')",start);
 assert.ok(start>=0&&end>start,'MoRTH extension loader not found');
 const loader=app.slice(start,end);
 const execute=(pathname,failedFilename)=>{
   const attempted=[],notices=[];
   const body={
     appendChild(script){
       attempted.push(script.src);
       if(script.src===failedFilename)script.onerror();
       else script.onload();
     },
     prepend(node){notices.push(node)}
   };
   const document={
     body,
     createElement(name){return {nodeName:name,src:'',textContent:'',setAttribute(k,v){this[k]=v}}},
     querySelector(name){return name==='main'?{prepend(node){notices.push(node)}}:null}
   };
   vm.runInNewContext(loader,{location:{pathname},document});
   return {attempted,notices};
 };
 const readerFiles=['2500','2600','2611-2612','2613-2615','2700','2800','2900','3000','3100','100-300']
   .map(section=>'./morth-section-'+section+'.js');
 for(const [pathname,files,bad] of [
   ['/morth_reader.html',readerFiles,'./morth-section-2600.js']
 ]){
   const ok=execute(pathname,null);
   assert.deepEqual(ok.attempted,files,'Unexpected '+pathname+' load order');
   assert.equal(ok.notices.length,0,'False loading warning '+pathname);
   const degraded=execute(pathname,bad);
   assert.deepEqual(degraded.attempted,files,'A failed '+bad+' blocked later modules');
   assert.equal(degraded.notices.length,1,'Load failure must display a notice');
   assert.ok(degraded.notices[0].textContent.includes(bad.slice(2)),'Warning lacks failed asset name');
 }
 const unrelated=execute('/index.html',null);
 assert.equal(unrelated.attempted.length,0,'MoRTH scripts loaded on non-MoRTH page');
}
process.stdout.write('MoRTH reader graceful extension loading passed\n');

for(const f of fs.readdirSync(root).filter(x=>x.endsWith('.js'))){
  new vm.Script(load(f),{filename:f});
}
const expected={
  '2800':{count:15,clause:'2815'},
  '2900':{count:11,clause:'2910'},
  '3000':{count:5,clause:'3005'},
  '3100':{count:10,clause:'3109'}
};
for(const [section,test] of Object.entries(expected)){
  const file='morth-section-'+section+'.js';
  const records=[];
  let renders=0;
  const document={getElementById(){return null},querySelector(){return null}};
  const state={RECORDS:records,renderTree(){renders++},document,location:{search:'?clause='+test.clause},URLSearchParams,selected:-1};
  vm.runInNewContext(load(file),state,{filename:file});
  assert.equal(records.length,test.count,file+': unexpected record count');
  assert.equal(new Set(records.map(x=>x.clause)).size,test.count,file+': duplicate clauses');
  assert.equal(records[state.selected].clause,test.clause,file+': deep link failed');
  for(const record of records){
    assert.equal(record.section,section,file+': section mismatch');
    assert.ok(['partial','checked','verified','index'].includes(record.status),file+': unknown source status');
    for(const tbl of record.tables||[]){
      assert.ok(tbl.headers?.length>0,file+': missing table headers');
      for(const row of tbl.rows){
        assert.equal(row.length,tbl.headers.length,file+': malformed QC row in '+record.clause);
        assert.ok(row.every(cell=>typeof cell==='string'&&cell.trim().length>0),file+': blank QC cell');
      }
    }
  }
  vm.runInNewContext(load(file),state,{filename:file});
  assert.equal(records.length,test.count,file+': duplicate append on reloading');
  assert.equal(renders,1,file+': unnecessary second render');
  process.stdout.write(section+': '+records.length+' records verified\n');
}

// Verify every literal same-directory resource link in the public HTML pages.
// This catches links that look fine online but silently fail after PWA install.
const offlineSet=new Set(shell.map(entry=>entry.replace(/^\.\/?/,'')).filter(Boolean));
let checkedHtml=0, checkedLinks=0;
for(const htmlFile of fs.readdirSync(root).filter(name=>name.endsWith('.html'))){
  const htmlText=load(htmlFile);
  checkedHtml++;
  const attr=/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  for(const match of htmlText.matchAll(attr)){
    const raw=match[2].trim();
    if(!raw||/^(?:#|https?:|data:|blob:|mailto:|tel:|javascript:|\/\/)/i.test(raw))continue;
    // Generated HTML inside JS templates is checked by the module tests below.
    if(/['\x60$<>{}]/.test(raw))continue;
    const local=raw.split(/[?#]/)[0].replace(/^\.\//,'');
    if(!/\.(?:html|js|css|png|jpg|jpeg|webp|svg|json)$/i.test(local))continue;
    assert.ok(!local.startsWith('/')&&!local.includes('..'),'Unexpected nonlocal HTML link: '+htmlFile+' -> '+raw);
    assert.ok(fs.existsSync(path.join(root,local)),'Broken HTML resource: '+htmlFile+' -> '+raw);
    assert.ok(offlineSet.has(local),'Linked HTML resource not pre-cached for offline use: '+htmlFile+' -> '+raw);
    checkedLinks++;
  }
}
for(const shortcut of [manifest.start_url,...(manifest.shortcuts||[]).map(item=>item.url)]){
  const local=shortcut.split(/[?#]/)[0].replace(/^\.\//,'');
  assert.ok(fs.existsSync(path.join(root,local)),'PWA shortcut target missing: '+shortcut);
  assert.ok(offlineSet.has(local),'PWA shortcut target not available offline: '+shortcut);
}
process.stdout.write('Offline link audit: '+checkedHtml+' pages, '+checkedLinks+' local references and manifest shortcuts verified\n');

// Integration: successive MoRTH extensions share one reader state. A future
// module must not overwrite an earlier section, break a deep link, or duplicate
// records if its script is loaded again.
const integrated={
  RECORDS:[],selected:-1,renderTree(){},
  document:{getElementById(){return null},querySelector(){return null}},
  location:{search:'?clause=3110'},URLSearchParams
};
const checkedSections=['2800','2900','3000','3100'];
for(const section of checkedSections){
  const file='morth-section-'+section+'.js';
  vm.runInNewContext(load(file),integrated,{filename:file});
}
const expectedTotal=checkedSections.reduce((sum,section)=>sum+expected[section].count,0);
assert.equal(integrated.RECORDS.length,expectedTotal,'Combined reader record count changed');
assert.equal(new Set(integrated.RECORDS.map(r=>r.clause)).size,expectedTotal,'Combined reader has duplicate clause IDs');
assert.equal(integrated.RECORDS[integrated.selected]?.clause,'3110','Deep link to last loaded section failed');
for(const section of checkedSections){
  const file='morth-section-'+section+'.js';
  vm.runInNewContext(load(file),integrated,{filename:file});
}
assert.equal(integrated.RECORDS.length,expectedTotal,'Repeated chained loads must not append duplicates');
process.stdout.write('Integrated MoRTH navigation: '+expectedTotal+' unique records across four sections\n');

process.stdout.write('PWA assets: '+shell.length+' present; manifest/JS/reader/Library checks passed\n');

const basics='morth-section-100-300.js';
assert.ok(app.includes('./'+basics),'MoRTH 100–300 loader missing');
assert.ok(!app.includes("'/qc.html'")&&!app.includes('pwdGuideFab'),'Retired QC and Guide modules must not load');
for(const [sec,clause,expectedCount] of [['100','121',21],['200','202',2],['300','314',14]]){
 const state={RECORDS:[],selected:-1,location:{search:'?clause='+clause},URLSearchParams,document:{getElementById(){return null}}};
 let count=0;state.renderTree=()=>count++;
 vm.runInNewContext(load(basics),state,{filename:basics});
 assert.equal(state.RECORDS.length,37,'Missing MoRTH 100–300 clauses');
 assert.equal(state.RECORDS.filter(r=>r.section===sec).length,expectedCount,'Incorrect section '+sec);
 assert.equal(state.RECORDS[state.selected].clause,clause,'Deep link '+clause+' failed');
 for(const r of state.RECORDS){assert.equal(r.status,'partial');for(const t of r.tables){assert.ok(t.rows.every(row=>row.length===t.headers.length))}}
 vm.runInNewContext(load(basics),state,{filename:basics});
 assert.equal(state.RECORDS.length,37,'Duplicate MoRTH 100–300 load');
 assert.equal(count,1,'Duplicate reader render');
}
assert.ok(shell.includes('./morth-section-100-300.js'),'Missing offline MoRTH 100–300 reader');
process.stdout.write('MoRTH 100–300: 37 source-limited QC entries passed\n');


// Published earthwork QC differentiation: lab eligibility is not field compaction.
{
 const s={RECORDS:[],selected:-1,document:{getElementById(){return null}},renderTree(){},location:{search:'?clause=305'},URLSearchParams};
 vm.runInNewContext(load('morth-section-100-300.js'),s);
 const pick=x=>s.RECORDS.find(r=>r.clause===x);
 for(const [id,n] of [['301',2],['304',2],['305',4],['309',2]]){
   const r=pick(id);
   assert.equal(r?.status,'partial','Source status mismatch '+id);
   assert.ok(r.tables.length>=n,'Missing published QC references '+id);
   for(const t of r.tables)for(const row of t.rows){
     assert.equal(row.length,t.headers.length,'Bad QC columns '+id);
     assert.ok(row.every(x=>typeof x==='string'&&x.length),'Empty QC cell '+id);
   }
 }
 const lab=pick('305').tables.find(t=>t.name.includes('300-1'));
 const field=pick('305').tables.find(t=>t.name.includes('300-2'));
 assert.ok(lab&&field,'Separate laboratory and field acceptance tables required');
 for(const n of ['15.2','16.0','17.5'])assert.ok(lab.rows.some(r=>r.join(' ').includes(n)),'Missing lab criterion '+n);
 for(const n of ['97%','95%'])assert.ok(field.rows.some(r=>r.join(' ').includes(n)),'Missing field criterion '+n);
 assert.ok(pick('304').tables.some(t=>t.rows.some(r=>r.join(' ').includes('m²'))),'Rock foundation area missing');
 assert.ok(pick('309').tables.some(t=>t.rows.some(r=>r.join(' ').includes('Running metres'))),'Drain measurement missing');
}
process.stdout.write('MoRTH 301/304/305/309 extended source QC and unit checks passed\n');

// General survey, site documentation, measurement and clearance-source regression checks.
{
 const state={RECORDS:[],selected:-1,renderTree(){},document:{getElementById(){return null}},
   location:{search:'?clause=113'},URLSearchParams};
 vm.runInNewContext(load('morth-section-100-300.js'),state);
 for(const clause of ['109','112','113','118','120','121','201','202']){
   const record=state.RECORDS.find(r=>r.clause===clause);
   assert.ok(record?.tables.length>=2,'Missing additional documentary QC for '+clause);
   for(const table of record.tables){
     for(const row of table.rows){
       assert.equal(row.length,table.headers.length,'Malformed QC row '+clause);
       assert.ok(row.every(value=>typeof value==='string'&&value.trim()),'Empty QC cell '+clause);
     }
   }
 }
 const entry=clause=>JSON.stringify(state.RECORDS.find(r=>r.clause===clause));
 for(const [clause,keyword] of [['109','monthly'],['113','0.01 m²'],['118','Written Engineer approval'],['120','incidental'],['121','monthly'],['201','hectares'],['202','item-specific']]){
   assert.ok(entry(clause).includes(keyword),'Missing source detail '+clause+' / '+keyword);
 }
}
process.stdout.write('MoRTH 100–200 detailed field record regression checks passed\n');



// Reviewable Section 300 documentary extensions: no unexpected units or blank cells.
{
 const state={RECORDS:[],selected:-1,renderTree(){},document:{getElementById(){return null}},
   location:{search:'?clause=314'},URLSearchParams};
 vm.runInNewContext(load('morth-section-100-300.js'),state);
 const targets=['306','307','308','310','311','312','313','314'];
 assert.equal(state.RECORDS.length,37,'Section 100–300 count regressed');
 for(const clause of targets){
   const record=state.RECORDS.find(r=>r.clause===clause);
   assert.ok(record?.tables.length>=2,'Missing Section 300 documentary records '+clause);
   for(const table of record.tables)for(const row of table.rows){
     assert.equal(row.length,table.headers.length,'Malformed row in '+clause);
     assert.ok(row.every(v=>typeof v==='string'&&v.trim()),'Blank QC detail '+clause);
   }
 }
 const entry=clause=>JSON.stringify(state.RECORDS.find(r=>r.clause===clause));
 for(const [clause,phrase] of [
   ['306','BOQ'],['307','Square metres'],['308','2%–12%'],
   ['310','incidental'],['311','Incidental'],['312','no extra payment'],
   ['313','average-end-area'],['314','Geotechnical']
 ]){
   assert.ok(entry(clause).toLowerCase().includes(phrase.toLowerCase()),'Missing published source control '+clause);
 }
}
process.stdout.write('MoRTH 306–314 documentary, measurement and specialist review checks passed\n');


// General 101–119 source traceability; no fabricated acceptance or payment rule.
{
 const s={RECORDS:[],selected:-1,renderTree(){},document:{getElementById(){return null}},
   location:{search:'?clause=107'},URLSearchParams};
 vm.runInNewContext(load('morth-section-100-300.js'),s);
 const clauses=['101','102','103','104','105','106','107','108','110','111','114','115','116','117','119'];
 assert.equal(s.RECORDS.length,37,'Original Section 100–300 clause count must remain fixed');
 assert.equal(new Set(s.RECORDS.map(x=>x.clause)).size,37,'Duplicate clause during general QC integration');
 for(const clause of clauses){
   const item=s.RECORDS.find(x=>x.clause===clause);
   assert.ok(item?.tables.length>=2,'General documentary source table missing '+clause);
   for(const table of item.tables){
     assert.ok(table.headers.length>=2,'Missing General QC headings '+clause);
     for(const row of table.rows){
       assert.equal(row.length,table.headers.length,'Malformed General QC row '+clause);
       assert.ok(row.every(v=>typeof v==='string'&&v.trim()),'Blank General QC value '+clause);
     }
   }
 }
 const content=clause=>JSON.stringify(s.RECORDS.find(x=>x.clause===clause));
 for(const [clause,value] of [['101','60 days'],['104','IS:460'],['107','45-day'],
   ['115','28-day'],['116','4.75'],['119','Engineer']]){
   assert.ok(content(clause).includes(value),'Missing source-controlled record '+clause);
 }
}
process.stdout.write('MoRTH General 101–119: source-linked QC extension passed\n');

// Retired modules stay removed from home, install shortcuts and offline assets.
{
 const removed=['pwd_gps_engineering_camera.html','pwd_route_distance_chainage.html','qc.html',
   'bridge_hydraulic_calculator.html','pwd_structure.html','pwd_guide.html'];
 for(const filename of removed){
   assert.ok(!fs.existsSync(path.join(root,filename)),'Removed module remains deployed: '+filename);
   assert.ok(!shell.includes('./'+filename),'Removed module still cached: '+filename);
   assert.ok(!home.includes('href="./'+filename+'"'),'Home links to removed module: '+filename);
 }
 for(const item of manifest.shortcuts||[]){
   assert.ok(!/(gps|route|qc|structure|hydro|guide)/i.test(item.name+' '+item.url),'Removed shortcut still in manifest');
 }
 assert.ok(!app.includes('openGuide')&&!app.includes('pwdGuideFab'),'Shared Guide still active');
 assert.ok(!app.includes("'/qc.html'"),'Shared QC module still loads');
 for(const id of ['gpscam','route','qc']){
   assert.ok(!home.includes('data-tool-id="'+id+'"'),'Removed tool displayed: '+id);
 }
 assert.ok(!home.includes('id="guideCard"'),'Guide card still displayed');
 assert.ok(!shell.some(x=>x.startsWith('./morth-qc-')),'QC module cache still shipped');
 const source=load('library-drive-catalog.js'),context={window:{}};
 vm.runInNewContext(source,context,{filename:'library-drive-catalog.js'});
 const catalog=context.window.PWDDrivePDFCatalog;
 assert.equal(catalog.length,73,'Curated original PDF Library count changed');
 const expected={code:59,spec:4,ssr:4,bridge:2,design:2,rules:2};
 for(const [k,n] of Object.entries(expected))assert.equal(catalog.filter(x=>x.section===k).length,n,'Missing PDF section '+k);
 assert.equal(catalog.filter(x=>x.sub==='IS').length,17,'Missing IS codes');
 assert.equal(catalog.filter(x=>x.sub==='IRC').length,41,'Missing IRC codes');
 assert.equal(new Set(catalog.map(x=>x.id)).size,catalog.length,'Duplicate Drive source ID');
 assert.ok(catalog.every(x=>/^[A-Za-z0-9_-]{15,}$/.test(x.id)&&x.name&&x.section),'Malformed Drive PDF reference');
 assert.ok(!catalog.some(x=>/bridge.*2018|2018.*bridge/i.test(x.name)),'Unavailable Bridge Book included');
 const lib=load('library.html');
 assert.ok(lib.includes('./library-drive-catalog.js')&&lib.includes('get("libSearch")')===false,'Drive PDF catalog wiring missing');
 assert.ok(lib.includes('gr_library.html'),'GR reader must remain available');
 assert.ok(shell.includes('./library-drive-catalog.js'),'Drive PDF catalogue missing from offline cache');
 assert.ok(!shell.some(x=>/\.pdf$/i.test(x)),'Private PDF cached by public app');
 process.stdout.write('Removed modules and 73 authenticated Drive PDF references verified\n');
}
const driveCatalog=(()=>{
 const context={window:{}};
 vm.runInNewContext(load('library-drive-catalog.js'),context,{filename:'library-drive-catalog.js'});
 return context.window.PWDDrivePDFCatalog;
})();

// Only source-available bridge books are published, and the retired hydraulic tool stays removed.
{
 const gateway=load('pwd_bridge_plans.html');
 const library=load('library.html');
 const home=load('index.html');
 const guide=load('app-shell.js');
 for(const year of ['2002','2023']){
   const page='bridge_book_'+year+'.html';
   assert.ok(shell.includes('./'+page),'Book missing from offline cache '+page);
   assert.ok(gateway.includes('./'+page),'Gateway missing '+page);
   assert.ok(driveCatalog.some(x=>x.reader==='./'+page),'Drive Library missing '+page);
   const content=load(page);
   assert.ok(content.includes(year+' Bridge'),'Wrong book identity '+page);
   assert.ok(content.includes('</html>'),'Malformed bridge page '+page);
   assert.ok(content.includes('DRAWING QA PENDING'),'Actual drawing incorrectly marked verified');
   assert.ok(content.includes('Actual drawing PDF page'),'Unverified actual page must be disclosed');
   assert.ok(content.includes('not digitized'),'Drawing details falsely digitized');
   assert.ok(content.includes("r.pub!=='"+year+"'"),'Book must reject cross-edition entries');
   assert.ok(content.includes('./pdf_viewer.html?doc=bridge'+year),'Original private PDF link missing');
   new vm.Script(content.match(/<script>([\s\S]*?)<\/script>/)[1],{filename:page});
 }
 const y2002=load('bridge_book_2002.html');
 const y2023=load('bridge_book_2023.html');
 assert.ok(!y2002.includes('bridge2023')&&!y2023.includes('bridge2002'),'Cross-edition PDF link');
 assert.ok(!y2002.includes("add({pub:'2023'")&&!y2023.includes("add({pub:'2002'"),'Cross-edition source data');
 assert.ok(!fs.existsSync(path.join(root,'bridge_book_2018.html')),'Missing-source book must not be deployed');
 assert.ok(!gateway.includes('2018')&&!library.includes('2018')&&!home.includes('2018'),'Missing-source 2018 book is still visible');
 for(const old of ['bridge_book_2018.html','bridge_hydraulic_calculator.html','bridge-hydro-ui.css']){
   assert.ok(!shell.includes('./'+old),'Removed module still in cache: '+old);
   assert.ok(!fs.existsSync(path.join(root,old)),'Removed module still published: '+old);
 }
 for(const body of [gateway,library,home,guide,y2023,load('README.md')]){
   assert.ok(!body.includes('Bridge Hydro')&&!body.includes('bridge_hydraulic_calculator.html'),'Bridge Hydro still discoverable');
 }
 assert.ok(home.includes('removedToolIds')&&home.includes('bridgehydro'),'Recent tools can revive retired modules');
 const pdf=load('pdf_viewer.html');
 assert.ok(pdf.includes('enableBridgeFingerGestures(onPageSwipe,onGestureIdle)'),'Finger gestures missing in PDF viewer');
 assert.ok(pdf.includes("key==='bridge2002'||key==='bridge2023'"),'Gestures not limited to bridge books');
 assert.ok(pdf.includes("touch-action:none"),'Touch zoom/pan surface not configured');
 assert.ok(pdf.includes("pointerdown")&&pdf.includes("pointermove")&&pdf.includes("pointerup"),'Pointer gesture handlers missing');
 assert.ok(pdf.includes('session.scale*distance('),'Two-finger scale not implemented');
 assert.ok(pdf.includes('state.x=c.x-session.anchorX*state.scale'),'Pinch centre stability missing');
 assert.ok(pdf.includes('drag to move'),'Drag guidance missing');


 // 2002 book is a scan: independently inspected title blocks, no OCR-derived source claims.
 assert.ok(shell.includes('./bridge-2002-drawing-audit.js'),'2002 verified sheet metadata must be offline');
 const oldAuditSrc=load('bridge-2002-drawing-audit.js');
 const oldAuditCtx={window:{}};
 vm.runInNewContext(oldAuditSrc,oldAuditCtx,{filename:'bridge-2002-drawing-audit.js'});
 const oldAudit=oldAuditCtx.window.PWDBridge2002SourceAudit;
 assert.equal(oldAudit.originalPdfPages,91,'2002 original PDF length mismatch');
 assert.equal(oldAudit.originalPdfHasTextLayer,false,'2002 is scanned; do not imply searchable original');
 assert.equal(Object.keys(oldAudit.bySerial).length,70,'2002 scanned numbered drawing index must include 001–070');
 for(let n=1;n<=34;n++){
   const serial=String(n).padStart(3,'0');
   const r=oldAudit.bySerial[serial];
   assert.ok(r,'2002 serial missing '+serial);
   assert.equal(r.pdfPages.length,1,'Unexpected multi-sheet drawing '+serial);
   assert.equal(r.pdfPages[0],n+6,'2002 scanned drawing PDF page mismatch '+serial);
 }
 for(const [serial,pages] of [['035',[42]],['036',[43,44]],['037',[45,46]],['038',[47,48]]]){
   const rec=oldAudit.bySerial[serial];
   assert.ok(rec&&JSON.stringify(rec.pdfPages)===JSON.stringify(pages),'2002 scanned box sheet mapping mismatch '+serial);
 }
 for(const serial of ['036','037','038'])
   assert.equal(oldAudit.bySerial[serial].sheetParts.length,2,'Both 2002 box cell sheets required '+serial);
 // Source scan page mapping after visually inspecting title blocks for substructure, raft, misc and arches.
 for(let n=39;n<=70;n++){
   const serial=String(n).padStart(3,'0');
   const a=oldAudit.bySerial[serial];
   assert.ok(a,'2002 numbered drawing missing '+serial);
   const expectedPage=n<=58?n+11:n<=62?n+12:n<=66?n+13:n+14;
   assert.equal(a.pdfPages.length,1,'Unexpected extra drawing sheets '+serial);
   assert.equal(a.pdfPages[0],expectedPage,'2002 scanned title block page mismatch '+serial);
   assert.ok(a.sheetNumber.includes('2002-'),'2002 actual drawing title number missing '+serial);
 }
 const sixVariants=['053','058','059','060','061','062'];
 const variants=Object.entries(oldAudit.bySerial).filter(([_,x])=>x.status==='INDEX_VS_SCAN_NUMBER_FORMAT_VARIANT');
 assert.equal(variants.length,6,'Six visually identified title-block leading-zero differences required');
 for(const serial of sixVariants){
   const a=oldAudit.bySerial[serial];
   assert.equal(a.status,'INDEX_VS_SCAN_NUMBER_FORMAT_VARIANT','Unflagged source-format difference '+serial);
   assert.ok(a.issue?.includes('leading-zero'),'Missing exact scanned-number difference '+serial);
 }
 assert.deepEqual(Array.from(oldAudit.additionalNonIndexedScanPages),[85,86,87,88,89,90,91],
    'Supplemental unindexed scan sheets must not be assigned fabricated drawing serials');
 // Visual comparison: the 2002 index and the scanned title block sometimes use different words.
 const titleVariants=['047','048','049','053','060','061','062'];
 assert.equal(oldAudit.indexVsSheetTitleDifferences.length,7,'Seven source title discrepancies must remain');
 for(const id of titleVariants){
   const r=oldAudit.bySerial[id],compare=r.titleComparison;
   assert.ok(compare&&compare.status==='INDEX_SHEET_TITLE_WORDING_DIFFERS','Missing title mismatch '+id);
   assert.ok(compare.indexTitle&&compare.scannedSheetTitle&&compare.explanation,'Missing source title evidence '+id);
   assert.equal(compare.pdfPage,r.pdfPages[0],'Incorrect source PDF page for title mismatch '+id);
 }
 assert.ok(!oldAudit.bySerial['057'].titleComparison,'No fabricated title mismatch on 057');
 const oldBookBody=load('bridge_book_2002.html');
 const recordsSource=oldBookBody.slice(oldBookBody.indexOf('const $=id=>document.getElementById'),oldBookBody.indexOf('const sourceAudit=window.PWDBridge2002SourceAudit'));
 const recordCtx={document:{getElementById(){return null}}};
 const all2002=vm.runInNewContext(recordsSource+String.fromCharCode(10)+'RECORDS',recordCtx);
 assert.equal(all2002.length,70,'2002 app index must have exactly 70 original numbered drawings');
 assert.equal(new Set(all2002.map(x=>x.sr)).size,70,'2002 duplicate serial in app index');
 for(let n=39;n<=70;n++){
   const serial=String(n).padStart(3,'0'),r=all2002.find(x=>x.sr===serial);
   assert.ok(r&&r.pub==='2002','2002 source-only entry missing '+serial);
   assert.equal(r.no,(n<=62?'BR-NGP':'BR-II')+'/2002-'+serial,'2002 source index code mismatch '+serial);
   assert.equal(r.indexPdfPage,3,'Original 2002 index source-page mismatch '+serial);
 }
 for(const [section,count] of [['A',34],['E',4],['B',20],['F',4],['G',4],['H',4]]){
   assert.equal(all2002.filter(x=>x.section===section).length,count,'2002 book category count wrong: '+section);
 }
 assert.ok(oldBookBody.includes('INDEX / SHEET NUMBER FORMATTING DIFFERS'),'Scanned titleblock/index differences not shown');
 assert.ok(oldBookBody.includes('Index title versus original scanned sheet title'),'Title difference panel missing');
 assert.ok(oldBookBody.includes('titleComparison.scannedSheetTitle'),'Actual scanned sheet title not displayed');
 
 const oldBook=load('bridge_book_2002.html');
 assert.ok(oldBook.includes('bridge-2002-drawing-audit.js'),'2002 source metadata script not linked');
 assert.ok(oldBook.includes('sourceAudit[r.sr]'),'2002 per-record source mapping unused');
 assert.ok(oldBook.includes('View original '),'2002 original page links missing');
 assert.ok(oldBook.includes('not digitized'),'2002 graphical detail must remain undigitized');

 const auditSrc=load('bridge-2023-drawing-audit.js');
 assert.ok(shell.includes('./bridge-2023-drawing-audit.js'),'Original PDF page map not available offline');
 const auditCtx={window:{}};
 vm.runInNewContext(auditSrc,auditCtx,{filename:'bridge-2023-drawing-audit.js'});
 const audit=auditCtx.window.PWDBridge2023SourceAudit;
 assert.equal(audit.publication,'2023 Part 2');
 assert.equal(audit.totalPdfPages,221);
 assert.equal(audit.indexedRecords,175);
 assert.equal(audit.additionalUnnumberedIndexEntries,1);
 assert.equal(Object.keys(audit.bySerial).length,176);
 assert.equal(Object.values(audit.bySerial).filter(x=>x.status==='NUMBER_FOUND_IN_PDF_TEXT').length,170);
 assert.equal(Object.values(audit.bySerial).filter(x=>x.status!=='NUMBER_FOUND_IN_PDF_TEXT').length,6);
 for(const [serial,pdfPage,printed] of [['001',21,3],['002',23,5],['062',85,67],['111',137,119],['121',151,133],['174',218,200],['175',219,201]]){
   const a=audit.bySerial[serial];
   assert.ok(a,'Missing audited drawing '+serial);
   assert.equal(a.pdfPage,pdfPage,'Incorrect actual PDF page '+serial);
   assert.equal(a.printed,printed,'Incorrect printed sheet footer '+serial);
   assert.equal(a.pdfPage-a.printed,18,'2023 preliminary page offset wrong');
 }
 for(const serial of ['017','018','111','121','174','UNNUMBERED-RAFT-147']){
   assert.ok(audit.bySerial[serial].status!=='NUMBER_FOUND_IN_PDF_TEXT','Source discrepancy hidden for '+serial);
   assert.ok(audit.bySerial[serial].issue,'Missing discrepancy explanation '+serial);
 }
 const bookJs=load('bridge_book_2023.html');
 assert.ok(bookJs.includes('bridge-2023-drawing-audit.js'),'2023 mapping not loaded');
 assert.ok(bookJs.includes("String(sr).padStart(2,'0')"),'Published 02–09 drawing codes need leading zeros');
 assert.ok(bookJs.includes('UNNUMBERED-RAFT-147'),'Missing unnumbered raft index entry');
 assert.ok(bookJs.includes('sourceAudit[r.sr]'),'Per-drawing page mapping not connected');
 assert.ok(bookJs.includes('DRAWING NUMBER DISCREPANCY'),'Actual sheet-number differences must be visible');
 assert.ok(bookJs.includes('View original drawing · PDF p.'),'Verified page deeplink missing');
 assert.ok(bookJs.includes('Original DWG comparison'),'DWG presence may not be implied');

 assert.ok(!pdf.includes('id="zoomIn"')&&!pdf.includes('id="zoomOut"'),'Zoom buttons must not appear');
 new vm.Script(pdf.match(/<script>([\s\S]*?)<\/script>/)[1],{filename:'pdf_viewer.html'});

 // Exercise finger gestures against a mocked 300×500 viewport; no browser gesture buttons.
 const surfaceListeners={};
 const surface={
   addEventListener(name,listener){surfaceListeners[name]=listener},
   setPointerCapture(){},
   getBoundingClientRect(){return {left:0,top:0,width:300,height:500}}
 };
 const target={style:{},addEventListener(){},src:''};
 const canvasLayer={hidden:true,style:{},getBoundingClientRect(){return {width:300,height:500}}};
 const viewer={classList:{modes:[],add(name){this.modes.push(name)}}};
 const back={href:'./library.html'};
 const status={textContent:''},indicator={textContent:'',classList:{added:[],add(v){this.added.push(v)}}};
 const hint={textContent:''};
 const els={
   viewer,gestureSurface:surface,frame:target,canvasLayer,drawingCanvas:{style:{}},
   fallback:{classList:{add(){},remove(){}}},
   privateBar:{classList:{add(){}}},pdfPageIndicator:indicator,gestureHint:hint,
   docTitle:{textContent:''},docMeta:{textContent:''},driveBtn:{href:''},fallbackBtn:{href:''},
   privatePdfStatus:status
 };
 let localControls=null,replacedPath='',renderedPage=null,canvasReady=false,canvasCallback=null;
 const ctx={
   URLSearchParams,location:{search:'?doc=bridge2023&page=17',pathname:'/pdf_viewer.html'},setTimeout(){},
   history:{replaceState(_state,_title,url){replacedPath=url}},
   PWDBridgeLocalSource:{setup(args){localControls=args;return {}}},
   PWDBridgeCanvas:{setup(args){canvasCallback=args.onState;return {get ready(){return canvasReady},showPage(pg){renderedPage=pg},rerenderForZoom(){},open(blob,pg){canvasReady=true;renderedPage=pg;args.onState('ready','Rendered from local source');return Promise.resolve(true)},close(){canvasReady=false}}}},

   document:{getElementById(id){return els[id]||null},querySelector(sel){return sel==='.top a'?back:null}},
   frame:target
 };
 const scriptStart=pdf.indexOf('<script>');const pdfScript=pdf.slice(scriptStart+8,pdf.indexOf('</script>',scriptStart));
 vm.runInNewContext(pdfScript,ctx,{filename:'bridge-gesture-behavior'});
 assert.ok(viewer.classList.modes.includes('gesture-mode'),'Bridge viewer gestures not activated');
 assert.equal(back.href,'./bridge_book_2023.html','Bridge source must return to its own book');
 assert.ok(localControls&&localControls.key==='bridge2023','2023 local-source storage not enabled');
 assert.ok(pdf.includes('bridge-local-source.js'),'Private PDF source handler not included');
 assert.ok(els.pdfPageIndicator.textContent.includes('17 / 221'),'Bridge PDF source page indication incorrect');
 assert.ok(els.docMeta.textContent.includes('requested page 17'),'Bridge deep link page status missing');
 assert.ok(shell.includes('./bridge-local-source.js'),'Private PDF helper must work offline');
 const localJS=load('bridge-local-source.js');
 new vm.Script(localJS,{filename:'bridge-local-source.js'});
 for(const required of ['indexedDB.open','page-count match is not proof of drawing identity','file.slice(0,1024)','store.delete(key)','URL.revokeObjectURL']){
    assert.ok(localJS.includes(required),'Private device source validation or removal missing: '+required);
 }
 assert.ok(!shell.includes('PWD_Standard_Plans_Road_Bridges_2002.pdf'),'Do not publish 2002 private scanned original in SW');
 assert.ok(!shell.includes('PWD_Standard_Plans_Road_Bridges_2023_Part2.pdf'),'Do not publish 2023 private original in SW');

 const p=(pointerId,clientX,clientY)=>({pointerId,clientX,clientY,pointerType:'touch',preventDefault(){}});
 surfaceListeners.pointerdown(p(1,100,100));
 surfaceListeners.pointerdown(p(2,200,100));
 surfaceListeners.pointermove(p(2,260,100));
 const transformAfterPinch=target.style.transform;
 const scaled=Number(transformAfterPinch.split('scale(')[1].split(')')[0]);
 assert.ok(scaled>1.5&&scaled<1.7,'Pinch must zoom source preview');
 surfaceListeners.pointerup(p(2,260,100));
 surfaceListeners.pointermove(p(1,60,60));
 assert.notEqual(target.style.transform,transformAfterPinch,'Finger drag must pan zoomed source preview');
 surfaceListeners.pointerup(p(1,60,60));
 surfaceListeners.dblclick({preventDefault(){}});
 const beforeSwipe=target.src;
 surfaceListeners.pointerdown(p(9,220,200));
 surfaceListeners.pointermove(p(9,70,200));
 surfaceListeners.pointerup(p(9,70,200));
 assert.notEqual(target.src,beforeSwipe,'Unzoomed single-finger swipe must advance the PDF page');
 assert.ok(target.src.includes('#page=18'),'Page swipe should request next 2023 original PDF page');
 assert.ok(replacedPath.includes('page=18'),'Page navigation should update shareable deep link');
 await localControls.onSource('blob:https://example.org/private-bridge-pdf',{size:500,arrayBuffer:async()=>new ArrayBuffer(500)});
 assert.equal(renderedPage,18,'Local renderer must open real PDF page 18 (not rely on #page fragment)');
 assert.equal(canvasLayer.hidden,false,'Canvas renderer must be shown after original source loads');
 assert.equal(target.style.display,'none','Native iframe should not overlay real canvas drawing');
 assert.ok(els.pdfPageIndicator.textContent.includes('rendered locally'),'Canvas state must be disclosed in page status');
 await localControls.onSource(null);
 assert.ok(target.src.includes('drive.google.com/file/d/'),
           'Forgetting local original must restore private Google Drive fallback');
 assert.ok(canvasLayer.hidden,'Forget PDF should hide local canvas');
 assert.ok(pdf.includes('bridge-pdf-canvas.js'),'Local page renderer not loaded');
 assert.ok(shell.includes('./bridge-pdf-canvas.js'),'Offline PWA must cache page renderer controller');
 const source=load('bridge-pdf-canvas.js');
 new vm.Script(source,{filename:'bridge-pdf-canvas.js'});
 const fakeCanvas={width:0,height:0,style:{},getContext(){return {}}};
 const fakeLayer={hidden:true,getBoundingClientRect(){return {width:300,height:500}}};
 let pageRequested=[],viewportWidth=[],states=[];
 const pdfProxy={
   numPages:221,
   async getPage(n){
     pageRequested.push(n);
     return {
       getViewport({scale}){return {width:840*scale,height:600*scale}},
       render({viewport}){
         viewportWidth.push(viewport.width);
         return {promise:Promise.resolve(),cancel(){}};
       }
     };
   }
 };
 const pdfJsSandbox={
  window:{
   devicePixelRatio:2,
   pdfjsLib:{
     getDocument({data,isEvalSupported}){
        assert.ok(data instanceof Uint8Array,'Renderer should load device PDF bytes, not remote URL');
        assert.equal(isEvalSupported,false,'PDF dynamic eval must remain disabled');
        return {promise:Promise.resolve(pdfProxy),destroy:async()=>{}};
     }
   }
  },
  Blob,Uint8Array,Math,Promise,Number,Error
 };
 vm.runInNewContext(source,pdfJsSandbox,{filename:'bridge-canvas-behavior.js'});
 const renderer=pdfJsSandbox.window.PWDBridgeCanvas.setup({
    layer:fakeLayer,canvas:fakeCanvas,expectedPages:221,
    onState:(state,message)=>states.push([state,message])
 });
 const fakeBlob={arrayBuffer:async()=>new Uint8Array([37,80,68,70,45]).buffer};
 assert.equal(await renderer.open(fakeBlob,39),true,'Device PDF canvas load must succeed');
 assert.equal(renderer.pageCount,221,'Document page total not read');
 assert.equal(pageRequested.at(-1),39,'Local page renderer ignored direct PDF page link');
 assert.equal(fakeLayer.hidden,false,'Local PDF page not painted');
 assert.ok(fakeCanvas.width>100&&fakeCanvas.width<5000,'Canvas bitmap size malformed');
 assert.ok(fakeCanvas.style.width.endsWith('px'),'PDF page fit-to-screen CSS sizing missing');
 assert.equal(await renderer.showPage(40),true,'Next page must render locally');
 assert.equal(pageRequested.at(-1),40,'Next drawing page not rendered');
 assert.equal(await renderer.rerenderForZoom(3),true,'High-resolution zoom rerender failed');
 assert.ok(viewportWidth.at(-1)>=viewportWidth.at(-2),'Zoom rerender should sharpen the raster');
 assert.ok(fakeCanvas.width*fakeCanvas.height<=12010000,'Android bitmap memory cap exceeded');
 await renderer.close();
 assert.equal(renderer.ready,false,'Clearing private PDF must release document');
 const wrongPdf={...pdfJsSandbox.window.pdfjsLib,
   getDocument(){return {promise:Promise.resolve({...pdfProxy,numPages:90}),destroy:async()=>{}}}};
 pdfJsSandbox.window.pdfjsLib=wrongPdf;
 assert.equal(await renderer.open(fakeBlob,39),false,'Wrong edition PDF must not pass page-count check');
 assert.ok(states.some(x=>x[0]==='error'&&x[1].includes('Page-count mismatch')),
           'Wrong original PDF edition should receive a visible warning');
 assert.equal(renderer.ready,false,'Wrong edition must not remain selected');

 assert.equal(renderer.lastErrorKind,'edition-mismatch','Wrong PDF page count must be a distinct rejection');
 assert.equal(renderer.lastErrorMessage.includes('91')||renderer.lastErrorMessage.includes('221'),true,
              'Wrong-edition warning should state expected original PDF pages');
 assert.ok(source.includes('const painted=await render(currentPage,1)'),
           'Renderer must wait for actual pixels before confirming book page');
 const viewerText=load('pdf_viewer.html');
 assert.ok(viewerText.includes("verification:canvasController.lastErrorKind==='edition-mismatch'?'mismatch':'unverified'"),
           'Wrong-edition PDF must be rejected by on-device storage');
 assert.ok(viewerText.includes('if(canvasActive===updated)return'),
           'Zoomed canvas redraw should not discard active pan and scale');
 // Test local-storage controller independent of PDF.js: wrong edition must never be saved.
 function localSourceScenario(verification){
   const listeners={};const clearListeners={};let created=0,revoked=[],calls=[],stored=0;
   let documentStatus={textContent:'',appendChild(node){this.detail=node.textContent}};
   const file=new Blob(['%PDF-1.7','Fake PDF bytes to check local source acceptance test','X'.repeat(350)],{type:'application/pdf'});
   file.name='Bridge_2023.pdf';
   const input={files:[file],value:'2023',addEventListener(ev,fn){listeners[ev]=fn}};
   const clear={hidden:true,addEventListener(ev,fn){clearListeners[ev]=fn}};
   const docs={privatePdfFile:input,forgetPrivatePdf:clear,privateBar:{classList:{add(){}}},
               privatePdfStatus:documentStatus};
   const sandbox={
    window:{},Blob,Uint8Array,Promise,Date,
    document:{getElementById(id){return docs[id]},createElement(){return {textContent:''}}},
    URL:{createObjectURL(){return 'blob:unit-'+(++created)},revokeObjectURL(id){revoked.push(id)}},
    indexedDB:undefined
   };
   vm.runInNewContext(localJS,sandbox,{filename:'private-source-storage-check'});
   sandbox.window.PWDBridgeLocalSource.setup({
     key:'bridge2023',year:'2023',
     onSource:(url,blob)=>{calls.push([url,!!blob]);return Promise.resolve({
        verification,reason:verification==='mismatch'?'Expected 221 PDF pages; received 91':undefined
     })}
   });
   return {fire:()=>listeners.change(),clear:()=>clearListeners.click(),input,clearButton:clear,
           get status(){return documentStatus.textContent},get calls(){return calls},
           get revoked(){return revoked},get saved(){return stored}};
 }
 const wrongScenario=localSourceScenario('mismatch');
 await wrongScenario.fire();
 assert.equal(wrongScenario.clearButton.hidden,true,'Wrong-edition PDF must never remain selectable');
 assert.ok(wrongScenario.status.includes('Wrong original PDF'),'Wrong book selection must show rejection');
 assert.ok(wrongScenario.calls.length>=2&&wrongScenario.calls.at(-1)[0]===null,
           'Wrong selected PDF must restore Drive fallback');
 assert.equal(wrongScenario.revoked.length,1,'Rejected local PDF URL must be revoked');
 const offlineScenario=localSourceScenario('unverified');
 await offlineScenario.fire();
 assert.ok(offlineScenario.status.includes('page count unconfirmed'),'Offline fallback must not imply source verification');
 assert.equal(offlineScenario.clearButton.hidden,false,'Unverified PDF should be usable for this session');
 const matchScenario=localSourceScenario('matched');
 await matchScenario.fire();
 assert.ok(matchScenario.status.includes('Private PDF open for this session'),
           'Storage failure must not imply the matched local PDF was saved');
 assert.equal(matchScenario.clearButton.hidden,false,'Accepted private PDF must be removable');

 

}
process.stdout.write('Bridge available books only, removed Hydro, touch gesture viewer checks passed\\n');


// Complete 100–300 integration regression: order, direct links, current
// selection, and all 37 records, not just the final clause in each section.
{
 const sectionModule=load('morth-section-100-300.js');
 const expectedSections=new Map([['100',21],['200',2],['300',14]]);
 const clausesExpected=[
  ...Array.from({length:21},(_,i)=>String(101+i)),
  '201','202',
  ...Array.from({length:14},(_,i)=>String(301+i))
 ];
 function boot(query, priorClause){
   const options=['all','400','500'].map(value=>({value}));
   const filter={
     querySelector(selector){
       const matched=/option\[value="([^"]+)"\]/.exec(selector);
       return matched?options.find(opt=>opt.value===matched[1])||null:null;
     },
     insertBefore(option,target){
       const ix=options.indexOf(target);
       assert.notEqual(ix,-1,'Filter anchor missing');
       options.splice(ix,0,option);
     },
     appendChild(option){options.push(option)}
   };
   const RECORDS=priorClause?[{section:'3100',clause:priorClause,quick:[],tables:[],status:'partial'}]:[];
   let count=0;
   const document={getElementById(id){return id==='sectionFilter'?filter:null},createElement(tag){return {tag}}};
   const state={RECORDS,selected:priorClause?0:-1,document,URLSearchParams,location:{search:query},renderTree(){count++}};
   vm.runInNewContext(sectionModule,state,{filename:'morth-section-100-300.js'});
   assert.equal(count,1,'Reader should refresh exactly once');
   assert.deepEqual(options.map(o=>o.value),['all','100','200','300','400','500'],'Section filters must be in book order');
   assert.deepEqual(RECORDS.slice(0,37).map(r=>r.clause),clausesExpected,'Opening sections must be in source order');
   const group=new Map();
   for(const record of RECORDS.slice(0,37)){
     group.set(record.section,(group.get(record.section)||0)+1);
     assert.equal(record.status,'partial','No clause may claim full technical approval: '+record.clause);
     assert.ok(record.read.includes(record.clause),'Missing clause source reference: '+record.clause);
     assert.ok(record.quick.length>=4,'Missing JE quick checks for '+record.clause);
     assert.ok(record.tables.length>=1,'Missing documentary QC for '+record.clause);
     for(const table of record.tables){
       assert.ok(table.headers.length>=3,'Insufficient QC columns: '+record.clause);
       for(const row of table.rows){
         assert.equal(row.length,table.headers.length,'Column mismatch '+record.clause);
         assert.ok(row.every(value=>typeof value==='string'&&value.trim()),'Blank QC evidence '+record.clause);
       }
     }
   }
   assert.deepEqual(Array.from(group),Array.from(expectedSections),'Counts for 100/200/300 changed');
   vm.runInNewContext(sectionModule,state,{filename:'morth-section-100-300.js'});
   assert.equal(count,1,'Repeated module must not rerender');
   assert.equal(RECORDS.length,priorClause?38:37,'Repeated module must not duplicate clauses');
   return {RECORDS,state,options};
 }
 // The engineer can link to any one of the 37 clauses and retain that selection.
 for(const clause of clausesExpected){
   const {RECORDS,state}=boot('?clause='+clause);
   assert.equal(RECORDS[state.selected]?.clause,clause,'Deep-link broken: '+clause);
 }
 const retained=boot('?clause=3110','3110');
 assert.equal(retained.RECORDS[retained.state.selected]?.clause,'3110','Late loading must not change existing selection');
 const override=boot('?clause=201','3110');
 assert.equal(override.RECORDS[override.state.selected]?.clause,'201','100–300 deep link must win when requested');
 const first=boot('');
 assert.equal(first.RECORDS[first.state.selected]?.clause,'101','Initial reader should select first source clause');
 process.stdout.write('Sections 100–300: all 37 deep links, sorted filters, QC tables and stable selection passed\n');
}


// Unified on-device PDF Library checks: Drive originals are linked, not published.
{
 const lib=load('library.html'), viewer=load('pdf_viewer.html');
 const local=load('library-private-pdf.js');
 new vm.Script(local,{filename:'library-private-pdf.js'});
 assert.ok(shell.includes('./library-private-pdf.js'),'Offline private-PDF controller is missing');
 assert.ok(viewer.includes('./library-drive-catalog.js')&&viewer.includes('./library-private-pdf.js'),
   'Unified viewer must load curated Drive IDs and private attachment handler');
 assert.ok(lib.includes("'./pdf_viewer.html?file='+encodeURIComponent(record.id)"),
   'Library PDFs still leave the app instead of opening the in-app reader');
 assert.ok(lib.includes('Google Drive ↗'),'Explicit external Drive fallback must be retained');
 assert.ok(!shell.some(path=>/\.pdf$/i.test(path)),'Public app must not precache copyrighted original PDFs');
 assert.ok(!home.includes('Game-changer module deliberately held'),'Old SSR placeholder must stay removed');
 assert.ok(home.includes('SSR Master'),'User-retained SSR Master must be visible in app navigation');
 assert.ok(home.includes('Rate engine pending'),'SSR Master must not claim unverified rate/analysis functionality');
 assert.ok(home.includes('library.html?section=ssr'),'SSR source PDFs must be reachable from home');
 assert.equal((home.match(/class="module-card"/g)||[]).length,5,
   'Home must expose five kept navigation sections including SSR Master');
 assert.ok(manifest.shortcuts.some(x=>x.name==='Library'),'Android shortcut missing the Library');
 // Simple-feature polish: inactive preferences removed and controls wired.
 const settings=load('settings.html'), profile=load('profile.html');
 for(const retired of ['guideToggle','offlineToggle','wifiToggle','GPS Cam']){
   assert.ok(!settings.includes(retired),'Inactive or removed Setting still visible: '+retired);
 }
 assert.ok(settings.includes('bindCalculatorToggle()'),'Calculator setting does not initialize');
 assert.ok(settings.includes('PWDUI.syncCalculatorVisibility'),'Settings must update calculator visibility');
 assert.ok(app.includes('function syncCalculatorVisibility()'),'Shared calculator switch missing');
 assert.ok(app.includes("store.getItem('pwd_calc_fab')"),'Floating calculator ignores saved setting');
 assert.ok(!profile.includes('Foundation for quick access'),'Empty favorites placeholder still visible');
 assert.ok(!profile.includes('Downloaded books/drawings will appear'),'Inactive download placeholder still visible');
 assert.ok(profile.includes('SSR Master'),'Profile should acknowledge retained SSR Master');
 assert.ok(home.includes('approvedMap'),'Recent shortcuts should be constrained to approved tools');
 assert.ok(home.includes('toolSearchEmpty'),'Home search lacks an empty-results state');


 // Simulate opening a standard that was not hardcoded in the old PDF viewer.
 const entry=driveCatalog.find(r=>r.sub==='IS'&&r.name.includes('456'));
 assert.ok(entry,'IS 456 expected in curated Drive library');
 const surfaceEvents={};
 const surface={
   addEventListener(name,fn){surfaceEvents[name]=fn},
   setPointerCapture(){},
   getBoundingClientRect(){return {left:0,top:0,width:320,height:550}}
 };
 const viewerModes=new Set();
 const fakeViewer={classList:{
   add(x){viewerModes.add(x)},remove(x){viewerModes.delete(x)},
   toggle(x,enabled){if(enabled)viewerModes.add(x);else viewerModes.delete(x)}
 }};
 const pdfFrame={style:{},src:'',addEventListener(){}};
 const layer={style:{},hidden:true};
 const fallback={classList:{add(){},remove(){}}};
 const back={href:'./library.html'};
 const elements={
   viewer:fakeViewer,gestureSurface:surface,frame:pdfFrame,
   canvasLayer:layer,drawingCanvas:{style:{}},
   privateBar:{classList:{add(){}}},
   gestureHint:{textContent:''},
   pdfPageIndicator:{textContent:'',classList:{add(){}}},
   fallback,
   docTitle:{textContent:''},docMeta:{textContent:''},
   driveBtn:{href:''},fallbackBtn:{href:''}
 };
 let privateConfig=null,rendered=0,changedUrl='';
 const mock={
   window:{PWDDrivePDFCatalog:driveCatalog},
   URLSearchParams,location:{search:'?file='+entry.id,pathname:'/pdf_viewer.html'},
   history:{replaceState(_s,_t,url){changedUrl=url}},setTimeout(){},
   document:{
     title:'',getElementById(id){return elements[id]||null},
     querySelector(sel){return sel==='.top a'?back:null}
   },
   PWDBridgeCanvas:{setup(options){
     let ready=false;
     return {
       get ready(){return ready},
       get pageCount(){return 57},
       open:async(_blob,page)=>{ready=true;rendered=page;options.onState('ready','Loaded');return true},
       showPage(page){rendered=page},
       close:async()=>{ready=false},
       rerenderForZoom(){}
     }
   }},
   PWDLibraryPrivatePDF:{setup(config){privateConfig=config}},
   PWDBridgeLocalSource:{setup(){throw Error('General PDF used bridge-only source')}}
 };
 const begin=viewer.indexOf('<script>'),inline=viewer.slice(begin+8,viewer.indexOf('</script>',begin));
 vm.runInNewContext(inline,mock,{filename:'standard-pdf-viewer'});
 assert.equal(elements.docTitle.textContent,entry.name,'In-app viewer did not find the chosen Drive entry');
 assert.ok(pdfFrame.src.includes(entry.id+'/preview'),'Original Drive PDF is not embedded');
 assert.ok(elements.driveBtn.href.includes(entry.id+'/view'),'Original Drive fallback missing');
 assert.equal(privateConfig?.key,'drive-'+entry.id,'Local copies must be segregated by Drive document ID');
 assert.ok(!viewerModes.has('gesture-mode'),'Online Drive iframe must keep its own touch interactions');
 await privateConfig.onSource('blob:https://example.invalid/standard',new Blob(['%PDF-1.7']));
 assert.ok(viewerModes.has('gesture-mode'),'Local canvas must support finger gestures');
 assert.equal(layer.hidden,false,'Local PDF renderer did not become visible');
 assert.equal(rendered,1,'Default exact PDF page was not rendered');
 const touch=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',preventDefault(){}});
 surfaceEvents.pointerdown(touch(1,240,160));
 surfaceEvents.pointermove(touch(1,70,160));
 surfaceEvents.pointerup(touch(1,70,160));
 assert.equal(rendered,2,'Unzoomed swipe did not render the next standard page');
 assert.ok(changedUrl.includes('page=2'),'Book page swipe must update the reader URL');
 await privateConfig.onSource(null,null);
 assert.ok(!viewerModes.has('gesture-mode'),'Native Drive fallback should restore touch interaction');
 assert.ok(pdfFrame.src.includes(entry.id+'/preview'),'Forgetting device PDF did not return to Drive');

 // A private device attachment is never treated as source identity verification.
 const fakeFile=new Blob(['%PDF-1.7','x'.repeat(300)],{type:'application/pdf'});
 Object.defineProperty(fakeFile,'name',{value:'IS 456 2000.pdf'});
 const handlers={};
 const fileInput={files:[fakeFile],value:'x',addEventListener(k,fn){handlers[k]=fn}};
 const clear={hidden:true,addEventListener(k,fn){handlers['clear-'+k]=fn}};
 const status={textContent:'',appendChild(node){this.note=node.textContent}};
 const dom={privatePdfFile:fileInput,forgetPrivatePdf:clear,privatePdfStatus:status,privateBar:{classList:{add(){}}}};
 let opened=0,revoked=0;
 const sandbox={
   window:{},Blob,Uint8Array,Promise,Date,
   URL:{createObjectURL(){opened++;return 'blob:local-'+opened},revokeObjectURL(){revoked++}},
   document:{
     getElementById(id){return dom[id]},
     createElement(){return {textContent:''}}
   }
 };
 vm.runInNewContext(local,sandbox,{filename:'library-private-pdf-runtime'});
 const source=sandbox.window.PWDLibraryPrivatePDF.setup({
   key:'drive-'+entry.id,
   onSource:async(url)=>{assert.ok(url===null||url.startsWith('blob:local-'))}
 });
 await handlers.change();
 assert.equal(clear.hidden,false,'Locally chosen PDF must be removable');
 assert.ok(status.textContent.includes('session'),'Device storage failure must be disclosed');
 assert.ok(!status.textContent.includes('verified'),'PDF title must not be marked verified');
 await handlers['clear-click']();
 assert.equal(revoked,1,'Forget PDF must revoke the object URL');
 source.dispose();
 process.stdout.write('Unified Drive library PDF viewer, touch paging and device-private attachment checks passed\n');
}

// Offline-first PDF Library mobile quality checks (private bytes never committed).
{
 const library=load('library.html'),offline=load('library-offline.js'),bridge=load('bridge-local-source.js');
 new vm.Script(offline,{filename:'library-offline.js'});
 assert.ok(shell.includes('./library-offline.js'),'Offline Library UI controller not precached');
 assert.ok(library.includes('./library-offline.js'),'Offline Library controller not loaded');
 for(const id of ['bulkImport','offlineOne','offlineMany','prepareOfflineReader','showOfflineOnly','offlineProgress'])
   assert.ok(library.includes('id="'+id+'"'),'Missing mobile offline Library control: '+id);
 for(const action of ['data-offline-save','data-offline-remove','data-offline-export'])
   assert.ok(library.includes(action),'Missing per-book offline action: '+action);
 assert.ok(library.includes("offline.list()"),'Offline Library must show saved books after reload');
 assert.ok(library.includes("offline.save(id,file"),'Single-book import must save locally');
 assert.ok(library.includes("offline.save(record.id,file)"),'Bulk import must save locally');
 assert.ok(library.includes('readerReady'),'Library must check PDF renderer readiness');
 assert.ok(library.includes("offline.requestDurableStorage()"),'Mobile persistent-storage request absent');
 assert.ok(sw.includes("const PDFJS_CACHE='pwd-public-pdfjs-offline-v1'"),'Stable renderer offline cache missing');
 assert.ok(sw.includes("caches.open(PDFJS_CACHE)"),'Service worker does not read persistent renderer assets');
 assert.ok(!shell.some(x=>x.endsWith('.pdf')),'Copyright-controlled original PDF must not ship in app cache');
 for(const id of ['13hCYBiVR-XWToOtVpbS2ZnjvQFz5wWcr','1juIQ-FJLpBsJzh2dKJlFxkixRbsrmEOv'])
   assert.ok(bridge.includes(id),'Bridge PDF must share Library storage: '+id);
 assert.ok(bridge.includes('migratedFromLegacy'),'Existing saved bridge PDFs need migration');
 const sandbox={window:{PWDDrivePDFCatalog:driveCatalog},navigator:{},Blob,Uint8Array,Promise,Date};
 vm.runInNewContext(offline,sandbox,{filename:'offline-pdf-api'});
 const api=sandbox.window.PWDOfflineLibrary;
 assert.ok(api,'Offline private PDF API missing');
 assert.equal(api.normalized('42. IS_456 (2000).pdf'),'is 456 2000');
 assert.equal(api.normalized('PWD_Standard_Plans_Road_Bridges_2002.pdf'),'pwd standard plans road bridges 2002');
 const isCode=driveCatalog.find(x=>x.sub==='IS'&&/IS 456 /.test(x.name));
 assert.ok(api.fileMatch({name:'IS_456_2000.pdf'},isCode),'Filename based exact matching failed');
 assert.equal(api.fileMatch({name:'IRC 78 2014.pdf'},isCode),false,'Cross-publication file matched');
 await api.checkPDF(new Blob(['%PDF-1.7'+'.'.repeat(250)],{type:'application/pdf'}));
 await assert.rejects(api.checkPDF(new Blob(['not-a-pdf'.repeat(25)])),/does not appear to be a PDF/);
 assert.equal(await api.rendererReady(),false,'No browser cache must report PDF renderer not ready');
 process.stdout.write('Offline PDF Library controls, file matching, renderer preparation and bridge shared storage verified\n');
}

// Cache a pinned, publicly distributable PDF.js renderer after successful first use.
// This does not cache any original Drive PDFs or weaken permission requirements.
{
 const pinned='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
 const worker='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
 const allowed=new Set([pinned,worker]),events={};
 const cached=new Map(),fetches=[];
 let connected=true;
 const cache={match:async req=>cached.get(req.url),
              put:async(req,response)=>{cached.set(req.url,response)}};
 const testEnv={
  URL,
  self:{location:{origin:'https://example.test'},addEventListener(k,fn){events[k]=fn}},
  caches:{open:async()=>cache},
  fetch:async req=>{
    fetches.push(req.url);
    if(!connected)throw Error('Network offline');
    return {ok:true,asset:req.url,clone(){return this}};
  }
 };
 vm.runInNewContext(sw,testEnv,{filename:'pdfjs-cache-offline-test'});
 async function asset(url){
   let response;
   const request={method:'GET',url,mode:'cors'};
   events.fetch({request,respondWith(p){response=p}});
   return response?await response:null;
 }
 for(const url of allowed){
   assert.equal((await asset(url)).asset,url,'First online use did not serve pinned PDF.js resource');
   assert.ok(cached.has(url),'PDF.js resource not saved for later offline reading');
 }
 connected=false;
 for(const url of allowed){
   assert.equal((await asset(url)).asset,url,'Saved renderer unavailable when offline');
 }
 assert.equal(fetches.length,2,'Offline PDF.js should not refetch the CDN after caching');
 assert.equal(await asset('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/other.js'),null,
   'Only allowlisted public assets can be intercepted');
 assert.equal(await asset('https://drive.google.com/file/d/private-identifier/preview'),null,
   'Never intercept original Drive PDF requests in public service worker');
 process.stdout.write('PDF.js public CDN runtime cache and private Drive exclusion passed\n');
}
