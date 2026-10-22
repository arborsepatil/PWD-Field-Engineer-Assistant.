/**
 * Steel V13 — twelve hand-checked representative SHS/RHS sizes spanning
 * 20 mm to 500 mm, from owner-held consolidated IS 4923:2017.
 *
 * Checked source: Amendment 2 Table 1 PDF pp.21/24/25, Table 2
 * PDF pp.27/28/29/30. Amendment 3 changes twelve OTHER corrected RHS
 * nominal masses (V9 ledger), which remain covered by earlier tests.
 *
 * This is not a BIS licence, product inspection, material-grade approval,
 * or a copy of the complete copyrighted standard.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-catalog.js'),ctx,{filename:'pwd-steel-catalog.js'});
const cat=ctx.module.exports;
const samples=[
 // id, family, depth, width, t, kg/m, area cm², Ix cm⁴, Iy cm⁴, source PDF page
 ['bis22-shs20x20x2','SHS',20,20,2,1.05,1.34,0.69,0.69,21],
 ['bis22-shs25x25x2.5','SHS',25,25,2.5,1.64,2.09,1.69,1.69,21],
 ['bis22-shs45x45x4','SHS',45,45,4,4.83,6.15,16.61,16.61,21],
 ['bis22-shs150x150x6','SHS',150,150,6,26.40,33.63,1146,1146,24],
 ['bis22-shs250x250x12','SHS',250,250,12,86.77,110.54,10254,10254,25],
 ['bis22-shs400x400x16','SHS',400,400,16,187.75,239.18,57946,57946,25],
 ['bis22-rhs80x50x2','RHS',80,50,2,3.88,4.94,43.44,21.06,27],
 ['bis22-rhs120x80x3','RHS',120,80,3,8.96,11.41,230.20,123.43,28],
 ['bis22-rhs180x100x6','RHS',180,100,6,24.52,31.23,1309.61,523.83,29],
 ['bis22-rhs300x100x6','RHS',300,100,6,35.82,45.63,4777,842,29],
 ['bis22-rhs500x300x10','RHS',500,300,10,120.44,153.43,52867,24127,30],
 ['bis22-rhs500x300x12','RHS',500,300,12,143.29,182.54,62169,28294,30]
];
assert.equal(samples.length,12);
assert.equal(new Set(samples.map(x=>x[0])).size,12,'No repeated audit sizes');
assert.equal(cat.sections.length,127,'All previously checked catalog sections preserved');
assert.equal(cat.sections.filter(x=>x.family==='hollow').length,59);
assert.equal(cat.sections.filter(x=>x.series==='SHS').length,22);
assert.equal(cat.sections.filter(x=>x.series==='RHS').length,35);
assert.equal(cat.shsAuditSampleCount,22);
assert.equal(cat.rhsAuditSampleCount,35);
const eq=(actual,expected,label)=>assert.equal(actual,expected,label);
for(const [id,series,depth,width,t,mass,area,ix,iy,pdfpage] of samples){
 const row=cat.byId(id);
 assert.ok(row,'Missing checked size '+id+' in BIS PDF page '+pdfpage);
 eq(row.series,series,id+' family');
 eq(row.depthMm,depth,id+' depth');
 eq(row.widthMm,width,id+' width');
 eq(row.thicknessMm,t,id+' wall');
 eq(row.kgPerM,mass,id+' nominal kg/m');
 eq(row.areaCm2,area,id+' area');
 eq(row.ixCm4,ix,id+' major inertia');
 eq(row.iyCm4,iy,id+' minor inertia');
 eq(row.sourceId,'bis4923Spot2022',id+' BIS amendment source');
 eq(row.basis,'bis-table-spot-audited',id+' audit boundary');
 eq(cat.standardAudit(row).status,series==='RHS'?'rhs-weight-checked':'shs-row-checked',id+' verification');
 assert.deepEqual([...cat.auditRow(row)],[],id+' basic numerical health');
 // Internal density plausibility check, NOT a BIS manufacturing tolerance.
 assert.ok(Math.abs(mass-area*0.785)/mass<=.02,id+' density consistency');
 const wrong={...row,kgPerM:Number((mass+.01).toFixed(2))};
 assert.equal(cat.standardAudit(wrong).status,series==='RHS'?'rhs-weight-conflict':'shs-row-conflict',
  id+' 0.01 kg/m corruption must be caught');
}
const refs=cat.codeReferences;
const cert=refs.find(x=>x.uri.includes('Revised-PM-template-4923.pdf'));
assert.ok(cert,'Updated 2024 BIS product manual reference absent');
assert.match(cert.scope,/grade|MTC/i);
const distinct=refs.find(x=>x.standard.includes('IS 18573:2024'));
assert.ok(distinct,'Non-structural alternative standard boundary absent');
assert.match(distinct.scope,/does not authorize structural use/i);
assert.equal(cat.standardAudit({series:'SHS',depthMm:70,widthMm:70,thicknessMm:2,kgPerM:4}).status,
 'not-checked','Non-audited SHS mass must not receive a BIS check label');
assert.equal(cat.standardAudit({series:'RHS',depthMm:120,widthMm:80,thicknessMm:6,kgPerM:16.98,areaCm2:2.63}).status,
 'source-numeric-hold','BIS printed RHS source anomaly remains quarantined');
assert.equal(cat.standardAudit(cat.byId('bis24-rhs260x180x12')).status,'rhs-weight-checked',
 'Corrected Amendment 3 mass must retain its separate mass-only verification');
console.log('Steel V13 PASS: 12 added SHS/RHS numerical source spot-checks; 22 SHS and 35 RHS verified samples; BIS product manual and IS 18573 boundary verified.');
