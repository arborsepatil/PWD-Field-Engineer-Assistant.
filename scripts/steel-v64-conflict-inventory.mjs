/* Steel V64 unresolved numeric source inventory.
 * This report lists source record IDs, limited metadata and evidence workflow
 * only. It does not reproduce any copyrighted BIS table, certify corrected
 * weights or enable a held nominal value for quantity calculations.
 */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const comparison=require('../pwd-steel-compare.js');
const statuses=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const register=holds.build(catalog,comparison,statuses);
const queue=holds.numericReview(register);
assert.equal(queue.total,21,'All 21 original numeric/internal records must remain tracked');
assert.equal(queue.internal,6);
assert.equal(queue.numeric,15);
assert.equal(register.hold,71);
assert.equal(register.checked,686);
assert.equal(register.review,0);
const problems=queue.rows.map(entry=>{
 const row=catalog.byId(entry.id);
 assert.ok(row);
 assert.equal(comparison.audit(catalog,row).status,'hold');
 assert.equal(comparison.quantityGate(catalog,row).allowed,false);
 const a=entry.numericSanity;
 return {
  sourceRecordId:entry.id,designation:entry.designation,
  series:entry.series,sourceId:entry.sourceId,sourceStatus:entry.sourceStatus,
  issue:entry.reason,
  massAreaDiagnosticPct:a.available?a.signedDifferencePct:null,
  independentlyVerifiedCorrection:null,
  quantityAllowed:false,
  nextEvidence:entry.nextEvidence
 };
});
assert.equal(problems.length,21);
console.log(JSON.stringify({
 version:'Steel V64',purpose:'Source reconciliation work queue, NOT a nominal-weight approval',
 unit:'Mass/area diagnostic % derives from assumed 7850 kg/m³; not an acceptance criterion',
 totalCatalogue:register.total,limitedChecked:register.checked,held:register.hold,
 queue:{total:queue.total,internal:queue.internal,numeric:queue.numeric},
 problems
},null,2));
console.log('STEEL V64 INVENTORY PASS: 21 numerical evidence holds itemized; 50 other holds archived; no numerical corrections or release approval.');
