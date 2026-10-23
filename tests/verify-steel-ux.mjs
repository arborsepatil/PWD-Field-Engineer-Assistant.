/** Steel Table UX + light/dark contrast (no browser/network required). */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('pwd_steel_table.html'),js=read('pwd-steel-app.js'),shell=read('app-shell.js');
new vm.Script(js,{filename:'pwd-steel-app.js'});
assert.ok(html.includes('<body data-pwd-shell="off">'),'No floating calc bubble on Steel Table');
assert.match(html,/html\[data-theme="dark"\]\{color-scheme:dark/);
assert.match(html,/:root\{color-scheme:light/);
assert.match(shell,/pwd_theme/);
assert.match(html,/var\(--font-scale,1\)/,'Respect existing font size preference');
assert.match(html,/system-ui,-apple-system/,'Use available offline system font');
assert.ok(!html.includes('https://fonts.googleapis.com'),'No remote font dependence');
assert.match(html,/\[hidden\].*display:none!important/,'Hidden mobile fields must stay hidden');
for(const id of ['steelFamilies','steelSearch','steelResults','steelPicked','steelPickedName','steelPickedStatus','steelDetail',
 'steelDetailsDisclosure','steelStandardsDisclosure','steelCompareCard','steelCompareAdd','steelCompareResults','steelQuantityDisclosure','steelMainDepth','steelMainWidth','steelMainThickness','steelCustomShape','steelLength','steelCountPieces','steelRate','output',
 'outKg','outUnit','outTonne','steelCalculate','steelError','steelEmpty','sourceLinks']){
 assert.ok(html.includes('id="'+id+'"'),'Missing compact screen control '+id);
}
assert.ok(html.indexOf('id="steelSearch"')<html.indexOf('id="steelLength"'),'Selection should precede calculation inputs');
assert.ok(html.indexOf('id="steelDetailsDisclosure"')<html.indexOf('id="steelLength"'),'Selected section and dimensions must precede secondary calculator');
assert.match(html,/<section class="card steel-selected-card" id="steelDetailsDisclosure"/);
assert.match(html,/<details class="details" id="steelStandardsDisclosure">/);
assert.match(js,/selected=rows\[0\]\|\|null/,'Automatically select an available entry');
assert.match(js,/updateSelectedSummary\(\)/);
assert.match(js,/renderRows\(\);renderDetail\(\);updateSelectedSummary\(\);updateResult\(\)/);
assert.match(js,/\$\('outKg'\)\.textContent/);
assert.match(js,/\$\('outPrice'\)\.hidden=q\.totalPrice===null/,'No empty optional-price output');
assert.match(js,/\$\('steelEmpty'\)\.hidden=!missing/);
assert.doesNotMatch(js,/<rect width="488" height="310" fill="#ffffff"/,'No hardcoded blinding-white SVG');
for(const cls of ['bg','shape','ink','muted'])assert.ok(html.includes('.figure .'+cls),'CSS tokens missing for '+cls);
assert.match(html,/--figureBg:#15283e/);
assert.match(html,/--figureBg:#f7fbff/);
function contrast(a,b){
 const l=s=>{
  const c=[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
  return c[0]*.2126+c[1]*.7152+c[2]*.0722;
 };
 const v=[l(a),l(b)].sort((a,b)=>b-a);
 return (v[0]+.05)/(v[1]+.05);
}
for(const [name,fg,bg] of [
 ['light text','#17263b','#ffffff'],['light secondary','#53637c','#ffffff'],
 ['light primary button','#ffffff','#1757bb'],['dark text','#f2f6ff','#111f32'],
 ['dark secondary','#b6c5dc','#111f32'],['dark primary button','#ffffff','#2e70d3'],
 ['dark warning','#f4cc82','#30271c']
]){
 assert.ok(contrast(fg,bg)>=4.5,name+' failed 4.5:1 contrast: '+contrast(fg,bg).toFixed(2));
}
assert.ok(!html.includes('id="rccBbsSection"')&&!js.includes('cuttingLength'),'RCC BBS must stay deferred');
console.log('Steel V28 polished UI passed: member → size → diagram/weight/dimensions → comparison → optional quantity, offline font/contrast and no BBS.');
