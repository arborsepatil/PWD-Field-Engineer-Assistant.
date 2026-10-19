/* Retaining-wall section QUANTITIES — deterministic geometry, not structural design.
 * Source-template dimensions are carried forward unchanged from the existing app.
 * Site conditions, wall safety, hydraulic/drainage and approved drawings must be reviewed.
 * No new structural/code claims are made.
 */
(function(root){
'use strict';
const BRASS=2.8316846592;
const TEMPLATE=Object.freeze({
 lowerLimit:2.5, maxHeight:10, fixedTopWidth:.60,
 backVerticalDepth:2.5, backBatter:1/6, frontBatter:1/4,
 frontToeHeightFraction:1/5, frontToeBatter:1,
 footingThickness:.30, backProjection:.30,frontProjectionLow:.30,
 frontProjectionHigh:.40, higherProjectionAbove:5,
 fixedGrade:'M15'
});
function numeric(value,label,{min=0,allowZero=false,max=Infinity}={}){
 if(value===null||value===undefined||String(value).trim()==='')throw Error(label+' is required.');
 const n=Number(value);
 if(!Number.isFinite(n)||n<min||(!allowZero&&n===0)||n>max)
  throw Error(label+' must be '+(allowZero?'at least ':'greater than ')+min+(Number.isFinite(max)?' and at most '+max:'')+'.');
 return n;
}
function uniqueSorted(values){
 const sorted=values.sort((a,b)=>a-b);
 return sorted.filter((x,i)=>i===0||Math.abs(x-sorted[i-1])>1e-9);
}
function profile(height,topWidth,depth){
 const H=numeric(height,'Wall height',{min:.5,max:TEMPLATE.maxHeight});
 const TW=numeric(topWidth,'Top width');
 const d=numeric(depth,'Depth below top',{min:0,allowZero:true,max:H});
 const strict=H>TEMPLATE.lowerLimit;
 const back=TW/2+(strict?Math.max(0,d-TEMPLATE.backVerticalDepth)*TEMPLATE.backBatter:0);
 const front=TW/2+(strict?
   Math.min(d,H*(1-TEMPLATE.frontToeHeightFraction))*TEMPLATE.frontBatter+
   Math.max(0,d-H*(1-TEMPLATE.frontToeHeightFraction))*TEMPLATE.frontToeBatter:
   d*TEMPLATE.frontBatter);
 return {depth:d,back,front,total:back+front};
}
function sectionGeometry(height,topWidth){
 const H=numeric(height,'Wall height',{min:.5,max:TEMPLATE.maxHeight});
 const strict=H>TEMPLATE.lowerLimit;
 const TW=strict?TEMPLATE.fixedTopWidth:numeric(topWidth,'Top width');
 // Two independent kinks: for H close to 2.5, toe slope begins BEFORE
 // the back batter. Sorting rather than presuming 2.5 < 0.8H fixes it.
 const breakpoints=strict?
   uniqueSorted([0,H,TEMPLATE.backVerticalDepth,H*(1-TEMPLATE.frontToeHeightFraction)]):
   [0,H];
 const sections=[];
 let area=0;
 for(let i=0;i<breakpoints.length-1;i++){
  const from=profile(H,TW,breakpoints[i]);
  const to=profile(H,TW,breakpoints[i+1]);
  const height=to.depth-from.depth;
  const segmentArea=(from.total+to.total)*height/2;
  if(!(height>0)||!Number.isFinite(segmentArea))throw Error('Wall section geometry is invalid.');
  area+=segmentArea;
  sections.push({from:from.depth,to:to.depth,height,upperWidth:from.total,lowerWidth:to.total,area:segmentArea});
 }
 const top=profile(H,TW,0),bottom=profile(H,TW,H);
 const points=[
  {x:-top.back,d:0},{x:top.front,d:0},
  ...breakpoints.slice(1).map(d=>({x:profile(H,TW,d).front,d})),
  ...breakpoints.slice().reverse().map(d=>({x:-profile(H,TW,d).back,d}))
 ];
 return {height:H,topWidth:TW,strict,breakpoints,sections,sectionArea:area,
  baseWidth:bottom.total,top,bottom,points};
}
function calculate(input){
 const H=numeric(input.H,'Wall height',{min:.5,max:TEMPLATE.maxHeight});
 const L=numeric(input.L,'Wall length');
 const excavationDepth=numeric(input.excD,'Excavation depth');
 const strict=H>TEMPLATE.lowerLimit;
 const TW=strict?TEMPLATE.fixedTopWidth:numeric(input.lowTW,'Top width');
 const wall=sectionGeometry(H,TW);
 const backOff=strict?TEMPLATE.backProjection:numeric(input.lowBack,'Back PCC projection',{allowZero:true});
 const frontOff=strict?(H<=TEMPLATE.higherProjectionAbove?TEMPLATE.frontProjectionLow:TEMPLATE.frontProjectionHigh):
   numeric(input.lowFront,'Front PCC projection',{allowZero:true});
 const pccT=strict?TEMPLATE.footingThickness:numeric(input.lowPccT,'PCC thickness');
 const solT=strict?numeric(input.strictSolT,'Rubble soling thickness',{min:.15,max:.30}):
   numeric(input.lowSolT,'Rubble soling thickness',{min:.05,max:.30});
 const grade=strict?TEMPLATE.fixedGrade:input.lowGrade;
 if(!['M10','M15','M20','M25'].includes(grade))throw Error('Choose a supported lower-wall concrete grade.');
 const filterT=numeric(input.filterT,'Filter / rubble filling thickness',{allowZero:true});
 const weepH=numeric(input.weepH,'Weep-hole horizontal spacing');
 const weepV=numeric(input.weepV,'Weep-hole vertical spacing');
 const step=numeric(input.controlStep??1,'Field control interval',{min:.1,max:5});
 const pccW=wall.baseWidth+backOff+frontOff;
 const concrete=wall.sectionArea*L,pcc=pccW*pccT*L,
  soling=pccW*solT*L,exc=pccW*excavationDepth*L,
  filter=L*filterT*H;
 // Counts are a rough interior grid estimate; actual location and quantities
 // cannot be determined from the spacing alone.
 const weepRows=Math.ceil(H/weepV),weepColumns=Math.ceil(L/weepH),
  weepApprox=weepRows*weepColumns;
 const controls=[];
 const intervalCount=Math.floor(H/step);
 for(let i=0;i<=intervalCount;i++)controls.push(i*step);
 const depths=uniqueSorted([...controls,...wall.breakpoints,H]);
 const fieldWidths=depths.map(depth=>profile(H,TW,depth));
 return {...wall,H,L,TW,excD:excavationDepth,filterT,weepH,weepV,
  weepRows,weepColumns,weepApprox,
  pccW,pccT,solT,grade,backOff,frontOff,
  wallArea:wall.sectionArea,concrete,pcc,soling,exc,filter,
  fieldWidths,controlStep:step};
}
root.PWDRetainingWallCore={BRASS,TEMPLATE,numeric,profile,sectionGeometry,calculate};
})(typeof window!=='undefined'?window:globalThis);