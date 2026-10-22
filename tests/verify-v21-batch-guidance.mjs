/** V21 UX — on-demand help must work independently in both batch workflows.
 * This test executes the real embedded event handlers with a minimal
 * accessible DOM mock, rather than matching only HTML strings.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const html=fs.readFileSync(path.resolve(import.meta.dirname,'../pwd_mix_batch_assistant.html'),'utf8');
for(const id of ['batchInputHelp','batchAjaxHelp']){
 assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id+' should appear exactly once');
}
const qtyStart=html.indexOf('<section id="qty"'),ajaxStart=html.indexOf('<section id="ajax"'),nominalStart=html.indexOf('<section id="nominal"');
assert.ok(qtyStart>=0&&ajaxStart>qtyStart&&nominalStart>ajaxStart,'All three batching workflows remain separate');
assert.ok(html.indexOf('id="batchInputHelp"')>qtyStart&&html.indexOf('id="batchInputHelp"')<ajaxStart,'Material help must belong to order tab');
assert.ok(html.indexOf('id="batchAjaxHelp"')>ajaxStart&&html.indexOf('id="batchAjaxHelp"')<nominalStart,'AJAX help must be reachable on AJAX tab');
assert.match(html,/\.effect\{display:none\}/,'Explanatory field notes start collapsed');
assert.match(html,/body\.show-batch-input-guidance \.effect\{display:block\}/,'Explanatory notes remain optionally available');
for(const id of ['qCat','qItem','qQty','qUnit','qWC','aCat','aItem','aBasis','aWC','aVol','aBags','qOut','aOut']){
 assert.ok(html.includes('id="'+id+'"'),'Engineering input/output missing: '+id);
}
for(const label of ['Engineering checks & notes','EDITABLE ASSUMPTION','Approved job mix governs']){
 assert.ok(html.includes(label),'Safety or engineering context missing: '+label);
}
const start=html.indexOf('// Both material-order and AJAX workflows expose');
const stop=html.indexOf('</script>',start);
assert.ok(start>=0&&stop>start,'Context help controller missing');
const code=html.slice(start,stop);
new vm.Script(code,{filename:'batch-input-help-controller.js'});
const cssClasses=new Set();
const classList={
 contains:name=>cssClasses.has(name),
 toggle(name){if(cssClasses.has(name)){cssClasses.delete(name);return false;}cssClasses.add(name);return true;}
};
function button(){
 return {
  textContent:'',attributes:{},click:null,
  setAttribute(k,v){this.attributes[k]=v;},
  addEventListener(name,callback){assert.equal(name,'click');this.click=callback;}
 };
}
const material=button(),ajax=button();
const doc={body:{classList},querySelectorAll(q){assert.equal(q,'.batch-help-toggle');return [material,ajax]}};
vm.runInNewContext(code,{document:doc},{filename:'batch-help-controller.js'});
assert.equal(material.textContent,'Show input guidance');
assert.equal(ajax.textContent,'Show input guidance');
assert.equal(material.attributes['aria-pressed'],'false');
assert.equal(ajax.attributes['aria-pressed'],'false');
assert.equal(typeof material.click,'function');
assert.equal(typeof ajax.click,'function');
ajax.click();
assert.equal(cssClasses.has('show-batch-input-guidance'),true,'AJAX button must show field notes');
for(const b of [material,ajax]){
 assert.equal(b.textContent,'Hide input guidance','Both controls must synchronize');
 assert.equal(b.attributes['aria-pressed'],'true');
}
material.click();
assert.equal(cssClasses.has('show-batch-input-guidance'),false,'Order button must hide help opened via AJAX');
for(const b of [material,ajax]){
 assert.equal(b.textContent,'Show input guidance');
 assert.equal(b.attributes['aria-pressed'],'false');
}
material.click();ajax.click();
assert.equal(cssClasses.has('show-batch-input-guidance'),false,'Rapid switching must not desynchronize controls');
console.log('V21 UX PASS: AJAX/Material input help accessible per tab, real events synchronized, core source and safety fields intact.');
