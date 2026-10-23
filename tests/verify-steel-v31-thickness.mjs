/** Steel V31: enforce no pixel-clamp on valid sourced thin or thick section dimensions. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const ctx={module:{exports:{}}};vm.runInNewContext(fs.readFileSync(path.join(root,'pwd-steel-diagram.js'),'utf8'),ctx);
const d=ctx.module.exports,f=n=>Math.round(n*1000)/1000;
function shapePath(svg){return svg.match(/<g class="shape"[^>]*><path d="([^"]+)"/)?.[1]||''}
const cases=[
 ['beam',{depthMm:100,widthMm:50,webMm:49,flangeMm:49},'i'],
 ['channel',{depthMm:100,widthMm:50,webMm:49,flangeMm:49},'channel'],
 ['angle',{depthMm:100,widthMm:50,thicknessMm:45},'angle'],
 ['hollow',{series:'RHS',depthMm:100,widthMm:50,thicknessMm:24.5},'rhs']
];
for(const [type,row,kind] of cases){
 const m=d.model(type,row),drawing=d.svg(type,row),shape=shapePath(drawing);
 assert.equal(m.kind,kind);
 assert.ok(m.ratioOK);
 if(kind==='i'){
  const webX=f(250+m.webScaled/2),flangeY=f(m.y+m.flangeScaled);
  assert.ok(shape.includes('H'+webX+'V'), 'I section web compressed instead of sourced thickness: '+shape);
  assert.ok(shape.includes('V'+flangeY+'H'), 'I section flange compressed instead of sourced thickness');
 }else if(kind==='channel'){
  const webX=f(m.x+m.webScaled),flangeY=f(m.y+m.flangeScaled);
  assert.ok(shape.includes('H'+webX+'V'),'Channel web compressed: '+shape);
  assert.ok(shape.includes('V'+flangeY+'H'),'Channel flange compressed: '+shape);
 }else if(kind==='angle'){
  assert.ok(shape.includes('H'+f(m.x+m.thick*m.scale)+'V'),'Angle leg thickness compressed');
 }else if(kind==='rhs'){
  assert.ok(drawing.includes('<rect class="cutout" x="'+f(m.x+m.wallScaled)+'"'),'Hollow wall dimension compressed');
 }
 assert.ok(drawing.includes('not a fabrication drawing'));
}
const pile={designation:'Synthetic pile',depthMm:200,widthMm:205,webMm:9.3,flangeMm:9.3};
const pm=d.model('pile',pile);
assert.ok(pm.warnings.some(x=>x.includes('generic I-shaped envelope')));
assert.ok(d.svg('pile',pile).includes('Pile member outline is a generic I-shaped envelope'));
const empty=d.model('angle',{depthMm:100,widthMm:50});
assert.ok(empty.warnings.some(x=>x.includes('Leg thickness unavailable')));
assert.ok(d.svg('angle',{depthMm:100,widthMm:50}).includes('Thickness or profile geometry not fully sourced'));
console.log('Steel V31 geometry PASS: no source-value web/flange/angle/wall clamps even for extreme valid thickness; pile outline cautioned.');
