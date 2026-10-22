/** Steel V7: BIS 4923 current structural-scope gating and RHS Amendment 3
 * review state. BIS circulars establish the scope change, not numerical
 * certification of manufacturer/historical table rows.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const context={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-catalog.js'),context);
const cat=context.module.exports;
const app=read('pwd-steel-app.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
assert.equal(cat.sections.length,74,'Curated sizes must be preserved');
const rhs=cat.byId('rhs-index-40x20x2');
assert.ok(rhs);
assert.equal(cat.standardAudit(rhs).status,'amendment3-review');
assert.match(cat.standardAudit(rhs).note,/NOT BIS verified/);
assert.equal(cat.standardAudit(cat.byId('tata-legacy-rhs50x25x2')).status,'amendment3-review');
assert.equal(cat.standardAudit(cat.byId('tata-legacy-shs25x25x2')).status,'not-checked');
assert.equal(cat.standardAudit({series:'SHS',thicknessMm:1.5}).status,'outside-current-scope');
assert.equal(cat.standardAudit({series:'RHS',thicknessMm:1.99}).status,'outside-current-scope');
assert.equal(cat.standardAudit({series:'RHS',thicknessMm:2}).status,'amendment3-review');
assert.equal(cat.standardAudit({series:'SHS',thicknessMm:2}).status,'not-checked');
assert.equal(cat.standardAudit({series:'CHS',depthMm:21.3,thicknessMm:2,kgPerM:0.95,areaCm2:1.21}).status,'spot-checked-match','Keep IS 1161 audit independent');
assert.equal(cat.standardAudit({series:'MB',depthMm:200,kgPerM:24.17}).status,'not-checked');
assert.equal(cat.standardAudit(null).status,'not-checked');
assert.match(app,/outside-current-scope/);
assert.match(app,/amendment3-review/);
assert.match(app,/outside amended structural section scope/);
assert.match(app,/RHS · BIS Amd\.3 not verified/);
assert.match(app,/OD.*mm/,'CHS diagram must show outside diameter');
assert.match(app,/Nominal dimensions · illustrative · not to scale/);
assert.match(app,/height\*t\/D/,'Hollow wall sketch thickness must respond to nominal wall, not remain constant');
const refs=cat.codeReferences;
assert.ok(refs.some(x=>x.standard.includes('4923:2017 Amd.2')&&x.uri.includes('Circular_slZj_2024-06-05.pdf')));
assert.ok(refs.some(x=>x.standard.includes('4923:2017 Amd.3')&&x.uri.includes('Circular_vpMS_2024-08-06.pdf')));
console.log('IS 4923 V7 checks passed: thin-wall structural scope gate, RHS amended-mass caution, CHS audit isolation, diagram nominal dimensions.');
