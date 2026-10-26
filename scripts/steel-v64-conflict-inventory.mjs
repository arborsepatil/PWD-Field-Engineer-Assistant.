/* Steel V64: view the exact held numeric/internally inconsistent source rows.
 * This prints SOURCE-EVIDENCE FLAGS ONLY, never replacement nominal masses.
 */
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const issues=require('../pwd-steel-discrepancies.js');
const register=issues.build(cat,compare,holds.build(cat,compare,status));
const output={
 version:'Steel V64',
 status:'HOLD-EVIDENCE — no corrections approved',
 groups:register.groups,
 total:register.total,
 printedPairConfirmed:register.printedPairConfirmed,
 densityCheckCount:register.densityCheckCount,
 rows:register.rows.map(x=>({
  id:x.id,designation:x.designation,series:x.series,
  reason:x.category,source:x.sourceName,sourceStatus:x.sourceStatus,
  sourceTable:x.sourceTable,sourcePdfPage:x.sourcePdfPage,
  printedPairConfirmed:x.printedDiscrepancyObserved,
  kgPerM:x.densityCheck?.nominalKgPerM??null,
  areaCm2:x.densityCheck?.listedAreaCm2??null,
  densityEquivalentKgPerM:x.densityCheck?.densityEquivalentKgPerM??null,
  relativeDeviationPct:x.densityCheck?.relativeDeviationPct??null,
  evidence:x.sourceEvidence,action:x.nextEvidence,
  quantityAllowed:x.quantityAllowed
 }))
};
console.log(JSON.stringify(output,null,2));
