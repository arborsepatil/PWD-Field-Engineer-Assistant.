/** V23 streamlined PDF and bridge return-wall source screens.
 * UI simplification only; source pages, private PDF handling and engineering
 * limitations must stay available and remain testable.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pdf=read('pdf_viewer.html');
const wall=read('pwd_pcc_wall_reference.html');
const cache=read('sw.js');
assert.ok(pdf.includes('id="sourceChooser"'),'User must see a file-chooser state');
assert.ok(pdf.includes('id="chooseDevicePdf"'),'PDF Files action must be present');
assert.ok(pdf.includes('id="privatePdfFile"'),'Native Android PDF picker input must be retained');
assert.ok(pdf.includes('id="privateBar"')&&pdf.includes('id="forgetPrivatePdf"'),'Already-loaded PDF can still be managed');
assert.ok(pdf.includes('id="pdfPageIndicator"')&&pdf.includes('id="gestureSurface"'),'PDF page indicators and gesture controls remain');
assert.ok(pdf.includes('id="driveBtn"')&&pdf.includes('id="fallbackBtn"'),'Official private Drive navigation and fallback stay available');
assert.match(pdf,/\.viewer:has\(\.source-chooser:not\(\[hidden\]\)\) \.private-pdf-bar\{display:none\}/,
 'On empty PDF chooser screen, duplicate import strip must be visually absent');
assert.match(pdf,/<button id="chooseDevicePdf" type="button">Choose PDF<\/button>/);
assert.ok(!pdf.includes('The drawing index works offline · the original PDF remains private</small>'),
 'Duplicate import help should not fill the default viewer');
assert.ok(pdf.includes('getElementById(\'chooseDevicePdf\')?.addEventListener'),
 'Primary choose button should invoke the actual file picker, not be decorative');
const inline=pdf.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(inline,'Original file viewer source/page scripts must be present');
new vm.Script(inline[1],{filename:'pdf_viewer.inline.js'});
for(const id of ['bridge2002','bridge2023','rulebook','redbook2','morth'])
 assert.ok(pdf.includes(id+':{title:'),'Existing private PDF routes must remain');
for(const [label,page,doc] of [
 ['2023',218,'bridge2023'],
 ['2002',69,'bridge2002']
]){
 const url='./pdf_viewer.html?doc='+doc+'&amp;page='+page;
 assert.ok(wall.includes(url),label+' original drawing exact PDF viewer link retained');
}
assert.ok(wall.includes('Engineering limitation:')&&wall.includes('Do not apply its quantities'),
 'Do not hide the significant PCC calculator geometry mismatch');
assert.match(wall,/<details class="source-more group">[\s\S]*?<summary>Drawing references and discrepancies<\/summary>/);
assert.ok(wall.includes('sheet 174')||wall.includes('Sheet 174'),'2023 title-block discrepancy retained');
assert.ok(wall.includes('omits the index leading zero'),'2002 drawing reference discrepancy retained');
assert.ok(wall.includes('./bridge_book_2002.html')&&wall.includes('./bridge_book_2023.html'),
 'Index navigation cannot be removed outright');
assert.equal((wall.match(/class="action" href="\.\/pdf_viewer\.html\?/g)||[]).length,2,
 'Exactly one prominent original-sheet action per card');
assert.ok(cache.includes("'./pdf_viewer.html'")&&cache.includes("'./pwd_pcc_wall_reference.html'"),
 'Both reference screens remain cached for offline app use');
console.log('V23 UI PASS: single PDF chooser, full private source/page functionality, concise return-wall cards and visible engineering warnings.');
