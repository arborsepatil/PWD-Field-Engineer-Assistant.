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
const triage=require('../pwd-steel-triage.js').build(cat,cmp,status,holds);
assert.equal(triage.count,21);
assert.equal(triage.groups[0].count,15);
assert.equal(triage.groups[1].count,6);
assert.ok(triage.records.every(x=>!x.quantityAllowed));
const evidence=triage.records.map(x=>({
 id:x.id,designation:x.designation,group:x.reason,series:x.series,
 originalSource:x.sourceId,sourceStatus:x.sourceStatus,
 sourceTable:x.sourceTable,sourcePdfPage:x.sourcePdfPage,
 sourceMassKgM:x.kgPerM,sourceAreaCm2:x.areaCm2,
 areaDensityDiagnosticKgM:x.diagnosticMassKgM,
 massAreaDeviationPct:x.massAreaDifferencePct,
 sourceNote:x.note,quantityBlocked:!x.quantityAllowed
}));
console.log(JSON.stringify({version:'Steel V64',purpose:'SOURCE EVIDENCE TRIAGE ONLY — no nominal mass corrections',counts:{numeric:15,internal:6,all:21},data:evidence},null,2));
console.log('STEEL V64 INVENTORY PASS: 21 unresolved numeric/internal holds remain blocked; density-normalized area diagnostic is NOT a BIS tolerance or authorization.');
