/* MoRTH 2610: source-controlled inspection/hold reference for QC module. */
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
})();