/* V42: independently compared selected IS 808:2021 Table 2 records.
 * Source: owner-held BIS Fourth Revision, Table 2, physical PDF pp. 9-10.
 * This is an integrity regression for selected numerical checks, not
 * certification of unverified rows, supplier products or structural design.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-osdag.js'),ctx,{filename:'pwd-steel-osdag.js'});
ctx.PWDSteelOsdag=ctx.module.exports;ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-catalog.js'),ctx,{filename:'pwd-steel-catalog.js'});
const cat=ctx.module.exports;ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-compare.js'),ctx,{filename:'pwd-steel-compare.js'});
const compare=ctx.module.exports;ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-status.js'),ctx,{filename:'pwd-steel-status.js'});
const status=ctx.module.exports;
const batch=[
 ['OSD2',8.07,9],['OSD3',9.92,9],['OSD4',12.78,9],
 ['OSD5',6.05,9],['OSD6',8.01,9],['OSD7',8.75,10],
 ['OSD8',11.87,10],['OSD9',14.19,10],['OSD10',16.59,10],
 ['OSD11',16.60,10],['OSD14',23.47,10],['OSD15',27.87,10],
 ['OSD16',32.96,10],['OSD17',37.72,10],['OSD18',41.50,10],
 ['OSD19',43.07,10],['OSD20',49.44,10],['OSD21',56.82,10],
 ['OSD22',65.22,10],['OSD23',74.92,10],['OSD24',86.28,10],
 ['OSD25',99.39,10],['OSD13',21.06,10]
];
assert.equal(new Set(batch.map(x=>x[0])).size,23);
for(const [id,mass,page] of batch){
 const row=cat.byId(id);
 assert.ok(row,'Missing original row '+id);
 assert.equal(row.kgPerM,mass,'Source mass changed without row review: '+id);
 const audit=cat.standardAudit(row);
 assert.equal(audit.status,'is808-mass-area-inertia-checked',id+' must have selected 4-property source match');
 assert.equal(audit.sourceTable,2);
 assert.equal(audit.sourcePdfPage,page);
 assert.equal(audit.geometryChecked,false,'Do not claim missing fillet radii or flange slope verified');
 assert.equal(compare.audit(cat,row).status,'checked');
 assert.equal(compare.quantityGate(cat,row).allowed,true);
 const edited={...row,id:'unverified-other-source-'+id};
 assert.equal(compare.quantityGate(cat,edited).allowed,false,
  'Row-ID anchored checks must not authenticate another source row: '+id);
}
const a=cat.byId('OSD6'),b=cat.byId('OSD7');
assert.equal(a.depthMm,b.depthMm);
assert.equal(a.widthMm,b.widthMm);
assert.notEqual(a.kgPerM,b.kgPerM);
assert.equal(cat.standardAudit(a).status,'is808-mass-area-inertia-checked');
assert.equal(cat.standardAudit(b).status,'is808-mass-area-inertia-checked');
const l200=cat.sections.find(x=>x.designation==='LB 200'&&x.kgPerM===19.83),lp200=cat.byId('OSD13');
assert.ok(l200&&lp200,'Separate LB 200 and LB(P) 200 must exist');
assert.equal(l200.depthMm,lp200.depthMm);
assert.equal(l200.widthMm,lp200.widthMm);
assert.notEqual(l200.kgPerM,lp200.kgPerM);
assert.equal(lp200.kgPerM,21.06);
assert.equal(cat.standardAudit(lp200).status,'is808-mass-area-inertia-checked',
 'LB(P)200 was incorrectly compared against LB 200: source-specific audit must override it');
assert.equal(compare.quantityGate(cat,lp200).allowed,true);
const snapshot=status.summarize(cat,compare,cat.sections);
assert.equal(snapshot.total,757);
assert.equal(snapshot.counts.checked,172,'23 newly checked rows expected on previous 149');
assert.equal(snapshot.counts.review,566,'Pending count falls by 22, plus one former false-hold corrected');
assert.equal(snapshot.counts.hold,19,'Only the reviewed false LB(P)200 hold is resolved');
for(const row of cat.sections){
 const review=compare.audit(cat,row),gate=compare.quantityGate(cat,row);
 assert.equal(gate.allowed,review.status==='checked','Quantity eligibility changed: '+row.id);
}
assert.match(read('pwd-steel-catalog.js'),/IS808_V42_TABLE2_SAMPLE_ROWS/);
assert.match(read('pwd-steel-catalog.js'),/candidates\.find\(x=>x\.rowId===row\.id&&matches\(x\)\)/);
assert.ok(read('pwd_steel_table.html').includes('steelCatalogueAudit'),'Actual app must render source counts');
console.log('STEEL V42 SOURCE AUDIT PASS: checked 172, pending 566, held 19; 23 IS 808 Table 2 records checked, including corrected LB(P)200 variant.');
