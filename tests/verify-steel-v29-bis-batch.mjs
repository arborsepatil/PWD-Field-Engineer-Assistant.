/** Steel audit V29: 8 independently checked owner-held BIS Table 1 records.
 * Original IS 808:2021 physical PDF pages 7–8; source document stays private.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const scope={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-osdag.js'),scope,{filename:'pwd-steel-osdag.js'});
scope.PWDSteelOsdag=scope.module.exports;
scope.module={exports:{}};
vm.runInNewContext(read('pwd-steel-catalog.js'),scope,{filename:'pwd-steel-catalog.js'});
const cat=scope.module.exports;
scope.module={exports:{}};
vm.runInNewContext(read('pwd-steel-compare.js'),scope,{filename:'pwd-steel-compare.js'});
const compare=scope.module.exports;
assert.equal(cat.is808AuditSampleCount,42,'Preserve previous 42-row sample ledger');
assert.equal(cat.is808V29AuditSampleCount,8);
assert.equal(cat.is808TotalLimitedAuditSamples,50);
const cases=[
 {series:'MB',d:175,b:85,m:19.50,a:24.8,ix:1260,iy:76.6,web:5.8,flange:9,page:7},
 {series:'MB',d:225,b:110,m:31.15,a:39.7,ix:3440,iy:218,web:6.5,flange:11.8,page:7},
 {series:'MB',d:350,b:140,m:52.33,a:66.7,ix:13600,iy:537,web:8.1,flange:14.2,page:7},
 {series:'MB',d:400,b:140,m:61.55,a:78.4,ix:20400,iy:622,web:8.9,flange:16,page:8},
 {series:'WB',d:175,b:125,m:22.06,a:28.1,ix:1510,iy:188,web:5.8,flange:7.4,page:8},
 {series:'WB',d:200,b:140,m:28.80,a:36.7,ix:2620,iy:328,web:6.1,flange:9,page:8},
 {series:'WB',d:203,b:152,m:52.09,a:66.4,ix:4780,iy:809,web:8.9,flange:16.5,page:8},
 {series:'WB',d:225,b:150,m:33.93,a:43.2,ix:3920,iy:448,web:6.4,flange:9.9,page:8}
];
for(const t of cases){
 const row=cat.sections.find(x=>x.sourceId==='osdag808'&&x.series===t.series&&x.depthMm===t.d&&x.widthMm===t.b&&Math.abs(x.kgPerM-t.m)<1e-9);
 assert.ok(row,'Missing matching Osdag '+t.series+' '+t.d+'x'+t.b);
 for(const [key,num] of Object.entries({kgPerM:t.m,areaCm2:t.a,ixCm4:t.ix,iyCm4:t.iy,webMm:t.web,flangeMm:t.flange}))
  assert.equal(row[key],num,'BIS PDF p'+t.page+' '+t.series+' '+t.d+'x'+t.b+' '+key);
 const verified=cat.standardAudit(row);
 assert.equal(verified.status,'is808-mass-area-inertia-checked','Only reviewed values may be promoted');
 assert.equal(verified.sourceTable,1);
 assert.equal(verified.sourcePdfPage,t.page);
 assert.equal(verified.geometryChecked,false,'Absent slope/radii MUST NOT be claimed checked');
 assert.equal(compare.audit(cat,row).status,'checked','Comparison reflects source check');
 const wrong={...row,kgPerM:Number((row.kgPerM+.01).toFixed(2))};
 assert.equal(cat.standardAudit(wrong).status,'is808-numeric-conflict','0.01 kg/m mismatch must be blocked');
 assert.equal(compare.audit(cat,wrong).status,'hold');
}
const app=read('pwd-steel-app.js'),html=read('pwd_steel_table.html');
assert.ok(app.includes("['Root radius R₁ (mm)',row.r1Mm]"),'Real R1 source property visible');
assert.ok(app.includes("['Toe radius R₂ (mm)',row.r2Mm]"),'Real R2 source property visible');
assert.ok(!app.includes('row.rootRadiusMm')&&!app.includes('row.toeRadiusMm'),'No obsolete fillet-radius names');
assert.ok(html.includes('id="steelKeyAudit"'),'Source status beside unit mass');
assert.ok(app.includes('comparison.audit(catalog,selected)')&&app.includes('dataset.audit=auditState.status'),'Hold/pending statuses beside mass');
assert.ok(app.includes('HOLD · Source conflict'),'Held nominal mass unmistakable');
assert.ok(!html.includes('id="steelExport"')&&!html.includes('id="steelPrint"'));
console.log('V29 Steel BIS PASS: eight limited IS808 Table 1 MB/WB records, separate WB200 variants, 0.01 kg/m holds, missing slope/radii unverified, R1/R2 visible.');
