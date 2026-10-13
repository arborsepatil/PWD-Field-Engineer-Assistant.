/* MoRTH Fifth Revision (2013), Clauses 2702–2709.
   Concise source-supported bridge wearing coat and barrier QC checks; not a laboratory test procedure. */
(() => {
  if (!location.pathname.endsWith('/qc.html')) return;
  if (document.getElementById('morth-qc-2700')) return;
  const target=[...document.querySelectorAll('h3')].find(h=>h.textContent.startsWith('DLC · Dry Lean Cement Concrete'))?.closest('.qc-card');
  if (!target) return;
  const card=document.createElement('div');
  card.id='morth-qc-2700';card.className='qc-card';card.style.marginTop='10px';
  const heading=document.createElement('h3');heading.textContent='MoRTH 2702–2709 — Bridge Deck, Approach / Drainage QC';card.appendChild(heading);
  const checks=[
    '2702.1: Verify chosen deck system: BC 50 mm; BC 40 mm + mastic asphalt 25 mm; SMA 50 mm; or mastic asphalt 50 mm. Clean deck and apply tack coat; Section 500 governs.',
    '2702.2: CC wearing coat thickness 75 mm, minimum M30, with 8 mm bars @150 mm each way at mid-depth; within 1 m of expansion joint, 8 mm bars @75 mm each way.',
    '2702.2–3: Start curing early, keep carriageway/footpath non-skid, and verify specified deck cross slope of 2.5%.',
    '2702.4–5: Verify drawing-specific profile correction; overlay of existing bridge wearing coat is NOT permitted—repair or replacement is required.',
    '2703.1: Do not construct railing/crash barrier before span is self-supporting and falsework released; post verticality deviation ≤6 mm in 3 m; post pockets non-shrink mortar.',
    '2703.1–2: Verify correct approved IRC:5/IRC:6 drawing, railing-joint function, alignment and protective coatings; non-galvanized default is one shop coat + three after erection unless drawing overrides.',
    '2703.3: Cast-in-situ work follows Sections 1600/1700; for bridges/viaducts >500 m, source specifies horizontal slip forms for crash barriers; posts cast in one pour.',
    '2703.4: Precast max aggregate 12 mm; M30 railing and M40 crash barrier minimum; damp curing ≥10 days, protected from sun/wind; reject chipped, marred or cracked members.',
    'SOURCE-CONTROL HOLD: Last sentence of Clause 2703.2 concerning rail elements “before erection” is incomplete in the printed source. Do not guess missing requirement.',

    '2704: Check approach slab full roadway width, minimum 3.5 m length, 300 mm thickness, M30, 12 mm bars @150 mm each way at top and bottom; 150 mm M15 base unless drawings/Engineer change.',
    '2705: Drainage spouts minimum 100 mm diameter, spacing no more than 10 m, cleanout and corrosion protection; downpipes to 500 mm above HFL or urban ground drain as applicable.',
    '2705.1–2: Seam-weld watertight and hot-dip galvanize, coat assembly with two bituminous paint coats, fix in approved position; equivalent corner steel when deck reinforcement is cut.',
    '2705.3: Seal around assembly after slab sets and extend wearing-coat surface seal at least 50 mm all around after the coat is laid.',
    '2706: Weeps: 100 mm dia pipe in concrete/brick; stone masonry 80×150 mm rectangle or 150 mm dia round. Full wall penetration, approx 1V:20H outwards, nominal spacing 1 m each way.',
    '2706: Check lowest weep hole 150 mm above higher of low-water level or ground level unless drawings/Engineer direct otherwise.',
    '2707: Use applicable material and workmanship test/acceptance sections; no extra test frequency is specified in Clause 2707.',
    '2708: Payment: coat m³ and coat steel tonnes; railings/metal barrier running metres; concrete barrier m³+tonnes; slab/base separately m³; spouts numbers; concrete/brick weeps numbers; stone weeps INCLUDED in masonry.',
    '2709: Verify rate inclusions for slab base preparation and drainage downpipe/fixtures; no SSR rupee rates are given here.',
    'SOURCE-CONTROL: Printed IS:226 and IS:1834 references are historical and must be checked against project amendments before final approval.'
  ];
  const ul=document.createElement('ul');
  for(const line of checks){const li=document.createElement('li');li.textContent=line;ul.appendChild(li);}
  card.appendChild(ul);
  const note=document.createElement('p');
  note.textContent='Source-linked field inspection reference only. No new laboratory sampling frequency, structural design approval or contract-specific acceptance rule is implied. Approved drawings and Engineer decisions remain controlling.';
  card.appendChild(note);
  target.insertAdjacentElement('beforebegin',card);
})();
