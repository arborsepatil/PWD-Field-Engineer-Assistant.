/* V39 Home refinement: list clarity and safe Android navigation placement. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const home=read('index.html');
const css=read('home-v39.css');
const pack=read('android/scripts/prepare_assets.py');
const sw=read('sw.js');
assert.ok(home.includes('home-v38 home-v39'),'V38 list must remain and V39 polish enabled');
assert.ok(home.includes('<link rel="stylesheet" href="./home-v39.css">'));
assert.ok(sw.includes("'./home-v39.css'"),'Polished Home style must be available offline');
assert.ok(pack.includes('".css"'),'Android package must bundle the V39 stylesheet');
assert.ok(sw.includes('pwd-tools-steel-v48-2026-10-25'),'Web cache must refresh the Home polish');
assert.match(css,/\.home-v39\.app-page\s*\{padding-bottom:0;/,
  'Remove padding previously reserved for fixed navigation on Home');
assert.match(css,/\.home-v39 \.bottom-nav\s*\{[\s\S]*?position:relative;/,
  'Bottom navigation must be part of page flow, not cover Android system navigation');
assert.match(css,/\.home-v39 \.bottom-nav\s*\{[\s\S]*?bottom:auto;/);
assert.match(css,/\.home-v39 \.bottom-nav\s*\{[\s\S]*?transform:none;/);
assert.ok(css.includes('safe-area-inset-bottom'),'Keep extra space on edge-to-edge Android screens');
assert.ok(css.includes('grid-template-columns:repeat(3'),'All three bottom actions equally sized');
assert.ok(css.includes('min-height:67px'),'Touch rows remain comfortably tappable on phones');
assert.ok(css.includes('min-height:70px'),'Touch rows remain comfortably tappable on wider screens');
assert.ok(css.includes('prefers-reduced-motion'),'Motion preferences respected');
const names=['Calculator & Civil','Concrete Batch','Steel Table','Retaining Wall','Concrete Mix Design','SSR & Rates','Bridge References','Technical Library'];
const routes=['pwd_calculators_converters.html','pwd_mix_batch_assistant.html','pwd_steel_table.html','pwd_retaining_walls.html','pwd_concrete_mix_design.html','library.html?section=ssr','pwd_bridge_plans.html','library.html'];
const matches=[...home.matchAll(/<a class="tool-row"[^>]*>[\s\S]*?<\/a>/g)];
assert.equal(matches.length,8,'No additional Home groups/cards');
for(let i=0;i<8;i++) {
 const item=matches[i][0];
 assert.ok(item.includes('<b>'+names[i]+'</b>'),'Tool changed order: '+names[i]);
 assert.ok(item.includes('href="./'+routes[i]+'"'),'Tool lost original engineering route: '+names[i]);
 assert.ok(item.includes('<svg viewBox="0 0 24 24"'),'Keep professional technical icon');
}
assert.equal((home.match(/class="bottom-nav"/g)||[]).length,1,'Keep exactly one footer navigation');
const footer=home.split('<nav class="bottom-nav"')[1]?.split('</nav>')[0]||'';
for(const route of ['index.html','library.html','settings.html'])assert.ok(footer.includes('href="./'+route+'"'));
assert.ok(home.includes('<details class="home-guidance">'),'Engineering boundary preserved');
for(const disallowed of ['id="pwdCalcFab"','class="fab-stack"','id="recentGrid"','id="moduleSearch"'])assert.ok(!home.includes(disallowed),'Clutter returned: '+disallowed);
const namesInHeader=(home.match(/Civil<span>Bandhu<\/span>/g)||[]).length;
assert.equal(namesInHeader,1,'Single CivilBandhu Home title');
console.log('V39 HOME PASS: eight original destinations, clearer rows and icons, safe non-overlay Android footer, offline CSS.');
