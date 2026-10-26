/* V64: CLI inventory for 21 numeric/internal Steel Table holds.
 * Engineering diagnostic ONLY; does not calculate substitute nominal masses.
 * Outputs existing source-row data and source pointers; no BIS table reproduced.
 */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const register=holds.build(cat,cmp,status);
const candidates=register.rows.filter(x=>x.reason==='numeric'||x.reason==='internal');
assert.equal(candidates.length,21,'Unexpected change in unresolved numeric sources');
const evidence=candidates.map(x=>{
 const row=cat.byId(x.id);
 const audit=cat.standardAudit(row);
 const expectedFromArea=Number.isFinite(row.areaCm2)&&row.areaCm2>0?
  row.areaCm2*0.785:null;
 const pct=expectedFromArea===null?null:
  100*(row.kgPerM-expectedFromArea)/expectedFromArea;
 return Object.freeze({
  id:x.id,designation:x.designation,group:x.reason,series:x.series,
  originalSource:x.sourceId,sourceStatus:x.sourceStatus,
  sourceTable:audit.sourceTable??null,sourcePdfPage:audit.sourcePdfPage??null,
  sourceMassKgM:row.kgPerM,sourceAreaCm2:row.areaCm2??null,
  areaDensityDiagnosticKgM:expectedFromArea===null?null:Number(expectedFromArea.toFixed(3)),
  massAreaDeviationPct:pct===null?null:Number(pct.toFixed(2)),
  sourceNote:x.evidenceNote,
  quantityBlocked:!cmp.quantityGate(cat,row).allowed
 });
});
assert.ok(evidence.every(x=>x.quantityBlocked));
assert.equal(evidence.filter(x=>x.group==='numeric').length,15);
assert.equal(evidence.filter(x=>x.group==='internal').length,6);
console.log(JSON.stringify({version:'Steel V64',purpose:'SOURCE EVIDENCE TRIAGE ONLY — no nominal mass corrections',counts:{numeric:15,internal:6,all:21},data:evidence},null,2));
console.log('STEEL V64 INVENTORY PASS: 21 unresolved numeric/internal holds remain blocked; density-normalized area diagnostic is NOT a BIS tolerance or authorization.');
