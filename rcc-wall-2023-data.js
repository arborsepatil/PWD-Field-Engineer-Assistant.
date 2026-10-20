/* PWD 2023 Road Bridge Standard Plans, Part 2, Section G.
 * Exact transcription of original dimensions and bottom-row material
 * quantities from the printed drawings (PDF pages 210–212).
 * 27 finite standard height records. No interpolation or structural design.
 * Original table units: dimensions mm, CONCRETE m3, STEEL kg,
 * STEEL PER CUBIC m kg/m3. Do not silently infer unit running length.
 * Source GAD: PDF p.209, drawing RETWALL/151-1/4.
 * The book's 25 t/m2, 4.5m steel-per-cubic-m figure is internally inconsistent:
 * printed 156.69 / 2.82 = 55.56 kg/m3, printed ratio is 56.3.
 */
(function(root){
'use strict';
const source={
  "10": {
    "page": 210,
    "drawing": "DC-BR/TP-2023/RETWALL/151-2/4",
    "heights": [
      2,
      2.5,
      3,
      3.5,
      4,
      4.5,
      5
    ],
    "A": [
      2000,
      2500,
      3000,
      3500,
      4000,
      4500,
      5000
    ],
    "B": [
      1750,
      2000,
      2400,
      2800,
      3300,
      3800,
      4200
    ],
    "C": [
      1700,
      2200,
      2700,
      3200,
      3700,
      4200,
      4700
    ],
    "D": [
      300,
      400,
      600,
      800,
      1000,
      1300,
      1500
    ],
    "E": [
      300,
      300,
      350,
      400,
      450,
      500,
      600
    ],
    "F": [
      1150,
      1300,
      1450,
      1600,
      1850,
      2000,
      2100
    ],
    "G": [
      300,
      300,
      350,
      400,
      400,
      450,
      600
    ],
    "H": [
      300,
      300,
      300,
      300,
      300,
      300,
      300
    ],
    "I": [
      300,
      300,
      300,
      300,
      300,
      300,
      300
    ],
    "concreteM3": [
      1.035,
      1.26,
      1.65,
      2.08,
      2.52,
      3.08,
      3.96
    ],
    "steelKg": [
      57.28,
      71.86,
      92.49,
      113.24,
      136.56,
      159.69,
      175.58
    ],
    "steelKgPerM3": [
      55.4,
      57.1,
      56.1,
      54.4,
      54.1,
      51.9,
      44.4
    ]
  },
  "15": {
    "page": 211,
    "drawing": "DC-BR/TP-2023/RETWALL/151-3/4",
    "heights": [
      2,
      2.5,
      3,
      3.5,
      4,
      4.5,
      5,
      5.5,
      6,
      6.5
    ],
    "A": [
      2000,
      2500,
      3000,
      3500,
      4000,
      4500,
      5000,
      5500,
      6000,
      6500
    ],
    "B": [
      1750,
      1900,
      2250,
      2600,
      3000,
      3400,
      3800,
      4100,
      4500,
      5000
    ],
    "C": [
      1700,
      2200,
      2700,
      3200,
      3700,
      4200,
      4700,
      5200,
      5700,
      6200
    ],
    "D": [
      250,
      400,
      500,
      500,
      600,
      800,
      1000,
      1200,
      1400,
      1700
    ],
    "E": [
      300,
      300,
      350,
      400,
      450,
      500,
      550,
      600,
      650,
      650
    ],
    "F": [
      1200,
      1200,
      1400,
      1700,
      1950,
      2100,
      2250,
      2300,
      2450,
      2650
    ],
    "G": [
      300,
      300,
      350,
      350,
      400,
      450,
      500,
      550,
      600,
      600
    ],
    "H": [
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300
    ],
    "I": [
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300
    ],
    "concreteM3": [
      1.035,
      1.23,
      1.6,
      1.95,
      2.42,
      2.93,
      3.48,
      4.04,
      4.68,
      5.15
    ],
    "steelKg": [
      57.45,
      73.1,
      90.03,
      116.88,
      131.98,
      157.22,
      198.53,
      229.31,
      290.31,
      372.77
    ],
    "steelKgPerM3": [
      55.6,
      59.5,
      56.3,
      59.8,
      54.5,
      53.7,
      57,
      56.7,
      62,
      72.4
    ]
  },
  "25": {
    "page": 212,
    "drawing": "DC-BR/TP-2023/RETWALL/151-4/4",
    "heights": [
      4,
      4.5,
      5,
      5.5,
      6,
      6.5,
      7,
      7.5,
      8,
      8.5
    ],
    "A": [
      4000,
      4500,
      5000,
      5500,
      6000,
      6500,
      7000,
      7500,
      8000,
      8500
    ],
    "B": [
      2800,
      3100,
      3400,
      3700,
      4000,
      4300,
      4600,
      5000,
      5600,
      5700
    ],
    "C": [
      3700,
      4200,
      4700,
      5200,
      5700,
      6200,
      6700,
      7200,
      7700,
      8200
    ],
    "D": [
      600,
      550,
      650,
      700,
      800,
      900,
      1100,
      1400,
      1600,
      1600
    ],
    "E": [
      450,
      500,
      600,
      600,
      650,
      700,
      750,
      800,
      850,
      900
    ],
    "F": [
      1750,
      2050,
      2150,
      2400,
      2550,
      2700,
      2750,
      2800,
      3150,
      3200
    ],
    "G": [
      400,
      450,
      500,
      500,
      600,
      700,
      750,
      800,
      850,
      900
    ],
    "H": [
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300
    ],
    "I": [
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300,
      300
    ],
    "concreteM3": [
      2.35,
      2.82,
      3.44,
      3.79,
      4.46,
      5.19,
      5.86,
      6.63,
      7.56,
      8.25
    ],
    "steelKg": [
      133.61,
      156.69,
      213.57,
      238.11,
      288.92,
      349.15,
      403.91,
      507.39,
      569.03,
      651.59
    ],
    "steelKgPerM3": [
      56.8,
      56.3,
      62,
      62.9,
      64.8,
      67.3,
      68.9,
      76.5,
      75.3,
      79
    ]
  }
};
const keys=['A','B','C','D','E','F','G','H','I'];
function heightsFor(sbc) {
  const group=source[String(sbc)];
  return group?group.heights.slice():[];
}
function recordFor(sbc,height) {
  const group=source[String(sbc)];
  if(!group)return null;
  const value=Number(height);
  if(!Number.isFinite(value))return null;
  const index=group.heights.indexOf(value);
  if(index===-1)return null; // NEVER interpolate between type-plan heights.
  const dimensions={};
  for(const letter of keys)dimensions[letter]=group[letter][index];
  const concreteM3=group.concreteM3[index];
  const steelKg=group.steelKg[index];
  const printedSteelKgPerM3=group.steelKgPerM3[index];
  const computedSteelKgPerM3=steelKg/concreteM3;
  return Object.freeze({
    publication:2023,section:'G',sbc:Number(sbc),heightM:value,
    drawing:group.drawing,pdfPage:group.page,gadPage:209,gadDrawing:'DC-BR/TP-2023/RETWALL/151-1/4',
    dimensionsMm:Object.freeze(dimensions),concreteM3,steelKg,printedSteelKgPerM3,
    computedSteelKgPerM3,sourceRatioDiscrepancy:Math.abs(computedSteelKgPerM3-printedSteelKgPerM3)>0.26,
    scope:'SOURCE TABLE LOOKUP ONLY; not independent structural design, actual measurement or approval'
  });
}
const api=Object.freeze({heightsFor,recordFor,sbcs:[10,15,25],count:27});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDRCC2023=api;
})(typeof window!=='undefined'?window:globalThis);
