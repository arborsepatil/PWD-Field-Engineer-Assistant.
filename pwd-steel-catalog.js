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
 is808Spot2021:Object.freeze({label:'BIS IS 808:2021 Fourth Revision · selected hot-rolled section checks',date:'2021; last selected audit 2026-10-24',url:'https://www.services.bis.gov.in/tmp/tbl5_2024-11-11-05-24.pdf',note:'Limited selected hot-rolled rows in curated and licensed open catalogue compared directly with the owner-held IS 808:2021. Earlier selected ledgers, V42 Table 2 (22), V43 Tables 6/7 (24), and V44 Table 8 (19 newly checked, plus an earlier checked curated MPC 150), and V45 Table 1 (five WB variants), and V46 Table 5 (seven full-property SC rows and one partial curated SC 100), and V47 Table 5 (16 HB variants, including resolved HB 200*) are tracked separately; source checks cover only specifically compared properties. Public link identifies standard but does not reproduce licensed numerical tables. Actual product and MTC remain unverified.'}),
 secondary808:Object.freeze({label:'2021 steel section table · secondary index',date:'IS 808:2021 (secondary website)',url:'https://quickboq.in/steel/',note:'Selected numbers independently transcribed from a public secondary index. Not independently certified against a current authorized BIS publication; verify before design/acceptance.'}),
 sailStruct2023:Object.freeze({label:'SAIL · Structural Product Range',date:'2023-10',url:'https://www.sail.co.in/sites/default/files/product-brochure/2023-10/PFS-Brochure_New-2023.pdf',note:'SAIL manufacturer range; nominal stock availability and latest BIS row require separate confirmation.'}),
 tataLegacy:Object.freeze({label:'Tata Structura · Archived manufacturer brochure',date:'2015-era',url:'https://www.tatasteel.com/media/23759/tata-steel-structura-brochure.pdf',note:'Historical manufacturer section weight. Published BEFORE Amendment 3 (June 2024) to IS 4923:2017; NOT certified as current amended value.'}),
 rhsSecondary2024:Object.freeze({label:'RHS 2024 amended-table index (secondary)',date:'2024 secondary publication',url:'https://quickboq.in/steel/tables/rectangular-hollow-sections/',note:'Secondary index only; specific app row may have a separate manual BIS comparison.'}),
 bis4923Spot2022:Object.freeze({label:'BIS IS 4923:2017 Amendment 2 · selected Table 1/2 comparisons',date:'Amendment 2 Aug 2022; checked 2026-10-22',url:'https://www.services.bis.gov.in/tmp/MTD4013093_26082022_1.pdf',note:'Selected SHS and unchanged RHS nominal masses and available area/inertia values manually checked against the BIS amended table. This is not a full standard transcription, product or structural certification.'}),
 rhsBisSpot2024:Object.freeze({label:'BIS IS 4923:2017 Amendment 3 · corrected RHS nominal weights',date:'June 2024 (audited 2026-10-22)',url:'https://services.bis.gov.in/tmp/Circular_vpMS_2024-08-06.pdf',note:'Twelve named nominal kg/m corrections checked against the owner-held consolidated BIS amendment, document page 33. The linked BIS circular confirms the update but is not the numerical source. Other section properties and material certificates not audited. No BIS PDF distributed with the app.'}),
 osdag808:Object.freeze({label:'Osdag open section data · LGPL-3.0',date:'IS808_Rev · revision unverified',url:'https://github.com/osdag-admin/Osdag/blob/master/src/osdag/data/ResourceFiles/Database/Intg_osdag.sql',note:'Historic IS808_Rev open data; row-by-row alignment with current IS 808:2021 is not established.'}),
 osdagCHS:Object.freeze({label:'Osdag circular tubes · LGPL-3.0',date:'Source refers to IS 1161:2014',url:'https://github.com/osdag-admin/Osdag/blob/master/src/osdag/data/ResourceFiles/Database/Intg_osdag.sql',note:'Open database CHS. Mass and area must be checked against authorized IS 1161 rows.'}),
 sail2020:Object.freeze({label:'SAIL · Structural Steel Sections, DSP archive (2020)',date:'2020-03',url:'https://www.sail.co.in/sites/default/files/product-brochure/2020-03/Structurals.pdf',note:'Archived manufacturer reference; CURRENT IS 808:2021 row and procurement availability have NOT been cross-verified.'})
});
const beam=(designation,depthMm,widthMm,kgPerM,extra={})=>({id:designation.replaceAll(' ',''),family:'beam',designation,depthMm,widthMm,kgPerM,sourceId:'sail2023',basis:'manufacturer-published',standard:'IS 808:2021 (standard applicability only)',...extra});
const channel=(designation,depthMm,widthMm,kgPerM,extra={})=>({id:designation.replaceAll(' ',''),family:'channel',designation,depthMm,widthMm,kgPerM,sourceId:'sail2023',basis:'manufacturer-published',standard:'IS 808:2021 (standard applicability only)',...extra});
const angle=(legMm,thickMm,kgPerM)=>({id:'ISA'+legMm+'x'+legMm+'x'+thickMm,family:'angle',designation:'ISA '+legMm+'×'+legMm+'×'+thickMm,depthMm:legMm,widthMm:legMm,thicknessMm:thickMm,kgPerM,sourceId:'sail2020',basis:'archived-manufacturer-only',standard:'IS 808:2021 row not yet cross-checked'});
const rows=[
 beam('ISMB 100',100,50,8.95,{areaCm2:11.4,ixCm4:182,iyCm4:12.5,zxCm3:36.4,zyCm3:5.01,webMm:4.7,flangeMm:7,sourceId:'sailProps2023',flangeSlopeDeg:98,r1Mm:9,r2Mm:4.5}),
 beam('ISMB 150',150,75,14.96,{areaCm2:19.0,ixCm4:718,iyCm4:46.7,zxCm3:95.7,zyCm3:12.4,webMm:5,flangeMm:8,sourceId:'sailProps2023',flangeSlopeDeg:98,r1Mm:9,r2Mm:4.5}),
 beam('ISMB 200',200,100,24.17,{areaCm2:30.8,ixCm4:2110,iyCm4:136,webMm:5.7,flangeMm:10,flangeSlopeDeg:98,r1Mm:11,r2Mm:5.5}),
 beam('ISMB 250',250,125,37.30,{areaCm2:47.5,ixCm4:5130,iyCm4:334,zxCm3:410,zyCm3:53.5,webMm:6.9,flangeMm:12.5,sourceId:'sailProps2023',flangeSlopeDeg:98,r1Mm:13,r2Mm:6.5}),
 beam('ISMB 300',300,140,46.02,{areaCm2:58.6,ixCm4:8990,iyCm4:486,zxCm3:599,zyCm3:69.4,webMm:7.7,flangeMm:13.1,sourceId:'sailProps2023',flangeSlopeDeg:98,r1Mm:14,r2Mm:7}),
 channel('ISMC 75',75,40,7.14,{areaCm2:9.08,ixCm4:78.2,iyCm4:12.7,webMm:4.8,flangeMm:7.5,flangeSlopeDeg:96,r1Mm:8.5,r2Mm:2.4}),
 channel('ISMC 100',100,50,9.56,{areaCm2:12.1,ixCm4:191,iyCm4:26.3,webMm:5,flangeMm:7.7,flangeSlopeDeg:96,r1Mm:9,r2Mm:2.4}),
 channel('ISMC 125',125,65,13.10,{areaCm2:16.6,ixCm4:424,iyCm4:60.3,webMm:5.3,flangeMm:8.2,flangeSlopeDeg:96,r1Mm:9.5,r2Mm:2.4}),
 channel('ISMC 150',150,75,16.80,{areaCm2:21.3,ixCm4:786,iyCm4:102,webMm:5.7,flangeMm:9,flangeSlopeDeg:96,r1Mm:10,r2Mm:2.4}),
 channel('ISMC 200',200,75,22.30,{areaCm2:28.4,ixCm4:1820,iyCm4:139,webMm:6.2,flangeMm:11.4,flangeSlopeDeg:96,r1Mm:11,r2Mm:3.2}),
 channel('ISMC 250',250,82,34.20,{areaCm2:43.4,ixCm4:4060,iyCm4:242,webMm:9,flangeMm:14.1,flangeSlopeDeg:96,r1Mm:12,r2Mm:3.2}),
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
 reference('NPB','NPB 100 × 55',100,55,8.1,{areaCm2:10.3,webMm:4.1,flangeMm:5.7,flangeSlopeDeg:90,r1Mm:7,r2Mm:0,ixCm4:171,iyCm4:15.9,zxCm3:34.2},
  'https://quickboq.in/steel/tables/narrow-parallel-flange-beams/',['ISNPB 100x55']),
 reference('WPB','WPB 100 × 100 · 12.24 kg/m',91,100,12.24,{areaCm2:15.5,webMm:4.2,flangeMm:5.5,flangeSlopeDeg:90,r1Mm:12,r2Mm:0,ixCm4:236,iyCm4:92,zxCm3:51.9},
  'https://quickboq.in/steel/tables/wide-parallel-flange-beams/',['ISWPB 100x100']),
 reference('SC','SC 100',100,100,19.97,{areaCm2:25.4,webMm:6,flangeMm:10,ixCm4:434,zxCm3:87},
  'https://quickboq.in/steel/tables/column-and-heavy-beams/',['ISSC 100']),
 reference('HB','HB 200',200,200,37.31,{areaCm2:47.5,webMm:6.1,flangeMm:9,ixCm4:3600,zxCm3:360},
  'https://quickboq.in/steel/tables/column-and-heavy-beams/',['ISHB 200']),
 reference('JC','JC 100',100,45,5.8,{areaCm2:7.41,webMm:3,flangeMm:5.1,flangeSlopeDeg:91.5,r1Mm:6,r2Mm:2,ixCm4:123,iyCm4:14.6,zxCm3:24.8},
  'https://quickboq.in/steel/tables/sloping-flange-channels-lc-jc/',['ISJC 100']),
 reference('LC','LC 150',150,75,14.4,{areaCm2:18.3,webMm:4.8,flangeMm:7.8,flangeSlopeDeg:91.5,r1Mm:8,r2Mm:2.4,ixCm4:697,iyCm4:101,zxCm3:93.1},
  'https://quickboq.in/steel/tables/sloping-flange-channels-lc-jc/',['ISLC 150']),
 reference('MPC','MPC 150',150,75,16.8,{areaCm2:21.3,webMm:5.7,flangeMm:9,flangeSlopeDeg:90,r1Mm:10,r2Mm:5,ixCm4:792,iyCm4:120,zxCm3:105},
  'https://quickboq.in/steel/tables/parallel-flange-channels/',['ISMPC 150','ISMCP 150']),
 reference('EQ','∠ 50 × 50 × 5',50,50,3.79,{areaCm2:4.83,thicknessMm:5},
  'https://quickboq.in/steel/tables/equal-leg-angles/',['ISA 50x50x5','ISA 50×50×5']),
 reference('UE','∠ 100 × 50 × 8',100,50,9.05,{areaCm2:11.5,thicknessMm:8,ixCm4:118,iyCm4:20.2},
  'https://quickboq.in/steel/tables/supplementary-unequal-leg-angles/',['ISA 100x50x8','ISA 100×50×8']),
 reference('PBP','PBP 200 · 43.85 kg/m',200,205,43.85,{areaCm2:55.8,webMm:9.3,flangeMm:9.3,flangeSlopeDeg:90,r1Mm:10,r2Mm:0,ixCm4:3990,iyCm4:1330,zxCm3:399},
  'https://quickboq.in/steel/tables/parallel-flange-bearing-piles/',['ISPBP 200'])
].map(row=>{
 const selected=new Set(['NPB','WPB','JC','LC','MPC','UE','PBP']);
 return selected.has(row.series)?Object.freeze({...row,
  sourceId:'is808Spot2021',sourceUrl:SOURCES.is808Spot2021.url,
  secondaryIndexUrl:row.sourceUrl,basis:'bis-table-spot-audited',
  standard:'IS 808:2021 (selected BIS nominal mass, area, inertia and applicable geometric properties checked only)'}):row;
});

