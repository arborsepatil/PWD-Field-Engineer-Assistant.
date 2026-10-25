/* Steel V41. Stable, auditable section status selection; never upgrades source data.
 * This view model does not compute a weight, infer a missing dimension or
 * override the current nominal mass quantity gate.
 */
(function(root){
'use strict';
const TYPES=Object.freeze(['checked','review','hold']);
const LABEL=Object.freeze({
 checked:'Limited source check · provisional quantity permitted',
 review:'Not independently checked · reference only',
 hold:'On hold · source discrepancy or outside checked scope'
});
function summarize(catalog,comparison,rows){
 if(!Array.isArray(rows))throw Error('Steel rows must be an array');
 const counts={checked:0,review:0,hold:0};
 const records=rows.map(row=>{
  const result=comparison.audit(catalog,row);
  const gate=comparison.quantityGate(catalog,row);
  let status=result.status;
  // Fail closed if a future change makes audit status and quantity gate disagree.
  if(status==='checked'&&!gate.allowed)status='hold';
  if(status!=='checked'&&gate.allowed)status='hold';
  if(!TYPES.includes(status))status='hold';
  counts[status]++;
  return Object.freeze({row,status,quantityAllowed:status==='checked'&&gate.allowed});
 });
 return Object.freeze({counts:Object.freeze(counts),total:rows.length,records:Object.freeze(records)});
}
function select(catalog,comparison,rows,filter='all'){
 if(filter!=='all'&&!TYPES.includes(filter))throw Error('Unknown steel source-status filter');
 const audit=summarize(catalog,comparison,rows);
 return Object.freeze({...audit,rows:Object.freeze(audit.records.filter(x=>filter==='all'||x.status===filter).map(x=>x.row))});
}
const api=Object.freeze({TYPES,LABEL,summarize,select});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelStatus=api;
})(typeof window!=='undefined'?window:globalThis);
