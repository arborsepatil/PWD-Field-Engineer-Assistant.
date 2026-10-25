/* V59: exact pending source-row inventory, no implicit promotions.
 * Prints short source identifiers and engineering metadata only.
 * Safe to include in CI; no copyrighted source tables are embedded.
 */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const comparison=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const audit=status.summarize(catalog,comparison,catalog.sections);
assert.equal(audit.total,757,'Do not silently change catalogue cardinality');
const groups={};
const queue=[];
for(const record of audit.records){
 if(record.status==='checked')continue;
 const row=record.row;
 const source=catalog.standardAudit(row);
 const key=row.family+' / '+catalog.resolveSeries(row);
 (groups[key]??={review:0,hold:0})[record.status]++;
 const item={
   id:row.id,
   designation:row.designation,
   sourceId:row.sourceId,
   status:record.status,
   sourceStatus:source.status,
   weight:row.kgPerM,
   dimension:{
     depthMm:row.depthMm,
     widthMm:row.widthMm,
     thicknessMm:row.thicknessMm??row.webMm
   },
   qualityFlag:row.qualityFlag??null,
   // Source comparisons are scoped to the exact section variant;
   // a similarly named section cannot inherit verification.
   quantityAllowed:comparison.quantityGate(catalog,row).allowed
 };
 assert.equal(item.quantityAllowed,false,item.id+' cannot be quantity-enabled');
 queue.push({key,...item});
}
assert.deepEqual({...audit.counts},{checked:686,review:0,hold:71});
const pending=queue.filter(x=>x.status==='review');
assert.equal(pending.length,0);
assert.equal(queue.filter(x=>x.status==='hold').length,71);
console.log(JSON.stringify({
 version:'Steel V60 after final pending source reviews',
 total:audit.total,
 ...audit.counts,
 families:groups,
 pending
},null,2));
console.log('STEEL V60 INVENTORY PASS: zero pending rows identified and every pending or held row is blocked from nominal quantity.');
