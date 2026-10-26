/* Steel V66: source-checked steel members only in actual working view.
 * Deletion is logical from the shipped UI dataset: 71 historical source rows
 * remain in the development audit catalogue, not quantity/search selection.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=x=>fs.readFileSync(path.join(root,x),'utf8');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const workingModule=require('../pwd-steel-working.js');
const holds=require('../pwd-steel-holds.js');
const raw=status.summarize(cat,cmp,cat.sections);
const live=workingModule.build(cat,cmp,status);
assert.equal(raw.total,757);
assert.deepEqual({...raw.counts},{checked:686,review:0,hold:71});
assert.equal(live.totalImported,757);
assert.equal(live.activeCount,686);
assert.equal(live.sections.length,686);
assert.equal(live.excludedCount,71);
assert.equal(live.excludedRows.length,71);
assert.equal(live.activeCount+live.excludedCount,live.totalImported);
assert.equal(new Set(live.sections.map(x=>x.id)).size,686);
assert.equal(new Set(live.excludedRows.map(x=>x.id)).size,71);
assert.ok(Object.isFrozen(live)&&Object.isFrozen(live.sections));
assert.ok(live.sections.every(x=>cmp.quantityGate(cat,x).allowed));
assert.ok(live.excludedRows.every(x=>!live.byId(x.id)));
const workingIds=new Set(live.sections.map(x=>x.id));
assert.ok(live.excludedRows.every(x=>!workingIds.has(x.id)));
for(const row of cat.sections) {
 const state=cmp.audit(cat,row).status;
 assert.equal(Boolean(live.byId(row.id)),state==='checked',
  'Unverified record entered working app: '+row.id);
}
assert.equal(live.byId('OSD180'),null);
assert.equal(live.byId('OSD578'),null);
assert.equal(live.byId('ISA90x90x6'),null);
assert.equal(live.byId('sail23-ISA200x200x18'),null);
assert.ok(live.byId('ISMB300'));
assert.ok(live.search('ISMB 300','beam').some(x=>x.id==='ISMB300'));
assert.ok(!live.search('ISA 90×90×6','angle').some(x=>x.id==='ISA90x90x6'));
assert.equal(live.search('','all','all').length,686);
for(const catType of ['beam','channel','column','angle','pile','hollow']){
 const found=live.search('',catType,'all');
 assert.ok(found.every(x=>x.family===catType));
 assert.ok(found.every(x=>cmp.quantityGate(cat,x).allowed));
}
const app=read('pwd-steel-app.js'),html=read('pwd_steel_table.html');
new vm.Script(app,{filename:'pwd-steel-app.js'});
new vm.Script(read('pwd-steel-working.js'),{filename:'pwd-steel-working.js'});
assert.match(app,/const working=window.PWDSteelWorking\.build\(catalog,comparison,steelStatus\)/);
assert.match(app,/const rawRows=working\.search\(/);
assert.match(app,/steelStatus\.select\(catalog,comparison,rawRows,'checked'\)/);
assert.match(app,/compareIds\.map\(id=>working\.byId\(id\)\)/);
assert.ok(!app.includes("catalog.search($('steelSearch')"),
 'User-facing search must use working-only projection');
assert.match(html,/<div class="steel-status-filter hide-print" hidden>/,
 'Archived library picker must not be shown in user-facing working table');
assert.match(html,/<script src="\.\/pwd-steel-working\.js"><\/script>/);
assert.match(read('sw.js'),/'\.\/pwd-steel-working\.js'/);
assert.match(read('sw.js'),/pwd-tools-steel-v66-2026-10-27/);
const release=read('scripts/steel-release-readiness.mjs');
assert.match(release,/workingCatalogueCount:working\.activeCount/);
assert.match(release,/workingVerifiedForNominalArithmetic:activeReady/);
assert.match(release,/productionReleaseApproved:false/);
assert.match(release,/READY-FOR-DEVICE-VALIDATION/);
assert.match(release,/--require-production-release/);
assert.match(release,/currentVersion:'Steel V66'/);
assert.equal(holds.build(cat,cmp,status).hold,71,'Audit history preserved for future re-verification');
console.log('STEEL V66 PASS: 686 source-checked active rows; 71 historical/conflicting rows inaccessible in working search, selection and comparison; no invented values; Android device QA remains.');
