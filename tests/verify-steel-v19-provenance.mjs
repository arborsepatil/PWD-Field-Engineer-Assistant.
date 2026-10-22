/** Steel V19 — nominal quantity method must describe the actual evidence.
 * Regression protects UI Method and exported CSV from claiming every mass
 * originates with a manufacturer even for BIS samples, historic or Osdag
 * unverified records. No licensed BIS numeric tables are reproduced.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const load=p=>{
 const ctx={module:{exports:{}}};
 vm.runInNewContext(fs.readFileSync(path.join(root,p),'utf8'),ctx,{filename:p});
 return ctx.module.exports;
};
const cat=load('pwd-steel-catalog.js');
const math=load('pwd-steel-core.js');
const samples=[
 ['bis-table-spot-audited','Selected BIS table nominal mass','limited source-row comparison'],
 ['bis-spot-audited-mass','Selected BIS nominal mass checked only','geometry/material not certified'],
 ['manufacturer-published','Manufacturer-published nominal mass','not independently certified'],
 ['archived-manufacturer-only','Historical manufacturer nominal mass','current BIS row not certified'],
 ['secondary-unverified','Secondary published nominal mass','not independently verified'],
 ['secondary-amendment-unverified','Secondary amendment reference nominal mass','not independently BIS verified'],
 ['osdag-open-unverified','Osdag open reference nominal mass','current BIS row not independently verified']
];
for(const [basis,expected,qualifier] of samples){
 const entry=cat.sections.find(s=>s.basis===basis)||({designation:'Synthetic Osdag reference',kgPerM:12.34,basis});
 assert.ok(Number.isFinite(entry.kgPerM)&&entry.kgPerM>0,'test must provide positive numeric mass');
 const out=math.quantity(entry,6,3,77.5);
 assert.ok(out.basis.includes(expected),basis+' must show authentic provenance');
 assert.ok(out.basis.includes(qualifier),basis+' must show verification boundary');
 assert.match(out.basis,/member length × number of pieces/);
 assert.ok(Math.abs(out.totalMassKg-entry.kgPerM*18)<1e-8,'no quantity arithmetic changes');
 assert.ok(Math.abs(out.totalPrice-out.totalMassKg*77.5)<1e-8,'no pricing arithmetic changes');
 if(!basis.startsWith('manufacturer-')&&!basis.startsWith('archived-')){
  assert.ok(!out.basis.includes('Manufacturer published kg/m'),'false generic manufacturer attribution');
 }
 const csv=math.exportCsv({
  designation:entry.designation||'Section',sourceLabel:'Source label',sourceDate:'2026-10',
  sourceStatus:basis
 },out);
 assert.ok(csv.includes('"Method","'+out.basis+'"'),'CSV Method must match on-screen method');
 assert.ok(csv.includes('"Source status","'+basis+'"'),'Preserve source status explicitly');
}
const missing=math.quantity({kgPerM:1.5},2,1,'');
assert.match(missing.basis,/Provided reference nominal mass/);
assert.equal(missing.ratePerKg,null);
const known=math.quantity(cat.byId('ISMB200'),6,3,0);
assert.ok(Math.abs(known.totalMassKg-435.06)<1e-9);
assert.equal(known.totalPrice,0,'zero material rate valid');
const g=math.geometricMass('plate',{widthMm:100,thicknessMm:10},6,2,'');
assert.ok(g.basis.includes('Theoretical geometric mass'),'geometry method MUST keep theoretical warning');
const hollow=math.geometricMass('hollow-rhs',{heightMm:100,widthMm:50,thicknessMm:3},6,2,'');
assert.ok(hollow.basis.includes('DOES NOT represent IS 4923'),'custom hollow not nominal structural standard');
console.log('Steel V19 PASS: 7 source classes label calculations/CSV accurately; mass, amount, custom geometry, missing provenance unchanged.');
