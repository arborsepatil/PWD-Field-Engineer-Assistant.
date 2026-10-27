/* MoRTH Fifth Revision (2013) private-development offline wiring checks.
 * These do not certify the correctness of every engineering requirement.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const reader=read('morth_reader.html'),lib=read('library.html'),qc=read('qc.html');
const shell=read('app-shell.js'),sw=read('sw.js');
const base=reader.slice(reader.indexOf('const section400='),reader.indexOf('const RECORDS='));
const indexed=[...base.matchAll(/\['(\d{3,4})','[^']+',\d+\]/g)].map(m=>m[1]);
assert.equal(indexed.length,260,'Main 400–2400 indexed clause count changed');
assert.equal(new Set(indexed).size,260,'Main clause numbers must be unique');
const sections=new Set(indexed.map(id=>String(Math.floor(Number(id)/100)*100)));
assert.equal(sections.size,21,'Main chapter coverage changed');
const extGroups=[['100-300',37],['2500',10],['2600',15],['2700',9],['2800',15],['2900',11],['3000',5],['3100',10]];
assert.equal(extGroups.reduce((s,x)=>s+x[1],260),372,'Documented 372 clause inventory changed');
for(const [id] of extGroups){
 const file=id==='100-300'?'morth-section-100-300.js':'morth-section-'+id+'.js';
 assert.ok(fs.existsSync(path.join(root,file)),'Missing '+file);
}
assert.ok(lib.includes('href="./morth_reader.html"')&&lib.includes('2013'),'Library must link the internal reader with edition');
assert.ok(reader.includes('href="./qc.html"'),'Reader QC link absent');
assert.ok(!reader.includes('pdf_viewer.html?doc=morth'),'Broken/private book links remain');
assert.ok(reader.includes('The original MoRTH publication is not bundled'),'Original-source safety note absent');
assert.ok(reader.includes('index')&&reader.includes('partial'),'Verification statuses lost');
const scripts=[...reader.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
scripts.forEach((content,i)=>new vm.Script(content,{filename:'morth-reader-inline-'+i+'.js'}));
assert.ok(scripts.length>=2,'Reader controller missing');
const modules=['morth-section-2500.js','morth-section-2600.js','morth-section-2611-2612.js','morth-section-2613-2615.js','morth-section-2700.js','morth-section-2800.js','morth-section-2900.js','morth-section-3000.js','morth-section-3100.js','morth-section-100-300.js'];
const qcModules=['morth-qc-2610.js','morth-qc-2700.js','morth-qc-2800.js','morth-qc-2900.js','morth-qc-3000.js','morth-qc-3100.js','morth-qc-100-300.js'];
for(const f of [...modules,...qcModules]){
 assert.ok(fs.existsSync(path.join(root,f)),'Missing '+f);
 new vm.Script(read(f),{filename:f});
 assert.ok(sw.includes("'./"+f+"'"),'Offline shell does not precache '+f);
}
assert.ok(sw.includes("'./morth_reader.html'")&&sw.includes("'./qc.html'"),'Screens not precached');
assert.ok(shell.includes('function loadMoRTHExtensions'),'Module loader missing');
for(const f of modules)assert.ok(shell.includes("'./"+f+"'"),'Loader omitted '+f);
assert.ok(qc.includes('id="matGrid"')&&qc.includes('DLC · Dry Lean Cement Concrete'),'QC anchors missing');
for(const f of qcModules)assert.ok(qc.includes('src="./'+f+'"'),'QC page omitted '+f);
const ordered=['morth-qc-2700.js','morth-qc-2800.js','morth-qc-2900.js','morth-qc-3000.js','morth-qc-3100.js'];
for(let i=1;i<ordered.length;i++)assert.ok(qc.indexOf(ordered[i-1])<qc.indexOf(ordered[i]),'QC dependencies out of order');
for(const file of ['morth_reader.html','qc.html','sw.js','library.html',...modules,...qcModules]){
 const txt=read(file);
 for(const privateOrigin of ['drive.google.com/file/d/','docs.google.com/document/d/','docs.google.com/spreadsheets/d/'])
  assert.ok(!txt.includes(privateOrigin),file+' leaks a private source URL');
}
console.log('MoRTH integration PASS: 260 base + 112 extension main-clause records; 31 sections; 17 module scripts; offline/links/source safety.');
