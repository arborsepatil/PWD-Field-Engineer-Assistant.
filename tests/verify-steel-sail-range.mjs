/** Exact SAIL 2023 manufacturer product-range facts, curated independently
 * from the app's storage; this is not the full IS 808:2021 numerical table.
 * Source: https://www.sail.co.in/sites/default/files/product-brochure/2023-10/PFS-Brochure_New-2023.pdf
 * Note: SAIL's apparent 80×80 set has an ambiguous extra fourth weight;
 * we intentionally exclude that ambiguous gauge/weight pair.
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
const source='sailStruct2023';
const grades=[
 [50,[[5,3.79],[6,4.49]]],
 [60,[[5,4.50],[6,5.40],[8,7.00]]],
 [65,[[5,4.98],[6,5.91],[8,7.73],[10,9.49]]],
 [70,[[5,5.30],[6,6.30]]],
 [75,[[5,5.77],[6,6.86],[8,9.00],[10,11.07]]],
 [80,[[6,7.36],[8,9.65],[10,11.88]]],
 [90,[[6,8.32],[8,10.92],[10,13.47],[12,15.95]]],
 [100,[[6,9.26],[8,12.18],[10,15.04],[12,17.83]]],
 [150,[[10,22.93],[12,27.29]]],
 [200,[[12,36.85],[16,48.53],[18,54.30],[20,59.96],[25,73.90]]]
];
let tally=0;
for(const [leg,pairs] of grades){
 for(const [thickness,kgPerM] of pairs){
  const id=`sail23-ISA${leg}x${leg}x${thickness}`;
  const row=cat.byId(id);
  assert.ok(row,'Missing SAIL product-range equal angle '+id);
  assert.equal(row.sourceId,source,id+' must cite the original SAIL brochure');
  assert.equal(row.basis,'manufacturer-published',id+' must NOT be marked verified BIS');
  assert.equal(row.kgPerM,kgPerM,id+' kg/m differs from manufacturer reference');
  assert.equal(row.depthMm,leg);assert.equal(row.widthMm,leg);
  assert.equal(row.thicknessMm,thickness);tally++;
 }
}
assert.equal(tally,33,'Manufacturer subset should cover 33 unambiguous ISA records');
assert.equal(cat.byId('sail23-ISA80x80x12'),null,'Ambiguous brochure datum must not be fabricated');
assert.equal(cat.sections.length,115,'Curated dataset changed without updating the independent source audit');
const channelMasses=[[75,7.14],[100,9.56],[125,13.10],[150,16.8],[200,22.3],[250,34.2],[300,36.3],[400,50.1]];
for(const [depth,kg] of channelMasses){
 const id=depth<=250?'ISMC'+depth:'sail23-ISMC'+depth;
 assert.equal(cat.byId(id)?.kgPerM,kg,'SAIL MC '+depth+' reference');
}
const mediumBeamMasses=[[100,8.95],[150,14.96],[200,24.17],[250,37.3],[300,46.02]];
for(const [depth,kg] of mediumBeamMasses)assert.equal(cat.byId('ISMB'+depth)?.kgPerM,kg);
// Conflicting vintages are kept as separate manufacturer records.
assert.equal(cat.byId('ISA90x90x6').kgPerM,8.2);
assert.equal(cat.byId('sail23-ISA90x90x6').kgPerM,8.32);
assert.ok(cat.collisionGroups().some(g=>g.some(x=>x.id==='ISA90x90x6')&&g.some(x=>x.id==='sail23-ISA90x90x6')));
const ui=read('pwd_steel_table.html'),app=read('pwd-steel-app.js');
assert.ok(ui.includes('id="steelMoreSizes"'));
assert.ok(app.includes('shownLimit=60'));
assert.ok(app.includes("shownLimit+=60;renderRows();"));
assert.ok(app.includes("rows.slice(0,shownLimit)"));
assert.ok(app.includes("shownLimit=60;selected=null;"),'Changing section series must reset pagination');
console.log('SAIL product-range test passed: 33 sourced equal angles, 8 medium channels, 5 medium beams, ambiguous row excluded and scalable browse.');
