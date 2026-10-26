/* V66 scoped Steel Table entry-to-device-test gate.
 * This does not grant engineering, commercial or production release approval.
 * Source record totals remain separate from active catalogue eligibility.
 */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const original=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const holds=require('../pwd-steel-holds.js');
const working=require('../pwd-steel-working.js').build(original,cmp,status);
const source=status.summarize(original,cmp,original.sections);
const active=status.summarize(working,cmp,working.sections);
const omitted=holds.build(original,cmp,status);
const safe=active.total===686&&active.counts.checked===686&&
 active.counts.review===0&&active.counts.hold===0&&
 source.total===757&&omitted.hold===71&&
 working.omittedSourceCount===71&&
 active.records.every(x=>x.quantityAllowed)&&
 omitted.rows.every(x=>working.byId(x.id)===null)&&
 new Set(active.records.map(x=>x.row.id)).size===active.total;
const result={
 version:'Steel V66',
 decision:safe?'WORKING-CATALOGUE-READY-FOR-DEVICE-QA':'WORKING-CATALOGUE-UNSAFE',
 deploymentApproval:false,
 scope:'Selected nominal weights only. No structural design, procurement or MTC certification.',
 workingSourceChecked:active.counts.checked,
 workingUnverified:active.counts.review,
 workingHeld:active.counts.hold,
 totalSourceRecords:source.total,
 excludedSourceRecords:working.omittedSourceCount,
 excludedNumericInternal:omitted.rows.filter(x=>x.reason==='numeric'||x.reason==='internal').length,
 excludedHistorical:omitted.rows.filter(x=>x.reason==='chs'||x.reason==='nonTabulated').length,
 instructions:'Only listed, source-checked rows can be selected. Test on a physical Android device and obtain separate final release approval. Historical conflicting source weights stay excluded, not silently corrected.'
};
console.log(JSON.stringify(result,null,2));
assert.ok(safe,'Unsafe records reached the active Steel Table. Block Android device QA.');
console.log('STEEL V66 WORKING READINESS PASS: 686 usable nominal entries; all 71 unsupported records removed from the working reference, no inferred values.');
