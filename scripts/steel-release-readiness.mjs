/* Steel V66 working-data release gate.
 * Accepts only the limited, source-checked nominal masses in the ACTIVE table.
 * Historical excluded rows remain visible in engineering audit history, but
 * do not hold the working table hostage. A passing working-data gate DOES NOT
 * authorize a production APK without physical Android QA and sign-off.
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
const holds=require(path.join(root,'pwd-steel-holds.js'));
const evidence=require(path.join(root,'pwd-steel-evidence.js'));
const workingModule=require(path.join(root,'pwd-steel-working.js'));
const audit=status.summarize(catalog,comparison,catalog.sections);
const holdEvidence=holds.build(catalog,comparison,status);
const numericEvidence=evidence.build(catalog,comparison,status,holds);
const working=workingModule.build(catalog,comparison,status);
const activeAudit=status.summarize(catalog,comparison,working.sections);
const families={};
for(const record of audit.records){
 const family=record.row.family+' / '+catalog.resolveSeries(record.row);
 families[family]??={checked:0,review:0,hold:0};
 families[family][record.status]++;
}
const remaining=Object.entries(families).map(([family,n])=>({
 family,...n,remaining:n.review+n.hold
})).filter(x=>x.remaining).sort((a,b)=>b.remaining-a.remaining||a.family.localeCompare(b.family));
const activeReady=activeAudit.total>0&&activeAudit.counts.review===0&&activeAudit.counts.hold===0&&activeAudit.counts.checked===activeAudit.total&&working.excludedCount+activeAudit.total===audit.total;
const result={
 decision:activeReady?'READY-FOR-DEVICE-VALIDATION':'HOLD-WORKING-CATALOGUE',
 currentVersion:'Steel V66',
 catalogueCount:audit.total,...audit.counts,
 workingCatalogueCount:working.activeCount,excludedFromWorkingCount:working.excludedCount,
 workingVerifiedForNominalArithmetic:activeReady,
 workingVerificationScope:'Limited source-confirmed nominal kg/m ONLY; physical-device QA and production release still pending.',
 productionReleaseApproved:false,
 definition:'Source-checked nominal section weights only; structural design and delivered-product approval still require project-specific engineering.',
 incompleteByFamily:remaining,
 holdEvidenceGroups:holdEvidence.groups.map(g=>({reason:g.key,count:g.count,nextEvidence:g.nextEvidence})),
 numericEvidenceCount:numericEvidence.totals,
 numericEvidenceIds:numericEvidence.rows.map(r=>r.id),
 numericEvidencePriorityCounts:numericEvidence.priorityCounts,
 numericEvidenceFirstPass:numericEvidence.reviewQueue.filter(r=>r.reviewPlan.priority==='P1').map(r=>({id:r.id,route:r.reviewPlan.route}))
};
console.log(JSON.stringify(result,null,2));
if(!activeReady&&!process.argv.includes('--report-only')){
 console.error('Steel Table working-data gate FAILED: an active source row is not independently source-checked.');
 process.exitCode=1;
}
if(process.argv.includes('--require-production-release')){
 console.error('Production release still requires physical Android acceptance, product validation and project sign-off; active nominal-source audit alone is not production certification.');
 process.exitCode=1;
}
