/* Diagram 1: dimensioned existing wall section. Diagram 2: construction setting-out.
 * Both use verified PWDWallCore profile and its ONE fixed top-midpoint centreline.
 * Geometry only; neither drawing is an approved structural design.
 */
(function(root){
'use strict';
const DARK='#263b52',BLUE='#1768bd',MUTED='#65768a',J='#9a690e';
const fmt=(n,dp=3)=>Number(n).toFixed(dp);
const ln=(x1,y1,x2,y2,color=MUTED,w=1,dash='')=>
 '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="'+w+'"'+
 (dash?' stroke-dasharray="'+dash+'"':'')+'/>';
const txt=(x,y,t,size=12,anchor='middle',color=DARK,weight=600)=>
 '<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" font-family="system-ui,sans-serif" font-size="'+size+
 '" font-weight="'+weight+'" fill="'+color+'">'+t+'</text>';
const dot=(x,y)=>'<circle cx="'+x+'" cy="'+y+'" r="4" fill="'+J+'" stroke="#fff" stroke-width="1.4"/>';
const face=(d,depth)=>root.PWDWallCore.profileAt(d.H,d.TW,depth);
function polygon(d,x,y){
 const fronts=d.strict?[0,d.frontBreak,d.H]:[0,d.H];
 const backs=d.strict?[d.H,d.backBreak,0]:[d.H,0];
 const pts=[[-d.TW/2,0],...fronts.map(v=>[face(d,v).front,v]),
           ...backs.map(v=>[-face(d,v).back,v])];
 return '<polygon points="'+pts.map(p=>x(p[0])+','+y(p[1])).join(' ')+
 '" fill="#dcebf8" stroke="'+DARK+'" stroke-width="2.2" stroke-linejoin="round"/>';
}
function footing(d,x,base,scale){
 const bottom=face(d,d.H),l=x(-bottom.back-d.backOff),r=x(bottom.front+d.frontOff);
 const mid=base+d.pccT*scale,low=mid+d.solT*scale;
 return {l,r,mid,low,svg:
 '<rect x="'+l+'" y="'+base+'" width="'+(r-l)+'" height="'+(d.pccT*scale)+'" fill="#eee2bb" stroke="#766242" stroke-width="1.4"/>'+
 '<rect x="'+l+'" y="'+mid+'" width="'+(r-l)+'" height="'+(d.solT*scale)+'" fill="#dbd4c8" stroke="#736b60" stroke-width="1.4"/>'};
}
function widthDimension(x1,x2,y,label){
 return ln(x1,y,x2,y,BLUE,1.25)+ln(x1,y-6,x1,y+6,BLUE,1.25)+
 ln(x2,y-6,x2,y+6,BLUE,1.25)+txt((x1+x2)/2,y-9,label,12,'middle',BLUE,700);
}
function heightDimension(x,y1,y2,label){
 return ln(x,y1,x,y2,BLUE,1.25)+ln(x-6,y1,x+6,y1,BLUE)+
 ln(x-6,y2,x+6,y2,BLUE)+txt(x+11,(y1+y2)/2+4,label,12,'start',BLUE,700);
}
// Offset only label positions—not their corresponding geometrical construction lines.
function stagger(rows,minY,maxY,gap=29){
 if(!rows.length)return[];
 const res=rows.map(r=>({...r,labelY:r.y}));
 for(let i=1;i<res.length;i++)res[i].labelY=Math.max(res[i].labelY,res[i-1].labelY+gap);
 if(res[res.length-1].labelY>maxY){
  res[res.length-1].labelY=maxY;
  for(let i=res.length-2;i>=0;i--)res[i].labelY=Math.min(res[i].labelY,res[i+1].labelY-gap);
 }
 if(res[0].labelY<minY){
  res[0].labelY=minY;
  for(let i=1;i<res.length;i++)res[i].labelY=Math.max(res[i].labelY,res[i-1].labelY+gap);
 }
 return res;
}
function renderDimension(d){
 const cx=433,base=446,scale=Math.min(350/d.H,320/d.pccW,85/(d.pccT+d.solT));
 const x=v=>cx+v*scale,y=dep=>base-(d.H-dep)*scale;
 const top=y(0),foot=footing(d,x,base,scale),upper=face(d,0),lower=face(d,d.H);
 let out='<rect width="960" height="616" fill="#fff"/>';
 out+=txt(480,27,'DIAGRAM 1 · DIMENSIONED WALL SECTION',17,'middle',DARK,800);
 out+=txt(480,47,'Measurements in metres · Existing profile · Not an approved design',11,'middle',MUTED);
 out+=foot.svg+polygon(d,x,y);
 out+=ln(cx,Math.max(60,top-32),cx,foot.low+14,BLUE,1.5,'7 6');
 out+=txt(cx+9,Math.max(70,top-39),'FIXED TOP C/L',11,'start',BLUE,750);
 out+=widthDimension(x(-upper.back),x(upper.front),top-14,'TW '+fmt(d.TW,2));
 out+=widthDimension(x(-lower.back),x(lower.front),base-13,'BW '+fmt(d.baseW,3));
 out+=widthDimension(foot.l,foot.r,foot.low+20,'PCC W = Soling W = '+fmt(d.pccW,3));
 out+=heightDimension(78,top,base,'Wall H '+fmt(d.H,3));
 out+=heightDimension(746,base,foot.mid,'PCC t '+fmt(d.pccT,3));
 out+=heightDimension(746,foot.mid,foot.low,'Soling t '+fmt(d.solT,3));
 out+=txt(287,base+4,'0.00 = PCC top',11,'end',MUTED,700);
 if(d.strict){
  const events=d.junctions.map(j=>{
   const depth=d.H-j.height,f=face(d,depth);
   return {...j,y:y(depth),px:x(j.side==='left'?-f.back:f.front)};
  }).sort((a,b)=>a.y-b.y);
  for(const event of stagger(events,123,403,33)){
   out+=dot(event.px,event.y)+ln(event.px,event.y,660,event.labelY,J,1.1);
   out+=txt(671,event.labelY-3,event.side==='left'?'LEFT/BACK BATTER':'RIGHT/FRONT BATTER',11,'start',J,800);
   out+=txt(671,event.labelY+12,'changes @ '+fmt(event.height,3)+' m above PCC',11,'start',DARK,650);
  }
 }
 out+=txt(480,581,d.strict?'Batter changes individually identified on their own faces':'Lower wall (H ≤ 2.50 m): no higher-profile junctions',12,'middle',MUTED);
 out+=txt(480,601,'Left = back face in this schematic · Right = front face · Confirm site orientation',11,'middle',MUTED);
 return out;
}
function renderSettingOut(d){
 const cx=520,base=556,scale=Math.min(448/d.H,315/d.pccW);
 const x=v=>cx+v*scale,yHeight=h=>base-h*scale,yDepth=dep=>yHeight(d.H-dep);
 let out='<rect width="1040" height="660" fill="#fff"/>';
 out+=txt(520,26,'DIAGRAM 2 · BOTTOM-UP FIELD SETTING-OUT',18,'middle',DARK,800);
 out+=txt(520,47,'0.00 = TOP OF PCC · Offsets from fixed top-width centreline',12,'middle',MUTED);
 out+=txt(95,75,'HEIGHT ↑ (m)',12,'start',DARK,750);
 out+=txt(345,75,'LEFT / BACK',12,'middle',BLUE,750);
 out+=txt(835,75,'RIGHT / FRONT',12,'middle',BLUE,750);
 out+=polygon(d,x,yDepth);
 out+=ln(cx,Math.max(76,yHeight(d.H)-16),cx,base+18,BLUE,1.5,'7 6');
 out+=txt(cx+10,Math.max(91,yHeight(d.H)-23),'C/L = TW ÷ 2',12,'start',BLUE,750);
 const ordered=stagger(d.controls.map(z=>({...z,y:yHeight(z.height)}))
   .sort((a,b)=>a.y-b.y),103,565,28);
 for(const station of ordered){
  const actual=station.y,shown=station.labelY;
  const xl=x(-station.left),xr=x(station.right);
  const color=station.junction?J:'#9bb4cb';
  out+=ln(xl-6,actual,xr+6,actual,color,station.junction?1.7:.9,station.junction?'3 3':'4 5');
  out+=ln(xl,actual,cx,actual,BLUE,1.3)+ln(cx,actual,xr,actual,BLUE,1.3);
  out+=ln(xl,actual-5,xl,actual+5,BLUE,1)+ln(xr,actual-5,xr,actual+5,BLUE,1);
  if(station.junction)out+=dot(station.junctionSides.includes('left')?xl:xr,actual);
  out+=ln(365,shown,xl-6,actual,color,1)+ln(xr+6,actual,800,shown,color,1);
  out+=txt(95,shown+4,fmt(station.height,3),13,'start',station.junction?J:DARK,station.junction?800:600);
  out+=txt(345,shown+4,fmt(station.left,3),13,'middle',BLUE,750);
  out+=txt(835,shown+4,fmt(station.right,3),13,'middle',BLUE,750);
  if(station.junction)out+=txt(1004,shown+4,station.junctionSides.map(s=>s==='left'?'L':'R').join('+')+' Δ',11,'end',J,800);
 }
 out+=txt(520,604,'Left + Right = total wall width at that height. Offsets are NOT half the local width.',12,'middle',DARK,700);
 out+=txt(520,626,'Each batter-change junction interrupts and restarts the next 1.00 m construction lift.',11,'middle',MUTED);
 out+=txt(520,649,'Setting-out aid only · verify the approved wall section and left/back orientation',11,'middle',MUTED);
 return out;
}
root.PWDWallDiagrams={renderDimension,renderSettingOut,stagger};
})(typeof window!=='undefined'?window:globalThis);