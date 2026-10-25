/* V53 exact PBP bearing pile source checks. BIS numerical tables omitted. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const ids=Array.from({length:28},(_,i)=>'OSD'+(265+i));
assert.equal(cat.is808V53AuditSampleCount,28);
assert.equal(cat.sections.length,757);
for(const id of ids){
 const row=cat.byId(id),n=Number(id.slice(3));
 assert.ok(row,'Missing pile '+id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(row.family,'pile','PBP is a bearing pile, not ordinary beam');
 assert.equal(cat.resolveSeries(row),'PBP');
 const a=cat.standardAudit(row);
 assert.equal(a.status,'is808-mass-area-inertia-checked',id);
 assert.equal(a.sourceTable,13,id);
 assert.equal(a.sourcePdfPage,n<=272?40:41,id);
 assert.equal(a.geometryChecked,false);
 assert.equal(compare.quantityGate(cat,row).allowed,true);
 for(const key of ['id','sourceId','series','designation','qualityFlag',
   'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4',
   'zxCm3','zyCm3','webMm','flangeMm','family']){
  const v=row[key],copy={...row,[key]:typeof v==='number'?v+1:
    v===null?'changed':String(v)+'-changed'};
  if(key!=='id'&&key!=='family')assert.equal(cat.standardAudit(copy).status,'is808-numeric-conflict',id+' '+key);
  else assert.notEqual(cat.standardAudit(copy).status,'is808-mass-area-inertia-checked',id+' invalidated identity or family');
  assert.equal(compare.quantityGate(cat,copy).allowed,false,id+' '+key);
 }
}
assert.equal(cat.standardAudit(cat.byId('OSD264')).status,'is808-mass-area-inertia-checked');
const pbp=status.summarize(cat,compare,cat.sections.filter(x=>cat.resolveSeries(x)==='PBP'));
assert.deepEqual({...pbp.counts},{checked:30,review:0,hold:0});
assert.equal(pbp.total,30);
const overall=status.summarize(cat,compare,cat.sections);
assert.ok(overall.counts.checked>=457&&overall.counts.review<=281);
assert.equal(overall.counts.hold,19);
assert.equal(overall.total,757);
const source=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=source.split('IS808_V53_ROW_CHECKS=Object.freeze([')[1]?.split(']);')[0]||'';
assert.equal((ledger.match(/fingerprint:/g)||[]).length,28);
assert.equal(fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')),false);
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').includes('pwd-tools-steel-v53-2026-10-25'));
console.log('STEEL V53 PASS: 28 newly verified exact PBP variants; 30/30 pile sections checked; all quantities gated by source identity.');
