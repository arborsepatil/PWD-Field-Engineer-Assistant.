/** Steel V17 — physical PDF page provenance for IS 808:2021.
 * Independent source navigation audit of the owner's 60-page copy, where the
 * printed Indian Standard page is offset by two from the PDF viewer page.
 * IMPORTANT: The non-commercial licensed PDF stays PRIVATE: no PDF bytes in
 * repository, test suite, packaged HTML or Android APK.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const code=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const scope={module:{exports:{}}};
vm.runInNewContext(code,scope,{filename:'pwd-steel-catalog.js'});
const cat=scope.module.exports;
const begin=code.indexOf('const IS808_BIS_SPOT_CHECKS=Object.freeze([');
const finish=code.indexOf(']);',begin);
assert.ok(begin>=0&&finish>begin,'IS 808 independent sample ledger exists');
const text=code.slice(begin,finish);
const rows=text.split('\n').filter(x=>x.includes('Object.freeze({series:')&&x.includes('pdfPage:'));
assert.equal(rows.length,30,'All thirty selected numerical records retain page citations');
assert.equal(cat.is808AuditSampleCount,30);
let checked=0;
for(const line of rows){
 const textVal=k=>line.match(new RegExp(k+":'([^']+)'"))?.[1];
 const num=k=>{const m=line.match(new RegExp('(?:\\{|,)'+k+':(\\d+(?:\\.\\d+)?)'));return m?Number(m[1]):undefined};
 const series=textVal('series'),d=num('d'),b=num('b'),t=num('t'),mass=num('mass');
 const table=num('table'),page=num('pdfPage');
 let expectedPage,expectedTable;
 if(series==='MB'){expectedPage=7;expectedTable=1;}
 else if(series==='WB'){expectedPage=8;expectedTable=1;}
 else if(series==='LB'){expectedPage=10;expectedTable=2;}
 else if(series==='NPB'){expectedPage=11;expectedTable=3;}
 else if(series==='WPB'){expectedPage=15;expectedTable=4;}
 else if(series==='HB'){expectedPage=22;expectedTable=5;}
 else if(series==='MC'){expectedPage=(d<250||(d===250&&b===80))?23:24;expectedTable=6;}
 else if(series==='JC'){expectedPage=25;expectedTable=7;}
 else if(series==='LC'){expectedPage=26;expectedTable=7;}
 else if(series==='MPC'){expectedPage=27;expectedTable=8;}
 else if(series==='EQ'){expectedPage=d<150?31:32;expectedTable=9;}
 else if(series==='UE'){expectedPage=39;expectedTable=12;}
 else if(series==='PBP'){expectedPage=40;expectedTable=13;}
 else assert.fail('Unmapped audited family: '+series);
 assert.equal(table,expectedTable,series+' '+d+' table');
 assert.equal(page,expectedPage,series+' '+d+' '+b+' PDF page');
 const family=['MB','WB','LB','NPB','WPB'].includes(series)?'beam':
  ['MC','JC','LC','MPC'].includes(series)?'channel':
  ['HB','SC'].includes(series)?'column':
  ['EQ','UE'].includes(series)?'angle':'pile';
 const synthetic={family,series,depthMm:d,widthMm:b,kgPerM:mass};
 if(t!==undefined)synthetic.thicknessMm=t;
 const result=cat.standardAudit(synthetic);
 assert.equal(result.sourceTable,table,'audit output must provide table provenance');
 assert.equal(result.sourcePdfPage,page,'audit output must provide exact physical source page');
 assert.equal(result.status,'is808-mass-checked','mass-only record is not geometry certified');
 checked++;
}
assert.equal(checked,30);
const mb=cat.standardAudit(cat.byId('ISMB300'));
assert.equal(mb.sourceTable,1);
assert.equal(mb.sourcePdfPage,7);
assert.equal(mb.status,'is808-mass-area-inertia-checked');
const mc=cat.standardAudit(cat.byId('ISMC150'));
assert.equal(mc.sourceTable,6);
assert.equal(mc.sourcePdfPage,23);
const hb=cat.standardAudit(cat.sections.find(x=>x.series==='HB'&&x.kgPerM===37.31));
assert.equal(hb.sourcePdfPage,22);
const conflict={...cat.byId('ISMB300'),kgPerM:46.03};
const failing=cat.standardAudit(conflict);
assert.equal(failing.status,'is808-numeric-conflict');
assert.equal(failing.sourceTable,1);
assert.equal(failing.sourcePdfPage,7);
assert.equal(cat.standardAudit({family:'beam',series:'MB',depthMm:999,widthMm:100,kgPerM:9}).status,'not-checked',
 'Unseen sections cannot inherit a source page from other shapes');
console.log('Steel V17 PASS: all 30 selected IS 808 source pages match the 60-page owner PDF; reference page IDs surfaced on checked and conflicting rows.');
