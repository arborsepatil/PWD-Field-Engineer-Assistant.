/* Steel Table comparison, v28. Informational comparison only, never design ranking.
 * Uses existing source and standards audits; missing values remain blank.
 */
(function(root){
'use strict';
const HOLD=new Set([
 'is808-numeric-conflict','source-numeric-hold','mass-area-conflict',
 'rhs-weight-conflict','shs-row-conflict','outside-current-scope',
 'not-listed-in-replacement','is808-not-tabulated','spot-checked-conflict'
]);
const CHECKED=new Set([
 'is808-mass-checked','is808-mass-area-inertia-checked','rhs-weight-checked',
 'shs-row-checked','spot-checked-match'
]);
function audit(catalog,row){
 const a=catalog.standardAudit(row)||{status:'not-checked'};
 const issues=catalog.auditRow(row)||[];
 const blocked=HOLD.has(a.status)||row.qualityFlag==='mass-area-inconsistent'||issues.length>0;
 const checked=!blocked&&CHECKED.has(a.status); // Geometry-only flags never verify nominal mass.
 return Object.freeze({
  status:blocked?'hold':checked?'checked':'review',
  label:blocked?'On hold':checked?'Selected values checked':'Source only · verify',
  sourceStatus:a.status||'not-checked',
  note:blocked?(a.note||'Source data conflict or incomplete source record; do not use for quantities or structural decisions.'):
   checked?(a.note||'Selected numerical values compared to a source; not a product or design certification.'):
   (a.note||'This section has not been fully reconciled to the applicable BIS source.'),
  issues:[...issues]
 });
}
/* This gate is for nominal unit-weight arithmetic, not for structural design,
 * delivered product acceptance or final estimate certification.
 * Numeric mass has to have a *matching* selected authoritative source check.
 */
function quantityGate(catalog,row){
 if(!row||!Number.isFinite(row.kgPerM)||row.kgPerM<=0)
  return Object.freeze({allowed:false,category:'invalid',message:'No valid positive nominal kg/m in this source record.'});
 const state=audit(catalog,row);
 if(state.status==='hold')
  return Object.freeze({allowed:false,category:'hold',message:'Quantity blocked: this section has a source discrepancy or is outside the checked standard scope. Resolve the source record before use.',sourceStatus:state.sourceStatus});
 if(state.status!=='checked')
  return Object.freeze({allowed:false,category:'pending',message:'Quantity blocked: nominal weight for this variant has not been checked against the applicable current BIS table. Reference-only value.',sourceStatus:state.sourceStatus});
 return Object.freeze({allowed:true,category:'limited-check',message:'Provisional quantity arithmetic only: the selected nominal kg/m has a limited BIS source check. Reconfirm edition, amendments, member identity and MTC before engineering approval.',sourceStatus:state.sourceStatus});
}
function dimension(row){
 if(row.family==='hollow'&&row.series==='CHS'){
  const od=row.diameterMm??row.depthMm;
  return {first:'Outside diameter',second:'—',depth:od,width:null,thickness:row.thicknessMm??null};
 }
 const thick=['beam','column','channel','pile'].includes(row.family)?row.webMm:row.thicknessMm;
 return {first:'Depth / long leg',second:'Width / short leg',depth:row.depthMm??null,width:row.widthMm??null,thickness:thick??null};
}
function build(catalog,items){
 if(!Array.isArray(items)||items.length<1)return Object.freeze([]);
 if(items.some(x=>!x||x.family!==items[0].family))throw Error('Compare members of one section family only.');
 if(new Set(items.map(x=>x.id)).size!==items.length)throw Error('A section cannot be compared with itself.');
 return Object.freeze(items.map(row=>{
  const dim=dimension(row),checked=audit(catalog,row);
  return Object.freeze({
   id:row.id,designation:row.designation,family:row.family,series:catalog.resolveSeries(row),
   depthMm:dim.depth,widthMm:dim.width,thicknessMm:dim.thickness,
   thicknessLabel:['beam','column','channel','pile'].includes(row.family)?'Web thickness':'Wall / leg thickness',
   kgPerM:row.kgPerM,areaCm2:row.areaCm2??null,
   ixCm4:row.ixCm4??null,iyCm4:row.iyCm4??null,
   flangeMm:row.flangeMm??null,designationSource:catalog.SOURCES[row.sourceId]?.label||'Source not stated',
   audit:checked
  });
 }));
}
const api=Object.freeze({audit,quantityGate,dimension,build,HOLD,CHECKED});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelCompare=api;
})(typeof window!=='undefined'?window:globalThis);
