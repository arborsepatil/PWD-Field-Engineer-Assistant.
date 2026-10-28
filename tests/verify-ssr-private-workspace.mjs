import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const require=createRequire(import.meta.url);
const core=require('../ssr-private-core.js');
const payload={schema:core.SCHEMA,edition:'2022-23',tasks:{
  '2':[{id:'N1',title:'Synthetic note',source:'Synthetic fixture: page 1'}],
  '3':[{id:'A1',category:'Material',description:'Synthetic annexure',rate:10,source:'Synthetic fixture'}],
  '4':[
   {id:'L1',material_group:'Aggregate',loading_method:'machine',lead_km:0,rate:10,unit:'cum',source:'Synthetic fixture',rate_basis:'base'},
   {id:'L2',material_group:'Aggregate',loading_method:'machine',lead_km:10,rate:50,unit:'cum',source:'Synthetic fixture',rate_basis:'base'}],
  '5':[{id:'C1',material:'Cement',coefficient:4.5,unit:'kg',source:'Synthetic fixture',mapping_status:'UNAPPROVED'}],
  '6':{frequencies:[{id:'Q1',test:'Sample test',unit:'cum',frequency_qty:10,kind:'test',auto_eligible:true,allocation_eligible:true,source:'Synthetic fixture'}],charges:[{id:'TC1',test:'Sample test',rate:20,unit:'set',source:'Synthetic fixture'}]}
 }};
assert.equal(core.validate(payload).ok,true);
assert.equal(core.query(payload.tasks['2'],'synthetic').length,1);
assert.equal(core.query(payload.tasks['5'],'cement').length,1);
const lead=core.interpolate(payload.tasks['4'],'Aggregate','machine',5);
assert.equal(lead.ok,true);assert.equal(lead.rate,30);
assert.equal(lead.from.lead_km,0);assert.equal(lead.to.lead_km,10);
assert.equal(core.interpolate(payload.tasks['4'],'Aggregate','machine',11).ok,false);
assert.equal(core.interpolate(payload.tasks['4'],'Aggregate','manual',5).ok,false);
const counts=core.qcPlan(payload.tasks['6'].frequencies[0],42);
assert.deepEqual([counts.required,counts.lab,counts.field],[5,2,3]);
assert.equal(core.qcPlan({...payload.tasks['6'].frequencies[0],kind:'checkpoint'},42).ok,false);
assert.equal(core.qcPlan({...payload.tasks['6'].frequencies[0],special_rule:true},42).ok,false);
assert.equal(core.qcPlan({...payload.tasks['6'].frequencies[0],auto_eligible:false},42).ok,false);
assert.equal(core.qcPlan(payload.tasks['6'].frequencies[0],-1).ok,false);
assert.equal(core.validate({...payload,edition:'2025-26'}).ok,false);
assert.equal(core.validate({...payload,tasks:{...payload.tasks,'4':[{...payload.tasks['4'][0],source:''}]}}).ok,false);
console.log('Private SSR workspace synthetic regression PASS: schema, search, lead bounds, QC 30/70, engineering review gates.');


const noSplit=core.qcPlan({...payload.tasks['6'].frequencies[0],allocation_eligible:false},42);
assert.equal(noSplit.ok,true);
assert.deepEqual([noSplit.required,noSplit.lab,noSplit.field,noSplit.allocationEligible],[5,null,null,false]);
assert.equal(core.qcPlan({...payload.tasks['6'].frequencies[0],frequency_qty:0},42).ok,false);
const qcBad={...payload,tasks:{...payload.tasks,'6':{...payload.tasks['6'],frequencies:[{...payload.tasks['6'].frequencies[0],frequency_qty:0}]}}};
assert.equal(core.validate(qcBad).ok,false);
assert.equal(core.interpolate([{...payload.tasks['4'][0],rate_basis:''},{...payload.tasks['4'][1],rate_basis:''}],'Aggregate','machine',5).ok,false);

const privateHTML=readFileSync('ssr_private_workspace.html','utf8');
const inlineScripts=[privateHTML.split('<script>')[1]?.split('</script>')[0]].filter(Boolean);
assert.ok(inlineScripts.length>0,'No inline SSR workspace behavior found');
for(const [i,code] of inlineScripts.entries())new Script(code,{filename:'ssr_private_workspace_inline_'+i+'.js'});
for(const marker of ['leadQty','function calculateLead()','Source-verified SSR test-frequency records have not been imported','qcCalc']) assert.ok(privateHTML.includes(marker),'SSR UI missing '+marker);
console.log('Owner-private SSR workspace inline JavaScript syntax and missing-frequency UX PASS.');
