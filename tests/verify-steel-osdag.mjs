/** Audits the separately licensed Osdag data overlay and safe packaging.
 * This is an integrity check, NOT a certified BIS numerical table audit.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(p,extras={}){
 const code=read(p);
 const context={module:{exports:{}},...extras};
 new vm.Script(code,{filename:p});
 vm.runInNewContext(code,context,{filename:p});
 return context.module.exports;
}
const osdag=load('pwd-steel-osdag.js');
const base=load('pwd-steel-catalog.js');
const full=load('pwd-steel-catalog.js',{PWDSteelOsdag:osdag});
const app=read('pwd-steel-app.js'),html=read('pwd_steel_table.html'),sw=read('sw.js');
assert.equal(osdag.count,640);
assert.equal(osdag.license,'LGPL-3.0');
assert.equal(full.openDataCount,640);
assert.ok(full.sections.length>base.sections.length+550,'Most open rows must remain selectable offline');
assert.ok(full.sections.filter(x=>x.sourceId==='osdag808').length>480);
assert.ok(full.sections.filter(x=>x.sourceId==='osdagCHS').length>=70);
const types=['JB','LB','MB','WB','NPB','WPB','SC','HB','JC','LC','MC','MPC','EQ','UE','PBP','CHS'];
for(const type of types)assert.ok(full.sections.some(x=>x.series===type),'Absent section series '+type);
assert.ok(full.search('ISHB 200','column').length>=1);
assert.ok(full.search('ISMB 300','beam').length>=1);
assert.ok(full.search('CHS','hollow','CHS').length>=70);
assert.ok(full.search('ISMC','channel').every(x=>full.resolveSeries(x)==='MC'),'Do not mix ISMC and MPC');
assert.equal(full.search('HB 9999','column').length,0,'No fabricated weights');
const bad=osdag.sections.filter(x=>x.qualityFlag==='mass-area-inconsistent');
assert.equal(bad.length,6,'Keep upstream numerical contradiction flags visible');
assert.ok(bad.some(x=>x.series==='CHS'));
for(const x of bad){
 assert.ok(x.massAreaDeltaPct>2.5);
 assert.ok(Number.isFinite(x.kgPerM)&&x.kgPerM>0);
 assert.ok(Number.isFinite(x.areaCm2)&&x.areaCm2>0);
}
assert.ok(osdag.sections.filter(x=>x.series==='CHS').every(x=>x.standard.includes('IS 1161:2014')));
assert.ok(osdag.sections.every(x=>x.series!=='SHS'&&x.series!=='RHS'),'Obsolete 1997 hollow rows excluded');
assert.ok(full.sections.some(x=>x.series==='SHS'&&x.sourceId!=='osdag808'),'Existing newer hollow module not lost');
assert.ok(full.sections.some(x=>x.series==='RHS'&&x.sourceId!=='osdag808'),'Existing RHS review entries not lost');
assert.ok(html.indexOf('pwd-steel-osdag.js')<html.indexOf('pwd-steel-catalog.js'));
assert.ok(html.includes('pwd-steel-osdag-license.html'));
assert.ok(sw.includes("'./pwd-steel-osdag.js'")&&sw.includes("'./pwd-steel-osdag-license.html'"));
const license=read('pwd-steel-osdag-license.html');
assert.ok(license.includes('GNU LESSER GENERAL PUBLIC LICENSE'));
assert.ok(license.includes('osdag-admin/Osdag'));
assert.match(app,/qualityFlag==='mass-area-inconsistent'/);
assert.match(app,/quantity blocked pending review|quantity blocked until/i);
assert.match(app,/rows\.slice\(0,shownLimit\)/);
assert.match(app,/steelMoreSizes'\)\.addEventListener\('click'/);
assert.ok(html.includes('id="steelMoreSizes"'));
assert.match(app,/function saveCsv/);
assert.match(app,/function shapeSvg/);
assert.doesNotMatch(app,/rccWallBBS|cuttingLength|barBending/i);
console.log('Osdag open-source overlay passed: 640 licensed rows, 6 inconsistent data flags, full previous hollow tools retained, search/citation/license and mass conflict blocking.');
