/** V30 — BIS source-variant matching and source-original discrepancy quarantine.
 * Validated manually against owner-held IS 808:2021, physical pp10,18,22,23,26.
 * BIS PDF bytes must remain private and never ship with this repository.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(p,win){const m={exports:{}};const script=read(p);const ctx={window:win,module:m};vm.runInNewContext(script,ctx,{filename:p});return m.exports}
const window={};window.PWDSteelOsdag=load('pwd-steel-osdag.js',window);
const cat=load('pwd-steel-catalog.js',window),compare=load('pwd-steel-compare.js',window);
assert.equal(cat.sections.length,757,'Complete source catalog must remain intact, without dropping disputed data');
assert.equal(cat.is808V30VariantCount,3);
assert.equal(cat.is808V30PrintedConflictCount,5);
const variants=[
 ['OSD13','LB(P) 200',21.06,26.8,1800,112,5.6,8,2,10],
 ['OSD251','HB 200*',39.73,50.6,3690,971,7.8,9,5,22],
 ['OSD331','LC (P) 150',15.6,19.8,750,96.1,5,8.7,7,26]
];
for(const [id,designation,mass,area,ix,iy,web,flange,table,page] of variants){
 const row=cat.byId(id);assert.equal(row.designation,designation);
 for(const [key,val] of Object.entries({kgPerM:mass,areaCm2:area,ixCm4:ix,iyCm4:iy,webMm:web,flangeMm:flange}))
  assert.equal(row[key],val,'BIS p'+page+' Table '+table+' section '+id+' '+key);
 const a=cat.standardAudit(row);
 assert.equal(a.status,'is808-mass-area-inertia-checked','Published special variant must be checked by its exact identity');
 assert.equal(a.sourcePdfPage,page);assert.equal(a.sourceTable,table);
 assert.equal(a.geometryChecked,false,'Absent original slope and R1/R2 in open data cannot be claimed verified');
 assert.equal(compare.audit(cat,row).status,'checked');
 for(const [key,delta] of [['kgPerM',.01],['areaCm2',.01],['ixCm4',1],['iyCm4',1],['depthMm',1],['widthMm',1],['webMm',.01],['flangeMm',.01]]){
  const altered={...row,[key]:row[key]+delta};
  assert.equal(cat.standardAudit(altered).status,'is808-numeric-conflict','Altered '+id+' '+key+' must never qualify as BIS verified');
  assert.equal(compare.audit(cat,altered).status,'hold');
 }
}
const sourceContradictions=[
 ['OSD193',290.64,315,4,18],
 ['OSD194',91.04,106,4,18],
 ['OSD195',125.81,142,4,18],
 ['OSD196',163,180,4,18],
 ['OSD308',22.7,27.3,6,23]
];
for(const [id,mass,area,table,page] of sourceContradictions){
 const row=cat.byId(id);assert.equal(row.kgPerM,mass);assert.equal(row.areaCm2,area);
 const a=cat.standardAudit(row);
 assert.equal(a.status,'source-numeric-hold');
 assert.equal(a.sourceTable,table);assert.equal(a.sourcePdfPage,page);
 assert.ok(a.note.includes('NOT an approved correction'),'Never infer replacement kg/m from density');
 assert.equal(compare.audit(cat,row).status,'hold','Published BIS internal discrepancy must remain held');
 assert.ok(Math.abs(mass-area*.785)>1,'This audited example requires a material mass/area inconsistency');
 assert.equal(compare.build(cat,[row])[0].kgPerM,mass,'Raw source number preserved, not adjusted');
}
const statuses=cat.sections.reduce((n,r)=>{const status=compare.audit(cat,r).status;n[status]=(n[status]||0)+1;return n;},{});
assert.equal(statuses.checked,152);
assert.equal(statuses.hold,17);
assert.equal(statuses.review,588);
const app=read('pwd-steel-app.js'),html=read('pwd_steel_table.html');
new vm.Script(app,{filename:'pwd-steel-app.js'});
assert.ok(app.includes('function visibleDesignation(row)')&&app.includes('same.length<2'),'Same-name differing section variants must be disambiguated');
assert.ok(app.includes('name.textContent=visibleDesignation(row)'),'Size search must differentiate variants');
assert.ok(app.includes('items.map(x=>visibleDesignation(x))'),'Comparison headings must differentiate same-name variants');
assert.ok(app.includes("comparison.audit(catalog,selected).status!=='checked'"),'Quantity must fail closed for pending nominal weights');
assert.ok(app.includes("if(chsAudit.status==='source-numeric-hold')throw Error('This selected section"),'No RHS-only warning for a held IS 808 row');
assert.ok(!app.includes('IS 4923:2017 RHS 120×80×6 has an unresolved numeric source-table discrepancy'),'Old misattributed alert must be removed');
assert.ok(html.includes('id="steelKeyAudit"'),'Nominal mass source status remains prominent');
assert.ok(!html.includes('id="steelExport"')&&!html.includes('id="steelPrint"'));
console.log('V30 PASS: 3 exact source variants correctly accepted; 5 printed BIS inconsistencies remain held; 24 altered variant tests held; all 757 rows classified 152 checked / 17 held / 588 pending.');
