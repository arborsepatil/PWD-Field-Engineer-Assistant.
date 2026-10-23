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
assert.equal(pages.length,12,'Curated public publisher destinations must remain traceable');
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
console.log('V34 public privacy PASS: scanned '+sourceFiles.length+' shipped source assets, no private Google Drive/Sheets links, private master removed, public viewing kept, legacy exporter excluded.');
