/** V24: mobile reference reader's selected entry is visible after a tap.
 * Execute the actual HTML pick() handler with mobile/desktop DOM stubs.
 * Presentation-only: all source/audit/engineering calculations remain intact.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
for(const [filename,renderName,target] of [
 ['morth_reader.html','renderTree','content'],
 ['red_book_reader.html','list','content'],
 ['pwd_rule_book.html','renderList','reader']
]){
 const html=fs.readFileSync(path.join(root,filename),'utf8');
 const m=html.match(/function pick\(i\)\{[^\n]*\}/);
 assert.ok(m,filename+': missing record selection action');
 assert.ok(html.includes('id="'+target+'"'),filename+': detail target missing');
 assert.ok(html.includes('@media(max-width:900px){.toolbar{position:static}#'+target+'{scroll-margin-top:74px}}'),
  filename+': mobile toolbar can obscure the revealed record');
 for(const mobile of [true,false]){
  const calls=[];
  const context={
   selected:-1,
   [renderName](){calls.push(['render']);},
   window:{matchMedia(query){assert.equal(query,'(max-width:900px)');return {matches:mobile};}},
   $:id=>{
    assert.equal(id,target,filename+': must navigate to the correct detail section');
    return {scrollIntoView(options){calls.push(['scroll',options.behavior,options.block]);}};
   }
  };
  const fn=vm.runInNewContext('('+m[0]+')',context,{filename});
  fn(3);
  assert.equal(context.selected,3,filename+': selected record must update');
  assert.equal(calls[0][0],'render',filename+': result must render before scroll');
  const serialized=JSON.parse(JSON.stringify(calls));
  if(mobile){
   assert.deepEqual(serialized,[['render'],['scroll','smooth','start']],
    filename+': tapping a mobile index item must reveal rendered detail');
  }else assert.deepEqual(serialized,[['render']],
   filename+': normal desktop selection must not auto-scroll');
 }
 assert.match(html,/<(?:section|article)\b[^>]*\bclass="(?:viewer|reader|content)/,
  filename+': core reader content must remain available');
}
console.log('V24 PASS: three readers reveal selected content on mobile, not desktop; source views and filters remain.');
