/* V49: 24 additional WPB Table 4 limited source checks, exact variants.
 * The owner-held copyrighted BIS table stays outside this repository.
 */
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
const IDs=Array.from({length:24},(_,i)=>'OSD'+(147+i));
assert.equal(cat.sections.length,757);
assert.equal(cat.is808V49AuditSampleCount,24);
assert.equal(new Set(IDs).size,24);
for(const id of IDs){
 const row=cat.byId(id),number=Number(id.slice(3));
 assert.ok(row,'WPB variant missing '+id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(row.family,'beam');
 assert.equal(cat.resolveSeries(row),'WPB');
 const audit=cat.standardAudit(row);
 assert.equal(audit.status,'is808-mass-area-inertia-checked',id);
 assert.equal(audit.sourceTable,4,id);
 assert.equal(audit.sourcePdfPage,number<=160?16:17,id);
 assert.equal(audit.geometryChecked,false,'Only limited properties audited');
 assert.equal(compare.audit(cat,row).status,'checked',id);
 assert.equal(compare.quantityGate(cat,row).allowed,true,id);
 for(const key of ['id','sourceId','series','designation','qualityFlag',
  'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4',
  'zxCm3','zyCm3','webMm','flangeMm']){
   const original=row[key];
   const changed={...row,[key]:typeof original==='number'?original+1:
     original===null?'tampered':String(original)+'-tampered'};
   const alteredAudit=cat.standardAudit(changed);
   if(key==='id')
    assert.notEqual(alteredAudit.status,'is808-mass-area-inertia-checked','Altered ID loses certification '+id);
   else assert.equal(alteredAudit.status,'is808-numeric-conflict',id+' '+key);
   assert.equal(compare.quantityGate(cat,changed).allowed,false,
     'Mutated value must never authorize quantity: '+id+' '+key);
 }
}
// A listed mass variant is not interchangeable with any other in the same
// nominal WPB series. The exact 200 mm nominal set has eight variations.
const wpb200=IDs.map(id=>cat.byId(id)).filter(r=>r.designation.startsWith('WPB 200 X 200'));
assert.equal(wpb200.length,8);
assert.equal(new Set(wpb200.map(r=>r.kgPerM)).size,8);
assert.ok(wpb200.every(r=>compare.quantityGate(cat,r).allowed));
for(const id of ['OSD193','OSD194','OSD195','OSD196']){
 const row=cat.byId(id);
 assert.ok(row);
 assert.equal(compare.audit(cat,row).status,'hold','Previously held WPB still blocked: '+id);
 assert.equal(compare.quantityGate(cat,row).allowed,false,id);
}
for(const id of ['OSD180']){
 const row=cat.byId(id);
 assert.ok(row);
 assert.equal(compare.audit(cat,row).status,'review','Unreviewed next WPB section must remain pending');
 assert.equal(compare.quantityGate(cat,row).allowed,false);
}

/* V50 extends the same guarded WPB series without altering the source table. */
const extraIDs=Array.from({length:22},(_,i)=>'OSD'+(171+i)).filter(x=>x!=='OSD180');
assert.equal(extraIDs.length,21);
assert.equal(cat.is808V50AuditSampleCount,21);
for(const id of extraIDs){
 const r=cat.byId(id),b=cat.standardAudit(r);
 assert.equal(b.status,'is808-mass-area-inertia-checked',id);
 assert.equal(b.sourceTable,4);
 assert.equal(b.sourcePdfPage,Number(id.slice(3))<=184?17:18);
 assert.equal(b.geometryChecked,false);
 assert.equal(compare.quantityGate(cat,r).allowed,true);
 for(const key of ['kgPerM','areaCm2','depthMm','widthMm','webMm','flangeMm','ixCm4','iyCm4','zxCm3','zyCm3']){
  const changed={...r,[key]:r[key]+1};
  assert.equal(cat.standardAudit(changed).status,'is808-numeric-conflict',id+' '+key);
  assert.equal(compare.quantityGate(cat,changed).allowed,false,id+' '+key);
 }
}
const exception=cat.byId('OSD180');
assert.ok(exception);
assert.equal(cat.standardAudit(exception).status,'not-checked');
assert.equal(compare.quantityGate(cat,exception).allowed,false);

const summary=status.summarize(cat,compare,cat.sections);
assert.ok(summary.counts.checked>=429&&summary.counts.review<=309);
assert.equal(summary.counts.hold,19);
assert.equal(summary.counts.checked+summary.counts.review+summary.counts.hold,757);
assert.equal(summary.total,757);
const wpb=summary.records.filter(r=>cat.resolveSeries(r.row)==='WPB');
assert.deepEqual(wpb.reduce((tot,r)=>(tot[r.status]++,tot),
 {checked:0,review:0,hold:0}),{checked:119,review:1,hold:4});
const source=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=source.split('/* V49: 24 further WPB variants')[1]?.split('/* V50: 21 exact Table 4 WPB')[0]||'';
assert.ok(ledger.includes('IS808_V49_ROW_CHECKS'));
assert.equal((ledger.match(/fingerprint:/g)||[]).length,24);
assert.ok(!/mass:\s*\d|area:\s*\d|ix:\s*\d/.test(ledger));
assert.equal(fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')),false);
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').includes('pwd-tools-steel-v53-2026-10-25'));
console.log('STEEL V49/V50 PASS: previous 24+21 WPB variants remain source-checked; all five WPB exceptions blocked.');
