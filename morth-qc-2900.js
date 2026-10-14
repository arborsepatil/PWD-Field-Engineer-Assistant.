/* MoRTH Section 2900 Pipe Culverts: documentary QC and payment references only. */
(() => {
  if(!location.pathname.endsWith('/qc.html'))return;
  if(document.getElementById('morth-qc-2900'))return;
  const anchor=document.getElementById('morth-qc-2800');
  if(!anchor)return;
  const card=document.createElement('div');
  card.id='morth-qc-2900';card.className='qc-card';card.style.marginTop='10px';
  const title=document.createElement('h3');
  title.textContent='MoRTH 2901–2911 — Pipe Culvert QC and Measurement';
  card.appendChild(title);
  const checks=["2901–2902: Verify approved pipe design/location, Section 1000 material conformity and consignment-wise Engineer inspection before incorporation.","2903–2904: Retain foundation surveys, Engineer decisions on unsuitable strata, selected bedding type and related material/QC records.","2905: Pipe laying follows Engineer approval of foundation; track pipe condition, alignment, invert and qualified specialist handling plans.","2906: Record selected joint system, finished-joint inspection and documented damp-cover protection for at least four days per the printed source.","2907: Verify backfill source, joint readiness, pipe protection and contract-controlled testing evidence.","2908: Check headwall/wingwall/apron scope against Sections 1300, 1400, 1700 and 2500 as applicable; reconcile BOQ.","2909: Traffic is not permitted until minimum 600 mm cover fill above pipe top under printed source; Engineer must separately authorise opening.","2910: Measure complete pipe culvert in linear metres inlet to outlet; multiple rows count as one unit, not multiple lengths.","2911: Check comprehensive rate inclusions including pipes, handling, excavation, bedding, backfill and ancillary works; avoid duplicate billing.","LIMIT: Site execution and traffic opening require approved plans and competent supervision. No excavation/lifting/installation method, SSR price or certified acceptance."];
  const ul=document.createElement('ul');
  checks.forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.appendChild(li)});
  card.appendChild(ul);
  const note=document.createElement('p');
  note.textContent='Inspection reference only. The Engineer approves material, completed work and opening to traffic; the app does not.';
  card.appendChild(note);
  anchor.insertAdjacentElement('afterend',card);
})();
