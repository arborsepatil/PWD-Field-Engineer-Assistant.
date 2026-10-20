/** Phase 1: retaining wall navigation and source separation. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const home=read('index.html');
const hub=read('pwd_retaining_walls.html');
const masonry=read('pwd_retaining_wall_section_quantity.html');
const pcc=read('pwd_pcc_wall_reference.html');
const rcc=read('pwd_rcc_wall_reference.html');
const sw=read('sw.js');
const pack=read('android/scripts/prepare_assets.py');
assert.match(home,/href="\.\/pwd_retaining_walls\.html" data-tool-id="wall"/);
assert.match(home,/name:'Retaining Walls',href:'pwd_retaining_walls\.html'/);
for(const f of ['pwd_retaining_walls.html','pwd_pcc_wall_reference.html','pwd_rcc_wall_reference.html']){
  assert.match(sw,new RegExp(f.replaceAll('.','\\.')));
  assert.ok(fs.existsSync(path.join(root,f)),'Missing wall source page: '+f);
}
for(const f of ['pwd_retaining_wall_section_quantity.html','pwd_pcc_wall_reference.html','pwd_rcc_wall_reference.html'])
  assert.match(hub,new RegExp(f.replaceAll('.','\\.')));
assert.match(masonry,/<script src="\.\/pwd-retaining-wall-core\.js"><\/script>/);
assert.match(masonry,/<script src="\.\/pwd-wall-diagrams\.js"><\/script>/);
assert.match(masonry,/<h1>Masonry Wall Calculator<\/h1>/);
assert.match(masonry,/href="\.\/pwd_retaining_walls\.html"/);
assert.doesNotMatch(masonry,/weep/i);
assert.match(pcc,/doc=bridge2023&amp;page=218/);
assert.match(pcc,/doc=bridge2002&amp;page=69/);
assert.match(pcc,/classification under review/);
assert.match(pcc,/Confirm material and section/);
for(const page of [209,210,211,212])
  assert.match(rcc,new RegExp('doc=bridge2023&amp;page='+page+'\\b'));
assert.match(rcc,/SBC 10 t\/m²/);
assert.match(rcc,/SBC 15 t\/m²/);
assert.match(rcc,/SBC 25 t\/m²/);
assert.doesNotMatch(rcc,/doc=bridge2002/);
assert.match(pack,/\\"\\.html\\"/);
assert.doesNotMatch(pcc+rcc,/auto-adopt|auto-design|automatic structural approval/i);
console.log('Retaining walls hub passed: masonry geometry retained, PCC and RCC drawings isolated, original PDF pages linked, no unsupported auto-design.');
