/* Android APK wrapper source contract. Run before Android Gradle compile. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=read('android/app/src/main/AndroidManifest.xml');
const activity=read('android/app/src/main/java/in/pwdtools/fieldassistant/MainActivity.java');
const builder=read('android/app/build.gradle');
const pack=read('android/scripts/prepare_assets.py');
const workflow=read('.github/workflows/android-apk.yml');
const core=read('pwd-retaining-wall-core.js');
const wall=read('pwd_retaining_wall_section_quantity.html');
const release=read('tests/verify-release.mjs');
assert.match(manifest,/android.intent.action.MAIN/);
assert.match(manifest,/android.intent.category.LAUNCHER/);
assert.match(manifest,/android:exported="true"/);
assert.match(manifest,/android:allowBackup="false"/);
assert.match(manifest,/android:usesCleartextTraffic="false"/);
assert.match(activity,/extends Activity/);
assert.match(activity,/WebViewAssetLoader/);
assert.match(activity,/AssetsPathHandler/);
assert.match(activity,/https:\/\/appassets\.androidplatform\.net\/assets\/www\//);
assert.match(activity,/setJavaScriptEnabled\(true\)/);
assert.match(activity,/setDomStorageEnabled\(true\)/);
assert.match(activity,/setAllowFileAccess\(false\)/);
assert.match(activity,/setAllowUniversalAccessFromFileURLs\(false\)/);
assert.match(activity,/onShowFileChooser/);
assert.match(activity,/onJsPrompt/);
assert.match(activity,/__PWD_ANDROID_CSV_EXPORT_V1__/);
assert.match(activity,/Intent\.ACTION_CREATE_DOCUMENT/);
assert.match(activity,/getContentResolver\(\)\.openOutputStream/);
assert.match(activity,/message\.startsWith\(CSV_PROMPT\)/);
assert.match(activity,/createPrintDocumentAdapter/);
assert.match(activity,/Intent\.ACTION_VIEW/);
assert.match(builder,/com\.android\.application/);
assert.match(builder,/androidx\.webkit:webkit/);
assert.match(workflow,/assembleDebug/);
assert.match(workflow,/upload-artifact/);
assert.match(workflow,/prepare_assets\.py/);
for(const restricted of ['library-offline.js','library-drive-catalog.js','library-private-pdf.js','pdf_viewer.html','bridge-local-source.js','bridge_book_2002.html','bridge_book_2023.html','morth_reader.html','red_book_reader.html','pwd_rule_book.html']){
 assert.ok(pack.includes('"'+restricted+'"'),'Private or licensed book component is not excluded from public APK: '+restricted);
}
assert.ok(pack.includes('for retired in EXCLUDED'),'Android packager must remove stale private assets');
assert.match(pack,/PRIVATE_PROVIDER_URLS/,'All Android assets must be checked for private Drive/Docs links');
assert.match(pack,/not any\(p\.suffix\.lower\(\) == "\.pdf"/);
assert.doesNotMatch(activity,/setAllowUniversalAccessFromFileURLs\(true\)/);
assert.doesNotMatch(activity,/addJavascriptInterface/); // untrusted frames
assert.doesNotMatch(core,/weep/i);
assert.doesNotMatch(wall,/weep/i);
assert.match(release,/Removed weep-hole concept/);
assert.ok(!fs.existsSync(path.join(root,'android/app/src/main/assets/www/sw.js')),
  'PWA service worker should not be bundled with APK');
console.log('Android APK source contracts: Android Activity, offline packaging, file picker, printing, privacy, no weep-hole passed');
