/** V28 Steel: practical comparison and preserve source uncertainty. No invented BIS numbers. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-osdag.js'),ctx,{filename:'pwd-steel-osdag.js'});
ctx.PWDSteelOsdag=ctx.module.exports;
ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-catalog.js'),ctx,{filename:'pwd-steel-catalog.js'});
const cat=ctx.module.exports;
ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-compare.js'),ctx,{filename:'pwd-steel-compare.js'});
const compare=ctx.module.exports;
const rows=cat.sections;
assert.ok(rows.length>=750,'Compare must audit all curated and 640 licensed Osdag sections');
const members=[cat.byId('ISMB300'),cat.byId('ISMB200')].filter(Boolean);
assert.equal(members.length,2,'Actual medium-beam reference rows must be present');
const actual=compare.build(cat,members);
assert.equal(actual.length,2);
assert.equal(actual[0].kgPerM,46.02);
assert.equal(actual[0].depthMm,300);
assert.equal(actual[0].widthMm,140);
assert.equal(actual[0].audit.status,'checked','Existing verified sample should retain limited source status');
assert.ok(actual[0].audit.note,'Limited audit scope must remain visible');
assert.ok(!actual[0].loadCapacity,'Comparison must not imply structural load capacity');
assert.throws(()=>compare.build(cat,[members[0],members[0]]),/cannot be compared with itself/);
const different=cat.sections.find(x=>x.family==='channel');
assert.ok(different);
assert.throws(()=>compare.build(cat,[members[0],different]),/one section family/);
const conflict={...members[0],id:'synthetic-conflict',kgPerM:50.02};
const held=compare.build(cat,[conflict,members[1]])[0];
assert.equal(held.audit.status,'hold','Source numerical conflict cannot show checked');
assert.equal(held.kgPerM,50.02,'Show actual source-row mass, not silently replace it');
const pending=cat.sections.find(x=>cat.standardAudit(x).status==='not-checked'&&cat.auditRow(x).length===0);
assert.ok(pending,'There should be pending source rows, not all labeled certified');
assert.equal(compare.audit(cat,pending).status,'review');
const unit=cat.sections.find(x=>x.family==='hollow'&&x.series==='CHS');
assert.ok(unit,'CHS should be supported in comparison');
assert.equal(compare.dimension(unit).width,null,'Circular hollow has diameter, not a width');
const flaggedOpen=rows.filter(x=>x.qualityFlag==='mass-area-inconsistent');
assert.equal(flaggedOpen.length,6,'The original six inconsistent Osdag source rows must remain flagged');
for(const x of flaggedOpen)assert.equal(compare.audit(cat,x).status,'hold','Do not compare an inconsistent open-source row as verified');
for(const r of rows){
 const a=compare.audit(cat,r);
 assert.ok(['hold','checked','review'].includes(a.status));
 if(compare.HOLD.has(cat.standardAudit(r).status)||cat.auditRow(r).length>0)
  assert.equal(a.status,'hold','Conflicting value must stay on hold: '+r.id);
 const display=compare.build(cat,[r])[0];
 for(const key of ['depthMm','widthMm','thicknessMm','areaCm2','ixCm4','iyCm4'])
  assert.ok(display[key]===null||Number.isFinite(display[key]),'A missing property must not be fabricated: '+r.id+' '+key);
}
const html=read('pwd_steel_table.html'),app=read('pwd-steel-app.js'),sw=read('sw.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
for(const id of ['steelCompareCard','steelCompareChips','steelCompareClear','steelCompareResults','steelCompareAdd',
 'steelMainDepth','steelMainWidth','steelMainThickness','steelMass','steelSectionDiagram','steelQuantityDisclosure','steelStandardsDisclosure'])
 assert.ok(html.includes('id="'+id+'"'),'Important section missing: '+id);
assert.ok(html.indexOf('id="steelSectionDiagram"')<html.indexOf('id="steelQuantityDisclosure"'),'Diagram and dimensions must be above calculator');
assert.ok(html.indexOf('id="steelCompareCard"')<html.indexOf('id="steelQuantityDisclosure"'),'Comparison must precede optional quantity');
assert.ok(html.includes('<summary>Quantity calculator · optional</summary>'),'Quantity should be collapsed, not primary');
assert.ok(html.includes('<summary>More section properties</summary>'),'Less-used detailed properties should be collapsible');
assert.ok(!html.includes('id="steelExport"')&&!html.includes('id="steelPrint"'),'Copy/export/print must be removed from UI');
assert.ok(!app.includes('saveCsv()')&&!app.includes('window.print()'),'No hidden export action in page');
assert.ok(app.includes('comparison.build(catalog,items)'),'Use tested comparison model, not UI-only invented figures');
assert.ok(app.includes('toggleCompare(row)')&&app.includes('compareIds.length<8'),'Support multiple same-family members');
assert.ok(app.includes("x.audit.status==='hold'"),'On-hold values must be conspicuous during comparison');
assert.ok(html.includes('pwd-steel-compare.js')&&sw.includes("'./pwd-steel-compare.js'"),'Comparison must work offline in both Android and PWA');
assert.ok(html.includes('id="steelDataCaution"')&&html.includes('id="steelStandards"'),'Original source caveats must remain');
const statusCount=rows.reduce((a,row)=>{const label=compare.audit(cat,row).status;a[label]=(a[label]||0)+1;return a},{});
console.log('V28 Steel PASS: section comparison, dimension fallbacks, conflicting records held, source labeling, clear mobile hierarchy, offline module, no copy/export, '+JSON.stringify(statusCount));