// Manufacturer-published nominal section weights. Keep historical disagreements
// as DISTINCT records rather than silently replacing an older reference.
// These are SHORT, reviewed product-range examples — not a reproduction of BIS.
// This is the manufacturer-listed product range, not the complete IS 808:
// unknown entries and ambiguous brochure cells are intentionally excluded.
const sailExtra=[
 channel('ISMC 300',300,90,36.30,{areaCm2:46.2,ixCm4:6400,iyCm4:311,webMm:7.8,flangeMm:13.6,flangeSlopeDeg:96,r1Mm:13,r2Mm:3.2}),
 channel('ISMC 400',400,100,50.10,{areaCm2:63.7,ixCm4:15100,iyCm4:504,webMm:8.8,flangeMm:15.3,flangeSlopeDeg:96,r1Mm:15,r2Mm:4.8}),
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
// V18: three current BIS source alternatives to discrepant SAIL 2023 60x60 angles.
// The original SAIL manufacturer values remain available, flagged by audit.
const bis808AngleCorrections=Object.freeze([
 Object.freeze({id:'bis21-ISA60x60x5',series:'EQ',family:'angle',designation:'ISA 60×60×5',depthMm:60,widthMm:60,thicknessMm:5,kgPerM:4.58,areaCm2:5.84,ixCm4:20.00,iyCm4:20.00,sourceId:'is808Spot2021',basis:'bis-table-spot-audited',standard:'IS 808:2021 Table 9 selected nominal mass, area and inertia source check only',aliases:['ISA 60x60x5']}),
 Object.freeze({id:'bis21-ISA60x60x6',series:'EQ',family:'angle',designation:'ISA 60×60×6',depthMm:60,widthMm:60,thicknessMm:6,kgPerM:5.44,areaCm2:6.93,ixCm4:23.40,iyCm4:23.40,sourceId:'is808Spot2021',basis:'bis-table-spot-audited',standard:'IS 808:2021 Table 9 selected nominal mass, area and inertia source check only',aliases:['ISA 60x60x6']}),
 Object.freeze({id:'bis21-ISA60x60x8',series:'EQ',family:'angle',designation:'ISA 60×60×8',depthMm:60,widthMm:60,thicknessMm:8,kgPerM:7.10,areaCm2:9.05,ixCm4:29.80,iyCm4:29.80,sourceId:'is808Spot2021',basis:'bis-table-spot-audited',standard:'IS 808:2021 Table 9 selected nominal mass, area and inertia source check only',aliases:['ISA 60x60x8']})
]);
const hollow=(id,series,h,w,t,kg,sourceId,basis,properties={})=>Object.freeze({
 id,series,family:'hollow',designation:series+' '+h+'×'+w+'×'+t,
 depthMm:h,widthMm:w,thicknessMm:t,kgPerM:kg,
 standard:series==='CHS'?'IS 1161:2014 (manufacturer reference only)':
 sourceId==='rhsBisSpot2024'?'IS 4923:2017 incl. Amendment 3 (nominal kg/m audited only)':
 sourceId==='bis4923Spot2022'?'IS 4923:2017 Amd.2 tables, selected nominal figures checked only':
 'IS 4923:2017 incl. Amendment 3 (manufacturer/secondary reference only)',
 sourceId,basis,...properties,
 aliases:[series+' '+h+'x'+w+'x'+t]
});
const hollowRows=[
 hollow('tata-legacy-shs25x25x2','SHS',25,25,2,1.36,'tataLegacy','archived-manufacturer-only',{areaCm2:1.74,ixCm4:1.48,iyCm4:1.48}),
 hollow('tata-legacy-shs32x32x2','SHS',32,32,2,1.80,'tataLegacy','archived-manufacturer-only',{areaCm2:2.30,ixCm4:3.36,iyCm4:3.36}),
 hollow('tata-legacy-rhs50x25x2','RHS',50,25,2,2.15,'tataLegacy','archived-manufacturer-only',{areaCm2:2.74,ixCm4:8.38,iyCm4:2.81}),
 hollow('rhs-index-40x20x2','RHS',40,20,2,1.68,'rhsSecondary2024','secondary-amendment-unverified',{areaCm2:2.14,ixCm4:4.05,iyCm4:1.34}),
 // All twelve Amendment 3 RHS weight corrections, June 2024, checked against
 // the owner-held consolidated BIS amendment (document page 33).
 // Only nominal weight is verified, not full geometry or product compliance.
 hollow('bis24-rhs120x60x5','RHS',120,60,5,12.84,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs127x50x3.6','RHS',127,50,3.6,9.34,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs150x100x4','RHS',150,100,4,14.88,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs260x180x12','RHS',260,180,12,75.47,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs127x50x3','RHS',127,50,3,7.87,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs150x100x5','RHS',150,100,5,18.34,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs150x100x6','RHS',150,100,6,21.69,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs150x100x6.3','RHS',150,100,6.3,22.68,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs150x100x8','RHS',150,100,8,28.10,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs150x100x10','RHS',150,100,10,34.09,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs150x100x12','RHS',150,100,12,39.67,'rhsBisSpot2024','bis-spot-audited-mass'),
 hollow('bis24-rhs150x100x12.5','RHS',150,100,12.5,41.00,'rhsBisSpot2024','bis-spot-audited-mass'),
 // Four additional SHS samples; mass, area, Ix (and Iy by symmetry) checked.
 hollow('bis22-shs40x40x2','SHS',40,40,2,2.31,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:2.94,ixCm4:6.94,iyCm4:6.94}),
 hollow('bis22-shs50x50x2','SHS',50,50,2,2.93,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:3.74,ixCm4:14.15,iyCm4:14.15}),
 hollow('bis22-shs60x60x3','SHS',60,60,3,5.19,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:6.61,ixCm4:35.13,iyCm4:35.13}),
 hollow('bis22-shs100x100x4','SHS',100,100,4,11.73,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:14.95,ixCm4:226.35,iyCm4:226.35}),
 // Five RHS samples unchanged by Amendment 3: mass, area and moments of inertia.
 hollow('bis22-rhs40x20x2.5','RHS',40,20,2.5,2.03,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:2.59,ixCm4:4.69,iyCm4:1.54}),
 hollow('bis22-rhs50x25x2.5','RHS',50,25,2.5,2.62,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:3.34,ixCm4:9.89,iyCm4:3.28}),
 hollow('bis22-rhs80x40x3','RHS',80,40,3,5.19,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:6.61,ixCm4:52.25,iyCm4:17.56}),
 hollow('bis22-rhs100x50x4','RHS',100,50,4,8.59,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:10.95,ixCm4:134.14,iyCm4:44.95}),
 hollow('bis22-rhs200x100x6','RHS',200,100,6,26.40,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:33.63,ixCm4:1703,iyCm4:577}),
 // V11: 20 more independently compared Amendment 2 nominal Table 1/2 rows.
 // Known source anomaly RHS 120x80x6.0 is deliberately excluded.
 hollow('bis22-shs30x30x2','SHS',30,30,2,1.68,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:2.14,ixCm4:2.72,iyCm4:2.72}),
 hollow('bis22-shs40x40x3','SHS',40,40,3,3.30,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:4.21,ixCm4:9.32,iyCm4:9.32}),
 hollow('bis22-shs50x50x2.5','SHS',50,50,2.5,3.60,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:4.59,ixCm4:16.94,iyCm4:16.94}),
 hollow('bis22-shs50x50x4','SHS',50,50,4,5.45,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:6.95,ixCm4:23.74,iyCm4:23.74}),
 hollow('bis22-shs60x60x4','SHS',60,60,4,6.71,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:8.55,ixCm4:43.55,iyCm4:43.55}),
 hollow('bis22-shs70x70x3','SHS',70,70,3,6.13,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:7.81,ixCm4:57.53,iyCm4:57.53}),
 hollow('bis22-shs75x75x4.5','SHS',75,75,4.5,9.55,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:12.17,ixCm4:98.55,iyCm4:98.55}),
 hollow('bis22-shs80x80x4','SHS',80,80,4,9.22,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:11.75,ixCm4:111.04,iyCm4:111.04}),
 hollow('bis22-shs90x90x5','SHS',90,90,5,12.84,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:16.36,ixCm4:192.93,iyCm4:192.93}),
 hollow('bis22-shs100x100x6','SHS',100,100,6,16.98,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:21.63,ixCm4:311.47,iyCm4:311.47}),
 hollow('bis22-rhs40x20x3','RHS',40,20,3,2.36,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:3.01,ixCm4:5.21,iyCm4:1.68}),
 hollow('bis22-rhs50x25x2.9','RHS',50,25,2.9,2.98,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:3.80,ixCm4:10.93,iyCm4:3.60}),
 hollow('bis22-rhs50x30x3','RHS',50,30,3,3.30,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:4.21,ixCm4:12.83,iyCm4:5.70}),
 hollow('bis22-rhs60x40x2.5','RHS',60,40,2.5,3.60,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:4.59,ixCm4:22.07,iyCm4:11.74}),
 hollow('bis22-rhs60x40x4','RHS',60,40,4,5.45,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:6.95,ixCm4:30.99,iyCm4:16.28}),
 hollow('bis22-rhs70x30x4','RHS',70,30,4,5.45,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:6.95,ixCm4:37.23,iyCm4:9.42}),
 hollow('bis22-rhs80x40x4','RHS',80,40,4,6.71,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:8.55,ixCm4:64.79,iyCm4:21.49}),
 hollow('bis22-rhs90x50x3','RHS',90,50,3,6.13,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:7.81,ixCm4:81.85,iyCm4:32.74}),
 hollow('bis22-rhs100x60x4','RHS',100,60,4,9.22,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:11.75,ixCm4:152.58,iyCm4:68.68}),
 hollow('bis22-rhs120x80x4','RHS',120,80,4,11.73,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:14.95,ixCm4:294.59,iyCm4:157.29}),
 // V13: further independent selected SHS/RHS samples across small to large
 // section ranges in the privately held BIS consolidated Amendment 2 tables.
 // See docs/steel-is4923-v10-audit.md for exact PDF source pages.
 hollow('bis22-shs20x20x2','SHS',20,20,2,1.05,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:1.34,ixCm4:0.69,iyCm4:0.69}),
 hollow('bis22-shs25x25x2.5','SHS',25,25,2.5,1.64,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:2.09,ixCm4:1.69,iyCm4:1.69}),
 hollow('bis22-shs45x45x4','SHS',45,45,4,4.83,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:6.15,ixCm4:16.61,iyCm4:16.61}),
 hollow('bis22-shs150x150x6','SHS',150,150,6,26.40,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:33.63,ixCm4:1146.00,iyCm4:1146.00}),
 hollow('bis22-shs250x250x12','SHS',250,250,12,86.77,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:110.54,ixCm4:10254.00,iyCm4:10254.00}),
 hollow('bis22-shs400x400x16','SHS',400,400,16,187.75,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:239.18,ixCm4:57946.00,iyCm4:57946.00}),
 hollow('bis22-rhs80x50x2','RHS',80,50,2,3.88,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:4.94,ixCm4:43.44,iyCm4:21.06}),
 hollow('bis22-rhs120x80x3','RHS',120,80,3,8.96,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:11.41,ixCm4:230.20,iyCm4:123.43}),
 hollow('bis22-rhs180x100x6','RHS',180,100,6,24.52,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:31.23,ixCm4:1309.61,iyCm4:523.83}),
 hollow('bis22-rhs300x100x6','RHS',300,100,6,35.82,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:45.63,ixCm4:4777.00,iyCm4:842.00}),
 hollow('bis22-rhs500x300x10','RHS',500,300,10,120.44,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:153.43,ixCm4:52867.00,iyCm4:24127.00}),
 hollow('bis22-rhs500x300x12','RHS',500,300,12,143.29,'bis4923Spot2022','bis-table-spot-audited',{areaCm2:182.54,ixCm4:62169.00,iyCm4:28294.00}),
 hollow('tata-legacy-chs21.3x21.3x2','CHS',21.3,21.3,2,0.95,'tataLegacy','archived-manufacturer-only',{areaCm2:1.21,ixCm4:0.57,iyCm4:0.57}),
 hollow('tata-legacy-chs33.7x33.7x2.6','CHS',33.7,33.7,2.6,1.98,'tataLegacy','archived-manufacturer-only',{areaCm2:2.54,ixCm4:3.09,iyCm4:3.09})
];
// Source precedence retains current SAIL and original hand-reviewed hollow
// entries, then adds the attributed Osdag data (not BIS-certified). Duplicate
// physical/designation/mass combinations do not create duplicate picker cards.
function keyRow(x){return [x.family,x.series||'',String(x.designation).toUpperCase().replace(/[×ⅹ]/g,'X').replace(/^IS(?=[A-Z])/,'').replace(/[^A-Z0-9]/g,''),Number(x.kgPerM).toFixed(3)].join(':');}
const unique=new Map();
for(const row of [...rows,...newRows,...sailExtra,...bis808AngleCorrections,...hollowRows,...((root.PWDSteelOsdag||{}).sections||[])]){
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
 Object.freeze({standard:'IS 4923:2017 Amd.2 (2022)',title:'Structural hollow sections — thickness below 2 mm outside amended IS 4923 scope',uri:'https://www.services.bis.gov.in/tmp/Circular_slZj_2024-06-05.pdf',scope:'BIS 4 June 2024 circular requires deletion of thicknesses below 2 mm from IS 4923 licences by 17 October 2024. IS 18573:2024 covers general/decorative applications; do not infer structural suitability.'}),
 Object.freeze({standard:'IS 4923:2017 Amd.3 (June 2024)',title:'Structural square and rectangular hollow sections — selected RHS weights corrected',uri:'https://services.bis.gov.in/tmp/Circular_vpMS_2024-08-06.pdf',scope:'BIS circular confirms amendments. Historical catalogues are not a replacement for amended masses.'}),
 Object.freeze({standard:'IS 4923:2017 · BIS Product Manual (Aug 2024)',title:'Product certification and test requirements — nominal mass is not structural-grade approval',uri:'https://www.bis.gov.in/wp-content/uploads/2024/08/Revised-PM-template-4923.pdf',scope:'BIS manual documents 3 amendments, material source requirements and certification/test controls. Weight-only checks cannot certify grade, weld integrity, properties, supply or MTC.'}),
 Object.freeze({standard:'IS 18573:2024 (separate application)',title:'Cold-formed welded square/rectangular sections for general engineering and decorative purposes',uri:'https://www.services.bis.gov.in/tmp/Circular_slZj_2024-06-05.pdf',scope:'BIS identifies this as a separate standard for non-structural/general/decorative applications. A matching size or mass does not authorize structural use to IS 4923.'}),
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
  const rank=x=>x.sourceId==='is808Spot2021'?-1:x.sourceId==='sailStruct2023'||x.sourceId==='sailProps2023'||x.sourceId==='sail2023'?0:
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

// Owner-held IS 808:2021 (Fourth Revision): small, separately reviewed
// pdfPage is the physical 1-based page of the specific 60-page owner PDF,
// NOT the internally printed BIS folio (physical page = printed + 2).
// sample ledger, NOT a transcription of the complete proprietary BIS tables.
// IMPORTANT: MC 250 with B=82 mm is the 34.2 kg/m starred variant; MC 250
// B=80 mm is a DIFFERENT 30.6 kg/m section. Do not merge by depth alone.
// IS 808 angle values 90x90x6=8.32 and 100x100x8=12.18 differ from
// legacy manufacturer entries 8.20 and 12.10, respectively.
const IS808_BIS_SPOT_CHECKS=Object.freeze([
 Object.freeze({series:'MB',d:100,b:50,mass:8.95,area:11.4,ix:182,iy:12.5,table:1,pdfPage:7,geom:Object.freeze({web:4.7,flange:7,slope:98,r1:9,r2:4.5})}),
 Object.freeze({series:'MB',d:125,b:70,mass:13.35,area:17,ix:445,iy:38.4,table:1,pdfPage:7}),
 Object.freeze({series:'MB',d:150,b:75,mass:14.96,area:19,ix:718,iy:46.7,table:1,pdfPage:7,geom:Object.freeze({web:5,flange:8,slope:98,r1:9,r2:4.5})}),
 Object.freeze({series:'MB',d:200,b:100,mass:24.17,area:30.8,ix:2110,iy:136,table:1,pdfPage:7,geom:Object.freeze({web:5.7,flange:10,slope:98,r1:11,r2:5.5})}),
 Object.freeze({series:'MB',d:250,b:125,mass:37.3,area:47.5,ix:5130,iy:334,table:1,pdfPage:7,geom:Object.freeze({web:6.9,flange:12.5,slope:98,r1:13,r2:6.5})}),
 Object.freeze({series:'MB',d:300,b:140,mass:46.02,area:58.6,ix:8990,iy:486,table:1,pdfPage:7,geom:Object.freeze({web:7.7,flange:13.1,slope:98,r1:14,r2:7})}),
 Object.freeze({series:'MC',d:75,b:40,mass:7.14,area:9.08,ix:78.2,iy:12.7,table:6,pdfPage:23,geom:Object.freeze({web:4.8,flange:7.5,slope:96,r1:8.5,r2:2.4})}),
 Object.freeze({series:'MC',d:100,b:50,mass:9.56,area:12.1,ix:191,iy:26.3,table:6,pdfPage:23,geom:Object.freeze({web:5,flange:7.7,slope:96,r1:9,r2:2.4})}),
 Object.freeze({series:'MC',d:125,b:65,mass:13.1,area:16.6,ix:424,iy:60.3,table:6,pdfPage:23,geom:Object.freeze({web:5.3,flange:8.2,slope:96,r1:9.5,r2:2.4})}),
 Object.freeze({series:'MC',d:150,b:75,mass:16.8,area:21.3,ix:786,iy:102,table:6,pdfPage:23,geom:Object.freeze({web:5.7,flange:9,slope:96,r1:10,r2:2.4})}),
 Object.freeze({series:'MC',d:200,b:75,mass:22.3,area:28.4,ix:1820,iy:139,table:6,pdfPage:23,geom:Object.freeze({web:6.2,flange:11.4,slope:96,r1:11,r2:3.2})}),
 Object.freeze({series:'MC',d:250,b:80,mass:30.6,area:38.9,ix:3820,iy:218,table:6,pdfPage:23}),
 Object.freeze({series:'MC',d:250,b:82,mass:34.2,area:43.4,ix:4060,iy:242,table:6,pdfPage:24,geom:Object.freeze({web:9,flange:14.1,slope:96,r1:12,r2:3.2})}),
 Object.freeze({series:'MC',d:300,b:90,mass:36.3,area:46.2,ix:6400,iy:311,table:6,pdfPage:24,geom:Object.freeze({web:7.8,flange:13.6,slope:96,r1:13,r2:3.2})}),
 Object.freeze({series:'MC',d:400,b:100,mass:50.1,area:63.7,ix:15100,iy:504,table:6,pdfPage:24,geom:Object.freeze({web:8.8,flange:15.3,slope:96,r1:15,r2:4.8})}),
 Object.freeze({series:'EQ',d:90,b:90,t:6,mass:8.32,area:10.6,ix:83,iy:83,table:9,pdfPage:31}),
 Object.freeze({series:'EQ',d:90,b:90,t:8,mass:10.92,area:13.9,ix:107,iy:107,table:9,pdfPage:31}),
 Object.freeze({series:'EQ',d:100,b:100,t:8,mass:12.18,area:15.5,ix:148,iy:148,table:9,pdfPage:31}),
 Object.freeze({series:'EQ',d:150,b:150,t:10,mass:22.93,area:29.2,ix:633,iy:633,table:9,pdfPage:32}),
 Object.freeze({series:'EQ',d:200,b:200,t:12,mass:36.85,area:46.9,ix:1820,iy:1820,table:9,pdfPage:32}),
 Object.freeze({series:'WB',d:150,b:100,mass:17,area:21.6,ix:839,iy:94.7,table:1,pdfPage:8}),
 Object.freeze({series:'HB',d:200,b:200,mass:37.31,area:47.5,ix:3600,iy:967,table:5,pdfPage:22}),
 Object.freeze({series:'LB',d:200,b:100,mass:19.83,area:25.2,ix:1690,iy:115,table:2,pdfPage:10}),
 Object.freeze({series:'NPB',d:100,b:55,mass:8.10,area:10.3,ix:171,iy:15.9,table:3,pdfPage:11,geom:Object.freeze({web:4.1,flange:5.7,slope:90,r1:7,r2:0})}),
 Object.freeze({series:'WPB',d:91,b:100,mass:12.24,area:15.5,ix:236,iy:92,table:4,pdfPage:15,geom:Object.freeze({web:4.2,flange:5.5,slope:90,r1:12,r2:0})}),
 Object.freeze({series:'JC',d:100,b:45,mass:5.8,area:7.41,ix:123,iy:14.6,table:7,pdfPage:25,geom:Object.freeze({web:3,flange:5.1,slope:91.5,r1:6,r2:2})}),
 Object.freeze({series:'LC',d:150,b:75,mass:14.4,area:18.3,ix:697,iy:101,table:7,pdfPage:26,geom:Object.freeze({web:4.8,flange:7.8,slope:91.5,r1:8,r2:2.4})}),
 Object.freeze({series:'MPC',d:150,b:75,mass:16.8,area:21.3,ix:792,iy:120,table:8,pdfPage:27,geom:Object.freeze({web:5.7,flange:9,slope:90,r1:10,r2:5})}),
 Object.freeze({series:'UE',d:100,b:50,t:8,mass:9.05,area:11.5,ix:118,iy:20.2,table:12,pdfPage:39}),
 Object.freeze({series:'PBP',d:200,b:205,mass:43.85,area:55.8,ix:3990,iy:1330,table:13,pdfPage:40,geom:Object.freeze({web:9.3,flange:9.3,slope:90,r1:10,r2:0})}),
 Object.freeze({series:'EQ',d:50,b:50,t:5,mass:3.79,area:4.83,ix:11.30,iy:11.30,table:9,pdfPage:30}),
 Object.freeze({series:'EQ',d:50,b:50,t:6,mass:4.49,area:5.72,ix:13.20,iy:13.20,table:9,pdfPage:30}),
 Object.freeze({series:'EQ',d:60,b:60,t:5,mass:4.58,area:5.84,ix:20.00,iy:20.00,table:9,pdfPage:30}),
 Object.freeze({series:'EQ',d:60,b:60,t:6,mass:5.44,area:6.93,ix:23.40,iy:23.40,table:9,pdfPage:30}),
 Object.freeze({series:'EQ',d:60,b:60,t:8,mass:7.10,area:9.05,ix:29.80,iy:29.80,table:9,pdfPage:30}),
 Object.freeze({series:'EQ',d:65,b:65,t:5,mass:4.98,area:6.34,ix:25.70,iy:25.70,table:9,pdfPage:30}),
 Object.freeze({series:'EQ',d:75,b:75,t:8,mass:9.00,area:11.40,ix:60.30,iy:60.30,table:9,pdfPage:31}),
 Object.freeze({series:'EQ',d:80,b:80,t:8,mass:9.65,area:12.30,ix:74.00,iy:74.00,table:9,pdfPage:31}),
 Object.freeze({series:'EQ',d:90,b:90,t:10,mass:13.47,area:17.10,ix:129.00,iy:129.00,table:9,pdfPage:31}),
 Object.freeze({series:'EQ',d:100,b:100,t:10,mass:15.04,area:19.10,ix:180.00,iy:180.00,table:9,pdfPage:31}),
 Object.freeze({series:'EQ',d:150,b:150,t:12,mass:27.29,area:34.70,ix:746.00,iy:746.00,table:9,pdfPage:32}),
 Object.freeze({series:'EQ',d:200,b:200,t:16,mass:48.53,area:61.80,ix:2360.00,iy:2360.00,table:9,pdfPage:32})
]);
// V29: EIGHT additional limited independent checks on the owner's non-distributed
// IS 808:2021, Table 1 physical PDF pp.7–8. This is a selective check ledger,
// NOT the licensed table copied into the public app.
// Values were checked against source on 2026-10-23 and against Osdag rows.
// Web/flange t/T recorded as independent geometry checks; absent radii/slope
// in the Osdag record MUST NOT be marked as verified geometry.
const IS808_V29_SAMPLE_ROWS=Object.freeze([
 Object.freeze({series:'MB',d:175,b:85,mass:19.50,area:24.8,ix:1260,iy:76.6,table:1,pdfPage:7,geom:Object.freeze({web:5.8,flange:9.0})}),
 Object.freeze({series:'MB',d:225,b:110,mass:31.15,area:39.7,ix:3440,iy:218,table:1,pdfPage:7,geom:Object.freeze({web:6.5,flange:11.8})}),
 Object.freeze({series:'MB',d:350,b:140,mass:52.33,area:66.7,ix:13600,iy:537,table:1,pdfPage:7,geom:Object.freeze({web:8.1,flange:14.2})}),
 Object.freeze({series:'MB',d:400,b:140,mass:61.55,area:78.4,ix:20400,iy:622,table:1,pdfPage:8,geom:Object.freeze({web:8.9,flange:16.0})}),
 Object.freeze({series:'WB',d:175,b:125,mass:22.06,area:28.1,ix:1510,iy:188,table:1,pdfPage:8,geom:Object.freeze({web:5.8,flange:7.4})}),
 Object.freeze({series:'WB',d:200,b:140,mass:28.80,area:36.7,ix:2620,iy:328,table:1,pdfPage:8,geom:Object.freeze({web:6.1,flange:9.0})}),
 Object.freeze({series:'WB',d:203,b:152,mass:52.09,area:66.4,ix:4780,iy:809,table:1,pdfPage:8,geom:Object.freeze({web:8.9,flange:16.5})}),
 Object.freeze({series:'WB',d:225,b:150,mass:33.93,area:43.2,ix:3920,iy:448,table:1,pdfPage:8,geom:Object.freeze({web:6.4,flange:9.9})})
]);
// V29B: second focused batch (eight more), checked on private BIS IS 808:2021
// Table 1, physical PDF page 8. Not a full publication transcription.
const IS808_V29B_SAMPLE_ROWS=Object.freeze([
 Object.freeze({series:'MB',d:450,b:150,mass:72.38,area:92.2,ix:30400,iy:834,table:1,pdfPage:8,geom:Object.freeze({web:9.4,flange:17.4})}),
 Object.freeze({series:'MB',d:500,b:180,mass:86.88,area:110,ix:45200,iy:1360,table:1,pdfPage:8,geom:Object.freeze({web:10.2,flange:17.2})}),
 Object.freeze({series:'MB',d:550,b:190,mass:103.64,area:132,ix:64900,iy:1830,table:1,pdfPage:8,geom:Object.freeze({web:11.2,flange:19.3})}),
 Object.freeze({series:'MB',d:600,b:210,mass:121,area:154,ix:90200,iy:2570,table:1,pdfPage:8,geom:Object.freeze({web:12,flange:20.3})}),
 Object.freeze({series:'WB',d:250,b:200,mass:40.84,area:52,ix:5940,iy:857,table:1,pdfPage:8,geom:Object.freeze({web:6.7,flange:9.0})}),
 Object.freeze({series:'WB',d:300,b:200,mass:48.12,area:61.3,ix:9820,iy:990,table:1,pdfPage:8,geom:Object.freeze({web:7.4,flange:10})}),
 Object.freeze({series:'WB',d:350,b:200,mass:56.89,area:72.4,ix:15500,iy:1170,table:1,pdfPage:8,geom:Object.freeze({web:8,flange:11.4})}),
 Object.freeze({series:'WB',d:400,b:200,mass:66.71,area:85,ix:23400,iy:1380,table:1,pdfPage:8,geom:Object.freeze({web:8.6,flange:13})})
]);
// V42: Twenty-two *existing* Osdag junior/light-beam rows manually checked
// against the owner-held IS 808:2021 Fourth Revision, Table 2, PDF pp.9-10.
// Compared nominal mass, area, D/B, web/flange thickness, Izz/Iyy and
// Zzz/Zyy. The source PDF is neither embedded nor reprinted. Fingerprints
// identify exactly the already-published Osdag figures and fail closed if
// ANY audited value/identity changes. These are audit checks, NOT a copy of
// BIS numeric tables or evidence about steel grade, stock, MTC or strength.
// OSD13 (LB(P) 200) remains held; do not infer verification by designation.
const IS808_V42_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD2',fingerprint:'4309546e',table:2,pdfPage:9}),
 Object.freeze({id:'OSD3',fingerprint:'f5c0ec96',table:2,pdfPage:9}),
 Object.freeze({id:'OSD4',fingerprint:'e26766e6',table:2,pdfPage:9}),
 Object.freeze({id:'OSD5',fingerprint:'4fc696e1',table:2,pdfPage:9}),
 Object.freeze({id:'OSD6',fingerprint:'0431d246',table:2,pdfPage:9}),
 Object.freeze({id:'OSD7',fingerprint:'77d645ec',table:2,pdfPage:10}),
 Object.freeze({id:'OSD8',fingerprint:'53a17eea',table:2,pdfPage:10}),
 Object.freeze({id:'OSD9',fingerprint:'4fba2ab7',table:2,pdfPage:10}),
 Object.freeze({id:'OSD10',fingerprint:'0ff07a78',table:2,pdfPage:10}),
 Object.freeze({id:'OSD11',fingerprint:'ce0cafad',table:2,pdfPage:10}),
 Object.freeze({id:'OSD14',fingerprint:'73414d5c',table:2,pdfPage:10}),
 Object.freeze({id:'OSD15',fingerprint:'38320c1c',table:2,pdfPage:10}),
 Object.freeze({id:'OSD16',fingerprint:'52eff19c',table:2,pdfPage:10}),
 Object.freeze({id:'OSD17',fingerprint:'0b997535',table:2,pdfPage:10}),
 Object.freeze({id:'OSD18',fingerprint:'df0844a8',table:2,pdfPage:10}),
 Object.freeze({id:'OSD19',fingerprint:'52afe504',table:2,pdfPage:10}),
 Object.freeze({id:'OSD20',fingerprint:'8123f3e0',table:2,pdfPage:10}),
 Object.freeze({id:'OSD21',fingerprint:'9ff41244',table:2,pdfPage:10}),
 Object.freeze({id:'OSD22',fingerprint:'d0c5707e',table:2,pdfPage:10}),
 Object.freeze({id:'OSD23',fingerprint:'d48dd575',table:2,pdfPage:10}),
 Object.freeze({id:'OSD24',fingerprint:'c8921f68',table:2,pdfPage:10}),
 Object.freeze({id:'OSD25',fingerprint:'e1aca1f7',table:2,pdfPage:10})
]);
function v42Fingerprint(row){
 const fields=['id','sourceId','series','depthMm','widthMm','kgPerM',
  'areaCm2','ixCm4','iyCm4','zxCm3','zyCm3','webMm','flangeMm'];
 const payload=fields.map(key=>key+':'+(row[key]??'~')).join('|');
 let hash=2166136261;
 for(let i=0;i<payload.length;i++)hash=Math.imul(hash^payload.charCodeAt(i),16777619)>>>0;
 return hash.toString(16).padStart(8,'0');
}


