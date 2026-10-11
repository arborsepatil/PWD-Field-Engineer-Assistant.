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


  const apron = records.find(r => r.clause === '2503');
  apron.status = 'partial';
  apron.page = 'Printed pp.704–709; Appendix 2500/I pp.715–720 · PDF page mapping QA pending';
  apron.read = 'Source checked: 2503.1–2503.3.3 and Appendix 2500/I, including Tables 2500-1 to 2500-4 and appendix physical/strength/test requirements. Preserve printed internal cross-reference issues; no automatic apron design approval.';
  apron.quick = [
    '2503.1 — Apron is loose or wire-crated boulders placed on the riverbed as scour protection. Use hard, sound, durable stones; angular quarry stones are preferred.',
    '2503.1 — Where suitably sized stones are not economical, use minimum M15 cement-concrete blocks conforming to Section 1700, or stones in wire crates.',
    '2503.2 — Boulder size is also governed by IRC:89 Cl.5.3.7.2. Individual stones: at least 40 kg; stone specific gravity at least 2.4.',
    '2503.2 — Dry-masonry template crosswalls approximately 1 m thick at 30 m intervals, reaching the specified apron thickness; hand-pack the stone between walls.',
    '2503.2 — Prepare and level apron bed to drawing geometry. Where the bed is below low-water level, the specification permits raising it to that level with earth; stone quantity then needs recalculation for the raised pitching toe.',
    '2503.3.1.1 — Mechanically woven gabions/mattresses: hot-dip galvanized wire, minimum 2.2 mm with tensile strength at least 350 MPa, IS 280; heavy coating per IS 4826.',
    '2503.3.1.1 — Corrosive conditions require the specified additional PVC coating or specified zinc-alloy alternative. Mechanical mesh uses double twist and mechanically finished edges, with diaphragms at 1 m centres.',
    '2503.3.1.2–3 — Mesh types 10×12, 8×10 and 6×8; product-specific wire/box values and manufacturing tolerances are in source tables below.',
    '2503.3.1.4 / Appendix 2500/I — Producer certifies wire tensile strength, galvanizing mass and PVC thickness. Minimum three tests parallel and three perpendicular to mesh twist; every result must meet its minimum, with retesting on product characteristic change.',
    '2503.3.2 — Hand-woven crate wire: hot-dip galvanized annealed mild steel, minimum 4 mm diameter, tensile strength 300–450 MPa, IS 280; mesh opening not over 150 mm.',
    '2503.3.2 — Hand-woven in-situ crate dimensions: not greater than 7.5×3×0.6 m and not smaller than 2×1×0.3 m. Engineer approval is required for smaller crates in inaccessible situations.',
    '2503.3.3 — Bed must be level before units are placed; stone must be tightly hand-packed instead of dumped loosely. Underwater placement and interconnection need a competent, approved method and specialist supervision.'
  ];
  apron.tables = [
    {
      name: '2503.1–2 · Boulder Apron',
      status: 'checked', headers: ['Field parameter', 'Source requirement'],
      rows: [
        ['Stone mass', 'No individual boulder below 40 kg'],
        ['Stone specific gravity', 'Not below 2.4'],
        ['Further boulder sizing', 'IRC:89 Clause 5.3.7.2 — not inferred in this reader'],
        ['Template dry-masonry crosswalls', 'About 1 m thick, full specified apron height; 30 m intervals along both dimensions'],
        ['Stone between walls', 'Hand-packed to specified apron thickness'],
        ['Concrete block alternative', 'Minimum M15 grade, Section 1700'],
        ['Riverbed/quantity', 'Bed prepared to drawing; if raised to low-water level, revise apron quantity from elevated pitching toe']
      ],
      note: 'Apron thickness, footprint and detailed scour design remain drawing/IRC:89/Engineer controlled. This clause provides no universal thickness or independent apron-volume calculator.'
    },
    {
      name: 'Table 2500-1 · Nominal Mesh Size / Manufacturing Opening Tolerance',
      status: 'checked', headers: ['Mesh type', 'Nominal opening D', 'Permissible variation on D'],
      rows: [
        ['10×12','100 mm','+16% / −4%'],
        ['8×10','80 mm','+16% / −4%'],
        ['6×8','60 mm','+16% / −4%']
      ],
      note: 'Apply opening tolerance to nominal D only; do not substitute for minimum wire size or box tolerances.'
    },
    {
      name: 'Tables 2500-2 / 2500-3 · Mesh Wire and PVC Wire Diameter',
      status: 'checked', headers: ['Product & coating', 'Mesh / edge / lacing wire (mm)'],
      rows: [
        ['Gabion 10×12 · zinc', '2.70 or 3.00 / 3.40 or 3.90 / 2.20 (matching specified wire option)'],
        ['Gabion 10×12 · Zn+PVC', '2.70/3.70 / 3.40/4.40 / 2.20/3.20 (internal/external)'],
        ['Gabion 8×10 · zinc', '2.70 or 3.00 / 3.40 or 3.90 / 2.20 (matching specified wire option)'],
        ['Gabion 8×10 · Zn+PVC', '2.70/3.70 / 3.40/4.40 / 2.20/3.20 (internal/external)'],
        ['Revet mattress 6×8 · zinc', '2.20 / 2.70 / 2.20'],
        ['Revet mattress 6×8 · Zn+PVC', '2.20/3.20 / 2.70/3.70 / 2.20/3.20 (internal/external)']
      ],
      note: 'Exact galvanised mesh/edge size pair is product-option controlled; do not treat the “or” values as permission to mix incompatible rows. For PVC, printed wire pair is internal/external diameter.'
    },
    {
      name: 'Tables 2500-2 / 2500-3 · Box Sizes, Diaphragms & Tolerances',
      status: 'checked', headers: ['Attribute', 'Specification'],
      rows: [
        ['Gabion mesh options','10×12 (D=100 mm), 8×10 (D=80 mm)'],
        ['Revet mattress mesh','6×8 (D=60 mm)'],
        ['Gabion typical width / heights','1 m wide; 1.0, 0.5 or 0.3 m high; see source table for available lengths and diaphragms'],
        ['Revet mattress typical width / heights','2 m wide; 0.17, 0.23 or 0.30 m high; lengths 2, 3 or 4 m with 1, 2 or 3 diaphragms'],
        ['Diaphragms','1 m centre-to-centre for standard compartments'],
        ['Length and width manufacture tolerance','±5% prior to filling'],
        ['Height >0.3 m manufacture tolerance','±5% prior to filling'],
        ['Height ≤0.3 m manufacture tolerance','±10% prior to filling'],
        ['Zn+PVC thickness','Nominal 0.50 mm; minimum 0.38 mm (Tables 2500-2/3)']
      ],
      note: 'Special gabion sizes need purchaser/manufacturer agreement. Printed Note 3 under Table 2500-4 refers to Table 2500-2 for revet opening; the table heading otherwise identifies revet data as Table 2500-3. Preserve reference ambiguity.'
    },
    {
      name: 'Table 2500-4 · Galvanized Wire Diameter Tolerance',
      status: 'checked', headers: ['Nominal wire dia.', 'Permitted ± tolerance'],
      rows: [
        ['2.00 mm','0.05 mm'],['2.20 mm','0.06 mm'],
        ['2.40 mm','0.06 mm'],['2.70 mm','0.07 mm'],
        ['3.00 mm','0.08 mm'],['3.40 mm','0.09 mm'],
        ['3.90 mm','0.10 mm']
      ],
      note: 'Diameter tolerance applies to galvanised steel wire, not total outer PVC-coated diameter.'
    },
    {
      name: 'Appendix 2500/I · Minimum Strength by Mesh / Coating',
      status: 'checked', headers: ['Mesh / wire', 'Parallel / perpendicular (kN/m)', 'Connection / punch minimum (table units)'],
      rows: [
        ['10×12 Zn, 2.7 mm','32.0 / 15.4','10.2 / 17.8'],
        ['10×12 Zn, 3.0 mm','40.0 / 20.5','11.22 / 19.58'],
        ['10×12 Zn+PVC, 2.7 mm','32.0 / 15.4','10.2 / 17.8'],
        ['8×10 Zn, 3.0 mm','51.1 / 26.3','20.4 / 26.7'],
        ['8×10 Zn+PVC, 2.7 mm','42.3 / 20.4','16.32 / 21.36'],
        ['6×8 Zn, 2.2 mm','33.6 / 13.1','10.2 / 17.8'],
        ['6×8 Zn+PVC, 2.2 mm','33.6 / 13.1','10.2 / 17.8']
      ],
      note: 'Appendix Table-2500/1: connection to selvedges and panel-to-panel lacing share the printed same minimum within each product column. Punch test values are reproduced as printed without silently inventing units for that row. Full test setup and governing laboratory report are required.'
    },
    {
      name: 'Appendix 2500/I · Zinc & PVC Material Checks',
      status: 'checked', headers: ['Characteristic', 'Requirement'],
      rows: [
        ['Minimum zinc coat · 2.00/2.20 mm wire','240 g/m²'],
        ['Minimum zinc coat · 2.40/2.70 mm wire','260 g/m²'],
        ['Minimum zinc coat · 3.00/3.40 mm wire','270 g/m²'],
        ['Minimum zinc coat · 3.90 mm wire','280 g/m²'],
        ['PVC specific gravity','1.30–1.35 (IS:13360 Part 3 Sec 1 / ISO 1183)'],
        ['PVC tensile strength','≥20.6 MPa (IS:13360 Part 5 Sec 1 / ISO 527)'],
        ['PVC hardness','Shore D 50–60 (IS:13360 Part 5 Sec 11 / ISO 868)'],
        ['PVC NaCl solution resistance','No loss of mass in prescribed Appendix test']
      ],
      note: 'Zinc coating/adhesion conform to IS:4826. PVC material tests are Appendix conditions, not substitute checks for complete gabion/mattress performance.'
    },
    {
      name: 'Appendix 2500/I · Laboratory Sampling Requirement',
      status: 'checked', headers: ['Control', 'Specification boundary'],
      rows: [
        ['Producer certificates','Coated wire tensile strength, zinc galvanising weight and PVC coating thickness for mesh, lacing and stiffeners'],
        ['Mesh strength','At least 3 tests parallel and 3 perpendicular to twist'],
        ['Test acceptance','All 3 tests in each direction must meet Table-2500/1 requirements'],
        ['When product characteristics change','Repeat relevant mesh strength conformance tests'],
        ['Test method','Appendix 2500/I; do not generalise this sampling frequency to site inspections']
      ],
      note: 'Printed Appendix test-method numbering includes a repeated “5.2”, and its pull-apart test refers to “Table-2500/4” although that appendix table was not present in the extracted source. Hold that particular acceptance cross-reference pending governing clarification.'
    },
    {
      name: '2503.3.2–3 · Hand-Woven Wire Crates & Placement',
      status: 'checked', headers: ['Attribute', 'Source boundary'],
      rows: [
        ['Hand-woven wire','Galvanised annealed mild-steel dia. ≥4 mm, IS:280, tensile 300–450 MPa; heavy coat IS:4826'],
        ['Mesh opening','≤150 mm'],
        ['Standard accessible crate','3×1.5×1.25 m; partitions at 1.5 m where overturning is a risk'],
        ['In-situ box limits','Not larger than 7.5×3×0.6 m, nor smaller than 2×1×0.3 m'],
        ['Large-crate stays','Intervals not over 1.50 m'],
        ['Placement','Prepare even bed, position before filling where possible, closely hand-pack stones'],
        ['Inaccessible locations','Smaller units need Engineer approval; underwater lifting/lacing requires specialist execution']
      ],
      note: 'No stand-alone numeric field-test frequency is printed for laying crates. Source prescribes specific underwater methods that require an approved safe construction plan.'
    }
  ];
  apron.calc = 'Calculator held: drawing dimensions, scour/apron design and approval are not inferable from Clause 2503. Bed raising requires reworking stone quantity with the changed toe level; it is not automatic approval.';

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