/* Steel V64 — original-source numerical discrepancy review; reference only.
 * Reports reproducible density sanity checks, NEVER a replacement unit weight.
 * The 5 source-page observations refer to a privately held IS 808:2021 copy;
 * this module does not reproduce licensed BIS tables or PDFs.
 */
(function(root){
'use strict';
const PRINTED_SOURCE_OBSERVATIONS=Object.freeze({
 OSD193:Object.freeze({standard:'IS 808:2021',table:4,pdfPage:18}),
 OSD194:Object.freeze({standard:'IS 808:2021',table:4,pdfPage:18}),
 OSD195:Object.freeze({standard:'IS 808:2021',table:4,pdfPage:18}),
 OSD196:Object.freeze({standard:'IS 808:2021',table:4,pdfPage:18}),
 OSD308:Object.freeze({standard:'IS 808:2021',table:6,pdfPage:23})
});
const FIXED_ACTIONS=Object.freeze({
 OSD193:'Printed WPB source pair independently observed; request authoritative clarification of the mass/area inconsistency. Do not replace the mass.',
 OSD194:'Printed WPB source pair independently observed; request authoritative clarification of the mass/area inconsistency. Do not replace the mass.',
 OSD195:'Printed WPB source pair independently observed; request authoritative clarification of the mass/area inconsistency. Do not replace the mass.',
 OSD196:'Printed WPB source pair independently observed; request authoritative clarification of the mass/area inconsistency. Do not replace the mass.',
 OSD308:'Printed MC 175* source pair independently observed; request official clarification before using the nominal mass.',
 OSD578:'CHS archive area appears inconsistent with its mass (possible decimal-place transcription issue). Check original tube database and applicable amended IS 1161 replacement table; do not infer eligibility.',
 OSD180:'WPB mass/area and given profile geometry require an authoritative source clarification; do not apply an assumed corrected mass.'
});
function finitePositive(value){return typeof value==='number'&&Number.isFinite(value)&&value>0;}
function inspect(catalog,comparison,item){
 if(!item||!['numeric','internal'].includes(item.reason))
  throw Error('Steel V64 only accepts the numeric or internal evidence queue');
 const row=catalog.byId(item.id);
 if(!row||comparison.quantityGate(catalog,row).allowed||
    comparison.audit(catalog,row).status!=='hold')
  throw Error('Resolved, absent or unsafe section cannot enter the V64 held evidence register: '+item.id);
 const a=catalog.standardAudit(row)||{};
 const observed=PRINTED_SOURCE_OBSERVATIONS[item.id]||null;
 const pdfPage=observed?.pdfPage??(Number.isInteger(a.sourcePdfPage)?a.sourcePdfPage:null);
 const table=observed?.table??(Number.isInteger(a.sourceTable)?a.sourceTable:null);
 const sourceName=observed?.standard??a.source??catalog.SOURCES[row.sourceId]?.label??'Source not stated';
 const kg=finitePositive(row.kgPerM)?row.kgPerM:null;
 const area=finitePositive(row.areaCm2)?row.areaCm2:null;
 const computed=kg!==null&&area!==null?
  Object.freeze({
   nominalKgPerM:kg,
   listedAreaCm2:area,
   densityEquivalentKgPerM:Math.round(area*.785*10000)/10000,
   absoluteDeviationKgPerM:Math.round(Math.abs(kg-area*.785)*10000)/10000,
   relativeDeviationPct:Math.round(Math.abs(kg-area*.785)/kg*10000)/100,
   assessment:'Internal density sanity only (7850 kg/m³) — NOT a BIS tolerance or approved replacement mass.'
  }):null;
 const sourceEvidence=observed?
  'Original source PDF page '+pdfPage+', Table '+table+
  ': same inconsistent pair is printed there. Check independent corrigendum.':
  table!==null?'Previously audited table '+table+(pdfPage?' (owner PDF page '+pdfPage+')':'')+
  '; resolve recorded source conflict with authoritative revision.':
  'Look up the exact designation in its governing source and verify the printed numeric cells.';
 return Object.freeze({
  id:item.id,designation:item.designation,series:item.series,family:item.family,
  category:item.reason,sourceId:item.sourceId,sourceStatus:item.sourceStatus,
  sourceName,sourceTable:table,sourcePdfPage:pdfPage,
  printedDiscrepancyObserved:!!observed,
  sourceEvidence,nextEvidence:FIXED_ACTIONS[item.id]??item.nextEvidence,
  densityCheck:computed,
  evidenceNote:item.evidenceNote,
  quantityAllowed:false,
  resolution:'HOLD — authoritative source clarification needed'
 });
}
function build(catalog,comparison,holds){
 if(!holds||!Array.isArray(holds.rows))throw Error('Expected V61 source-evidence register');
 const candidates=holds.rows.filter(x=>x.reason==='numeric'||x.reason==='internal');
 const entries=Object.freeze(candidates.map(item=>inspect(catalog,comparison,item)));
 const groups=Object.freeze(['internal','numeric'].map(key=>Object.freeze({
  key,count:entries.filter(x=>x.category===key).length
 })));
 if(entries.length!==groups.reduce((a,b)=>a+b.count,0))
  throw Error('Numerical discrepancy inventory inconsistent');
 return Object.freeze({
  total:entries.length,groups,rows:entries,
  printedPairConfirmed:entries.filter(x=>x.printedDiscrepancyObserved).length,
  densityCheckCount:entries.filter(x=>x.densityCheck!==null).length,
  eligibility:'Reference only; all reported nominal quantities blocked.'
 });
}
const api=Object.freeze({PRINTED_SOURCE_OBSERVATIONS,inspect,build});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelDiscrepancies=api;
})(typeof window!=='undefined'?window:globalThis);
