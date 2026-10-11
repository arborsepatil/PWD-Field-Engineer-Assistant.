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


  // Source checked from MoRTH Fifth Revision 2013, printed pp.709–713.
  // Numeric construction limits, source guidance and designer/Engineer controls are separate.
  const rp2504=records.find(r=>r.clause==='2504');
  rp2504.status='partial';
  rp2504.page='Printed pp.709–711 · PDF page mapping QA pending';
  rp2504.read='Source checked for slope protection, pitching materials, granular-filter gradation formulae, layer thickness guidance, workmanship and toe protection. Detailed geometries and stone sizes remain approved-drawing / IRC:89 controlled.';
  rp2504.quick=[
    '2504.1 — River-side slopes of guide bunds, river training work and embankments are protected by pitching of stone, boulders, M15 cement-concrete blocks or stone in wire crates over a granular filter.',
    '2504.1 — Rear slopes not attacked directly by river may be protected by 300–600 mm clayey/silty earth covering and turfing; source says “may”, not a universal mandatory system.',
    '2504.2.1 — Pitching stone thickness/shape follow drawings; stone must be sound, hard and durable. Rounded boulders and weather-damaged stone are not accepted.',
    '2504.2.1 — Stone size/weight follow IRC:89 5.3.5.1; each stone weighs at least 40 kg. Spalls are at least 25 mm and must suit the voids. Alternate blocks are minimum M15; geosynthetic material, if used, conforms to Section 700.',
    '2504.2.2 — Graded coarse sand, gravel or stone filter beneath pitching prevents embankment-material loss and buildup of uplift head. Filter gradation must satisfy three separate strict ratio checks shown in Tables.',
    '2504.2.2 Note 1 — Filter design MAY be unnecessary for CH or CL base soils of LL greater than 30 resistant to surface erosion. If bedding is used in that case, it must be well graded with D85 at least 2× maximum pitching void.',
    '2504.2.2 Notes 3–4 — Apply each ratio across successive filter layers, treating the finer layer as base for the coarser. Compact filters firmly; thickness generally 200–300 mm, or 150 mm for each layer in a two-layer filter.',
    '2504.3 — Trim bank to drawing slope; lines and pegs at 3 m intervals. Fill/compact depressions and place the granular filter to drawing thickness.',
    '2504.3 — Commence pitching from toe wall upward; dry rubble toe wall follows Clause 1405.3 for dry-rubble pitching, while concrete-block pitching toe wall is nominal M15 under Clause 1704.3.',
    '2504.3 — Place stone normal to slope, with broken joints, tight packing/spalls, larger stones in bottom courses and good bond where multiple courses are needed. Template walls about 1 m wide are specified at suitable intervals where required; NO numeric spacing is given.',
    '2504.4 — Provide toe wall at guide-bund pitching/launching apron junction to prevent sliding. Dry rubble masonry per Section 1400 or M15 concrete. Bank-slope termination provisions refer to IRC:89 8.2.2.',
  ];
  rp2504.tables=[
    {name:'2504.2.2 · Granular Filter Gradation Conditions',status:'checked',headers:['Ratio','Source requirement'],rows:[
      ['D15(filter) / D85(base)','< 5'],
      ['D15(filter) / D15(base)','> 4 AND < 20'],
      ['D50(filter) / D50(base)','< 25']
    ],note:'Dxx denotes sieve particle size at which xx% by weight passes. The source inequalities are STRICT (<, >). All three apply, with each finer layer treated as base when multiple filter layers are used. Do not extrapolate to automated hydraulic approval.'},
    {name:'2504.2.1–2 · Pitching Material & Filter',status:'checked',headers:['Parameter','Source boundary'],rows:[
      ['Stone size','Design drawing and IRC:89 Clause 5.3.5.1'],
      ['Single stone mass','≥40 kg'],
      ['Spall size','≥25 mm; must fit voids'],
      ['Concrete block alternative','M15 or higher, in accordance with Section 1700'],
      ['Geosynthetics if used','Conform to Section 700'],
      ['Filter compacted thickness','Generally 200–300 mm; this is guidance, not a universal design thickness'],
      ['Two-layer filter thickness','Each layer 150 mm'],
      ['CH/CL exception','Filter design may be unnecessary only if LL >30 and resistant to surface erosion'],
      ['Exception bedding condition','If bedding used, well graded and D85 ≥2× maximum void in pitching'],
      ['Rear-slope alternative','May use 300–600 mm clayey/silty earth and turfing']
    ],note:'Filter design, selection of exceptional CH/CL case, layer counts, approved cross-section and actual thickness require Engineer/designer judgment.'},
    {name:'2504.3–4 · Pitching Construction and Toe',status:'checked',headers:['Site control','Source requirement'],rows:[
      ['Slope profiling lines/pegs','At intervals of 3 m'],
      ['Depressions','Fill and thoroughly compact before pitching'],
      ['Filter placement','Firmly compacted, to thickness on drawings'],
      ['Pitching sequence','From toe wall upward'],
      ['Dry stone toe wall','Dry rubble masonry conforming to Clause 1405.3'],
      ['Concrete-block toe wall','Minimum M15 per Clause 1704.3'],
      ['Stone orientation / joints','Normal to slope; bond multiple courses; break joints; pack voids'],
      ['Template dry masonry walls','About 1 m wide at suitable intervals — no fixed spacing printed'],
      ['Toe protection at apron junction','Toe wall to prevent pitching slip, DR masonry per Section 1400 or M15'],
      ['Other bank-slope tie/termination','IRC:89 Clause 8.2.2 where applicable']
    ],note:'Source phrase “protection of ties of bank slopes” in 2504.4 is retained as a potential source-control wording issue; no inferred interpretation or dimension is added.'}
  ];
  rp2504.calc='Granular filter ratios are presented as exact source conditions; no automatic design/approval calculator is enabled because soil exception, layer arrangement, material tests and drawing approval require engineering review.';

  const rp2505=records.find(r=>r.clause==='2505');
  rp2505.status='partial';
  rp2505.page='Printed pp.711–712 · PDF page mapping QA pending';
  rp2505.read='Source checked for M15 concrete bedding, stone/block flooring, Engineer inspection of excavations, joint/floor level controls and governing concrete/mortar references.';
  rp2505.quick=[
    '2505.1 — Flooring of stone or concrete blocks is laid over M15 concrete bedding.',
    '2505.2 — Engineer inspects trenches before foundations/protection walls: no loose pockets or depressions, properly compacted founding soil with true line/level, concrete and other elements laid on dry bed.',
    '2505.2 — M15 nominal-mix concrete bedding is 300 mm thick, following Section 1700 except its surface is not given a smooth finish.',
    '2505.2 — Flat stone or M15 concrete-block flooring is 150 mm thick. Bed on 1:3 cement mortar per Section 1300, fill voids with spalls, fill/finish joints neatly.',
    '2505.2 — Stone flooring breaks joints; joint thickness must not exceed 20 mm; floor top stays 300 mm below lowest bed level.'
  ];
  rp2505.tables=[{name:'2505 · Flooring Over Concrete Bedding',status:'checked',headers:['Item / check','MoRTH requirement'],rows:[
    ['Trench inspection','Engineer approval of clean, compacted/level and dry founding bed'],
    ['Concrete bedding','300 mm thick, M15 nominal mix, unsmoothed surface'],
    ['Stone / block flooring','150 mm thick; concrete block M15'],
    ['Mortar bedding and joint fill','Cement mortar 1:3, Section 1300'],
    ['Joints','Broken joints in stonework; maximum thickness 20 mm'],
    ['Finished floor top','300 mm below lowest riverbed level']
  ],note:'Do not replace approved flood/hydraulic/foundation drawings with the section’s numeric construction requirements.'}];
  rp2505.calc='No calculator. Geometric measurements follow approved drawings.';

  const rp2506=records.find(r=>r.clause==='2506');
  rp2506.status='partial';
  rp2506.page='Printed p.712 · PDF page mapping QA pending';
  rp2506.read='Source checked for dry-rubble flooring applicability, preparation and stone placement. Clause 2506 does not provide a universal thickness, stone-size threshold or test frequency.';
  rp2506.quick=[
    '2506 — Dry rubble flooring is provided for relatively less important works, such as cross-drainage structures.',
    '2506 — Base to specified levels/slopes, suitably compacted to provide even bedding.',
    '2506 — Stones laid closely in one or more layers with proper bond as specified by the Engineer.'
  ];
  rp2506.tables=[];rp2506.calc='No universal depth/quantity calculator is justified by Clause 2506. Follow drawings and Engineer instructions.';

  const rp2507=records.find(r=>r.clause==='2507');
  rp2507.status='partial';
  rp2507.page='Printed pp.712–713 · PDF page mapping QA pending';
  rp2507.read='Source checked for upstream/downstream curtain-wall depth, concrete/masonry alternatives, loose-stone flexible apron limits and sequencing.';
  rp2507.quick=[
    '2507.1 — Rigid flooring is enclosed by curtain walls tied to wing walls.',
    '2507.1 — Minimum curtain depth below floor: upstream 2.0 m; downstream 2.5 m.',
    '2507.1 — Curtain wall material: minimum M15 cement concrete OR stone masonry in 1:3 cement mortar.',
    '2507.2 — Flexible apron is 1 m thick with loose boulders weighing at least 40 kg.',
    '2507.2 — Flexible apron extends at least 3 m beyond upstream curtain wall and 6 m beyond downstream curtain wall.',
    '2507.2 — Floor protection is completed simultaneously with bridge foundation works.'
  ];
  rp2507.tables=[{name:'2507 · Curtain Wall and Flexible Apron',status:'checked',headers:['Element','Minimum / requirement'],rows:[
    ['Upstream curtain wall depth below floor','≥2.0 m'],
    ['Downstream curtain wall depth below floor','≥2.5 m'],
    ['Curtain wall material','M15 concrete or stone masonry with 1:3 cement mortar'],
    ['Flexible apron thickness','1.0 m'],
    ['Loose boulder mass','≥40 kg per boulder'],
    ['Flexible apron beyond upstream wall','≥3 m'],
    ['Flexible apron beyond downstream wall','≥6 m'],
    ['Timing','Floor protection alongside bridge foundation works']
  ],note:'These printed minima are not substitute for hydraulic/scour design or approved foundation drawings.'}];
  rp2507.calc='No automatic curtain-wall/apron design or approval calculation is enabled. Relevant source limits remain visible for Engineer-controlled checking.';


  // Printed pp.713–714. Acceptance, measurements and rate boundaries are not all QC.
  const r2508=records.find(r=>r.clause==='2508');
  r2508.status='partial';
  r2508.page='Printed p.713 · PDF page mapping QA pending';
  r2508.read='Source checked: materials must meet applicable material testing criteria, and completed work must meet prescribed standards. No new stand-alone numerical tolerance or test frequency is supplied in 2508.';
  r2508.quick=[
    '2508 — Material testing must conform to relevant MoRTH Specifications and their criteria.',
    '2508 — River training/protection work must meet the relevant prescribed workmanship and acceptance standards.',
    '2508 — No new independent numerical pass/fail limit or sampling frequency is printed: use the controlling material and work requirements.'
  ];
  r2508.tables=[];
  r2508.calc='No calculator. Acceptance requires the underlying material/work clause, Contract and test data.';

  const r2509=records.find(r=>r.clause==='2509');
  r2509.status='partial';
  r2509.page='Printed p.713 · PDF page mapping QA pending';
  r2509.read='Source checked for measurement units, separately measured materials, incidental items and average excavation depth payment threshold. Do not treat a payment exclusion as QC rejection.';
  r2509.quick=[
    '2509 — Guide-bund embankment earthwork is measured in m³ unless otherwise specified.',
    '2509 — Boulders, concrete blocks, and filled wire crates in aprons are measured in m³.',
    '2509 — Filter and stone pitching are measured separately in m³ unless otherwise specified.',
    '2509 — Rubble-stone/CC-block flooring and concrete bedding are measured in m³ by material class.',
    '2509 — Preparing the flooring bed is incidental to the main item.',
    '2509 — Apron excavation up to an AVERAGE 150 mm is included; depth beyond 150 mm is separately measured in m³ under Section 300 unless otherwise specified.',
    '2509 — Engineer-directed prelaying material stacking at site is an incidental activity.'
  ];
  r2509.tables=[{name:'2509 · Measurement and Payment Boundaries',status:'checked',headers:['Element','Measurement / boundary'],rows:[
    ['Guide-bund embankment earthwork','m³, unless otherwise specified'],
    ['Stone/CC-block apron or filled crates','m³'],
    ['Filter and stone pitching','Separate m³, unless otherwise specified'],
    ['Flooring and concrete bedding','m³ by material class'],
    ['Preparation of flooring base','Incidental'],
    ['Apron excavation, average depth ≤150 mm','Included in item; not separately measured, unless otherwise specified'],
    ['Apron excavation deeper than 150 mm average','Separate m³ under Section 300, unless otherwise specified'],
    ['Directed stacking before laying','Incidental']
  ],note:'Source says AVERAGE 150 mm for apron excavation, as a payment threshold. It is not a geometric tolerance or separate QC acceptance criterion.'}];
  r2509.calc='No generic payment calculator; actual approved measurements and Contract schedule/item wording govern.';

  const r2510=records.find(r=>r.clause==='2510');
  r2510.status='partial';
  r2510.page='Printed pp.713–714 · PDF page mapping QA pending';
  r2510.read='Source checked for component-wise contract unit-rate inclusions. No monetary SSR or Contract rates appear in this clause.';
  r2510.quick=[
    '2510 — Guide-bund embankment rate covers materials, transport, placing, compacting, labour, equipment, sampling/testing, supervision and incidentals.',
    '2510 — Apron rate covers materials, labour, equipment and bed dressing/excavation up to average 150 mm; deeper excavation separately payable unless otherwise specified.',
    '2510 — Slope-pitching rate includes prepared base, laid/compacted filter and stone or block pitching to specified thickness, lines, curves, slopes and levels, with labour/materials/equipment.',
    '2510 — Flooring rate covers materials, labour, tools/plant required to complete the flooring work.',
    '2510 — Actual monetary rates and pay items come from the Contract, not the source clause.'
  ];
  r2510.tables=[{name:'2510 · Contract Rate Inclusions',status:'checked',headers:['Work','Included'],rows:[
    ['Guide bund','Materials, haulage, placing, compaction, labour, equipment, tests, supervision and incidentals'],
    ['Apron','Materials, labour, plant and excavation/bed dressing to average 150 mm'],
    ['Stone/CC-block pitching','Base preparation, filter, pitching and labour/plant to specified drawing profile'],
    ['Flooring','Materials, labour and plant required for specified work']
  ],note:'Contract conditions govern item wording and prices; this clause is not a new QC sampling/acceptance schedule.'}];
  r2510.calc='No rate calculator; source contains rate coverage, not monetary unit rates.';

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
        'and Geotechnical Investigation 2401–2415 and River Training / Protection 2501–2510 content is source-checked');
    }
  }
  const clause = new URLSearchParams(location.search).get('clause');
  if (clause && records.some(r => r.clause === clause)) {
    selected = RECORDS.findIndex(r => r.clause === clause);
  }
  renderTree();
})();