/** Retaining wall architecture: TWO choices only, existing PCC calculator and 2023 RCC references. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const home=read('index.html');
const hub=read('pwd_retaining_walls.html');
const pccCalc=read('pwd_retaining_wall_section_quantity.html');
const pccRefs=read('pwd_pcc_wall_reference.html');
const rcc=read('pwd_rcc_wall_reference.html');
const core=read('pwd-retaining-wall-core.js');
const diagrams=read('pwd-wall-diagrams.js');
const shell=read('sw.js');
const pack=read('android/scripts/prepare_assets.py');

assert.match(home,/href="\.\/pwd_retaining_walls\.html" data-tool-id="wall"/);
assert.match(home,/PCC calculator · RCC 2023 type plans/);
assert.match(home,/name:'Retaining Walls',href:'pwd_retaining_walls\.html'/);
assert.match(hub,/<h2>⬛ PCC Retaining Wall<\/h2>/);
assert.match(hub,/<h2>🏗️ RCC Retaining Wall<\/h2>/);
assert.equal((hub.match(/<article class="card">/g)||[]).length,2,'Only PCC and RCC should be top-level options');
assert.match(hub,/href="\.\/pwd_retaining_wall_section_quantity\.html"/);
assert.match(hub,/href="\.\/pwd_rcc_wall_reference\.html"/);
assert.doesNotMatch(hub,/Masonry|masonry|href="\.\/pwd_pcc_wall_reference\.html"/);

assert.match(pccCalc,/<h1>PCC Retaining Wall Calculator<\/h1>/);
assert.match(pccCalc,/<script src="\.\/pwd-retaining-wall-core\.js"><\/script>/);
assert.match(pccCalc,/<script src="\.\/pwd-wall-diagrams\.js"><\/script>/);
assert.match(pccCalc,/href="\.\/pwd_retaining_walls\.html"/);
assert.match(pccCalc,/href="\.\/pwd_pcc_wall_reference\.html"/);
assert.match(pccCalc,/existing calculator section/);
assert.match(core,/Wall concrete \('/);
assert.match(core,/PCC \/ footing/);
assert.match(core,/Rubble soling/);
assert.match(core,/Excavation/);
assert.match(core,/Filter \/ rubble backing/);
assert.ok(diagrams.length>500, 'Original section and setting-out diagrams must be preserved');
assert.doesNotMatch(pccCalc,/masonry|weep[- ]?hole/i);
assert.doesNotMatch(core,/weep[- ]?hole/i);

assert.match(pccRefs,/doc=bridge2023&amp;page=218/);
assert.match(pccRefs,/doc=bridge2002&amp;page=69/);
assert.match(pccRefs,/href="\.\/pwd_retaining_wall_section_quantity\.html"/);
assert.match(pccRefs,/classification under review/);
assert.match(pccRefs,/Confirm material and section/);
assert.match(pccRefs,/not automatically used in its geometry/);
assert.doesNotMatch(pccRefs,/masonry/i);

for(const pg of [209,210,211,212])
  assert.match(rcc,new RegExp('doc=bridge2023&amp;page='+pg+'\\b'));
for(const value of ['SBC 10 t/m²','SBC 15 t/m²','SBC 25 t/m²'])
  assert.ok(rcc.includes(value),'Missing RCC bearing capacity '+value);
assert.doesNotMatch(rcc,/doc=bridge2002|quantity calculator|Masonry Wall/);
for(const f of ['pwd_retaining_walls.html','pwd_retaining_wall_section_quantity.html','pwd_pcc_wall_reference.html','pwd_rcc_wall_reference.html'])
  assert.ok(shell.includes('./'+f),'Uncached page: '+f);
assert.ok(pack.includes('".html"'), 'HTML screens must be packaged in Android APK');
console.log('Retaining walls verified: PCC existing quantities, separate bridge return references, RCC 2023 source drawings, exactly two segments.');