/* V43: 24 existing Osdag MC, JC and LC records checked directly against the
 * owner's IS 808:2021 Fourth Revision Table 6 (physical PDF pp.23–24)
 * and Table 7 (pp.25–26). Reviewed: nominal mass, A, D, B, t/T,
 * Izz/Iyy and Zzz/Zyy. The copyrighted tables are never copied or bundled.
 * Source row ID and listed published data are locked to a compact hash.
 * This is a limited source match, not geometry/grade/product certification.
 * Provisional LC (P) variants are deliberately NOT promoted; existing
 * numeric/integrity hold entries remain blocked. Starred MC roll variants
 * are tied to exact IDs, D/B AND numerical values, not depth alone.
 */
const IS808_V43_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD304',fingerprint:'ffe914a2',table:6,pdfPage:23}),
 Object.freeze({id:'OSD306',fingerprint:'618c51c5',table:6,pdfPage:23}),
 Object.freeze({id:'OSD307',fingerprint:'37c121d7',table:6,pdfPage:23}),
 Object.freeze({id:'OSD310',fingerprint:'542bd7da',table:6,pdfPage:23}),
 Object.freeze({id:'OSD311',fingerprint:'402576b1',table:6,pdfPage:23}),
 Object.freeze({id:'OSD312',fingerprint:'9f613861',table:6,pdfPage:23}),
 Object.freeze({id:'OSD315',fingerprint:'a339b568',table:6,pdfPage:24}),
 Object.freeze({id:'OSD317',fingerprint:'7443fb90',table:6,pdfPage:24}),
 Object.freeze({id:'OSD318',fingerprint:'6b42fc4b',table:6,pdfPage:24}),
 Object.freeze({id:'OSD319',fingerprint:'e0fe50a3',table:6,pdfPage:24}),
 Object.freeze({id:'OSD322',fingerprint:'3d7644ff',table:7,pdfPage:25}),
 Object.freeze({id:'OSD323',fingerprint:'5309240f',table:7,pdfPage:25}),
 Object.freeze({id:'OSD324',fingerprint:'1681465a',table:7,pdfPage:25}),
 Object.freeze({id:'OSD325',fingerprint:'09cac128',table:7,pdfPage:25}),
 Object.freeze({id:'OSD326',fingerprint:'224731d0',table:7,pdfPage:25}),
 Object.freeze({id:'OSD327',fingerprint:'7a1e8f42',table:7,pdfPage:25}),
 Object.freeze({id:'OSD328',fingerprint:'461c7618',table:7,pdfPage:26}),
 Object.freeze({id:'OSD332',fingerprint:'8f3c1fee',table:7,pdfPage:26}),
 Object.freeze({id:'OSD333',fingerprint:'6ba5c3b1',table:7,pdfPage:26}),
 Object.freeze({id:'OSD335',fingerprint:'f5cf6e99',table:7,pdfPage:26}),
 Object.freeze({id:'OSD336',fingerprint:'894af8c6',table:7,pdfPage:26}),
 Object.freeze({id:'OSD337',fingerprint:'032cd12f',table:7,pdfPage:26}),
 Object.freeze({id:'OSD339',fingerprint:'70aafd1c',table:7,pdfPage:26}),
 Object.freeze({id:'OSD340',fingerprint:'4c79ceb8',table:7,pdfPage:26})
]);
function v43Fingerprint(row){
 const fields=['id','sourceId','series','designation','qualityFlag','depthMm',
  'widthMm','kgPerM','areaCm2','ixCm4','iyCm4','zxCm3','zyCm3',
  'webMm','flangeMm'];
 const payload=fields.map(key=>key+':'+(row[key]??'~')).join('|');
 let hash=2166136261;
 for(let i=0;i<payload.length;i++)hash=Math.imul(hash^payload.charCodeAt(i),16777619)>>>0;
 return hash.toString(16).padStart(8,'0');
}

