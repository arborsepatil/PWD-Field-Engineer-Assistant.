/* PWD standard road bridge type plans 2023 Part 2, Section G:
 * 151-2/4 (SBC 10 t/m²), PDF 210; 151-3/4 (15), PDF 211;
 * 151-4/4 (25), PDF 212. Transcribed MK1–MK11 reinforcement details.
 * Codes are DIA (mm) @ centre-to-centre SPACING (mm).
 * '—' faithfully means no bar entry on the printed sheet.
 * Do not derive bar lengths, bend/cut quantities, lap requirements, member
 * suitability or actual steel weight from spacing alone.
 * Original general arrangement sheet: PDF 209, 151-1/4.
 */
(function(root){
'use strict';
const source={
  "10": {
    "page": 210,
    "heights": [
      2,
      2.5,
      3,
      3.5,
      4,
      4.5,
      5
    ],
    "marks": {
      "MK1": [
        "10@200",
        "10@200",
        "10@200",
        "10@220",
        "10@220",
        "10@200",
        "10@200"
      ],
      "MK2": [
        "—",
        "—",
        "—",
        "10@220",
        "10@220",
        "10@200",
        "10@200"
      ],
      "MK3": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200"
      ],
      "MK4": [
        "10@250",
        "10@250",
        "10@220",
        "10@220",
        "10@220",
        "10@200",
        "10@200"
      ],
      "MK5": [
        "10@250",
        "10@250",
        "10@220",
        "10@220",
        "10@220",
        "10@200",
        "10@200"
      ],
      "MK6": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200"
      ],
      "MK7": [
        "10@200",
        "10@180",
        "10@200",
        "10@200",
        "12@200",
        "12@200",
        "12@200"
      ],
      "MK8": [
        "—",
        "—",
        "10@200",
        "10@200",
        "10@200",
        "12@200",
        "12@200"
      ],
      "MK9": [
        "10@200",
        "10@180",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200"
      ],
      "MK10": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200"
      ],
      "MK11": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200"
      ]
    }
  },
  "15": {
    "page": 211,
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
    "marks": {
      "MK1": [
        "10@200",
        "10@200",
        "10@200",
        "10@220",
        "10@200",
        "10@200",
        "10@200",
        "12@200",
        "12@200",
        "12@180"
      ],
      "MK2": [
        "—",
        "—",
        "—",
        "10@220",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "12@180"
      ],
      "MK3": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200"
      ],
      "MK4": [
        "10@250",
        "10@250",
        "10@220",
        "10@220",
        "10@200",
        "10@180",
        "10@200",
        "12@200",
        "16@200",
        "16@180"
      ],
      "MK5": [
        "10@250",
        "10@250",
        "10@220",
        "10@220",
        "10@200",
        "10@180",
        "12@200",
        "12@200",
        "12@200",
        "12@180"
      ],
      "MK6": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200"
      ],
      "MK7": [
        "10@200",
        "10@150",
        "10@200",
        "12@200",
        "12@200",
        "12@200",
        "16@220",
        "16@200",
        "16@200",
        "16@180"
      ],
      "MK8": [
        "—",
        "—",
        "10@200",
        "10@200",
        "10@200",
        "12@200",
        "12@220",
        "12@200",
        "16@200",
        "16@180"
      ],
      "MK9": [
        "10@200",
        "10@150",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@220",
        "10@200",
        "10@200",
        "10@180"
      ],
      "MK10": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@180",
        "10@150"
      ],
      "MK11": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@150"
      ]
    }
  },
  "25": {
    "page": 212,
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
    "marks": {
      "MK1": [
        "10@220",
        "10@200",
        "10@200",
        "12@200",
        "12@200",
        "12@200",
        "12@200",
        "12@190",
        "12@180",
        "12@200"
      ],
      "MK2": [
        "10@220",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "12@200",
        "12@190",
        "12@180",
        "16@200"
      ],
      "MK3": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200"
      ],
      "MK4": [
        "12@200",
        "12@200",
        "16@200",
        "16@200",
        "16@180",
        "16@200",
        "16@190",
        "16@180",
        "16@180",
        "20@200"
      ],
      "MK5": [
        "10@200",
        "12@200",
        "12@200",
        "12@200",
        "12@180",
        "16@200",
        "16@190",
        "20@180",
        "20@180",
        "20@200"
      ],
      "MK6": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@180",
        "10@180",
        "10@130",
        "10@130",
        "10@120"
      ],
      "MK7": [
        "12@200",
        "12@200",
        "16@220",
        "16@200",
        "16@200",
        "16@180",
        "16@200",
        "16@180",
        "20@200",
        "20@180"
      ],
      "MK8": [
        "10@200",
        "12@200",
        "12@220",
        "12@200",
        "16@200",
        "16@180",
        "20@200",
        "20@180",
        "20@200",
        "20@180"
      ],
      "MK9": [
        "10@200",
        "10@200",
        "10@220",
        "10@200",
        "10@200",
        "10@180",
        "10@180",
        "10@180",
        "10@180",
        "10@180"
      ],
      "MK10": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@180",
        "10@170",
        "10@150",
        "10@130",
        "10@120",
        "10@110"
      ],
      "MK11": [
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@200",
        "10@150",
        "10@150",
        "10@150",
        "10@150",
        "10@150"
      ]
    }
  }
};
const marks=["MK1","MK2","MK3","MK4","MK5","MK6","MK7","MK8","MK9","MK10","MK11"];
// GAD, p.209: paraphrased locations, not a derived cut-length or bending design.
const markLocations={
  "MK1": "Raft bottom · primary continuous bar",
  "MK2": "Raft bottom · additional toe-side bar",
  "MK3": "Raft bottom · distribution bar",
  "MK4": "Raft top · primary continuous bar",
  "MK5": "Raft top · additional heel-side bar",
  "MK6": "Raft top · distribution bar",
  "MK7": "Stem · earth face · primary continuous bar",
  "MK8": "Stem · earth face · additional bar",
  "MK9": "Stem · non-earth face · primary continuous bar",
  "MK10": "Stem · earth face · distribution bar",
  "MK11": "Stem · non-earth face · distribution bar"
};
function reinforcementFor(sbc,height){
  if(height===''||height===null||height===undefined)return null;
  const key=String(sbc);
  const group=source[key];
  if(!group)return null;
  const n=Number(height);
  if(!Number.isFinite(n))return null;
  const i=group.heights.indexOf(n);
  if(i<0)return null; // Only exact type-plan rows.
  const bars=marks.map(mark=>{
    const code=group.marks[mark][i];
    if(code==='—')return Object.freeze({mark,location:markLocations[mark],present:false,diameterMm:null,spacingMm:null});
    const [diameterMm,spacingMm]=code.split('@').map(Number);
    return Object.freeze({mark,location:markLocations[mark],present:true,diameterMm,spacingMm});
  });
  return Object.freeze({
    sbc:Number(sbc),heightM:n,pdfPage:group.page,
    gadPage:209,marks:Object.freeze(bars),
    scope:'TRANSCRIBED DIAMETER AND C/C SPACING ONLY; NOT A BAR BENDING SCHEDULE'
  });
}
const api=Object.freeze({reinforcementFor,markNames:Object.freeze(marks),count:27});
if(typeof module==='object'&&module.exports)module.exports=api;
root.PWDRCC2023Rebar=api;
})(typeof window!=='undefined'?window:globalThis);
