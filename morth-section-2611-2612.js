/* MoRTH Fifth Revision (2013) Section 2600, printed pp.744–748.
   Clause 2611 and 2612 source checks; private controlling PDF is not reproduced. */
(() => {
  if (typeof RECORDS === 'undefined' || typeof renderTree !== 'function') return;
  const clause = id => RECORDS.find(r => r.clause === id && r.section === '2600');
  const supplier = clause('2611'), testing = clause('2612');
  if (!supplier || !testing) return;
  supplier.status = 'partial';
  supplier.title = 'Supplier-Specific Installation Procedure (unnamed in contents)';
  supplier.page = 'Printed p.744 · PDF page mapping QA pending';
  supplier.read = 'Clause 2611 source-checked. The printed contents index gives the number but no heading; this display title is descriptive, not an asserted original heading.';
  supplier.quick = [
    '2611 — The installation procedure for each expansion joint type must also take account of that supplier’s specific installation procedure.',
    '2611 — The supplier is responsible for joint performance throughout the guarantee period.',
    '2611 — Manufacturer/supplier procedures supplement rather than replace the installation requirements, approved drawings and Engineer-controlled hold points of Clause 2610.',
    '2611/2612 Table 2600-5 note — For all proprietary expansion joints, the Contractor must give a minimum 10-year satisfactory-performance guarantee; keep supplier and Contractor responsibilities distinct.'
  ];
  supplier.tables = [{
    name: '2611 · Installation Procedure and Performance Responsibility', status: 'checked',
    headers: ['Field check', 'Source boundary'], rows: [
      ['Supplier procedure', 'Supplier-specific procedure is included for each joint type'],
      ['Installation control', 'Check the Clause 2610 sequence and approved installation documents together'],
      ['Guarantee-period performance', 'Supplier responsible under Clause 2611'],
      ['Proprietary joint minimum guarantee', 'Contractor guarantee of at least 10 years — note below Table 2600-5']
    ],
    note: 'The original contents index does not print a heading for Clause 2611. This summary is not a substitute for the supplier method statement or Engineer approval.'
  }];
  supplier.calc = 'No formula or universal preset movement value is provided in 2611.';

  testing.status = 'partial';
  testing.page = 'Printed pp.744–748 · PDF page mapping QA pending';
  testing.read = 'Clauses 2612.1–2612.3.2 and Table 2600-5 source-checked. Distinguish product-development evidence, routine manufacturer QC, pre-acceptance tests and applicability by joint type. The printed 2612.3.2 reference to 2612.2.1 is anomalous and remains a SOURCE-CONTROL HOLD.';
  testing.quick = [
    '2612.1 — Before installation, furnish recognized laboratory/university/institute fatigue and wear test reports appropriate to the joint type as product-development evidence, once for the lot supplied.',
    '2612.1 — Product-development tests (i)–(vi) need not be repeated on supplied lot materials. Original manufacturer periodically repeats them under its development/quality plan; do not invent an on-site sampling frequency.',
    '2612.1(i) — Single-strip and modular-strip systems: recognized-lab dynamic anchorage-assembly test report for the chosen anchorage configuration.',
    '2612.1(ii–v) — Modular systems need documented fatigue/wear testing of suspension bearings, sliding bearing interfaces, sliding springs and butt-welded centre-beam splices; requirements are separate tests, not one combined number.',
    '2612.1(vi) — Reinforced elastomeric joints: abrasion resistance test to IS:3400 (Part 3) or DIN 53516.',
    '2612.2.1 — Manufacturer conducts routine QC for all supplied joints: raw-material tests, manufacturing-process inspection and complete component/assembled-joint dimensional checks against approved drawings.',
    '2612.2.1 — Verify steel grades/test evidence for edge beams and anchor steel, and chloroprene-seal properties listed in Table 2600-1. Original manufacturer provides the complete Quality Control Report; the source requires in-house capability for specified material checks.',
    '2612.3.1 — Engineer insists on applicable acceptance tests before accepting the joint; in imported supply, manufacturer AND local supplier need the stated in-house test facilities.',
    '2612.3.1(i) — Cyclic motion sample: 5,000 expansion/contraction cycles, minimum 30 cycles/hour, with test movement 10% above design movement. Any distress or permanent set rejects the entire lot.',
    '2612.3.1(ii) — Water-tightness ponding: 25% of completed installed joints (at least one); maintain water depth at least 25 mm above highest deck point for at least 4 hours; underside must show no leakage.',
    '2612.3.1(iii–iv) — One-metre random samples: debris expulsion at least 75% after 25 full cycles; seal pull-out resistance at least 150% of rated movement capacity before slip-off (joint types as Table 2600-5).',
    '2612.3.1(v–vi) — Braking/traction is described as an initial acceptance in-house test; steel corrosion treatment must also be assessed. Use Table 2600-5 before selecting any joint-specific test.',
    '2612.3.2/Table 2600-5 — Asphaltic plug: none of the five listed performance-evaluation acceptance tests apply. Other types differ; modular star-marked tests use one-metre edge-beam samples with seal and anchorage.',
    'Table 2600-5 note — All proprietary expansion joints need Contractor minimum 10-year guarantee of satisfactory performance.',
    'SOURCE-CONTROL HOLD — 2612.3.2 calls the acceptance tests “described in Clause 2612.2.1”, although the listed acceptance test procedures appear in 2612.3.1. Preserve the printed text; verify any authoritative correction before changing.'
  ];
  testing.tables = [
    {
      name: '2612.1 · Product-Development Evidence (Not Every-Lot Re-Testing)', status: 'checked',
      headers: ['Joint/component', 'Original source evidence requirement'], rows: [
        ['Single-strip and modular-strip anchorages', 'Recognized-lab dynamic-load anchorage configuration test report'],
        ['Modular suspension sliding bearings', 'Fatigue: 6 million cycles; 5 Hz; loads 80, 120 and 160 kN'],
        ['Modular bearing sliding interface', 'Wear: total sliding distance 5,000 m at 48 kN'],
        ['Modular sliding-spring material', 'Wear: total sliding distance 20,000 m at stress 30 MPa'],
        ['Modular butt-welded centre beam splice', 'Fatigue: 2 million cycles at equivalent stress 165 MPa'],
        ['Reinforced elastomeric joint', 'Abrasion test IS:3400 (Part 3) or DIN 53516']
      ], note: 'Recognized lab/university/institute reports are furnished once for the supplied lot as applicable. Product-development tests are conducted from time to time by the original manufacturer under its quality plan, rather than automatically on each supplied lot.'
    },
    {
      name: '2612.2.1 · Routine Manufacturer QC Evidence', status: 'checked',
      headers: ['QC stage', 'Required evidence / boundary'], rows: [
        ['Raw material — edge beam steel', 'Yield stress, tensile strength and elongation tests for relevant listed steel grade/equivalent IS:2062 Grade B'],
        ['Raw material — anchorage', 'Steel conforms to IS:2062'],
        ['Raw material — chloroprene', 'Table 2600-1 properties: hardness, tensile, fracture elongation, tear, compression set, aged changes, ozone and oil swelling'],
        ['Process inspection', 'Manufacturer inspects applicable welding, corrosion protection, clamping, presetting, greasing, bonding and riveting'],
        ['Dimensional inspection', 'Every component and assembled joint checked against approved drawings/specification tolerances'],
        ['Document', 'Original manufacturer supplies complete Quality Control Report (including imported products)']
      ], note: 'Use governing Table 2600-1 and approved product specification; DIN and ASTM alternatives are not interchangeable. No made-up fixed field-test frequency.'
    },
    {
      name: '2612.3.1 · Acceptance Requirements', status: 'checked',
      headers: ['Test / sample', 'Criterion and evidence'], rows: [
        ['Cyclic motion · one complete assembly OR random 1 m sample; each joint type', '5,000 expansion/contraction cycles; minimum 30 per hour; test motion 110% of design expansion/contraction; distress or permanent set rejects entire supply lot'],
        ['Ponding · 25% completed/installed, minimum 1', 'At least 4 h; water depth ≥25 mm above highest deck point throughout; ponding at least 50 mm beyond anchorage block each side; no underside leakage'],
        ['Debris expulsion · random 1 m sample', '25 full opening/closing cycles with granular debris initially flush with open gap; mass expelled ≥75% of initial debris mass'],
        ['Seal pull-out · random 1 m sample', 'No seal slip-off before extension reaches 150% of rated seal movement capacity'],
        ['Vehicle braking/traction · initial in-house type acceptance', '40 kN locked-wheel load, 50,000 passes/cycles with 2-second period per printed procedure; specialist lab evidence, not a field instruction'],
        ['Erosion/corrosion protection', 'Check adequacy of steel-section corrosion-protection treatment; no numerical universal threshold stated here']
      ], note: 'Applicability depends on Table 2600-5. “Initial acceptance” applies to the braking/traction test; do not treat these testing descriptions as do-it-yourself field test instructions.'
    },
    {
      name: 'Table 2600-5 · Applicable Performance Evaluation Tests', status: 'checked',
      headers: ['Test', 'Asphaltic plug', 'Compression seal', 'Reinforced elastomeric', 'Single strip/box', 'Modular strip/box'], rows: [
        ['Cyclic motion', 'Not applicable', 'Applicable', 'Applicable', 'Applicable', 'Applicable'],
        ['Ponding', 'Not applicable', 'Applicable', 'Applicable', 'Applicable', 'Applicable*'],
        ['Debris expulsion', 'Not applicable', 'Applicable', 'Applicable', 'Applicable', 'Applicable*'],
        ['Pull-out', 'Not applicable', 'Not applicable', 'Not applicable', 'Applicable', 'Applicable*'],
        ['Vehicle braking/traction', 'Not applicable', 'Not applicable', 'Applicable', 'Applicable', 'Applicable*']
      ], note: '* For modular strip-seal joints, the four starred tests use manufacturer-supplied one-metre edge-beam specimens complete with seal and anchorage. Source’s footnote prints “braking/tractor”; table header prints braking/traction, so source wording remains flagged. Proprietary joint Contractor guarantee ≥10 years.'
    },
    {
      name: '2612 · SOURCE-CONTROL Holds', status: 'held',
      headers: ['Printed issue', 'Treatment'], rows: [
        ['2612.3.2 cross-reference', 'Prints “acceptance tests described in Clause 2612.2.1”; actual test descriptions are under 2612.3.1 — do not silently rewrite source'],
        ['Table 2600-5 footnote', 'Uses “vehicular braking/tractor test” where table lists braking/traction; preserve discrepancy'],
        ['Different types of evidence', 'Product-development reports, routine manufacturer QC and supply acceptance are different checks, not a single interchangeable testing frequency']
      ], note: 'All source anomalies remain held for governing-source clarification or formal amendment.'
    }
  ];
  testing.calc = 'No automated pass/fail calculation for structural joint approval. These are documentary, sample and laboratory acceptance checks subject to Table 2600-5 and Engineer decision.';
  const notice = document.querySelector('.note.warn');
  if (notice && notice.innerHTML.includes('Expansion Joints 2601–2610 content is source-checked')) {
    notice.innerHTML = notice.innerHTML.replace('Expansion Joints 2601–2610 content is source-checked', 'Expansion Joints 2601–2612 content is source-checked');
  }
  const requested = new URLSearchParams(location.search).get('clause');
  if (requested === '2611' || requested === '2612') selected = RECORDS.findIndex(r => r.clause === requested && r.section === '2600');
  renderTree();
})();
