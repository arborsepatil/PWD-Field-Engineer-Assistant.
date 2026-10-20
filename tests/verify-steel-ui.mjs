/** Steel Table light/dark UX contract: non-visual QA for current Android HTML.
 * Arithmetic/data provenance are checked separately in verify-steel-table.mjs.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=x=>fs.readFileSync(path.join(root,x),'utf8');
const html=read('pwd_steel_table.html'),js=read('pwd-steel-app.js');
const css=html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
assert.ok(css,'Local accessible page styles required');
new vm.Script(js,{filename:'pwd-steel-app.js'});
const light=css.match(/:root\{([^}]+)\}/)?.[1],dark=css.match(/html\[data-theme="dark"\]\{([^}]+)\}/)?.[1];
assert.ok(light&&dark,'Both themes must be individually tokenized');
const color=(block,key)=>{
 const rx=new RegExp('--'+key+':(#[0-9A-Fa-f]{6})');
 const found=block.match(rx);
 assert.ok(found,'Missing '+key+' palette token');
 return found[1];
};
function luminance(hex){
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
 const linear=rgb.map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
 return linear[0]*0.2126+linear[1]*0.7152+linear[2]*0.0722;
}
function contrast(c1,c2){const a=luminance(c1),b=luminance(c2);return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);}
for(const [name,block] of [['light',light],['dark',dark]]){
 for(const [fg,bg,min] of [
  ['ink','card',7],['muted','card',4.5],
  ['action-text','action',7],['active-text','active-bg',7],
  ['diagram-ink','diagram-bg',4.5],['diagram-sub','diagram-bg',4.5],
  ['status','card',4.5],['focus','card',3]
 ]){
  const ratio=contrast(color(block,fg),color(block,bg));
  assert.ok(ratio>=min,`${name}: ${fg} / ${bg} insufficient contrast ${ratio.toFixed(2)}:1`);
 }
}
for(const id of ['steelFamilies','steelSearch','steelResults','steelDetail','steelSectionDiagram',
 'steelMore','steelArchiveNote','steelProperties','steelStandards','steelLength','steelCountPieces',
 'steelRate','steelCalculate','steelExport','steelPrint','steelError','outUnit','outKg','outTonne',
 'steelWidth','steelThickness','steelDiameter','steelSide'])
 assert.ok(html.includes('id="'+id+'"'),'Steel V1 UI regression: missing '+id);
assert.ok(html.includes('data-pwd-shell="off"'),'Avoid obscuring weight output with global floating calculator');
assert.ok(html.includes('name="viewport"'),'Responsive mobile viewport required');
assert.ok(html.includes('var(--font-scale,1)'),'Respect normal/large text settings');
assert.ok(html.includes('[hidden]{display:none!important}'),'Hidden inputs/results must stay hidden regardless of CSS layouts');
assert.ok(html.includes('--focus:#174d96')&&html.includes('--focus:#b8d5ff'),'Theme-adjusted focus rings required');
assert.match(css,/@media\(max-width:520px\)/);
assert.match(css,/@media print/);
assert.ok(html.includes('<details id="steelMore">'),'Keep extended properties collapsed by default');
assert.ok(html.includes('<details id="steelReferenceDetails">'),'Keep sources accessible but collapsed');
assert.ok(!html.includes('<section class="card hero">'),'Avoid old oversized explanatory hero');
assert.ok(!html.includes('Search manufacturer-published sections, view drawing references and estimate weights.'));
assert.ok(!html.includes('<p>Dataset V1 includes a limited SAIL manufacturer catalogue.'));
assert.ok(!html.includes('https://fonts.googleapis.com'),'Fonts must be offline-ready');
assert.match(js,/function renderRows\(\)/);
assert.match(js,/steelResults'\)\.addEventListener\('change'/);
assert.match(js,/renderDetail\(\)/);
assert.match(js,/\$\('steelArchiveNote'\)\.hidden=!archived/);
assert.match(js,/fill="var\(--diagram-bg\)"/);
assert.match(js,/window\.print\(\)/);
assert.match(js,/quantity\(selected,L,N,rate\)/);
assert.match(js,/geometricMass\(shape,dims,L,N,rate\)/);
assert.ok(!js.includes('window.PWDRCC2023BBS'),'RCC BBS cutting must remain deferred');
console.log('Steel Table UX QA passed: both palettes WCAG text contrast, responsive input/results, hidden panels, expandable provenance, existing V1 quantity logic.');
