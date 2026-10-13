/* MoRTH Fifth Revision 2013, Clauses 2801–2802; selected Clauses 2803–2806 structural-repair QA and material documentation.
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
  h.textContent='MoRTH 2801–2806 — Structural Repair · Pre-Work & QA';
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
    '2804.1.1 / 2804.2.1: Confirm Engineer-approved repair-system selection, traceable product/manufacturer and material-property reports; distinguish epoxy mortar from polymer mortar.',
    '2804.1.7 / 2804.2.6: Check contractor or manufacturer test evidence, including the 2803.9 epoxy cross-reference; do not invent additional frequencies.',
    '2804.1.8: Confirm specialist chemical-hazard documentation, approved safety controls, exposure protection and appropriate waste-management records.',
    'SOURCE HOLD: Printed 2804.2.1 compressive-strength entry "18.20 N/mm²" and slant-shear label require authoritative clarification before numerical approval.',
    '2805.1: Confirm manufacturer and product-system identity; verify documented normal-temperature pot life meets the printed minimum of 60 minutes.',
    '2805.2: Obtain Engineer-reviewed existing-concrete condition and decisions for cracks/spalling, plus contractor inspection sign-off under the approved repair scheme.',
    '2805.3.1: Verify applicable resin test evidence against the 2803.9 cross-reference; keep batch/system traceability and Engineer material-acceptance decisions.',
    '2805.3.2: Verify the authorised design-mix-based bonded-interface test report at 28 days and documented no-failure-at-joint criterion before accepting the specialist record.',
    '2806.1: Verify Portland-cement grout material source, project-specific submission and Engineer approval of any additive or admixture before treating product documents as accepted.',
    '2806.2–2806.5: Verify approved specialist plan, competent supervision, structural/traffic safety arrangements and site inspection records; no construction procedure is provided in this card.',
    '2806.6: Review final percolation test evidence and documented Engineer decision; the historical source prints a result below 2 "lugions". Do not treat this card as a standalone acceptance certificate.',
    '2806.6: Check manufacturer and contract specifications for any specialised polymer-modified grout before Engineer approval.',
    'SOURCE HOLD: Printed 2806.4 stopping-language is potentially ambiguous; do not infer a pressure setting, stopping rule or safe operating method from the app.',
    'LIMIT: 2803–2806 remain partial documentary checks and 2807–2815 are index-only. No grouting-operation, structural assessment or field work authorisation is supplied.'
  ];
  const ul=document.createElement('ul');
  checks.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li);});
  card.appendChild(ul);
  const p=document.createElement('p');
  p.textContent='Planning/inspection reference only. Do not proceed with unsafe structural intervention or infer design approval. Follow competent supervision, contract requirements and documented approvals.';
  card.appendChild(p);
  anchor.insertAdjacentElement('afterend',card);
})();
