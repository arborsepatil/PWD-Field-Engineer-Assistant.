/* MoRTH private QC planning draft: output and presentation guards.
 * No engineering acceptance or certification is inferred from this test.
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
assert.throws(()=>core.makeCsv({},[]),/at least one QC reference/i);
const sample={id:'9003-wmm-density',section:'Table 900-3',work:'WMM',test:'Density',frequency:'1 set of 3 tests / 1,000 m²'};
const malicious={...sample,id:'=SUM(1,2)',work:'  +CMD',test:'"Cell"\nNext'};
const csv=core.makeCsv({project:'=1+1',site:'@external',date:'2026-10-27',contractor:'"Test" Ltd'},[sample,malicious]);
assert.ok(csv.charCodeAt(0)===0xFEFF,'Missing UTF-8 spreadsheet BOM');
assert.match(csv,/DRAFT ONLY - NOT TESTED OR APPROVED/);
assert.match(csv,/1 set of 3 tests \/ 1,000 m²/);
assert.match(csv,/"'=1\+1"/,'Unsafe spreadsheet formula in project field');
assert.match(csv,/"'@external"/,'Unsafe spreadsheet formula in site field');
assert.match(csv,/"'=SUM\(1,2\)"/,'Unsafe spreadsheet formula in reference field');
assert.match(csv,/"  '\+CMD"|"'  \+CMD"/,'Unsafe leading whitespace formula in work field');
assert.match(csv,/"\x22\x22Test\x22\x22 Ltd"/,'CSV quote escaping missing');
assert.match(csv,/Sample \/ test ID \(field entry\)/);
assert.ok(!/ENGINEER_APPROVED|ACCEPTED RESULT|AUTOMATIC PASS/.test(csv),'Draft misrepresented as accepted');

for(const id of ['qcPlanProject','qcPlanSite','qcPlanDate','qcPlanContractor','qcPlanPreview','qcPlanCsv','qcPlanPrint','qcPlanPrintView','qcPlanMessage'])
 assert.ok(html.includes('id="'+id+'"'),'Missing planner control '+id);
for(const script of ['morth-qc-plan-core.js','morth-qc-plan.js']){
 assert.ok(html.includes('src="./'+script+'"'),'QC screen does not load '+script);
 assert.ok(sw.includes("'./"+script+"'"),'Offline PWA does not precache '+script);
 assert.ok(android.includes('"'+script+'"'),'Private Android package does not require '+script);
}
assert.ok(html.includes('body.qc-print-mode main>:not(#qcPlanPrintView)'),'Print layout must omit reference pages and warnings outside the draft sheet');
for(const phrase of ['DRAFT ONLY','No automatic test-count or acceptance decision','Review the current contract','not a complete QC plan']){
 assert.ok(html.includes(phrase)||uiText.includes(phrase),'Planner safety language missing: '+phrase);
}
assert.ok(!/localStorage|sessionStorage|XMLHttpRequest|fetch\(|sendBeacon/.test(uiText+coreText),'Planner must not store or upload private project entries');

const events={};
function domNode(tag){
 return {tag,children:[],hidden:false,textContent:'',
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
let latestBlob=null;
function BlobStub(chunks,opts){latestBlob={content:chunks.join(''),type:opts.type}}
let printed=false;
const fakeUrl={createObjectURL(){return 'blob:local-test'},revokeObjectURL(){}};
const win={CivilBandhuQCPlanCore:core,
  addEventListener(name,fn){events[name]=fn},
  setTimeout(fn){fn()},
  print(){printed=true}
};
vm.runInNewContext(uiText,{window:win,document,Blob:BlobStub,URL:fakeUrl});
nodes.qcPlanProject.value='Sample bridge roadwork';
nodes.qcPlanPreview.onclick();
assert.ok(!nodes.qcPlanPrintView.hidden,'Planning preview should appear');
const previewTable=nodes.qcPlanPrintView.children.find(n=>n.tag==='table');
assert.ok(previewTable,'Preview table missing');
assert.equal(previewTable.children[1].children.length,1,'Filtered-out reference included in draft');
assert.match(nodes.qcPlanMessage.textContent,/1 matching QC references/);
nodes.qcPlanCsv.onclick();
assert.ok(latestBlob&&latestBlob.content.includes('Sample bridge roadwork'),'CSV export did not use local project field');
assert.ok(!latestBlob.content.includes('9004-dbm-binder'),'Filtered-out QC item leaked into export');
nodes.qcPlanPrint.onclick();
assert.ok(printed&&active.has('qc-print-mode'),'Printable draft was not enabled');
events.afterprint();
assert.ok(!active.has('qc-print-mode'),'Print-mode class was not removed');
included.hidden=true;
nodes.qcPlanPreview.onclick();
assert.ok(nodes.qcPlanPrintView.hidden,'Empty search should hide stale worksheet');
assert.match(nodes.qcPlanMessage.textContent,/No matching QC entries/);
console.log('MoRTH QC draft PASS: CSV formula safety, offline/private asset gates, filtered print/CSV, empty results, no storage or auto approval.');
