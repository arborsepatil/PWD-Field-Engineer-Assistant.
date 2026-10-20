/* 2023 PWD retaining wall schematic: draws EXACT A-I dimensions from selected GAD table.
 * Source: 151-1/4 GAD, PDF 209; specific A-I sizes: PDF 210–212.
 * Illustration only, NOT a verified construction/stability/approval drawing.
 * B=F+E+D; A=C+H; raft top rises from edge thickness H to G at stem;
 * I is the stem top width. PCC M15 levelling course 100 mm is in the GAD.
 * The screenshot/scan itself remains private: SVG is drawn dynamically.
 */
(function(root){
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function geometry(record){
 if(!record||!record.dimensionsMm)throw Error('A verified RCC type-plan record is required.');
 const d=record.dimensionsMm;
 for(const k of 'ABCDEFGHI')if(!Number.isFinite(d[k])||d[k]<=0)throw Error('Missing positive dimension '+k);
 if(d.A!==record.heightM*1000)throw Error('GAD A must match selected table height.');
 if(d.B!==d.F+d.E+d.D)throw Error('Printed footing segments do not add to B.');
 if(d.A-d.C!==d.H)throw Error('A/C/H vertical height relationship cannot be drawn.');
 if(d.E<d.I||d.G<d.H)throw Error('Stem/raft geometry does not match the source profile.');
 const xHeel=d.F,xToe=d.F+d.E;
 return Object.freeze({A:d.A,B:d.B,C:d.C,D:d.D,E:d.E,F:d.F,G:d.G,H:d.H,I:d.I,xHeel,xToe,xStemTop:xToe-d.I,pccThicknessMm:100});
}
function svg(record){
 const d=geometry(record);
 const scale=Math.min(560/d.B,440/d.A),x0=180,base=620;
 const x=mm=>+(x0+mm*scale).toFixed(2),y=mm=>+(base-mm*scale).toFixed(2);
 const poly=points=>points.map(([a,b])=>x(a)+','+y(b)).join(' ');
 const blue='#2361bd',dark='#263b52';
 const line=(a,b,c,e,color=blue,width=1.5)=>'<line x1="'+a+'" y1="'+b+'" x2="'+c+'" y2="'+e+'" stroke="'+color+'" stroke-width="'+width+'"/>';
 const text=(a,b,t,size=14,color=dark,anchor='middle',weight=600)=>'<text x="'+a+'" y="'+b+'" font-family="system-ui,Arial" text-anchor="'+anchor+'" font-size="'+size+'" font-weight="'+weight+'" fill="'+color+'">'+esc(t)+'</text>';
 const tick=(a,b)=>line(a-5,b-5,a+5,b+5);
 const hdim=(from,to,pos,t)=>{
   if(to-from<8)return'';
   return line(from,pos,to,pos)+tick(from,pos)+tick(to,pos)+text((from+to)/2,pos-11,t,13,blue);
 };
 const vdim=(pos,from,to,t)=>{
   return line(pos,from,pos,to)+line(pos-5,from,pos+5,from)+line(pos-5,to,pos+5,to)+
    text(pos-8,(from+to)/2+4,t,13,blue,'end');
 };
 let out='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 780" role="img" aria-label="RCC retaining wall dynamic dimensioned schematic with road-side heel, property-side toe, A-I drawing dimensions, sloped raft and stem">';
 out+='<rect width="1060" height="780" fill="#fff"/>';
 out+=text(530,34,'RCC RETAINING WALL · DIMENSIONED SCHEMATIC',19);
 out+=text(530,56,'PWD 2023 GAD 151-1/4 · SBC '+record.sbc+' t/m² · A = '+(d.A/1000).toFixed(1)+' m',13,'#52637c');
 // Ground course is an M15 lean concrete layer shown below the raft in the GAD.
 out+='<rect x="'+x(0)+'" y="'+y(0)+'" width="'+(x(d.B)-x(0))+'" height="'+Math.max(5,100*scale)+'" fill="#eee0ba" stroke="#876f43" stroke-width="1.3"/>';
 out+=text(x(d.B/2),y(0)+26,'100 mm M15 PCC under raft (from GAD)',12,'#876f43');
 // Single contiguous RCC section: tapered heel/toe slab and tapered earth face of stem.
 const pts=[[0,0],[0,d.H],[d.F,d.G],[d.xStemTop,d.A],[d.xToe,d.A],[d.xToe,d.G],[d.B,d.H],[d.B,0]];
 out+='<polygon points="'+poly(pts)+'" fill="#d8e9f6" stroke="'+dark+'" stroke-width="2.6" stroke-linejoin="round"/>';
 out+=line(x(d.F),y(d.G),x(d.xToe),y(d.G),'#839db2',1);
 out+=text(x((d.F)/2),y(d.H)+35,'HEEL / ROAD SIDE',14,'#164b83');
 out+=text(x(d.xToe+d.D/2),y(d.H)+35,'TOE / PROPERTY SIDE',14,'#164b83');
 out+=text(x(d.xToe-12),y(d.A)+24,'STEM',12,dark,'end');
 out+=hdim(x(0),x(d.F),base+48,'F = '+d.F);
 out+=hdim(x(d.F),x(d.xToe),base+48,'E = '+d.E);
 out+=hdim(x(d.xToe),x(d.B),base+48,'D = '+d.D);
 out+=hdim(x(0),x(d.B),base+89,'B = '+d.B+' mm');
 // Vertical A measured to bottom of footing; C to raft outside top edge.
 out+=vdim(x(0)-48,y(d.A),base,'A = '+d.A);
 out+=vdim(x(d.B)+107,y(d.A),y(d.H),'C = '+d.C);
 // Top-of-stem and raft depth size call-outs (true source values, not approximations).
 out+=hdim(x(d.xStemTop),x(d.xToe),y(d.A)-25,'I = '+d.I);
 out+=line(x(d.xToe),y(d.G),x(d.B)+18,y(d.G));
 out+=text(x(d.B)+24,y(d.G)-7,'G = '+d.G+' mm',13,blue,'start');
 out+=line(x(d.B),y(d.H),x(d.B)+18,y(d.H));
 out+=text(x(d.B)+24,y(d.H)-9,'H = '+d.H+' mm',13,blue,'start');
 // Terrain guides are purely orientation, never footing embedment guidance.
 out+=text(530,755,'All drawing dimensions in millimetres · Schematic only · Check original PDF before use',13,'#52637c');
 out+='</svg>';
 return out;
}
const api=Object.freeze({geometry,svg});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDRCC2023Section=api;
})(typeof window!=='undefined'?window:globalThis);
