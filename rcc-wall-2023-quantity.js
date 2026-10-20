/* RCC PWD 2023 Section G: transparent independent geometric quantity audit.
 * Schematic geometry: PDF p209 (GAD 151-1/4); dimensions: pp210-212.
 * Book table prints m3 of concrete without an explicit run-length heading.
 * Polygon area (m2) numerically matches the source m3 entries within 0.0075
 * for all 27 type-plan cases, strongly suggesting a one-metre run.
 * Project volume is calculated directly from geometry * entered length,
 * NOT by scaling the rounded book table. Do not infer steel quantities.
 * Geometry excludes 100mm M15 levelling PCC, returns, end blocks,
 * excavation, soil details, haunches, wastage and design checks.
 */
(function(root){
'use strict';
function points(record){
 if(!record||!record.dimensionsMm)throw Error('Source wall dimensions are required.');
 const d=record.dimensionsMm;
 for(const k of 'ABCDEFGHI')if(!Number.isFinite(d[k])||d[k]<=0)throw Error('Invalid dimension '+k+'.');
 if(d.A!==record.heightM*1000)throw Error('Dimension A does not match the source height.');
 if(Math.abs(d.B-d.F-d.E-d.D)>1e-7)throw Error('Footing sub-widths do not match B.');
 if(Math.abs(d.A-d.C-d.H)>1e-7)throw Error('Stem height does not match A/C/H.');
 if(d.E<d.I||d.G<d.H)throw Error('Stem and footing section is not valid.');
 return [[0,0],[0,d.H],[d.F,d.G],[d.F+d.E-d.I,d.A],[d.F+d.E,d.A],[d.F+d.E,d.G],[d.B,d.H],[d.B,0]];
}
function areaM2(record){
 const p=points(record);
 const area2=p.reduce((sum,[x,y],i)=>{
  const [nextX,nextY]=p[(i+1)%p.length];
  return sum+x*nextY-nextX*y;
 },0);
 const area=Math.abs(area2)/2/1e6; // A–I are mm.
 if(!Number.isFinite(area)||area<=0)throw Error('Computed RCC section area is invalid.');
 return area;
}
function crossCheck(record){
 const area=areaM2(record),printed=Number(record.concreteM3);
 if(!Number.isFinite(printed)||printed<=0)throw Error('Missing printed PWD concrete quantity.');
 const difference=area-printed;
 return Object.freeze({
  areaM2:area,sourceConcreteM3:printed,
  discrepancyM2:difference,absoluteDifferenceM2:Math.abs(difference),
  comparesToOneMetreRun:true,
  toleranceM2:0.008,
  nearMatch:Math.abs(difference)<=0.008,
  note:'Numerical correspondence suggests but does not certify the one-metre-run basis; use the actual approved drawing.'
 });
}
function estimate(record,lengthM){
 if(lengthM===''||lengthM===null||lengthM===undefined)throw Error('Enter wall length in metres.');
 const value=Number(lengthM);
 if(!Number.isFinite(value)||value<=0||value>10000)throw Error('Wall length must be greater than 0 and not exceed 10,000 m.');
 const area=areaM2(record);
 const volume=area*value;
 if(!Number.isFinite(volume)||volume<=0)throw Error('Unreliable concrete volume. Review the inputs.');
 return Object.freeze({wallLengthM:value,areaM2:area,concreteM3:volume,
  method:'2023 GAD A-I polygon cross-section area × entered straight wall length',
  exclusions:'PCC levelling, returns, excavation, changed heights, end details and wastage excluded'});
}
function csvCell(v){
 let s=String(v??'');
 if(/^\s*[=+\-@\t\r]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
function quantityCsv(project,record,lengthM){
 const check=crossCheck(record);
 const result=estimate(record,lengthM);
 const lines=[];
 const add=(label,value,unit,origin)=>lines.push([label,value,unit,origin].map(csvCell).join(','));
 add('PWD RCC 2023 · GEOMETRY-DERIVED DRAFT CONCRETE QUANTITY','','','Not certified');
 add('Project (optional)',project||'','','Engineer entered');
 add('Source drawing',record.drawing,'','PWD 2023 Section G');
 add('PDF page',record.pdfPage,'','Original drawing');
 add('SBC',record.sbc,'t/m²','Selected drawing, not site verification');
 add('Wall height',record.heightM,'m','Selected source height');
 for(const [k,v]of Object.entries(record.dimensionsMm))add('Dimension '+k,v,'mm','PWD 2023 table');
 add('PWD printed concrete',record.concreteM3,'m³','Source schedule only');
 add('Independent section area',check.areaM2.toFixed(5),'m²','A-I GAD polygon');
 add('Absolute table/area difference',check.absoluteDifferenceM2.toFixed(5),'m²','Comparison to assumed 1m run');
 add('Wall length (entered)',result.wallLengthM,'m','Engineer entered');
 add('Geometric RCC concrete',result.concreteM3.toFixed(5),'m³','Section area × wall length');
 add('Excluded','M15 PCC levelling, returns, excavation, varying heights, joints and wastage','','Engineering review required');
 add('CAUTION','Do NOT scale book steel quantity or treat this as approved estimate','','Design and measurement review required');
 return '\ufeff'+lines.join('\r\n')+'\r\n';
}
const api=Object.freeze({points,areaM2,crossCheck,estimate,quantityCsv});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDRCC2023Quantity=api;
})(typeof window!=='undefined'?window:globalThis);
