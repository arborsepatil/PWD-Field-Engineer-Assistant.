/* Steel Table V1 — small curated, source-attributed OFFLINE manufacturer reference.
 * Published manufacturer's numerical values are NOT represented as direct BIS
 * table transcriptions or as verified to the latest amendments.
 * BIS IS 808:2021 identifies relevant hot-rolled sections. IS 2062
 * (Part 1):2025 is a material specification, not section dimension data.
 * All catalogue rows cite an actual SAIL brochure by URL and vintage.
 */
(function(root){
'use strict';
const SOURCES=Object.freeze({
 sail2023:Object.freeze({label:'SAIL · Product Range brochure (2023)',date:'2023-09',url:'https://sail.co.in/sites/default/files/product-brochure/2023-09/PFS-Brochure.pdf',note:'Manufacturer-published mass/overall dimensions. Do not assume conformity of delivered material without inspection/MTC.'}),
 sailProps2023:Object.freeze({label:'SAIL · Structurals / Tapered Flange (2023)',date:'2023-10',url:'https://www.sail.co.in/sites/default/files/product-brochure/2023-10/PFS-Brochure_New-2023.pdf',note:'Manufacturer-published section properties for specific MB sizes; 2023 product data, not a replacement for the current BIS text.'}),
 sail2020:Object.freeze({label:'SAIL · Structural Steel Sections, DSP archive (2020)',date:'2020-03',url:'https://www.sail.co.in/sites/default/files/product-brochure/2020-03/Structurals.pdf',note:'Archived manufacturer reference; CURRENT IS 808:2021 row and procurement availability have NOT been cross-verified.'})
});
const beam=(designation,depthMm,widthMm,kgPerM,extra={})=>({id:designation.replaceAll(' ',''),family:'beam',designation,depthMm,widthMm,kgPerM,sourceId:'sail2023',basis:'manufacturer-published',standard:'IS 808:2021 (standard applicability only)',...extra});
const channel=(designation,depthMm,widthMm,kgPerM)=>({id:designation.replaceAll(' ',''),family:'channel',designation,depthMm,widthMm,kgPerM,sourceId:'sail2023',basis:'manufacturer-published',standard:'IS 808:2021 (standard applicability only)'});
const angle=(legMm,thickMm,kgPerM,sourceId='sail2020')=>({id:'ISA'+legMm+'x'+legMm+'x'+thickMm,family:'angle',designation:'ISA '+legMm+'×'+legMm+'×'+thickMm,depthMm:legMm,widthMm:legMm,thicknessMm:thickMm,kgPerM,sourceId,basis:sourceId==='sail2020'?'archived-manufacturer-only':'manufacturer-published',standard:'IS 808:2021 (standard applicability only)'});
const rows=[
 beam('ISMB 100',100,50,8.95,{areaCm2:11.4,ixCm4:182,iyCm4:12.5,zxCm3:36.4,zyCm3:5.01,webMm:4.7,flangeMm:7,flangeSlopeDeg:98,rootRadiusMm:9,toeRadiusMm:4.5,sourceId:'sailProps2023'}),
 beam('ISMB 150',150,75,14.96,{areaCm2:19.0,ixCm4:718,iyCm4:46.7,zxCm3:95.7,zyCm3:12.4,webMm:5,flangeMm:8,flangeSlopeDeg:98,rootRadiusMm:9,toeRadiusMm:4.5,sourceId:'sailProps2023'}),
 beam('ISMB 200',200,100,24.17,{areaCm2:30.8,ixCm4:2110,iyCm4:136,zxCm3:211,zyCm3:27.3,webMm:5.7,flangeMm:10,flangeSlopeDeg:98,rootRadiusMm:11,toeRadiusMm:5.5,sourceId:'sailProps2023'}),
 beam('ISMB 250',250,125,37.30,{areaCm2:47.5,ixCm4:5130,iyCm4:334,zxCm3:410,zyCm3:53.5,webMm:6.9,flangeMm:12.5,flangeSlopeDeg:98,rootRadiusMm:13,toeRadiusMm:6.5,sourceId:'sailProps2023'}),
 beam('ISMB 300',300,140,46.02,{areaCm2:58.6,ixCm4:8990,iyCm4:486,zxCm3:599,zyCm3:69.4,webMm:7.7,flangeMm:13.1,flangeSlopeDeg:98,rootRadiusMm:14,toeRadiusMm:7,sourceId:'sailProps2023'}),
 channel('ISMC 75',75,40,7.14),
 channel('ISMC 100',100,50,9.56),
 channel('ISMC 125',125,65,13.10),
 channel('ISMC 150',150,75,16.80),
 channel('ISMC 200',200,75,22.30),
 channel('ISMC 250',250,82,34.20),
 angle(90,6,8.32,'sail2023'),angle(90,8,10.92,'sail2023'),
 angle(100,6,9.26,'sail2023'),angle(100,8,12.18,'sail2023'),
 angle(110,8,13.4),angle(130,10,19.7),
 angle(150,10,22.93,'sail2023'),angle(200,12,36.85,'sail2023')
].map(row=>Object.freeze(row));
const sections=Object.freeze(rows);
const categories=Object.freeze([
 Object.freeze({id:'beam',label:'Beams',description:'SAIL-published Indian medium beams'}),
 Object.freeze({id:'channel',label:'Channels',description:'SAIL-published Indian medium channels'}),
 Object.freeze({id:'angle',label:'Angles',description:'2023 SAIL weights where available; unmatched sizes kept as 2020 archive'}),
 Object.freeze({id:'calculated',label:'Plates & bars',description:'User-dimensioned geometric mass, not a BIS section row'})
]);
const codeReferences=Object.freeze([
 Object.freeze({standard:'IS 808:2021',title:'Hot-rolled beams, columns, channels and angles — dimensions and properties',uri:'https://services.bis.gov.in/tmp/tbl5_2024-11-11-05-24.pdf',scope:'Standard exists and applies to section types; manufacturer rows require source/date check.'}),
 Object.freeze({standard:'IS 2062 (Part 1):2025',title:'Structural steel material specification',uri:'https://standards.bis.gov.in/',scope:'Material grade control (not used as an IS 808 geometric properties table).'})
]);
function search(q,family='all'){
 const needle=String(q||'').trim().toLowerCase().replace(/\s+/g,'');
 return sections.filter(x=>(family==='all'||x.family===family)&&
  (!needle||(x.designation+x.id+x.family).toLowerCase().replace(/\s+/g,'').includes(needle)));
}
function byId(id){return sections.find(x=>x.id===id)||null;}
const api=Object.freeze({SOURCES,sections,categories,codeReferences,search,byId});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelCatalog=api;
})(typeof window!=='undefined'?window:globalThis);