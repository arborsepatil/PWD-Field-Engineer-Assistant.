/** Steel V12: exercise actual calculator control flow without browser DOM.
 * Catches accidental assignment in BIS status guards (historical regression).
 * Source-wide standard audit: 190 SHS + 216 RHS table entries examined
 * externally; no copyrighted complete BIS table is bundled in this test.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const scope={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-catalog.js'),scope,{filename:'pwd-steel-catalog.js'});
const catalog=scope.module.exports;
const app=read('pwd-steel-app.js');
// Run the real calculator function, not just an expression string match.
const start=app.indexOf('function calculate(){');
const end=app.indexOf('function updateResult(){',start);
assert.ok(start>=0&&end>start,'Calculator extraction boundaries must exist');
const calculateSource=app.slice(start,end);
const runner=new Function('selected','catalog','math','$','source','family',
 calculateSource+'\nreturn calculate();');
const $=id=>({value:id==='steelLength'?'6':id==='steelCountPieces'?'2':'0'});
const math={quantity:(section,length,count)=>({
 unitMassKgM:section.kgPerM,
 totalMassKg:section.kgPerM*Number(length)*Number(count),
 totalTonnes:section.kgPerM*Number(length)*Number(count)/1000,
 basis:'Source nominal kg/m',totalPrice:null
})};
const source=id=>catalog.SOURCES[id];
const calc=(row,family='hollow')=>runner(row,catalog,math,$,source,family);
const beam=calc(catalog.byId('ISMB300'),'beam');
assert.equal(beam.q.unitMassKgM,46.02,'Normal beam must calculate, not get rejected as below scope');
assert.equal(beam.q.totalMassKg,46.02*12);
const rhs=calc(catalog.byId('bis22-rhs80x40x4'));
assert.equal(rhs.q.totalMassKg,6.71*12,'Verified RHS must calculate');
const shs=calc(catalog.byId('bis22-shs80x80x4'));
assert.equal(shs.q.totalMassKg,9.22*12,'Verified SHS must calculate');
const corrected=calc(catalog.byId('bis24-rhs120x60x5'));
assert.equal(corrected.q.totalMassKg,12.84*12,'Amendment 3 corrected mass must calculate');
assert.equal(catalog.standardAudit({series:'RHS',depthMm:120,widthMm:80,thicknessMm:6,kgPerM:16.98,areaCm2:2.63}).status,'source-numeric-hold');
assert.throws(()=>calc({
 id:'hold-120x80x6',series:'RHS',family:'hollow',depthMm:120,widthMm:80,thicknessMm:6,
 kgPerM:16.98,areaCm2:2.63,sourceId:'rhsBisSpot2024',designation:'RHS 120×80×6'
}),/source-table discrepancy/i,'Suspected printed area must be quarantined before weight calculation');
assert.equal(catalog.standardAudit({series:'SHS',depthMm:80,widthMm:80,thicknessMm:4,kgPerM:9.22,areaCm2:0.8}).status,'mass-area-conflict');
assert.throws(()=>calc({
 id:'bad-shs',series:'SHS',family:'hollow',depthMm:80,widthMm:80,thicknessMm:4,
 kgPerM:9.22,areaCm2:0.8,sourceId:'bis4923Spot2022',designation:'SHS 80×80×4'
}),/inconsistent/i);
assert.throws(()=>calc({id:'thin',series:'SHS',family:'hollow',depthMm:25,widthMm:25,thicknessMm:1.6,
 kgPerM:1.10,sourceId:'tataLegacy',designation:'SHS 25×25×1.6'}),/below 2 mm/);
assert.match(app,/if\(chsAudit\.status==='outside-current-scope'\)/);
assert.doesNotMatch(app,/if\(chsAudit\.status='outside-current-scope'\)/,
 'Assignment instead of comparison would block EVERY catalogue section');
const hollowRows=catalog.sections.filter(x=>x.series==='SHS'||x.series==='RHS');
const withAreas=hollowRows.filter(x=>Number.isFinite(x.areaCm2)&&x.areaCm2>0);
assert.equal(hollowRows.length,45);
assert.equal(withAreas.length,33);
for(const x of withAreas){
 const delta=Math.abs(x.kgPerM-0.785*x.areaCm2)/x.kgPerM;
 assert.ok(delta<=.02,x.designation+' exceeds the 2% internal consistency alarm');
}
assert.equal(catalog.sections.filter(x=>x.series==='RHS'&&x.depthMm===120&&x.widthMm===80&&x.thicknessMm===6).length,0,
 'Unresolved original source anomaly must stay out of curated catalogue');
console.log('Steel V12 PASS: real non-custom calculator computes beam, RHS and SHS; 33 area consistency checks; source discrepancy holds; no status-assignment regression.');
