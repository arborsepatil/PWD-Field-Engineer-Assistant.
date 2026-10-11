/* MoRTH Fifth Revision (2013), Clauses 2702–2703.
   Concise source-supported bridge wearing coat and barrier QC checks; not a laboratory test procedure. */
(() => {
  if (!location.pathname.endsWith('/qc.html')) return;
  if (document.getElementById('morth-qc-2700')) return;
  const target=[...document.querySelectorAll('h3')].find(h=>h.textContent.startsWith('DLC · Dry Lean Cement Concrete'))?.closest('.qc-card');
  if (!target) return;
  const card=document.createElement('div');
  card.id='morth-qc-2700';card.className='qc-card';card.style.marginTop='10px';
  const heading=document.createElement('h3');heading.textContent='MoRTH 2702–2703 — Bridge Wearing Coat / Barrier QC';card.appendChild(heading);
  const checks=[
    '2702.1: Verify chosen deck system: BC 50 mm; BC 40 mm + mastic asphalt 25 mm; SMA 50 mm; or mastic asphalt 50 mm. Clean deck and apply tack coat; Section 500 governs.',
    '2702.2: CC wearing coat thickness 75 mm, minimum M30, with 8 mm bars @150 mm each way at mid-depth; within 1 m of expansion joint, 8 mm bars @75 mm each way.',
    '2702.2–3: Start curing early, keep carriageway/footpath non-skid, and verify specified deck cross slope of 2.5%.',
    '2702.4–5: Verify drawing-specific profile correction; overlay of existing bridge wearing coat is NOT permitted—repair or replacement is required.',
    '2703.1: Do not construct railing/crash barrier before span is self-supporting and falsework released; post verticality deviation ≤6 mm in 3 m; post pockets non-shrink mortar.',
    '2703.1–2: Verify correct approved IRC:5/IRC:6 drawing, railing-joint function, alignment and protective coatings; non-galvanized default is one shop coat + three after erection unless drawing overrides.',
    '2703.3: Cast-in-situ work follows Sections 1600/1700; for bridges/viaducts >500 m, source specifies horizontal slip forms for crash barriers; posts cast in one pour.',
    '2703.4: Precast max aggregate 12 mm; M30 railing and M40 crash barrier minimum; damp curing ≥10 days, protected from sun/wind; reject chipped, marred or cracked members.',
    'SOURCE-CONTROL HOLD: Last sentence of Clause 2703.2 concerning rail elements “before erection” is incomplete in the printed source. Do not guess missing requirement.'
  ];
  const ul=document.createElement('ul');
  for(const line of checks){const li=document.createElement('li');li.textContent=line;ul.appendChild(li);}
  card.appendChild(ul);
  const note=document.createElement('p');
  note.textContent='Source-linked field inspection reference only. No new laboratory sampling frequency, structural design approval or contract-specific acceptance rule is implied. Approved drawings and Engineer decisions remain controlling.';
  card.appendChild(note);
  target.insertAdjacentElement('beforebegin',card);
})();
