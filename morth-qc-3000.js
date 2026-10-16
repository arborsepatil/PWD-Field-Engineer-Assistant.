/* MoRTH Fifth Revision (2013), Section 3000 maintenance of roads.
  Source-backed documentary QC only: 3001–3003; 3004–3005 index-only. */
(() => {
  if(!location.pathname.endsWith('/qc.html'))return;
  if(document.getElementById('morth-qc-3000'))return;
  const anchor=document.getElementById('morth-qc-2900');
  if(!anchor)return;
  const card=document.createElement('div');
  card.id='morth-qc-3000';
  card.className='qc-card';
  card.style.marginTop='10px';
  const h=document.createElement('h3');
  h.textContent='MoRTH 3001–3003 · Road Maintenance — QC & Payment Records';
  card.appendChild(h);
  const checks=[
  "3001: Keep contract/Engineer scope instruction, location, approved materials and finished alignment/level records.",
  "3002.2: Verify rain-cut restoration soil traceability against Clause 305.2 and the sanctioned repair location.",
  "3002.3: Retain condition surveys, finished lines/levels/slopes and approved compaction evidence; no site earthwork procedure.",
  "3002.4–3002.5: Measure rain-cut restoration in m³ and reconcile included preparation, soil and compaction costs before billing.",
  "3003.2: Verify approved shoulder select-soil compliance with Clause 305 and identify deficient/surplus locations.",
  "3003.3: Retain authorised lab MDD and field-density reports; compare reported field dry density with the source 97% minimum under Engineer review.",
  "3003.3: Verify the final shoulder crossfall, grade and level against sanctioned drawings or instructions.",
  "3003.4–3003.5: Measure shoulder maintenance in m² and check contract rate inclusions before proposing separate items.",
  "HOLD: Clauses 3004–3005 are index-only here. No excavation, compaction equipment, bituminous/epoxy material-use or traffic operating instructions; no automatic acceptance."
];
  const ul=document.createElement('ul');
  checks.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li)});
  card.appendChild(ul);
  const p=document.createElement('p');
  p.textContent='Inspection and billing reference only. Engineer acceptance and the approved contract govern; no automatic permission or certification.';
  card.appendChild(p);
  anchor.insertAdjacentElement('afterend',card);
})();
