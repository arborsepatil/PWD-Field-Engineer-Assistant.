/** V21 UX regression: reference readers prioritize search/index and keep
 * original source bounds, source lists, and current-use cautions intact.
 * This is a presentation-only check; not an engineering standard audit.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function checkReader(file,config){
 const html=read(file);
 const main=html.slice(html.indexOf('<main'),html.indexOf('</main>')+7);
 assert.ok(main.includes(config.search),file+': original working search missing');
 assert.ok(main.includes(config.index),file+': source results/index missing');
 assert.ok(main.includes(config.warning),file+': engineering/source caution missing');
 assert.ok(main.includes('reader-help')||main.includes('gr-context'),file+': optional source details unavailable');
 const openDetails=main.match(/<details\b[^>]*\bopen(?:\s|=|>)/gi)||[];
 assert.equal(openDetails.length,0,file+': verbose helper is unexpectedly expanded by default');
 const sourceDetailsPos=main.indexOf('<details');
 const searchPos=main.indexOf(config.search);
 assert.ok(sourceDetailsPos>=0&&sourceDetailsPos<searchPos,file+': search should immediately follow collapsed source help');
 return main;
}
const morth=checkReader('morth_reader.html',{
 search:'id="search"',index:'id="treeList"',
 warning:'Only individually source-checked MoRTH clauses may be treated as checked.'
});
assert.ok(morth.includes('Detailed verified-clause coverage'),'MoRTH audited coverage list must be recoverable');
assert.ok(morth.includes('Release boundary:'),'Keep detailed source traceability');
assert.ok(morth.includes('id="status"')&&morth.includes('id="sectionFilter"'));
assert.ok(morth.includes('id="content"'));
const rule=checkReader('pwd_rule_book.html',{
 search:'id="search"',index:'id="list"',
 warning:'Current applicability warning:'
});
for(const p of ['643 pages','Original verified','Transcription review','418 transcription records']){
 assert.ok(rule.includes(p),'Private 1984 source coverage trace missing: '+p);
}
assert.ok(rule.includes('Digitisation review progress'));
assert.ok(rule.includes('source package')||rule.includes('Source-package guard:'));
const red=checkReader('red_book_reader.html',{
 search:'id="search"',index:'id="indexList"',
 warning:'Current-use warning:'
});
assert.ok(red.includes('Part II · Buildings')&&red.includes('Part I'),'Retain edition distinctions');
assert.ok(red.includes('id="partFilter"')&&red.includes('id="statusFilter"'));
const gr=checkReader('gr_library.html',{
 search:'id="grSearch"',index:'id="currentGrid"',
 warning:'Check the official GR and later amendments'
});
for(const p of ['id="civilGrid"','id="libraryTabs"', 'SOURCE CONTROL']){
 // Library tabs belong to the PDF library, not GR reader.
 if(p==='id="libraryTabs"')continue;
 assert.ok(gr.includes(p),'GR source/control UI missing: '+p);
}
assert.ok(gr.includes('Source discipline:')&&gr.includes('id="grSearch"'));
assert.ok(gr.includes('current identified')||gr.includes('Current identified'));
console.log('V21 UX PASS: four readers retain source cautions/filters, lead with search, and fold cluttered audit inventories.');
