/* Steel V64 diagnostic inventory — run via node scripts/steel-v64-conflict-inventory.mjs.
 * This read-only report flags issues only; it is not a source replacement ledger.
 */
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const comparison=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const evidence=require('../pwd-steel-evidence.js');
const report=evidence.build(catalog,comparison,status,holds);
const payload={
 version:'Steel V64',note:'Read-only evidence; all reported rows remain HOLD',
 totals:report.totals,
 entries:report.rows.map(x=>({
  id:x.id,designation:x.designation,series:x.series,sourceId:x.sourceId,
  sourceStatus:x.sourceStatus,reason:x.reason,sourceTable:x.sourceTable,
  sourcePdfPage:x.sourcePdfPage,recordedKgPerM:x.originalKgPerM,
  recordedAreaCm2:x.originalAreaCm2,areaBasedDiagnostic:x.densitySanity,
  sourceNote:x.sourceNote,nextEvidence:x.nextEvidence,
  approvedReplacementKgPerM:null,quantityAllowed:false
 }))
};
console.log(JSON.stringify(payload,null,2));
