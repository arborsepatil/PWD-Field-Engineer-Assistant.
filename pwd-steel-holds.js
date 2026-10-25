/* Steel V61: source-evidence hold triage. Does not approve weights.
 * Groups existing held records by defensible remediation route.
 * This module is independent of copyrighted source-table contents.
 */
(function(root){
'use strict';
const TYPES=Object.freeze({
 internal:['Internal mass/area discrepancy','Check original source figure and seek an authoritative correction; do not infer a revised value.'],
 numeric:['Published source conflict','Reconcile exact standard edition, designation and manufacturer table; require an authoritative correction.'],
 chs:['CHS not in 2023 replacement table','Check applicable purchaser–manufacturer thickness agreement, approved product data and independently supported nominal mass.'],
 nonTabulated:['Historical section not tabulated in IS 808','Check contract specification and independently verified custom section properties; do not label the archived mass a BIS table weight.'],
 scope:['Outside current specified scope','Identify the applicable product specification and contract requirements before any calculation.'],
 provenance:['Previously audited row altered','Restore the exact original source record or complete a fresh independent source comparison.'],
 other:['Additional source evidence required','Inspect the row-specific audit note and identify the official source evidence before any approval.']
});
function typeFor(row,audit){
 if(row.qualityFlag==='mass-area-inconsistent'||audit.sourceStatus==='mass-area-conflict')
  return 'internal';
 if(['is808-numeric-conflict','source-numeric-hold','rhs-weight-conflict','shs-row-conflict'].includes(audit.sourceStatus))
  return 'numeric';
 if(audit.sourceStatus==='not-listed-in-replacement')return 'chs';
 if(audit.sourceStatus==='is808-not-tabulated')return 'nonTabulated';
 if(audit.sourceStatus==='outside-current-scope')return 'scope';
 if(audit.sourceStatus==='spot-checked-conflict')return 'provenance';
 return 'other';
}
function build(catalog,comparison,statusView){
 const all=statusView.summarize(catalog,comparison,catalog.sections);
 const categories={};
 const rows=[];
 for(const {row,status} of all.records){
  if(status!=='hold')continue;
  const evidence=comparison.audit(catalog,row);
  const gate=comparison.quantityGate(catalog,row);
  if(gate.allowed||evidence.status!=='hold')throw Error('A held section unexpectedly passed nominal weight quantity gating: '+row.id);
  const group=typeFor(row,evidence);
  const [label,nextEvidence]=TYPES[group];
  categories[group]??={key:group,label,nextEvidence,count:0};
  categories[group].count++;
  rows.push(Object.freeze({
   id:row.id,designation:row.designation,series:catalog.resolveSeries(row),
   sourceId:row.sourceId,sourceStatus:evidence.sourceStatus,
   family:row.family,reason:group,
   evidenceNote:evidence.note,
   nextEvidence,quantityAllowed:false
  }));
 }
 const groups=Object.freeze(Object.values(categories).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label))
  .map(x=>Object.freeze({...x})));
 if(rows.length!==all.counts.hold||groups.reduce((n,x)=>n+x.count,0)!==rows.length)
  throw Error('Steel hold register is inconsistent with the catalogue summary');
 return Object.freeze({
  total:all.total,checked:all.counts.checked,review:all.counts.review,
  hold:all.counts.hold,groups,rows:Object.freeze(rows)
 });
}
const api=Object.freeze({TYPES,typeFor,build});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelHolds=api;
})(typeof window!=='undefined'?window:globalThis);
