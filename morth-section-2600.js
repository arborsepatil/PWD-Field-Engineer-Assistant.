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

  // MoRTH Fifth Revision 2013, 2604–2605, printed pp.725–728.
  const filler=list.find(r=>r.clause==='2604');
  filler.status='partial';
  filler.page='Printed pp.725–726 · PDF page mapping QA pending';
  filler.read='Source checked for filler-joint components, materials, storage, installation and pre-sealing Engineer inspection. Drawings and manufacturer control apply; the clause gives no sampling frequency.';
  filler.quick=[
    '2604.1 — Joint includes corrugated copper plate at least 2 mm thick, installed slightly below wearing coat; 20 mm compressible fibre board edge protection, 20 mm pre-moulded filler to wearing-course top and suitable sealant.',
    '2604.2(i) — Filler material is drawing-specified bitumen-impregnated felt, elastomer or other suitable material. Impregnated felt conforms to IS:1838 and requires Engineer approval.',
    '2604.2(i) — Use large filler pieces; assembling small pieces to make the required size should be avoided.',
    '2604.2(ii–iii) — Store joint materials carefully under cover; Contractor makes good post-delivery damage to Engineer satisfaction at Contractor cost.',
    '2604.3(i) — Form joint gaps as shown on drawings; wire-brush groove faces clean of loose matter/debris and wash or jet out.',
    '2604.3(ii) — Place pre-moulded filler just before installing abutting material. Where adjacent faces are installed at different times, place it when the second face is ready.',
    '2604.3(iii–iv) — Install sealant per manufacturer recommendations; finish it approximately 3 mm below joint upper surface.',
    '2604.3(v–vi) — Remove spilled joint materials from finished bridge surfaces. Do not seal any joint before Engineer inspection and approval to proceed.'
  ];
  filler.tables=[
    {name:'2604 · Filler Joint Source Controls',status:'checked',
      headers:['Component / inspection','Requirement / boundary'],
      rows:[
        ['Corrugated copper plate','Thickness ≥2 mm, slightly below wearing coat'],
        ['Compressible edge fibre board','20 mm'],
        ['Pre-moulded filler','20 mm; to top wearing-course level'],
        ['Impregnated felt','IS:1838 + Engineer approval when used'],
        ['Groove condition','Clean thoroughly by wire brush, followed by wash/jetting'],
        ['Filler installation','Just before abutting material; defer for second joint face if built later'],
        ['Sealant','Manufacturer procedure; upper finish approximately 3 mm below joint top'],
        ['Approval HOLD','Engineer inspects and approves joint before sealing'],
        ['Protection of materials','Covered storage; damaged items rectified at Contractor expense']
      ],
      note:'These are component and workmanship controls, not a universal joint-opening or traffic-release time. Plate position, joint gap and materials remain drawing/Contract/manufacturer governed.'}
  ];
  filler.calc='No calculator: design gap, movements and installation limits require drawings/manufacturer approval.';

  const elas=list.find(r=>r.clause==='2605');
  elas.status='partial';
  elas.page='Printed pp.726–728 · PDF page mapping QA pending';
  elas.read='Source checked for steel inserts, anchors, bolts, elastomer properties, workshop fabrication, coating, fabricated-unit tolerances and handling. All manufacturer, IRC and design boundaries remain active.';
  elas.quick=[
    '2605.1(i) — Elastomeric slab is secured to steel inserts correctly anchored in deck; anchoring bolts directly embedded in deck concrete are prohibited. Steel inserts and anchorage must be manufactured at workshop, not on site.',
    '2605.1(ii) — Loop anchors with plates: plate thickness ≥12 mm, loop-bar diameter ≥16 mm and anchor spacing ≤250 mm. Alternative sinusoidal anchor-bar diameter ≥12 mm.',
    '2605.1(iii–vi) — Bolts/nuts are stainless steel and nuts use lock washers. Plug bolt holes with adhesive-fixed elastomeric plugs; manufacturer-specified adhesive/sealant and positioning/spacer jigs apply.',
    '2605.2 — Mild steel insert/anchorage and reinforcing plates conform to IS:2062 Grade B; cast steel reinforcing plates conform to IS:1030.',
    '2605.2 — Slab elastomer conforms to IRC:83 (Part II) Clause 915.1; compounded hardness IRHD 60 ±5.',
    '2605.3(i) — Steel inserts/anchorage, including embedded/concrete-contact surfaces, are sand/shot blasted to SA 2½ and primed with zinc-rich epoxy.',
    '2605.3(i) — Non-embedded/non-contact surfaces receive additional primer, MIO reinforced high-build epoxy intermediate coat and high-performance epoxy finish; total dry-film thickness ≥150 microns to manufacturer specification.',
    '2605.3(ii) — Fully mould slab and its reinforcing plates in a single vulcanizing operation; round reinforcement edges and form male/female grooves at adjoining slab units for watertightness. Refer to IRC:83 (Part II) Clause 917.',
    '2605.3(iii) — Fabrication dimensional tolerances: plan dimensions ±5 mm; overall height ±3 mm.',
    '2605.4 — Supply bolts, nuts, sealants, plugs and kerb-angle accessories; protect units in covered storage. Damage after delivery must be rectified by Contractor to Engineer satisfaction.'
  ];
  elas.tables=[
    {name:'2605 · Anchors, Inserts and Fasteners',status:'checked',
      headers:['Control','Requirement'],
      rows:[
        ['Fixing method','Slab fixed to workshop-fabricated steel inserts/anchorage; no bolts anchored directly in deck concrete'],
        ['Loop-anchor plate thickness','≥12 mm'],
        ['Loop-anchor diameter','≥16 mm'],
        ['Loop-anchor spacing','≤250 mm'],
        ['Sinusoidal anchor-bar diameter','≥12 mm'],
        ['Bolts / nuts','Stainless steel with lock washers'],
        ['Insert/anchor steel','IS:2062 Grade B; cast reinforcing plates IS:1030']
      ],note:'Two anchorage systems are alternatives; do not combine their size limits into a nonexistent single design. Approved detailing governs.'},
    {name:'2605 · Elastomer, Coating and Fabrication',status:'checked',
      headers:['Parameter','Source criterion / boundary'],
      rows:[
        ['Elastomer hardness','IRHD 60 ±5; also IRC:83 (Part II) 915.1'],
        ['Blast preparation','SA 2½ for steel inserts and anchors, including concrete-contact surfaces'],
        ['Base corrosion protection','Zinc-rich epoxy primer'],
        ['Exposed surface protection','Additional primer, MIO high-build epoxy, epoxy finish; total DFT ≥150 µm'],
        ['Slab fabrication','Single moulding/vulcanising operation; embedded reinforcement integral'],
        ['Fabrication plan dimensions','±5 mm'],
        ['Fabrication total height','±3 mm'],
        ['Handling','Store under cover, replace/repair damage at Contractor expense to Engineer satisfaction']
      ],note:'Coating stack and minimum DFT specifically apply to surfaces NOT in contact with or embedded in concrete. Fabrication tolerances are not bridge construction tolerances. Manufacturer and IRC requirements remain controlling.'}
  ];
  elas.calc='No calculator: anchor design, joint movement capacity and installation suitability need structural design and manufacturer/Engineer approval.';

  RECORDS.push(...list);
  const filter=document.getElementById('sectionFilter');
  if(filter && !filter.querySelector('option[value="2600"]')){
    const option=document.createElement('option');option.value='2600';option.textContent='Section 2600';filter.appendChild(option);
  }
  const notice=document.querySelector('.note.warn');
  if(notice && notice.innerHTML.includes('and River Training / Protection 2501–2510 content is source-checked')){
    notice.innerHTML=notice.innerHTML.replace('and River Training / Protection 2501–2510 content is source-checked','and River Training / Protection 2501–2510 and Expansion Joints 2601–2605 content is source-checked');
  }
  const clause=new URLSearchParams(location.search).get('clause');
  if(list.some(r=>r.clause===clause))selected=RECORDS.findIndex(r=>r.clause===clause);
  renderTree();
})();
