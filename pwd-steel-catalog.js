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
 secondary808:Object.freeze({label:'2021 steel section table · secondary index',date:'IS 808:2021 (secondary website)',url:'https://quickboq.in/steel/',note:'Selected numbers independently transcribed from a public secondary index. Not independently certified against a current authorized BIS publication; verify before design/acceptance.'}),
 sail2020:Object.freeze({label:'SAIL · Structural Steel Sections, DSP archive (2020)',date:'2020-03',url:'https://www.sail.co.in/sites/default/files/product-brochure/2020-03/Structurals.pdf',note:'Archived manufacturer reference; CURRENT IS 808:2021 row and procurement availability have NOT been cross-verified.'})
});
const beam=(designation,depthMm,widthMm,kgPerM,extra={})=>({id:designation.replaceAll(' ',''),family:'beam',designation,depthMm,widthMm,kgPerM,sourceId:'sail2023',basis:'manufacturer-published',standard:'IS 808:2021 (standard applicability only)',...extra});
const channel=(designation,depthMm,widthMm,kgPerM)=>({id:designation.replaceAll(' ',''),family:'channel',designation,depthMm,widthMm,kgPerM,sourceId:'sail2023',basis:'manufacturer-published',standard:'IS 808:2021 (standard applicability only)'});
const angle=(legMm,thickMm,kgPerM)=>({id:'ISA'+legMm+'x'+legMm+'x'+thickMm,family:'angle',designation:'ISA '+legMm+'×'+legMm+'×'+thickMm,depthMm:legMm,widthMm:legMm,thicknessMm:thickMm,kgPerM,sourceId:'sail2020',basis:'archived-manufacturer-only',standard:'IS 808:2021 row not yet cross-checked'});
const rows=[
 beam('ISMB 100',100,50,8.95,{areaCm2:11.4,ixCm4:182,iyCm4:12.5,zxCm3:36.4,zyCm3:5.01,webMm:4.7,flangeMm:7,sourceId:'sailProps2023'}),
 beam('ISMB 150',150,75,14.96,{areaCm2:19.0,ixCm4:718,iyCm4:46.7,zxCm3:95.7,zyCm3:12.4,webMm:5,flangeMm:8,sourceId:'sailProps2023'}),
 beam('ISMB 200',200,100,24.17),
 beam('ISMB 250',250,125,37.30,{areaCm2:47.5,ixCm4:5130,iyCm4:334,zxCm3:410,zyCm3:53.5,webMm:6.9,flangeMm:12.5,sourceId:'sailProps2023'}),
 beam('ISMB 300',300,140,46.02,{areaCm2:58.6,ixCm4:8990,iyCm4:486,zxCm3:599,zyCm3:69.4,webMm:7.7,flangeMm:13.1,sourceId:'sailProps2023'}),
 channel('ISMC 75',75,40,7.14),
 channel('ISMC 100',100,50,9.56),
 channel('ISMC 125',125,65,13.10),
 channel('ISMC 150',150,75,16.80),
 channel('ISMC 200',200,75,22.30),
 channel('ISMC 250',250,82,34.20),
 angle(90,6,8.2),angle(90,8,10.8),
 angle(100,6,9.2),angle(100,8,12.1),
 angle(110,8,13.4),angle(130,10,19.7),
 angle(150,10,22.9),angle(200,12,36.8)
].map(row=>Object.freeze(row));
// Small, explicitly reviewed INDEX rows (one or two per missing IS 808:2021
// classification); deliberately not a bulk copy of any third-party catalogue.
// Every number below has a dated, navigable secondary publication reference.
// Full BIS table-row verification and full sizes remain pending.
const reference=(series,designation,depthMm,widthMm,kgPerM,props,tableUrl,aliases=[])=>Object.freeze({
 id:'ref-'+series+'-'+designation.replace(/[^A-Za-z0-9]/g,'-')+'-'+kgPerM.toFixed(2),
 family:['SC','HB'].includes(series)?'column': ['JC','LC','MC','MPC'].includes(series)?'channel':series==='PBP'?'pile':['EQ','UE'].includes(series)?'angle':'beam',
 series,designation,depthMm,widthMm,kgPerM,...props,
 aliases,
 sourceId:'secondary808',sourceUrl:tableUrl,
 basis:'secondary-unverified',standard:'IS 808:2021 (secondary reference; BIS row not certified)'
});
const newRows=[
 reference('MB','MB 125',125,70,13.35,{areaCm2:17,webMm:5,flangeMm:8,ixCm4:445,zxCm3:71.3},
  'https://quickboq.in/steel/tables/medium-and-wide-flange-beams/',['ISMB 125']),
 reference('JB','JB 150',150,50,7.07,{areaCm2:9,webMm:3,flangeMm:4.6,ixCm4:321,zxCm3:42.8},
  'https://quickboq.in/steel/tables/light-and-junior-beams/',['ISJB 150']),
 reference('LB','LB 200',200,100,19.83,{areaCm2:25.2,webMm:5.4,flangeMm:7.3,ixCm4:1690,zxCm3:169},
  'https://quickboq.in/steel/tables/light-and-junior-beams/',['ISLB 200']),
 reference('WB','WB 150',150,100,17,{areaCm2:21.6,webMm:5.4,flangeMm:7,ixCm4:839,zxCm3:111},
  'https://quickboq.in/steel/tables/medium-and-wide-flange-beams/',['ISWB 150']),
 reference('NPB','NPB 100 × 55',100,55,8.1,{areaCm2:10.3,webMm:4.1,flangeMm:5.7,ixCm4:171,zxCm3:34.2},
  'https://quickboq.in/steel/tables/narrow-parallel-flange-beams/',['ISNPB 100x55']),
 reference('WPB','WPB 100 × 100 · 12.24 kg/m',91,100,12.24,{areaCm2:15.5,webMm:4.2,flangeMm:5.5,ixCm4:236,zxCm3:51.9},
  'https://quickboq.in/steel/tables/wide-parallel-flange-beams/',['ISWPB 100x100']),
 reference('SC','SC 100',100,100,19.97,{areaCm2:25.4,webMm:6,flangeMm:10,ixCm4:434,zxCm3:87},
  'https://quickboq.in/steel/tables/column-and-heavy-beams/',['ISSC 100']),
 reference('HB','HB 200',200,200,37.31,{areaCm2:47.5,webMm:6.1,flangeMm:9,ixCm4:3600,zxCm3:360},
  'https://quickboq.in/steel/tables/column-and-heavy-beams/',['ISHB 200']),
 reference('JC','JC 100',100,45,5.8,{areaCm2:7.41,webMm:3,flangeMm:5.1,ixCm4:123,zxCm3:24.8},
  'https://quickboq.in/steel/tables/sloping-flange-channels-lc-jc/',['ISJC 100']),
 reference('LC','LC 150',150,75,14.4,{areaCm2:18.3,webMm:4.8,flangeMm:7.8,ixCm4:697,zxCm3:93.1},
  'https://quickboq.in/steel/tables/sloping-flange-channels-lc-jc/',['ISLC 150']),
 reference('MPC','MPC 150',150,75,16.8,{areaCm2:21.3,webMm:5.7,flangeMm:9,ixCm4:792,zxCm3:105},
  'https://quickboq.in/steel/tables/parallel-flange-channels/',['ISMPC 150','ISMCP 150']),
 reference('EQ','∠ 50 × 50 × 5',50,50,3.79,{areaCm2:4.83,thicknessMm:5},
  'https://quickboq.in/steel/tables/equal-leg-angles/',['ISA 50x50x5','ISA 50×50×5']),
 reference('UE','∠ 100 × 50 × 8',100,50,9.05,{areaCm2:11.5,thicknessMm:8},
  'https://quickboq.in/steel/tables/supplementary-unequal-leg-angles/',['ISA 100x50x8','ISA 100×50×8']),
 reference('PBP','PBP 200 · 43.85 kg/m',200,205,43.85,{areaCm2:55.8,webMm:9.3,flangeMm:9.3,ixCm4:3990,zxCm3:399},
  'https://quickboq.in/steel/tables/parallel-flange-bearing-piles/',['ISPBP 200'])
];
const sections=Object.freeze([...rows,...newRows]);
const SERIES=Object.freeze([
 {id:'JB',family:'beam',label:'JB · Junior',legacy:'ISJB'},
 {id:'LB',family:'beam',label:'LB · Light',legacy:'ISLB'},
 {id:'MB',family:'beam',label:'MB · Medium',legacy:'ISMB'},
 {id:'WB',family:'beam',label:'WB · Wide',legacy:'ISWB'},
 {id:'NPB',family:'beam',label:'NPB · Narrow parallel',legacy:'ISNPB'},
 {id:'WPB',family:'beam',label:'WPB · Wide parallel',legacy:'ISWPB'},
 {id:'SC',family:'column',label:'SC · Column',legacy:'ISSC'},
 {id:'HB',family:'column',label:'HB · Heavy',legacy:'ISHB'},
 {id:'JC',family:'channel',label:'JC · Junior',legacy:'ISJC'},
 {id:'LC',family:'channel',label:'LC · Light',legacy:'ISLC'},
 {id:'MC',family:'channel',label:'MC · Medium',legacy:'ISMC'},
 {id:'MPC',family:'channel',label:'MPC · Parallel',legacy:'ISMPC / ISMCP'},
 {id:'EQ',family:'angle',label:'Equal angle · ISA',legacy:'ISA'},
 {id:'UE',family:'angle',label:'Unequal angle · ISA',legacy:'ISA'},
 {id:'PBP',family:'pile',label:'PBP · Bearing pile',legacy:'ISPBP'}
].map(x=>Object.freeze(x)));
const resolveSeries=row=>{
 if(row.series)return row.series;
 if(row.family==='angle')return 'EQ';
 if(row.family==='beam')return 'MB';
 if(row.family==='channel')return 'MC';
 return null;
};


