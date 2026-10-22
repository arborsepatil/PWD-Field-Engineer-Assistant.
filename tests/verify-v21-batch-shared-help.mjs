/** V21: Batch Assistant help remains available in all three workflows.
 * Real toggle handler is executed against a small DOM adapter; calculations
 * and the three engineering workflows remain unchanged.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const html=fs.readFileSync(path.join(root,'pwd_mix_batch_assistant.html'),'utf8');
const ids=['qty','ajax','nominal'];
const nav=html.indexOf('aria-label="Batch Assistant workflows"');
const help=html.indexOf('id="batchInputHelp"');
const firstPanel=html.indexOf('<section id="qty"');
assert.ok(nav>=0&&help>nav&&firstPanel>help,'The one help button must be OUTSIDE all three panels');
assert.equal((html.match(/id="batchInputHelp"/g)||[]).length,1,'Avoid duplicate help controls');
for(const id of ids){
 assert.ok(html.includes('data-tab="'+id+'"'),'Tabbed workflow is not reachable: '+id);
 assert.ok(html.includes('id="'+id+'" class="panel'),'Workflow content missing: '+id);
 assert.ok(html.includes('aria-controls="qty ajax nominal"'),'Help should describe all workflows');
}
assert.ok(html.includes('.effect{display:none}'),'Help text is minimized by default');
assert.ok(html.includes('body.show-batch-input-guidance .effect{display:block}'),'Detailed guidance remains reversible');
assert.ok(html.includes('id="qCat"')&&html.includes('id="aBasis"'),'Actual material and AJAX controls preserved');
const begin=html.lastIndexOf('const batchInputHelp=document.getElementById(');
assert.ok(begin>0,'Shared guidance listener missing');
const end=html.indexOf('</script>',begin);
const js=html.slice(begin,end);
new vm.Script(js);
let active=false;
const events={};
const button={textContent:'Show input guidance',attrs:{'aria-pressed':'false'},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){events[k]=fn;}};
const fakeDoc={getElementById(id){return id==='batchInputHelp'?button:null;},body:{classList:{toggle(k){assert.equal(k,'show-batch-input-guidance');active=!active;return active;}}}};
vm.runInNewContext(js,{document:fakeDoc},{filename:'batch-v21-help'});
assert.equal(typeof events.click,'function','Help button must be live, not decorative');
events.click();
assert.equal(active,true,'Guidance shown');
assert.equal(button.textContent,'Hide input guidance');
assert.equal(button.attrs['aria-pressed'],'true');
events.click();
assert.equal(active,false,'Guidance collapsed again');
assert.equal(button.textContent,'Show input guidance');
assert.equal(button.attrs['aria-pressed'],'false');
console.log('V21 Batch UX PASS: help accessible above all three tabs, actual handler reversible, source controls and workflows retained.');
