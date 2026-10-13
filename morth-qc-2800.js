/* MoRTH Fifth Revision 2013, Clauses 2801–2802; selected Clause 2803.1–2803.3, 2803.9 documentary QA.
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
  h.textContent='MoRTH 2801–2803 — Structural Repair · Pre-Work & QA';
  card.appendChild(h);
  const checks=[
    '2801: Confirm competent assessment, approved repair plan and Engineer instructions before proceeding; repair selection is not a standalone JE checklist decision.',
    '2801: Confirm applicable MoRTH provisions, cited IRC:SP:40/74/80 guidance and special specifications if work falls outside published scope.',
    '2802.1: Verify controls for dust, noise, pollution and potential damage to the surroundings.',
    '2802.2: Verify repair sequence against approved drawings or Engineer directions.',
    '2802.3: Verify traffic safety and barricading/signage/lighting provisions against MoRTH Section 100 and the approved traffic-management plan.',
    '2802.4: Confirm safety measures for site personnel, road users and existing utilities/services.',
    '2802.5: Check dismantling/removal plan against Section 200, approved drawings and Engineer direction.',
    '2803.2–2803.3: Obtain contractor method statement listing material sources, equipment, specialist supervision and qualifications; only experienced personnel undertake specialist work.',
    '2803.9.1: Review batch/combination-linked material test certificates for viscosity, pot life and bond (three specimens each), and shear (six: three after 24 h, three after 72 h) before material approval.',
    '2803.9.2: Core acceptance, if directed, requires Engineer-approved locations away from critical or stressed areas, recorded results and Engineer decision; failure means further work is held pending review.',
    '2803.9.3: Obtain complete equipment pressure and proportion test logs from the qualified specialist; Engineer may require additional checks.',
    'SOURCE-CONTROL: Clause 2803 is only partially represented. Clauses 2803.4–2803.8, detailed test operations and 2804–2815 are not procedural guidance here.'
  ];
  const ul=document.createElement('ul');
  checks.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li);});
  card.appendChild(ul);
  const p=document.createElement('p');
  p.textContent='Planning/inspection reference only. Do not proceed with unsafe structural intervention or infer design approval. Follow competent supervision, contract requirements and documented approvals.';
  card.appendChild(p);
  anchor.insertAdjacentElement('afterend',card);
})();
