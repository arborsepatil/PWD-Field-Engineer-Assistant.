/* Section 900 selected reference frequencies, copied as controlled QA fixtures
 * after comparison to owner's MoRTH Fifth Revision 2013 (Tables 900-3/900-4).
 * Checks the UI against a frozen reviewed subset; NOT full Section 900 approval.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const qc=fs.readFileSync('qc.html','utf8');
const checks=[
 ['9032-borrow-sand','2 tests / 3,000 m³ of soil'],
 ['9032-borrow-plasticity','2 tests for each soil type'],
 ['9032-borrow-density','2 tests for each soil type'],
 ['9032-borrow-deleterious','As required by the Engineer'],
 ['9032-borrow-moisture','2 tests / 3,000 m³ of soil'],
 ['9032-borrow-cbr','1 CBR test (average of 3 specimens) / 3,000 m³; closer if directed'],
 ['9032-compaction-embankment','At least 1 set of 10 measurements / 3,000 m²'],
 ['9032-compaction-subgrade','At least 1 set of 10 measurements / 2,000 m²'],
 ['9032-compaction-cut','Follow Clause 903.2.2 requirements'],
 ['9035-dlc-samples','3 samples / 1,000 m² or part thereof laid each day'],
 ['9035-dlc-density','3 holes / 2,000 m² or part thereof laid each day'],
 ['9006-joint','Check 1 joint per 400 m length or day\'s work'],
 ['9006-regularity','Once per day or day\'s work; avoid disturbing curing'],
 ['9006-dowels','Check trial length per Clause 602.6.5.2, then once per 2 km'],
 ['9006-cement','Once for each source; repeat when indicated by prolonged or improper storage; manufacturer test data daily'],
 ['9006-aggregate-grading','Initially 1 test per day\'s work for each fraction; Engineer may later relax'],
 ['9006-aggregate-deleterious','Initially 1 test per day\'s work for each fraction; Engineer may later relax'],
 ['9006-water-absorption','At least 1 coarse and 2 fine aggregate tests daily; further tests as needed'],
 ['9006-impact','Once for each source, then monthly'],
 ['9006-soundness','Before aggregate approval and monthly thereafter'],
 ['9006-alkali','Before aggregate approval and monthly thereafter'],
 ['9006-water','Once when approving source, then if doubt arises'],
 ['9006-slump','Initially test every dumper load at both sites; later alternate dumpers permitted by source'],
 ['9006-level-grid','Level grid 5 or 6.25 m longitudinally × 3.5 m transversely'],
 ['9006-trial-cores','3 cores per trial length'],
 ['9006-stringline','Check at 5 or 6.25 m intervals; ±2 mm tolerance; approval 1–2 h before concreting'],
 ['9003-gsb-grading','1 test / 400 m³'],
 ['9003-gsb-atterberg','1 test / 400 m³'],
 ['9003-gsb-moisture','1 test / 400 m³'],
 ['9003-gsb-density','1 test / 1,000 m²'],
 ['9003-gsb-deleterious','As required'],
 ['9003-gsb-cbr','As required'],
 ['9003-stabilized-quality','Each consignment; minimum 1 test per 5 tonnes'],
 ['9003-stabilized-content','Regular procedural checks'],
 ['9003-stabilized-pulverization','Periodically as necessary'],
 ['9003-stabilized-strength','As required'],
 ['9003-stabilized-moisture','1 set of 2 tests / 500 m²'],
 ['9003-stabilized-density','1 set of 2 tests / 500 m²'],
 ['9003-stabilized-deleterious','As required'],
 ['9003-wbm-aiv','1 test / 1,000 m³ of aggregate'],
 ['9003-wbm-grading','1 test / 250 m³'],
 ['9003-wbm-shape','1 test / 500 m³ of aggregate'],
 ['9003-wbm-binding-atterberg','1 test / 50 m³ of binding material'],
 ['9003-wbm-screening-atterberg','1 test / 100 m³ of aggregate'],
 ['9003-wmm-aiv','1 test / 1,000 m³ of aggregate'],
 ['9003-wmm-grading','1 test / 200 m³ of aggregate'],
 ['9003-wmm-shape','1 test / 500 m³ of aggregate'],
 ['9003-wmm-atterberg','1 test / 200 m³ of aggregate'],
 ['9003-wmm-density','1 set of 3 tests / 1,000 m²'],
 ['9004-prime-spread','3 tests / day'],
 ['9004-prime-quality','Samples per lot and tests per applicable IS 73 / 217 / 8887'],
 ['9004-prime-temperature','At regular close intervals'],
 ['9004-seal-impact','1 test / 200 m³ each source; on quality change'],
 ['9004-seal-shape','1 test / 100 m³ aggregate per source; on quality change'],
 ['9004-seal-grading','2 tests / day'],
 ['9004-premix-binder','2 tests / day / plant'],
 ['9004-bm-shape','1 test / 350 m³ for each source'],
 ['9004-bm-density','1 test / 700 m²'],
 ['9004-dbm-aiv','1 test / 350 m³ of aggregate for each source; retest on quality change'],
 ['9004-dbm-shape','1 test / 350 m³ of aggregate for each source; retest on quality change'],
 ['9004-dbm-gradation','1 set / 400 tonnes of mix; minimum 2 tests / day / plant'],
 ['9004-dbm-stability','3 tests / 400 tonnes of mix; minimum 2 tests / day / plant'],
 ['9004-dbm-binder','1 set / 400 tonnes of mix; minimum 2 tests / day / plant'],
 ['9004-dbm-spread','After every 5th truckload'],
 ['9004-dbm-density','1 test / 700 m²'],

 ['9004-micro-emulsion','1 test / 20-tonne lot as per IS 8887'],
 ['9004-micro-moisture','2 tests / day'],
 ['9004-micro-grading','2 tests / day'],
 ['9004-micro-binder','2 tests / lane / km'],
 ['9004-micro-calibration','Once per project'],
 ['9004-sma-impact','1 test / 100 m³ aggregate'],
 ['9004-sma-shape','1 test / 100 m³ aggregate'],
 ['9004-sma-density','1 test / 250 m²'],
 ['9004-sma-fractured','1 test / 50 m³ aggregate'],
 ['9004-sma-voids','3 tests / day'],
 ['9004-mastic-hardness','Minimum 2 tests / day'],
 ["9004-seal-stripping","1 per source; repeat when aggregate quality changes"],
 ["9004-seal-absorption","1 per source; repeat when aggregate quality changes"],
 ["9004-seal-water-sensitivity","1 per source; repeat when aggregate quality changes"],
 ["9004-seal-soundness","1 per source; repeat when aggregate quality changes"],
 ["9004-seal-polished","1 per source; repeat when aggregate quality changes"],
 ["9004-seal-temperature","At regular intervals"],
 ["9004-seal-fractured","1 test / 100 m³ of aggregate"],
 ["9004-dbm-quality","Samples per lot and applicable IS 73 / IRC SP 53 / IS 15462 tests"],
 ["9004-dbm-soundness","1 per source; repeat when aggregate quality changes"],
 ["9004-dbm-absorption","1 per source; repeat when aggregate quality changes"],
 ["9004-dbm-sand-equivalent","1 per source; repeat when aggregate quality changes"],
 ["9004-dbm-plasticity","1 per source; repeat when aggregate quality changes"],
 ["9004-dbm-polished","1 per source; repeat when aggregate quality changes"],
 ["9004-dbm-fractured","1 test / 350 m³ of aggregate"],
 ["9004-dbm-moisture-susceptibility","1 per mix type when coarse/fine aggregate source or quality changes"],
 ["9004-dbm-temperature","At regular intervals"],
 ["9004-micro-sand-equivalent","1 per source / site"],
 ["9004-micro-absorption","1 per source / site"],
 ["9004-micro-soundness","1 per source / site"],
 ["9004-micro-slurry-quantity","Daily (machine travel-time basis)"],
 ["9004-sma-quality","Samples per lot and applicable IS 73 / IRC SP 53 / IS 15462 tests"],
 ["9004-sma-soundness","1 per test method per source; retest on quality change"],
 ["9004-sma-absorption","1 per source; repeat when aggregate quality changes"],
 ["9004-sma-sand-equivalent","1 test / source"],
 ["9004-sma-plasticity","1 test / source"],
 ["9004-sma-polished","1 test / source"],
 ["9004-sma-gradation","1 set / 400 tonnes of mix; minimum 2 tests / day / plant"],
 ["9004-sma-moisture-susceptibility","1 per mix type when coarse/fine aggregate source or quality changes"],
 ["9004-sma-temperature","At regular intervals"],
 ["9004-sma-binder","1 set / 400 tonnes of mix; minimum 2 tests / day / plant"],
 ["9004-sma-spread","After every 5th truckload"],
];
const inUI=[...qc.matchAll(/<tr data-qc-id="([^"]+)">([\s\S]*?)<\/tr>/g)];
assert.equal(inUI.length,checks.length,'Unexpected source-frequency table row count');
assert.equal(new Set(inUI.map(v=>v[1])).size,checks.length,'Duplicate frequency identifier');
for(const [id,frequency] of checks){
 const row=inUI.find(v=>v[1]===id);
 assert.ok(row,'Missing source-control row '+id);
 const cells=[...row[2].matchAll(/<td>([^<]*)<\/td>/g)].map(m=>m[1]);
 assert.equal(cells.length,3,'Expected work, test, and frequency: '+id);
 assert.equal(cells[2],frequency,'Frequency changed: '+id);
}
assert.ok(qc.includes('id="morth9003"')&&qc.includes('id="morth9004"'),'Both tables required');
assert.ok(qc.includes('id="morth9032"'),'Earthwork QC reference missing');
assert.ok(qc.includes('id="morth9035DLC"'),'DLC sampling QC reference missing');
assert.ok(qc.includes('id="morth9006"'),'PQC supplementary-control view missing');
assert.ok(!qc.includes('<td>Source QC control</td>'),'Generic placeholder labels returned in PQC test entries');
assert.ok(qc.includes('<td>Workability / slump test</td>')&&qc.includes('<td>Water absorption</td>'),'PQC test names missing');
assert.ok(qc.includes('specimen counts are excluded'),'PQC source discrepancy safeguard missing');
for(const p of ['id="pqcSamplingHold"','903.5.2.1','903.5.2.2','Table 900-6','ENGINEER REVIEW / NO AUTO COUNT'])
 assert.ok(qc.includes(p),'PQC specimen-sampling hold missing: '+p);
for(const phrase of ['each source at every 3,000 m³','All density sets apply to each layer','Double the number of density measurements','randomly selected test locations'])
 assert.ok(qc.includes(phrase),'Sampling safeguard missing: '+phrase);
assert.ok(qc.includes('overflow-x:auto'),'Mobile horizontal table access was removed');
assert.ok(qc.includes('@media (max-width:600px)')&&qc.includes('content:"Minimum: "'),'Mobile stacked frequency labels removed');
assert.ok(qc.includes('not an exhaustive QC plan'),'Selected-list caution missing');
assert.ok(qc.includes('contract amendments')||qc.includes('Contract amendments'),'Contract caution missing');
assert.ok(qc.includes('No automatic pass/fail'),'No-auto-approval caution missing');
for(const v of ['id="cbrMethodConflict"','Table 400-2','903.2.1','IS 2720 Part 5','Part 16'])
 assert.ok(qc.includes(v),'CBR source-method conflict warning missing: '+v);
assert.ok(qc.includes('id="matGrid"'),'Other QC references lost');
for(const f of ['morth-qc-2610.js','morth-qc-2700.js','morth-qc-2800.js',
                'morth-qc-2900.js','morth-qc-3000.js','morth-qc-3100.js','morth-qc-100-300.js'])
 assert.ok(qc.includes('src="./'+f+'"'),'Existing QC module removed: '+f);
const sw=fs.readFileSync('sw.js','utf8');
assert.ok(sw.includes("'./qc.html'"),'QC page not in offline PWA shell');
assert.ok(sw.includes("pwd-tools-steel-v66-morth-qc-9006-ui-2026-10-27"),'Offline cache version not bumped for updated QC page');
console.log('MoRTH Section 900 QC PASS: 107 independent source-frequency fixtures, source cautions, offline link, 7 legacy QC modules retained.');
