/* V63: larger touch actions and uncluttered two-column reference picks.
 * Source approval is enforced by catalog comparison, not screen labels.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('pwd_steel_table.html');
const css=read('pwd-steel-reference-ui.css');
const app=read('pwd-steel-app.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const all=status.summarize(cat,compare,cat.sections);
assert.equal(all.total,757);
assert.deepEqual({...all.counts},{checked:686,review:0,hold:71});
const working=status.select(cat,compare,cat.sections,'checked');
const holds=status.select(cat,compare,cat.sections,'hold');
assert.equal(working.rows.length,686);
assert.equal(holds.rows.length,71);
assert.ok(working.rows.every(r=>compare.quantityGate(cat,r).allowed));
assert.ok(holds.rows.every(r=>!compare.quantityGate(cat,r).allowed));
assert.match(css,/\.results\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,
 'Must preserve two-column compact mobile picker');
assert.match(css,/@media\(max-width:480px\)[\s\S]*?\.results\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css,/\.size-row \.pick\{display:block;width:100%;min-height:64px/);
assert.match(css,/width:40px;min-width:40px;height:40px;min-height:40px/,
 'Comparison add/remove tap target must be substantially larger than a tiny icon');
assert.match(css,/padding:10px 47px 8px 10px/,
 'Leave room for independent compare button without obstructing section selection');
assert.match(app,/subtitle\.textContent=format\(row\.kgPerM,2\)\+' kg\/m · '/,
 'Cards should show short readable numbers and status');
assert.match(app,/quantityState\.category==='hold'\?'HOLD · reference only'/,
 'Do not omit HOLD caution on archived cards');
assert.match(app,/quantityState\.allowed\?'source checked':'not verified'/);
assert.ok(!app.includes("const status=catalog.standardAudit(row).status;"),
 'Source-status long list was removed from compact cards');
assert.match(app,/const bisAudit=catalog\.standardAudit\(selected\);/,
 'Full source explanation must remain on selected detail');
assert.match(app,/comparison\.quantityGate\(catalog,selected\)/,
 'Real quantity gating is mandatory and unaffected by visual shortening');
assert.match(app,/rows\.some\(row=>row\.audit\.status!=='checked'\)/,
 'Any held comparison suppresses numeric delta output');
assert.match(html,/<option value="checked" selected>Working · source-checked<\/option>/);
assert.match(html,/<option value="hold">Historical \/ unresolved · reference only<\/option>/);
assert.ok(read('sw.js').includes("'./pwd-steel-reference-ui.css'"));
assert.ok(/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/.test(read('sw.js')));
assert.match(read('scripts/steel-release-readiness.mjs'),/currentVersion:'Steel V\d{2,}'/);
console.log('STEEL V63 PASS: compact two-column picks with larger 40px comparison controls and concise HOLD/source status; 686 working, 71 archived, no release-gate bypass.');
