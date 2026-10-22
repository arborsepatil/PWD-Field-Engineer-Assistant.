/** Stable temporary PDF viewing for Android WebView: private Google Drive
 * authentication must not appear in an embedded iframe.
 * This test does not claim local PDF canvas renderer is fully offline.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const viewer=read('pdf_viewer.html');
const lib=read('library.html');
const bridge=read('bridge-local-source.js');
const local=read('library-private-pdf.js');
const canvas=read('bridge-pdf-canvas.js');
assert.ok(viewer.includes('Choose how to open this PDF'));
assert.ok(viewer.includes('Open in Drive (internet)'));
assert.ok(viewer.includes('element(\'fallback\').classList.toggle(\'show\',!localURL)'));
assert.ok(!viewer.includes('element(\'frame\').src=drivePreview()'));
assert.ok(!viewer.includes("element('frame').src=localURL?localURL+'#page='+page:drivePreview()"));
assert.ok(viewer.includes('element(\'frame\').src=\'about:blank\''));
assert.ok(viewer.includes('if(localURL)'));
assert.ok(!viewer.includes('id="driveBtn" class="primary" target="_blank"'));
assert.ok(viewer.includes('Open in Drive (internet)'));
assert.ok(lib.includes('Open / select PDF'));
assert.ok(lib.includes('Open in Drive ↗'));
assert.ok(!lib.includes("target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Google Drive"));
assert.ok(local.includes('No PDF saved on this device'));
assert.ok(bridge.includes('No original PDF saved'));
assert.ok(bridge.includes('page-count'));
assert.ok(canvas.includes('pdf.min.js')); // Renderer is currently remote, so native offline QA remains pending.
assert.ok(!fs.existsSync(path.join(root,'assets','private_pdf')));
console.log('Drive PDF viewing: no embedded account sign-in, direct online handoff, original local PDF selectors preserved.');
