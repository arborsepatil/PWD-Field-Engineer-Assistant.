/** Limited current-standard CHS comparison ledger using the owner's private
 * IS 1161:2014 Amd. 2, August 2023, replacement Table 1 (pp. 3–10).
 * No BIS PDF or bulk official table ships with the app.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const file=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(p,extra={}){
 const context={module:{exports:{}},...extra};
 vm.runInNewContext(file(p),context,{filename:p});
 return context.module.exports;
}
const cat=load('pwd-steel-catalog.js');
const osdag=load('pwd-steel-osdag.js');
const full=load('pwd-steel-catalog.js',{PWDSteelOsdag:osdag});
const app=file('pwd-steel-app.js');
const first=cat.byId('tata-legacy-chs21.3x21.3x2');
assert.ok(first);
assert.equal(first.kgPerM,0.95);
assert.equal(first.areaCm2,1.21);
assert.equal(cat.standardAudit(first).status,'spot-checked-match');
const withdrawn=cat.byId('tata-legacy-chs33.7x33.7x2.6');
assert.ok(withdrawn);
assert.equal(cat.standardAudit(withdrawn).status,'not-listed-in-replacement');
assert.equal(cat.standardAudit({series:'CHS',depthMm:21.3,thicknessMm:2.6,kgPerM:1.20}).status,'not-listed-in-replacement');
assert.equal(cat.standardAudit({series:'CHS',depthMm:33.7,thicknessMm:2,kgPerM:1.56,areaCm2:1.99}).status,'spot-checked-match');
assert.equal(cat.standardAudit({series:'CHS',depthMm:33.7,thicknessMm:2,kgPerM:1.60,areaCm2:1.99}).status,'spot-checked-conflict');
assert.equal(cat.standardAudit({series:'CHS',depthMm:42.4,thicknessMm:4,kgPerM:3.79,areaCm2:4.83}).status,'spot-checked-match');
assert.equal(cat.standardAudit({series:'CHS',depthMm:114.3,thicknessMm:4,kgPerM:10.88,areaCm2:13.86}).status,'spot-checked-match');
assert.equal(cat.standardAudit({series:'CHS',depthMm:33.7,thicknessMm:3.1,kgPerM:2.5}).status,'not-checked');
assert.equal(cat.standardAudit({series:'MB',depthMm:300,kgPerM:46.02}).status,'not-checked');
assert.equal(full.openDataCount,640);
assert.equal(full.standardAudit(full.byId('tata-legacy-chs33.7x33.7x2.6')).status,'not-listed-in-replacement');
assert.match(app,/IS 1161 Amendment 2 review: not an approved current table weight/);
assert.match(app,/IS 1161:2014 Amd.2 · sample checked/);
assert.match(app,/not-listed-in-replacement/);
assert.ok(app.includes('Limited BIS check')&&app.includes('comparison.audit(catalog,row)'),'CHS and other limited BIS spot-checks retain truthful visible source status');
assert.match(app,/spot-checked-conflict/);
const list=cat.codeReferences.find(x=>x.standard.startsWith('IS 1161:2014'));
assert.ok(list.standard.includes('Amd.2 (Aug 2023)'));
assert.ok(list.scope.includes('replaces 2014 Table 1'));
console.log('IS 1161 Amd.2 CHS audit passed: current sample match, mass disagreement, older unlisted gauge gate, all 640 Osdag entries retained.');
