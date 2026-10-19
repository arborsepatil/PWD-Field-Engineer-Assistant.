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

/* Construction-setting-out stations measured UP from top of PCC.
 * Each batter junction interrupts the 1 m interval; after the junction a
 * fresh 1 m interval starts. Do not insert the abandoned intermediate metre.
 * No design assumptions: junction elevations must come from the same profile.
 */
function constructionLevels(H,junctions=[],interval=1){
 if(!Number.isFinite(H)||H<=0||!Number.isFinite(interval)||interval<=0)
   throw Error('Height and construction interval must be positive numbers.');
 const sorted=junctions.map(j=>Number(typeof j==='number'?j:j.height)).sort((a,b)=>a-b);
 if(sorted.some(v=>!Number.isFinite(v)||v<0||v>H))throw Error('Batter junction must lie inside the wall height.');
 const unique=sorted.filter((v,i)=>v>EPS&&v<H-EPS&&(i===0||v-sorted[i-1]>EPS));
 const levels=[0];let last=0,i=0;
 while(last<H-EPS){
   let next=Math.min(H,last+interval);
   while(i<unique.length&&unique[i]<=last+EPS)i++;
   if(i<unique.length&&unique[i]<=next+EPS)next=unique[i++];
   if(next<=last+EPS)throw Error('Invalid construction level spacing.');
   last=next;
   levels.push(last);
   if(levels.length>1000)throw Error('Too many construction levels.');
 }
 if(Math.abs(levels[levels.length-1]-H)<=EPS)levels[levels.length-1]=H;
 return levels;
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
 const junctions=strict?[
   {height:H/5,side:'right',description:'Right/front 1:4 ↔ 1:1'},
   {height:H-2.5,side:'left',description:'Left/back vertical ↔ 1:6'}
 ]:[];
 const stationHeights=constructionLevels(H,junctions,1);
 const controls=stationHeights.map(height=>{
   const depth=H-height;
   const z=profileAt(H,TW,depth);
   const sideChanges=junctions.filter(j=>Math.abs(j.height-height)<=EPS);
   return {...z,height,left:z.back,right:z.front,
      junction:sideChanges.length>0,
      junctionSides:sideChanges.map(j=>j.side),
      intervalFromPrevious:height===0?0:height-stationHeights[stationHeights.indexOf(height)-1]};
 });
 return {H,L,TW,strict,wallArea:geo.wallArea,baseW,pccW,pccT,solT,grade,
  backOff,frontOff,concrete,pcc,soling,exc,excD,filter,filterT,weepH,weepV,
  weepColumns,weepRows,weepApprox,sections:geo.segments,stations:geo.stations,controls,junctions,
  frontBreak:geo.frontBreak,backBreak:geo.backBreak,BRASS,
  excavationReminder:excD<pccT+solT-EPS,
  profileReminder:true};
}
function measurementRows(d){
 if(!d||!Number.isFinite(d.wallArea)||!(d.L>0))throw Error('Calculate a valid wall section before exporting.');
 return [
  {item:'Excavation',basis:'Rectangular trench: footing width × excavation depth × length',
   width:d.pccW,depth:d.excD,crossSection:d.pccW*d.excD,length:d.L,unit:'m³',quantity:d.exc,
   note:'Working-space and actual excavation profile excluded'},
  {item:'Rubble soling',basis:'Footing width × soling thickness × length',
   width:d.pccW,depth:d.solT,crossSection:d.pccW*d.solT,length:d.L,unit:'m³',quantity:d.soling,
   note:'Under the footing; confirm actual dimensions'},
  {item:'PCC / footing',basis:'Footing width × footing thickness × length',
   width:d.pccW,depth:d.pccT,crossSection:d.pccW*d.pccT,length:d.L,unit:'m³',quantity:d.pcc,
   note:'Footing and wall concrete measured separately'},
  {item:'Wall concrete ('+d.grade+')',basis:'Integrated wall polygon area × length',
   width:null,depth:null,crossSection:d.wallArea,length:d.L,unit:'m³',quantity:d.concrete,
   note:'Existing profile only; not a stability or design check'},
  {item:'Filter / rubble backing',basis:'Rectangular filter thickness × wall height × length',
   width:d.filterT,depth:d.H,crossSection:d.filterT*d.H,length:d.L,unit:'m³',quantity:d.filter,
   note:'Real backing extent and drainage need drawing confirmation'},
  {item:'Weep-hole count (approx.)',basis:'Spacing grid: '+d.weepColumns+' columns × '+d.weepRows+' rows',
   width:null,depth:null,crossSection:null,length:null,unit:'nos.',quantity:d.weepApprox,
   note:'Indicative count only; no holes or pipe volume deducted'}
 ];
}
function safeCell(value){
 const s=String(value===null||value===undefined?'':value);
 // Excel treats =,+,-,@ and leading whitespace + formula prefixes as formulas.
 // Only untrusted text uses this protection. Numeric engineering quantities stay numbers.
 const guarded=/^[\s]*[=+\-@\t\r]/.test(s)?"'"+s:s;
 return '"'+guarded.replace(/"/g,'""')+'"';
}
function exportCSV(d,project=''){
 const rows=[
  ['PWD RETAINING WALL — GEOMETRIC MEASUREMENT SHEET (NOT GOVERNMENT BOQ)'],
  ['Work / project',project],
  ['Profile',d.strict?'Existing higher-wall piecewise profile':'Existing lower-wall profile'],
  ['Wall height (m)',d.H],['Length (m)',d.L],
  ['Top width (m)',d.TW],['Base width (m)',d.baseW],
  ['Footing width (m)',d.pccW],['Back projection (m)',d.backOff],
  ['Front projection (m)',d.frontOff],['Footing thickness (m)',d.pccT],
  ['Soling thickness (m)',d.solT],['Excavation depth (m)',d.excD],
  ['Filter thickness (m)',d.filterT],['Concrete grade',d.grade],
  [],['QUANTITY SHEET'],
  ['Item','Calculation basis','Cross-section / unit length (m²)','Length (m)','Unit','Quantity','Caution'],
  ...measurementRows(d).map(r=>[r.item,r.basis,r.crossSection,r.length,r.unit,r.quantity,r.note]),
  [],['FIELD WIDTH CONTROL — FIXED TOP CENTRELINE'],
  ['Height above PCC top (m)','Left/back from fixed top C/L (m)','Right/front from fixed top C/L (m)','Total wall width (m)','Station type'],
  ...d.controls.map(p=>[p.height,p.left,p.right,p.total,p.junction?'Batter change':'Setting-out']),
  [],['Source / limitation','Preliminary geometric calculation only. Verify the project-specific approved drawing, actual levels, excavation profile, drainage, stability and measurements.'],
  ['Status','Not an official tender abstract, certified structural design or government-approved quantity.']
 ];
 return '\uFEFF'+rows.map(row=>row.map(safeCell).join(',')).join('\r\n')+'\r\n';
}
root.PWDWallCore={BRASS,input,profileAt,section,constructionLevels,calculate,measurementRows,exportCSV};
})(typeof window!=='undefined'?window:globalThis);