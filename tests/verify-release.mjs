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