/* V44: 19 imported Osdag parallel-flange channel rows source-compared with the
 * user's non-distributed IS 808:2021 Table 8 (physical PDF pp.27–28).
 * All 20 Table 8 variants compared; MPC 150 is already a verified curated
 * row and its duplicate OSD345 is intentionally excluded from the picker.
 * Compared exact MPC designation/variant, mass, area, D/B, t/T, Izz/Iyy,
 * Zzz/Zyy (including all starred heavier variants). V44 adds only 19 new
 * checks; the previously checked MPC 150 retains its original source status.
 * Only immutable checksums and source page tags are packaged, not the BIS
 * numeric table. Neither material compliance nor full geometry is certified.
 */
const IS808_V44_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD341',fingerprint:'827b31e8',table:8,pdfPage:27}),
 Object.freeze({id:'OSD342',fingerprint:'38908b9a',table:8,pdfPage:27}),
 Object.freeze({id:'OSD343',fingerprint:'9337413b',table:8,pdfPage:27}),
 Object.freeze({id:'OSD344',fingerprint:'3dba2108',table:8,pdfPage:27}),
 Object.freeze({id:'OSD346',fingerprint:'7243dea2',table:8,pdfPage:27}),
 Object.freeze({id:'OSD347',fingerprint:'dc26abf0',table:8,pdfPage:27}),
 Object.freeze({id:'OSD348',fingerprint:'dcc940f6',table:8,pdfPage:27}),
 Object.freeze({id:'OSD349',fingerprint:'ea517996',table:8,pdfPage:27}),
 Object.freeze({id:'OSD350',fingerprint:'cb7bc9e8',table:8,pdfPage:27}),
 Object.freeze({id:'OSD351',fingerprint:'bdaf7c0a',table:8,pdfPage:27}),
 Object.freeze({id:'OSD352',fingerprint:'49b587ab',table:8,pdfPage:27}),
 Object.freeze({id:'OSD353',fingerprint:'5a123ab2',table:8,pdfPage:28}),
 Object.freeze({id:'OSD354',fingerprint:'a0dd4041',table:8,pdfPage:28}),
 Object.freeze({id:'OSD355',fingerprint:'2ad942e4',table:8,pdfPage:28}),
 Object.freeze({id:'OSD356',fingerprint:'5e867626',table:8,pdfPage:28}),
 Object.freeze({id:'OSD357',fingerprint:'cc085cbf',table:8,pdfPage:28}),
 Object.freeze({id:'OSD358',fingerprint:'00429e07',table:8,pdfPage:28}),
 Object.freeze({id:'OSD359',fingerprint:'d415c214',table:8,pdfPage:28}),
 Object.freeze({id:'OSD360',fingerprint:'6849e8b3',table:8,pdfPage:28})
]);
function v44Fingerprint(row){
 const fields=['id','sourceId','series','designation','qualityFlag','depthMm',
  'widthMm','kgPerM','areaCm2','ixCm4','iyCm4','zxCm3','zyCm3',
  'webMm','flangeMm'];
 const payload=fields.map(key=>key+':'+(row[key]??'~')).join('|');
 let hash=2166136261;
 for(let i=0;i<payload.length;i++)hash=Math.imul(hash^payload.charCodeAt(i),16777619)>>>0;
 return hash.toString(16).padStart(8,'0');
}

// Source-published nominal figures use listed rounding; 0.01 kg/m mismatch
// is NOT a numerical match. A missing optional dimension/property must not
// be invented. Incomplete app rows can earn kg/m-only verification.
/* V45: five remaining existing WB rows, owner-held IS 808:2021 Table 1,
 * physical PDF page 8. Checked exact WB identity and variant, nominal kg/m,
 * area, D/B, t/T, Izz/Iyy, Zzz/Zyy. The two WB 600 source variants share
 * D/B but have DISTINCT masses, thicknesses and properties; never merge.
 * These immutable hashes bind pre-existing Osdag open data, not a copied
 * proprietary BIS numerical table. Structural grade, product MTC, full
 * flange slope/radii and design acceptance remain outside this check.
 */
const IS808_V45_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD119',fingerprint:'b756fb34',table:1,pdfPage:8}),
 Object.freeze({id:'OSD120',fingerprint:'2ebb609a',table:1,pdfPage:8}),
 Object.freeze({id:'OSD121',fingerprint:'eed330a8',table:1,pdfPage:8}),
 Object.freeze({id:'OSD122',fingerprint:'684e19f8',table:1,pdfPage:8}),
 Object.freeze({id:'OSD123',fingerprint:'191401af',table:1,pdfPage:8})
]);
// Reuse the same immutable identity/property field set as the V43/V44 audits.
const v45Fingerprint=v44Fingerprint;

/* V46: seven existing SC rows checked directly with owner-held IS 808:2021
 * Table 5, physical PDF page 22. SC 100 is a curated secondary-source
 * record; its duplicate OSD293 is intentionally excluded by deduplication.
 * SC 100 has only partial listed properties and earns a limited mass check.
 * Checked variant identity, mass, area, D/B, t/T, Izz/Iyy and Zzz/Zyy.
 * Source PDF and numerical table are not distributed or reproduced.
 * Section radii/slope, steel grade and delivered material are not approved.
 */
const IS808_V46_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD294',fingerprint:'ffd624de',table:5,pdfPage:22}),
 Object.freeze({id:'OSD295',fingerprint:'fd812c91',table:5,pdfPage:22}),
 Object.freeze({id:'OSD296',fingerprint:'62e92116',table:5,pdfPage:22}),
 Object.freeze({id:'OSD297',fingerprint:'91b96f6a',table:5,pdfPage:22}),
 Object.freeze({id:'OSD298',fingerprint:'13d7977e',table:5,pdfPage:22}),
 Object.freeze({id:'OSD299',fingerprint:'10985d2e',table:5,pdfPage:22}),
 Object.freeze({id:'OSD300',fingerprint:'66ea10fa',table:5,pdfPage:22})
]);
const v46Fingerprint=v44Fingerprint;
const IS808_V46_SC100=Object.freeze({id:'ref-SC-SC-100-19.97',fingerprint:'4457838f',table:5,pdfPage:22});

/* V47: 16 existing Osdag heavy-beam (HB) variants checked against the
 * owner-held IS 808:2021 Table 5, physical PDF page 22 (printed page 20).
 * The already curated, partially checked HB 200 record replaces OSD250 in
 * the picker, so this batch adds NO sections and does not double count it.
 * Matched exact section identity, including starred roll variants, nominal
 * kg/m, area, D/B, t/T, Izz/Iyy and Zzz/Zyy. HB 150* has TWO distinct
 * heavier variants; HB 200* must NOT be rejected merely because standard
 * HB 200 has the same D/B. Only source fingerprints are distributed.
 * Flange slopes/radii, MTCs, material grade and full design are not checked.
 */
