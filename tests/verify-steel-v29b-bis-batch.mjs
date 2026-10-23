/** V29B: Second eight-record source audit, BIS IS 808:2021 private physical PDF p8. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-osdag.js'),ctx);
ctx.PWDSteelOsdag=ctx.module.exports;ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-catalog.js'),ctx);
const catalog=ctx.module.exports;
assert.equal(catalog.is808AuditSampleCount,42,'Existing original source ledger');
assert.equal(catalog.is808V29AuditSampleCount,8,'First eight-row V29 batch');
assert.equal(catalog.is808V29BAuditSampleCount,8,'Second eight-row V29 batch');
assert.equal(catalog.is808TotalLimitedAuditSamples,58,'Total limited BIS ledger rows');
const cases=[
 ['MB',450,150,72.38,92.2,30400,834,9.4,17.4],
 ['MB',500,180,86.88,110,45200,1360,10.2,17.2],
 ['MB',550,190,103.64,132,64900,1830,11.2,19.3],
 ['MB',600,210,121,154,90200,2570,12,20.3],
 ['WB',250,200,40.84,52,5940,857,6.7,9],
 ['WB',300,200,48.12,61.3,9820,990,7.4,10],
 ['WB',350,200,56.89,72.4,15500,1170,8,11.4],
 ['WB',400,200,66.71,85,23400,1380,8.6,13]
];
assert.equal(cases.length,8);
for(const [series,d,b,mass,area,ix,iy,web,flange] of cases){
 const row=catalog.sections.find(x=>x.sourceId==='osdag808'&&x.series===series&&x.depthMm===d&&x.widthMm===b);
 assert.ok(row,'Osdag source row absent '+series+' '+d);
 for(const [k,v] of Object.entries({kgPerM:mass,areaCm2:area,ixCm4:ix,iyCm4:iy,webMm:web,flangeMm:flange}))
  assert.equal(row[k],v,'BIS 808 Table 1 p8 '+series+' '+d+' '+k);
 const audit=catalog.standardAudit(row);
 assert.equal(audit.status,'is808-mass-area-inertia-checked');
 assert.equal(audit.sourceTable,1);
 assert.equal(audit.sourcePdfPage,8);
 assert.equal(audit.geometryChecked,false,'No invented slope/radius checks');
 for(const [field,increment] of [['kgPerM',0.01],['areaCm2',0.01],['ixCm4',1],['iyCm4',1],['webMm',0.01],['flangeMm',0.01]]){
  const corrupted={...row,[field]:Number((row[field]+increment).toFixed(3))};
  assert.equal(catalog.standardAudit(corrupted).status,'is808-numeric-conflict','Numeric source deviation not held: '+series+' '+d+' '+field);
 }
}
console.log('V29B BIS PASS: 8 more directly read MB/WB Table 1 source rows; 48 altered-field conflict checks; 58 total selected BIS sample records; no inferred geometry.');
