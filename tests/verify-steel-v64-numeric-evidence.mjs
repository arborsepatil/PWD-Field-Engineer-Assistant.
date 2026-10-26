/* V64: sources stay unchanged, while all 21 actionable numerical issues are explainable.
 * No weight inference or hold override enters the working catalogue.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const evidence=require('../pwd-steel-evidence.js');
const totals=status.summarize(catalog,compare,catalog.sections);
const register=holds.build(catalog,compare,status);
const data=evidence.build(catalog,compare,status,holds);
assert.deepEqual({...totals.counts},{checked:686,review:0,hold:71});
assert.deepEqual({...data.totals},{numeric:15,internal:6,total:21});
assert.equal(data.rows.length,21);
assert.equal(new Set(data.rows.map(x=>x.id)).size,21);
assert.equal(Object.keys(data.byId).length,21);
assert.equal(register.rows.filter(x=>x.reason==='numeric'||x.reason==='internal').length,21);
for(const item of data.rows){
 const original=catalog.byId(item.id);
 assert.ok(original);
 assert.equal(original.kgPerM,item.originalKgPerM);
 assert.equal(original.areaCm2??null,item.originalAreaCm2);
 assert.equal(item.quantityAllowed,false);
 assert.equal(item.approvedReplacementKgPerM,null);
 assert.equal(compare.audit(catalog,original).status,'hold');
 assert.equal(compare.quantityGate(catalog,original).allowed,false);
 assert.ok(item.sourceId&&item.sourceLabel&&item.sourceStatus&&item.sourceNote&&item.nextEvidence);
 assert.equal(item.sourceStatus,catalog.standardAudit(original).status);
 assert.ok(Object.isFrozen(item));
 if(item.densitySanity){
  const k=item.densitySanity;
  const expected=item.originalAreaCm2*.785;
  assert.ok(Math.abs(k.impliedKgPerM-expected)<=.000051,
   'Informational area-based mass computation must be correct: '+item.id);
  assert.ok(Math.abs(k.differenceKgPerM-(item.originalKgPerM-expected))<=.000051);
  assert.ok(Math.abs(k.differencePercentOfRecorded-
    100*(item.originalKgPerM-expected)/item.originalKgPerM)<=.00051);
  assert.match(k.basis,/not a replacement nominal weight or a BIS acceptance tolerance/);
 }else assert.ok(!Number.isFinite(original.areaCm2)||original.areaCm2<=0||!Number.isFinite(original.kgPerM));
}
assert.ok(data.byId.OSD180);
assert.equal(data.byId.OSD180.reason,'numeric');
assert.equal(data.byId.OSD180.sourceTable,4);
assert.equal(data.byId.OSD180.sourcePdfPage,17);
assert.match(data.byId.OSD180.sourceNote,/2\.9 times/);
assert.ok(data.byId.OSD180.densitySanity,
 'WPB printed mass and area are internally consistent but geometry is not; show limitation');
assert.ok(Math.abs(data.byId.OSD180.densitySanity.differencePercentOfRecorded)<1,
 'Near-zero mass/area disagreement does NOT resolve the plate-geometry conflict');
assert.equal(data.byId.OSD578.reason,'internal');
assert.ok(data.byId.OSD578.densitySanity);
assert.ok(data.byId.OSD578.densitySanity.differencePercentOfRecorded!==0);
assert.ok(!data.byId['sail23-ISA200x200x18'],
 'Historical, non-tabulated angle belongs to a separate hold category');
assert.equal(catalog.sections.length,757);
assert.equal(status.select(catalog,compare,catalog.sections,'checked').rows.length,686);
assert.ok(register.rows.filter(x=>x.reason==='chs').every(x=>!data.byId[x.id]),
 'Do not inflate numerical discrepancy register with unrelated historical CHS holds');
const html=read('pwd_steel_table.html'),app=read('pwd-steel-app.js'),sw=read('sw.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
new vm.Script(read('pwd-steel-evidence.js'),{filename:'pwd-steel-evidence.js'});
assert.match(html,/<details class="steel-tech" id="steelEvidenceDetails" hidden>/);
assert.match(html,/id="steelEvidenceBody"/);
assert.match(html,/<script src="\.\/pwd-steel-evidence\.js"><\/script>/);
assert.match(sw,/'\.\/pwd-steel-evidence\.js'/);
assert.match(sw,/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/);
assert.match(app,/function renderEvidence\(row\)/);
assert.match(app,/const entry=row\?evidenceRegistry\.byId\[row\.id\]:null/);
assert.match(app,/if\(!entry\)\{/);
assert.match(app,/container\.hidden=true;container\.open=false/);
assert.match(app,/renderEvidence\(selected\)/);
assert.match(app,/\$\('steelCalculate'\)\.disabled=!quantityState\.allowed/);
assert.match(app,/HOLD\. The app does not substitute any inferred nominal weight/);
assert.match(read('scripts/steel-release-readiness.mjs'),/currentVersion:'Steel V\\d{2,}'/);
assert.ok(!html.includes('third-party-image.png'));
console.log('STEEL V64 PASS: 21 numeric/internal holds have distinct, traceable read-only evidence, 15 published conflicts and 6 internal discrepancies; 71 remain blocked, 686 source checked, no mass changed.');
