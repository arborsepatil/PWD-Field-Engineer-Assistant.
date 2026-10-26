/* Steel V66 — source-checked WORKING catalogue projection.
 * All 757 imported source rows remain immutable for audit/history. Unresolved
 * rows never enter the working search, selection or comparison path.
 * This is a scope cut, NEVER a correction or proof of structural suitability.
 */
(function(root){
'use strict';
function build(catalog,comparison,statusView){
 const snapshot=statusView.summarize(catalog,comparison,catalog.sections);
 const approved=snapshot.records.filter(x=>x.status==='checked'&&x.quantityAllowed)
  .map(x=>x.row);
 const excluded=snapshot.records.filter(x=>x.status!=='checked'||!x.quantityAllowed)
  .map(x=>Object.freeze({
   id:x.row.id,designation:x.row.designation,sourceId:x.row.sourceId,
   sourceStatus:comparison.audit(catalog,x.row).sourceStatus,
   status:x.status,reason:comparison.audit(catalog,x.row).note,
   quantityAllowed:false
  }));
 const idMap=new Map(approved.map(x=>[x.id,x]));
 if(idMap.size!==approved.length)throw Error('Working section IDs must be unique');
 if(approved.length+excluded.length!==snapshot.total)
  throw Error('Source history and working catalogue are inconsistent');
 for(const row of approved){
  if(!comparison.quantityGate(catalog,row).allowed)
   throw Error('A non-verified nominal weight entered working catalogue: '+row.id);
 }
 const sections=Object.freeze(approved);
 const excludedRows=Object.freeze(excluded);
 function search(q,family='all',series='all'){
  return Object.freeze(catalog.search(q,family,series).filter(x=>idMap.has(x.id)));
 }
 function byId(id){return idMap.get(id)||null;}
 return Object.freeze({
  sections,excludedRows,search,byId,
  totalImported:snapshot.total,
  activeCount:sections.length,
  excludedCount:excludedRows.length,
  mode:'SOURCE-CHECKED-NOMINAL-WEIGHTS-ONLY',
  caveat:'Selected nominal kg/m have a limited source check. This is not a structural design, supplied material, amendment completeness, or MTC certification.'
 });
}
const api=Object.freeze({build});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelWorking=api;
})(typeof window!=='undefined'?window:globalThis);
