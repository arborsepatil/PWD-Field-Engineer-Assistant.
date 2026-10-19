/* PWD Retaining Wall — pure section geometry and preliminary quantities.
 * Existing app profile is preserved, not independently certified as an
 * applicable approved drawing. No stability or reinforcement design.
 * Add future project-specific engineering conditions only after supplied.
 */
(function(root){
'use strict';
const BRASS=2.8316846592;
const EPS=1e-9;
function input(name,value,min,max,exclusiveMin=false){
 if(value===''||value===null||value===undefined)throw Error(name+' is required.');
 const v=Number(value);
 if(!Number.isFinite(v))throw Error(name+' must be a valid number.');
 if(exclusiveMin?v<=min:v<min)throw Error(name+' must be '+(exclusiveMin?'greater than ':'at least ')+min+'.');
 if(v>max)throw Error(name+' must not exceed '+max+'.');
 return v;
}
function profileAt(H,TW,depth){
 if(!Number.isFinite(depth)||depth<0||depth>H+EPS)throw Error('Depth must lie inside the wall height.');
 const d=Math.min(H,depth);
 if(H<=2.5)return {depth:d,back:TW/2,front:TW/2+d/4,total:TW+d/4};
 const frontBreak=H-H/5; // Existing app's bottom H/5 at 1:1.
 const back=TW/2+Math.max(0,d-2.5)/6;
 const front=TW/2+Math.min(d,frontBreak)/4+Math.max(0,d-frontBreak);
 return {depth:d,back,front,total:back+front};
}
function section(H,TW){
 const breaks=H<=2.5?[0,H]:[0,2.5,H-H/5,H].sort((a,b)=>a-b);
 const depths=breaks.filter((d,i)=>i===0||i===breaks.length-1||d!==breaks[i-1]);
 const stations=depths.map(depth=>profileAt(H,TW,depth));
 const segments=[];
 for(let i=1;i<stations.length;i++){
   const upper=stations[i-1],lower=stations[i],h=lower.depth-upper.depth;
   if(h<=0)throw Error('Invalid wall section breakpoint order.');
   segments.push({h,depth1:upper.depth,depth2:lower.depth,w1:upper.total,w2:lower.total,
     area:h*(upper.total+lower.total)/2});
 }
 const wallArea=segments.reduce((sum,s)=>sum+s.area,0);
 if(!(wallArea>0)&&Number.isFinite(wallArea))throw Error('Calculated wall area must be positive.');
 return {stations,segments,wallArea,baseWidth:stations[stations.length-1].total,
   frontBreak:H>2.5?H-H/5:null,backBreak:H>2.5?2.5:null};
}
function calculate(v){
 const H=input('Wall height H',v.H,0.5,10);
 const L=input('Wall length L',v.L,0,Number.MAX_VALUE,true);
 const excD=input('Excavation depth',v.excD,0,Number.MAX_VALUE,true);
 const filterT=input('Filter/rubble thickness',v.filterT,0,Number.MAX_VALUE);
 const weepH=input('Weep-hole horizontal spacing',v.weepH,0,Number.MAX_VALUE,true);
 const weepV=input('Weep-hole vertical spacing',v.weepV,0,Number.MAX_VALUE,true);
 const strict=H>2.5;
 let TW,backOff,frontOff,pccT,solT,grade;
 if(strict){
   TW=.60;backOff=.30;frontOff=H<=5?.30:.40;pccT=.30;grade='M15';
   solT=input('Rubble soling thickness',v.strictSolT,.15,.30);
 }else{
   TW=input('Top width',v.lowTW,.30,Number.MAX_VALUE);
   backOff=input('Back footing projection',v.lowBack,0,Number.MAX_VALUE);
   frontOff=input('Front footing projection',v.lowFront,0,Number.MAX_VALUE);
   pccT=input('PCC thickness',v.lowPccT,.05,Number.MAX_VALUE);
   solT=input('Rubble soling thickness',v.lowSolT,.05,.30);
   grade=v.lowGrade;
   if(!['M10','M15','M20','M25'].includes(grade))throw Error('Choose an available concrete grade.');
 }
 const geo=section(H,TW),baseW=geo.baseWidth,pccW=baseW+backOff+frontOff;
 const concrete=geo.wallArea*L,pcc=pccW*pccT*L,soling=pccW*solT*L,exc=pccW*excD*L,
       filter=L*filterT*H;
 // These are counts on an idealized spacing grid, never an approved arrangement.
 const weepColumns=Math.max(1,Math.ceil(L/weepH-EPS));
 const weepRows=Math.max(1,Math.ceil(H/weepV-EPS));
 const weepApprox=weepColumns*weepRows;
 const values=[geo.wallArea,baseW,pccW,concrete,pcc,soling,exc,filter,weepApprox];
 if(values.some(x=>!Number.isFinite(x))||!Number.isSafeInteger(weepApprox))
   throw Error('Calculated size is too large for a reliable quantity. Review inputs.');
 const checkpoints=Array.from({length:Math.ceil(H)},(_,i)=>i).filter(x=>x<H);
 checkpoints.push(H,...geo.stations.map(x=>x.depth));
 const controls=checkpoints.sort((a,b)=>a-b).filter((x,i,arr)=>i===0||x-arr[i-1]>EPS)
   .map(depth=>profileAt(H,TW,depth));
 return {H,L,TW,strict,wallArea:geo.wallArea,baseW,pccW,pccT,solT,grade,
  backOff,frontOff,concrete,pcc,soling,exc,filter,filterT,weepH,weepV,
  weepColumns,weepRows,weepApprox,sections:geo.segments,stations:geo.stations,controls,
  frontBreak:geo.frontBreak,backBreak:geo.backBreak,BRASS,
  excavationReminder:excD<pccT+solT-EPS,
  profileReminder:true};
}
root.PWDWallCore={BRASS,input,profileAt,section,calculate};
})(typeof window!=='undefined'?window:globalThis);