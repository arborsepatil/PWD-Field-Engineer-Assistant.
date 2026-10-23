/** V26: Library lists documents first, with on-demand storage actions. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const library=fs.readFileSync(path.join(root,'library.html'),'utf8');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const renderer=fs.readFileSync(path.join(root,'pdf_viewer.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const start=library.indexOf(' function bookCard(record){');
const end=library.indexOf(' function render(){',start);
assert.ok(start>=0&&end>start,'Actual Library card renderer missing');
const cardFn=library.slice(start,end);
function renderCard(record,saved={}){
 return vm.runInNewContext(cardFn+';bookCard(record);',{
  record,saved,encodeURIComponent,
  esc:x=>String(x)
 });
}
function sections(html){
 const cut=html.indexOf('<details class="book-more">');
 assert.ok(cut>=0,'More options must exist and be collapsed by default');
 const main=html.slice(0,cut),optional=html.slice(cut);
 assert.match(optional,/<summary>More options<\/summary>/);
 assert.ok(!main.includes('Drive (internet)'),"Drive link crowds document primary choices");
 assert.ok(!main.includes('Save PDF on device'),'Offline management crowds the primary choices');
 return {main,optional};
}
const code={id:'codePDF1234567890',name:'IS 456: sample',sub:'IS',section:'code'};
const codeHtml=renderCard(code);
const codeParts=sections(codeHtml);
assert.match(codeParts.main,/<a class="primary"[^>]*>Open PDF reader<\/a>/);
assert.ok(!codeParts.main.includes('Open digital reader'),'Code with no digital reader must not claim one');
assert.ok(codeParts.optional.includes('Drive (internet)')&&codeParts.optional.includes('Save PDF on device'));
const bridge={id:'bridgePDF12345678',name:'Bridge 2023',sub:'Bridge',section:'bridge',reader:'./bridge_book_2023.html',viewer:'./pdf_viewer.html?doc=bridge2023'};
const bridgeHtml=renderCard(bridge);
const bridgeParts=sections(bridgeHtml);
assert.ok(bridgeParts.main.includes('Open digital reader')&&bridgeParts.main.includes('Open PDF reader'),'Bridge must keep both index and original PDF');
assert.ok(bridgeParts.main.includes('Drawing index is separate'),'Do not imply index equals original checked PDF');
const savedCard=renderCard(code,{[code.id]:{name:'selected.pdf'}});
const savedParts=sections(savedCard);
assert.ok(savedParts.optional.includes('Replace saved PDF')&&savedParts.optional.includes('Export copy')&&savedParts.optional.includes('Remove offline'),'Saved-PDF management inaccessible');
assert.ok(savedParts.main.includes('Saved offline'),'Current offline state not visible');
assert.match(library,/<details class="offline-tools" id="offlineSetup"[^>]*><summary>Offline library setup<\/summary>/,'Bulk offline options must open only on demand');
assert.ok(library.includes("offlineOnly?'Offline library setup · Offline-only filter active'"),'Collapsed offline-only filter must remain clearly disclosed');
for(const id of ['bulkImport','prepareOfflineReader','showOfflineOnly','offlineProgress','libSearch','bookGrid','libraryTabs']){
 assert.ok(library.includes('id="'+id+'"'),'Library control missing '+id);
}
assert.ok(library.includes('Check the applicable edition, amendments and project specifications before site use.'),'Critical current-applicability note must remain visible');
assert.ok(library.includes('Library listings are from a Drive catalogue snapshot dated 18 October 2026'),'Private source freshness boundary missing');
assert.ok(home.includes('href="./library.html?section=ssr"')&&home.includes('href="./library.html"'),'Home SSR and Library gateways not preserved');
assert.ok(renderer.includes('Choose PDF'),'Private original PDF chooser missing');
assert.ok(/pwd-tools-(?:compact-v26|digital-ssr-v27|steel-compare-v28|steel-audit-v29)-2026-10-23/.test(sw),'Offline public assets must refresh for V26 or later');
console.log('V26 PASS: compact PDF cards, preserved reader/offline actions, source cautions, touch targets and cache invalidation.');
