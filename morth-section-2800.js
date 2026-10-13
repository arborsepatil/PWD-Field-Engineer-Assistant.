/* MoRTH Section 2800 — Repair of Structures.
   Source: Fifth Revision (2013), printed pp.759 onward.
   Clauses 2801–2802 verified; 2803–2805 have PARTIAL QA reviews.
   No specialist repair procedures; 2806–2815 remain index-only. */
(() => {
  if (typeof RECORDS === 'undefined' || typeof renderTree !== 'function') return;
  if (RECORDS.some(r => r.section === '2800')) return;
  const idx = [
    ['2801','Description',759],
    ['2802','General',759],
    ['2803','Sealing of Cracks by Injection of Epoxy Resin',759],
    ['2804','Replacement of Spalled Concrete by Epoxy Mortar/Polymer Mortar',766],
    ['2805','Epoxy Bonding of New Concrete to Old Concrete',769],
    ['2806','Cement Grouting',769],
    ['2807','Guniting/Shotcreting',771],
    ['2808','Protective Surface Coating of Concrete by Acrylic Elastomeric Coating',773],
    ['2809','Protective Surface Coating of Concrete by Patented Systems of Coating',775],
    ['2810','Replacement of Bearings',776],
    ['2811','Repair and Replacement of Wearing Coat',776],
    ['2812','External Prestressing',777],
    ['2813','Tests and Standards of Acceptance',778],
    ['2814','Measurements for Payment',779],
    ['2815','Rate',779]
  ];
  const list = idx.map(([clause, title, page], i) => ({
    id:2400+i, section:'2800', clause, title,
    page:'Printed p.'+page+' · PDF viewer page mapping QA pending',
    status:i<5?'partial':'index',
    read:i<2?'Source-checked against the MoRTH Fifth Revision (2013) PDF.':i===2?'Selected approval/QA subclauses verified; not a full injection procedure.':i===3?'Selected material testing, safety and QC documentation verified; detailed repair operations withheld.':i===4?'Selected bonding material and test-report controls verified; no specialist application instructions.':'Contents-index entry only. Detailed technical guidance not verified; do not treat this entry as approved engineering instructions.',
    quick:[], tables:[],
    calc:'No automated repair-design or acceptance calculator. Use approved repair plans, project specifications, specialist supervision and Engineer approval.'
  }));
  const description=list[0];
  description.read='Clause 2801, printed p.759: repair scope and approval hierarchy checked. Original MoRTH source is the Fifth Revision (2013); current contract amendments must also be consulted.';
  description.quick=[
    '2801 — Carry out structural repairs to the approved repair plans, applicable MoRTH specifications or Engineer instructions.',
    '2801 — Where an intended repair is outside the scope of these specifications, prepare and approve an appropriate special specification.',
    '2801 — The source additionally refers to IRC:SP:40, IRC:SP:74 and IRC:SP:80 for the implementation of repair schemes.',
    '2801 — Never use a generic repair checklist as proof that a cracked or damaged structural member is safe; obtain engineering assessment and approved repair design.'
  ];
  description.tables=[{
    name:'2801 · Structural Repair Source and Authority',
    status:'checked',
    headers:['Decision stage','Source/required control'],
    rows:[
      ['Condition assessment','Identify defect and affected member; arrange competent engineering assessment'],
      ['Execution authority','Approved repair plan and MoRTH specifications, or Engineer direction'],
      ['Uncovered repair method','Specific approved specification rather than inventing acceptance limits'],
      ['Related referenced guidance','IRC:SP:40; IRC:SP:74; IRC:SP:80 as stated in printed Clause 2801'],
      ['Design/structural safety','Not certified by this reader; verify approved engineering decisions']
    ],
    note:'Engineering assessment is site guidance, separate from the code language above. Referenced IRC editions and any contract revisions must be verified before use.'
  }];
  description.calc='No structural capacity, crack-repair selection or safe-to-open certification can be generated from Clause 2801.';

  const general=list[1];
  general.read='Clause 2802.1–2802.5, printed p.759: environmental mitigation, phasing, traffic management, safety and dismantling controls checked.';
  general.quick=[
    '2802.1 — Provide suitable mitigation for noise, dust, pollution and temporary or permanent environmental impacts.',
    '2802.2 — Follow the repair sequence shown on drawings or directed by the Engineer.',
    '2802.3 — Traffic management, signage, signalling, barricading and lighting shall conform to MoRTH Section 100.',
    '2802.4 — Protect site personnel, road users and existing services throughout repair activity.',
    '2802.5 — Dismantle bridge components and remove materials in conformity with MoRTH Section 200, drawings and Engineer direction.',
    '2802 — These are mandatory governance controls. Specific temporary works, traffic diversion and demolition plans require project-level review and approval.'
  ];
  general.tables=[{
    name:'2802 · JE Pre-Work Control Checklist',
    status:'checked',
    headers:['Subclause','Inspection hold / documentation'],
    rows:[
      ['2802.1 · Environment','Verify noise, dust, pollution and surrounding-area mitigation arrangements'],
      ['2802.2 · Phasing','Approved sequence on drawing or written Engineer direction'],
      ['2802.3 · Traffic','Section 100-compliant traffic safety and arrangements before affecting users'],
      ['2802.4 · Safety','Personnel, public and existing utility protection considered and implemented'],
      ['2802.5 · Dismantling','Section 200 plus approved dismantling drawings/Engineer direction']
    ],
    note:'Checklist paraphrases verified requirements; it does not supply a specific traffic-control layout, dismantling procedure or site-specific structural assessment.'
  }];
  general.calc='No demolition method, temporary support design, safe access design or numerical acceptance rule is inferred from Clause 2802.';

  const cracks=list[2];
  cracks.read='Source-checked selected requirements of 2803.1–2803.3 and quality evidence in 2803.9.1–2803.9.3, printed pp.759–765. Clause remains PARTIAL: material specifications, application procedures, detailed test procedures and specialist execution are not reproduced.';
  cracks.quick=[
    '2803.1 — Structural bonding using epoxy adhesive is governed by the MoRTH repair specifications and the approved structural repair scheme.',
    '2803.2 — Before work, obtain the contractor method statement covering method, material sources, equipment, personnel and supervision.',
    '2803.3 — Injection work requires qualified, experienced contractor personnel; this JE reader does not authorise injection by untrained staff.',
    '2803.9.1 — Prior to material approval, contractor test evidence is required for each resin/hardener batch and combination; subsequent tests are subject to Engineer direction.',
    '2803.9.2 — Core acceptance is Engineer-directed, including locations chosen to avoid critical or highly stressed portions of the member; failed acceptance requires remedial review before continuation.',
    '2803.9.3 — Contractor maintains complete pressure-test and proportion-test records for injection equipment, available to the Engineer throughout the work.',
    'HOLD — Detailed 2803.4–2803.8 material, equipment and injection steps are intentionally excluded here. Refer to the full source, approved repair plan and specialist method statement.'
  ];
  cracks.tables=[{
    name:'2803 · Structural Crack Repair — Documentary QC (limited source check)',
    status:'checked',
    headers:['MoRTH reference','Evidence to check','Authority / limitation'],
    rows:[
      ['2803.1–2803.3','Approved repair scheme; contractor method statement; material source and equipment list; specialist personnel qualifications','Engineer/specialist acceptance before work'],
      ['2803.9.1 · pre-approval material tests','Batch-wise viscosity, pot life and bond results (three specimens each); shear results (six specimens: three after 24 h and three after 72 h)','Contractor test records from site or authorised laboratory; further testing per Engineer'],
      ['2803.9.2 · core acceptance','Engineer direction, approved non-critical sampling location, initial sampling evidence and acceptance reports','Further sampling frequency directed/agreed by Engineer; do not initiate destructive coring from a generic checklist'],
      ['2803.9.3 · equipment verification','Complete, accurate specialist pressure and proportion test reports available to Engineer','Equipment test methods/pressures are not instructions in this app'],
      ['Source boundary','2803.4–2803.8 plus detailed 2803.9 procedures not included in this reader','No automatic material acceptance, crack-sealing method selection or structural safety certification']
    ],
    note:'Source: MoRTH Fifth Revision (2013), printed pp.759–765, Clause 2803.1–2803.3 and 2803.9.1–2803.9.3. Numerical specimen counts above are source-derived; not general-purpose QC sampling frequencies. Confirm contract amendments and approved specialist documentation.'
  }];
  cracks.calc='No dosage, injection pressure, mixing ratio, repair procedure or automatic pass/fail calculation. Structural safety, core testing, material approval and method selection require competent supervision.';

  // Clause 2804: documentary source/QC review only; not a repair procedure.
  const spalled=list[3];
  spalled.read='Source-checked selected MoRTH Fifth Revision 2013 requirements, printed pp.766–769: 2804.1.1, 2804.1.7–2804.1.8, 2804.2.1 and 2804.2.6. PARTIAL only: detailed chemical/product application requirements have not been transcribed.';
  spalled.quick=[
    '2804.1 / 2804.2 — Epoxy mortar and polymer-modified cementitious mortar are different systems; material choice requires the approved repair design and Engineer direction.',
    '2804.1.1 — Contractor material-submission and sample-test evidence must be assessed against the specified epoxy mortar properties; confirm manufacturer identity.',
    '2804.1.7 — Epoxy mortar test acceptance refers to Clause 2803.9. Check authorised lab/contractor evidence and Engineer decision.',
    '2804.1.8 — Confirm product hazard information, protective measures, safe-working arrangements, environmental controls and disposal records through the specialist contractor.',
    '2804.2.1 / 2804.2.6 — Verify polymer mortar supplier identity and manufacturer test evidence for the published properties; do not treat epoxy and PMC as interchangeable.',
    'SOURCE-CONTROL: Polymer mortar compressive strength is printed "18.20 N/mm²" in 2804.2.1, an ambiguous notation. Preserve it and seek authoritative clarification, not a guessed range.',
    'HOLD: No mixing, acid/solvent handling, surface preparation, construction sequence, coating technique or chemical waste-treatment instructions are provided.'
  ];
  spalled.tables=[
    {name:'2804 · Engineer/JE Material Documentation Matrix',status:'checked',
     headers:['Reference','Document to verify','Authority / hold'],
     rows:[
      ['2804.1.1 · Epoxy mortar','Approved source/manufacturer, sample test certificates and traceable product identity','Engineer and structural repair specification control material approval'],
      ['2804.1.7 · Epoxy tests','Material conformity evidence with 2803.9 cross-reference','No app-driven laboratory procedure or sampling inference'],
      ['2804.1.8 · Personnel / environment','Specialist hazard documentation, protective controls, safe site plan, ventilation/exposure and disposal records','Contractor specialist and site safety officer govern'],
      ['2804.2.1 · Polymer mortar','Supplier/manufacturer and material-property test reports','Compressive-strength print "18.20" held for clarification'],
      ['2804.2.6 · Polymer tests','Manufacturer-supported tests satisfying the specified 2804.2.1 requirements','No independent test frequency supplied']
     ],
     note:'MoRTH Fifth Revision 2013 printed pp.766–769. The approved repair scheme, current contract, manufacturer and Engineer govern. Not a material approval certificate.'},
    {name:'2804 · Selected Published Properties — Source-Controlled',status:'checked',
     headers:['Reference','Published entry','Interpretation policy'],
     rows:[
      ['2804.1.1','Epoxy mortar pot life 60 min at 30°C; bond strength 12 MPa; tensile strength 16 MPa','Test report reference only; no automatic approval'],
      ['2804.2.1','Polymer mortar pot life 60 min at 30°C; flexural strength after 28 days 3.0–5.0 N/mm²','Verify report, amendment and source'],
      ['2804.2.1','Compressive strength after 28 days printed "18.20 N/mm²"','SOURCE HOLD: do not infer 18–20 or a single threshold'],
      ['2804.2.1','Unusual printed slant-shear label "Addition to concrete": 3.0–5.0 N/mm²','SOURCE HOLD: clarify intended criterion before acceptance'],
      ['2804.1.7 / 2804.2.6','Epoxy tests cross-reference 2803.9; polymer must meet manufacturer and 2804.2.1','No invented frequency or testing method']
     ],
     note:'Only select documented QC figures. Chemical work instructions and field acceptance decisions are deliberately excluded.'}
  ];
  spalled.calc='No structural repair selection, chemical handling, quantity/coverage estimate or automatic pass/fail. Engineer review is mandatory.';

  // Clause 2805 — material traceability and Engineer-controlled acceptance evidence.
  // No epoxy application sequence, chemical preparation or repair design is supplied.
  const newOldBond=list[4];
  newOldBond.read='MoRTH Fifth Revision (2013), printed p.769. Selected requirements source-checked: 2805.1, 2805.2 (inspection/Engineer hold points only) and 2805.3.1–2805.3.2 (authorised test evidence). PARTIAL reader: no repair execution procedure or chemical-handling guidance.';
  newOldBond.quick=[
    '2805.1 — Verify bonding resin manufacturer and documented minimum pot-life performance: at least 60 minutes at the normal temperature stated in the specification.',
    '2805.2 — Verify the existing concrete interface and defects are assessed and repair decisions recorded by the Engineer under the approved plan before new-to-old concrete work.',
    '2805.2 — Obtain contractor inspection evidence for substrate readiness and the approved product-system compatibility; do not treat a photographic checklist as structural approval.',
    '2805.3.1 — Collect resin test evidence conforming to referenced Clause 2803.9; supplier declarations alone are not independent approval.',
    '2805.3.2 — Obtain the authorised interface-bond test report for the approved design-mix system and verify that the reported 28-day result does not show failure at the bonded joint.',
    '2805 — HOLD: Bonding-system selection, substrate treatment, chemical handling, application quantity, construction sequence and in-situ structural adequacy remain specialist/Engineer responsibilities.',
    'SOURCE-CONTROL — The connected Fifth Revision is historical; approved design, contract amendments, project safety plan and authorised test records govern actual site use.'
  ];
  newOldBond.tables=[
    {name:'2805 · New-to-Old Concrete Bond — JE Documentary Holds',status:'checked',
     headers:['Clause','Evidence / inspection review','Responsibility / hold'],
     rows:[
      ['2805.1 · Manufacturer','Product identity, supplier traceability, normal-temperature pot-life report (at least 60 min)','Engineer evaluates approved product/system'],
      ['2805.2 · Existing concrete','Recorded condition of interface and repair-necessity assessment, approved work/inspection plan','Engineer chooses treatment for any cracks or spalling; not an app decision'],
      ['2805.2 · Readiness','Contractor sign-off on interface readiness and manufacturer/system compatibility','Qualified supervisor and Engineer control site hold points'],
      ['2805.3.1 · Resin QC','Test records checked against Clause 2803.9','Verify source, batch traceability and Engineer acceptance record'],
      ['2805.3.2 · Bond test','Authorised report identifies approved concrete design mix, test-age evidence and failure location','Source criterion: no bond-joint failure in specified test; do not run auto-pass/fail'],
      ['Safety / scope','Approved repair scheme and qualified repair contractor supervision','No mixing, dosing, application or hazardous-material operating instructions']
     ],
     note:'Source-verified selected requirements: MoRTH Fifth Revision 2013, Clause 2805, printed p.769. Records are documentary checks; original test arrangement and full safety controls require the source, approved documents and competent supervision.'
    },
    {name:'2805 · Testing and Approval Traceability',status:'checked',
     headers:['Source / checkpoint','Record to retain','Important distinction'],
     rows:[
      ['2805.1','Manufacturer and normal-temperature pot-life compliance evidence','Published minimum is a material characteristic, not permission to execute'],
      ['2805.3.1','2803.9 test-reference compliance and batch/system identity','Test applicability must be assessed by the Engineer'],
      ['2805.3.2','Approved design mix, authorised test assembly and 28-day test report','Acceptance hinges on the specified interface-joint behaviour; no automatic structural certificate'],
      ['Approval','Signed material review, inspection hold-point release and test acceptance','No independent designer replacement or implied contractor authorisation']
     ],
     note:'Do not infer extra frequencies, substitute a generic cube strength test for the specified bonded-joint test, or treat this partial summary as a full execution specification.'
    }
  ];
  newOldBond.calc='No epoxy application calculation, product dosing, site methodology, structural capacity estimation or automatic acceptance. Consult qualified specialists, approved repair scheme and Engineer.';
  RECORDS.push(...list);
  const filter=document.getElementById('sectionFilter');
  if(filter && !filter.querySelector('option[value="2800"]')) {
    const option=document.createElement('option');
    option.value='2800'; option.textContent='Section 2800';
    filter.appendChild(option);
  }
  const note=document.querySelector('.note.warn');
  if(note && note.innerHTML.includes('Wearing Coat/Appurtenances 2701–2709 content is source-checked')) {
    note.innerHTML=note.innerHTML.replace('Wearing Coat/Appurtenances 2701–2709 content is source-checked',
      'Wearing Coat/Appurtenances 2701–2709, Repair of Structures 2801–2802 and selected Clauses 2803–2805 QA controls are source-checked');
  }
  const requested=new URLSearchParams(location.search).get('clause');
  if(list.some(r=>r.clause===requested)) selected=RECORDS.findIndex(r=>r.section==='2800' && r.clause===requested);
  renderTree();
})();
