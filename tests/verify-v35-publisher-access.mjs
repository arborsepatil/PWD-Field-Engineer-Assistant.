/* V35 — independent publisher accessibility and privacy regression.
 * Online checks recorded 2026-10-23. This test does NOT claim PDF licenses.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const src=read('library-public-catalog.js'),ui=read('library.html');
const ctx={window:{}};vm.runInNewContext(src,ctx,{filename:'library-public-catalog.js'});
const rows=Array.from(ctx.window.PWDPublicBookCatalogue);
assert.equal(rows.length,15,'Existing official-reference inventory must not silently change');
const confirmed=rows.filter(x=>x.access==='public-page'),unconfirmed=rows.filter(x=>x.access==='publisher-access-unconfirmed');
assert.equal(confirmed.length,12);
assert.equal(unconfirmed.length,3);
for(const row of unconfirmed){
 assert.ok(row.publisher==='Central Public Works Department'||row.publisher==='Indian Roads Congress');
 assert.ok(row.kind==='book'||row.kind==='index'||row.kind==='catalogue');
}
assert.equal(unconfirmed.filter(x=>x.publisher==='Central Public Works Department').length,2);
assert.equal(unconfirmed.filter(x=>x.publisher==='Indian Roads Congress').length,1);
for(const row of confirmed){
 assert.ok(row.url.startsWith('https://')&&row.publisher!=='Central Public Works Department'&&row.publisher!=='Indian Roads Congress');
 assert.ok(row.title&&row.section);
}
for(const row of rows){
 assert.equal(Object.hasOwn(row,'id'),false,'Private Drive IDs forbidden in official publisher catalogue');
 assert.equal(Object.hasOwn(row,'file'),false);
 assert.ok(row.note.length>20);
}
assert.ok(ui.includes("'Check publisher availability ↗'"),'Unconfirmed publisher links must not claim free reading');
assert.ok(ui.includes("'View on publisher ↗'"),'Confirmed publisher pages should retain their view action');
assert.ok(ui.includes('id="accessSummary"'), 'Show status counts near the category listing');
assert.ok(ui.includes("item.access==='public-page'"),'Do not assume every official URL is publicly viewable');
assert.ok(ui.includes('publisher pages checked'), 'Accessibility status must be visible in UI');
assert.ok(ui.includes("No private Drive files or PDF downloads in this app."),'Distribution limits explicit');
assert.ok(!ui.includes('id="bulkImport"')&&!ui.includes('id="prepareOfflineReader"'),'No private PDF import/viewer in shared Library');
const pack=read('android/scripts/prepare_assets.py');
for(const retired of ['library-drive-catalog.js','library-offline.js','pdf_viewer.html',
 'bridge_book_2002.html','bridge_book_2023.html','pwd_rule_book.html','red_book_reader.html','morth_reader.html'])
 assert.ok(pack.includes('"'+retired+'"'),'Restricted legacy book excluded from APK: '+retired);
assert.ok(pack.includes('PRIVATE_PROVIDER_URLS'),'Full packaged assets require private-link scan');
const sw=read('sw.js');
assert.ok(sw.includes("'./library-public-catalog.js'"));
for(const file of ['library-offline.js','library-drive-catalog.js','pdf_viewer.html','morth_reader.html'])
 assert.ok(!sw.includes("'./"+file+"'"),'Private legacy content still precached: '+file);
console.log('V35 public accessibility PASS: 12 publisher pages accessible at check, 3 official publisher URLs unconfirmed (CPWD2/IRC1); no private book access or false free-view claims.');
