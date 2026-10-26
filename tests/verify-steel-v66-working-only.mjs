/** Steel V66: source-checked release scope; 71 unsupported weights removed
 * from all visible selections, comparisons and nominal calculations.
 * Retain original supplier/source evidence in the developer catalogue ONLY.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const original=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const workingModule=require('../pwd-steel-working.js');
const working=workingModule.build(original,compare,status);
const master=status.summarize(original,compare,original.sections);
const active=status.summarize(working,compare,working.sections);
assert.deepEqual({...master.counts},{checked:686,review:0,hold:71});
assert.deepEqual({...active.counts},{checked:686,review:0,hold:0});
assert.equal(original.sections.length,757);
assert.equal(working.sections.length,686);
assert.equal(working.omittedSourceCount,71);
assert.equal(working.workingOnly,true);
assert.ok(Object.isFrozen(working)&&Object.isFrozen(working.sections));
assert.equal(new Set(working.sections.map(x=>x.id)).size,686);
const archived=holds.build(original,compare,status).rows;
assert.equal(archived.length,71);
const ids=new Set(working.sections.map(x=>x.id));
for(const row of working.sections){
 assert.ok(original.byId(row.id));
 assert.equal(compare.audit(original,row).status,'checked');
 assert.equal(compare.quantityGate(original,row).allowed,true);
 assert.equal(compare.quantityGate(working,row).allowed,true);
 assert.equal(working.byId(row.id),row);
}
for(const held of archived){
 const row=original.byId(held.id);
 assert.ok(row);
 assert.equal(working.byId(held.id),null,'Exclude historical source from usable byId: '+held.id);
 assert.ok(!ids.has(held.id),'Held records not selectable: '+held.id);
 assert.equal(compare.quantityGate(original,row).allowed,false);
}
for(const family of ['beam','column','channel','angle','pile','hollow']){
 assert.ok(working.search('',family).every(row=>ids.has(row.id)));
 for(const s of working.availableSeries(family)){
  const rows=working.search('',family,s.id);
  assert.ok(rows.length,'Only display populated verified member series: '+s.id);
  assert.ok(rows.every(x=>x.family===family&&original.resolveSeries(x)===s.id));
 }
}
for(const query of ['ISMB300','ISA','CHS','WPB','PBP','RHS','SHS','ISMC 150']){
 assert.ok(working.search(query).every(row=>ids.has(row.id)),
  'Search cannot restore unverified source: '+query);
}
assert.equal(working.search('').length,686,'All-series search must not show archive');
assert.ok(working.collisionGroups().flat().every(x=>ids.has(x.id)));
assert.ok(working.byId('OSD180')===null&&working.byId('OSD578')===null);
const html=read('pwd_steel_table.html'),app=read('pwd-steel-app.js'),sw=read('sw.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
new vm.Script(read('pwd-steel-working.js'),{filename:'pwd-steel-working.js'});
assert.match(html,/<div class="steel-status-filter hide-print" hidden>/,
 'Do not expose archive/all filter in usable Steel Table');
assert.match(html,/<details class="steel-tech" id="steelHoldSummary" hidden>/);
assert.match(html,/<script src="\.\/pwd-steel-working\.js"><\/script>/);
assert.ok(html.indexOf('src="./pwd-steel-working.js"')<
 html.indexOf('src="./pwd-steel-app.js"'));
assert.match(app,/window\.PWDSteelWorking\.build\(window\.PWDSteelCatalog,window\.PWDSteelCompare,window\.PWDSteelStatus\)/);
assert.match(app,/catalog\.omittedSourceCount\+' unsupported\/conflicting historical source records excluded/);
assert.match(app,/comparison\.quantityGate\(catalog,selected\)/,
 'Quantity gate cannot be dropped');
assert.match(app,/comparison\.build\(catalog,items\)/,
 'Compare only visible source-checked members');
assert.match(sw,/'\.\/pwd-steel-working\.js'/);
assert.match(sw,/pwd-tools-steel-v66-2026-10-27/);
assert.ok(html.includes('steel-category-drawer')&&html.includes('steel-visual-and-facts'),
 'Keep approved reference-style UI untouched');
console.log('STEEL V66 PASS: only 686 source-checked records offered in picker/comparison/calculator; 71 unavailable, full historical evidence retained outside working scope.');
