/* V52 source audit: exact NPB Table 3 variants, not BIS table reproductions. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const c=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
assert.equal(c.is808V52AuditSampleCount,69);
assert.equal(c.sections.length,757);
const ids=Array.from({length:69},(_,i)=>'OSD'+(i+41));
for(const id of ids){
 const row=c.byId(id),n=Number(id.slice(3));
 assert.ok(row,id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(c.resolveSeries(row),'NPB');
 const a=c.standardAudit(row);
 assert.equal(a.status,'is808-mass-area-inertia-checked',id);
 assert.equal(a.sourceTable,3,id);
 assert.equal(a.sourcePdfPage,n<=49?11:n<=73?12:n<=97?13:14,id);
 assert.equal(a.geometryChecked,false,id);
 assert.equal(compare.quantityGate(c,row).allowed,true,id);
 for(const field of ['id','sourceId','series','designation','qualityFlag',
   'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4',
   'zxCm3','zyCm3','webMm','flangeMm']){
  const value=row[field];
  const changed={...row,[field]:typeof value==='number'?value+1:
    value===null?'modified':String(value)+'-modified'};
  if(field!=='id')assert.equal(c.standardAudit(changed).status,'is808-numeric-conflict',id+' '+field);
  else assert.notEqual(c.standardAudit(changed).status,'is808-mass-area-inertia-checked',id+' identity');
  assert.equal(compare.quantityGate(c,changed).allowed,false,id+' '+field);
 }
}
assert.equal(c.standardAudit(c.byId('OSD40')).status,'is808-mass-area-inertia-checked');
const npb=status.summarize(c,compare,c.sections.filter(row=>c.resolveSeries(row)==='NPB'));
assert.deepEqual({...npb.counts},{checked:71,review:0,hold:0});
assert.equal(npb.total,71);
const all=status.summarize(c,compare,c.sections);
assert.ok(all.counts.checked>=429&&all.counts.review<=309);
assert.ok(all.counts.hold>=19);
assert.equal(all.counts.checked+all.counts.review+all.counts.hold,757);
assert.equal(all.total,757);
const source=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=source.split('IS808_V52_ROW_CHECKS=Object.freeze([')[1]?.split(']);')[0]||'';
assert.equal((ledger.match(/fingerprint:/g)||[]).length,69);
assert.equal(fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')),false);
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').match(/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/));
console.log('STEEL V52 PASS: all 69 source checks preserved; 71/71 NPB rows limited verified; aggregate audit totals may increase.');
