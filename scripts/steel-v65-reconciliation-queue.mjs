/* Steel V65: reproducible source-reconciliation order.
 * Deliberately no substitute kg/m, no updated catalogue, and no BIS table copy.
 * Prints only project-held source IDs, review routes and evidence instructions.
 */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const comparison=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const evidence=require('../pwd-steel-evidence.js');
const report=evidence.build(catalog,comparison,status,holds);
assert.equal(report.reviewQueue.length,21);
assert.equal(report.priorityCounts.P1+report.priorityCounts.P2,21);
for(const x of report.reviewQueue){
 assert.equal(comparison.quantityGate(catalog,catalog.byId(x.id)).allowed,false);
 assert.equal(x.approvedReplacementKgPerM,null);
 assert.equal(x.quantityAllowed,false);
}
const payload={
 version:'Steel V65',decision:'HOLD-DEPLOYMENT',
 message:'Engineering triage priority only. No original source weight was changed or approved. Do not treat mass-area diagnostics as BIS tolerance.',
 totalHeld:holds.build(catalog,comparison,status).hold,
 priorityCounts:report.priorityCounts,
 records:report.reviewQueue.map(x=>({
  id:x.id,designation:x.designation,originalSource:x.sourceId,
  sourceStatus:x.sourceStatus,sourceTable:x.sourceTable,
  physicalPdfPage:x.sourcePdfPage,
  priority:x.reviewPlan.priority,reviewRoute:x.reviewPlan.route,
  concern:x.reviewPlan.explanation,
  nextVerification:x.reviewPlan.action,
  quantityAllowed:false,approvedReplacementKgPerM:null
 }))
};
console.log(JSON.stringify(payload,null,2));
console.log('STEEL V65 INVENTORY PASS: 21 held numeric/internal sources prioritized for evidence review; no provisional data promotion.');
