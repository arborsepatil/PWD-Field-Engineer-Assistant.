/* PWD SSR local XLSX reader. Never uploads a source workbook or publishes rates.
 * Target: original 'SSR 2022-23' worksheet with columns A-I.
 * Uses browser ZIP inflate support; no third-party parser or network request.
 */
(function(root){
'use strict';
const MAX_FILE=20*1024*1024,MAX_XML=30*1024*1024,MAX_ITEMS=15000;
function decodeXml(s){
 return String(s||'').replace(/&#(x[0-9a-f]+|[0-9]+);|&(amp|lt|gt|quot|apos);/gi,(m,num,name)=>{
  if(num){const cp=num[0].toLowerCase()==='x'?parseInt(num.slice(1),16):parseInt(num,10);return Number.isFinite(cp)&&cp>=0&&cp<=0x10ffff?String.fromCodePoint(cp):m;}
  return ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"})[name.toLowerCase()]||m;
 }).replace(/_x000D_/gi,'\r');
}
function attr(s,name){const pattern=new RegExp('(?:^|\\s)'+name.replace(':','\\:')+'="([^"]*)"');const m=String(s).match(pattern);return m?decodeXml(m[1]):'';}
function innerText(xml){const out=[];const re=/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g;for(let m;(m=re.exec(xml));)out.push(decodeXml(m[1]));return out.join('');}
function parseStrings(xml){const a=[];const re=/<si(?:\s[^>]*)?>([\s\S]*?)<\/si>/g;for(let m;(m=re.exec(xml));)a.push(innerText(m[1]));return a;}
function parseSheet(xml,strings){
 const rows=[];const r=/<row\b([^>]*)>([\s\S]*?)<\/row>/g;
 for(let m;(m=r.exec(xml));){
  const row={},cells=/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;let c;
  while((c=cells.exec(m[2]))){
   const column=(attr(c[1],'r').match(/^[A-Z]+/)||[])[0];if(!column||column.length>2)continue;
   const type=attr(c[1],'t'),raw=c[2]||'',v=raw.match(/<v>([\s\S]*?)<\/v>/);
   let value=type==='inlineStr'?innerText(raw):v?decodeXml(v[1]):'';
   if(type==='s'){const n=Number(value);value=Number.isSafeInteger(n)&&n>=0?strings[n]||'':'';}
   row[column]=String(value).trim();
  }
  rows.push({number:Number(attr(m[1],'r'))||rows.length+1,cells:row});
  if(rows.length>30000)throw Error('Worksheet contains too many rows');
 }
 return rows;
}
async function readZip(buffer){
 const bytes=new Uint8Array(buffer),dv=new DataView(buffer);
 if(bytes.length>MAX_FILE)throw Error('Workbook exceeds the 20 MB local import limit.');
 let end=-1;
 for(let p=bytes.length-22;p>=Math.max(0,bytes.length-65557);p--){
  if(dv.getUint32(p,true)===0x06054b50){end=p;break;}
 }
 if(end<0)throw Error('This is not a supported XLSX/ZIP file.');
 const count=dv.getUint16(end+10,true),directory=dv.getUint32(end+16,true),entries=new Map();
 if(count>5000)throw Error('Too many workbook parts.');
 let p=directory;
 for(let i=0;i<count;i++){
  if(p+46>bytes.length||dv.getUint32(p,true)!==0x02014b50)throw Error('Corrupt XLSX directory');
  const flags=dv.getUint16(p+8,true),method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true),usize=dv.getUint32(p+24,true);
  const n=dv.getUint16(p+28,true),extra=dv.getUint16(p+30,true),comment=dv.getUint16(p+32,true),offset=dv.getUint32(p+42,true);
  const name=new TextDecoder().decode(bytes.subarray(p+46,p+46+n)).replace(/\\/g,'/');
  if(name.includes('..')||name.startsWith('/'))throw Error('Unsafe workbook entry path');
  entries.set(name,{flags,method,csize,usize,offset});
  p+=46+n+extra+comment;
 }
 async function get(name){
  const e=entries.get(name);if(!e)return null;
  if(e.usize>MAX_XML||e.csize>MAX_XML)throw Error('Workbook XML part too large');
  const start=e.offset;
  if(start+30>bytes.length||dv.getUint32(start,true)!==0x04034b50)throw Error('Corrupt XLSX entry');
  const dataAt=start+30+dv.getUint16(start+26,true)+dv.getUint16(start+28,true);
  if(dataAt+e.csize>bytes.length)throw Error('Truncated XLSX entry');
  let data=bytes.subarray(dataAt,dataAt+e.csize);
  if(e.method===8){
   if(typeof DecompressionStream!=='function')throw Error('This device needs an updated Android WebView to import XLSX.');
   const stream=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
   data=new Uint8Array(await new Response(stream).arrayBuffer());
  }else if(e.method!==0)throw Error('Unsupported XLSX compression');
  if(data.length!==e.usize||data.length>MAX_XML)throw Error('Workbook XML part is incomplete');
  return new TextDecoder().decode(data);
 }
 return {get};
}
function itemCode(v){
 const s=String(v||'').trim();
 // Some Excel numeric rows are stored as 54.32999999999996; limit only these
 // floating-point artifacts to three decimal places. Other printed IDs stay intact.
 if(/^\d+\.\d{7,}$/.test(s)&&/(?:9{5}|0{5})/.test(s)){
  return Number(s).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
 }
 return s;
}
function searchCode(v){
 const s=itemCode(v).toLowerCase();
 // Numeric Excel cells can omit a trailing zero (1.10 becomes 1.1).
 return /^\d+\.\d$/.test(s)?s+'0':s;
}
function normalize(rows,name){
 const header=rows.find(r=>r.cells.C&&/SSR\s*Item\s*No/i.test(r.cells.C));
 if(!header||!/Description\s+of\s+the\s+item/i.test(header.cells.E||''))throw Error('Original SSR item headings not found. Use the SSR 2022-23 master XLSX, not an estimate.');
 if(!/exclu(?:ding|ded)\s*GST/i.test(header.cells.H||''))throw Error('SSR completed-rate column header differs; verify this edition before import.');
 const edition=(rows[0]?.cells.A||name||'').match(/\b20\d{2}[-–](?:20)?\d{2}\b/);
 const year=edition?edition[0].replace('–','-'):'Unknown edition';
 const records=[],cats=new Map();let section='',subcategory='',parentCode='';
 for(const {number,cells:v} of rows){
  if(number<=header.number)continue;
  const a=String(v.A||'').trim();
  const division=a.match(/^SSR\s*2022-23\s*:\s*-\s*(.*)$/i);
  if(division){section=division[1].replace(/\s+/g,' ').trim();subcategory='';parentCode='';continue;}
  if(!section&&a&&!/^\d+$/.test(a)){section=a.replace(/\s+/g,' ').trim();}
  if(v.B)subcategory=v.B.replace(/\s+/g,' ').trim();
  const raw=itemCode(v.C),description=(v.E||'').replace(/\s+/g,' ').trim();
  const numbered=/^\d+$/.test(a);
  if(!numbered){
   // The official source uses no serial number for some parent descriptions,
   // then A=192, C=a/b/c for their independently priced sub-items.
   if(/^\d+(?:\.\d+)?(?:\.[a-z])?$/i.test(raw)&&description)parentCode=raw;
   continue;
  }
  if(!raw||!description||!section)continue;
  let code=raw;
  if(/^[a-z]$/i.test(raw)){if(parentCode)code=parentCode+' ('+raw+')';}
  else if(!/^\d/.test(raw)){code=raw;}
  const valid=/^\d[\w\s.()/-]*$/i.test(code)||/^[a-z]$/i.test(code);
  if(!valid)throw Error('Unrecognised SSR code at source row '+number);
  const numericRate=v.H!==''&&v.H!=null?Number(String(v.H).replace(/,/g,'')):null;
  const rate=Number.isFinite(numericRate)&&numericRate>=0?numericRate:null;
  const isDeleted=/^deleted\b/i.test(description);
  const item={code,codeSearch:searchCode(code),rawCode:raw,chapter:section,subcategory,description,unit:v.G||'',rate:isDeleted?null:rate,row:number,serial:a,deleted:isDeleted};
  records.push(item);cats.set(section,(cats.get(section)||0)+1);
  if(records.length>MAX_ITEMS)throw Error('SSR item limit exceeded');
 }
 if(records.length===0)throw Error('No SSR items in the selected sheet.');
 const frequency=new Map();
 for(const x of records){const key=x.chapter+'|'+x.code;frequency.set(key,(frequency.get(key)||0)+1);}
 for(const x of records)x.duplicateCode=(frequency.get(x.chapter+'|'+x.code)||0)>1;
 return {edition:year,sourceName:name||'Private workbook',sheet:'SSR 2022-23',records,categories:[...cats].map(([name,count])=>({name,count})),importedAt:new Date().toISOString(),rateBasis:'Completed rate excluding GST; historical source, not automatically current'};
}
function matching(items,query,chapter){
 const q=(query||'').trim().toLocaleLowerCase();
 const tokens=q.split(/\s+/).filter(Boolean);
 return items.filter(x=>(!chapter||x.chapter===chapter)&&tokens.every(t=>
  [x.code.toLowerCase(),x.codeSearch.toLowerCase(),x.description.toLocaleLowerCase(),x.chapter.toLocaleLowerCase(),(x.subcategory||'').toLocaleLowerCase(),x.unit.toLocaleLowerCase()]
   .some(v=>v.includes(t))));
}
async function fromXlsx(file){
 if(!file||!/\.xlsx$/i.test(file.name||''))throw Error('Choose the original .xlsx SSR workbook');
 if(file.size>MAX_FILE)throw Error('Workbook is too large');
 const zip=await readZip(await file.arrayBuffer());
 const book=await zip.get('xl/workbook.xml'),relationships=await zip.get('xl/_rels/workbook.xml.rels');
 if(!book||!relationships)throw Error('Required XLSX metadata missing');
 let rel='';
 const sheets=/<sheet\b([^>]*?)\/>/g;let m;
 while((m=sheets.exec(book))){
  if(attr(m[1],'name').trim()==='SSR 2022-23'){rel=attr(m[1],'r:id');break;}
 }
 if(!rel)throw Error("The workbook must contain the 'SSR 2022-23' worksheet");
 let target='';
 const links=/<Relationship\b([^>]*?)\/>/g;
 while((m=links.exec(relationships))){
  if(attr(m[1],'Id')===rel){target=attr(m[1],'Target');break;}
 }
 if(!target)throw Error('SSR worksheet reference missing');
 const clean=target.startsWith('/')?target.slice(1):'xl/'+target.replace(/^\.\//,'');
 const xml=await zip.get(clean);
 if(!xml)throw Error('SSR worksheet not found');
 const shared=await zip.get('xl/sharedStrings.xml');
 const records=normalize(parseSheet(xml,shared?parseStrings(shared):[]),file.name);
 if(records.edition!=='2022-23')throw Error('Expected SSR 2022-23 edition; imported workbook header identifies '+records.edition);
 return records;
}
function matching(items,query,chapter){
 const q=(query||'').trim().toLocaleLowerCase();
 const tokens=q.split(/\s+/).filter(Boolean);
 return items.filter(x=>(!chapter||x.chapter===chapter)&&tokens.every(t=>
  [x.code.toLowerCase(),x.codeSearch.toLowerCase(),x.description.toLocaleLowerCase(),x.chapter.toLocaleLowerCase(),x.unit.toLocaleLowerCase()]
   .some(v=>v.includes(t))));
}
root.PWDSSR={fromXlsx,normalize,parseSheet,parseStrings,matching,searchCode};
})(typeof window!=='undefined'?window:globalThis);
