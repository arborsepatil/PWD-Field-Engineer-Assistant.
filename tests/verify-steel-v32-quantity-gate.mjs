/** V32 Steel: quantity must not use unsampled or conflicting nominal kg/m.
 * Tests the exact production gate and the real calculator source,
 * including all 757 catalogue/Osdag rows, not illustrative hardcoded totals.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const home=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(home,p),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-osdag.js'),ctx,{filename:'pwd-steel-osdag.js'});
ctx.PWDSteelOsdag=ctx.module.exports;
ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-catalog.js'),ctx,{filename:'pwd-steel-catalog.js'});
const catalog=ctx.module.exports;
ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-compare.js'),ctx,{filename:'pwd-steel-compare.js'});
const comparison=ctx.module.exports;
const app=read('pwd-steel-app.js'),html=read('pwd_steel_table.html'),sw=read('sw.js');
const start=app.indexOf('function calculate(){');
const end=app.indexOf('function updateResult(){',start);
assert.ok(start>=0&&end>start,'Production calculate() control flow missing');
new vm.Script(app,{filename:'pwd-steel-app.js'});
const run=new Function('selected','catalog','math','$','source','family','comparison',app.slice(start,end)+'\nreturn calculate();');
let calls=0;
const math={
 quantity:(r,L,N)=>{calls++;return {unitMassKgM:r.kgPerM,totalMassKg:r.kgPerM*Number(L)*Number(N)};},
 geometricMass:()=>{calls++;return {unitMassKgM:10,totalMassKg:120};}
};
const $=id=>({value:id==='steelLength'?'6':id==='steelCountPieces'?'2':'0'});
const source=id=>catalog.SOURCES[id]||{label:'Unknown source',date:'Unknown',url:''};
const calc=(row,family='beam')=>run(row,catalog,math,$,source,family,comparison);
const rows=catalog.sections;
assert.ok(rows.length>=750);
let checked=0,pending=0,held=0;
for(const row of rows){
 const state=comparison.audit(catalog,row);
 const gate=comparison.quantityGate(catalog,row);
 if(state.status==='hold'){held++;assert.equal(gate.allowed,false)}
 else if(state.status==='review'){pending++;assert.equal(gate.allowed,false)}
 else {checked++;assert.equal(gate.allowed,true);assert.equal(gate.category,'limited-check')}
 assert.equal(gate.allowed,state.status==='checked','Eligibility diverges from source-status audit: '+row.id);
 const before=calls;
 if(gate.allowed){
  const q=calc(row,row.family);
  assert.equal(q.q.totalMassKg,row.kgPerM*12);
  assert.equal(calls,before+1);
 }else{
  assert.throws(()=>calc(row,row.family),/Quantity blocked|source|below 2 mm|IS 1161|Mass\/area/i,'Unverified mass silently calculated: '+row.id);
  assert.equal(calls,before,'Unverified section invoked calculator: '+row.id);
 }
}
assert.equal(rows.length,checked+pending+held);
assert.ok(checked>100&&pending>300&&held>=10,'Source statuses unexpectedly changed; inspect audit before release');
const beam=catalog.byId('ISMB300');
assert.equal(comparison.quantityGate(catalog,beam).allowed,true);
assert.ok(comparison.quantityGate(catalog,beam).message.includes('Provisional'));
const synthetic={...beam,id:'adversarial-geometry-check',kgPerM:beam.kgPerM+3};
assert.equal(comparison.quantityGate(catalog,synthetic).allowed,false,'Conflicting known mass must not calculate');
const pendingRow=rows.find(r=>comparison.audit(catalog,r).status==='review');
assert.ok(pendingRow);
assert.match(comparison.quantityGate(catalog,pendingRow).message,/nominal weight.*not been checked/);
assert.equal(comparison.quantityGate(catalog,{...beam,id:'nonfinite',kgPerM:NaN}).category,'invalid');
const guessed={...beam,series:'ZZ',id:'artificial',depthMm:300,widthMm:140,kgPerM:beam.kgPerM,flangeSlopeDeg:90};
assert.equal(comparison.quantityGate(catalog,guessed).allowed,false,'Geometry alone never certifies source mass');
const fakeGeometry={
 standardAudit:()=>({status:'not-checked',geometryChecked:true,note:'Test-only geometry claim'}),
 auditRow:()=>[]
};
assert.equal(comparison.quantityGate(fakeGeometry,beam).allowed,false,'Only geometry verified: mass still blocked');
assert.ok(html.includes('id="steelQuantitySourceGate"'),'UI must disclose eligibility before numeric result');
assert.ok(app.includes('comparison.quantityGate(catalog,selected)'),'Actual app source guard missing');
assert.ok(app.includes('if(!eligibility.allowed)throw Error(eligibility.message)'),'Calculator must fail closed');
assert.ok(app.includes("$('steelCalculate').disabled=!quantityState.allowed"),'Button must be inactive when unverified');
assert.ok(app.includes(' · UNVERIFIED'),'Comparison must mark unverified weights explicitly');
assert.ok(!html.includes('id="steelExport"')&&!html.includes('id="steelPrint"'),'User does not want exports');
assert.ok(sw.includes("'./pwd-steel-compare.js'"),'Offline approval gate not packaged');
console.log('Steel V32 PASS: '+rows.length+' source rows evaluated, '+checked+' provisionally calculable checked weights, '+pending+' reference-only values, '+held+' held records; real calculator never uses a pending/held nominal kg/m.');
