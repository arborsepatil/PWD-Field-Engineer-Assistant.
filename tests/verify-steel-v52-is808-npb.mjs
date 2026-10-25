/* V52: all previously pending Table 3 NPB exact mass variants.
 * No copyrighted numerical source tables are reproduced.
 */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
assert.equal(cat.is808V52AuditSampleCount,69);
for(let n=41;n<=109;n++){
 const id='OSD'+n,r=cat.byId(id);
 assert.ok(r,id);
 assert.equal(r.sourceId,'osdag808');
 assert.equal(r.family,'beam');
 assert.equal(cat.resolveSeries(r),'NPB');
 const a=cat.standardAudit(r);
 assert.equal(a.status,'is808-mass-area-inertia-checked',id);
 assert.equal(a.sourceTable,3,id);
 assert.equal(a.sourcePdfPage,n<=49?11:n<=73?12:n<=97?13:14,id);
 assert.equal(a.geometryChecked,false,id);
 assert.equal(cmp.quantityGate(cat,r).allowed,true);
 for(const field of ['id','sourceId','series','designation','qualityFlag',
  'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4','zxCm3','zyCm3','webMm','flangeMm']){
  const v=r[field],modified={...r,[field]:typeof v==='number'?v+1:String(v)+'x'};
  if(field!=='id')assert.equal(cat.standardAudit(modified).status,'is808-numeric-conflict');
  else assert.notEqual(cat.standardAudit(modified).status,'is808-mass-area-inertia-checked');
  assert.equal(cmp.quantityGate(cat,modified).allowed,false,id+' '+field);
 }
}
const npb=status.summarize(cat,cmp,cat.sections.filter(r=>cat.resolveSeries(r)==='NPB'));
assert.deepEqual({...npb.counts},{checked:71,review:0,hold:0});
const all=status.summarize(cat,cmp,cat.sections);
assert.deepEqual({...all.counts},{checked:429,review:309,hold:19});
assert.equal(all.total,757);
for(const id of ['OSD180','OSD193','OSD194','OSD195','OSD196']){
 assert.equal(cmp.quantityGate(cat,cat.byId(id)).allowed,false);
}
console.log('Steel V52 PASS: all 71 NPB catalogue variants source-checked; 429 checked, 309 pending, 19 held globally.');
