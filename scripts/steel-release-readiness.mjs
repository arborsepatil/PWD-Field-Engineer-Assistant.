/* Steel Table release-readiness gate. Runs locally or in release automation.
 * "Fully verified" needs zero unchecked/held nominal weights across every
 * catalogue record. This check does not verify structural strength or MTCs.
 * Use --report-only while development is underway; for a release invoke
 * without the flag and require successful exit.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require(path.join(root,'pwd-steel-osdag.js'));
const catalog=require(path.join(root,'pwd-steel-catalog.js'));
const comparison=require(path.join(root,'pwd-steel-compare.js'));
const status=require(path.join(root,'pwd-steel-status.js'));
const audit=status.summarize(catalog,comparison,catalog.sections);
const families={};
for(const record of audit.records){
 const family=record.row.family+' / '+catalog.resolveSeries(record.row);
 families[family]??={checked:0,review:0,hold:0};
 families[family][record.status]++;
}
const remaining=Object.entries(families).map(([family,n])=>({
 family,...n,remaining:n.review+n.hold
})).filter(x=>x.remaining).sort((a,b)=>b.remaining-a.remaining||a.family.localeCompare(b.family));
const complete=audit.counts.review===0&&audit.counts.hold===0&&audit.counts.checked===audit.total;
const result={
 decision:complete?'VERIFIED-NOMINAL-DATA-COMPLETE':'HOLD-DEPLOYMENT',
 currentVersion:'Steel V53',
 catalogueCount:audit.total,...audit.counts,
 definition:'Source-checked nominal section weights only; structural design and delivered-product approval still require project-specific engineering.',
 incompleteByFamily:remaining
};
console.log(JSON.stringify(result,null,2));
if(!complete&&!process.argv.includes('--report-only')){
 console.error('Steel Table release gate FAILED: review and held source records remain. Do not deploy a fully verified Steel Table.');
 process.exitCode=1;
}
