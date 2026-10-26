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
 return Object.freeze({totals,rows:Object.freeze(entries),byId});
}
const api=Object.freeze({DENSITY_KG_PER_M3,TARGETS,densityCheck,build});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelEvidence=api;
})(typeof window!=='undefined'?window:globalThis);
