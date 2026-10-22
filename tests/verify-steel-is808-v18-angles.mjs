/** V18: source-limited IS 808:2021 Table 9 equal-angle audit (12 rows).
 * Expectations independently checked from private user-held original PDF,
 * physical PDF pages 30–32. THIS SOURCE PDF IS NOT DISTRIBUTED.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const code=read('pwd-steel-catalog.js');
const ctx={module:{exports:{}}};
vm.runInNewContext(code,ctx,{filename:'pwd-steel-catalog.js'});
const cat=ctx.module.exports;
const samples=[
 // Equal-angle leg(mm), t(mm), Table 9 kg/m, area(cm2), Izz/Iyy(cm4), physical PDF page
 [50,5,3.79,4.83,11.3,30],
 [50,6,4.49,5.72,13.2,30],
 [60,5,4.58,5.84,20.0,30],
 [60,6,5.44,6.93,23.4,30],
 [60,8,7.10,9.05,29.8,30],
 [65,5,4.98,6.34,25.7,30],
 [75,8,9.00,11.4,60.3,31],
 [80,8,9.65,12.3,74.0,31],
 [90,10,13.47,17.1,129,31],
 [100,10,15.04,19.1,180,31],
 [150,12,27.29,34.7,746,32],
 [200,16,48.53,61.8,2360,32]
];
assert.equal(samples.length,12);
assert.equal(new Set(samples.map(([d,t])=>d+'x'+t)).size,12);
assert.equal(cat.is808AuditSampleCount,42);
assert.equal(cat.sections.length,130);
assert.equal(cat.sections.filter(x=>x.family==='angle').length,46);
assert.equal(cat.sections.filter(x=>x.sourceId==='is808Spot2021').length,10);
const equal=(a,b)=>assert.ok(Math.abs(a-b)<.005,`Source mismatch: ${a} vs ${b}`);
for(const [leg,t,mass,area,inertia,pdfPage] of samples){
 const sourceRow=code.split('\n').find(l=>l.includes("series:'EQ'")&&l.includes("d:"+leg+",b:"+leg+",t:"+t+",mass:"));
 assert.ok(sourceRow,'IS 808 source audit row missing for angle '+leg+'x'+t);
 assert.match(sourceRow,new RegExp('table:9,pdfPage:'+pdfPage+'\\}'),'PDF page pointer must be physical page');
 const current=(leg===60)?cat.byId(`bis21-ISA${leg}x${leg}x${t}`):
   cat.sections.find(x=>x.family==='angle'&&x.depthMm===leg&&x.widthMm===leg&&
    x.thicknessMm===t&&Math.abs(x.kgPerM-mass)<.005);
 assert.ok(current,'Missing current nominal angle '+leg+'x'+leg+'x'+t);
 equal(current.kgPerM,mass);
 const result=cat.standardAudit(current);
 assert.ok(['is808-mass-checked','is808-mass-area-inertia-checked'].includes(result.status),
   'Source-correct section must pass limited BIS checking: '+leg+'x'+t+' ('+result.status+')');
 if(leg===60){
  assert.equal(current.areaCm2,area);
  assert.equal(current.ixCm4,inertia);
  assert.equal(current.iyCm4,inertia);
  assert.equal(current.sourceId,'is808Spot2021');
  assert.equal(current.basis,'bis-table-spot-audited');
  assert.equal(result.status,'is808-mass-area-inertia-checked');
 }
 assert.ok(Math.abs(mass-area*.785)/mass<.016,'Engineering plausibility only, not BIS tolerance');
 const wrong={...current,kgPerM:Number((mass+.01).toFixed(2))};
 assert.equal(cat.standardAudit(wrong).status,'is808-numeric-conflict',
  'A 0.01 kg/m error is source mismatch, not acceptance tolerance');
}
const differences=[[5,4.50,4.58],[6,5.40,5.44],[8,7.00,7.10]];
const app=read('pwd-steel-app.js');
const start=app.indexOf('function calculate(){'),end=app.indexOf('function updateResult(){',start);
assert.ok(start>=0&&end>start);
const run=new Function('selected','catalog','math','$','source','family',app.slice(start,end)+'\nreturn calculate();');
const $=id=>({value:id==='steelLength'?'6':id==='steelCountPieces'?'2':'0'});
const math={quantity:(row,L,N)=>({unitMassKgM:row.kgPerM,totalMassKg:row.kgPerM*L*N,totalTonnes:row.kgPerM*L*N/1000,basis:'Nominal mass, NOT structural design',totalPrice:null})};
const calc=row=>run(row,cat,math,$,id=>cat.SOURCES[id],'angle');
for(const [t,oldMass,correctMass] of differences){
 const old=cat.byId(`sail23-ISA60x60x${t}`);
 const current=cat.byId(`bis21-ISA60x60x${t}`);
 assert.ok(old&&current);
 assert.equal(old.kgPerM,oldMass,'Keep original SAIL value in provenance');
 assert.equal(current.kgPerM,correctMass,'BIS current nominal value');
 assert.equal(cat.standardAudit(old).status,'is808-numeric-conflict','Historical conflicting nominal mass is unverified');
 assert.throws(()=>calc(old),/IS 808:2021.*conflicts/i,'Wrong historical mass must never produce a calculated quantity');
 assert.equal(calc(current).q.totalMassKg,correctMass*12,'BIS-correct alternative must calculate 6m x 2');
 const selected=cat.search(`ISA 60x60x${t}`,'angle');
 assert.equal(selected[0].id,current.id,'Source-checked nominal mass must be the primary search choice');
 assert.ok(selected.some(x=>x.id===old.id),'Keep manufacturer-original row visible');
}
// Audit metadata is sourced from PDF physical pages, not IS internal print page.
for(const [series,depth,expectedPage] of [['MB',100,7],['MC',75,23],['MC',300,24],
 ['EQ',90,31],['EQ',150,32],['WB',150,8],['HB',200,22],['LB',200,10],
 ['NPB',100,11],['PBP',200,40]]){
 const line=code.split('\n').find(x=>x.includes("series:'"+series+"'")&&x.includes('d:'+depth+','));
 assert.ok(line,'Ledger reference '+series+depth);
 assert.match(line,new RegExp('pdfPage:'+expectedPage+'(?:,|\\})'),'Wrong physical PDF page for '+series+depth);
}
assert.equal(cat.byId('ISA90x90x6').kgPerM,8.2);
assert.equal(cat.standardAudit(cat.byId('ISA90x90x6')).status,'is808-numeric-conflict');
assert.equal(cat.byId('ISMC250').kgPerM,34.2);
assert.equal(cat.standardAudit(cat.byId('ISMC250')).status,'is808-mass-area-inertia-checked');
console.log('Steel V18 PASS: 12 Table 9 equal-angle checks, 3 conflicting manufacturer masses blocked with 3 BIS-correct alternatives, physical PDF page provenance and calculator verified.');
