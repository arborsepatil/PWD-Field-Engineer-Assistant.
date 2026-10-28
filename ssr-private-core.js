/* Civil Bandhu SSR Master: public code, private user-supplied JSON only.
 * NO SSR rate/consumption/QC source records are embedded in this file.
 */
(function(root,factory){
  const api=factory(); if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.CivilSSRPrivate=api;
})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const SCHEMA='civilbandhu.ssr.private.v1', TASKS=['2','3','4','5','6'];
function clean(s){return String(s??'').trim()}
function number(v){if(v===''||v===null||v===undefined)return NaN;const n=Number(v);return Number.isFinite(n)?n:NaN}
function finiteNonnegative(v){return Number.isFinite(number(v))&&number(v)>=0}
function validate(payload){
 const errors=[];
 if(!payload||typeof payload!=='object'||Array.isArray(payload))return {ok:false,errors:['JSON root must be an object']};
 if(payload.schema!==SCHEMA)errors.push('Unsupported private package schema');
 if(payload.edition!=='2022-23')errors.push('Edition must be 2022-23');
 if(!payload.tasks||typeof payload.tasks!=='object')errors.push('Missing tasks object');
 const t=payload.tasks||{};
 for(const id of TASKS){
  if(!Object.hasOwn(t,id)){errors.push('Missing task '+id);continue}
  if(id==='6'){
    if(!t[id]||!Array.isArray(t[id].frequencies)||!Array.isArray(t[id].charges)){errors.push('Task 6 requires frequencies and charges arrays');continue}
    for(const k of ['frequencies','charges'])if(t[id][k].length>20000)errors.push('Task 6 '+k+' exceeds row cap');
    for(const x of t[id].frequencies){
     if(!x||!clean(x.test)||!clean(x.source)||!clean(x.unit))errors.push('QC frequency missing test/source/unit');
     if(x&&x.auto_eligible===true&&(!finiteNonnegative(x.frequency_qty)||number(x.frequency_qty)===0||x.kind!=='test'||x.special_rule===true))errors.push('QC automatic rule has missing/unsafe quantity basis');
   }
    for(const x of t[id].charges)if(!x||!clean(x.test)||!clean(x.source)||!finiteNonnegative(x.rate))errors.push('QC charge missing valid test/source/rate');
  } else {
    if(!Array.isArray(t[id])){errors.push('Task '+id+' must be an array');continue}
    if(t[id].length>20000)errors.push('Task '+id+' exceeds row cap');
    for(const x of t[id])if(!x||typeof x!=='object'||!clean(x.source))errors.push('Task '+id+' contains a row without source');
  }
 }
 if(Array.isArray(t['4']))for(const x of t['4']){
   if(!clean(x.material_group)||!clean(x.loading_method)||!clean(x.unit)||!finiteNonnegative(x.lead_km)||!finiteNonnegative(x.rate))errors.push('Lead row missing material/method/unit or numeric distance/rate');
   if(number(x.lead_km)>1000000||number(x.rate)>1000000000)errors.push('Lead row exceeds safe numeric limit');
 }
 if(Array.isArray(t['5']))for(const x of t['5']){
   if(!clean(x.material)||!clean(x.unit)||!Number.isFinite(number(x.coefficient)))errors.push('Consumption coefficient row incomplete');
 }
 return {ok:errors.length===0,errors:[...new Set(errors)],counts:count(t)};
}
function count(t){return {'2':Array.isArray(t['2'])?t['2'].length:0,'3':Array.isArray(t['3'])?t['3'].length:0,'4':Array.isArray(t['4'])?t['4'].length:0,'5':Array.isArray(t['5'])?t['5'].length:0,'6-frequencies':Array.isArray(t['6']?.frequencies)?t['6'].frequencies.length:0,'6-charges':Array.isArray(t['6']?.charges)?t['6'].charges.length:0}}
function query(rows,q){
 const parts=clean(q).toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return rows.filter(r=>parts.every(part=>Object.entries(r).filter(([k,v])=>!['rate','coefficient','lead_km','frequency_qty'].includes(k)&&typeof v!=='object').some(([,v])=>clean(v).toLocaleLowerCase().includes(part))));
}
function interpolate(rows,material,method,distance){
 const km=number(distance);if(!(km>=0))return {ok:false,error:'Enter a valid nonnegative lead distance in km'};
 const filtered=rows.filter(x=>clean(x.material_group)===clean(material)&&clean(x.loading_method)===clean(method)).sort((a,b)=>Number(a.lead_km)-Number(b.lead_km));
 if(!filtered.length)return {ok:false,error:'No source-backed rate series for this material and loading method'};
 const units=new Set(filtered.map(x=>clean(x.unit)));if(units.size!==1)return {ok:false,error:'Inconsistent source rate units; manual review required'};
 const at=filtered.find(x=>Number(x.lead_km)===km);
 if(at)return {ok:true,rate:number(at.rate),unit:at.unit,from:at,to:at,interpolated:false};
 const lower=[...filtered].reverse().find(x=>Number(x.lead_km)<km),upper=filtered.find(x=>Number(x.lead_km)>km);
 if(!lower||!upper)return {ok:false,error:'Outside verified lead slabs. No extrapolation allowed'};
 if(!clean(lower.rate_basis)||!clean(upper.rate_basis)||clean(lower.rate_basis)!==clean(upper.rate_basis))return {ok:false,error:'Missing or inconsistent source rate basis: do not interpolate'};
 if(filtered.some((x,i)=>i>0&&number(x.lead_km)===number(filtered[i-1].lead_km)))return {ok:false,error:'Ambiguous duplicate lead distance; verify source schedule'};
 const r0=number(lower.rate),r1=number(upper.rate),d0=number(lower.lead_km),d1=number(upper.lead_km);
 if(!(d1>d0))return {ok:false,error:'Invalid source lead slab sequence'};
 return {ok:true,rate:r0+(r1-r0)*(km-d0)/(d1-d0),unit:lower.unit,from:lower,to:upper,interpolated:true};
}
function qcPlan(record,quantity){
 if(!record)return {ok:false,error:'Select an SSR frequency row'};
 if(record.kind!=='test'||record.auto_eligible!==true||record.special_rule===true)return {ok:false,error:'Manual engineering review: not an eligible automatic test-frequency rule'};
 const q=number(quantity),per=number(record.frequency_qty);
 if(!(q>=0)||!(per>0))return {ok:false,error:'Quantity and verified quantity-per-test must be valid'};
 const minimum=record.minimum_tests===undefined?0:number(record.minimum_tests);
 if(!Number.isSafeInteger(minimum)||minimum<0)return {ok:false,error:'Unverified minimum test count'};
 const required=Math.max(Math.ceil(q/per),minimum);
 if(!Number.isSafeInteger(required)||required>1000000)return {ok:false,error:'Calculated count outside safe range'};
 // For a source-specific test, do NOT split field-only and laboratory-only methods.
 // A 30/70 allocation is permitted only when an approved test-classification
 // record explicitly says that BOTH field and laboratory allocation are valid.
 const alloc=record.allocation_eligible===true;
 const lab=alloc?Math.ceil(required*0.30):null;
 return {ok:true,required,lab,field:alloc?required-lab:null,allocationEligible:alloc,unit:record.unit,source:record.source,warning:alloc?'30/70 is a user-selected project workflow, not a universal SSR mandate. Contract and test methods require approval. No shortfall recovery or assumed tariff.':'SSR source quantity-based count only. 30/70 field/lab split is NOT applied to this test. Confirm test method, source, quantity basis and current contract.'};
}
return {SCHEMA,validate,count,query,interpolate,qcPlan};
});