/* Steel V66 source-scoped publication gate.
 * A clear, safe set of nominal section weights is not equivalent to
 * testing installation on a physical Android phone or structural signoff.
 */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const comparison=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const publication=require('../pwd-steel-publication.js');
const source=status.summarize(catalog,comparison,catalog.sections);
const app=publication.create(catalog,comparison);
const active=status.summarize(app,comparison,app.sections);
assert.equal(source.total,active.total+app.publication.excluded);
assert.equal(active.counts.review,0);
assert.equal(active.counts.hold,0);
assert.equal(active.counts.checked,active.total);
assert.ok(app.sections.every(r=>comparison.quantityGate(app,r).allowed));
assert.ok(app.sections.every(r=>catalog.byId(r.id)));
const result={
 version:'Steel V66',
 scope:'Published steel section rows only, not an exhaustive BIS standard',
 decision:'SOURCE_SCOPED_READY_FOR_DEVICE_QA',
 activeRows:active.total,
 activeLimitedSourceChecked:active.counts.checked,
 activePending:active.counts.review,
 activeHold:active.counts.hold,
 excludedFromActiveCatalogue:app.publication.excluded,
 oldSourceRowsKeptForAudit:source.total,
 excludedItemsNotSourceCorrected:true,
 limits:'Nominal weight calculations only. Does not approve structural design, material MTC, construction use, full standard coverage, or physical-device UX. App release requires separate Android acceptance checks.'
};
console.log(JSON.stringify(result,null,2));
