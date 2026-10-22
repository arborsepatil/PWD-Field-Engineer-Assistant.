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
 sailStruct2023:Object.freeze({label:'SAIL · Structural Product Range',date:'2023-10',url:'https://www.sail.co.in/sites/default/files/product-brochure/2023-10/PFS-Brochure_New-2023.pdf',note:'SAIL manufacturer range; nominal stock availability and latest BIS row require separate confirmation.'}),
 tataLegacy:Object.freeze({label:'Tata Structura · Archived manufacturer brochure',date:'2015-era',url:'https://www.tatasteel.com/media/23759/tata-steel-structura-brochure.pdf',note:'Historical manufacturer section weight. Published BEFORE Amendment 3 (June 2024) to IS 4923:2017; NOT certified as current amended value.'}),
 rhsSecondary2024:Object.freeze({label:'RHS 2024 amended-table index (secondary)',date:'2024 amendment claimed; audited 2026-10',url:'https://quickboq.in/steel/tables/rectangular-hollow-sections/',note:'Secondary index claims updated IS 4923 Amendment 3 masses; official amended BIS row has not been independently reconciled.'}),
 osdag808:Object.freeze({label:'Osdag open section data · LGPL-3.0',date:'IS808_Rev · revision unverified',url:'https://github.com/osdag-admin/Osdag/blob/master/src/osdag/data/ResourceFiles/Database/Intg_osdag.sql',note:'Historic IS808_Rev open data; row-by-row alignment with current IS 808:2021 is not established.'}),
 osdagCHS:Object.freeze({label:'Osdag circular tubes · LGPL-3.0',date:'Source refers to IS 1161:2014',url:'https://github.com/osdag-admin/Osdag/blob/master/src/osdag/data/ResourceFiles/Database/Intg_osdag.sql',note:'Open database CHS. Mass and area must be checked against authorized IS 1161 rows.'}),
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