const IS808_V47_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD247',fingerprint:'53ec9140',table:5,pdfPage:22}),
 Object.freeze({id:'OSD248',fingerprint:'e8da59f6',table:5,pdfPage:22}),
 Object.freeze({id:'OSD249',fingerprint:'8c1de1b2',table:5,pdfPage:22}),
 Object.freeze({id:'OSD251',fingerprint:'b108d753',table:5,pdfPage:22}),
 Object.freeze({id:'OSD252',fingerprint:'33996a09',table:5,pdfPage:22}),
 Object.freeze({id:'OSD253',fingerprint:'db6250bd',table:5,pdfPage:22}),
 Object.freeze({id:'OSD254',fingerprint:'68efd577',table:5,pdfPage:22}),
 Object.freeze({id:'OSD255',fingerprint:'2ef79889',table:5,pdfPage:22}),
 Object.freeze({id:'OSD256',fingerprint:'2c1e4e6d',table:5,pdfPage:22}),
 Object.freeze({id:'OSD257',fingerprint:'cbd9a53c',table:5,pdfPage:22}),
 Object.freeze({id:'OSD258',fingerprint:'91cde144',table:5,pdfPage:22}),
 Object.freeze({id:'OSD259',fingerprint:'bb55b5de',table:5,pdfPage:22}),
 Object.freeze({id:'OSD260',fingerprint:'75f21cca',table:5,pdfPage:22}),
 Object.freeze({id:'OSD261',fingerprint:'ccecc074',table:5,pdfPage:22}),
 Object.freeze({id:'OSD262',fingerprint:'5ecdbe9d',table:5,pdfPage:22}),
 Object.freeze({id:'OSD263',fingerprint:'29981e9b',table:5,pdfPage:22})
]);
const v47Fingerprint=v44Fingerprint;

/* V48: first 22 newly checked owner-held IS 808:2021 Table 4 WPB variants
 * (PDF physical pages 15–16, printed 13–14), sizes 100–180.
 * OSD124 was ALREADY limited-checked and is excluded from this new ledger.
 * Checked mass, area, actual D/B, web/flange thickness, Izz/Iyy, Zzz/Zyy
 * of each exact nominal-mass variant; Osdag row data remains unchanged.
 * Root/toe radii, flange slope certification, MTC, steel grade, structural
 * adequacy and availability remain outside the limited verification.
 * No copyrighted source table or source PDF is embedded in the app.
 */
const IS808_V48_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD125',fingerprint:'c88e6fcc',table:4,pdfPage:15}),
 Object.freeze({id:'OSD126',fingerprint:'ff9b6ca1',table:4,pdfPage:15}),
 Object.freeze({id:'OSD127',fingerprint:'748ce72b',table:4,pdfPage:15}),
 Object.freeze({id:'OSD128',fingerprint:'39e23048',table:4,pdfPage:15}),
 Object.freeze({id:'OSD129',fingerprint:'7e317a7b',table:4,pdfPage:15}),
 Object.freeze({id:'OSD130',fingerprint:'5129a432',table:4,pdfPage:15}),
 Object.freeze({id:'OSD131',fingerprint:'929af2b3',table:4,pdfPage:15}),
 Object.freeze({id:'OSD132',fingerprint:'e040106c',table:4,pdfPage:15}),
 Object.freeze({id:'OSD133',fingerprint:'839168fd',table:4,pdfPage:15}),
 Object.freeze({id:'OSD134',fingerprint:'9014cc27',table:4,pdfPage:15}),
 Object.freeze({id:'OSD135',fingerprint:'a38c188e',table:4,pdfPage:15}),
 Object.freeze({id:'OSD136',fingerprint:'41f676ea',table:4,pdfPage:16}),
 Object.freeze({id:'OSD137',fingerprint:'88530dda',table:4,pdfPage:16}),
 Object.freeze({id:'OSD138',fingerprint:'cc4cc113',table:4,pdfPage:16}),
 Object.freeze({id:'OSD139',fingerprint:'37def4f1',table:4,pdfPage:16}),
 Object.freeze({id:'OSD140',fingerprint:'a88dc46f',table:4,pdfPage:16}),
 Object.freeze({id:'OSD141',fingerprint:'cafaeb7b',table:4,pdfPage:16}),
 Object.freeze({id:'OSD142',fingerprint:'461bca63',table:4,pdfPage:16}),
 Object.freeze({id:'OSD143',fingerprint:'dc1b9646',table:4,pdfPage:16}),
 Object.freeze({id:'OSD144',fingerprint:'d6af1ad0',table:4,pdfPage:16}),
 Object.freeze({id:'OSD145',fingerprint:'1aab7bed',table:4,pdfPage:16}),
 Object.freeze({id:'OSD146',fingerprint:'a7728c30',table:4,pdfPage:16})
]);
const v48Fingerprint=v44Fingerprint;

/* V49: 24 further WPB variants from owner-held IS 808:2021 Table 4,
 * physical PDF pages 16–17, sizes 200–250 and all listed mass variants.
 * Checked source mass, area, actual D/B, web/flange thickness, Izz/Iyy,
 * Zzz/Zyy against exact catalogue rows (2026-10-25). No source table
 * reproduced; the app retains only variant-bound audit fingerprints.
 * GeometryChecked=false: root/toe radii and full structural parameters
 * are NOT certified; MTC/product confirmation required separately.
 */
const IS808_V49_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD147',fingerprint:'eb695f5d',table:4,pdfPage:16}),
 Object.freeze({id:'OSD148',fingerprint:'ed52dc5f',table:4,pdfPage:16}),
 Object.freeze({id:'OSD149',fingerprint:'6e803c9d',table:4,pdfPage:16}),
 Object.freeze({id:'OSD150',fingerprint:'73b33418',table:4,pdfPage:16}),
 Object.freeze({id:'OSD151',fingerprint:'f2aff4d7',table:4,pdfPage:16}),
 Object.freeze({id:'OSD152',fingerprint:'6cdfee45',table:4,pdfPage:16}),
 Object.freeze({id:'OSD153',fingerprint:'61ad5241',table:4,pdfPage:16}),
 Object.freeze({id:'OSD154',fingerprint:'3cade941',table:4,pdfPage:16}),
 Object.freeze({id:'OSD155',fingerprint:'ee03b5f9',table:4,pdfPage:16}),
 Object.freeze({id:'OSD156',fingerprint:'4099efbd',table:4,pdfPage:16}),
 Object.freeze({id:'OSD157',fingerprint:'1c7835ad',table:4,pdfPage:16}),
 Object.freeze({id:'OSD158',fingerprint:'ae28cb2d',table:4,pdfPage:16}),
 Object.freeze({id:'OSD159',fingerprint:'ca50d681',table:4,pdfPage:16}),
 Object.freeze({id:'OSD160',fingerprint:'74ce399a',table:4,pdfPage:16}),
 Object.freeze({id:'OSD161',fingerprint:'e20c8884',table:4,pdfPage:17}),
 Object.freeze({id:'OSD162',fingerprint:'23d8841c',table:4,pdfPage:17}),
 Object.freeze({id:'OSD163',fingerprint:'99bcfce7',table:4,pdfPage:17}),
 Object.freeze({id:'OSD164',fingerprint:'6faef4bc',table:4,pdfPage:17}),
 Object.freeze({id:'OSD165',fingerprint:'9ba3abe8',table:4,pdfPage:17}),
 Object.freeze({id:'OSD166',fingerprint:'4c0ee7b9',table:4,pdfPage:17}),
 Object.freeze({id:'OSD167',fingerprint:'508b0049',table:4,pdfPage:17}),
 Object.freeze({id:'OSD168',fingerprint:'bd383b00',table:4,pdfPage:17}),
 Object.freeze({id:'OSD169',fingerprint:'7e9e7a0a',table:4,pdfPage:17}),
 Object.freeze({id:'OSD170',fingerprint:'9b5a5781',table:4,pdfPage:17})
]);
const v49Fingerprint=v44Fingerprint;

/* V50: 21 exact Table 4 WPB mass variants (OSD171–OSD192 excluding
 * OSD180) matched to owner-held IS 808:2021, physical PDF pages 17–18.
 * Checked designation, mass, area, actual D/B, web/flange thickness,
 * Izz/Iyy, Zzz/Zyy, with a mass/area sanity check.
 * OSD180 is NOT promoted: ambiguous extracted source inertia/moduli and
 * nominal area inconsistent with indicated geometry require manual review.
 * No original source numeric data changed or copyrighted table distributed.
 */
const IS808_V50_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD171',fingerprint:'400f3612',table:4,pdfPage:17}),
 Object.freeze({id:'OSD172',fingerprint:'a61cad62',table:4,pdfPage:17}),
 Object.freeze({id:'OSD173',fingerprint:'eab29cc8',table:4,pdfPage:17}),
 Object.freeze({id:'OSD174',fingerprint:'b75b1a36',table:4,pdfPage:17}),
 Object.freeze({id:'OSD175',fingerprint:'68122dce',table:4,pdfPage:17}),
 Object.freeze({id:'OSD176',fingerprint:'82bc606d',table:4,pdfPage:17}),
 Object.freeze({id:'OSD177',fingerprint:'b47df2a1',table:4,pdfPage:17}),
 Object.freeze({id:'OSD178',fingerprint:'d531ab59',table:4,pdfPage:17}),
 Object.freeze({id:'OSD179',fingerprint:'1ddd2187',table:4,pdfPage:17}),
 Object.freeze({id:'OSD181',fingerprint:'a31fcd81',table:4,pdfPage:17}),
 Object.freeze({id:'OSD182',fingerprint:'c715f113',table:4,pdfPage:17}),
 Object.freeze({id:'OSD183',fingerprint:'bf8625c2',table:4,pdfPage:17}),
 Object.freeze({id:'OSD184',fingerprint:'971d1a54',table:4,pdfPage:17}),
 Object.freeze({id:'OSD185',fingerprint:'ba0d8747',table:4,pdfPage:18}),
 Object.freeze({id:'OSD186',fingerprint:'27094305',table:4,pdfPage:18}),
 Object.freeze({id:'OSD187',fingerprint:'853253e3',table:4,pdfPage:18}),
 Object.freeze({id:'OSD188',fingerprint:'5652bb10',table:4,pdfPage:18}),
 Object.freeze({id:'OSD189',fingerprint:'286d98dd',table:4,pdfPage:18}),
 Object.freeze({id:'OSD190',fingerprint:'9f73ca97',table:4,pdfPage:18}),
 Object.freeze({id:'OSD191',fingerprint:'d69282c8',table:4,pdfPage:18}),
 Object.freeze({id:'OSD192',fingerprint:'291a9c84',table:4,pdfPage:18})
]);
const v50Fingerprint=v44Fingerprint;

/* V51: remaining 50 Table 4 WPB catalogue variants, IS 808:2021.
 * Compared with owner-held BIS document, physical PDF pages 18–20.
 * Exact variant designation/mass, area, actual D/B, t/T, Izz/Iyy and
 * Zzz/Zyy compared, with mass-area and approximate geometry sanity tests.
 * Source data unchanged. OSD180 remains pending; OSD193–196 remain held.
 * Root/toe radii, design adequacy, steel grade, actual supply and MTC
 * are outside the limited source check. No BIS table or PDF is embedded.
 */
const IS808_V51_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD197',fingerprint:'bc0c9dd9',table:4,pdfPage:18}),
 Object.freeze({id:'OSD198',fingerprint:'b3bff2f8',table:4,pdfPage:18}),
 Object.freeze({id:'OSD199',fingerprint:'472c26ba',table:4,pdfPage:18}),
 Object.freeze({id:'OSD200',fingerprint:'9fba7575',table:4,pdfPage:18}),
 Object.freeze({id:'OSD201',fingerprint:'2f0aae12',table:4,pdfPage:18}),
 Object.freeze({id:'OSD202',fingerprint:'a6618085',table:4,pdfPage:18}),
 Object.freeze({id:'OSD203',fingerprint:'fc9fb205',table:4,pdfPage:18}),
 Object.freeze({id:'OSD204',fingerprint:'ce6a5402',table:4,pdfPage:18}),
 Object.freeze({id:'OSD205',fingerprint:'39cf6d00',table:4,pdfPage:18}),
 Object.freeze({id:'OSD206',fingerprint:'e770933f',table:4,pdfPage:18}),
 Object.freeze({id:'OSD207',fingerprint:'2cef3e5b',table:4,pdfPage:18}),
 Object.freeze({id:'OSD208',fingerprint:'44b608bb',table:4,pdfPage:18}),
 Object.freeze({id:'OSD209',fingerprint:'7e63487c',table:4,pdfPage:19}),
 Object.freeze({id:'OSD210',fingerprint:'6d0887b2',table:4,pdfPage:19}),
 Object.freeze({id:'OSD211',fingerprint:'a700a365',table:4,pdfPage:19}),
 Object.freeze({id:'OSD212',fingerprint:'baa7c928',table:4,pdfPage:19}),
 Object.freeze({id:'OSD213',fingerprint:'29d46815',table:4,pdfPage:19}),
 Object.freeze({id:'OSD214',fingerprint:'d46d2f71',table:4,pdfPage:19}),
 Object.freeze({id:'OSD215',fingerprint:'efa5f377',table:4,pdfPage:19}),
 Object.freeze({id:'OSD216',fingerprint:'ed9e0a0f',table:4,pdfPage:19}),
 Object.freeze({id:'OSD217',fingerprint:'1ce5dc39',table:4,pdfPage:19}),
 Object.freeze({id:'OSD218',fingerprint:'fbdf6ec7',table:4,pdfPage:19}),
 Object.freeze({id:'OSD219',fingerprint:'9920c984',table:4,pdfPage:19}),
 Object.freeze({id:'OSD220',fingerprint:'57154314',table:4,pdfPage:19}),
 Object.freeze({id:'OSD221',fingerprint:'aaa3b22b',table:4,pdfPage:19}),
 Object.freeze({id:'OSD222',fingerprint:'20fc563c',table:4,pdfPage:19}),
 Object.freeze({id:'OSD223',fingerprint:'ac62c961',table:4,pdfPage:19}),
 Object.freeze({id:'OSD224',fingerprint:'0d71456b',table:4,pdfPage:19}),
 Object.freeze({id:'OSD225',fingerprint:'ff7b25d3',table:4,pdfPage:19}),
 Object.freeze({id:'OSD226',fingerprint:'1d56f74d',table:4,pdfPage:19}),
 Object.freeze({id:'OSD227',fingerprint:'9cb5005b',table:4,pdfPage:19}),
 Object.freeze({id:'OSD228',fingerprint:'0d18694b',table:4,pdfPage:19}),
 Object.freeze({id:'OSD229',fingerprint:'66f0ba28',table:4,pdfPage:19}),
 Object.freeze({id:'OSD230',fingerprint:'7174f456',table:4,pdfPage:19}),
 Object.freeze({id:'OSD231',fingerprint:'b4c06714',table:4,pdfPage:19}),
 Object.freeze({id:'OSD232',fingerprint:'79296790',table:4,pdfPage:19}),
 Object.freeze({id:'OSD233',fingerprint:'5c12cf6e',table:4,pdfPage:20}),
 Object.freeze({id:'OSD234',fingerprint:'620f8f94',table:4,pdfPage:20}),
 Object.freeze({id:'OSD235',fingerprint:'5fc5d735',table:4,pdfPage:20}),
 Object.freeze({id:'OSD236',fingerprint:'27fc05a6',table:4,pdfPage:20}),
 Object.freeze({id:'OSD237',fingerprint:'71f73c5b',table:4,pdfPage:20}),
 Object.freeze({id:'OSD238',fingerprint:'ec33b8f7',table:4,pdfPage:20}),
 Object.freeze({id:'OSD239',fingerprint:'29dbc1e1',table:4,pdfPage:20}),
 Object.freeze({id:'OSD240',fingerprint:'ad32c310',table:4,pdfPage:20}),
 Object.freeze({id:'OSD241',fingerprint:'57398508',table:4,pdfPage:20}),
 Object.freeze({id:'OSD242',fingerprint:'a5ef17ba',table:4,pdfPage:20}),
 Object.freeze({id:'OSD243',fingerprint:'1433aa97',table:4,pdfPage:20}),
 Object.freeze({id:'OSD244',fingerprint:'b6ef3315',table:4,pdfPage:20}),
 Object.freeze({id:'OSD245',fingerprint:'a8e631be',table:4,pdfPage:20}),
 Object.freeze({id:'OSD246',fingerprint:'932e05b6',table:4,pdfPage:20})
]);
const v51Fingerprint=v44Fingerprint;

