/** Steel V30 - dimensional source-proportional diagram model and offline UI.
 * No BIS raw table redistribution; this reads only approved existing catalogue rows.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-osdag.js'),ctx,{filename:'pwd-steel-osdag.js'});
ctx.PWDSteelOsdag=ctx.module.exports;
ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-catalog.js'),ctx,{filename:'pwd-steel-catalog.js'});
const catalog=ctx.module.exports;
ctx.module={exports:{}};
vm.runInNewContext(read('pwd-steel-diagram.js'),ctx,{filename:'pwd-steel-diagram.js'});
const diagram=ctx.module.exports;
assert.ok(diagram.model&&diagram.svg);
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,'Values differ: '+a+' versus '+b);
const standard=catalog.byId('ISMB300'),beam=diagram.model(standard.family,standard);
assert.equal(beam.kind,'i');
assert.equal(beam.d,300);assert.equal(beam.b,140);
close(beam.width/beam.height,140/300,0.00001);
close(beam.webScaled/beam.height,7.7/300,0.00001);
close(beam.flangeScaled/beam.height,13.1/300,0.00001);
assert.ok(beam.warnings.some(x=>x.includes('Root/toe fillets')));
assert.ok(beam.warnings.some(x=>x.includes('Sloped flange')));
assert.ok(diagram.svg(standard.family,standard).includes('B 140 mm')&&diagram.svg(standard.family,standard).includes('D 300 mm'));
assert.ok(diagram.svg(standard.family,standard).includes('not a fabrication drawing'));
const channel=catalog.byId('ISMC150'),ch=diagram.model('channel',channel);
assert.equal(ch.kind,'channel');assert.equal(ch.sourceWeb,true);assert.equal(ch.sourceFlange,true);
const ang=catalog.byId('ISA100x100x8'),angM=diagram.model('angle',ang);
assert.equal(angM.kind,'angle');
assert.ok(diagram.svg('angle',ang).includes('leg t = 8 mm'));
const a={designation:'200 wide × 50 deep',depthMm:50,widthMm:200,webMm:4,flangeMm:7};
const aDiagram=diagram.model('beam',a);
close(aDiagram.width/aDiagram.height,4,0.00001);
assert.ok(aDiagram.width<=194.01,'Must fit width without clamping aspect');
const b={designation:'50 wide × 300 deep',depthMm:300,widthMm:50,webMm:4,flangeMm:8};
const bDiagram=diagram.model('beam',b);
close(bDiagram.width/bDiagram.height,1/6,0.00001);
assert.ok(bDiagram.height<=166.01,'Must fit depth without clamping aspect');
const invalid=diagram.model('beam',{depthMm:300,widthMm:100,webMm:200,flangeMm:160});
assert.equal(invalid.sourceWeb,false);
assert.equal(invalid.sourceFlange,false);
assert.ok(invalid.warnings.some(x=>x.includes('absent/conflicting')));
const chs={series:'CHS',diameterMm:88.9,depthMm:88.9,thicknessMm:4,designation:'CHS 88.9×4'};
const circular=diagram.model('hollow',chs);
assert.equal(circular.kind,'chs');
close(circular.width/circular.height,1);
assert.equal(circular.sourceWall,true);
assert.ok(diagram.svg('hollow',chs).includes('OD 88.9 mm'));
assert.ok(!diagram.svg('hollow',chs).includes('B 88.9 mm'));
const rhs={series:'RHS',depthMm:150,widthMm:50,thicknessMm:3,designation:'RHS test'};
const hollow=diagram.model('hollow',rhs);
assert.equal(hollow.kind,'rhs');assert.equal(hollow.sourceWall,true);
close(hollow.width/hollow.height,1/3,0.00001);
assert.ok(hollow.warnings.some(x=>x.includes('corner radii')));
const unknown=diagram.model('hollow',{series:'RHS',depthMm:100,widthMm:50});
assert.equal(unknown.sourceWall,false);
assert.ok(unknown.warnings.some(x=>x.includes('Wall thickness unavailable')));
const noSource=diagram.model('beam',{designation:'unverified'});
assert.equal(noSource.ratioOK,false);
assert.ok(noSource.warnings.some(x=>x.includes('Outside dimensions unavailable')));
const injected=diagram.svg('beam',{designation:'<script>bad&bad</script>',depthMm:100,widthMm:50});
assert.ok(!injected.includes('<script>'),'Drawing labels must always be escaped');
assert.ok(injected.includes('&lt;script&gt;'),'Escaped designation retained in SVG');
// All records can be illustrated without artificial min-thickness or aspect clamp.
// Shape geometry is not a mass formula and shall never modify catalogue data.
let shown=0,missing=0;
for(const row of catalog.sections){
 const m=diagram.model(row.family,row);
 assert.ok(m.width>0&&m.height>0,'Missing schematic body '+row.id);
 if(m.ratioOK){
  close(m.width/m.height,m.b/m.d,0.0001);
  assert.ok(m.height<=166.01&&m.width<=194.01,'Oversized picture '+row.id);
  shown++;
 }else missing++;
 const svg=diagram.svg(row.family,row);
 assert.ok(svg.includes('not a fabrication drawing'),'No unsafe fabrication implication '+row.id);
 assert.ok(!svg.includes('NaN')&&!svg.includes('Infinity'),'Nonfinite coordinate '+row.id);
 assert.ok(!svg.includes('<foreignObject'),'Untrusted drawing content '+row.id);
}
assert.ok(shown>=700,'Expected most catalogue rows to have dimensions');
const html=read('pwd_steel_table.html'),app=read('pwd-steel-app.js'),cache=read('sw.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
for(const id of ['steelSectionDiagram','steelDiagramStatus','steelKeyAudit','steelMainDepth','steelMainWidth','steelMainThickness'])
 assert.ok(html.includes('id="'+id+'"'),'UI does not show engineering drawing context '+id);
assert.ok(app.includes('window.PWDSteelDiagram.svg')&&app.includes('window.PWDSteelDiagram.model'),'UI must use audited engineering drawing engine');
assert.ok(html.includes('<script src="./pwd-steel-diagram.js"></script>'),'Load drawing module before app');
assert.ok(cache.includes("'./pwd-steel-diagram.js'"),'New drawings must work offline');
assert.ok(!html.includes('id="steelExport"')&&!html.includes('id="steelPrint"'));
console.log('Steel V30 diagram PASS: '+shown+' source-sized diagrams, '+missing+' source-envelope gaps, extreme aspect ratio, sourced thickness, missing profiles disclosed, all SVGs finite/escaped and offline.');