// Manufacturer-published nominal section weights. Keep historical disagreements
// as DISTINCT records rather than silently replacing an older reference.
// These are SHORT, reviewed product-range examples — not a reproduction of BIS.
// This is the manufacturer-listed product range, not the complete IS 808:
// unknown entries and ambiguous brochure cells are intentionally excluded.
const sailExtra=[
 channel('ISMC 300',300,90,36.30),
 channel('ISMC 400',400,100,50.10),
 {id:'sail23-ISA50x50x6',family:'angle',series:'EQ',designation:'ISA 50×50×6',depthMm:50,widthMm:50,thicknessMm:6,kgPerM:4.49},
 {id:'sail23-ISA60x60x6',family:'angle',series:'EQ',designation:'ISA 60×60×6',depthMm:60,widthMm:60,thicknessMm:6,kgPerM:5.40},
 {id:'sail23-ISA75x75x8',family:'angle',series:'EQ',designation:'ISA 75×75×8',depthMm:75,widthMm:75,thicknessMm:8,kgPerM:9.00},
 {id:'sail23-ISA80x80x8',family:'angle',series:'EQ',designation:'ISA 80×80×8',depthMm:80,widthMm:80,thicknessMm:8,kgPerM:9.65},
 {id:'sail23-ISA90x90x6',family:'angle',series:'EQ',designation:'ISA 90×90×6',depthMm:90,widthMm:90,thicknessMm:6,kgPerM:8.32},
 {id:'sail23-ISA100x100x6',family:'angle',series:'EQ',designation:'ISA 100×100×6',depthMm:100,widthMm:100,thicknessMm:6,kgPerM:9.26},
 {id:'sail23-ISA150x150x12',family:'angle',series:'EQ',designation:'ISA 150×150×12',depthMm:150,widthMm:150,thicknessMm:12,kgPerM:27.29},
 {id:'sail23-ISA200x200x16',family:'angle',series:'EQ',designation:'ISA 200×200×16',depthMm:200,widthMm:200,thicknessMm:16,kgPerM:48.53},
 // Explicit SAIL 2023 product-range masses. Retain earlier 2020 rows separately:
 // source conflicts are surfaced by collisionGroups(), never silently overwritten.
 {id:'sail23-ISA90x90x8',family:'angle',series:'EQ',designation:'ISA 90×90×8',depthMm:90,widthMm:90,thicknessMm:8,kgPerM:10.92},
 {id:'sail23-ISA100x100x8',family:'angle',series:'EQ',designation:'ISA 100×100×8',depthMm:100,widthMm:100,thicknessMm:8,kgPerM:12.18},
 {id:'sail23-ISA150x150x10',family:'angle',series:'EQ',designation:'ISA 150×150×10',depthMm:150,widthMm:150,thicknessMm:10,kgPerM:22.93},
 {id:'sail23-ISA200x200x12',family:'angle',series:'EQ',designation:'ISA 200×200×12',depthMm:200,widthMm:200,thicknessMm:12,kgPerM:36.85},
 {id:'sail23-ISA90x90x10',family:'angle',series:'EQ',designation:'ISA 90×90×10',depthMm:90,widthMm:90,thicknessMm:10,kgPerM:13.47},
 {id:'sail23-ISA90x90x12',family:'angle',series:'EQ',designation:'ISA 90×90×12',depthMm:90,widthMm:90,thicknessMm:12,kgPerM:15.95},
 {id:'sail23-ISA100x100x10',family:'angle',series:'EQ',designation:'ISA 100×100×10',depthMm:100,widthMm:100,thicknessMm:10,kgPerM:15.04},
 {id:'sail23-ISA100x100x12',family:'angle',series:'EQ',designation:'ISA 100×100×12',depthMm:100,widthMm:100,thicknessMm:12,kgPerM:17.83},
 // Additional 2023 SAIL brochure product-range angle sizes. Exactly
 // the published size/mass pairs; no inferred thickness or mass.
 {id:'sail23-ISA50x50x5',family:'angle',series:'EQ',designation:'ISA 50×50×5',depthMm:50,widthMm:50,thicknessMm:5,kgPerM:3.79},
 {id:'sail23-ISA60x60x5',family:'angle',series:'EQ',designation:'ISA 60×60×5',depthMm:60,widthMm:60,thicknessMm:5,kgPerM:4.50},
 {id:'sail23-ISA60x60x8',family:'angle',series:'EQ',designation:'ISA 60×60×8',depthMm:60,widthMm:60,thicknessMm:8,kgPerM:7.00},
 {id:'sail23-ISA65x65x5',family:'angle',series:'EQ',designation:'ISA 65×65×5',depthMm:65,widthMm:65,thicknessMm:5,kgPerM:4.98},
 {id:'sail23-ISA65x65x6',family:'angle',series:'EQ',designation:'ISA 65×65×6',depthMm:65,widthMm:65,thicknessMm:6,kgPerM:5.91},
 {id:'sail23-ISA65x65x8',family:'angle',series:'EQ',designation:'ISA 65×65×8',depthMm:65,widthMm:65,thicknessMm:8,kgPerM:7.73},
 {id:'sail23-ISA65x65x10',family:'angle',series:'EQ',designation:'ISA 65×65×10',depthMm:65,widthMm:65,thicknessMm:10,kgPerM:9.49},
 {id:'sail23-ISA70x70x5',family:'angle',series:'EQ',designation:'ISA 70×70×5',depthMm:70,widthMm:70,thicknessMm:5,kgPerM:5.30},
 {id:'sail23-ISA70x70x6',family:'angle',series:'EQ',designation:'ISA 70×70×6',depthMm:70,widthMm:70,thicknessMm:6,kgPerM:6.30},
 {id:'sail23-ISA75x75x5',family:'angle',series:'EQ',designation:'ISA 75×75×5',depthMm:75,widthMm:75,thicknessMm:5,kgPerM:5.77},
 {id:'sail23-ISA75x75x6',family:'angle',series:'EQ',designation:'ISA 75×75×6',depthMm:75,widthMm:75,thicknessMm:6,kgPerM:6.86},
 {id:'sail23-ISA75x75x10',family:'angle',series:'EQ',designation:'ISA 75×75×10',depthMm:75,widthMm:75,thicknessMm:10,kgPerM:11.07},
 {id:'sail23-ISA80x80x6',family:'angle',series:'EQ',designation:'ISA 80×80×6',depthMm:80,widthMm:80,thicknessMm:6,kgPerM:7.36},
 {id:'sail23-ISA80x80x10',family:'angle',series:'EQ',designation:'ISA 80×80×10',depthMm:80,widthMm:80,thicknessMm:10,kgPerM:11.88},
 {id:'sail23-ISA200x200x18',family:'angle',series:'EQ',designation:'ISA 200×200×18',depthMm:200,widthMm:200,thicknessMm:18,kgPerM:54.30},
 {id:'sail23-ISA200x200x20',family:'angle',series:'EQ',designation:'ISA 200×200×20',depthMm:200,widthMm:200,thicknessMm:20,kgPerM:59.96},
 {id:'sail23-ISA200x200x25',family:'angle',series:'EQ',designation:'ISA 200×200×25',depthMm:200,widthMm:200,thicknessMm:25,kgPerM:73.90}
].map((x,i)=>Object.freeze({
 ...x,sourceId:'sailStruct2023',basis:'manufacturer-published',
 standard:'IS 808:2021 (SAIL manufacturer product range; BIS row not separately audited)',
 ...(i<2?{series:'MC',id:'sail23-'+x.id}:{}),
 aliases:i<2?['MC '+x.depthMm]:['ISA '+x.depthMm+'x'+x.widthMm+'x'+x.thicknessMm]
}));
const hollow=(id,series,h,w,t,kg,sourceId,basis,properties={})=>Object.freeze({
 id,series,family:'hollow',designation:series+' '+h+'×'+w+'×'+t,
 depthMm:h,widthMm:w,thicknessMm:t,kgPerM:kg,
 standard:series==='CHS'?'IS 1161:2014 (manufacturer reference only)':
 'IS 4923:2017 incl. Amendment 3 (manufacturer/secondary reference only)',
 sourceId,basis,...properties,
 aliases:[series+' '+h+'x'+w+'x'+t]
});
const hollowRows=[
 hollow('tata-legacy-shs25x25x2','SHS',25,25,2,1.36,'tataLegacy','archived-manufacturer-only',{areaCm2:1.74,ixCm4:1.48,iyCm4:1.48}),
 hollow('tata-legacy-shs32x32x2','SHS',32,32,2,1.80,'tataLegacy','archived-manufacturer-only',{areaCm2:2.30,ixCm4:3.36,iyCm4:3.36}),
 hollow('tata-legacy-rhs50x25x2','RHS',50,25,2,2.15,'tataLegacy','archived-manufacturer-only',{areaCm2:2.74,ixCm4:8.38,iyCm4:2.81}),
 hollow('rhs-index-40x20x2','RHS',40,20,2,1.68,'rhsSecondary2024','secondary-amendment-unverified',{areaCm2:2.14,ixCm4:4.05,iyCm4:1.34}),
 hollow('tata-legacy-chs21.3x21.3x2','CHS',21.3,21.3,2,0.95,'tataLegacy','archived-manufacturer-only',{areaCm2:1.21,ixCm4:0.57,iyCm4:0.57}),
 hollow('tata-legacy-chs33.7x33.7x2.6','CHS',33.7,33.7,2.6,1.98,'tataLegacy','archived-manufacturer-only',{areaCm2:2.54,ixCm4:3.09,iyCm4:3.09})
];
// Source precedence retains current SAIL and original hand-reviewed hollow
// entries, then adds the attributed Osdag data (not BIS-certified). Duplicate
// physical/designation/mass combinations do not create duplicate picker cards.
function keyRow(x){return [x.family,x.series||'',String(x.designation).toUpperCase().replace(/[×ⅹ]/g,'X').replace(/^IS(?=[A-Z])/,'').replace(/[^A-Z0-9]/g,''),Number(x.kgPerM).toFixed(3)].join(':');}
const unique=new Map();
for(const row of [...rows,...newRows,...sailExtra,...hollowRows,...((root.PWDSteelOsdag||{}).sections||[])]){
 const key=keyRow(row);
 if(!unique.has(key))unique.set(key,Object.freeze(row));
}
const sections=Object.freeze([...unique.values()]);

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
 {id:'PBP',family:'pile',label:'PBP · Bearing pile',legacy:'ISPBP'},
 {id:'SHS',family:'hollow',label:'SHS · Square',legacy:'SHS'},
 {id:'RHS',family:'hollow',label:'RHS · Rectangular',legacy:'RHS'},
 {id:'CHS',family:'hollow',label:'CHS · Circular',legacy:'CHS'}
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
 Object.freeze({id:'hollow',label:'Hollow',description:'SHS, RHS, CHS; historical or secondary weights only'}),
 Object.freeze({id:'calculated',label:'Plates & bars',description:'User-input theoretical mass only'})
]);
const codeReferences=Object.freeze([
 Object.freeze({standard:'IS 808:2021',title:'Hot-rolled beams, columns, channels and angles — dimensions and properties',uri:'https://services.bis.gov.in/tmp/tbl5_2024-11-11-05-24.pdf',scope:'Standard exists and applies to section types; manufacturer rows require source/date check.'}),
 Object.freeze({standard:'IS 4923:2017 Amd.3 (June 2024)',title:'Structural square and rectangular hollow sections — selected RHS weights corrected',uri:'https://services.bis.gov.in/tmp/Circular_vpMS_2024-08-06.pdf',scope:'BIS circular confirms amendments. Historical catalogues are not a replacement for amended masses.'}),
 Object.freeze({standard:'IS 1161:2014 + Amd.1 (Mar 2019) + Amd.2 (Aug 2023)',title:'Circular structural tubes — revised Table 1',uri:'https://standards.bis.gov.in/',scope:'Amendment 2 replaces 2014 Table 1, including tube sizes and properties. Selected app rows are now independently checked; the full CHS catalogue remains under review.'}),
 Object.freeze({standard:'IS 2062 (Part 1):2025',title:'Structural steel material specification',uri:'https://standards.bis.gov.in/',scope:'Material grade control (not used as an IS 808 geometric properties table).'})
]);
function normalized(q){return String(q||'').toUpperCase().replace(/[×ⅹ]/g,'X').replace(/[^A-Z0-9]/g,'');}
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
 }).sort((a,b)=>{
  // Latest dated manufacturer data are easier to select; keep archive and
  // secondary alternatives visible, never merge nominal conflicts into one.
  const rank=x=>x.sourceId==='sailStruct2023'||x.sourceId==='sailProps2023'||x.sourceId==='sail2023'?0:
   x.basis==='manufacturer-published'?1:x.basis==='osdag-open-unverified'?2:
   x.basis.startsWith('secondary-')?3:4;
  return rank(a)-rank(b)||a.depthMm-b.depthMm||a.widthMm-b.widthMm||
   (a.thicknessMm||0)-(b.thicknessMm||0)||a.kgPerM-b.kgPerM;
 });
}
function availableSeries(family){return SERIES.filter(s=>s.family===family);}
function auditRow(row){
 const issues=[];
 if(!row||!row.id||!row.sourceId||!SOURCES[row.sourceId])issues.push('missing-source');
 if(!Number.isFinite(row?.kgPerM)||row.kgPerM<=0)issues.push('invalid-mass');
 if(!Number.isFinite(row?.depthMm)||!Number.isFinite(row?.widthMm)||row.depthMm<=0||row.widthMm<=0)issues.push('invalid-dimensions');
 if(row.areaCm2!==undefined){
  const densityExpected=row.areaCm2*0.785;
  if(!Number.isFinite(densityExpected)||Math.abs(densityExpected-row.kgPerM)>Math.max(0.08,row.kgPerM*0.035))issues.push('mass-vs-area');
 }
 if(row.family==='hollow'&&(!Number.isFinite(row.thicknessMm)||row.thicknessMm<=0||2*row.thicknessMm>=Math.min(row.depthMm,row.widthMm)))issues.push('invalid-hollow-thickness');
 return issues;
}
function collisionGroups(){
 const key=row=>[row.family,resolveSeries(row),row.depthMm,row.widthMm,row.thicknessMm||0].join('|');
 const groups=new Map();
 for(const row of sections){const k=key(row);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(row);}
 return [...groups.values()].filter(g=>g.length>1&&new Set(g.map(x=>x.kgPerM)).size>1);
}

