/* Steel V64: deterministic issue-by-issue evidence register for unresolved
 * numerical source discrepancies. Does not correct or approve nominal weights.
 * The area × 0.785 check is a physical-density diagnostic, NOT BIS tolerance.
 */
(function(root){
'use strict';
function build(catalog,comparison,statusView,holdsModule){
 const holds=holdsModule.build(catalog,comparison,statusView);
 const candidates=holds.rows.filter(x=>x.reason==='numeric'||x.reason==='internal');
 const records=candidates.map(item=>{
  const row=catalog.byId(item.id);
  if(!row||comparison.quantityGate(catalog,row).allowed)
   throw Error('Evidence triage includes a missing or quantity-approved hold: '+item.id);
  const audit=catalog.standardAudit(row);
  const area=Number.isFinite(row.areaCm2)&&row.areaCm2>0?row.areaCm2:null;
  const mass=Number.isFinite(row.kgPerM)&&row.kgPerM>0?row.kgPerM:null;
  const implied=area===null?null:area*0.785; // 7,850 kg/m³; diagnostics only
  const pct=implied===null||mass===null?null:100*(mass-implied)/implied;
  return Object.freeze({
   id:item.id,designation:item.designation,series:item.series,
   reason:item.reason,sourceId:item.sourceId,sourceStatus:item.sourceStatus,
   sourceTable:audit.sourceTable??null,sourcePdfPage:audit.sourcePdfPage??null,
   kgPerM:mass,areaCm2:area,
   diagnosticMassKgM:implied===null?null:Number(implied.toFixed(3)),
   massAreaDifferencePct:pct===null?null:Number(pct.toFixed(2)),
   note:item.evidenceNote,nextEvidence:item.nextEvidence,
   quantityAllowed:false
  });
 });
 const groups=Object.freeze(['numeric','internal'].map(reason=>{
  const matching=records.filter(r=>r.reason===reason);
  return Object.freeze({
   reason,count:matching.length,label:holdsModule.TYPES[reason][0],
   records:Object.freeze(matching)
  });
 }));
 if(records.length!==groups.reduce((a,g)=>a+g.count,0))
  throw Error('Steel triage lost an unresolved source row');
 return Object.freeze({
  checked:holds.checked,review:holds.review,held:holds.hold,
  count:records.length,
  groups,records:Object.freeze(records),
  caution:'Area × 0.785 is only a mass-density diagnostic (7850 kg/m³), NOT a BIS tolerance, substitute nominal kg/m, or structural approval. Original source figures are unchanged.'
 });
}
const api=Object.freeze({build});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelTriage=api;
})(typeof window!=='undefined'?window:globalThis);
