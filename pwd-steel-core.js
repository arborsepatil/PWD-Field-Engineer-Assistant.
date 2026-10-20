/* Steel Table V1 calculation engine. Quantity aid, NOT design check.
 * Published manufacturer mass is retained unchanged. User-made rectangular/
 * circular cross-sections use density assumption 7850 kg/m3, not BIS weights.
 */
(function(root){
'use strict';
const DENSITY_KG_M3=7850;
function positive(value,label,max){
 if(value===''||value===undefined||value===null)throw Error(label+' is required.');
 const n=Number(value);if(!Number.isFinite(n)||n<=0||n>max)throw Error(label+' is invalid.');
 return n;
}
function quantity(entry,length,count,rate){
 if(!entry||!Number.isFinite(entry.kgPerM)||entry.kgPerM<=0)throw Error('Select a source record.');
 const L=positive(length,'Length in m',10000),N=positive(count,'Pieces',100000);
 if(!Number.isSafeInteger(N))throw Error('Pieces must be whole.');
 const r=rate===''||rate===null||rate===undefined?null:Number(rate);
 if(r!==null&&(!Number.isFinite(r)||r<0||r>1e8))throw Error('Rate must be non-negative.');
 const totalKg=L*N*entry.kgPerM;
 return Object.freeze({lengthM:L,count:N,unitMassKgM:entry.kgPerM,totalLengthM:L*N,totalMassKg:totalKg,totalTonnes:totalKg/1000,ratePerKg:r,totalPrice:r===null?null:r*totalKg,basis:'Manufacturer published kg/m × length × count'});
}
function geometricMass(type,dimensions,length,count,rate){
 const d=dimensions||{};
 let areaMm2;
 if(type==='plate'||type==='flat')areaMm2=positive(d.widthMm,'Width (mm)',20000)*positive(d.thicknessMm,'Thickness (mm)',1000);
 else if(type==='round')areaMm2=Math.PI/4*positive(d.diameterMm,'Diameter (mm)',2000)**2;
 else if(type==='square')areaMm2=positive(d.sideMm,'Square side (mm)',2000)**2;
 else throw Error('Unsupported geometry.');
 const kgPerM=areaMm2/1e6*DENSITY_KG_M3;
 const result=quantity({kgPerM},length,count,rate);
 return Object.freeze({...result,type,areaMm2,basis:'Theoretical geometric mass; density assumed 7850 kg/m³; not nominal BIS table value'});
}
function csvCell(value){
 let s=String(value??'');
 if(/^\s*[=+\-@\t\r]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
function exportCsv(entry,result){
 const rows=[
 ['PWD FIELD ASSISTANT — STEEL TABLE V1 — DRAFT TAKEOFF'],
 ['Designation',entry.designation||entry.type||''],
 ['Published source',entry.sourceLabel||'User-entered geometry'],
 ['Source date',entry.sourceDate||'Not applicable'],
 ['Source status',entry.sourceStatus||'Theoretical estimate'],
 ['Unit mass (kg/m)',result.unitMassKgM],
 ['Member length (m)',result.lengthM],['Pieces',result.count],
 ['Total length (m)',result.totalLengthM],['Total mass (kg)',result.totalMassKg],
 ['Total mass (tonnes)',result.totalTonnes],
 ['Rate (INR/kg)',result.ratePerKg===null?'not entered':result.ratePerKg],
 ['Indicative cost (INR)',result.totalPrice===null?'not calculated':result.totalPrice],
 ['Method',result.basis],
 ['CAUTION','Not a design, measured as-built steel weight, or independent BIS table certification']
 ];
 return '\ufeff'+rows.map(a=>a.map(csvCell).join(',')).join('\r\n')+'\r\n';
}
const api=Object.freeze({DENSITY_KG_M3,quantity,geometricMass,csvCell,exportCsv});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelMath=api;
})(typeof window!=='undefined'?window:globalThis);