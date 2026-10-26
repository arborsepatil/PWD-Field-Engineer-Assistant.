/* Steel V66: release-scope contract.
 * 71 invalid/ambiguous historical records are absent from the user's steel
 * catalogue, not relabelled as checked or silently mass-corrected.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const source=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const published=require('../pwd-steel-publication.js').create(source,compare);
const raw=status.summarize(source,compare,source.sections);
const scope=status.summarize(published,compare,published.sections);
assert.equal(raw.total,757);
assert.deepEqual({...raw.counts},{checked:686,review:0,hold:71});
assert.equal(scope.total,686);
assert.deepEqual({...scope.counts},{checked:686,review:0,hold:0});
assert.equal(published.publication.total,686);
assert.equal(published.publication.excluded,71);
assert.equal(published.publication.scope,'SOURCE_CHECKED_ONLY');
assert.ok(Object.isFrozen(published.sections));
assert.ok(published.sections.every(r=>compare.quantityGate(published,r).allowed));
const excluded=source.sections.filter(r=>!published.byId(r.id));
assert.equal(excluded.length,71);
assert.ok(excluded.every(r=>compare.audit(source,r).status==='hold'));
for(const row of excluded){
 assert.equal(published.byId(row.id),null,'No retired ID lookup: '+row.id);
 const query=published.search(row.designation,row.family,row.series||'all');
 assert.ok(query.every(result=>compare.quantityGate(published,result).allowed),
 'Name search cannot return the retired mass: '+row.id);
}
assert.equal(published.byId('OSD180'),null);
assert.equal(published.byId('OSD578'),null);
assert.equal(published.byId('ISA90x90x6'),null);
assert.ok(source.byId('OSD180'),'Retirement must preserve original provenance in Git/source');
assert.ok(published.byId('bis21-ISA60x60x5'),
 'Retain independently checked BIS Table 9 alternative mass instead of conflicting manufacturer row');
assert.ok(!published.sections.some(r=>r.id==='sail23-ISA60x60x5'));
assert.ok(published.search('', 'beam','all').every(r=>r.family==='beam'));
assert.ok(published.search('','hollow','CHS').every(r=>r.series==='CHS'));
for(const series of published.availableSeries('angle'))
 assert.ok(published.sections.some(r=>r.family==='angle'&&published.resolveSeries(r)===series.id));
for(const group of published.collisionGroups())
 assert.ok(group.every(x=>published.byId(x.id)), 'No conflict warning from hidden historical records');
assert.equal(status.select(published,compare,published.sections,'all').rows.length,686);
const html=read('pwd_steel_table.html'),app=read('pwd-steel-app.js'),sw=read('sw.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
new vm.Script(read('pwd-steel-publication.js'),{filename:'pwd-steel-publication.js'});
assert.match(html,/pwd-steel-publication\.js/);
assert.ok(html.indexOf('pwd-steel-publication.js')<html.indexOf('pwd-steel-app.js'));
assert.match(html,/\.steel-status-filter\{display:none!important\}/,
 'Retired catalogue view must not be exposed through a filter control');
assert.match(app,/window\.PWDSteelPublished\.create\(sourceCatalog,comparison\)/);
assert.match(app,/catalog\.publication\.excluded/);
assert.ok(sw.includes("'./pwd-steel-publication.js'"),'Published view must be bundled offline');
assert.match(sw,/pwd-tools-steel-v66-2026-10-27/);
assert.match(read('scripts/steel-release-readiness.mjs'),/currentVersion:'Steel V66'/);
assert.ok(html.includes('steel-visual-and-facts')&&html.includes('steelCategoryDrawer'));
assert.ok(!app.includes('window.print()'));
console.log('STEEL V66 PASS: 686 checked sections exposed to Steel Table; 71 unsupported records removed from active search, byId, comparison and quantity; source evidence preserved, original UI unchanged.');
