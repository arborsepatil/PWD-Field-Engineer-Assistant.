/* Steel V64 — exact source conflict queue and read-only density sanity.
 * No vendor/BIS PDF table copied into the repository.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const read=f=>fs.readFileSync(path.resolve(import.meta.dirname,'..',f),'utf8');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const discrepancy=require('../pwd-steel-discrepancies.js');
const snapshot=cat.sections.map(r=>[r.id,r.kgPerM,r.areaCm2]);
const register=discrepancy.build(cat,cmp,holds.build(cat,cmp,status));
assert.equal(register.total,21);
assert.equal(register.groups.find(g=>g.key==='numeric')?.count,15);
assert.equal(register.groups.find(g=>g.key==='internal')?.count,6);
assert.equal(new Set(register.rows.map(x=>x.id)).size,21);
assert.equal(register.printedPairConfirmed,5);
const printed=['OSD193','OSD194','OSD195','OSD196','OSD308'];
for(const id of printed){
 const item=register.rows.find(x=>x.id===id);
 assert.ok(item,id+' missing in mismatch register');
 assert.equal(item.printedDiscrepancyObserved,true);
 assert.equal(item.sourceTable,id==='OSD308'?6:4);
 assert.equal(item.sourcePdfPage,id==='OSD308'?23:18);
 assert.equal(item.category,'internal');
 assert.ok(item.densityCheck?.relativeDeviationPct>2.5);
 assert.match(item.sourceEvidence,/same inconsistent pair is printed there/);
}
const tube=register.rows.find(x=>x.id==='OSD578');
assert.ok(tube);assert.equal(tube.category,'internal');
assert.equal(tube.printedDiscrepancyObserved,false,'CHS area suspected, NOT independently checked against new amendment');
assert.ok(tube.densityCheck?.relativeDeviationPct>85);
assert.match(tube.nextEvidence,/decimal-place transcription issue/);
const wpb=register.rows.find(x=>x.id==='OSD180');
assert.ok(wpb);assert.equal(wpb.category,'numeric');
assert.equal(wpb.sourceTable,4);assert.equal(wpb.sourcePdfPage,17);
for(const issue of register.rows){
 const row=cat.byId(issue.id);
 assert.ok(row);
 assert.equal(issue.quantityAllowed,false);
 assert.equal(cmp.audit(cat,row).status,'hold');
 assert.equal(cmp.quantityGate(cat,row).allowed,false);
 assert.ok(issue.sourceName&&issue.sourceEvidence&&issue.nextEvidence);
 assert.ok(!issue.sourceEvidence.includes('approved corrected'),'Never invent approved correction');
 if(issue.densityCheck){
  const x=issue.densityCheck;
  assert.ok(Math.abs(x.densityEquivalentKgPerM-x.listedAreaCm2*.785)<.00011);
  assert.ok(Math.abs(x.relativeDeviationPct-
   Math.round(Math.abs(x.nominalKgPerM-x.listedAreaCm2*.785)/
    x.nominalKgPerM*10000)/100)<.001);
  assert.match(x.assessment,/NOT a BIS tolerance/);
 }
}
assert.deepEqual(cat.sections.map(r=>[r.id,r.kgPerM,r.areaCm2]),snapshot,
 'Review must be completely read-only; no nominal mass/area modifications');
assert.throws(()=>discrepancy.inspect(cat,cmp,{
 id:'ISMB300',reason:'numeric'
}),/Resolved, absent or unsafe/);
const html=read('pwd_steel_table.html'),app=read('pwd-steel-app.js'),sw=read('sw.js');
new vm.Script(app);
assert.match(html,/<details class="steel-tech" id="steelDiscrepancySummary">/);
assert.ok(html.indexOf('id="steelDiscrepancySummary"')>html.indexOf('id="steelHoldSummary"'));
assert.ok(html.indexOf('id="steelDiscrepancySummary"')>html.indexOf('id="steelQuantityDisclosure"'),
 'Numerical issue register must stay inside optional sources section, not main picker');
assert.equal((html.match(/<script src="\.\/pwd-steel-discrepancies\.js"/g)||[]).length,1);
assert.match(app,/window\.PWDSteelDiscrepancies\.build\(catalog,comparison,evidence\)/);
assert.match(app,/issue\.printedDiscrepancyObserved/);
assert.match(app,/issue\.densityCheck/);
assert.ok(sw.includes("'./pwd-steel-discrepancies.js'"));
assert.ok(sw.includes('pwd-tools-steel-v64-2026-10-26'));
const readiness=read('scripts/steel-release-readiness.mjs');
assert.match(readiness,/currentVersion:'Steel V64'/);
assert.match(readiness,/conflictEvidence:/);
const catalog=status.summarize(cat,cmp,cat.sections);
assert.deepEqual({...catalog.counts},{checked:686,review:0,hold:71});
assert.equal(catalog.total,757);
assert.equal(register.rows.every(x=>!cmp.quantityGate(cat,cat.byId(x.id)).allowed),true);
for(const copy of ['IS_808_2021_Fourth_Revision_User_Copy.pdf','IS_1161_Amendment2_2023.pdf'])
 assert.equal(fs.existsSync(path.resolve(import.meta.dirname,'..',copy)),false);
console.log('STEEL V64 PASS: 21 held conflicting mass/area and source records (6 internal, 15 numeric), 5 printed BIS source anomalies confirmed, originals immutable; 686 checked + 71 held; calculator remains blocked.');