/* V52: complete 69 pending NPB owner-held IS 808:2021 Table 3
 * source comparisons. Exact nominal mass variant, area, D/B, web/flange
 * thickness, Izz/Iyy, Zzz/Zyy checked on PDF physical pages 11–14.
 * NPB original source values unchanged. OSD40 and curated NPB100 already
 * limited-checked and not duplicated. No source PDF or BIS table embedded.
 * Root/toe radii, other sectional properties, grade and MTC not certified.
 */
const IS808_V52_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD41',fingerprint:'6355bb3c',table:3,pdfPage:11}),
 Object.freeze({id:'OSD42',fingerprint:'dd3fb5e4',table:3,pdfPage:11}),
 Object.freeze({id:'OSD43',fingerprint:'6ad00215',table:3,pdfPage:11}),
 Object.freeze({id:'OSD44',fingerprint:'c77c10da',table:3,pdfPage:11}),
 Object.freeze({id:'OSD45',fingerprint:'a7a2bbf8',table:3,pdfPage:11}),
 Object.freeze({id:'OSD46',fingerprint:'a3a5ab0c',table:3,pdfPage:11}),
 Object.freeze({id:'OSD47',fingerprint:'bfef0aca',table:3,pdfPage:11}),
 Object.freeze({id:'OSD48',fingerprint:'16e341f3',table:3,pdfPage:11}),
 Object.freeze({id:'OSD49',fingerprint:'368eb7ea',table:3,pdfPage:11}),
 Object.freeze({id:'OSD50',fingerprint:'71ef27e3',table:3,pdfPage:12}),
 Object.freeze({id:'OSD51',fingerprint:'93374b77',table:3,pdfPage:12}),
 Object.freeze({id:'OSD52',fingerprint:'98be8b22',table:3,pdfPage:12}),
 Object.freeze({id:'OSD53',fingerprint:'d4b4e81b',table:3,pdfPage:12}),
 Object.freeze({id:'OSD54',fingerprint:'ffb73ff7',table:3,pdfPage:12}),
 Object.freeze({id:'OSD55',fingerprint:'69758a18',table:3,pdfPage:12}),
 Object.freeze({id:'OSD56',fingerprint:'021b585a',table:3,pdfPage:12}),
 Object.freeze({id:'OSD57',fingerprint:'b12f1c0e',table:3,pdfPage:12}),
 Object.freeze({id:'OSD58',fingerprint:'2b3256f8',table:3,pdfPage:12}),
 Object.freeze({id:'OSD59',fingerprint:'ea15548f',table:3,pdfPage:12}),
 Object.freeze({id:'OSD60',fingerprint:'954f0495',table:3,pdfPage:12}),
 Object.freeze({id:'OSD61',fingerprint:'02f91081',table:3,pdfPage:12}),
 Object.freeze({id:'OSD62',fingerprint:'d0b3b466',table:3,pdfPage:12}),
 Object.freeze({id:'OSD63',fingerprint:'279d86d6',table:3,pdfPage:12}),
 Object.freeze({id:'OSD64',fingerprint:'1fd02e12',table:3,pdfPage:12}),
 Object.freeze({id:'OSD65',fingerprint:'7923a71a',table:3,pdfPage:12}),
 Object.freeze({id:'OSD66',fingerprint:'3a130669',table:3,pdfPage:12}),
 Object.freeze({id:'OSD67',fingerprint:'25c401e7',table:3,pdfPage:12}),
 Object.freeze({id:'OSD68',fingerprint:'652a90cb',table:3,pdfPage:12}),
 Object.freeze({id:'OSD69',fingerprint:'b7840e06',table:3,pdfPage:12}),
 Object.freeze({id:'OSD70',fingerprint:'39240347',table:3,pdfPage:12}),
 Object.freeze({id:'OSD71',fingerprint:'86a586c5',table:3,pdfPage:12}),
 Object.freeze({id:'OSD72',fingerprint:'a51622aa',table:3,pdfPage:12}),
 Object.freeze({id:'OSD73',fingerprint:'2a15abfd',table:3,pdfPage:12}),
 Object.freeze({id:'OSD74',fingerprint:'6851c08b',table:3,pdfPage:13}),
 Object.freeze({id:'OSD75',fingerprint:'9849ce59',table:3,pdfPage:13}),
 Object.freeze({id:'OSD76',fingerprint:'6aa39ecf',table:3,pdfPage:13}),
 Object.freeze({id:'OSD77',fingerprint:'77fed1b8',table:3,pdfPage:13}),
 Object.freeze({id:'OSD78',fingerprint:'b412de61',table:3,pdfPage:13}),
 Object.freeze({id:'OSD79',fingerprint:'a8086f12',table:3,pdfPage:13}),
 Object.freeze({id:'OSD80',fingerprint:'260b05ec',table:3,pdfPage:13}),
 Object.freeze({id:'OSD81',fingerprint:'8f725923',table:3,pdfPage:13}),
 Object.freeze({id:'OSD82',fingerprint:'bc02989c',table:3,pdfPage:13}),
 Object.freeze({id:'OSD83',fingerprint:'1be183af',table:3,pdfPage:13}),
 Object.freeze({id:'OSD84',fingerprint:'b08b9fa6',table:3,pdfPage:13}),
 Object.freeze({id:'OSD85',fingerprint:'84315dad',table:3,pdfPage:13}),
 Object.freeze({id:'OSD86',fingerprint:'e1fe0bc5',table:3,pdfPage:13}),
 Object.freeze({id:'OSD87',fingerprint:'fc78ae5f',table:3,pdfPage:13}),
 Object.freeze({id:'OSD88',fingerprint:'d812b7cb',table:3,pdfPage:13}),
 Object.freeze({id:'OSD89',fingerprint:'f9939181',table:3,pdfPage:13}),
 Object.freeze({id:'OSD90',fingerprint:'dc4c50f0',table:3,pdfPage:13}),
 Object.freeze({id:'OSD91',fingerprint:'4eadcf5e',table:3,pdfPage:13}),
 Object.freeze({id:'OSD92',fingerprint:'be1fc7ea',table:3,pdfPage:13}),
 Object.freeze({id:'OSD93',fingerprint:'7026af04',table:3,pdfPage:13}),
 Object.freeze({id:'OSD94',fingerprint:'07c2a0bf',table:3,pdfPage:13}),
 Object.freeze({id:'OSD95',fingerprint:'9613ac0a',table:3,pdfPage:13}),
 Object.freeze({id:'OSD96',fingerprint:'bc68e9b2',table:3,pdfPage:13}),
 Object.freeze({id:'OSD97',fingerprint:'6dceff5e',table:3,pdfPage:13}),
 Object.freeze({id:'OSD98',fingerprint:'2777e4d0',table:3,pdfPage:14}),
 Object.freeze({id:'OSD99',fingerprint:'91b1f0d9',table:3,pdfPage:14}),
 Object.freeze({id:'OSD100',fingerprint:'e5f8ba81',table:3,pdfPage:14}),
 Object.freeze({id:'OSD101',fingerprint:'b51ee7fd',table:3,pdfPage:14}),
 Object.freeze({id:'OSD102',fingerprint:'5a20c6e7',table:3,pdfPage:14}),
 Object.freeze({id:'OSD103',fingerprint:'72728a33',table:3,pdfPage:14}),
 Object.freeze({id:'OSD104',fingerprint:'ce695d2b',table:3,pdfPage:14}),
 Object.freeze({id:'OSD105',fingerprint:'de497742',table:3,pdfPage:14}),
 Object.freeze({id:'OSD106',fingerprint:'8bfc514a',table:3,pdfPage:14}),
 Object.freeze({id:'OSD107',fingerprint:'7bf28c19',table:3,pdfPage:14}),
 Object.freeze({id:'OSD108',fingerprint:'5b0c0301',table:3,pdfPage:14}),
 Object.freeze({id:'OSD109',fingerprint:'eb6e0e45',table:3,pdfPage:14})
]);
const v52Fingerprint=v44Fingerprint;

/* V53: 28 PBP (parallel flange bearing pile) owner-held IS 808:2021
 * Table 13 source checks, physical PDF pages 40–41. Exact nominal
 * mass, area, dimensions t/T, Izz/Iyy and Zzz/Zyy compared per variant;
 * basic mass-area/geometry consistency screened; source values untouched.
 * OSD264 and curated PBP200 already checked, not duplicated.
 * Root radius, full sectional/design parameters and supplied product
 * or MTC are NOT independently certified; no licensed BIS table included.
 */
const IS808_V53_ROW_CHECKS=Object.freeze([
 Object.freeze({id:'OSD265',fingerprint:'a4e29334',table:13,pdfPage:40}),
 Object.freeze({id:'OSD266',fingerprint:'87f0ba60',table:13,pdfPage:40}),
 Object.freeze({id:'OSD267',fingerprint:'ebc3f8ba',table:13,pdfPage:40}),
 Object.freeze({id:'OSD268',fingerprint:'566ee175',table:13,pdfPage:40}),
 Object.freeze({id:'OSD269',fingerprint:'ba97fda8',table:13,pdfPage:40}),
 Object.freeze({id:'OSD270',fingerprint:'4dadc63b',table:13,pdfPage:40}),
 Object.freeze({id:'OSD271',fingerprint:'87426098',table:13,pdfPage:40}),
 Object.freeze({id:'OSD272',fingerprint:'4d914d2a',table:13,pdfPage:40}),
 Object.freeze({id:'OSD273',fingerprint:'f922dc62',table:13,pdfPage:41}),
 Object.freeze({id:'OSD274',fingerprint:'9cd6461e',table:13,pdfPage:41}),
 Object.freeze({id:'OSD275',fingerprint:'da41760f',table:13,pdfPage:41}),
 Object.freeze({id:'OSD276',fingerprint:'c98f89ba',table:13,pdfPage:41}),
 Object.freeze({id:'OSD277',fingerprint:'2b1b887e',table:13,pdfPage:41}),
 Object.freeze({id:'OSD278',fingerprint:'637c33b1',table:13,pdfPage:41}),
 Object.freeze({id:'OSD279',fingerprint:'2a1c983d',table:13,pdfPage:41}),
 Object.freeze({id:'OSD280',fingerprint:'b5f6ef82',table:13,pdfPage:41}),
 Object.freeze({id:'OSD281',fingerprint:'faef6b97',table:13,pdfPage:41}),
 Object.freeze({id:'OSD282',fingerprint:'ccf940de',table:13,pdfPage:41}),
 Object.freeze({id:'OSD283',fingerprint:'5ae1bb06',table:13,pdfPage:41}),
 Object.freeze({id:'OSD284',fingerprint:'5042615d',table:13,pdfPage:41}),
 Object.freeze({id:'OSD285',fingerprint:'ccc147fb',table:13,pdfPage:41}),
 Object.freeze({id:'OSD286',fingerprint:'74952a95',table:13,pdfPage:41}),
 Object.freeze({id:'OSD287',fingerprint:'7f71f2e4',table:13,pdfPage:41}),
 Object.freeze({id:'OSD288',fingerprint:'3177127f',table:13,pdfPage:41}),
 Object.freeze({id:'OSD289',fingerprint:'ca3c827c',table:13,pdfPage:41}),
 Object.freeze({id:'OSD290',fingerprint:'79c150c1',table:13,pdfPage:41}),
 Object.freeze({id:'OSD291',fingerprint:'184ee16e',table:13,pdfPage:41}),
 Object.freeze({id:'OSD292',fingerprint:'80ee3062',table:13,pdfPage:41})
]);
const v53Fingerprint=v44Fingerprint;

