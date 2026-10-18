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
    match:async target=>target==='./index.html'?offlineShell:undefined,
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
for(const sec of ['2610','2700','2800','2900','3000','3100']){
  assert.ok(app.includes('./morth-qc-'+sec+'.js'),'QC loader missing '+sec);
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
 const qcFiles=['2610','2700','2800','2900','3000','3100','100-300']
   .map(section=>'./morth-qc-'+section+'.js');
 for(const [pathname,files,bad] of [
   ['/morth_reader.html',readerFiles,'./morth-section-2600.js'],
   ['/qc.html',qcFiles,'./morth-qc-3100.js']
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
// The 100–300 QC digest must remain visible even if the prior QC module fails.
{
 const script=load('morth-qc-100-300.js');
 const added=[];
 const matGrid={insertAdjacentElement(position,node){added.push({position,node})}};
 const document={
   getElementById(id){return id==='matGrid'?matGrid:null},
   createElement(tag){return {tag,id:'',style:{},children:[],appendChild(x){this.children.push(x)}}}
 };
 vm.runInNewContext(script,{location:{pathname:'/qc.html'},document});
 assert.equal(added.length,1,'General QC digest not mounted after preceding-module loss');
 assert.equal(added[0].node.id,'morth-qc-100-300');
}
process.stdout.write('MoRTH graceful extension loading and QC fallback passed\n');

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

process.stdout.write('PWA assets: '+shell.length+' present; manifest/JS/reader/QC checks passed\n');

const basics='morth-section-100-300.js';
assert.ok(app.includes('./'+basics),'MoRTH 100–300 loader missing');
assert.ok(app.includes('./morth-qc-100-300.js'),'MoRTH 100–300 QC loader missing');
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
assert.ok(shell.includes('./morth-section-100-300.js')&&shell.includes('./morth-qc-100-300.js'),'Missing offline MoRTH 100–300 assets');
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
   assert.ok(library.includes('./'+page),'Library missing '+page);
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
 assert.ok(home.includes("t.id!=='bridgehydro'"),'Recent tools can revive removed hydraulic module');
 const pdf=load('pdf_viewer.html');
 assert.ok(pdf.includes('enableBridgeFingerGestures()'),'Finger gestures missing in PDF viewer');
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
 assert.equal(Object.keys(oldAudit.bySerial).length,70,'2002 scanned index must have all 70 source records');
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

 assert.equal(oldAudit.coveredOriginalIndexNumbers,70,'Full 2002 scan index count missing');
 assert.equal(oldAudit.additionalIndexedRecords,32,'Post-038 legacy records missing');
 for(let n=39;n<=70;n++){
   const id=String(n).padStart(3,'0'),m=oldAudit.bySerial[id];
   assert.ok(m,'2002 drawing '+id+' missing');
   const expected=n<=58?n+11:n<=62?n+12:n<=66?n+13:n+14;
   assert.equal(m.pdfPages.length,1,'Unexpected 2002 PDF sheet count '+id);
   assert.equal(m.pdfPages[0],expected,'Source scanned PDF page mismatch '+id);
   assert.ok(m.status.startsWith('VISUAL_TITLE_BLOCK_NUMBER'),'Unverified 2002 sheet '+id);
   assert.ok(m.sheetNumber.includes('2002-'),'Source printed number incomplete '+id);
 }
 assert.deepEqual(Array.from(oldAudit.unindexedHandwrittenPagesExcluded),[85,86,87,88,89,90,91],'Handwritten appendix pages must stay excluded');
 for(const n of [41,49,70,75,80]){
   assert.ok(!Object.values(oldAudit.bySerial).some(m=>m.pdfPages.includes(n)),'2002 section-divider page falsely indexed '+n);
 }
 for(const id of ['053','057','058','059','060','061','062']){
   assert.equal(oldAudit.bySerial[id].status,'VISUAL_TITLE_BLOCK_NUMBER_FORMAT_VARIANT','Loss of source numbering variation '+id);
   assert.ok(oldAudit.bySerial[id].formatNote,'Must explain typography difference '+id);
 }
 for(const id of ['047','048','049','050','051','052','053','054','055','056','057','058','059','060','061','062']){
   assert.equal(oldAudit.bySerial[id].titleCheck,'INDEX_SHEET_TITLE_WORDING_VARIANT','Original scanned title difference not flagged '+id);
 }
 assert.ok(Object.values(oldAudit.bySerial).every(m=>m.pdfPages.every(n=>n>=7&&n<=84)),'2002 mapped beyond authoritative scanned drawings');

 const oldBook=load('bridge_book_2002.html');
 assert.ok(oldBook.includes('bridge-2002-drawing-audit.js'),'2002 source metadata script not linked');
 assert.ok(oldBook.includes('sourceAudit[r.sr]'),'2002 per-record source mapping unused');
 assert.ok(oldBook.includes('View original '),'2002 original page links missing');
 assert.ok(oldBook.includes('not digitized'),'2002 graphical detail must remain undigitized');
 for(const section of ['B','C','F','M','R'])assert.ok(oldBook.includes('value="'+section+'"'),'New 2002 section missing '+section);
 assert.ok(oldBook.includes("BR-NGP/2002-")&&oldBook.includes('BR-II/2002-'),'2002 drawing number series missing');
 assert.ok(oldBook.includes('Index/title-block number comparison'),'Scanned document number comparison not displayed');
 assert.ok(oldBook.includes('Index/title-block title wording'),'Title-book actual sheet comparison not displayed');
 assert.ok(oldBook.includes('NUMBER FORMAT VARIANT'),'Scan number format differences must remain visible');
 assert.ok(oldBook.includes('70-drawing index'),'Complete 2002 coverage not disclosed');


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
 const viewer={classList:{modes:[],add(name){this.modes.push(name)}}};
 const back={href:'./library.html'};
 const els={viewer,gestureSurface:surface,frame:target,fallback:{classList:{add(){}}}};
 const ctx={
   URLSearchParams,location:{search:'?doc=bridge2023&page=17'},setTimeout(){},
   document:{getElementById(id){return els[id]||null},querySelector(sel){return sel==='.top a'?back:null}},
   docTitle:{textContent:''},docMeta:{textContent:''},driveBtn:{href:''},fallbackBtn:{href:''},frame:target
 };
 const scriptStart=pdf.indexOf('<script>');const pdfScript=pdf.slice(scriptStart+8,pdf.indexOf('</script>',scriptStart));
 vm.runInNewContext(pdfScript,ctx,{filename:'bridge-gesture-behavior'});
 assert.ok(viewer.classList.modes.includes('gesture-mode'),'Bridge viewer gestures not activated');
 assert.equal(back.href,'./bridge_book_2023.html','Bridge source must return to its own book');
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
