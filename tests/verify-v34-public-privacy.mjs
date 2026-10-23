/* V34: verify no private Google Drive/Sheets origins leak through packaged screens.
 * The original Drive owners and books are not changed by this test.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const privateOrigins=[
 'drive.google.com/file/d/',
 'drive.google.com/drive/folders/',
 'docs.google.com/spreadsheets/d/',
 'docs.google.com/document/d/'
];
const excluded=new Set(['sw.js','rcc-wall-2023-bbs.js','library-offline.js']);
const sourceFiles=fs.readdirSync(root).filter(name=>
 !excluded.has(name)&&/\.(?:html|js|json)$/i.test(name));
assert.ok(sourceFiles.length>30,'Must audit full shared-app root, not only the Library');
for(const name of sourceFiles){
 const content=read(name);
 for(const origin of privateOrigins){
  assert.ok(!content.includes(origin),'Private provider URL leaked in '+name+': '+origin);
 }
}
const gr=read('gr_library.html');
assert.ok(!gr.includes('PWD_GR_DIGITAL_LIBRARY_MASTER'),'Working private register name must not be exposed');
assert.ok(gr.includes('Official Maharashtra GR portal'));
assert.ok(gr.includes('Official GR search'));
assert.ok(!gr.includes('DRIVE AVAILABLE'),'No suggestion that everyone can browse private Drive');
const publicCatalog=read('library-public-catalog.js');
const scope={window:{}};vm.runInNewContext(publicCatalog,scope);
const pages=Array.from(scope.window.PWDPublicBookCatalogue);
assert.equal(pages.length,15,'All 15 official publisher destinations must remain traceable');
assert.ok(pages.every(x=>!x.id&&x.url?.startsWith('https://')));
assert.ok(pages.find(x=>x.title.startsWith('CPWD Specifications')).note.includes('sometimes rejects direct viewing'),
 'External access limits must not be hidden from users');
const library=read('library.html');
assert.ok(!library.includes('library-offline.js'),'Private-book importer/exporter must not be reachable from public Library');
assert.ok(!library.includes('exportCopy'),'No export in public Library');
const pack=read('android/scripts/prepare_assets.py');
assert.ok(pack.includes('"library-offline.js"'),'Unused private PDF exporter excluded from APK');
assert.ok(pack.includes('PRIVATE_PROVIDER_URLS'),'Android packaging must block ALL private origins');
const action=read('.github/workflows/android-apk.yml');
assert.ok(action.includes('node tests/verify-v34-public-privacy.mjs'));
const privateReaders=[
 'pdf_viewer.html','library-drive-catalog.js','library-offline.js','library-private-pdf.js',
 'bridge-local-source.js','bridge-pdf-canvas.js',
 'bridge_book_2002.html','bridge_book_2023.html',
 'pwd_rule_book.html','morth_reader.html','red_book_reader.html'
];
for(const file of privateReaders){
 assert.ok(pack.includes('"'+file+'"'),'Restricted book access file missing from APK exclusion: '+file);
}
for(const book of ['bridge_book_2002.html','bridge_book_2023.html']){
 const html=read(book);
 assert.ok(!html.includes('pdf_viewer.html'),'Private original is linked from '+book);
}
const bridgeGateway=read('pwd_bridge_plans.html');
assert.ok(bridgeGateway.includes('./library.html?section=design'),'Bridge page must navigate to public publisher references');
assert.ok(!bridgeGateway.includes('bridge_book_2002.html')&&!bridgeGateway.includes('bridge_book_2023.html'),'Private drawing indexes still reachable in public app');
const shell=read('sw.js');
for(const file of privateReaders){
 assert.ok(!shell.includes("'./"+file+"'"),'Private access file still service-worker cached: '+file);
}
assert.ok(!shell.includes('PDFJS_CDN_ASSETS'),'Private viewer renderer must not be preloaded');
const pagesBuild=read('scripts/prepare_public_site.py');
const deploy=read('.github/workflows/deploy-pages.yml');
assert.ok(pagesBuild.includes('ast.literal_eval')&&pagesBuild.includes('prepare_assets.py'),'Public website should reuse Android exclusions');
assert.ok(deploy.includes('python3 scripts/prepare_public_site.py')&&deploy.includes('path: public-dist'),'GitHub Pages must not upload the whole repository');
assert.ok(!deploy.includes('path: .\\n'),'A full repository upload would publish retired private-reference screens');
console.log('V34 public privacy PASS: scanned '+sourceFiles.length+' shipped source assets, no private Google Drive/Sheets links, private master removed, publisher viewing only, excluded legacy readers and clean Pages packaging.');
