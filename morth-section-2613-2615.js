/* MoRTH Fifth Revision (2013), Section 2600, printed p.748.
   Source-checked Clauses 2613–2615: acceptance, measurement and contract rates.
   This is a concise field reference, not a reproduction of the source publication. */
(() => {
  if (typeof RECORDS === 'undefined' || typeof renderTree !== 'function') return;
  const record = id => RECORDS.find(r => r.section === '2600' && r.clause === id);
  const accept = record('2613'), measure = record('2614'), rate = record('2615');
  if (!accept || !measure || !rate) return; // Never introduce a second copy of indexed clauses.

  accept.status = 'partial';
  accept.page = 'Printed p.748 · PDF page mapping QA pending';
  accept.read = 'Source-checked Clause 2613. This general acceptance provision relies on the criteria elsewhere in the governing Specifications; it does not add a new numerical threshold or sampling interval.';
  accept.quick = [
    '2613 — Joint materials must be tested according to the applicable requirements of these Specifications and must satisfy the prescribed criteria.',
    '2613 — Completed work must conform to these Specifications and satisfy the prescribed standards of acceptance.',
    '2613 — Apply the joint-type-specific product, testing and acceptance provisions in Clauses 2601–2612, including Table 2600-5 where applicable. Clause 2613 is not an independent extra test.',
    'JE CHECK — Record governing joint type, relevant source clause, applicable manufacturer QC report/test evidence and Engineer acceptance. This is a practical document-control step, not a new source sampling frequency.'
  ];
  accept.tables = [{
    name: '2613 · Acceptance Scope and Limits', status: 'checked',
    headers: ['Acceptance area', 'Controlling requirement'], rows: [
      ['Materials', 'Test against relevant requirements in these Specifications and satisfy prescribed criteria'],
      ['Workmanship/completed work', 'Conform to these Specifications and meet prescribed acceptance standards'],
      ['Acceptance values/test applicability', 'Consult joint-specific earlier clauses and Table 2600-5; no new numerical limit in 2613'],
      ['Project acceptance', 'Source compliance remains subject to relevant Contract, approved drawings and Engineer authority']
    ],
    note: 'No stand-alone frequency, sample count or numerical pass/fail parameter is printed in Clause 2613.'
  }];
  accept.calc = 'No new acceptance calculator: Clause 2613 states a general conformance obligation without a formula.';

  measure.status = 'partial';
  measure.page = 'Printed p.748 · PDF page mapping QA pending';
  measure.read = 'Source-checked Clause 2614: expansion joint payment measurement is in running metres. No additional numerical measurement rule is printed in this clause.';
  measure.quick = [
    '2614 — Measure expansion joints for payment in running metres (r.m.).',
    '2614 — The source does not specify a second measurement unit here; do not treat components, sealant or tests as automatically separate payment items.',
    'JE CHECK — For the measurement book, identify the joint and record the measured length with the applicable approved drawing/contract item. This is practical guidance, not a source-prescribed measurement format.'
  ];
  measure.tables = [{
    name: '2614 · Measurement for Payment', status: 'checked',
    headers: ['Item', 'Source payment measurement'], rows: [
      ['Expansion joints', 'Running metres (r.m.)']
    ],
    note: 'The clause states the unit only. Payment item boundaries and drawing/Contract administration should not be inferred from unspecified details.'
  }];
  measure.calc = 'No independent quantity calculator specified by Clause 2614. Measure actual approved length for the payment record.';

  rate.status = 'partial';
  rate.page = 'Printed p.748 · PDF page mapping QA pending';
  rate.read = 'Source-checked Clause 2615. The included cost components depend on whether the agreement is supply-and-installation, supply-only or installation-only. No numerical rate is given.';
  rate.quick = [
    '2615 — SUPPLY + INSTALLATION contract: unit rate includes all material, labour, equipment and incidental charges to procure and fix joints complete as specified.',
    '2615 — FILLER JOINT under supply + installation: running-metre unit rate includes sealant for the depth shown on drawings.',
    '2615 — SUPPLY-ONLY contract: unit rate covers all expansion-joint components, anchorage system, pre-installation fabrication, transport of assembled joints, handling and other incidental charges.',
    '2615 — INSTALLATION-ONLY contract: unit rate covers materials, labour, equipment and incidental charges required to install joints complete under these Specifications.',
    '2615 — The clause provides scope of rate inclusions, not a rupee value or authority to add a separate payment for an included component.',
    'JE CHECK — Verify the actual contract category and BOQ description before evaluating a claim; the source does not supply contract-specific pricing.'
  ];
  rate.tables = [{
    name: '2615 · Contract Category and Rate Inclusions', status: 'checked',
    headers: ['Contract category', 'Inclusions in contract unit rate'], rows: [
      ['Supply and installation', 'Material, labour, equipment, incidental procuring/fixing costs, complete work'],
      ['Supply and installation — filler joint', 'Above; also sealant for depth specified in drawings, included in running-metre rate'],
      ['Supply only', 'All joint components including anchors; pre-installation fabrication; transport of assembled joints; handling; incidental costs'],
      ['Installation only', 'Materials, labour, equipment and incidental costs for complete installation as specified']
    ],
    note: 'Select the correct agreement scope. The source does not provide SSR rates, GST, extra-item rules or monetary values. Do not infer those from Clause 2615.'
  }];
  rate.calc = 'No rate-analysis calculator: Clause 2615 states inclusions only, without unit prices or resource coefficients.';

  const notice = document.querySelector('.note.warn');
  if (notice && notice.innerHTML.includes('Expansion Joints 2601–2612 content is source-checked')) {
    notice.innerHTML = notice.innerHTML.replace('Expansion Joints 2601–2612 content is source-checked', 'Expansion Joints 2601–2615 content is source-checked');
  }
  const requested = new URLSearchParams(location.search).get('clause');
  if (['2613', '2614', '2615'].includes(requested)) {
    selected = RECORDS.findIndex(r => r.section === '2600' && r.clause === requested);
  }
  renderTree();
})();
