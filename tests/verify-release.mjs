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
