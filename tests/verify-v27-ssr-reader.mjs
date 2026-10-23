/** V27: ZIP/XLSX import, SSR row normalization and private original separation. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {deflateRawSync} from 'node:zlib';
const root=path.resolve(import.meta.dirname,'..');
await import('../ssr-local-core.js');
const SSR=globalThis.PWDSSR;
assert.ok(SSR?.fromXlsx,'SSR local parser missing');
function fixtureZip(contents){
 const local=[],central=[];let position=0;
 for(const [name,xml] of Object.entries(contents)){
  const nameBytes=Buffer.from(name,'utf8'),payload=Buffer.from(xml,'utf8'),data=deflateRawSync(payload);
  const head=Buffer.alloc(30);
  head.writeUInt32LE(0x04034b50,0);head.writeUInt16LE(20,4);head.writeUInt16LE(8,8);
  head.writeUInt32LE(data.length,18);head.writeUInt32LE(payload.length,22);head.writeUInt16LE(nameBytes.length,26);
  local.push(head,nameBytes,data);
  const dir=Buffer.alloc(46);
  dir.writeUInt32LE(0x02014b50,0);dir.writeUInt16LE(20,4);dir.writeUInt16LE(20,6);
  dir.writeUInt16LE(8,10);dir.writeUInt32LE(data.length,20);dir.writeUInt32LE(payload.length,24);
  dir.writeUInt16LE(nameBytes.length,28);dir.writeUInt32LE(position,42);
  central.push(dir,nameBytes);
  position+=head.length+nameBytes.length+data.length;
 }
 const directory=Buffer.concat(central),end=Buffer.alloc(22);
 end.writeUInt32LE(0x06054b50,0);
 end.writeUInt16LE(Object.keys(contents).length,8);end.writeUInt16LE(Object.keys(contents).length,10);
 end.writeUInt32LE(directory.length,12);end.writeUInt32LE(position,16);
 return Buffer.concat([...local,directory,end]);
}
const workbook='<workbook><sheets><sheet name="Other" r:id="rId1" /><sheet name="SSR 2022-23" r:id="rId6" /></sheets></workbook>';
const rels='<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/><Relationship Id="rId6" Target="worksheets/sheet6.xml"/></Relationships>';
const sst='<sst><si><t>Road Survey and DPR</t></si><si><t>SSR Item No.</t></si><si><t>Description of the item</t></si><si><t>Completed Rate for 2022-23 excluding GST</t></si><si><t>Concrete work &amp; testing</t></si><si><t>Bituminous road work</t></si><si><t>Roads</t></si></sst>';
const xml='<worksheet><sheetData>'+
 '<row r="1"><c r="A1" t="inlineStr"><is><t>STATE SCHEDULE OF RATES 2022-23</t></is></c></row>'+
 '<row r="2"><c r="C2" t="s"><v>1</v></c><c r="E2" t="s"><v>2</v></c><c r="H2" t="s"><v>3</v></c></row>'+
 '<row r="3"><c r="B3" t="s"><v>0</v></c><c r="C3"><v>1.1</v></c><c r="E3" t="s"><v>4</v></c><c r="G3" t="inlineStr"><is><t>One Number</t></is></c><c r="H3"><v>189</v></c></row>'+
 '<row r="4"><c r="B4" t="s"><v>0</v></c><c r="C4" t="inlineStr"><is><t>1.11a</t></is></c><c r="E4" t="inlineStr"><is><t>Taking &amp; noting samples</t></is></c><c r="G4" t="inlineStr"><is><t>One Cubic Metre</t></is></c><c r="H4"><v>482</v></c></row>'+
 '<row r="5"><c r="B5" t="s"><v>6</v></c><c r="C5"><v>2.01</v></c><c r="E5" t="s"><v>5</v></c><c r="H5"><v>99</v></c></row>'+
 '</sheetData></worksheet>';
const zip=fixtureZip({
 'xl/workbook.xml':workbook,
 'xl/_rels/workbook.xml.rels':rels,
 'xl/sharedStrings.xml':sst,
 'xl/worksheets/sheet6.xml':xml
});
const f={name:'SSR_2022-23.xlsx',size:zip.length,async arrayBuffer(){return zip.buffer.slice(zip.byteOffset,zip.byteOffset+zip.byteLength)}};
const index=await SSR.fromXlsx(f);
assert.equal(index.edition,'2022-23');
assert.equal(index.records.length,3);
assert.equal(index.categories.length,2);
assert.equal(index.records[0].rate,189);
assert.equal(index.records[0].description,'Concrete work & testing');
assert.equal(index.records[1].description,'Taking & noting samples');
assert.equal(index.records[0].codeSearch,'1.10','Numeric Excel value needs a 1.10 search alias');
assert.equal(SSR.matching(index.records,'1.10','').length,1);
assert.equal(SSR.matching(index.records,'road','Roads').length,1);
assert.equal(SSR.matching(index.records,'concrete','Roads').length,0);
const bad=zip.subarray(0,120);
await assert.rejects(()=>SSR.fromXlsx({...f,size:bad.length,async arrayBuffer(){return bad.buffer.slice(bad.byteOffset,bad.byteOffset+bad.byteLength)}}),/not a supported XLSX/);
const noRate=SSR.normalize(SSR.parseSheet(xml.replace('excluding GST','including GST'),SSR.parseStrings(sst)),'SSR_2022-23.xlsx');
assert.ok(noRate.records.length>0,'Fixture record parse unexpectedly empty');
// Validate non-applicability, private storage and routing in actual app screen.
const html=fs.readFileSync(path.join(root,'ssr_search.html'),'utf8');
const library=fs.readFileSync(path.join(root,'library.html'),'utf8');
const cache=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(html.includes('Historical SSR 2022–23')&&html.includes('Rates exclude GST'),'Essential edition warning missing');
assert.ok(html.includes('indexedDB.open(DB_NAME,1)')&&html.includes('privateAccess')&&html.includes('store.put(candidate,KEY)'),'Private offline SSR storage missing');
for(const id of ['xlsxFile','itemSearch','chapterFilter','itemResults','showMore','status','removeBtn'])assert.ok(html.includes('id="'+id+'"'),'SSR screen missing '+id);
assert.ok(html.includes('PWDSSR.fromXlsx(file)')&&html.includes('PWDSSR.matching'),'SSR reader not wired to actual importer and search');
assert.ok(library.includes('href="./ssr_search.html"')&&library.includes("get('digitalSSR').hidden=section!=='ssr'"),'SSR digital entry must appear within the SSR Library tab');
assert.ok(cache.includes('./ssr_search.html')&&cache.includes('./ssr-local-core.js'),'New reader/parser must work offline');
assert.ok(!cache.includes('.xlsx'),'Private workbook must not be shipped in PWA assets');
assert.ok(html.includes('Original SSR PDFs')&&html.includes('library.html?section=ssr'),'Original source PDFs must remain available');
console.log('V27 PASS: deflate-raw XLSX import, 3 source-pattern items, 2 chapters, rates, numeric-search alias, offline/privacy boundaries.');
