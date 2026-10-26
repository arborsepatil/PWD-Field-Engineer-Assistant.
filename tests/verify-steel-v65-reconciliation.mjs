/** Steel V65: evidence priority is diagnostic, NOT acceptance; preserve original figures. */
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
const evidence=require('../pwd-steel-evidence.js');
const report=evidence.build(cat,cmp,status,holds);
const all=status.summarize(cat,cmp,cat.sections);
assert.deepEqual({...all.counts},{checked:686,review:0,hold:71});
assert.deepEqual({...report.totals},{numeric:15,internal:6,total:21});
assert.deepEqual({...report.priorityCounts},{P1:2,P2:19});
assert.equal(report.reviewQueue.length,21);
assert.equal(report.reviewQueue[0].reviewPlan.priority,'P1');
assert.equal(report.reviewQueue[1].reviewPlan.priority,'P1');
assert.deepEqual([...report.reviewQueue.slice(0,2).map(x=>x.id)].sort(),['OSD180','OSD578']);
assert.equal(new Set(report.reviewQueue.map(x=>x.id)).size,21);
assert.equal(report.reviewQueue.filter(x=>x.reviewPlan.route==='angle-edition-conflict').length,12);
assert.equal(report.reviewQueue.filter(x=>x.reviewPlan.route==='internal-area-recheck').length,5);
assert.equal(report.reviewQueue.filter(x=>x.reviewPlan.route==='source-row-reconciliation').length,2);
for(const x of report.reviewQueue){
 const original=cat.byId(x.id);
 assert.equal(x.originalKgPerM,original.kgPerM);
 assert.equal(x.originalAreaCm2,original.areaCm2??null);
 assert.equal(x.quantityAllowed,false);
 assert.equal(x.approvedReplacementKgPerM,null);
 assert.equal(cmp.audit(cat,original).status,'hold');
 assert.equal(cmp.quantityGate(cat,original).allowed,false);
 assert.ok(Object.isFrozen(x.reviewPlan));
 assert.ok(x.reviewPlan.action&&x.reviewPlan.explanation);
 assert.ok(!/approved|certified|corrected mass/i.test(x.reviewPlan.priority));
 assert.ok(x.reviewPlan.priority==='P1'||x.reviewPlan.priority==='P2');
}
assert.equal(report.byId.OSD180.reviewPlan.route,'geometry-vs-source');
assert.equal(report.byId.OSD180.reviewPlan.priority,'P1');
assert.ok(Math.abs(report.byId.OSD180.densitySanity.differencePercentOfRecorded)<1,
 'A 0% mass-area diagnostic MUST NOT override the geometry conflict.');
assert.equal(report.byId.OSD578.reviewPlan.route,'large-scale-mass-area');
assert.equal(report.byId.OSD578.reviewPlan.priority,'P1');
assert.ok(report.byId.OSD578.densitySanity.recordedKgPerM/
 report.byId.OSD578.densitySanity.impliedKgPerM>4);
assert.match(report.byId.OSD578.reviewPlan.explanation,/not a proven decimal correction/);
assert.ok(!report.byId['sail23-ISA200x200x18']);
assert.equal(cat.sections.length,757);
assert.equal(status.select(cat,cmp,cat.sections,'checked').rows.length,686);
assert.equal(status.select(cat,cmp,cat.sections,'hold').rows.length,71);
const app=read('pwd-steel-app.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
assert.match(app,/Review priority \(triage only\)/);
assert.match(app,/Engineering review path:/);
assert.match(app,/Why this needs review:/);
assert.match(app,/function renderEvidence\(row\)/);
assert.ok(!read('pwd_steel_table.html').includes('id="steelReconcileCard"'),
 'Investigation work stays inside original compact details; no new panel');
const cache=read('sw.js');
assert.match(cache,/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/);
assert.ok(cache.includes("'./pwd-steel-evidence.js'"));
assert.match(read('scripts/steel-release-readiness.mjs'),/currentVersion:'Steel V\d{2,}'/);
assert.match(read('.github/workflows/android-apk.yml'),/verify-steel-v65-reconciliation.mjs/);
assert.match(read('.github/workflows/qa-smoke.yml'),/verify-steel-v65-reconciliation.mjs/);
console.log('STEEL V65 PASS: P1 source review OSD180 geometry + OSD578 large mass/area; P2 remaining 19 holds; original 757 values and 71 quantity blocks unchanged.');
