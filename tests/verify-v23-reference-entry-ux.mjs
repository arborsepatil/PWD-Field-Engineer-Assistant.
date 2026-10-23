/** V23 source entry UX retained, updated to V33 no-private-publication policy.
 * Bridge scheme pages remain; original private book links do not.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const pdf=read('pdf_viewer.html'),wall=read('pwd_pcc_wall_reference.html'),cache=read('sw.js');
for(const id of ['sourceChooser','chooseDevicePdf','privatePdfFile','privateBar','forgetPrivatePdf','pdfPageIndicator','gestureSurface'])
 assert.ok(pdf.includes('id="'+id+'"'),'Local user-owned drawing reader control missing: '+id);
assert.ok(pdf.includes('getElementById(\'chooseDevicePdf\')?.addEventListener'),'Local file chooser must still be real');
assert.ok(pdf.includes('Private books are not distributed in this app'),'No misleading promise of shared private books');
assert.ok(!pdf.includes('drive.google.com/file/d/'),'No private Drive PDF links in viewer source');
assert.ok(!pdf.includes('PWDDrivePDFCatalog||[]'),'Never restore restricted catalogue from URL query');
assert.ok(pdf.includes('#driveBtn,#fallbackBtn{display:none!important}'),'No legacy Drive buttons');
assert.ok(pdf.includes("bridge2002:{title:")&&pdf.includes("bridge2023:{title:"),'Only optional user-supplied bridge drawings remain');
for(const old of ["morth:{title:","rulebook:{title:","redbook2:{title:","pwdcode:{title:","officemanual:{title:"])assert.ok(!pdf.includes(old),'Removed private book route '+old);
const inline=pdf.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(inline);new vm.Script(inline[1],{filename:'private-free-local-viewer.js'});
for(const [label,page,doc] of [['2023',218,'bridge2023'],['2002',69,'bridge2002']]){
 assert.ok(!wall.includes('./pdf_viewer.html?doc='+doc+'&amp;page='+page),
  label+' original PDF URL must not be exposed through public app');
}
assert.ok(wall.includes('Engineering limitation:')&&wall.includes('Do not apply its quantities'),'Safety disclaimer must remain visible');
assert.match(wall,/<details class="source-more group">[\s\S]*?<summary>Drawing references and discrepancies<\/summary>/);
assert.ok(wall.includes('sheet 174')||wall.includes('Sheet 174'),'Source drawing discrepancy must remain visible');
assert.ok(wall.includes('omits the index leading zero'),'2002 scheme discrepancy must remain visible');
assert.ok(!cache.includes("'./pdf_viewer.html'")&&cache.includes("'./pwd_pcc_wall_reference.html'"),'Public technical references cached; private PDF reader not cached');
console.log('V23→V34 PASS: no public original-PDF navigation, historical viewer code excluded from cache; engineering warnings retained.');
