/** V33: auditable inventory of Steel Table source checks, discrepancies and remaining work.
 * Reports EXISTING catalogue facts only. It does not overwrite mass or claim certification.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const read=x=>fs.readFileSync(path.resolve(import.meta.dirname,'..',x),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-osdag.js'),ctx,{filename:'pwd-steel-osdag.js'});
ctx.PWDSteelOsdag=ctx.module.exports;ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-catalog.js'),ctx,{filename:'pwd-steel-catalog.js'});
const cat=ctx.module.exports;ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-compare.js'),ctx,{filename:'pwd-steel-compare.js'});
const compare=ctx.module.exports;
const take=row=>{
 const review=compare.audit(cat,row),permit=compare.quantityGate(cat,row);
 const standard=cat.standardAudit(row),source=cat.SOURCES[row.sourceId];
 return {
  id:row.id,designation:row.designation,series:cat.resolveSeries(row),family:row.family,
  source:source?.label??'Unknown source',sourceId:row.sourceId,sourceDate:source?.date??'Unstated',
  massKgPerM:row.kgPerM,depthMm:row.depthMm,widthMm:row.widthMm,thicknessMm:row.thicknessMm??null,
  sourceStatus:review.sourceStatus,category:review.status,quantityAllowed:permit.allowed,
  sourceNote:standard.note??'No per-row BIS check logged',integrityIssues:review.issues
 };
};
const all=cat.sections.map(take),hold=all.filter(r=>r.category==='hold'),
 review=all.filter(r=>r.category==='review'),checked=all.filter(r=>r.category==='checked');
assert.equal(all.length,757,'Catalog has changed; update audit scope explicitly');
assert.equal(hold.length+review.length+checked.length,all.length);
assert.equal(hold.length,all.filter(x=>!x.quantityAllowed&&x.category==='hold').length);
assert.equal(review.length,all.filter(x=>!x.quantityAllowed&&x.category==='review').length);
assert.equal(checked.length,all.filter(x=>x.quantityAllowed).length);
assert.ok(hold.every(x=>x.sourceId&&x.id&&x.designation&&x.sourceNote),'Every held record needs traceability');
const groupBy=(items,key)=>Object.entries(items.reduce((result,item)=>{
 const k=item[key]||'unspecified';result[k]=(result[k]||0)+1;return result;
},{})).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
const statusBuckets=groupBy(all,'sourceStatus');
const byHoldSource=groupBy(hold,'sourceId');
const byReviewSource=groupBy(review,'sourceId');
console.log('STEEL V33 INVENTORY: '+all.length+' catalogue records; checked '+checked.length+', HOLD '+hold.length+', pending '+review.length+'.');
console.log('HOLD BY SOURCE: '+JSON.stringify(byHoldSource));
console.log('PENDING BY SOURCE: '+JSON.stringify(byReviewSource));
console.log('AUDIT STATUS COUNTS: '+JSON.stringify(statusBuckets));
for(const item of hold){
 // All details come from this repository's already public source records.
 console.log('HOLD RECORD '+JSON.stringify(item));
}
console.log('Steel V33 PASS: exact held-row IDs, source editions, audit notes and integrity issues recorded in release-test log. Nothing auto-corrected.');
