/* V61: held steel rows have a deterministic, human-readable evidence route.
 * No nominal weights or arbitrary substitutions are approved by this register.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const register=holds.build(cat,cmp,status);
assert.equal(register.total,757);
assert.equal(register.checked,686);
assert.equal(register.review,0);
assert.equal(register.hold,71);
assert.equal(register.rows.length,71);
assert.equal(register.groups.reduce((sum,x)=>sum+x.count,0),71);
assert.equal(new Set(register.rows.map(x=>x.id)).size,71,'Every held section receives a unique explanation');
const all=status.summarize(cat,cmp,cat.sections);
assert.deepEqual({...all.counts},{checked:686,review:0,hold:71});
assert.equal(cat.sections.length,757);
for(const item of register.rows){
 const row=cat.byId(item.id);
 assert.ok(row,item.id);
 assert.equal(cmp.audit(cat,row).status,'hold',item.id);
 assert.equal(cmp.quantityGate(cat,row).allowed,false,item.id);
 assert.equal(item.quantityAllowed,false,item.id);
 assert.ok(item.reason&&item.sourceStatus&&item.evidenceNote&&item.nextEvidence,
  'Every hold needs a source-status explanation and next evidence: '+item.id);
 assert.equal(item.sourceId,row.sourceId,item.id);
 const group=register.groups.find(x=>x.key===item.reason);
 assert.ok(group,'Unknown or ungrouped hold: '+item.id);
 assert.equal(group.nextEvidence,item.nextEvidence);
}
const chs=register.rows.filter(r=>r.family==='hollow'&&r.series==='CHS');
assert.equal(chs.length,50);
const wpb=register.rows.find(r=>r.id==='OSD180');
assert.ok(wpb);
assert.equal(wpb.reason,'numeric');
assert.match(wpb.evidenceNote,/361\.95/);
assert.match(wpb.evidenceNote,/NOT a BIS tolerance/);
const unusual=register.rows.find(r=>r.id==='sail23-ISA200x200x18');
assert.ok(unusual);
assert.equal(unusual.reason,'nonTabulated');
const bad=register.rows.find(r=>r.id==='OSD578');
assert.ok(bad);
assert.equal(bad.reason,'internal','Conflicted area takes priority over thickness absence');
assert.ok(register.groups.some(g=>g.key==='chs'&&g.count>=46));
const html=fs.readFileSync(path.join(root,'pwd_steel_table.html'),'utf8');
assert.equal((html.match(/<script src="\.\/pwd-steel-holds\.js"/g)||[]).length,1);
for(const id of ['steelHoldSummary','steelHoldCount','steelHoldBreakdown']){
 assert.ok(html.includes('id="'+id+'"'),'Hold details UI missing '+id);
}
const app=fs.readFileSync(path.join(root,'pwd-steel-app.js'),'utf8');
assert.ok(app.includes('window.PWDSteelHolds.build(catalog,comparison,steelStatus)'));
assert.ok(app.includes("p.append(name,document.createTextNode(item.nextEvidence))"));
assert.ok(app.includes("selected.qualityFlag==='mass-area-inconsistent'?"),
 'Source-specific alarm must not be hidden behind a general hold note');
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8')
 .includes("'./pwd-steel-holds.js'"));
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8')
 .includes("pwd-tools-steel-v61-2026-10-26"));
const release=fs.readFileSync(path.join(root,'scripts/steel-release-readiness.mjs'),'utf8');
assert.ok(release.includes('holdEvidenceGroups:'));
assert.equal(fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')),false);
assert.equal(fs.existsSync(path.join(root,'IS_1161_Amendment2_2023.pdf')),false);
console.log('STEEL V61 PASS: 71 explicit holds grouped with evidence requirements; every held nominal mass still blocked, 686 limited checked, 0 pending, 757 records preserved.');
console.log(JSON.stringify({groups:register.groups.map(x=>({reason:x.key,count:x.count}))}));
