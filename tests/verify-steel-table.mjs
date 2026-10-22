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
assert.equal(catalog.sections.length,86,'Curated manufacturer and secondary reference rows must remain controlled');
assert.equal(catalog.sections.filter(x=>x.family==='beam').length,11);
assert.equal(catalog.sections.filter(x=>x.family==='channel').length,11);
assert.equal(catalog.sections.filter(x=>x.family==='angle').length,43);
assert.equal(catalog.byId('ISMB300').kgPerM,46.02);
assert.equal(catalog.byId('ISMC150').kgPerM,16.8);
assert.equal(catalog.byId('ISA100x100x8').kgPerM,12.1);
assert.equal(catalog.byId('ISA100x100x8').basis,'archived-manufacturer-only');
assert.equal(catalog.byId('ISMB200').areaCm2,undefined,'Do not invent unverified section properties');
assert.equal(catalog.byId('ISMB300').ixCm4,8990);
assert.equal(catalog.byId('ISMB300').webMm,7.7);
assert.equal(catalog.byId('ISMB150').zxCm3,95.7);
assert.equal(catalog.search('ismb 300')[0].designation,'ISMB 300');
assert.equal(catalog.search('ISMC','channel').length,8);
assert.equal(catalog.search('ISA','angle').length,43);
assert.equal(catalog.search('unknown designation').length,0);
for(const s of catalog.sections){
 assert.ok(s.kgPerM>0&&Number.isFinite(s.kgPerM));
 assert.ok(s.depthMm>0&&s.widthMm>0);
 assert.ok(catalog.SOURCES[s.sourceId],'Every section needs actual manufacturer reference');
 assert.match(catalog.SOURCES[s.sourceId].url,/^https:\/\//);
 assert.ok(s.standard.includes(s.family==='hollow'?(s.series==='CHS'?'IS 1161':'IS 4923'):'IS 808:2021'),'Correct standard attribution');
 assert.ok(['manufacturer-published','secondary-unverified','secondary-amendment-unverified','archived-manufacturer-only','bis-spot-audited-mass'].includes(s.basis));
}
// IS 808:2021 CLASSIFICATION completeness; aliases must resolve against real
// rows, never synthesized masses or phantom sizes.
const names=['JB','LB','MB','WB','NPB','WPB','SC','HB','JC','LC','MC','MPC','EQ','UE','PBP','SHS','RHS','CHS'];
assert.equal(catalog.SERIES.length,names.length);
for(const series of names){
 assert.ok(catalog.SERIES.some(s=>s.id===series),'Section classification missing: '+series);
 assert.ok(catalog.sections.some(x=>catalog.resolveSeries(x)===series),'Missing attributed sample for '+series);
}
assert.equal(catalog.search('ISHB 200','column')[0].designation,'HB 200');
assert.equal(catalog.search('ISSC 100','column')[0].designation,'SC 100');
assert.equal(catalog.search('ISLB 200','beam')[0].designation,'LB 200');
assert.equal(catalog.search('ISWB 150','beam')[0].designation,'WB 150');
assert.equal(catalog.search('ISJC 100','channel')[0].designation,'JC 100');
assert.equal(catalog.search('ISMCP 150','channel')[0].designation,'MPC 150');
assert.equal(catalog.search('PBP 200','pile')[0].kgPerM,43.85);
assert.ok(catalog.search('100x50x8','angle').length>=1,'Unequal angle must be searchable');
assert.equal(catalog.search('HB 999','column').length,0,'Never invent missing weights');
assert.equal(catalog.search('HB 200','column','SC').length,0,'Series filter must stay exact');
assert.equal(catalog.search('HB 200','column','HB').length,1,'Heavy beam series filter');
assert.equal(catalog.availableSeries('beam').length,6);
assert.equal(catalog.availableSeries('column').length,2);
assert.equal(catalog.availableSeries('channel').length,4);
assert.equal(catalog.availableSeries('angle').length,2);
assert.equal(catalog.availableSeries('pile').length,1);
for(const row of catalog.sections.filter(x=>x.basis==='secondary-unverified')){
 assert.match(row.sourceUrl,/^https:\/\/quickboq\.in\/steel\/tables\//);
 assert.ok(row.series && names.includes(row.series));
 assert.ok(row.standard.includes('BIS row not certified'));
}
// Missing edition-level source verification must remain explicit.
assert.match(app,/Secondary · BIS review/);
assert.ok(app.includes('Nominal dimensions · illustrative · not to scale'),'Dimensioned diagrams must remain non-fabrication drawings');
assert.ok(app.includes('Equal')&&app.includes('Unequal'),'Equal/unequal angle geometry labels required');
assert.ok(app.includes("const dDims=()"),'Section diagrams must show B and D source dimensions');
assert.match(ui,/id="steelSeries"/);
// Manufacturer's later source and the older SAIL 2020 ISA 90×90×6
// disagree; preserve BOTH editions visibly instead of erasing history.
assert.equal(catalog.byId('sail23-ISA90x90x6').kgPerM,8.32);
assert.equal(catalog.byId('sail23-ISA90x90x8').kgPerM,10.92);
assert.equal(catalog.byId('sail23-ISA100x100x8').kgPerM,12.18);
assert.equal(catalog.byId('sail23-ISA150x150x10').kgPerM,22.93);
assert.equal(catalog.byId('sail23-ISA200x200x12').kgPerM,36.85);
assert.equal(catalog.byId('sail23-ISA100x100x12').kgPerM,17.83);
assert.equal(catalog.search('ISA 90x90x8','angle')[0].sourceId,'sailStruct2023','Prioritize dated manufacturer row before historical duplicates');
assert.ok(catalog.search('ISA 90x90x8','angle').some(x=>x.basis==='archived-manufacturer-only'),'Keep older edition for comparison');
assert.equal(catalog.byId('ISA90x90x6').kgPerM,8.2);
assert.ok(catalog.collisionGroups().some(g=>g.some(x=>x.id==='sail23-ISA90x90x6')));
assert.equal(catalog.search('ISMC 300','channel').length,1);
assert.equal(catalog.byId('sail23-ISMC300').kgPerM,36.3);
for(const row of catalog.sections)assert.deepEqual([...catalog.auditRow(row)],[],'Incomplete nominal geometry/source: '+row.id);
assert.equal(catalog.sections.filter(x=>x.family==='hollow').length,18);
assert.equal(catalog.availableSeries('hollow').length,3);
assert.equal(catalog.search('SHS 25x25x2','hollow')[0].kgPerM,1.36);
assert.equal(catalog.search('RHS 40x20x2','hollow')[0].basis,'secondary-amendment-unverified');
assert.equal(catalog.search('CHS 21.3x21.3x2','hollow')[0].kgPerM,0.95);
assert.equal(catalog.search('RHS 100x100x6','hollow').length,0);
assert.match(ui,/id="steelCustomCaution"/);
assert.match(ui,/id="steelHeight"/);
assert.match(ui,/id="steelWeightConflict"/);
const shs=math.geometricMass('hollow-shs',{sideMm:50,thicknessMm:2},6,1,null);
assert.ok(Math.abs(shs.areaMm2-(50*50-46*46))<1e-9);
const rhs=math.geometricMass('hollow-rhs',{heightMm:80,widthMm:40,thicknessMm:3},6,1,null);
assert.ok(Math.abs(rhs.areaMm2-(80*40-74*34))<1e-9);
const chs=math.geometricMass('hollow-chs',{diameterMm:60,thicknessMm:3},6,1,null);
assert.ok(Math.abs(chs.areaMm2-Math.PI/4*(60**2-54**2))<1e-9);
assert.match(chs.basis,/DOES NOT represent/);
for(const type of ['hollow-shs','hollow-rhs','hollow-chs']){
 const dims={sideMm:40,heightMm:40,widthMm:30,diameterMm:50,thicknessMm:30};
 assert.throws(()=>math.geometricMass(type,dims,6,1,null));
}
assert.throws(()=>math.geometricMass('hollow-rhs',{heightMm:80,widthMm:40,thicknessMm:0},6,1,null));
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
console.log('Steel Table V5: 57 curated rows, SAIL 2023 priority, dimensioned diagrams, edition conflicts and hollow nominal/theoretical controls, 18 section series, offline APK, no BBS passed');
