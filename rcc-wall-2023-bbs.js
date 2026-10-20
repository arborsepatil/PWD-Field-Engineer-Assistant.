/* Draft, user-completed BBS worksheet. SOURCE MK diameters/C-C spacing are immutable.
 * GAD PDF 209 gives sketches but no complete dimensioned cut-length schedule.
 * Count, measured cutting length must be input by engineer from approved drawings.
 * Theoretical steel mass, independent engineering formula:
 * kg/m = PI/4*(diameter_mm/1000)^2*7850 kg/m3.
 * No cut lengths, laps, bar-counts or project steel tonnages are inferred.
 */
(function(root){
'use strict';
const DENSITY_KG_PER_M3=7850;
function unitMassKgM(diameterMm){
 if(!Number.isFinite(diameterMm)||diameterMm<=0||diameterMm>80)throw Error('Invalid bar diameter.');
 return Math.PI/4*(diameterMm/1000)**2*DENSITY_KG_PER_M3;
}
function estimate(entry,count,cutLengthM){
 if(!entry||!entry.present||!Number.isFinite(entry.diameterMm))throw Error('Source bar mark is not shown at this height.');
 // No quantity is computed until BOTH positive user entries are available.
 const n=Number(count),len=Number(cutLengthM);
 if(count===''||cutLengthM===''||!Number.isInteger(n)||n<=0||n>1e6)throw Error('Engineer must enter a positive whole bar count.');
 if(!Number.isFinite(len)||len<=0||len>100)throw Error('Engineer must enter positive cutting length ≤ 100 m.');
 const kgPerM=unitMassKgM(entry.diameterMm);
 return Object.freeze({mark:entry.mark,diameterMm:entry.diameterMm,spacingMm:entry.spacingMm,
  count:n,cutLengthM:len,kgPerM,totalLengthM:n*len,weightKg:n*len*kgPerM,
  calculatedFrom:'User-confirmed bar count and cutting length × theoretical steel unit mass'});
}
function worksheet(schedule,inputs){
 if(!schedule||!Array.isArray(schedule.marks)||schedule.marks.length!==11)throw Error('The verified reinforcement source table is required.');
 const result=[],pending=[],invalid=[];
 for(const bar of schedule.marks){
  if(!bar.present)continue;
  const values=inputs&&inputs[bar.mark]?inputs[bar.mark]:{};
  const n=values.count??'',len=values.cutLengthM??'';
  if(n===''&&len===''){pending.push(bar.mark);continue;}
  try{result.push(estimate(bar,n,len));}
  catch(err){invalid.push({mark:bar.mark,error:err.message});}
 }
 return Object.freeze({items:result,completed:result.length,pending,invalid,
  totalLengthM:result.reduce((s,r)=>s+r.totalLengthM,0),
  totalWeightKg:result.reduce((s,r)=>s+r.weightKg,0),
  allVerified:pending.length===0&&invalid.length===0});
}
function protectCsv(v){
 let s=String(v??'');
 if(/^\s*[=+@\-\t\r]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
function draftCsv(project,record,schedule,inputs,planningTakeoff=null){
 const sheet=worksheet(schedule,inputs),lines=[];
 const line=a=>lines.push(a.map(protectCsv).join(','));
 line(['RCC PWD 2023 · DRAFT BBS · VERIFY BEFORE SITE USE']);
 line(['Project (optional)',project||'']);
 line(['Source drawing',record.drawing]);line(['PDF page',record.pdfPage]);
 line(['SBC (t/m²)',record.sbc]);line(['Height (m)',record.heightM]);
 line(['Original concrete (m³; printed)',record.concreteM3]);
 line(['Original steel (kg; printed)',record.steelKg]);
 line(['ATTENTION','Printed material amounts are source-table values, NOT totals from the BBS below']);
 if(planningTakeoff){
  line(['GEOMETRY-BASED PLANNING QUANTITY','NOT official PWD book table and not certified field measurement']);
  line(['Entered project wall length (m)',planningTakeoff.lengthM]);
  line(['Calculated RCC section area (m²)',planningTakeoff.crossSectionAreaM2.toFixed(5)]);
  line(['Calculated structural RCC volume (m³)',planningTakeoff.concretePlanningM3.toFixed(3)]);
  line(['Calculated M15 levelling PCC 100 mm volume (m³)',planningTakeoff.pccLevellingPlanningM3.toFixed(3)]);
  line(['Geometry source','PWD 2023 GAD 151-1/4 dimensions A–I; per running metre basis inferred from geometric match across 27 printed table rows']);
  line(['CAUTION','No inferred project-length steel quantity; BBS remains a separate engineer-entered worksheet']);
 }

 line(['Mark','Location','Diameter (mm)','Spacing (mm C/C)','Bars (entered)','Cut length (m; entered)','Theoretical kg/m','Calculated weight (kg)','Status']);
 for(const bar of schedule.marks){
  if(!bar.present){line([bar.mark,bar.location,'—','—','','','','','Not listed in source']);continue;}
  const selected=sheet.items.find(r=>r.mark===bar.mark);
  const err=sheet.invalid.find(r=>r.mark===bar.mark);
  line([bar.mark,bar.location,bar.diameterMm,bar.spacingMm,selected?.count??'',selected?.cutLengthM??'',selected?.kgPerM?.toFixed(5)??'',selected?.weightKg?.toFixed(3)??'',selected?'User lengths/counts; review':err?'Invalid input: '+err.error:'Not yet completed']);
 }
 line(['DRAFT BBS TOTAL (kg)','','','','','','',sheet.totalWeightKg.toFixed(3),'Only completed and valid entries; not a construction quantity']);
 line(['BBS status',sheet.allVerified?'All source marks filled; independent engineering approval still required':'Incomplete or invalid entries remain']);
 line(['Unit mass source','Engineering formula PI/4*(d/1000)^2*7850 kg/m; not quoted from PWD source table']);
 line(['Scope','No automatic cutting length, lap, shape deduction, anchorage, stability or approval']);
 return '\ufeff'+lines.join('\r\n')+'\r\n';
}
const api=Object.freeze({unitMassKgM,estimate,worksheet,draftCsv,DENSITY_KG_PER_M3});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDRCC2023BBS=api;
})(typeof window!=='undefined'?window:globalThis);
