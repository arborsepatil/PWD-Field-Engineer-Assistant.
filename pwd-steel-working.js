/* Steel V66 — ship only source-checked, quantity-eligible member records.
 * The canonical source catalogue remains in version control for audit and
 * possible authoritative correction; historical holds are NOT browseable
 * through this production-facing catalogue.
 * This module supplies no substitute values and does not relax BIS checks.
 */
(function(root){
'use strict';
function build(source,compare,status){
 if(!source||!compare||!status)throw Error('Steel working catalogue requires its authoritative source audit');
 const analysis=status.summarize(source,compare,source.sections);
 const accepted=Object.freeze(analysis.records
  .filter(x=>x.status==='checked'&&x.quantityAllowed&&
   compare.quantityGate(source,x.row).allowed)
  .map(x=>x.row));
 const ids=new Set(accepted.map(x=>x.id));
 if(ids.size!==accepted.length)throw Error('Duplicated working steel section identity');
 if(!accepted.length)throw Error('No source-checked steel sections for working reference');
 if(accepted.some(x=>compare.audit(source,x).status!=='checked'||
   !compare.quantityGate(source,x).allowed))
  throw Error('Working Steel Table includes a held, pending or invalid member');
 const search=(q,family='all',series='all')=>source.search(q,family,series).filter(x=>ids.has(x.id));
 const byId=id=>ids.has(id)?source.byId(id):null;
 const availableSeries=family=>source.availableSeries(family).filter(s=>
  accepted.some(x=>x.family===family&&source.resolveSeries(x)===s.id));
 const collisionGroups=()=>source.collisionGroups().map(group=>
  group.filter(x=>ids.has(x.id))).filter(group=>group.length>1);
 const api=Object.freeze({...source,sections:accepted,search,byId,availableSeries,collisionGroups,
  workingOnly:true,
  omittedSourceCount:analysis.total-accepted.length});
 return api;
}
const api=Object.freeze({build});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelWorking=api;
})(typeof window!=='undefined'?window:globalThis);
