/* MoRTH Fifth Revision 2013, Clauses 2801–2802.
   High-level structural-repair field controls only.
   NO epoxy/chemical handling or dismantling operating procedure. */
(() => {
  if (!location.pathname.endsWith('/qc.html')) return;
  if (document.getElementById('morth-qc-2800')) return;
  const anchor=document.getElementById('morth-qc-2700');
  if (!anchor) return;
  const card=document.createElement('div');
  card.id='morth-qc-2800';
  card.className='qc-card';
  card.style.marginTop='10px';
  const h=document.createElement('h3');
  h.textContent='MoRTH 2801–2802 — Structural Repair · Pre-Work QC';
  card.appendChild(h);
  const checks=[
    '2801: Confirm competent assessment, approved repair plan and Engineer instructions before proceeding; repair selection is not a standalone JE checklist decision.',
    '2801: Confirm applicable MoRTH provisions, cited IRC:SP:40/74/80 guidance and special specifications if work falls outside published scope.',
    '2802.1: Verify controls for dust, noise, pollution and potential damage to the surroundings.',
    '2802.2: Verify repair sequence against approved drawings or Engineer directions.',
    '2802.3: Verify traffic safety and barricading/signage/lighting provisions against MoRTH Section 100 and the approved traffic-management plan.',
    '2802.4: Confirm safety measures for site personnel, road users and existing utilities/services.',
    '2802.5: Check dismantling/removal plan against Section 200, approved drawings and Engineer direction.',
    'SOURCE-CONTROL: Clauses 2803–2815 are only indexed here. No chemical procedure, injection pressure, repair-material acceptance limit or sampling frequency has been added.'
  ];
  const ul=document.createElement('ul');
  checks.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li);});
  card.appendChild(ul);
  const p=document.createElement('p');
  p.textContent='Planning/inspection reference only. Do not proceed with unsafe structural intervention or infer design approval. Follow competent supervision, contract requirements and documented approvals.';
  card.appendChild(p);
  anchor.insertAdjacentElement('afterend',card);
})();
