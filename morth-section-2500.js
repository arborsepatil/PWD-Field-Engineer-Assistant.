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