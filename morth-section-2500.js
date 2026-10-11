/* MoRTH Section 2500 extension — source controlled from private Fifth Revision 2013 PDF.
   Loaded only by morth_reader.html via app-shell.js. Keep full publication private.
   Verified clauses 2501–2502; index only 2503–2510. */
(() => {
  if (typeof RECORDS === 'undefined' || typeof renderTree !== 'function') return;
  if (RECORDS.some(r => r.clause === '2501')) return;

  const index = [
    ['2501', 'Description', 703],
    ['2502', 'Guide Bund', 703],
    ['2503', 'Apron', 704],
    ['2504', 'Pitching/Revetment on Slopes', 709],
    ['2505', 'Rubble Stone/Cement Concrete Block Flooring Over Cement Concrete Bedding', 711],
    ['2506', 'Dry Rubble Flooring', 712],
    ['2507', 'Curtain Wall and Flexible Apron', 712],
    ['2508', 'Tests and Standards of Acceptance', 713],
    ['2509', 'Measurements for Payment', 713],
    ['2510', 'Rate', 713]
  ];

  const records = index.map(([clause, title, pg], i) => ({
    id: 2100 + i, section: '2500', clause, title,
    status: i < 2 ? 'partial' : 'index',
    page: 'Printed p.' + pg + ' · PDF page mapping QA pending',
    read: i < 2 ? 'Source checked against MoRTH Fifth Revision (2013).' :
      'Contents index checked only. Do not treat detailed clause requirements as verified.',
    quick: [], tables: [],
    calc: 'No calculator enabled until the governing formula and all inputs are source-verified.'
  }));

  const desc = records[0];
  desc.read = 'Source checked against MoRTH Fifth Revision (2013), Clause 2501. River-training/protection scope and governing references; this clause does not prescribe standalone numeric acceptance limits.';
  desc.quick = [
    '2501 — River training and protection covers guide bunds, guide walls, spurs, groynes, bank protection, flooring, cut-off walls, aprons and approach-embankment protection.',
    '2501 — The purpose is to protect bridges and approaches from damage due to flood and flowing water.',
    '2501 — Construction follows IRC:89, these MoRTH Specifications or Engineer direction.'
  ];
  desc.calc = 'No calculator: choice, geometry and design of protection structures require the governing drawings, IRC:89 and Engineer/Designer decisions.';

  const guide = records[1];
  guide.page = 'Printed pp.703–704 · PDF page mapping QA pending';
  guide.read = 'Source checked against MoRTH Clause 2502. Subordinate cross-references to Section 300 and Clauses 2503–2504 are retained but not imported as verified requirements. The printed wording “pitching/rivetment” in Clause 2502.1 is flagged without correction.';
  guide.quick = [
    '2502.1 — Guide-bund embankment, slope pitching/revetment, apron and toe protection follow drawings, Specifications or Engineer approval.',
    '2502.1 — These guide-bund provisions apply to bridges across alluvial rivers. Submontane river guide bunds require supplemental specifications.',
    '2502.2 — Approved drawings or Engineer approval govern guide-bund alignment/layout. Embankment construction follows MoRTH Section 300; connected protective elements follow relevant Specifications.',
    '2502.3 — Examine locally available borrow soils through trial pits to determine suitability and earth-moving equipment. No borrow pits should be dug on the river side of the guide bund.',
    '2502.3 — Construct the guide bund alongside the bridge and aim to finish in one working season. If incomplete, plan protective measures for finished portions; start from the abutment towards upstream.',
    '2502.4 — Apron and pitching are governed by Clauses 2503 and 2504. Working-season guidelines: earthwork within 80% of the season and about 70% of the season available for apron/pitching; these are guidance, not acceptance test limits.',
    '2502.4 — Do not leave any portion of guide bund below high flood level incomplete before onset of monsoon. Apron-pit bottom is taken as low as permitted by subsoil/lowest water conditions.',
    '2502.5 — Contractor shall submit stone-transport methodology for Engineer approval, considering daily demand, mode, loading/unloading and laying labour. Engineer decides reserve stock; keep it away from the main river channel.',
    '2502.6 — Where guide bund/approach crosses a branch river channel, divert it to the main channel by suitable works or close it using a properly designed dyke/closure bund before commencing the guide bund.'
  ];
  guide.tables = [{
    name: '2502 · Guide Bund Field Controls',
    status: 'checked',
    headers: ['Topic', 'Requirement / boundary'],
    rows: [
      ['Applicability', 'Alluvial river guide bunds; submontane river work needs supplemental specifications'],
      ['Layout', 'Drawings / Engineer approval; embankment follows Section 300'],
      ['Borrow area', 'Assess borrow material in trial pits; do not dig pits on river side of guide bund'],
      ['Monsoon protection', 'No portion below HFL left incomplete before monsoon'],
      ['Apron/pitching', 'Refer to Clauses 2503–2504; do not infer dimensions or tolerances from this clause'],
      ['Stone transport', 'Contractor methodology subject to Engineer approval; reserve stock away from main channel'],
      ['Branch channel', 'Approved diversion or properly designed closure before guide-bund works'],
      ['Working-season guideline', '80% season for earthwork; about 70% available for apron/pitching — not pass/fail acceptance']
    ],
    note: 'No standalone sampling/test frequency is specified in Clauses 2501–2502. Clause 2502.1 source prints “pitching/rivetment”: preserve the source-control issue.'
  }];
  guide.calc = 'No calculator. Hydraulic/scour, slope-pitching and apron design stay with approved drawings, IRC:89, relevant clauses and Engineer/Designer approval.';


  // 2503 source-checked as one connected apron/mesh/installation clause, pp.704–709.
  // Appendix 2500/I is read with 2503; ambiguous extracted table references remain held.
  const apron = records[2];
  apron.status = 'partial';
  apron.page = 'Printed pp.704–709 and Appendix 2500/I pp.715–720 · PDF page mapping QA pending';
  apron.read = 'Source checked: apron stone/crates, boulder dimensions, mesh/wire and box tolerances, hand-woven crates and installation, plus the test and material references in Appendix 2500/I. Ambiguous or internally inconsistent appendix table/cross-references remain SOURCE-CONTROL issues and are not converted into automatic acceptance.';
  apron.quick = [
    '2503.1 — An apron protects against scour with boulders placed directly on the riverbed or within wire crates. Stone is to be sound, hard, durable and not readily weathered; angular quarry stone is preferred over rounded boulders.',
    '2503.1 — If required-size natural stones are not economically available, use at least M15 cement-concrete blocks conforming to Section 1700 or stone-filled wire crates; this does not replace hydraulic/design approval.',
    '2503.2 — Boulder size follows IRC:89 Clause 5.3.7.2. Individual stones: at least 40 kg; specific gravity at least 2.4. Dry-masonry cross-wall templates about 1 m thick at 30 m intervals support orderly hand-packed apron placement.',
    '2503.2 — Apron bed is prepared to drawing level/extent. If raised to low water level for laying, stone quantity must be revised for the raised apron/toe geometry.',
    '2503.3.1 — Mechanically woven crates: hot-dipped galvanised mild-steel mesh, wire diameter at least 2.2 mm and tensile strength at least 350 MPa (IS:280); heavy galvanising per IS:4826.',
    '2503.3.1 — Corrosive locations: additional nominal 0.5 mm PVC coating, or zinc-alloy coating under EN 10244-2 in place of galvanisation. Use mechanically selvedged edges, double twists, prescribed meshes and diaphragm compartments at 1 m centres.',
    '2503.3.1 — Gabion mesh families 10×12 / 8×10; revet mattress 6×8. Check the exact wire family, lacing and selvedge size in Tables 2500-2 / 2500-3 rather than applying the general minimum wire diameter to all components.',
    '2503.3.1.3 — Box size before filling: length/width ±5%; height over 0.3 m ±5%, height 0.3 m or less ±10%. Nominal hexagonal mesh-opening dimension D may vary +16% to −4%.',
    '2503.3.1.4 — Appendix 2500/I governs mechanical strength, coating, PVC properties, test methods and quantity. Producers certify wire strength, zinc coating mass and PVC thickness. At least three strength tests in each of two mesh directions are specified for conformance; all three results in each direction must pass the applicable table. Retest on change in physical characteristics.',
    '2503.3.2 — Hand-woven crates use annealed, heavily galvanised wire at least 4 mm diameter, tensile strength 300–450 MPa (IS:280), mesh no larger than 150 mm.',
    '2503.3.2 — In-situ hand-woven units: dimensions not greater than 7.5 × 3 × 0.6 m nor smaller than 2 × 1 × 0.3 m; large-unit side stays at no more than 1.5 m intervals. Smaller deep/inaccessible units need Engineer approval.',
    '2503.3.3 — Prepare/level the bed; where possible, position units before filling. Fill by tight hand packing, not indiscriminate dumping. Underwater units require approved specialist lifting/placement and contact-surface lacing; do not infer a numerical acceptance frequency.'
  ];
  apron.tables = [
    {name:'Table 2500-1 and Clause 2503.3.1.3 · Mesh Opening',
     status:'checked',headers:['Mesh type','Nominal D','Source tolerance'],
     rows:[['10 × 12','100 mm','+16% / −4%'],['8 × 10','80 mm','+16% / −4%'],['6 × 8','60 mm','+16% / −4%']],
     note:'Opening D is the mesh specification, not wire diameter; refer to the drawings and the applicable gabion/mattress wire-size table.'},
    {name:'Tables 2500-2 / 2500-3 · Box and Coating Tolerances',
     status:'checked',headers:['Parameter','Requirement'],
     rows:[
       ['Gabion mesh','10 × 12 or 8 × 10; wire size depends on zinc or PVC-coated configuration in Table 2500-2'],
       ['Revet mattress mesh','6 × 8; separate wire/selvedge/lacing sizes in Table 2500-3'],
       ['PVC coating when selected','Nominal 0.50 mm; minimum 0.38 mm under Tables 2500-2 and 2500-3'],
       ['Length and width (before fill)','Within ±5% of ordered size'],
       ['Height > 0.3 m (before fill)','Within ±5% of ordered size'],
       ['Height ≤ 0.3 m (before fill)','Within ±10% of ordered size'],
       ['Mechanically woven gabion diaphragms','At 1 m centre-to-centre intervals']
     ],
     note:'Do not substitute a general wire-size minimum for the detailed configurations. Table 2500-2 has a multi-level zinc/PVC heading: exact selections must be checked against the source table and approved product submittal.'},
    {name:'Table 2500-4 · Diameter Tolerance of Galvanised Wire',
     status:'checked',headers:['Nominal wire diameter','Permitted tolerance'],
     rows:[['2.00 mm','±0.05 mm'],['2.20 mm','±0.06 mm'],['2.40 mm','±0.06 mm'],['2.70 mm','±0.07 mm'],['3.00 mm','±0.08 mm'],['3.40 mm','±0.09 mm'],['3.90 mm','±0.10 mm']],
     note:'Use with required nominal diameter for the selected wire component; coating-configuration distinctions remain in Tables 2500-2 and 2500-3.'},
    {name:'Appendix 2500/I · Zinc Coating and Mesh Conformance',
     status:'checked',headers:['Control','Requirement / source boundary'],
     rows:[
       ['Zinc coating mass, 2.00 / 2.20 mm wire','Minimum 240 g/m² (Appendix Table 2500/2)'],
       ['Zinc coating mass, 2.40 / 2.70 mm wire','Minimum 260 g/m² (Appendix Table 2500/2)'],
       ['Zinc coating mass, 3.00 / 3.40 mm wire','Minimum 270 g/m² (Appendix Table 2500/2)'],
       ['Zinc coating mass, 3.90 mm wire','Minimum 280 g/m² (Appendix Table 2500/2)'],
       ['PVC specific gravity','1.30–1.35; IS:13360 Part 3 Section 1'],
       ['PVC tensile strength','At least 20.6 MPa; IS:13360 Part 5 Section 1'],
       ['PVC hardness','Shore D 50–60; IS:13360 Part 5 Section 11'],
       ['Mesh test count','At least three tests parallel and three perpendicular to twist for strength conformance; all three in each set shall pass Appendix Table 2500/1'],
       ['Changed mesh physical characteristics','Repeat strength conformance testing'],
       ['Lot / volume based frequency','Not stated in Appendix; do not invent one']
     ],
     note:'SOURCE-CONTROL HOLD: extracted Appendix Table 2500/1 has multi-level headings with uncertain column association. Do not use unverified individual strength figures for auto-pass/fail. Appendix also prints 5.2 twice, refers to Table-2500/4 and Para 5.4 not found within the extracted Appendix; resolve only against governing source.'}
  ];
  apron.calc = 'No apron-sizing, hydraulic or automatic material acceptance calculator enabled. IRC:89, foundation/scour design, approved drawings, contract, laboratory results and unresolved Appendix table references govern.';

  RECORDS.push(...records);
  const filter = document.getElementById('sectionFilter');
  if (filter && !filter.querySelector('option[value="2500"]')) {
    const opt = document.createElement('option');
    opt.value = '2500';
    opt.textContent = 'Section 2500';
    filter.appendChild(opt);
  }
  const notice = document.querySelector('.note.warn');
  if (notice) {
    const original = 'and Geotechnical Investigation 2401–2415 content is source-checked';
    if (notice.innerHTML.includes(original)) {
      notice.innerHTML = notice.innerHTML.replace(original,
        'and Geotechnical Investigation 2401–2415 and River Training / Protection 2501–2502 content is source-checked');
    }
  }
  const clause = new URLSearchParams(location.search).get('clause');
  if (clause && records.some(r => r.clause === clause)) {
    selected = RECORDS.findIndex(r => r.clause === clause);
  }
  renderTree();
})();