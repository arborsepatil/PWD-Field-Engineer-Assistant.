/* Steel Table comparison, v28. Informational comparison only, never design ranking.
 * Uses existing source and standards audits; missing values remain blank.
 */
(function(root){
'use strict';
const HOLD=new Set([
 'is808-numeric-conflict','source-numeric-hold','mass-area-conflict',
 'rhs-weight-conflict','shs-row-conflict','outside-current-scope',
 'not-listed-in-replacement','spot-checked-conflict'
]);
const CHECKED=new Set([
 'is808-mass-checked','is808-mass-area-inertia-checked','rhs-weight-checked',
 'shs-row-checked','spot-checked-match'
]);
function audit(catalog,row){
 const a=catalog.standardAudit(row)||{status:'not-checked'};
 const issues=catalog.auditRow(row)||[];
 const blocked=HOLD.has(a.status)||row.qualityFlag==='mass-area-inconsistent'||issues.length>0;
 const checked=!blocked&&(CHECKED.has(a.status)||a.geometryChecked===true);
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
// Only explicitly checked, non-conflicting source mass may feed field quantity.
// This is a source-audit gate, NOT permission to certify an actual material batch.
function quantityEligibility(catalog,row){
 if(!row)return Object.freeze({allowed:false,status:'missing',reason:'Select a section first.'});
 const state=audit(catalog,row);
 if(state.status==='hold')return Object.freeze({allowed:false,status:'hold',reason:'Quantity blocked: section source data is on hold or internally conflicting. Verify the original standard and resolve the discrepancy.'});
 if(!CHECKED.has(state.sourceStatus))return Object.freeze({allowed:false,status:'review',reason:'Quantity blocked: this exact section\'s nominal kg/m has not been independently checked against its applicable standard.'});
 if(!Number.isFinite(row.kgPerM)||row.kgPerM<=0)return Object.freeze({allowed:false,status:'hold',reason:'Quantity blocked: no valid nominal mass available.'});
 return Object.freeze({allowed:true,status:'checked',reason:'Source nominal kg/m has a limited independent table check. Confirm applicable amendment, delivered size and MTC before project use.'});
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
const api=Object.freeze({audit,quantityEligibility,dimension,build,HOLD,CHECKED});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelCompare=api;
})(typeof window!=='undefined'?window:globalThis);
