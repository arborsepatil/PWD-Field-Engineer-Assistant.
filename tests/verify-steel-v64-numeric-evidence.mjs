/* V64: individual held numeric sources and arithmetic diagnostics.
 * The QA view is read-only, so source record values remain unchanged.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const r=holds.build(cat,cmp,status),q=holds.numericReview(r);
assert.equal(r.total,757);
assert.equal(r.checked,686);
assert.equal(r.review,0);
assert.equal(r.hold,71);
assert.equal(q.total,21);
assert.equal(q.internal,6);
assert.equal(q.numeric,15);
assert.equal(r.rows.filter(x=>x.reason==='chs').length,49);
assert.equal(r.rows.filter(x=>x.reason==='nonTabulated').length,1);
assert.equal(new Set(q.rows.map(x=>x.id)).size,21);
const expected=new Set(r.rows.filter(x=>x.reason==='numeric'||x.reason==='internal').map(x=>x.id));
assert.deepEqual(new Set(q.rows.map(x=>x.id)),expected);
for(const x of q.rows){
 assert.equal(x.quantityAllowed,false);
 assert.ok(x.evidenceNote.length>0&&x.nextEvidence.length>0);
 assert.ok(x.sourceLabel&&x.sourceStatus);
 const row=cat.byId(x.id);
 assert.equal(cmp.audit(cat,row).status,'hold',x.id);
 assert.equal(cmp.quantityGate(cat,row).allowed,false,x.id);
 assert.equal(x.numericSanity.available,Number.isFinite(row.kgPerM)&&row.kgPerM>0&&Number.isFinite(row.areaCm2)&&row.areaCm2>0);
 if(x.numericSanity.available){
  const a=x.numericSanity;
  assert.equal(a.sourceKgPerM,row.kgPerM);
  assert.equal(a.sourceAreaCm2,row.areaCm2);
  assert.ok(Math.abs(a.theoreticalKgPerM-row.areaCm2*0.785)<=0.00051);
  assert.ok(Math.abs(a.signedDifferencePct-(row.kgPerM-row.areaCm2*.785)/(row.areaCm2*.785)*100)<=.0051);
  assert.match(a.meaning,/not a certified correction/);
 }
}
const noArea=holds.diagnosticMassArea({kgPerM:12,areaCm2:null});
assert.equal(noArea.available,false);
const bad=holds.diagnosticMassArea({kgPerM:NaN,areaCm2:12});
assert.equal(bad.available,false);
const artificial=holds.diagnosticMassArea({kgPerM:7.85,areaCm2:10});
assert.equal(artificial.available,true);
assert.ok(Math.abs(artificial.signedDifferencePct)<.0001);
assert.equal(artificial.theoreticalKgPerM,7.85);
assert.throws(()=>holds.numericReview(null),/Build the hold register first/);
const html=read('pwd_steel_table.html'),app=read('pwd-steel-app.js'),sw=read('sw.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
for(const id of ['steelNumericReview','steelNumericReviewCount','steelNumericReviewList']){
 assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
}
assert.match(html,/<details class="steel-tech" id="steelNumericReview">/);
assert.ok(html.indexOf('id="steelNumericReview"')>html.indexOf('id="steelHoldSummary"'),
 'No new primary-screen navigation, nest within source evidence');
assert.match(app,/window\.PWDSteelHolds\.numericReview\(evidence\)/);
assert.match(app,/ledger\.replaceChildren\(\)/);
assert.match(app,/document\.createElement\('details'\)/);
assert.match(app,/quantity NOT allowed/);
assert.match(app,/Neither number is approved by this check/);
assert.ok(!app.includes('approvedKgPerM='));
assert.match(html,/steel-numeric-ledger\{max-height:340px/);
assert.ok(sw.includes('pwd-tools-steel-v64-2026-10-26'));
assert.ok(sw.includes("'./pwd-steel-holds.js'"));
assert.ok(html.includes('id="steelCategoryDrawer"'));
assert.ok(html.includes('id="steelSectionDiagram"'));
assert.ok(html.includes('id="steelCompareCard"'));
assert.match(read('scripts/steel-release-readiness.mjs'),/currentVersion:'Steel V64'/);
console.log('STEEL V64 PASS: exact 21 numerical holds, 6 internal and 15 published conflicts; only arithmetic QA shown; 686 checked preserved; 71 quantity-blocked; compact interface intact.');
