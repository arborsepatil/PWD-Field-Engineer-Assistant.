/* Steel V41: full catalogue status controls, source custody and quantity safety. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const context={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-osdag.js'),context,{filename:'pwd-steel-osdag.js'});
context.PWDSteelOsdag=context.module.exports;context.module={exports:{}};
vm.runInNewContext(read('pwd-steel-catalog.js'),context,{filename:'pwd-steel-catalog.js'});
const cat=context.module.exports;
context.module={exports:{}};
vm.runInNewContext(read('pwd-steel-compare.js'),context,{filename:'pwd-steel-compare.js'});
const compare=context.module.exports;
context.module={exports:{}};
vm.runInNewContext(read('pwd-steel-status.js'),context,{filename:'pwd-steel-status.js'});
const status=context.module.exports;
const items=cat.sections;
assert.equal(items.length,757,'Any catalogue record count change needs explicit audit');
const full=status.summarize(cat,compare,items);
assert.equal(full.total,757);
assert.equal(full.counts.checked+full.counts.review+full.counts.hold,757);
assert.ok(full.counts.checked>100&&full.counts.review>=0&&full.counts.hold>=0,
 'Audit counts must remain valid as sources are checked or previous holds resolved');
assert.equal(full.records.length,757);
for(const filter of ['all','checked','review','hold']){
 const selected=status.select(cat,compare,items,filter);
 assert.equal(selected.total,757,'Filter must not falsify total size of reference catalogue');
 const expected=filter==='all'?757:full.counts[filter];
 assert.equal(selected.rows.length,expected);
 for(const row of selected.rows){
  const audit=compare.audit(cat,row);
  if(filter!=='all')assert.equal(audit.status,filter,'Mismatched source type in '+filter+' subset: '+row.id);
  if(filter==='checked')assert.equal(compare.quantityGate(cat,row).allowed,true,'Quantity gate disagrees for '+row.id);
  if(filter==='review'||filter==='hold')assert.equal(compare.quantityGate(cat,row).allowed,false,'Unverified row allowed: '+row.id);
 }
 const expectedRows=items.filter(x=>filter==='all'||compare.audit(cat,x).status===filter);
 assert.deepEqual(Array.from(selected.rows,r=>r.id),Array.from(expectedRows,r=>r.id),'Source order must stay stable');
}
for(const bad of ['unknown','checked-unsafe','geometry-only',null]){
 assert.throws(()=>status.select(cat,compare,items,bad));
}
const explicit=cat.byId('ISMB300');
assert.equal(compare.quantityGate(cat,explicit).allowed,true);
assert.ok(status.select(cat,compare,[explicit],'checked').rows.length===1);
const pending=items.find(row=>compare.audit(cat,row).status==='review');
const held=items.find(row=>compare.audit(cat,row).status==='hold');
if(pending)assert.equal(status.select(cat,compare,[pending],'checked').rows.length,0);
else assert.equal(full.counts.review,0);
if(held)assert.equal(status.select(cat,compare,[held],'checked').rows.length,0);
else assert.equal(full.counts.hold,0);
// Even if a regression makes the audit summary contradictory, fail closed.
const mismatch={
 audit:()=>({status:'checked'}),
 quantityGate:()=>({allowed:false})
};
const corrupted=status.summarize(cat,mismatch,[explicit]);
assert.equal(corrupted.counts.hold,1);
assert.equal(corrupted.records[0].quantityAllowed,false);
const html=read('pwd_steel_table.html'),app=read('pwd-steel-app.js');
for(const id of ['steelAuditFilter','steelAuditSummary','steelCatalogueAudit','steelStatus','steelKeyAudit','steelQuantitySourceGate','steelCalculate','steelCount','steelSeries','steelSearch','steelResults','steelMoreSizes','steelSectionDiagram','steelCompareCard']){
 assert.ok(html.includes('id="'+id+'"'),'Lost Steel Table control '+id);
}
assert.ok(html.includes('<option value="checked" selected>Working · source-checked</option>'),'Source-checked records must be shown by default');
assert.ok(html.includes('<option value="review">Pending verification'));
assert.ok(html.includes('<option value="hold">Historical / unresolved · reference only</option>'),'Held records remain inspectable but separated from working library');
assert.ok(html.includes('src="./pwd-steel-status.js"'));
assert.ok(html.includes('BIS-amended table'),'Keep standards edition warning');
assert.ok(app.includes('steelStatus.select(catalog,comparison,rawRows'), 'Displayed filters must use source-checked actual records');
assert.ok(app.includes('steelStatus.summarize(catalog,comparison,catalog.sections)'), 'Source register counts must come from all records');
assert.ok(app.includes("comparison.quantityGate(catalog,selected)"),'Actual quantity arithmetic gate must remain');
assert.ok(app.includes("if(!eligibility.allowed)throw Error(eligibility.message)"),'Provisional quantity must not bypass source lock');
assert.ok(app.includes("shownLimit=60;renderRows();renderDetail();updateSelectedSummary();updateResult()"),'Re-filter must update current selection');
new vm.Script(app,{filename:'pwd-steel-app.js'});
assert.ok(read('sw.js').includes("'./pwd-steel-status.js'"),'Public offline cache missing source status script');
assert.ok(read('android/scripts/prepare_assets.py').includes('".js"'),'APK must include source status JavaScript');
console.log('STEEL V41 PASS: '+full.total+' records; checked='+full.counts.checked+' pending='+full.counts.review+' hold='+full.counts.hold+'; all filters preserve quantity block and original source order.');
