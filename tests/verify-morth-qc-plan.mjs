/* MoRTH private owner QC register: manual selections and observations regression.
 * No engineering acceptance, laboratory certification, or project rule verification.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html=fs.readFileSync('qc.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const android=fs.readFileSync('android/scripts/prepare_assets.py','utf8');
const coreText=fs.readFileSync('morth-qc-plan-core.js','utf8');
const uiText=fs.readFileSync('morth-qc-plan.js','utf8');
const ctx=vm.createContext({});
new vm.Script(coreText,{filename:'morth-qc-plan-core.js'}).runInContext(ctx);
new vm.Script(uiText,{filename:'morth-qc-plan.js'});
const core=ctx.CivilBandhuQCPlanCore;
assert.ok(core&&typeof core.makeCsv==='function','Pure QC planning CSV library absent');
assert.throws(()=>core.makeCsv({},[]),/at least one matching QC reference/i);

const sample={id:'9003-wmm-density',section:'Table 900-3',work:'WMM',test:'Density',frequency:'1 set of 3 tests / 1,000 m²'};
const malicious={...sample,id:'=SUM(1,2)',work:'  +CMD',test:'"Cell"\nNext',observed:'-3.2',review:'=HYPERLINK("example","click")'};
const csv=core.makeCsv({project:'=1+1',site:'@external',date:'2026-10-27',contractor:'"Test" Ltd'},[sample,malicious]);
assert.ok(csv.charCodeAt(0)===0xFEFF,'Missing UTF-8 spreadsheet BOM');
assert.match(csv,/DRAFT ONLY - NOT TESTED OR APPROVED/);
assert.match(csv,/1 set of 3 tests \/ 1,000 m²/);
assert.match(csv,/"'=1\+1"/,'Unsafe spreadsheet formula in project field');
assert.match(csv,/"'@external"/,'Unsafe spreadsheet formula in site field');
assert.match(csv,/"'=SUM\(1,2\)"/,'Unsafe spreadsheet formula in reference field');
assert.match(csv,/"'  \+CMD"/,'Unsafe leading whitespace formula in work field');
assert.match(csv,/"'-3\.2"/,'Unsafe observation starting with spreadsheet operator');
assert.match(csv,/"'=HYPERLINK/,'Unsafe engineer remarks formula');
assert.match(csv,/"\x22\x22Test\x22\x22 Ltd"/,'CSV quote escaping missing');
assert.match(csv,/Sample \/ test ID \(field entry\)/);
assert.match(csv,/Observed result \(field entry\)/);
assert.ok(!/ENGINEER_APPROVED|ACCEPTED RESULT|AUTOMATIC PASS/.test(csv),'Draft misrepresented as accepted');

for(const id of ['qcPlanProject','qcPlanSite','qcPlanDate','qcPlanContractor','qcPlanPreview','qcPlanCsv','qcPlanPrint','qcPlanPrintView','qcPlanMessage'])
 assert.ok(html.includes('id="'+id+'"'),'Missing planner control '+id);
for(const script of ['morth-qc-plan-core.js','morth-qc-plan.js']){
 assert.ok(html.includes('src="./'+script+'"'),'QC screen does not load '+script);
 assert.ok(sw.includes("'./"+script+"'"),'Offline PWA does not precache '+script);
 assert.ok(android.includes('"'+script+'"'),'Private Android package does not require '+script);
}
for(const text of [
 'body.qc-print-mode main>:not(#qcPlanPrintView)',
 'body.qc-print-mode .qc-plan-table tr[data-selected="false"]',
 'body.qc-print-mode .qc-plan-print-value',
 'input[type="checkbox"]'
])assert.ok(html.includes(text),'Planner mobile/print control missing: '+text);
for(const phrase of ['Draft only.','No test count','not a complete QC plan','No lab result is checked']){
 assert.ok(html.includes(phrase)||uiText.includes(phrase),'Planner caution missing: '+phrase);
}
assert.ok(!/localStorage|sessionStorage|XMLHttpRequest|fetch\(|sendBeacon/.test(uiText+coreText),'Planner must not store or upload private project entries');

const events={};
function domNode(tag){
 return {tag,children:[],hidden:false,textContent:'',attrs:{},
   setAttribute(k,v){this.attrs[k]=v},
   appendChild(child){this.children.push(child);return child},
   replaceChildren(...children){this.children=children},
   addEventListener(name,handler){this['on'+name]=handler},
   click(){this.didClick=true},remove(){this.didRemove=true}
 };
}
const nodes=Object.create(null);
for(const id of ['qcPlanProject','qcPlanSite','qcPlanDate','qcPlanContractor','qcPlanPreview','qcPlanCsv','qcPlanPrint','qcPlanPrintView','qcPlanMessage']){
 nodes[id]=domNode(id);nodes[id].value='';
}
const panel={querySelector(sel){assert.equal(sel,'summary');return {textContent:'Granular, WBM and WMM'}}};
function record(id,label,hidden){
 return {hidden,querySelectorAll(sel){
   assert.equal(sel,'td');
   return ['WMM',label,'1 test / 1,000 m²'].map(textContent=>({textContent}));
 },closest(sel){assert.equal(sel,'details.qc-card');return panel},
 getAttribute(name){assert.equal(name,'data-qc-id');return id}};
}
const included=record('9003-wmm-density','Field density',false);
const excluded=record('9004-dbm-binder','Binder content',true);
const body=domNode('body');
const active=new Set();
body.classList={add(name){active.add(name)},remove(name){active.delete(name)}};
const document={
 getElementById(id){return nodes[id]||null},
 querySelectorAll(sel){assert.equal(sel,'#roadQC2013 tr[data-qc-id]');return [included,excluded]},
 createElement:domNode,body
};
let latestBlob=null,downloadCount=0;
function BlobStub(chunks,opts){latestBlob={content:chunks.join(''),type:opts.type}}
let printed=false;
const fakeUrl={createObjectURL(){downloadCount++;return 'blob:local-test'},revokeObjectURL(){}};
const win={CivilBandhuQCPlanCore:core,
  addEventListener(name,fn){events[name]=fn},
  setTimeout(fn){fn()},
  print(){printed=true}
};
vm.runInNewContext(uiText,{window:win,document,Blob:BlobStub,URL:fakeUrl});
nodes.qcPlanProject.value='Sample bridge roadwork';
nodes.qcPlanPreview.onclick();
assert.ok(!nodes.qcPlanPrintView.hidden,'QC draft preview should appear');
let table=nodes.qcPlanPrintView.children.find(n=>n.tag==='table');
assert.ok(table,'Preview table missing');
assert.equal(table.children[1].children.length,1,'Filtered-out reference included in draft');
let row=table.children[1].children[0];
assert.equal(row.children.length,7,'Manual QC register must have 7 columns');
const include=row.children[0].children[0];
const sampleId=row.children[4].children[0];
const observation=row.children[5].children[0];
const review=row.children[6].children[0];
assert.equal(include.checked,true,'Matching QC entries should be selected initially');
sampleId.value='TEST-2026-007';sampleId.oninput();
observation.value='Result: 2.1 g/cc (manual)';observation.oninput();
review.value='Awaiting verification';review.oninput();
nodes.qcPlanCsv.onclick();
assert.ok(latestBlob&&latestBlob.content.includes('Sample bridge roadwork'),'CSV omitted local project field');
assert.ok(latestBlob.content.includes('TEST-2026-007'),'CSV omitted manually entered test ID');
assert.ok(latestBlob.content.includes('2.1 g/cc'),'CSV omitted observed result');
assert.ok(latestBlob.content.includes('Awaiting verification'),'CSV omitted engineer remarks');
assert.ok(!latestBlob.content.includes('9004-dbm-binder'),'Filtered-out QC item leaked into export');
assert.equal(downloadCount,1,'Expected one user-initiated CSV export');

table=nodes.qcPlanPrintView.children.find(n=>n.tag==='table');
row=table.children[1].children[0];
assert.equal(row.children[4].children[0].value,'TEST-2026-007','Typed test ID did not survive preview refresh');
assert.equal(row.children[5].children[1].textContent,'Result: 2.1 g/cc (manual)','Print copy did not mirror typed result');
const checkAgain=row.children[0].children[0];
checkAgain.checked=false;checkAgain.onchange();
assert.equal(row.attrs['data-selected'],'false','Unchecked row not marked for omission during print');
assert.match(nodes.qcPlanMessage.textContent,/0 of 1/);
nodes.qcPlanCsv.onclick();
assert.equal(downloadCount,1,'Unchecked QC entries must never export');
assert.match(nodes.qcPlanMessage.textContent,/Select at least one/);
nodes.qcPlanPrint.onclick();
assert.equal(printed,false,'Unselected QC rows must never trigger print');

nodes.qcPlanPreview.onclick();
table=nodes.qcPlanPrintView.children.find(n=>n.tag==='table');
row=table.children[1].children[0];
assert.equal(row.children[0].children[0].checked,false,'Unchecked state was not preserved in session');
const selectAgain=row.children[0].children[0];
selectAgain.checked=true;selectAgain.onchange();
nodes.qcPlanPrint.onclick();
assert.ok(printed&&active.has('qc-print-mode'),'Checked draft not printable');
events.afterprint();
assert.ok(!active.has('qc-print-mode'),'Print mode class was not cleared');
included.hidden=true;
nodes.qcPlanPreview.onclick();
assert.ok(nodes.qcPlanPrintView.hidden,'Empty search should hide stale worksheet');
assert.match(nodes.qcPlanMessage.textContent,/No matching QC entries/);
console.log('MoRTH manual QC register PASS: safe CSV, selected-only export/print, manual observations, draft-only status, offline asset controls.');
