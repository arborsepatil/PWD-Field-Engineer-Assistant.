/* MoRTH Section 2600 — expansion joint reader, Fifth Revision 2013.
   Controlling private PDF retained in Google Drive. Clause 2601–2603 facts only. */
(() => {
  if (typeof RECORDS === 'undefined' || typeof renderTree !== 'function') return;
  if (RECORDS.some(r=>r.clause==='2601')) return;
  const ix=[
    ['2601','Description',723],
    ['2602','General',723],
    ['2603','Performance Requirements',724],
    ['2604','Filler Joints',725],
    ['2605','Reinforced Elastomeric Joint',726],
    ['2606','Single Strip/Box Seal Joint',728],
    ['2607','Modular Strip/Box Seal Expansion Joints',730],
    ['2608','Asphaltic Plug Joint',732],
    ['2609','Compression Seal Joint',734],
    ['2610','Installation of Expansion Joints',736],
    ['2611','Title not printed in supplied contents index · clause QA pending',744],
    ['2612','Testing and Acceptance Standards',744],
    ['2613','Tests and Standards of Acceptance',748],
    ['2614','Measurements for Payment',748],
    ['2615','Rate',748]
  ];
  const list=ix.map(([clause,title,page],i)=>({
    id:2200+i,section:'2600',clause,title,page:'Printed p.'+page+' · PDF mapping QA pending',
    status:i<3?'partial':'index',
    read:i<3?'Source checked against the controlling Fifth Revision 2013 PDF.':'Contents index checked only. Clause-specific facts not yet source verified.',
    quick:[],tables:[],calc:'No calculation available before source-verified inputs and approval boundary.'
  }));
  const d=list[0];
  d.read='Source-checked Clause 2601 covers fabrication/installation scope and enumerates expansion joint families; specific dimensional/performance checks follow later clauses and approved design.';
  d.quick=[
    '2601 — Covers fabrication and installation of deck expansion joints.',
    '2601 — Specified joint families include filler, asphaltic plug, compression seal and reinforced elastomeric slab seal, strip seal and box seal systems.',
    '2601 — Clause is a scope definition, not a standalone numeric tolerance or test-frequency requirement.'
  ];
  d.calc='No calculator: Section 2601 provides no formula.';
  const gen=list[1];
  gen.read='Source-checked Clause 2602: approved joint type/manufacturer, prohibition on site fabrication, alternative proprietary submissions, deck-wide continuity and Engineer-controlled post-installation traffic hold.';
  gen.quick=[
    '2602.1 — Joint type must suit structural design and obtain Engineer approval. Source prints unusual wording “and got approved by the Engineer”; preserve without editorial correction.',
    '2602.2 — Joint must be robust, durable, watertight and maintainable/replaceable. SITE-FABRICATED expansion joints are prohibited.',
    '2602.2 — Procure proven joint type from approved manufacturer.',
    '2602.3 — Alternative proprietary joints need equivalent movement and rotation capacity, manufacturer requirements and evidence of satisfactory service in similar environmental conditions.',
    '2602.3 — Contractor submits proposed manufacturer name/location, general details/dimensions, specifications, anchorage/hold-down details, installation procedure and past service-performance evidence.',
    '2602.3 — Alternative joint acceptance is at sole Engineer discretion; installation follows manufacturer recommendations and specification.',
    '2602.3 — Vehicular traffic must be held off newly installed joints for the period determined by the Engineer. No universal duration is specified.',
    '2602.4 — Joint must extend across complete carriageway, kerb and footpath where provided and follow deck, kerb, footway and fascia profile.',
    '2602.4 — Footpath/kerb/fascia joints may be of another type, but must handle the same design movement/rotation demands and be watertight.'
  ];
  gen.tables=[{
    name:'Clause 2602 · Approval and Field Hold Points',status:'checked',
    headers:['Control','Governing requirement'],rows:[
      ['Joint type/design','Engineer-approved; satisfy approved movement/rotation and deck requirements'],
      ['Site fabrication','Prohibited'],
      ['Product','Proven joint from approved manufacturer'],
      ['Contractor proprietary substitution','Supporting manufacturer, detail, anchor, installation and similar-service evidence; Engineer sole discretion'],
      ['Installation','Follow manufacturer recommendations and applicable specifications'],
      ['Opening to traffic','Hold for period set by Engineer, not a guessed number'],
      ['Coverage','Carriageway, kerb, footpath/fascia as present; design movement/rotation and watertightness']
    ],note:'No fixed post-installation traffic-opening time, movement range or test frequency is printed in Clause 2602; those depend on the approved design/product/Engineer.'}];
  gen.calc='No expansion joint design calculator. Manufacturer product data, approved design movements/rotations and Engineer approval govern.';
  const perf=list[2];
  perf.read='Source-checked Clause 2603: performance requirements for the bridge structure, road user, and transition zone. The lists are qualitative performance obligations, not new numerical acceptance thresholds.';
  perf.quick=[
    '2603.1 — Expansion joint AND its transition zone must meet the relevant specification performance requirements.',
    '2603.2 — Structural performance: carry live-load effects (including impact), accommodate expansion/contraction from temperature, creep, shrinkage, prestress and deformation, and allow rotations in elevation and plan.',
    '2603.2 — Joint must be waterproof/sealed, resistant to corrosion and expected deck contaminants, maintainable and replaceable.',
    '2603.3 — Road user performance: smooth ride continuity, skid resistance, tyre safety, low noise, and safe passage where animal-drawn/steel-tyre carts apply; satisfactory appearance.',
    '2603.4 — Transition-zone anchorage must transfer generated forces into the deck without distress or uprooting; surface stays stable in long-term service.'
  ];
  perf.tables=[{name:'2603 · Performance Checklist (Qualitative)',status:'checked',
    headers:['Area','Source performance boundary'],rows:[
      ['Structure','Imposed load + impact; designed expansion/contraction and rotations'],
      ['Water/operation','Waterproof, sealed, corrosion/contaminant resistant, maintainable/replaceable'],
      ['Road user','Smooth, skid resistant, tyre safe, low noise; local animal/cart conditions where relevant'],
      ['Transition zone','Anchorage/force transfer without uprooting or deck distress; stable riding surface over service life']
    ],note:'No source numerical pass/fail threshold is supplied in 2603; acceptance is checked against approved design, manufacturer evidence, applicable later clauses and Contract.'}];
  perf.calc='No calculator; Clause 2603 defines performance requirements without a universal design equation.';
  RECORDS.push(...list);
  const filter=document.getElementById('sectionFilter');
  if(filter && !filter.querySelector('option[value="2600"]')){
    const option=document.createElement('option');option.value='2600';option.textContent='Section 2600';filter.appendChild(option);
  }
  const notice=document.querySelector('.note.warn');
  if(notice && notice.innerHTML.includes('and River Training / Protection 2501–2510 content is source-checked')){
    notice.innerHTML=notice.innerHTML.replace('and River Training / Protection 2501–2510 content is source-checked','and River Training / Protection 2501–2510 and Expansion Joints 2601–2603 content is source-checked');
  }
  const clause=new URLSearchParams(location.search).get('clause');
  if(list.some(r=>r.clause===clause))selected=RECORDS.findIndex(r=>r.clause===clause);
  renderTree();
})();
