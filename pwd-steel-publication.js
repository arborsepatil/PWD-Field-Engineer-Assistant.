/* Steel V66 — production-facing nominal-weight catalogue.
 * No unverified or source-conflicting section is selectable, searchable,
 * comparable or accessible by ID through this public view.
 *
 * Original source rows remain ONLY in the development provenance catalogue
 * and Git history, so historical/conflicting manufacturer records are never
 * silently rewritten as BIS values.  This module is not a BIS certification,
 * MTC acceptance or structural-design approval.
 */
(function(root){
'use strict';
function create(source,comparison){
 if(!source||!Array.isArray(source.sections)||!comparison||
    typeof comparison.quantityGate!=='function')
  throw Error('Source catalogue and audited quantity gate required');
 const published=[],excluded=[];
 const ids=new Set();
 for(const row of source.sections){
  const result=comparison.audit(source,row);
  const gate=comparison.quantityGate(source,row);
  if(result.status==='checked'&&gate.allowed){
   if(ids.has(row.id))throw Error('Duplicate published steel ID: '+row.id);
   ids.add(row.id);
   published.push(row);
  }else{
   if(gate.allowed)throw Error('Unsafe steel publication state: '+row.id);
   excluded.push(row);
  }
 }
 if(!published.length)throw Error('Empty source-checked steel catalogue');
 const byId=id=>ids.has(id)?source.byId(id):null;
 const search=(query,family='all',series='all')=>
  Object.freeze(source.search(query,family,series).filter(row=>ids.has(row.id)));
 const collisionGroups=()=>
  source.collisionGroups().map(group=>group.filter(row=>ids.has(row.id)))
   .filter(group=>group.length>1);
 const availableSeries=family=>
  source.availableSeries(family).filter(series=>
   published.some(row=>row.family===family&&source.resolveSeries(row)===series.id));
 const output=Object.freeze({
  ...source,sections:Object.freeze(published),
  search,byId,collisionGroups,availableSeries,
  publication:Object.freeze({
   scope:'SOURCE_CHECKED_ONLY',total:published.length,
   excluded:excluded.length,
   note:'Only selected nominal weights with a matching limited source check; not full BIS, physical-product or design certification.'
  })
 });
 for(const row of output.sections){
  if(!comparison.quantityGate(output,row).allowed)
   throw Error('Published steel row unexpectedly failed quantity eligibility: '+row.id);
 }
 return output;
}
const api=Object.freeze({create});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelPublished=api;
})(typeof window!=='undefined'?window:globalThis);
