/* Deterministic quantity calculations for the three Concrete Batch Assistant workflows.
   SSR consumption rows and nominal ratios remain in the existing module and are not fabricated here. */
(function(root){
'use strict';
const BRASS=2.8316846592, BAGKG=50;
const UNITS={m3:1,brass:BRASS,ft3:0.028316846592};
function positive(x,label){const n=Number(x);if(!Number.isFinite(n)||n<=0)throw Error(label+' must be greater than zero.');return n}
function wcRatio(wc){const n=positive(wc,'Water/cement ratio');if(n<.20||n>.70)throw Error('Enter an adopted w/c ratio between 0.20 and 0.70.');return n}
function cubicMetres(q,unit='m3'){const factor=UNITS[unit];if(!factor)throw Error('Unrecognized volume unit.');return positive(q,'Concrete quantity')*factor}
function scale(source,volume,wc){
 const v=positive(volume,'Concrete volume'),waterCement=wcRatio(wc);
 if(!source||!Number.isFinite(source.c)||source.c<=0)throw Error('Selected PWD row has no valid cement quantity.');
 const scaled={};
 for(const key of ['s','a40','a20','a10']){
   const n=source[key];
   if(n===null||n===undefined){scaled[key]=null;continue}
   if(!Number.isFinite(n)||n<0)throw Error('Source row has an invalid '+key+' quantity.');
   scaled[key]=n*v;
 }
 const bags=source.c*v,cementKg=bags*BAGKG;
 return {factor:v,volumeM3:v,bags,cementKg,orderBags:Math.ceil(bags-1e-10),water:cementKg*waterCement,...scaled};
}
function ajax(source,{basis='volume',volume=.5,bags=4,wc=.5,total=0}={}){
 const w=wcRatio(wc);
 let batchM3;
 if(basis==='volume')batchM3=positive(volume,'Usable concrete per batch');
 else if(basis==='bags'){
  if(!source||!Number.isFinite(source.c)||source.c<=0)throw Error('Cement consumption is missing for this source row.');
  batchM3=positive(bags,'Cement bags per batch')/source.c;
 }else throw Error('Unknown AJAX batching basis.');
 const batch=scale(source,batchM3,w);
 const t=total===''||total===null?0:Number(total);
 if(!Number.isFinite(t)||t<0)throw Error('Total concrete must be zero/blank or a positive quantity.');
 const exactBatches=t>0?t/batchM3:0;
 const wholeBatches=t>0?Math.ceil(exactBatches-1e-10):0;
 return {batchM3,batch,totalM3:t,exactBatches,wholeBatches,procurement:t>0?scale(source,t,w):null};
}
function nominal(grade,cementMeasures,rows){
 const row=rows.find(x=>x[0]===grade);if(!row)throw Error('Choose a nominal grade from the reference table.');
 const cement=positive(cementMeasures,'Cement measuring units');
 const ratio=row[1].split(':').map(x=>Number(x.trim()));
 if(ratio.length!==3||ratio.some(x=>!Number.isFinite(x)||x<=0))throw Error('Nominal reference ratio is invalid.');
 return {cement,sand:cement*ratio[1]/ratio[0],coarse:cement*ratio[2]/ratio[0],ratio:row[1]};
}
root.PWDBatchCore={BRASS,BAGKG,UNITS,positive,wcRatio,cubicMetres,scale,ajax,nominal};
})(typeof window!=='undefined'?window:globalThis);