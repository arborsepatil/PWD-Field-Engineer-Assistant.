/* MoRTH 2610 and 2612: source-controlled inspection/acceptance references for QC. */
(() => {
  if (!location.pathname.endsWith('/qc.html')) return;
  if (document.getElementById('morth-qc-2610')) return;
  const target=[...document.querySelectorAll('h3')].find(h=>h.textContent.startsWith('DLC · Dry Lean Cement Concrete'))?.closest('.qc-card');
  if (!target) return;
  const card=document.createElement('div');
  card.id='morth-qc-2610'; card.className='qc-card'; card.style.marginTop='10px';
  const heading=document.createElement('h3');
  heading.textContent='MoRTH 2610 — Expansion Joint Installation / JE Inspection';
  card.appendChild(heading);
  const items=[
    '2610.1: Manufacturer/supplier engineer supervision and installation manual required',
    '2610.1(ix): Engineer WRITTEN confirmation of recorded joint position before recess concreting',
    '2610.1(ix): Recess concrete at least superstructure grade, minimum M35; water-cement ratio not above 0.40',
    '2610.1(x): No traffic loading before completion of carriageway surfacing; Engineer release separately governs',
    '2610.2: Asphaltic plug installation ambient 5–35°C, not in rain/snow; joint width 500–750 mm, depth 75–100 mm',
    '2610.3: Compression seal recess at least 300 mm EACH side; ambient installation 5–35°C',
    '2610.4–5: Approved movement gap and measured bridge temperature govern strip/modular joint preset',
    '2610.6(ii): Second-stage concreting within 24 h is preferable; delayed case depends on bearing system',
    '2610.6(vi): No fixing-bolt drilling within 7 days of concreting; specific post-tensioned fixing bolts at least 4 weeks after stressing',
    'SOURCE-CONTROL: Clause 2610.6(iii) prints 2610.9.1, not found in extracted Section 2610'
  ];
  const ul=document.createElement('ul');
  for (const line of items){ const li=document.createElement('li'); li.textContent=line; ul.appendChild(li); }
  card.appendChild(ul);
  const note=document.createElement('p');
  note.textContent='Inspection reference only, not an installation procedure. No source-defined independent sampling frequency. Approved drawings, Contract, manufacturer and Engineer govern.';
  card.appendChild(note);
  target.insertAdjacentElement('beforebegin',card);

  // Clause 2612 acceptance is laboratory/product evidence and installed-joint checks.
  if (!document.getElementById('morth-qc-2612')) {
    const acceptance=document.createElement('div');
    acceptance.id='morth-qc-2612'; acceptance.className='qc-card'; acceptance.style.marginTop='10px';
    const title=document.createElement('h3');
    title.textContent='MoRTH 2612 — Expansion Joint Testing / Acceptance';
    acceptance.appendChild(title);
    const checks=[
      '2612.1: Collect applicable recognized-laboratory fatigue/wear and anchorage evidence once for supply lot. Original manufacturer repeats development tests under its quality plan, not automatically on each lot.',
      '2612.2.1: Verify original manufacturer QC report: material-grade tests, process inspection and complete dimensions against approved drawings.',
      '2612.3.1: Engineer insists on joint-type-appropriate acceptance tests; see Table 2600-5 before selecting tests.',
      'Cyclic motion (as applicable): 5,000 cycles, test movement 10% above design; any distress/permanent set rejects entire lot.',
      'Ponding (as applicable): test 25% of completed installed joints, minimum one; at least 4 h at ≥25 mm water depth over highest deck point, ≥50 mm beyond each anchorage block, no leakage below.',
      'Debris expulsion (as applicable): 1 m random sample, 25 cycles; at least 75% by initial debris mass expelled.',
      'Seal pull-out (strip and modular only): 1 m random sample; no slip-off below 150% of seal rated movement capacity.',
      'Brake/traction: initial in-house test only for reinforced elastomeric, single strip and modular joints; documentary lab acceptance under governing Clause 2612.',
      'Modular starred tests in Table 2600-5: manufacturer-supplied 1 m edge-beam sample with seal and anchorage, not the full installed modular joint.',
      'Proprietary expansion joints: Contractor guarantee of satisfactory performance at least 10 years.',
      'SOURCE-CONTROL: 2612.3.2 references 2612.2.1 for acceptance tests, while procedures appear in 2612.3.1; printed reference held, not silently corrected.'
    ];
    const list=document.createElement('ul');
    checks.forEach(check=>{const li=document.createElement('li');li.textContent=check;list.appendChild(li);});
    acceptance.appendChild(list);
    const caution=document.createElement('p');
    caution.textContent='Use approved product, source Table 2600-5, manufacturer laboratory reports and Engineer acceptance. These are QC references, not specialist laboratory test instructions.';
    acceptance.appendChild(caution);
    card.insertAdjacentElement('afterend',acceptance);
  }
})();