/* V44 — Exact source audit for 19 new MPC records + pre-checked MPC 150.
 * The proprietary source table is NOT included in app or tests.
 * Source: owner-held IS 808:2021 Fourth Revision, Table 8, PDF pp.27-28.
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
const selector=require('../pwd-steel-status.js');

const ids=Array.from({length:20},(_,i)=>'OSD'+(341+i)).filter(id=>id!=='OSD345');
assert.equal(cat.is808V44AuditSampleCount,19);
assert.equal(new Set(ids).size,19);
assert.equal(cat.sections.length,757);
assert.equal(cat.byId('OSD345'),null,'MPC 150 duplicate stays de-duplicated');
const prior=cat.sections.find(r=>r.series==='MPC'&&r.depthMm===150&&r.widthMm===75&&r.kgPerM===16.8);
assert.ok(prior,'Original curated MPC 150 must remain');
assert.equal(compare.quantityGate(cat,prior).allowed,true,'Original pre-checked MPC 150 remains usable');
for(const id of ids){
 const row=cat.byId(id);
 assert.ok(row,'Original Osdag member absent '+id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(cat.resolveSeries(row),'MPC','No substituting a medium channel');
 assert.equal(row.family,'channel');
 const state=cat.standardAudit(row);
 assert.equal(state.status,'is808-mass-area-inertia-checked',id);
 assert.equal(state.sourceTable,8);
 assert.ok([27,28].includes(state.sourcePdfPage));
 assert.equal(state.geometryChecked,false,'Other geometry cannot be asserted checked');
 assert.equal(compare.audit(cat,row).status,'checked');
 assert.equal(compare.quantityGate(cat,row).allowed,true);
 // Mutating any audited source value must immediately block quantities.
 for(const key of ['kgPerM','areaCm2','depthMm','widthMm','webMm','flangeMm','ixCm4','iyCm4','zxCm3','zyCm3']){
  const old=row[key];
  const tampered={...row,[key]:typeof old==='number'?old+1:String(old)+'-altered'};
  assert.equal(compare.quantityGate(cat,tampered).allowed,false,'Unexpected quantity allowance after changing '+id+' '+key);
 }
}
const variant=[cat.byId('OSD353'),cat.byId('OSD354'),cat.byId('OSD355')];
assert.deepEqual(variant.map(x=>x.depthMm),[250,250,250]);
assert.deepEqual(variant.map(x=>x.widthMm),[80,82,84]);
assert.deepEqual(variant.map(x=>x.kgPerM),[30.6,34.2,38.1]);
assert.equal(new Set(variant.map(x=>x.id)).size,3);
const result=selector.summarize(cat,compare,cat.sections);
assert.equal(result.total,757);
assert.ok(result.counts.checked>=214&&result.counts.review<=523);
assert.equal(result.counts.hold,19);
assert.equal(result.counts.checked+result.counts.review+result.counts.hold,757);
for(const type of ['checked','review','hold']){
 const filtered=selector.select(cat,compare,cat.sections,type);
 assert.equal(filtered.rows.length,result.counts[type]);
}
const script=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=script.split('/* V44: 19 imported Osdag')[1]?.split('// Source-published nominal figures')[0]||'';
assert.ok(ledger.includes('IS808_V44_ROW_CHECKS'));
assert.ok(ledger.includes('fingerprint'));
assert.ok(!ledger.includes('mass:7.14')&&!ledger.includes('mass:38.1'));
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(sw.includes('pwd-tools-steel-v47-2026-10-25'));
console.log('STEEL V44 PASS: 19 MPC Table 8 records remain checked; later batches may extend verified totals.');
