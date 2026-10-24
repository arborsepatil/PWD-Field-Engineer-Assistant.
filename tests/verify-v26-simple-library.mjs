/** V26 compatibility regression, updated for V33's public-only reference policy. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const library=read('library.html'),home=read('index.html'),viewer=read('pdf_viewer.html'),sw=read('sw.js');
for(const id of ['libSearch','libraryTabs','sectionTitle','matchCount','bookGrid','emptyResults','digitalSSR'])
 assert.ok(library.includes('id="'+id+'"'),'Missing useful public library screen control '+id);
assert.ok(library.includes('library-public-catalog.js'),'Public catalogue must be loaded');
assert.ok(!library.includes('<script src="./library-drive-catalog.js"'),'Old private Drive catalogue must not populate Library');
assert.ok(!library.includes('data-offline-save')&&!library.includes('data-offline-export'),'Shared Library cannot distribute private books or copies');
assert.ok(!library.includes('Save multiple PDFs')&&!library.includes('Export copy'),'Download/private-book UI must be absent');
assert.ok(library.includes('View on publisher ↗')&&library.includes("anchor.target='_blank'"),'Official view-only action and outside publisher should remain');
assert.ok(library.includes("get('digitalSSR').hidden=section!=='ssr'"),'Offline user-owned SSR search is a separate tool, not a shared private book');
assert.ok(home.includes('href="./library.html?section=ssr"')&&home.includes('href="./library.html"'),'Home SSR and Library gateways preserved');
assert.ok(!sw.includes("'./pdf_viewer.html'"),'Retired private PDF chooser must not be distributed in offline app');
assert.ok(!viewer.includes('drive.google.com/file/d/'),'Archived viewer must not embed private Drive URLs');
assert.ok(/pwd-tools-civilbandhu-home-v39-2026-10-24/.test(sw),'Offline app cache must refresh calculator assets while retaining publisher access/privacy safeguards');
const inline=library.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(inline,'Active Library filter/view script missing');
new vm.Script(inline[1],{filename:'library-v33.inline.js'});
console.log('V26→V35 compatibility PASS: public-only Library, categories, local SSR tool, no packaged private PDF reader, valid publisher-view script.');
