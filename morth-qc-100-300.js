/* MoRTH Fifth Revision 2013 · Sections 100–300 JE documentary QC. */
(() => {
 if(!location.pathname.endsWith('/qc.html'))return;
 if(document.getElementById('morth-qc-100-300'))return;
 const anchor=document.getElementById('morth-qc-3100');
 if(!anchor)return;
 const card=document.createElement('div');card.id='morth-qc-100-300';card.className='qc-card';card.style.marginTop='10px';
 const h=document.createElement('h3');h.textContent='MoRTH 100–300 · General, Clearance, Earthwork QC';card.appendChild(h);
 const checks=["100: Confirm contract scope, latest Engineer-approved drawings and written materials approvals.","100: Maintain benchmark verification, utilities coordination, traffic-plan approval and environmental compliance records.","100: Retain field laboratory test records, measurement sheets, approved rate inclusions and project handover records.","200: Record clearance limits, protected public assets, reuse/salvage and disposal permissions.","200: Dismantling is subject to specialist approval and protective plans; this card does not describe execution.","300: Compare roadway cut and structure excavation against authorised cross-sections, ground classification and payment units.","300: Record embankment borrow-source approvals, layer-wise density test reports and finished level surveys.","300: Review erosion, vegetation and drainage treatment scope, drainage outlets and Engineer inspection reports.","300: Distinguish incidental work from approved BOQ-payable items to avoid duplicate billing.","LIMIT: Only document controls and selected source-checks are represented; contract and Engineer decisions govern."];
 const ul=document.createElement('ul');checks.forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.appendChild(li)});
 card.appendChild(ul);
 const p=document.createElement('p');p.textContent='Source: MoRTH 2013 Fifth Revision, Sections 100–300. Review original contract for acceptance.';card.appendChild(p);
 anchor.insertAdjacentElement('afterend',card);
})();
