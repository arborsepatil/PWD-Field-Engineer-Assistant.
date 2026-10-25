/* Steel V53: 28 Table 13 PBP nominal source comparisons; 
 * Owner-held source not reproduced in repository. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const st=require('../pwd-steel-status.js');
assert.equal(cat.is808V53AuditSampleCount,28);
assert.equal(cat.sections.length,757);
for(let n=265;n<=292;n++){
 const id='OSD'+n,row=cat.byId(id);
 assert.ok(row,id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(row.family,'pile');
 assert.equal(cat.resolveSeries(row),'PBP');
 const a=cat.standardAudit(row);
 assert.equal(a.status,'is808-mass-area-inertia-checked',id);
 assert.equal(a.sourceTable,13,id);
 assert.equal(a.sourcePdfPage,n<=272?40:41,id);
 assert.equal(a.geometryChecked,false);
 assert.equal(cmp.quantityGate(cat,row).allowed,true,id);
 for(const key of ['id','sourceId','series','designation','qualityFlag',
  'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4',
  'zxCm3','zyCm3','webMm','flangeMm']){
  const val=row[key],mut={...row,[key]:typeof val==='number'?val+1:String(val)+'-modified'};
  if(key==='id')assert.notEqual(cat.standardAudit(mut).status,'is808-mass-area-inertia-checked');
  else assert.equal(cat.standardAudit(mut).status,'is808-numeric-conflict',id+' '+key);
  assert.equal(cmp.quantityGate(cat,mut).allowed,false,id+' '+key);
 }
}
const piles=st.summarize(cat,cmp,cat.sections.filter(x=>cat.resolveSeries(x)==='PBP'));
assert.deepEqual({...piles.counts},{checked:30,review:0,hold:0});
const total=st.summarize(cat,cmp,cat.sections);
assert.deepEqual({...total.counts},{checked:457,review:281,hold:19});
for(const id of ['OSD180','OSD193','OSD194','OSD195','OSD196']){
 assert.equal(cmp.quantityGate(cat,cat.byId(id)).allowed,false);
}
console.log('Steel V53 PASS: full PBP family 30 checked, global 457 checked, 281 pending, 19 held; all restricted WPB entries blocked.');
