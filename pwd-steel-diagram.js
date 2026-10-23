/* PWD Field Assistant · engineering steel section diagrams · V30
 * Shows sourced outside D/B and, where available, web/flange/wall thickness
 * at a COMMON linear scale. Rounded/tapered as-rolled contours are NOT
 * geometrically certified by this schematic. No unverified dimensions inferred.
 * The model and SVG use no network, fonts, or external assets.
 */
(function(root){
'use strict';
const fmt=n=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:3}).format(n);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const num=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x))&&Number(x)>0?Number(x):null;
const f=x=>Math.round(x*1000)/1000;
function model(type,datum={}){
 const t=String(type||'').toLowerCase();
 const kind=t==='hollow'?(datum.series==='CHS'?'chs':datum.series==='SHS'?'shs':'rhs'):
  t==='hollow-chs'?'chs':t==='hollow-shs'?'shs':t==='hollow-rhs'?'rhs':
  ['beam','column','pile'].includes(t)?'i':t==='channel'?'channel':t==='angle'?'angle':
  t==='round'?'round':t==='square'?'square':t==='plate'||t==='flat'?'flat':'unknown';
 const d=num(kind==='chs'||kind==='round'?datum.diameterMm??datum.depthMm:
  kind==='square'||kind==='shs'?datum.sideMm??datum.depthMm:
  kind==='rhs'?datum.depthMm??datum.heightMm:datum.depthMm);
 const b=num(kind==='chs'||kind==='round'?datum.diameterMm??datum.depthMm:
  kind==='square'||kind==='shs'?datum.sideMm??datum.widthMm??datum.depthMm:
  kind==='rhs'?datum.widthMm:
  kind==='flat'?datum.widthMm:datum.widthMm);
 const thick=num(kind==='i'||kind==='channel'?datum.webMm:datum.thicknessMm);
 const flange=num(datum.flangeMm);
 const ratioOK=d!==null&&b!==null;
 // Do not clamp B/D: doing so corrupts the comparison of external dimensions.
 const scale=ratioOK?Math.min(166/d,194/b):null;
 const width=ratioOK?f(b*scale):158,height=ratioOK?f(d*scale):166;
 const geometryWarnings=[];
 if(!ratioOK)geometryWarnings.push('Outside dimensions unavailable: section outline is schematic.');
 const x=250-width/2,y=161-height/2;
 let webScaled=null,flangeScaled=null,wallScaled=null;
 const canWeb=(kind==='i'||kind==='channel')&&thick!==null&&b!==null&&thick<b;
 const canFlange=(kind==='i'||kind==='channel')&&flange!==null&&d!==null&&flange*2<d;
 if(canWeb)webScaled=f(thick*scale);
 if(canFlange)flangeScaled=f(flange*scale);
 if((kind==='i'||kind==='channel')&&(!canWeb||!canFlange))
  geometryWarnings.push('Web or flange source dimension absent/conflicting; internal thickness shown schematically.');
 const hollow=['rhs','shs','chs'].includes(kind);
 const canWall=hollow&&thick!==null&&d!==null&&b!==null&&thick*2<Math.min(d,b);
 if(canWall)wallScaled=f(thick*scale);
 else if(hollow)geometryWarnings.push('Wall thickness unavailable/conflicting; internal opening shown schematically.');
 if(kind==='angle'&&!(thick!==null&&thick<Math.min(d??0,b??0)))
  geometryWarnings.push('Leg thickness unavailable/conflicting; internal thickness shown schematically.');
 if(kind==='i'||kind==='channel'||kind==='angle')
  geometryWarnings.push('Root/toe fillets and rolling profiles not reproduced.');
 if(t==='pile')geometryWarnings.push('Pile member outline is a generic I-shaped envelope: specialised pile edges/bulbs are not reproduced.');
 if(kind==='i'||kind==='channel'){
  if(num(datum.flangeSlopeDeg)!==null&&Math.abs(datum.flangeSlopeDeg-90)>0.0001)
   geometryWarnings.push('Sloped flange face not reproduced; simple envelope only.');
 }
 if(kind==='rhs'||kind==='shs')geometryWarnings.push('Hollow-section corner radii not reproduced.');
 const outerDrawn=ratioOK;
 return Object.freeze({kind,d,b,thick,flange,ratioOK,outerDrawn,scale,width,height,x,y,
  webScaled,flangeScaled,wallScaled,sourceWeb:canWeb,sourceFlange:canFlange,sourceWall:canWall,
  warnings:Object.freeze(geometryWarnings)});
}
function svg(type,data={}){
 const m=model(type,data);
 const {kind,x,y,width:w,height:h}=m;
 const x1=f(x),x2=f(x+w),y1=f(y),y2=f(y+h),xc=250,yc=161;
 const N=v=>String(f(v));
 const has=m.ratioOK;
 const dx=has?m.b:null,dy=has?m.d:null;
 const Dcap=kind==='chs'||kind==='round'?'OD':'D';
 const mark=(a,b,c,d)=>'<path class="dim" d="M'+N(a)+' '+N(b)+'L'+N(c)+' '+N(d)+'"/>';
 const labels=[];
 if(has){
  labels.push(mark(x1,55,x2,55),mark(x1,49,x1,62),mark(x2,49,x2,62),
   mark(x1,y1-5,x1,62),mark(x2,y1-5,x2,62));
  labels.push('<text class="ink" x="250" y="41" text-anchor="middle">'+
   esc(kind==='chs'||kind==='round'?'OD '+fmt(dx)+' mm':'B '+fmt(dx)+' mm')+'</text>');
  if(kind!=='chs'&&kind!=='round'){
   labels.push(mark(102,y1,102,y2),mark(96,y1,108,y1),mark(96,y2,108,y2),
    mark(110,y1,x1-5,y1),mark(110,y2,x1-5,y2));
   labels.push('<text class="ink" x="87" y="161" transform="rotate(-90 87 161)" text-anchor="middle">D '+esc(fmt(dy))+' mm</text>');
  }
 }
 let body='',precision='External dimensions not verified';
 const wv=m.sourceWeb?m.webScaled:w*.12;
 const tv=m.sourceFlange?m.flangeScaled:h*.1;
 const leg=m.thick!==null&&m.ratioOK&&m.thick<Math.min(m.b,m.d)?f(m.thick*m.scale):Math.min(w,h)*.14;
 if(kind==='i'){
  // Sourced thickness must never be visually clamped to a preferred size.
  const web=m.sourceWeb?wv:w*.12,flange=m.sourceFlange?tv:h*.10;
  const L=f(xc-web/2),R=f(xc+web/2);
  body='<path d="M'+N(x1)+' '+N(y1)+'H'+N(x2)+'V'+N(y1+flange)+'H'+N(R)+'V'+N(y2-flange)+'H'+N(x2)+'V'+N(y2)+'H'+N(x1)+'V'+N(y2-flange)+'H'+N(L)+'V'+N(y1+flange)+'H'+N(x1)+'Z"/>';
 }else if(kind==='channel'){
  const web=m.sourceWeb?wv:w*.12,flange=m.sourceFlange?tv:h*.10;
  body='<path d="M'+N(x1)+' '+N(y1)+'H'+N(x2)+'V'+N(y1+flange)+'H'+N(x1+web)+'V'+N(y2-flange)+'H'+N(x2)+'V'+N(y2)+'H'+N(x1)+'Z"/>';
 }else if(kind==='angle'){
  const l=m.thick!==null&&m.ratioOK&&m.thick<Math.min(m.d,m.b)?leg:Math.min(w,h)*.14;
  body='<path d="M'+N(x1)+' '+N(y1)+'H'+N(x1+l)+'V'+N(y2-l)+'H'+N(x2)+'V'+N(y2)+'H'+N(x1)+'Z"/>';
 }else if(kind==='shs'||kind==='rhs'){
  const wall=m.sourceWall?m.wallScaled:Math.min(w,h)*.12;
  const tt=m.sourceWall?wall:Math.min(w,h)*.12;
  body='<rect x="'+N(x1)+'" y="'+N(y1)+'" width="'+N(w)+'" height="'+N(h)+'"/>'+
   '<rect class="cutout" x="'+N(x1+tt)+'" y="'+N(y1+tt)+'" width="'+N(w-2*tt)+'" height="'+N(h-2*tt)+'"/>';
 }else if(kind==='chs'||kind==='round'){
  const radius=Math.min(w,h)/2;
  body='<circle cx="250" cy="161" r="'+N(radius)+'"/>';
  if(kind==='chs'){
   const wall=m.sourceWall?m.wallScaled:radius*.2;
   body+='<circle class="cutout" cx="250" cy="161" r="'+N(Math.max(0.0001,radius-wall))+'"/>';
  }
 }else if(kind==='square'){
  body='<rect x="'+N(x1)+'" y="'+N(y1)+'" width="'+N(w)+'" height="'+N(h)+'"/>';
 }else if(kind==='flat'){
  body='<rect x="'+N(x1)+'" y="'+N(y1)+'" width="'+N(w)+'" height="'+N(Math.max(8,h))+'"/>';
 }else {
  body='<rect x="185" y="109" width="130" height="104"/>';
 }
 if(has)precision='Sourced outside envelope; simplified cross-section';
 const legend=[];
 if(m.sourceWeb)legend.push('web t = '+fmt(m.thick)+' mm');
 if(m.sourceFlange)legend.push('flange T = '+fmt(m.flange)+' mm');
 if(m.sourceWall)legend.push('wall t = '+fmt(m.thick)+' mm');
 if(kind==='angle'&&m.thick!==null)legend.push('leg t = '+fmt(m.thick)+' mm');
 if(m.warnings.length&&legend.length===0)legend.push('Thickness or profile geometry not fully sourced');
 const described=legend.join(' · ');
 const name=esc(data.designation||type.toUpperCase());
 const note=esc(m.warnings.length?'Diagram limitation: '+m.warnings.join(' '):'Source-proportional section schematic.');
 return '<svg viewBox="0 0 500 345" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+
  esc((data.designation||type)+' cross-section; '+precision+'; not a fabrication drawing')+'">'+
  '<rect width="500" height="345" class="bg"/>'+
  '<title>'+name+' — '+esc(precision)+'</title>'+
  '<desc>'+note+'</desc>'+
  '<text x="250" y="22" class="ink" text-anchor="middle" font-size="16" font-weight="700">'+name+'</text>'+
  '<g class="shape" stroke-width="1.6" stroke-linejoin="round">'+body+'</g>'+
  '<g fill="none" stroke="var(--figureInk)" stroke-width="1.1">'+labels.filter(x=>x.startsWith('<path')).join('')+'</g>'+
  '<g font-size="12.3">'+labels.filter(x=>x.startsWith('<text')).join('')+'</g>'+
  '<text x="250" y="280" class="ink" text-anchor="middle" font-size="12.5">'+esc(described)+'</text>'+
  '<text x="250" y="303" class="muted" text-anchor="middle" font-size="12">'+esc(precision)+'</text>'+
  '<text x="250" y="330" class="muted" text-anchor="middle" font-size="11">Illustrative profile · not a fabrication drawing</text></svg>';
}
const api=Object.freeze({model,svg});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelDiagram=api;
})(typeof window!=='undefined'?window:globalThis);
