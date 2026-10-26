/* V64 Steel: read-only numeric discrepancy evidence for 21 held source rows.
 * The 7850 kg/m³ check is a diagnostic assumption, not a BIS tolerance and
 * never authorizes a replacement mass or relaxes quantity checking.
 */
(function(root){
'use strict';
const DENSITY_KG_PER_M3=7850;
const TARGETS=Object.freeze(['numeric','internal']);
function finitePositive(value){return typeof value==='number'&&Number.isFinite(value)&&value>0;}
function round(value,places){const k=10**places;return Math.round((value+Number.EPSILON)*k)/k;}
function densityCheck(row){
 const mass=row.kgPerM,area=row.areaCm2;
 if(!finitePositive(mass)||!finitePositive(area))return null;
 // Area in cm² multiplied by 0.785 kg/(m·cm²) at 7850 kg/m³.
 const inferred=area*DENSITY_KG_PER_M3/10000;
 const difference=mass-inferred;
 return Object.freeze({
  recordedKgPerM:mass,recordedAreaCm2:area,
  impliedKgPerM:round(inferred,4),
  differenceKgPerM:round(difference,4),
  differencePercentOfRecorded:round(100*difference/mass,3),
  basis:'Sanity check from recorded area at assumed steel density 7850 kg/m³; not a replacement nominal weight or a BIS acceptance tolerance.'
 });
}
/* V65 investigation order is an engineering review queue, NOT a code tolerance,
 * correction, product approval, or permitted quantity status. Absolute mass/area
 * deviation is merely a clue; agreement cannot clear a geometry/source conflict.
 */
function reviewPlan(item,row,sourceAudit,densitySanity){
 const note=[item.evidenceNote,sourceAudit.note].filter(Boolean).join(' ');
 const ratio=densitySanity?densitySanity.recordedKgPerM/densitySanity.impliedKgPerM:null;
 if(item.reason==='numeric'&&/plate-geometry/i.test(note))
  return Object.freeze({
   priority:'P1',route:'geometry-vs-source',
   explanation:'Printed mass and area may agree while source dimensions contradict the section geometry.',
   action:'Recheck exact designation, D/B, web and flange dimensions, radii and the official table row. Seek authoritative clarification; an area-derived mass must not replace the listed source mass.'
  });
 if(item.reason==='internal'&&ratio!==null&&(ratio>=4||ratio<=0.25))
  return Object.freeze({
   priority:'P1',route:'large-scale-mass-area',
   explanation:'Stored mass and area disagree by a large factor. This suggests a possible data-entry, unit or source problem, not a proven decimal correction.',
   action:'Inspect the primary source image for mass, area, units and OD/wall thickness; record a separately verified source correction before changing data.'
  });
 if(item.reason==='internal')
  return Object.freeze({
   priority:'P2',route:'internal-area-recheck',
   explanation:'The recorded mass is inconsistent with the recorded area under the diagnostic density assumption.',
   action:'Compare the source image for mass and section area, check units and member identity, then corroborate with an authoritative edition. Keep the record held.'
  });
 if(row.family==='angle'&&sourceAudit.sourceTable===9)
  return Object.freeze({
   priority:'P2',route:'angle-edition-conflict',
   explanation:'An archived or manufacturer equal-angle record differs from the checked IS 808:2021 source row.',
   action:'Reconcile the exact equal-leg angle designation and edition in IS 808 Table 9 against the dated manufacturer source. Do not overwrite the old manufacturer record.'
  });
 return Object.freeze({
  priority:'P2',route:'source-row-reconciliation',
  explanation:'The available source properties or section identity disagree with independently checked source evidence.',
  action:'Open the cited table and physical page; reconcile dimensions, designation and printed section properties. Obtain independent source confirmation before any data change.'
 });
}
function build(catalog,comparison,statusView,holdView){
 const register=holdView.build(catalog,comparison,statusView);
 const entries=[];
 for(const item of register.rows){
  if(!TARGETS.includes(item.reason))continue;
  const row=catalog.byId(item.id);
  if(!row)throw Error('Source row absent from hold evidence: '+item.id);
  const gate=comparison.quantityGate(catalog,row);
  const audit=comparison.audit(catalog,row);
  if(gate.allowed||audit.status!=='hold'||item.quantityAllowed!==false)
   throw Error('Unsafe numeric source evidence release: '+item.id);
  const sourceAudit=catalog.standardAudit(row);
  const source=catalog.SOURCES[row.sourceId]||null;
  entries.push(Object.freeze({
   id:item.id,designation:item.designation,series:item.series,
   family:item.family,reason:item.reason,sourceId:item.sourceId,
   sourceLabel:source?.label||'Source unknown',sourceDate:source?.date||null,
   sourceStatus:item.sourceStatus,sourceStandard:sourceAudit.source||null,
   sourceTable:sourceAudit.sourceTable??null,
   sourcePdfPage:sourceAudit.sourcePdfPage??null,
   originalKgPerM:finitePositive(row.kgPerM)?row.kgPerM:null,
   originalAreaCm2:finitePositive(row.areaCm2)?row.areaCm2:null,
   densitySanity:densityCheck(row),
   reviewPlan:reviewPlan(item,row,sourceAudit,densityCheck(row)),
   sourceNote:item.evidenceNote,nextEvidence:item.nextEvidence,
   existingIssues:Object.freeze([...(audit.issues||[])]),
   approvedReplacementKgPerM:null,quantityAllowed:false
  }));
 }
 if(entries.length!==register.groups.filter(x=>TARGETS.includes(x.key))
  .reduce((sum,g)=>sum+g.count,0))throw Error('Steel numeric evidence does not match hold register');
 const byId=Object.freeze(Object.fromEntries(entries.map(e=>[e.id,e])));
 const totals=Object.freeze({
  numeric:entries.filter(x=>x.reason==='numeric').length,
  internal:entries.filter(x=>x.reason==='internal').length,
  total:entries.length
 });
 const order=Object.freeze({P1:0,P2:1});
 const reviewQueue=Object.freeze([...entries].sort((a,b)=>
  order[a.reviewPlan.priority]-order[b.reviewPlan.priority]||
  a.reviewPlan.route.localeCompare(b.reviewPlan.route)||
  a.id.localeCompare(b.id)));
 const priorityCounts=Object.freeze({
  P1:reviewQueue.filter(e=>e.reviewPlan.priority==='P1').length,
  P2:reviewQueue.filter(e=>e.reviewPlan.priority==='P2').length
 });
 return Object.freeze({totals,rows:Object.freeze(entries),byId,reviewQueue,priorityCounts});
}
const api=Object.freeze({DENSITY_KG_PER_M3,TARGETS,densityCheck,reviewPlan,build});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelEvidence=api;
})(typeof window!=='undefined'?window:globalThis);
