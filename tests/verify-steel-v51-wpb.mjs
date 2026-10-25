import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
assert.equal(cat.is808V51AuditSampleCount,26);
for(let n=197;n<=222;n++){
 const row=cat.byId('OSD'+n);
 assert.equal(cat.standardAudit(row).status,'is808-mass-area-inertia-checked');
 assert.equal(cat.standardAudit(row).sourceTable,4);
 assert.equal(cat.standardAudit(row).sourcePdfPage,n<=208?17:18);
 assert.equal(cmp.quantityGate(cat,row).allowed,true);
 for(const key of ['kgPerM','areaCm2','depthMm','widthMm','ixCm4','iyCm4','zxCm3','zyCm3','webMm','flangeMm']){
  const changed={...row,[key]:row[key]+1};
  assert.equal(cat.standardAudit(changed).status,'is808-numeric-conflict');
  assert.equal(cmp.quantityGate(cat,changed).allowed,false);
 }
}
for(const n of [180,193,194,195,196,223]){
 assert.equal(cmp.quantityGate(cat,cat.byId('OSD'+n)).allowed,false);
}
const summary=status.summarize(cat,cmp,cat.sections);
assert.deepEqual({...summary.counts},{checked:336,review:402,hold:19});
assert.equal(summary.total,757);
console.log('STEEL V51 PASS: 26 new WPB variants, 336 checked, 402 pending, 19 held.');