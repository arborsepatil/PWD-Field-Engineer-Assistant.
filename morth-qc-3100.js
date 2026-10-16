/* MoRTH 2013 Fifth Revision Section 3100 — reinforced soil documentary QC.
   No physical construction method, geotechnical design or structural sign-off. */
(() => {
  if(!location.pathname.endsWith('/qc.html')) return;
  if(document.getElementById('morth-qc-3100')) return;
  const anchor=document.getElementById('morth-qc-3000');
  if(!anchor)return;
  const card=document.createElement('div');
  card.id='morth-qc-3100';
  card.className='qc-card';card.style.marginTop='10px';
  const h=document.createElement('h3');
  h.textContent='MoRTH 3101–3110 · Reinforced Soil — QC & Payment';
  card.appendChild(h);
  const checks=[
  "3101–3102: Verify approved wall/slope design, geotechnical investigation, contractor system identity, drawings and any ground improvement plan.",
  "3103: Check geosynthetic/metallic reinforcement certifications, roll/lot labels, durability-reduction-factor and applicable project-specific laboratory reports.",
  "3104: Confirm reinforced fill source and laboratory test results including drained strength, gradation, plasticity and soil/reinforcement electrochemical compatibility; general fill requirement φ ≥30°.",
  "3105: Verify specified facia system, approved geometry, concrete-panel/block grade and traceable facing-to-reinforcement connection test records.",
  "3106: Record approved founding and drainage details, fill-layer identity, compaction/thickness evidence and construction/alignment tolerance inspections (source 200 mm compacted maximum, 97% laboratory MDD).",
  "3107: Identify reinforced slope drawing and fill testing; note source-specific slope-fill minimum φ ≥28°, distinguished from general reinforced-fill requirements.",
  "3108: Check performance-bond provision ONLY where required by contract; printed source says at least 20 years when specified.",
  "3109: Verify finished face area in m² for reinforced wall/slope along designed inclination; friction slab/crash barrier separately measured in linear metres.",
  "3110: Check reinforced soil rate inclusions and separate payment for friction slab/crash barrier; no SSR rupee rates.",
  "LIMIT: Inspection/MB reference only. Reinforcement design, global/internal stability, excavation, lifting, compaction-plant operation, structural approval and safe-to-open decisions are not provided."
];
  const ul=document.createElement('ul');
  checks.forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.appendChild(li)});
  card.appendChild(ul);
  const p=document.createElement('p');
  p.textContent='Source: MoRTH Fifth Revision (2013), Section 3100 pp.801–812. Engineer and approved design govern all site decisions.';
  card.appendChild(p);
  anchor.insertAdjacentElement('afterend',card);
})();