function auditIS808(row){
 const source='IS 808:2021 (Fourth Revision), owner-held BIS source, selected Tables 1–9, 12 and 13 checks';
 if(!row||!['beam','channel','column','angle','pile'].includes(row.family))
  return {status:'not-checked',source:null};
 if(row.id===IS808_V46_SC100.id){
  if(row.family!=='column'||resolveSeries(row)!=='SC'||
     v46Fingerprint(row)!==IS808_V46_SC100.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:5,sourcePdfPage:22,
    geometryChecked:false,note:'SC 100 curated value or source identity has changed since the Table 5 limited check. Quantity blocked until re-audited.'};
  return {status:'is808-mass-checked',source,sourceTable:5,sourcePdfPage:22,
   geometryChecked:false,note:'Limited direct Table 5 check: SC 100 source mass, area, D/B, t/T and available Izz/Zzz. Iyy, Zyy, flange radii/slope and full structural properties are missing from this curated row and are NOT claimed verified. Confirm delivered product and MTC separately.'};
 }
 const v53=IS808_V53_ROW_CHECKS.find(item=>item.id===row.id);
 if(v53){
  if(row.sourceId!=='osdag808'||row.family!=='pile'||resolveSeries(row)!=='PBP'||
     v53Fingerprint(row)!==v53.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:13,sourcePdfPage:v53.pdfPage,
    geometryChecked:false,note:'Checked PBP exact variant mass or section property changed. Weight calculations blocked pending re-audit.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:13,sourcePdfPage:v53.pdfPage,
   geometryChecked:false,note:'Limited IS 808:2021 Table 13 exact PBP variant audit: nominal kg/m, area, actual D/B, t/T, Izz/Iyy, Zzz/Zyy. Radii, structural adequacy, steel grade, material supply and MTC not certified.'};
 }
 const v52=IS808_V52_ROW_CHECKS.find(item=>item.id===row.id);
 if(v52){
  if(row.sourceId!=='osdag808'||row.family!=='beam'||resolveSeries(row)!=='NPB'||
     v52Fingerprint(row)!==v52.fingerprint)
    return {status:'is808-numeric-conflict',source,sourceTable:3,sourcePdfPage:v52.pdfPage,
     geometryChecked:false,note:'Checked Table 3 NPB mass variant or sectional properties changed. Nominal calculation blocked pending source re-audit.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:3,sourcePdfPage:v52.pdfPage,
   geometryChecked:false,note:'Limited direct IS 808:2021 Table 3 NPB check: exact mass variant, area, actual D/B, t/T, Izz/Iyy and Zzz/Zyy. Radii, full design data, actual supplied section, steel grade and MTC unverified.'};
 }
 const v51=IS808_V51_ROW_CHECKS.find(item=>item.id===row.id);
 if(v51){
  if(row.sourceId!=='osdag808'||row.family!=='beam'||resolveSeries(row)!=='WPB'||
     v51Fingerprint(row)!==v51.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:4,sourcePdfPage:v51.pdfPage,
    geometryChecked:false,note:'Source-checked Table 4 WPB identity or nominal properties changed. Weight calculation blocked pending re-audit.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:4,sourcePdfPage:v51.pdfPage,
   geometryChecked:false,note:'Limited owner-held IS 808:2021 Table 4 comparison of this exact WPB mass variant: nominal mass, area, D/B, web/flange thickness, Izz/Iyy and Zzz/Zyy. Complete geometry, design properties, material grade, supplied section and MTC not certified.'};
 }
 const v50=IS808_V50_ROW_CHECKS.find(item=>item.id===row.id);
 if(v50){
  if(row.sourceId!=='osdag808'||row.family!=='beam'||resolveSeries(row)!=='WPB'||
     v50Fingerprint(row)!==v50.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:4,sourcePdfPage:v50.pdfPage,
    geometryChecked:false,note:'Previously source-checked Table 4 WPB identity or numerical property has changed. Nominal quantity blocked pending re-audit.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:4,sourcePdfPage:v50.pdfPage,
   geometryChecked:false,note:'Limited direct match for exact WPB mass variant against owner-held IS 808:2021 Table 4: nominal kg/m, area, D/B, web/flange thickness, Izz/Iyy and Zzz/Zyy (2026-10-25). Flange slope/radii, detailed structural design, material grade and delivered MTC remain unverified.'};
 }
 const v49=IS808_V49_ROW_CHECKS.find(item=>item.id===row.id);
 if(v49){
  if(row.sourceId!=='osdag808'||row.family!=='beam'||resolveSeries(row)!=='WPB'||
     v49Fingerprint(row)!==v49.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:4,sourcePdfPage:v49.pdfPage,
    geometryChecked:false,note:'Verified Table 4 WPB identity, mass, dimensions or property fingerprint changed. Block weight calculations pending re-audit.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:4,sourcePdfPage:v49.pdfPage,
   geometryChecked:false,note:'Limited exact IS 808:2021 Table 4 WPB mass variant check of kg/m, area, actual D/B, web/flange thickness, Izz/Iyy and Zzz/Zyy (2026-10-25). Other dimensions, slope/radii, design suitability, material grade and delivered MTC not verified.'};
 }
 const v48=IS808_V48_ROW_CHECKS.find(item=>item.id===row.id);
 if(v48){
  if(row.sourceId!=='osdag808'||row.family!=='beam'||resolveSeries(row)!=='WPB'||
     v48Fingerprint(row)!==v48.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:4,sourcePdfPage:v48.pdfPage,
    geometryChecked:false,note:'Checked Table 4 WPB variant changed identity, mass, dimensions or sectional properties. Nominal-weight quantity remains blocked until re-audited.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:4,
   sourcePdfPage:v48.pdfPage,geometryChecked:false,
   note:'Limited direct owner-held IS 808:2021 Table 4 comparison of this exact WPB mass variant: nominal mass, area, actual D/B, web/flange thickness, Izz/Iyy, Zzz/Zyy (2026-10-25). Flange slope/radii, full structural design properties, supplied material, grade and MTC not certified.'};
 }
 const v47=IS808_V47_ROW_CHECKS.find(item=>item.id===row.id);
 if(v47){
  if(row.sourceId!=='osdag808'||row.family!=='column'||resolveSeries(row)!=='HB'||
     v47Fingerprint(row)!==v47.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:5,sourcePdfPage:22,
    geometryChecked:false,note:'Checked Table 5 HB roll variant changed source identity, mass, dimensions or section properties. Block nominal quantity until re-audited.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:5,sourcePdfPage:22,
   geometryChecked:false,note:'Limited IS 808:2021 Table 5 check for exact HB roll variant: nominal mass, area, D/B, t/T, Izz/Iyy and Zzz/Zyy. Starred variants are distinguished by the published kg/m, not depth alone (2026-10-25). Flange slope/radii, material grade, supplied product, MTC and design suitability are NOT verified.'};
 }
 const v46=IS808_V46_ROW_CHECKS.find(item=>item.id===row.id);
 if(v46){
  if(row.sourceId!=='osdag808'||row.family!=='column'||resolveSeries(row)!=='SC'||
     v46Fingerprint(row)!==v46.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:5,sourcePdfPage:22,
    geometryChecked:false,note:'A previously checked Table 5 SC row has changed identity or checked numeric properties. Block quantities pending source re-audit.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:5,sourcePdfPage:22,
   geometryChecked:false,note:'Limited direct comparison with IS 808:2021 Table 5: SC designation, nominal mass, area, D/B, t/T, Izz/Iyy, Zzz/Zyy (2026-10-24). Flange slope/root/toe radii, steel grade, structural approval and supplied material/MTC not verified.'};
 }
 const v45=IS808_V45_ROW_CHECKS.find(item=>item.id===row.id);
 if(v45){
  if(row.sourceId!=='osdag808'||row.family!=='beam'||resolveSeries(row)!=='WB'||
     v45Fingerprint(row)!==v45.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:1,sourcePdfPage:8,
    geometryChecked:false,note:'A Table 1 wide-flange beam source-checked variant has changed designation, dimensions, mass or selected property. Quantity blocked until re-audited.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:1,
   sourcePdfPage:8,geometryChecked:false,
   note:'Limited direct check with IS 808:2021 Table 1 of this exact WB variant, nominal kg/m, area, D/B, web/flange thickness, Izz/Iyy and Zzz/Zyy (2026-10-24). Flange slope/radii, full structural properties, delivered material and MTC remain unchecked.'};
 }
 const v44=IS808_V44_ROW_CHECKS.find(item=>item.id===row.id);
 if(v44){
  if(row.sourceId!=='osdag808'||row.family!=='channel'||resolveSeries(row)!=='MPC'||
     v44Fingerprint(row)!==v44.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:8,sourcePdfPage:v44.pdfPage,
    geometryChecked:false,note:'A previously Table 8 checked MPC variant has changed a checked nominal mass, dimension, property or source identity. Quantity blocked until source is re-audited.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:8,sourcePdfPage:v44.pdfPage,
   geometryChecked:false,note:'Limited source comparison with IS 808:2021 Table 8: section variant, nominal mass, area, D/B, t/T, Izz/Iyy and Zzz/Zyy (2026-10-24). Flange slope/radii, all other properties, delivered material and MTC remain unverified.'};
 }
 const v43=IS808_V43_ROW_CHECKS.find(item=>item.id===row.id);
 if(v43){
  if(row.sourceId!=='osdag808'||row.family!=='channel'||
     !['MC','JC','LC'].includes(resolveSeries(row))||
     v43Fingerprint(row)!==v43.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:v43.table,
    sourcePdfPage:v43.pdfPage,geometryChecked:false,
    note:'A previously Table 6/7 checked channel has changed its source identity, section variant or a listed numeric property. Quantity blocked until re-audited.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:v43.table,
   sourcePdfPage:v43.pdfPage,geometryChecked:false,
   note:'Limited direct match to IS 808:2021 Table '+v43.table+
    ': nominal mass, area, D/B, web/flange thickness, Izz/Iyy and Zzz/Zyy checked (2026-10-24). Flange slope, root/toe radii, full section properties, product grade and MTC not independently certified.'};
 }
 const v42=IS808_V42_ROW_CHECKS.find(item=>item.id===row.id);
 if(v42){
  if(row.sourceId!=='osdag808'||v42Fingerprint(row)!==v42.fingerprint)
   return {status:'is808-numeric-conflict',source,sourceTable:2,sourcePdfPage:v42.pdfPage,
    geometryChecked:false,note:'A previously source-checked Table 2 member has changed its identity or a numeric property. Provisional quantity blocked until re-audited.'};
  return {status:'is808-mass-area-inertia-checked',source,sourceTable:2,sourcePdfPage:v42.pdfPage,
   geometryChecked:false,note:'This exact Osdag row has a limited direct IS 808:2021 Table 2 check of nominal mass, area, D/B, t/T, Izz/Iyy and Zzz/Zyy (2026-10-24). Flange slope/radii, full structural properties, actual grade and MTC are not certified.'};
 }
 const series=resolveSeries(row),d=Number(row.depthMm),b=Number(row.widthMm);
 const t=Number(row.thicknessMm);
 const found=[...IS808_BIS_SPOT_CHECKS,...IS808_V29_SAMPLE_ROWS,...IS808_V29B_SAMPLE_ROWS].find(x=>x.series===series&&x.d===d&&x.b===b&&
   (x.t===undefined||x.t===t));
 if(!found)return {status:'not-checked',source,
   note:'This individual hot-rolled section has not been reconciled to the owner-held IS 808:2021.'};
 const equivalent=(a,b)=>Math.abs(Number(a)-b)<0.005;
 const massOK=equivalent(row.kgPerM,found.mass);
 const propPairs=[['areaCm2','area'],['ixCm4','ix'],['iyCm4','iy']];
 const available=propPairs.filter(([key])=>row[key]!==undefined&&row[key]!==null);
 const propsOK=available.every(([key,src])=>equivalent(row[key],found[src]));
 // The original BIS geometry record must be checked independently of mass.
 // Web/flange thickness, printed flange angle and fillet radii have separate
 // provenance; full geometry is never inferred from section designation.
 const geometryPairs=[['webMm','web'],['flangeMm','flange'],
  ['flangeSlopeDeg','slope'],['r1Mm','r1'],['r2Mm','r2']];
 const geometryAvailable=found.geom?geometryPairs.filter(([key])=>row[key]!==undefined&&row[key]!==null):[];
 const geometryOK=!found.geom||geometryAvailable.every(([key,src])=>found.geom[src]===undefined||equivalent(row[key],found.geom[src]));
 if(!massOK||!propsOK||!geometryOK)return {status:'is808-numeric-conflict',source,sourceTable:found.table,sourcePdfPage:found.pdfPage,geometryChecked:false,
   note:'Nominal mass, available section property or available geometric dimension disagrees with checked BIS IS 808:2021 row. Quantity calculation blocked for this record.'};
 const complete=available.length===3;
 const geometryChecked=Boolean(found.geom)&&geometryAvailable.length===geometryPairs.length&&geometryPairs.every(([,src])=>Number.isFinite(found.geom[src]));
 return {status:complete?'is808-mass-area-inertia-checked':'is808-mass-checked',source,sourceTable:found.table,sourcePdfPage:found.pdfPage,geometryChecked,
  note:complete?
   'Nominal mass, area, Izz and Iyy checked against the stated IS 808:2021 table row. '+
    (geometryChecked?'Web/flange thickness, flange slope and both listed radii separately checked. ':'')+
    'Other properties, steel grade, MTC and stock not certified.':
   'Nominal kg/m and outside dimensions checked against the stated IS 808:2021 table row; any available section properties also compared. '+
    (geometryChecked?'Web/flange thickness, flange slope and radii checked. ':'Missing geometry is NOT asserted checked. ')+
    'Grade, MTC and actual material are not certified.'};
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
// Limited RHS mass ledger: two pre-existing app values plus all twelve
// Amendment 3 RHS weight entries. Compared to owner-held IS 4923:2017
// consolidated, Amd.2 Table 2 (document p.26) and Amd.3 (document p.33).
// Do not bundle/copy the BIS PDF or treat other Table 2 rows, mechanical
// properties, or physical dimensions as verified.
const RHS_BIS_SPOT_CHECKS=Object.freeze([
 Object.freeze({h:40,w:20,t:2,mass:1.68,area:2.14,ix:4.05,iy:1.34,edition:'Amendment 2 Table 2; unchanged by Amendment 3'}),
 Object.freeze({h:50,w:25,t:2,mass:2.15,area:2.74,ix:8.38,iy:2.81,edition:'Amendment 2 Table 2; unchanged by Amendment 3'}),
 Object.freeze({h:120,w:60,t:5,mass:12.84,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:127,w:50,t:3.6,mass:9.34,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:150,w:100,t:4,mass:14.88,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:260,w:180,t:12,mass:75.47,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:127,w:50,t:3,mass:7.87,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:150,w:100,t:5,mass:18.34,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:150,w:100,t:6,mass:21.69,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:150,w:100,t:6.3,mass:22.68,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:150,w:100,t:8,mass:28.10,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:150,w:100,t:10,mass:34.09,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:150,w:100,t:12,mass:39.67,edition:'Amendment 3 correction, June 2024'}),
 Object.freeze({h:150,w:100,t:12.5,mass:41.00,edition:'Amendment 3 correction, June 2024'})
]);
// Additional non-corrected RHS Table 2 nominal values.
const RHS_BIS_ADDITIONAL=Object.freeze([
 Object.freeze({h:40,w:20,t:2.5,mass:2.03,area:2.59,ix:4.69,iy:1.54}),
 Object.freeze({h:50,w:25,t:2.5,mass:2.62,area:3.34,ix:9.89,iy:3.28}),
 Object.freeze({h:80,w:40,t:3,mass:5.19,area:6.61,ix:52.25,iy:17.56}),
 Object.freeze({h:100,w:50,t:4,mass:8.59,area:10.95,ix:134.14,iy:44.95}),
 Object.freeze({h:200,w:100,t:6,mass:26.40,area:33.63,ix:1703,iy:577}),
 Object.freeze({h:40,w:20,t:3,mass:2.36,area:3.01,ix:5.21,iy:1.68}),
 Object.freeze({h:50,w:25,t:2.9,mass:2.98,area:3.80,ix:10.93,iy:3.60}),
 Object.freeze({h:50,w:30,t:3,mass:3.30,area:4.21,ix:12.83,iy:5.70}),
 Object.freeze({h:60,w:40,t:2.5,mass:3.60,area:4.59,ix:22.07,iy:11.74}),
 Object.freeze({h:60,w:40,t:4,mass:5.45,area:6.95,ix:30.99,iy:16.28}),
 Object.freeze({h:70,w:30,t:4,mass:5.45,area:6.95,ix:37.23,iy:9.42}),
 Object.freeze({h:80,w:40,t:4,mass:6.71,area:8.55,ix:64.79,iy:21.49}),
 Object.freeze({h:90,w:50,t:3,mass:6.13,area:7.81,ix:81.85,iy:32.74}),
 Object.freeze({h:100,w:60,t:4,mass:9.22,area:11.75,ix:152.58,iy:68.68}),
 Object.freeze({h:120,w:80,t:4,mass:11.73,area:14.95,ix:294.59,iy:157.29}),
 Object.freeze({h:80,w:50,t:2,mass:3.88,area:4.94,ix:43.44,iy:21.06}),
 Object.freeze({h:120,w:80,t:3,mass:8.96,area:11.41,ix:230.20,iy:123.43}),
 Object.freeze({h:180,w:100,t:6,mass:24.52,area:31.23,ix:1309.61,iy:523.83}),
 Object.freeze({h:300,w:100,t:6,mass:35.82,area:45.63,ix:4777.00,iy:842.00}),
 Object.freeze({h:500,w:300,t:10,mass:120.44,area:153.43,ix:52867.00,iy:24127.00}),
 Object.freeze({h:500,w:300,t:12,mass:143.29,area:182.54,ix:62169.00,iy:28294.00})
]);
const SHS_BIS_SAMPLES=Object.freeze([
 Object.freeze({s:25,t:2,mass:1.36,area:1.74,ix:1.48}),
 Object.freeze({s:32,t:2,mass:1.80,area:2.30,ix:3.36}),
 Object.freeze({s:40,t:2,mass:2.31,area:2.94,ix:6.94}),
 Object.freeze({s:50,t:2,mass:2.93,area:3.74,ix:14.15}),
 Object.freeze({s:60,t:3,mass:5.19,area:6.61,ix:35.13}),
 Object.freeze({s:100,t:4,mass:11.73,area:14.95,ix:226.35}),
 Object.freeze({s:30,t:2,mass:1.68,area:2.14,ix:2.72}),
 Object.freeze({s:40,t:3,mass:3.30,area:4.21,ix:9.32}),
 Object.freeze({s:50,t:2.5,mass:3.60,area:4.59,ix:16.94}),
 Object.freeze({s:50,t:4,mass:5.45,area:6.95,ix:23.74}),
 Object.freeze({s:60,t:4,mass:6.71,area:8.55,ix:43.55}),
 Object.freeze({s:70,t:3,mass:6.13,area:7.81,ix:57.53}),
 Object.freeze({s:75,t:4.5,mass:9.55,area:12.17,ix:98.55}),
 Object.freeze({s:80,t:4,mass:9.22,area:11.75,ix:111.04}),
 Object.freeze({s:90,t:5,mass:12.84,area:16.36,ix:192.93}),
 Object.freeze({s:100,t:6,mass:16.98,area:21.63,ix:311.47}),
 Object.freeze({s:20,t:2,mass:1.05,area:1.34,ix:0.69}),
 Object.freeze({s:25,t:2.5,mass:1.64,area:2.09,ix:1.69}),
 Object.freeze({s:45,t:4,mass:4.83,area:6.15,ix:16.61}),
 Object.freeze({s:150,t:6,mass:26.40,area:33.63,ix:1146.00}),
 Object.freeze({s:250,t:12,mass:86.77,area:110.54,ix:10254.00}),
 Object.freeze({s:400,t:16,mass:187.75,area:239.18,ix:57946.00})
]);
// Reject any 0.01 discrepancy where the BIS table specifies 2 decimals.
const agrees=(got,expected)=>got!==undefined&&got!==null&&Math.abs(Number(got)-expected)<0.005;
const massAgrees=(got,expected)=>got!==undefined&&got!==null&&Math.abs(Number(got)-expected)<0.005;
// 'not-listed' only for the TWO manually checked historic thicknesses; all
// other unknown sizes are 'not-checked', not assumed invalid or current.
function standardAudit(row){
 if(!row)return {status:'not-checked',source:null};
 if(['beam','channel','column','angle','pile'].includes(row.family))return auditIS808(row);
 if(row.series==='SHS'||row.series==='RHS'){
  const source='IS 4923:2017, Amendment 2 (2022) and Amendment 3 (June 2024)';
  const t=Number(row.thicknessMm);
  // Source-wide numerical QA scan, not a BIS acceptance tolerance:
  // 190 SHS + 216 RHS published Amendment 2 rows checked internally.
  // RHS 120x80x6.0 in Table 2 prints 16.98 kg/m but 2.63 cm²; mass
  // implies about 21.63 cm² at nominal density. No invented corrigendum.
  // Quarantine this exact designation even if later imported from another
  // catalogue source until its amended properties are authoritatively fixed.
  if(row.series==='RHS'&&Number(row.depthMm)===120&&
     Number(row.widthMm)===80&&t===6)return {
    status:'source-numeric-hold',source,
    note:'RHS 120×80×6: amended Table 2 prints 16.98 kg/m and 2.63 cm²; these disagree. This designation is on hold pending an authoritative correction. Do not treat the implied area as a BIS-approved replacement.'};
  if(Number.isFinite(row.areaCm2)&&Number(row.areaCm2)>0&&
     Number.isFinite(row.kgPerM)&&Number(row.kgPerM)>0&&
     Math.abs(Number(row.kgPerM)-Number(row.areaCm2)*0.785)/Number(row.kgPerM)>0.02)
   return {status:'mass-area-conflict',source,
    note:'Nominal mass and section area fail the app internal density consistency check (>2% discrepancy). This threshold is an audit alarm, NOT a BIS acceptance tolerance. Quantity is blocked pending source review.'};
  if(Number.isFinite(t)&&t>0&&t<2)return {
   status:'outside-current-scope',source,
   note:'Wall thickness below 2 mm is outside amended IS 4923 structural-section licensing scope (BIS circular 4 June 2024). Do not treat this as a current structural IS 4923 section; check the relevant product specification.'};
  if(row.series==='SHS'){
   const size=Number(row.depthMm),width=Number(row.widthMm);
   const shs=SHS_BIS_SAMPLES.find(x=>x.s===size&&x.s===width&&x.t===t);
   if(!shs)return {status:'not-checked',source,
    note:'This SHS size has not been manually compared with amended BIS Table 1.'};
   if(massAgrees(row.kgPerM,shs.mass)&&agrees(row.areaCm2,shs.area)&&
      agrees(row.ixCm4,shs.ix)&&agrees(row.iyCm4,shs.ix))
    return {status:'shs-row-checked',source,
     note:'SHS nominal mass and available area/inertia values agree with IS 4923:2017 Amendment 2 Table 1. Other properties, delivered material, MTC and design acceptance not certified.'};
   return {status:'shs-row-conflict',source,
    note:'SHS nominal mass, area or inertia disagrees with the manually checked BIS Table 1 record, or a required value is missing. Quantity calculation is blocked.'};
  }
  if(row.series==='RHS'){
   const h=Number(row.depthMm),w=Number(row.widthMm);
   const bis=RHS_BIS_SPOT_CHECKS.find(x=>x.h===h&&x.w===w&&x.t===t)||
    RHS_BIS_ADDITIONAL.find(x=>x.h===h&&x.w===w&&x.t===t);
   if(bis){
    // Table values have two decimal digits. A 0.01 kg/m mismatch is a conflict.
    const massOK=massAgrees(row.kgPerM,bis.mass);
    const areaOK=bis.area===undefined||agrees(row.areaCm2,bis.area);
    const ixOK=bis.ix===undefined||agrees(row.ixCm4,bis.ix);
    const iyOK=bis.iy===undefined||agrees(row.iyCm4,bis.iy);
    if(massOK&&areaOK&&ixOK&&iyOK)return {status:'rhs-weight-checked',source,
     note:bis.area===undefined?
      'RHS nominal kg/m only checked against Amendment 3, June 2024. Other section properties (including area/inertia), delivered material and MTC are not certified.':
      'RHS nominal kg/m checked, along with area, Ix and Iy, against Amendment 2 Table 2 (unchanged by Amendment 3). Other section properties beyond sampled mass/area/inertia, delivered material and MTC are not certified.'};
    return {status:'rhs-weight-conflict',source,
     note:'Source mass, area or inertia disagrees with the checked BIS amended RHS record, or a required value is missing. Quantity calculation is blocked.'};
   }
   return {status:'amendment3-review',source,
    note:'BIS Amendment 3 corrected some RHS nominal weights; this particular size is NOT manually reconciled with amended BIS Table 2.'};
  }
  return {status:'not-checked',source};
 }
 const source='IS 1161:2014, Amendment 2 (Aug 2023), replacement Table 1';
 if(row.series!=='CHS')return {status:'not-checked',source:null};
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
const api=Object.freeze({SOURCES,sections,categories,codeReferences,SERIES,resolveSeries,availableSeries,auditRow,standardAudit,collisionGroups,search,byId,rhsAuditSampleCount:RHS_BIS_SPOT_CHECKS.length+RHS_BIS_ADDITIONAL.length,shsAuditSampleCount:SHS_BIS_SAMPLES.length,is808AuditSampleCount:IS808_BIS_SPOT_CHECKS.length,is808V29AuditSampleCount:IS808_V29_SAMPLE_ROWS.length,is808V29BAuditSampleCount:IS808_V29B_SAMPLE_ROWS.length,is808V42AuditSampleCount:IS808_V42_ROW_CHECKS.length,is808V43AuditSampleCount:IS808_V43_ROW_CHECKS.length,is808V44AuditSampleCount:IS808_V44_ROW_CHECKS.length,is808V45AuditSampleCount:IS808_V45_ROW_CHECKS.length,is808V46AuditSampleCount:IS808_V46_ROW_CHECKS.length,is808V47AuditSampleCount:IS808_V47_ROW_CHECKS.length,is808V48AuditSampleCount:IS808_V48_ROW_CHECKS.length,is808V49AuditSampleCount:IS808_V49_ROW_CHECKS.length,is808V50AuditSampleCount:IS808_V50_ROW_CHECKS.length,is808V51AuditSampleCount:IS808_V51_ROW_CHECKS.length,is808V52AuditSampleCount:IS808_V52_ROW_CHECKS.length,is808V53AuditSampleCount:IS808_V53_ROW_CHECKS.length,is808TotalLimitedAuditSamples:IS808_BIS_SPOT_CHECKS.length+IS808_V29_SAMPLE_ROWS.length+IS808_V29B_SAMPLE_ROWS.length,openDataCount:(root.PWDSteelOsdag||{}).count||0});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDSteelCatalog=api;
})(typeof window!=='undefined'?window:globalThis);