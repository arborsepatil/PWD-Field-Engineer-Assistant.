/* V62: compact reference screen inspired by the user's video workflow.
 * Only independently sourced numbers; original CivilBandhu diagrams and UI.
 * No code/images/data are extracted or copied from the third-party APK.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('pwd_steel_table.html');
const css=read('pwd-steel-reference-ui.css');
const app=read('pwd-steel-app.js');
const sw=read('sw.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const totals=status.summarize(cat,cmp,cat.sections);
assert.equal(totals.total,757);
assert.deepEqual({...totals.counts},{checked:686,review:0,hold:71});
const allowed=totals.records.filter(r=>r.quantityAllowed);
assert.equal(allowed.length,686);
assert.ok(totals.records.filter(r=>r.status==='hold')
 .every(r=>!cmp.quantityGate(cat,r.row).allowed));
assert.ok(html.includes('<option value="checked" selected>Working · source-checked</option>'),
 'Default must show only checked working library, no held weights');
assert.ok(html.includes('<option value="hold">Historical / unresolved · reference only</option>'),
 'Archive remains accessible for source evidence, not calculations');
assert.ok(html.includes('<option value="all">All records · includes held</option>'),
 'Full catalogue must remain traceable');
for(const id of ['steelCategoryDrawer','steelMenuCaption','steelFamilies',
 'steelSeries','steelSearch','steelResults','steelAuditFilter',
 'steelCompareJump','steelCompareCard','steelCompareResults','steelCompareDelta',
 'steelDetail','steelSectionDiagram','steelFastProperties','steelKeyAudit',
 'steelCalculate','steelHoldBreakdown']){
 assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,'Missing or duplicated control '+id);
}
assert.ok(html.indexOf('id="steelCategoryDrawer"')<html.indexOf('id="steelResults"'),
 'Menu precedes quick section picker');
assert.ok(html.indexOf('id="steelSectionDiagram"')<html.indexOf('id="steelFastProperties"'),
 'Original diagram should appear next to first-value properties');
assert.ok(html.indexOf('id="steelCompareCard"')<html.indexOf('id="steelQuantityDisclosure"'),
 'Comparison precedes optional calculator');
assert.match(html,/<details class="steel-category-drawer"/);
assert.match(html,/<div class="steel-visual-and-facts">/);
assert.match(html,/pwd-steel-reference-ui\.css/);
assert.match(css,/\.results\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,
 'Compact mobile UI should restore two-column size choices');
assert.match(css,/@media\(max-width:480px\)[\s\S]*?\.results\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,
 'Phone view must not revert to a one-column picker');
assert.match(css,/html\[data-theme="dark"\]/);
assert.match(css,/html\[data-theme="light"\]/);
assert.match(css,/\.steel-visual-and-facts\{display:grid/);
assert.match(css,/\.steel-family-list\{display:grid/);
assert.match(app,/\$\('steelCategoryDrawer'\)\.open=false/,
 'Category menu should collapse after selection');
assert.match(app,/\$\('steelCompareJump'\)\.addEventListener\('click'/);
assert.match(app,/rows\.some\(row=>row\.audit\.status!=='checked'\)/,
 'Held weights must suppress numerical delta summaries');
assert.match(app,/not a strength or load-capacity ranking/,
 'Comparisons may not imply structural capacity');
assert.match(app,/\$\('steelFastProperties'\)/);
assert.match(app,/if\(value===undefined\|\|value===null\|\|!Number\.isFinite/,
 'Quick facts must never synthesize absent properties');
assert.ok(sw.includes("'./pwd-steel-reference-ui.css'"),
 'Reference screen must work offline and in the native Android bundle');
assert.match(sw,/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/);
assert.ok(!html.includes('third-party-image.png')&&!app.includes('loadCapacity'),
 'Keep original diagram logic and never suggest rating/load capacity');
const sameFamily=cat.sections.filter(r=>r.family==='beam'&&cmp.audit(cat,r).status==='checked');
assert.ok(sameFamily.length>=2);
const a=cmp.build(cat,sameFamily.slice(0,2));
assert.ok(a.every(r=>r.audit.status==='checked'));
const nominalDelta=a[1].kgPerM-a[0].kgPerM;
assert.ok(Number.isFinite(nominalDelta));
assert.equal(nominalDelta,a[1].kgPerM-a[0].kgPerM);
const held=cat.byId('OSD180');
assert.equal(cmp.quantityGate(cat,held).allowed,false,
 'Original mass-row conflict cannot be restored through a UI design change');
console.log('STEEL V62 PASS: reference-style compact UI, two-column mobile picker, source-checked first, original diagrams, fail-closed comparison, Android offline assets, 686 checked and 71 archived holds.');
