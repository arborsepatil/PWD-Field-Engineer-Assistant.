/* Steel V51: WPB source audit of fifty exact Table 4 variants.
 * Test has no BIS source table content. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const st=require('../pwd-steel-status.js');
assert.equal(cat.is808V51AuditSampleCount,50);
for(let n=197;n<=246;n++){
 const r=cat.byId('OSD'+n);
 assert.ok(r);
 assert.equal(cat.resolveSeries(r),'WPB');
 assert.equal(r.sourceId,'osdag808');
 const audit=cat.standardAudit(r);
 assert.equal(audit.status,'is808-mass-area-inertia-checked','OSD'+n);
 assert.equal(audit.sourceTable,4);
 assert.equal(audit.sourcePdfPage,n<=208?18:n<=232?19:20);
 assert.equal(audit.geometryChecked,false);
 assert.equal(cmp.quantityGate(cat,r).allowed,true);
 for(const key of ['id','sourceId','series','designation','qualityFlag',
  'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4','zxCm3','zyCm3','webMm','flangeMm']){
  const v=r[key],modified={...r,[key]:typeof v==='number'?v+1:String(v)+'x'};
  if(key!=='id')assert.equal(cat.standardAudit(modified).status,'is808-numeric-conflict');
  else assert.notEqual(cat.standardAudit(modified).status,'is808-mass-area-inertia-checked');
  assert.equal(cmp.quantityGate(cat,modified).allowed,false);
 }
}
for(const id of ['OSD180','OSD193','OSD194','OSD195','OSD196']){
 assert.equal(cmp.quantityGate(cat,cat.byId(id)).allowed,false);
}
assert.equal(cat.standardAudit(cat.byId('OSD180')).status,'not-checked');
const wpb=st.summarize(cat,cmp,cat.sections.filter(r=>cat.resolveSeries(r)==='WPB'));
assert.deepEqual({...wpb.counts},{checked:119,review:1,hold:4});
const all=st.summarize(cat,cmp,cat.sections);
assert.deepEqual({...all.counts},{checked:360,review:378,hold:19});
assert.equal(all.total,757);
console.log('Steel V51 PASS: 50 WPB source-checked, 119 WPB checked; five WPB records still restricted.');
