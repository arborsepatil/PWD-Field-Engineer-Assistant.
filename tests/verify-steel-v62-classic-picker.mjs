/* V62: preserve the user's compact Steel Table browsing workflow.
 * No proprietary screenshot/code reuse. Current source gate remains unchanged.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('pwd_steel_table.html');
const app=read('pwd-steel-app.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const comparison=require('../pwd-steel-compare.js');
const statuses=require('../pwd-steel-status.js');
const all=statuses.select(catalog,comparison,catalog.sections,'all');
const working=statuses.select(catalog,comparison,catalog.sections,'checked');
const archived=statuses.select(catalog,comparison,catalog.sections,'hold');
assert.equal(all.total,757);
assert.deepEqual({...all.counts},{checked:686,review:0,hold:71});
assert.equal(working.rows.length,686);
assert.equal(archived.rows.length,71);
assert.equal(new Set(working.rows.map(x=>x.id)).size,686);
assert.equal(new Set(archived.rows.map(x=>x.id)).size,71);
assert.ok(working.rows.every(x=>comparison.quantityGate(catalog,x).allowed));
assert.ok(archived.rows.every(x=>!comparison.quantityGate(catalog,x).allowed));
assert.ok(archived.rows.every(x=>!working.rows.includes(x)),
 'Archived rows must never appear in the ordinary working data view');
const pick=html.match(/<select id="steelAuditFilter"[^>]*>([^]*?)<\/select>/);
assert.ok(pick,'Source view must remain selectable');
assert.match(pick[1],/<option value="checked" selected>Working/);
assert.ok(pick[1].indexOf('value="checked"')<pick[1].indexOf('value="hold"'));
assert.match(pick[1],/<option value="hold">Archive/);
assert.match(pick[1],/<option value="all">All records/);
assert.ok(app.includes("steelStatus.select(catalog,comparison,rawRows,$('steelAuditFilter').value)"),
 'Picker must actually apply the user-selected source-status filter');
assert.match(app,/if\(!selected\|\|!rows\.some\(x=>x\.id===selected\.id\)\)selected=rows\[0\]\|\|null/,
 'Source-view switches must never retain a hidden archive row as the selected record');
assert.match(app,/quantityState\.category==='hold'\?'HOLD · reference'/,
 'Archived reference cards must label their unverified nominal weight');
const override=html.lastIndexOf('.results{grid-template-columns:repeat(2,minmax(0,1fr))');
const oldSingle=html.lastIndexOf('.results{grid-template-columns:1fr}');
assert.ok(override>oldSingle,'Mobile two-column compact grid must override old single-column CSS');
assert.match(html,/@media\(max-width:480px\)[^]*?\.size-row \.pick\{width:100%;padding:9px 8px 41px;min-height:90px\}/);
assert.match(html,/<div class="steel-technical-quickview"><div class="steel-metrics-column">/);
assert.match(html,/<div class="steel-figure-column"><div id="steelSectionDiagram"/);
assert.ok(html.includes('grid-template-columns:minmax(0,1fr) minmax(0,1.1fr)'),
 'Large-screen section drawing and nominal properties appear together');
assert.match(html,/<section class="card steel-comparison" id="steelCompareCard"[^>]*hidden>/);
assert.ok(app.includes("$('steelCompareCard').hidden=family==='calculated'||items.length===0;"),
 'Empty comparison must not distract from the reference-table workflow');
assert.ok(app.includes("['Weight difference vs first (kg/m)'"),
 'Side-by-side source-mass difference is available for source-checked sections');
assert.ok(app.includes("x.audit.status!=='checked'||rows[0].audit.status!=='checked'"),
 'Never compare held/unverified weights as an approved difference');
assert.ok(app.includes("comparison.build(catalog,items)"),
 'Use source-aware comparison model');
assert.ok(!app.includes('saveCsv()')&&!app.includes('window.print()'),
 'Keep original compact UI free of cluttering actions');
assert.match(html,/<details class="details" id="steelQuantityDisclosure">/,
 'Quantities remain a secondary, optional function');
assert.ok(read('sw.js').includes('pwd-tools-steel-v62-2026-10-26'));
const sampleA=catalog.byId('ISMB300'),sampleB=catalog.byId('ISMB200');
assert.ok(sampleA&&sampleB);
assert.equal(comparison.audit(catalog,sampleA).status,'checked');
assert.equal(comparison.audit(catalog,sampleB).status,'checked');
const data=comparison.build(catalog,[sampleA,sampleB]);
assert.equal(data.length,2);
assert.ok(Number.isFinite(data[1].kgPerM-data[0].kgPerM));
assert.equal(comparison.quantityGate(catalog,catalog.byId('OSD180')).allowed,false);
console.log('STEEL V62 PASS: familiar two-column mobile size picker; working-only default (686), 71 archived source holds, optional safe comparison and prominent drawings; no data or quantity-gate changes.');
