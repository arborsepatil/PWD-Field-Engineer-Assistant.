/* Regression anchors independently compared with the user's MoRTH 2013
 * Fifth Revision source text on 2026-10-27. Protects transcribed values;
 * NOT a test of full specification accuracy or engineering certification.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const reader=fs.readFileSync(path.join(process.cwd(),'morth_reader.html'),'utf8');
function recordBlock(variable){
  const anchor='const '+variable+'=RECORDS.find(';
  const start=reader.indexOf(anchor);
  assert.ok(start>=0,'Missing '+variable+' source record');
  const next=reader.indexOf('\nconst ',start+anchor.length);
  return reader.slice(start,next>=0?next:reader.length);
}
function tableBlock(block,name){
  const start=block.indexOf("name:'"+name+"',");
  assert.ok(start>=0,'Missing table '+name);
  const next=block.indexOf('\n{name:',start+6);
  const end=next>=0?next:block.indexOf('\n];',start);
  assert.ok(end>start,'Unterminated table '+name);
  return block.slice(start,end);
}
function checkRows(variable,tableName,rows){
  const data=tableBlock(recordBlock(variable),tableName);
  for(const row of rows){
    const literal='['+row.map(v=>"'"+v+"'").join(',')+']';
    assert.ok(data.includes(literal),tableName+' mismatch: '+literal);
  }
  return rows.length;
}
let checked=0;
checked+=checkRows('gsb','Table 400-1 · Grading for Granular Sub-base Materials',[
 ['75.0 mm','100','—','—','—','100','—'],
 ['53.0 mm','80–100','100','100','100','80–100','100'],
 ['26.5 mm','55–90','70–100','55–75','50–80','55–90','75–100'],
 ['9.50 mm','35–65','50–80','—','—','35–65','55–75'],
 ['4.75 mm','25–55','40–65','10–30','15–35','25–50','30–55'],
 ['2.36 mm','20–40','30–50','—','—','10–20','10–25'],
 ['0.85 mm','—','—','—','—','2–10','—'],
 ['0.425 mm','10–15','10–15','—','—','0–5','0–8'],
 ['0.075 mm','<5','<5','<5','<5','—','0–3']
]);
checked+=checkRows('wmm','Table 400-13 · Grading Requirements of Aggregates for WMM',[
 ['53.0 mm','100','—'],
 ['45.0 mm','95–100','—'],
 ['26.5 mm','—','No specified passing range in the table'],
 ['22.4 mm','60–80','—'],
 ['11.2 mm','40–60','—'],
 ['4.75 mm','25–40','—'],
 ['2.36 mm','15–30','—'],
 ['600 micron','8–22','—'],
 ['75 micron','0–5','Material finer than 425 micron: PI ≤ 6']
]);
checked+=checkRows('bc','Table 500-17 · Composition of Bituminous Concrete Pavement Layers',[
 ['Nominal aggregate size','19 mm','13.2 mm'],
 ['Layer thickness','50 mm','30–40 mm'],
 ['26.5 mm','100','—'],
 ['19 mm','90–100','100'],
 ['13.2 mm','59–79','90–100'],
 ['9.5 mm','52–72','70–88'],
 ['4.75 mm','35–55','53–71'],
 ['2.36 mm','28–44','42–58'],
 ['1.18 mm','20–34','34–48'],
 ['0.6 mm','15–27','26–38'],
 ['0.3 mm','10–20','18–28'],
 ['0.15 mm','5–13','12–20'],
 ['0.075 mm','2–8','4–10'],
 ['Minimum bitumen by mass of total mix','5.2%','5.4%']
]);
checked+=checkRows('premix','Table 500-19 · Aggregate Gradation for Close-Graded Premix Surfacing',[
 ['13.2 mm','—','100'],
 ['11.2 mm','100','88–100'],
 ['5.6 mm','52–88','31–52'],
 ['2.8 mm','14–38','5–25'],
 ['0.090 mm','0–5','0–5']
]);
const gsb=recordBlock('gsb'),wmm=recordBlock('wmm'),
      bc=recordBlock('bc'),premix=recordBlock('premix');
for(const v of ['AIV ≤ 40','Liquid Limit ≤ 25','Plasticity Index ≤ 6','minimum 30'])
  assert.ok(gsb.includes(v),'GSB 400-2 reference control changed: '+v);
for(const v of ['40% max','30% max','35% max','PI ≤ 6','98% of MDD'])
  assert.ok(wmm.includes(v),'WMM source control changed: '+v);
for(const v of ['92%','±0.3%','±1.5%','ASTM D2041'])
  assert.ok(bc.includes(v),'BC production control changed: '+v);
assert.ok(premix.includes("name:'Clause 508.2.5 · Proportioning Statements',status:'pending'"),
          '508.2.5 anomaly must remain pending');
for(const v of ['22.0 kg per 10 m²','19.0 kg per 10 m²',
                '0.27 m³ per square metre area','RECONCILIATION REQUIRED',
                'No 508 material-quantity calculator is enabled'])
  assert.ok(premix.includes(v),'508.2.5 source hold lost: '+v);
assert.equal(checked,37,'Unexpected change to manually compared matrix rows');
console.log('MoRTH selected-source regression PASS: '+checked+
  ' matrix rows (400-1, 400-13, 500-17, 500-19); key QC values; 508.2.5 HOLD.');