// Explicit, SMALL hand-reviewed CHS comparison against the user's private
// IS 1161:2014 + Amendment 2 (Aug 2023), revised Table 1, pp. 3-10.
// This is an audit ledger, NOT a copy of the copyrighted BIS table.
// A sample match does not certify all properties or a supplier's MTC.
const CHS_BIS_SPOT_CHECKS=Object.freeze([
 Object.freeze({od:21.3,t:2,mass:0.95,area:1.21}),
 Object.freeze({od:33.7,t:2,mass:1.56,area:1.99}),
 Object.freeze({od:42.4,t:4,mass:3.79,area:4.83}),
 Object.freeze({od:114.3,t:4,mass:10.88,area:13.86})
]);
const CHS_WITHDRAWN_SAMPLE=Object.freeze([
 Object.freeze({od:21.3,t:2.6}),
 Object.freeze({od:33.7,t:2.6})
]);
// 'not-listed' only for the TWO manually checked historic thicknesses; all
// other unknown sizes are 'not-checked', not assumed invalid or current.
function standardAudit(row){
 const source='IS 1161:2014, Amendment 2 (Aug 2023), replacement Table 1';
 if(!row||row.series!=='CHS')return {status:'not-checked',source:null};
 const od=Number(row.diameterMm??row.depthMm),t=Number(row.thicknessMm??row.webMm);
 if(CHS_WITHDRAWN_SAMPLE.some(x=>x.od===od&&x.t===t))
  return {status:'not-listed-in-replacement',source,
   note:'Historical size not listed in the 2023 replacement Table 1. Do not present its published mass as a current standard size.'};
 const match=CHS_BIS_SPOT_CHECKS.find(x=>x.od===od&&x.t===t);
 if(!match)return {status:'not-checked',source};
 const m=Math.abs(row.kgPerM-match.mass)<=0.015;
 const a=row.areaCm2===undefined||Math.abs(row.areaCm2-match.area)<=0.02;
 if(m&&a)return {status:'spot-checked-match',source,
  note:'OD, thickness, mass and available area agree within source rounding. Other properties, amendments and MTC still require checks.'};
 return {status:'spot-checked-conflict',source,
  note:'At least one checked property conflicts with Amendment 2 Table 1. Do not calculate weight using this record.'};
}
function byId(id){return sections.find(x=>x.id===id)||null;}
const api=Object.freeze({SOURCES,sections,categories,codeReferences,SERIES,resolveSeries,availableSeries,auditRow,standardAudit,collisionGroups,search,byId,openDataCount:(root.PWDSteelOsdag||{}).count||0});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelCatalog=api;
})(typeof window!=='undefined'?window:globalThis);