const categories=Object.freeze([
 Object.freeze({id:'beam',label:'Beams',description:'JB, LB, MB, WB, NPB, WPB'}),
 Object.freeze({id:'column',label:'Columns',description:'SC and HB'}),
 Object.freeze({id:'channel',label:'Channels',description:'JC, LC, MC, MPC'}),
 Object.freeze({id:'angle',label:'Angles',description:'Equal and unequal legs'}),
 Object.freeze({id:'pile',label:'Bearing piles',description:'PBP profiles'}),
 Object.freeze({id:'calculated',label:'Plates & bars',description:'User-input theoretical mass only'})
]);
const codeReferences=Object.freeze([
 Object.freeze({standard:'IS 808:2021',title:'Hot-rolled beams, columns, channels and angles — dimensions and properties',uri:'https://services.bis.gov.in/tmp/tbl5_2024-11-11-05-24.pdf',scope:'Standard exists and applies to section types; manufacturer rows require source/date check.'}),
 Object.freeze({standard:'IS 2062 (Part 1):2025',title:'Structural steel material specification',uri:'https://standards.bis.gov.in/',scope:'Material grade control (not used as an IS 808 geometric properties table).'})
]);
function normalized(q){return String(q||'').toUpperCase().replace(/×/g,'X').replace(/[^A-Z0-9]/g,'');}
function search(q,family='all',series='all'){
 const term=normalized(q);
 // Prefix-only search must not confuse ISMC with the historical ISMCP
 // parallel-channel alias. ISA intentionally maps to both angle subseries.
 const prefixMatches=SERIES.filter(s=>normalized(s.legacy)===term||normalized(s.id)===term);
 const exactPrefix=prefixMatches.length===1?prefixMatches[0].id:null;
 return sections.filter(x=>{
  if(exactPrefix&&resolveSeries(x)!==exactPrefix)return false;
  if(family!=='all'&&x.family!==family)return false;
  if(series!=='all'&&resolveSeries(x)!==series)return false;
  if(!term)return true;
  const prefix=SERIES.find(s=>s.id===resolveSeries(x));
  // Historical prefixes (ISHB / ISMB etc.) and current designations
  // are searchable without manufacturing fictitious section rows.
  const keys=[x.designation,x.id,x.family,resolveSeries(x),
   ...(x.aliases||[])];
  if(prefix){
   keys.push(prefix.legacy,prefix.legacy+' '+x.designation.replace(/^[A-Z]+\s*/, ''));
  }
  return keys.some(k=>normalized(k).includes(term));
 });
}
function availableSeries(family){return SERIES.filter(s=>s.family===family);}
function byId(id){return sections.find(x=>x.id===id)||null;}
const api=Object.freeze({SOURCES,sections,categories,codeReferences,SERIES,resolveSeries,availableSeries,search,byId});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelCatalog=api;
})(typeof window!=='undefined'?window:globalThis);