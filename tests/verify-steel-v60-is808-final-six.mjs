/* Steel V60: exact source check against owner-held IS 808:2021
 * PDF physical pages 17, 26, 32, 39; copyrighted tables not distributed.
 * 4 mass-and-area matches become limited quantity eligible, 2 retain HOLD:
 * (1) geometrically contradictory WPB nominal row, (2) non-tabulated angle.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const text=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const part=text.split('const IS808_V60_ROW_CHECKS=Object.freeze([')[1]?.split(']);')[0];
assert.ok(part,'V60 review ledger missing');
const entries=[...part.matchAll(/id:'([^']+)',result:'(match|geometry-hold|not-tabulated)',table:(\d+),pdfPage:(\d+),fingerprint:'([0-9a-f]{8})'/g)]
 .map(([,id,result,table,pdfPage,hash])=>({id,result,table:Number(table),
  pdfPage:Number(pdfPage),hash}));
assert.equal(entries.length,6);
assert.equal(new Set(entries.map(e=>e.id)).size,6);
assert.equal(entries.filter(e=>e.result==='match').length,4);
assert.equal(entries.filter(e=>e.result==='geometry-hold').length,1);
assert.equal(entries.filter(e=>e.result==='not-tabulated').length,1);
assert.equal(catalog.is808V60AuditSampleCount,6);
const expectedMatches=['OSD329','OSD334','OSD338','OSD543'];
assert.deepEqual(entries.filter(e=>e.result==='match').map(e=>e.id),expectedMatches);
const tamperFields=['sourceId','family','series','designation','depthMm','widthMm',
 'thicknessMm','webMm','flangeMm','kgPerM','areaCm2','ixCm4',
 'iyCm4','zxCm3','zyCm3','qualityFlag'];
for(const entry of entries){
 const row=catalog.byId(entry.id);
 assert.ok(row,'Catalogue row missing: '+entry.id);
 const audit=catalog.standardAudit(row);
 assert.equal(audit.sourceTable,entry.table,entry.id);
 assert.equal(audit.sourcePdfPage,entry.pdfPage,entry.id);
 assert.equal(audit.geometryChecked,false,entry.id);
 const expectedStatus=entry.result==='match'?'is808-mass-checked':
  entry.result==='geometry-hold'?'source-numeric-hold':'is808-not-tabulated';
 assert.equal(audit.status,expectedStatus,entry.id);
 assert.equal(compare.audit(catalog,row).status,
  entry.result==='match'?'checked':'hold',entry.id);
 assert.equal(compare.quantityGate(catalog,row).allowed,
  entry.result==='match',entry.id);
 const deidentified={...row,id:entry.id+'-changed'};
 assert.equal(compare.quantityGate(catalog,deidentified).allowed,false,
  entry.id+' de-identified row cannot inherit approval');
 for(const key of tamperFields){
  const value=row[key];
  const modified={...row,[key]:typeof value==='number'?value+1:
   value===undefined||value===null?'altered':String(value)+'-altered'};
  const changedAudit=catalog.standardAudit(modified);
  assert.notEqual(changedAudit.status,'is808-mass-checked',
   entry.id+' tamper '+key+' must lose checked status');
  assert.equal(compare.quantityGate(catalog,modified).allowed,false,
   entry.id+' changed '+key+' must not enable quantity');
 }
}
const wpb=catalog.byId('OSD180');
assert.equal(wpb.depthMm,280);assert.equal(wpb.widthMm,280);
assert.equal(wpb.webMm,10.5);assert.equal(wpb.flangeMm,18);
const plateArea=(2*wpb.widthMm*wpb.flangeMm+
 (wpb.depthMm-2*wpb.flangeMm)*wpb.webMm)/100;
assert.ok(plateArea>120&&plateArea<130,
 'Section idealized geometry expected near 126.42 cm2');
assert.ok(wpb.areaCm2>2.8*plateArea,
 'Potential reference-row source contradiction must stay plainly visible');
assert.equal(compare.quantityGate(catalog,wpb).allowed,false,
 'Never certify a 2.9x source-area inconsistency as safe nominal quantity');
assert.match(catalog.standardAudit(wpb).note,/NOT a BIS tolerance/);
const rare=catalog.byId('sail23-ISA200x200x18');
assert.equal(rare.thicknessMm,18);
assert.equal(rare.kgPerM,54.3);
assert.match(catalog.standardAudit(rare).note,/not listed/i);
assert.equal(compare.quantityGate(catalog,rare).allowed,false);
const totals=status.summarize(catalog,compare,catalog.sections);
assert.equal(totals.total,757);
assert.deepEqual({...totals.counts},{checked:686,review:0,hold:71});
assert.equal(totals.records.filter(x=>x.status==='review').length,0);
assert.ok(totals.records.filter(x=>x.status==='hold')
 .every(x=>compare.quantityGate(catalog,x.row).allowed===false));
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8')
 .includes('pwd-tools-steel-v60-2026-10-25'));
assert.equal(fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')),false);
console.log('STEEL V60 PASS: 4 exact LC/UE limited source matches, 1 inconsistent WPB and 1 untabulated angle held; 686 checked, 0 review, 71 hold; quantity gates fail closed.');
