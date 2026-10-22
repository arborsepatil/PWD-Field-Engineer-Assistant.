/** V25: search-first reference screens; filters accessible, source safety intact.
 * Exercises the actual client-side "Filters active" change listeners using DOM mocks.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
for(const [filename,primary,status,detailId,safetyText] of [
 ['morth_reader.html','sectionFilter','status','content','Only individually source-checked MoRTH clauses'],
 ['pwd_rule_book.html','chapter','status','reader','Current applicability warning:'],
 ['red_book_reader.html','partFilter','statusFilter','content','Current-use warning:']
]){
 const html=fs.readFileSync(path.join(root,filename),'utf8');
 const a=html.indexOf('<div class="toolbar">'),b=html.indexOf('</details></div>',a);
 assert.ok(a>=0&&b>a,filename+' search/filter toolbar missing');
 const toolbar=html.slice(a,b+16);
 assert.ok(toolbar.includes('id="search"'),'Search must be accessible directly');
 assert.ok(toolbar.indexOf('id="search"')<toolbar.indexOf('<details class="reader-filters"'),
  filename+' search must appear before optional filters');
 assert.match(toolbar,/<details class="reader-filters" id="readerFilters"><summary id="readerFilterSummary">Filters<\/summary>/);
 assert.ok(toolbar.includes('id="'+primary+'"')&&toolbar.includes('id="'+status+'"'),
  filename+' existing source filter controls must be preserved');
 assert.ok(toolbar.indexOf('id="'+primary+'"')<toolbar.indexOf('id="'+status+'"'),
  filename+' primary section/chapter/part filter must precede verification status');
 assert.ok(!toolbar.includes('<details class="reader-filters" open'),
  filename+' filter panel must start collapsed');
 assert.ok(html.includes('id="'+detailId+'"')&&html.includes(safetyText),
  filename+' critical reference details / engineering caution removed');
 assert.ok(html.includes('function pick(i)')&&html.includes('scrollIntoView'),
  filename+' V24 selected record navigation must be preserved');
 assert.match(html,/@media\(max-width:640px\)\{\.toolbar\{grid-template-columns:minmax\(0,1fr\)\}/,
  filename+' narrow phones must display search in one full-width row');
 const matches=[...html.matchAll(/<script>\s*\/\* V25: mark an altered filter clearly when its controls are collapsed\. \*\/[\s\S]*?<\/script>/g)];
 assert.equal(matches.length,1,filename+' missing one V25 filter change script');
 const js=matches[0][0].replace(/^<script>/,'').replace(/<\/script>$/,'');
 new vm.Script(js,{filename});
 const listeners={};
 const filters=[{value:'default',addEventListener(k,cb){listeners[0]=cb;}},{value:'default',addEventListener(k,cb){listeners[1]=cb;}}];
 const group={querySelectorAll(q){assert.equal(q,'select');return filters}};
 const summary={textContent:'uninitialized'};
 const document={getElementById(id){return id==='readerFilters'?group:id==='readerFilterSummary'?summary:null;}};
 vm.runInNewContext(js,{document},{filename});
 assert.equal(summary.textContent,'Filters',filename+' neutral label missing');
 filters[0].value='selected';listeners[0]();
 assert.equal(summary.textContent,'Filters active',filename+' modified primary filter not visible');
 filters[1].value='checked';listeners[1]();
 assert.equal(summary.textContent,'Filters active',filename+' status change must remain visible');
 filters[0].value='default';listeners[0]();
 assert.equal(summary.textContent,'Filters active',filename+' secondary filter still active');
 filters[1].value='default';listeners[1]();
 assert.equal(summary.textContent,'Filters',filename+' reset filter must clear active label');
}
const gr=fs.readFileSync(path.join(root,'gr_library.html'),'utf8');
assert.ok(gr.includes('id="grSearch"')&&gr.includes('id="currentGrid"')&&gr.includes('id="civilGrid"'),
 'GR primary search and classifications untouched');
console.log('V25 PASS: all three readers lead with search, keep 6 functional filters and source cautions, and disclose active filters correctly.');
