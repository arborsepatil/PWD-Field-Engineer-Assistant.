/** Steel Table V1: section source traceability, quantity arithmetic and APK navigation */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(p){
 const code=read(p);new vm.Script(code,{filename:p});
 const context={module:{exports:{}}};
 vm.runInNewContext(code,context,{filename:p});
 return context.module.exports;
}
const catalog=load('pwd-steel-catalog.js'),math=load('pwd-steel-core.js');
const ui=read('pwd_steel_table.html'),app=read('pwd-steel-app.js'),
 home=read('index.html'),cache=read('sw.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
assert.equal(catalog.sections.length,19,'No silent addition of unverified catalogue data');
assert.equal(catalog.sections.filter(x=>x.family==='beam').length,5);
assert.equal(catalog.sections.filter(x=>x.family==='channel').length,6);
assert.equal(catalog.sections.filter(x=>x.family==='angle').length,8);
assert.equal(catalog.byId('ISMB300').kgPerM,46.02);
assert.equal(catalog.byId('ISMC150').kgPerM,16.8);
assert.equal(catalog.byId('ISA100x100x8').kgPerM,12.1);
assert.equal(catalog.byId('ISA100x100x8').basis,'archived-manufacturer-only');
assert.equal(catalog.byId('ISMB200').areaCm2,undefined,'Do not invent unverified section properties');
assert.equal(catalog.byId('ISMB300').ixCm4,8990);
assert.equal(catalog.byId('ISMB300').webMm,7.7);
assert.equal(catalog.byId('ISMB150').zxCm3,95.7);
assert.equal(catalog.search('ismb 300')[0].designation,'ISMB 300');
assert.equal(catalog.search('ISMC','channel').length,6);
assert.equal(catalog.search('ISA','angle').length,8);
assert.equal(catalog.search('unknown designation').length,0);
for(const s of catalog.sections){
 assert.ok(s.kgPerM>0&&Number.isFinite(s.kgPerM));
 assert.ok(s.depthMm>0&&s.widthMm>0);
 assert.ok(catalog.SOURCES[s.sourceId],'Every section needs actual manufacturer reference');
 assert.match(catalog.SOURCES[s.sourceId].url,/^https:\/\//);
 assert.ok(s.standard.includes('IS 808:2021'),'State scope/version, not direct BIS table certification');
 if(s.family==='angle')assert.equal(s.basis,'archived-manufacturer-only');
 else assert.equal(s.basis,'manufacturer-published');
}
const q=math.quantity(catalog.byId('ISMB300'),6,8,70);
assert.ok(Math.abs(q.totalMassKg-46.02*48)<1e-9);
assert.ok(Math.abs(q.totalTonnes-2.20896)<1e-9);
assert.ok(Math.abs(q.totalPrice-154627.2)<1e-6);
const plate=math.geometricMass('plate',{widthMm:100,thicknessMm:10},6,1,null);
assert.ok(Math.abs(plate.unitMassKgM-7.85)<1e-9);
assert.ok(Math.abs(plate.totalMassKg-47.1)<1e-9);
const round=math.geometricMass('round',{diameterMm:12},1,1,null);
assert.ok(Math.abs(round.unitMassKgM-(Math.PI*12**2/4/1e6*7850))<1e-9);
const sq=math.geometricMass('square',{sideMm:20},2,3,0);
assert.ok(Math.abs(sq.totalMassKg-18.84)<1e-9);
assert.equal(sq.totalPrice,0);
for(const [length,count,rate] of [[0,1,0],[-1,1,0],['',1,0],[6,0,0],[6,1.1,0],[6,1,-1],[6,1,'oops']])
 assert.throws(()=>math.quantity(catalog.byId('ISMC150'),length,count,rate));
assert.throws(()=>math.geometricMass('round',{diameterMm:0},6,1,null));
assert.throws(()=>math.geometricMass('hollow',{diameterMm:10},6,1,null));
const csv=math.exportCsv({designation:'=FORMULA()',sourceLabel:'SAIL 2023',sourceDate:'2023',sourceStatus:'manufacturer-published'},q);
assert.ok(csv.includes("'=FORMULA()"),'Spreadsheet formula content must be escaped');
assert.ok(csv.startsWith('\ufeff'));
assert.ok(csv.includes('PWD FIELD ASSISTANT'));
assert.ok(csv.includes('Not a design'));
for(const id of ['steelFamilies','steelSearch','steelResults','steelDetail','steelSectionDiagram','steelProperties','steelLength','steelCountPieces','steelRate','steelCalculate','steelExport','steelPrint','steelCustomShape','steelWidth','steelThickness','steelDiameter','steelSide'])
 assert.ok(ui.includes('id="'+id+'"'),'Missing steel module control '+id);
for(const asset of ['pwd-steel-catalog.js','pwd-steel-core.js','pwd-steel-app.js']){
 assert.ok(ui.includes('src="./'+asset+'"'));
 assert.ok(cache.includes("'./"+asset+"'"),'Offline caching missing '+asset);
}
assert.ok(cache.includes("'./pwd_steel_table.html'"));
assert.ok(home.includes('href="./pwd_steel_table.html"'),'Steel module missing from app home');
assert.match(app,/__PWD_ANDROID_CSV_EXPORT_V1__/);
assert.match(app,/window\.print\(\)/);
assert.match(app,/PWDSteelMath/);
assert.doesNotMatch(app,/barBending|cuttingLength|rccWallBBS|autoStructuralDesign/i);
assert.ok(!ui.includes('https://fonts.googleapis.com'),'No remote fonts needed for offline use');
assert.ok(!ui.includes('<iframe'),'Do not load untrusted third party app frames');
assert.ok(!ui.includes('Steel Table-1.4.3.apk'),'Never bundle user-provided third party APK');
console.log('Steel Table V1 QA passed: 19 source-linked manufacturer records, archived-angle warnings, weight/price arithmetic, 4 geometric shapes, offline APK wiring and no BBS.');
