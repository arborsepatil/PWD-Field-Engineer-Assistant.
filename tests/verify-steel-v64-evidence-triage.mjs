/* V64: discrepancy evidence audit never upgrades nominal kg/m approval. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const module=require('../pwd-steel-triage.js');
const totals=status.summarize(cat,cmp,cat.sections);
assert.equal(totals.total,757);
assert.deepEqual({...totals.counts},{checked:686,review:0,hold:71});
const register=holds.build(cat,cmp,status);
const triage=module.build(cat,cmp,status,holds);
assert.equal(triage.checked,686);
assert.equal(triage.held,71);
assert.equal(triage.count,21);
assert.deepEqual(triage.groups.map(g=>[g.reason,g.count]),[['numeric',15],['internal',6]]);
assert.equal(triage.records.length,21);
assert.equal(new Set(triage.records.map(r=>r.id)).size,21);
assert.ok(Object.isFrozen(triage)&&Object.isFrozen(triage.records));
assert.ok(triage.records.every(Object.isFrozen));
assert.ok(triage.records.every(row=>{
 const origin=cat.byId(row.id);
 return origin&&origin.designation===row.designation
  &&origin.kgPerM===row.kgPerM&&(origin.areaCm2??null)===row.areaCm2
  &&row.quantityAllowed===false
  &&cmp.audit(cat,origin).status==='hold'
  &&cmp.quantityGate(cat,origin).allowed===false
  &&register.rows.some(x=>x.id===row.id&&x.reason===row.reason)
  &&row.note&&row.nextEvidence&&row.sourceStatus;
}), 'No source weights or verification status may change in triage');
for(const row of triage.records){
 const audit=cat.standardAudit(cat.byId(row.id));
 assert.equal(row.sourceTable,audit.sourceTable??null,row.id);
 assert.equal(row.sourcePdfPage,audit.sourcePdfPage??null,row.id);
 assert.ok(!('approvedKgPerM' in row)&&!('correctedKgPerM' in row),
 'Triage cannot supply an approved new mass');
 if(row.areaCm2!==null&&row.kgPerM!==null){
  const expected=row.areaCm2*0.785;
  assert.equal(row.diagnosticMassKgM,Number(expected.toFixed(3)));
  assert.equal(row.massAreaDifferencePct,Number((100*(row.kgPerM-expected)/expected).toFixed(2)));
 } else assert.equal(row.massAreaDifferencePct,null);
}
assert.match(triage.caution,/NOT a BIS tolerance/);
assert.equal(triage.records.find(x=>x.id==='OSD180').reason,'numeric');
assert.equal(triage.records.find(x=>x.id==='OSD578').reason,'internal');
const html=read('pwd_steel_table.html'),js=read('pwd-steel-app.js'),sw=read('sw.js');
new vm.Script(js,{filename:'pwd-steel-app.js'});
for(const id of ['steelHoldSummary','steelHoldBreakdown','steelTriageDisclosure','steelTriageCount','steelTriageEntries'])
 assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1);
assert.ok(html.indexOf('id="steelTriageDisclosure"')>html.indexOf('id="steelHoldSummary"'));
assert.ok(html.indexOf('id="steelStandardsDisclosure"')<html.indexOf('id="steelTriageDisclosure"'));
assert.ok(html.indexOf('id="steelQuantityDisclosure"')<html.indexOf('id="steelTriageDisclosure"'),
 'Triage detail must remain secondary and collapsed, not disrupt familiar UI');
assert.ok(html.indexOf('pwd-steel-triage.js')<html.indexOf('pwd-steel-app.js'));
assert.match(js,/window\.PWDSteelTriage\.build\(catalog,comparison,steelStatus,window\.PWDSteelHolds\)/);
assert.match(js,/row\.note/);
assert.match(js,/row\.nextEvidence/);
assert.match(js,/NOT a standard tolerance/);
assert.match(js,/detail\.append\(p\)/);
assert.ok(sw.includes("'./pwd-steel-triage.js'"),'Android offline bundle and service-worker cache must include V64 module');
assert.match(sw,/pwd-tools-steel-v64-2026-10-26/);
assert.match(read('scripts/steel-release-readiness.mjs'),/currentVersion:'Steel V64'/);
assert.match(read('scripts/steel-v64-discrepancy-inventory.mjs'),/require\('\.\.\/pwd-steel-triage\.js'\)/);
assert.ok(!sw.includes("IS_808_2021_Fourth_Revision_User_Copy.pdf"),'No private BIS book packaged');
console.log('STEEL V64 PASS: 21 issue-by-issue source evidence records (15 numeric, 6 internal), source-referenced diagnostic-only mass/area, 686 checked / 71 blocked, original two-column reference UI and Android offline support preserved.');
