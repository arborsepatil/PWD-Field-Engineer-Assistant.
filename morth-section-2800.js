/* MoRTH Section 2800 — Repair of Structures.
   Source: Fifth Revision (2013), printed pp.759 onward.
   Clauses 2801–2802 verified; 2803–2815 have PARTIAL QA reviews.
   No specialist repair procedures, structural certification or auto approval. */
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
    status:'partial',
    read:i<2?'Source-checked against MoRTH Fifth Revision (2013).':i<9?'Selected source-backed QC/approval requirements checked; specialist procedures excluded.':'Selected source-backed documentation, acceptance, measurement and rate-inclusion checks verified; no independent engineering or billing approval.',
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

  // Clause 2806: source-backed documentary review only, not a pressure
  // grouting, drilling, mixing, pumping or chemical-admixture operating guide.
  const cementGrouting=list[5];
  cementGrouting.read='MoRTH Fifth Revision (2013), printed pp.769–771. Source-checked selected material governance under 2806.1 and testing/contractor-record requirements under 2806.6. Clauses 2806.2–2806.5 were inspected but field-operating instructions are not provided. PARTIAL scope; approved scheme and specialist supervision govern.';
  cementGrouting.quick=[
    '2806.1 — Verify the approved grout material submission and documented suitability for the intended repair; the source describes Portland-cement-based grout as normal practice.',
    '2806.1 — Any proposed additive or admixture requires Engineer approval; manufacturer or contractor preference alone is not an authorisation.',
    '2806.1 — Confirm the contractor has a project-specific material/workability assessment endorsed under the approved repair scheme. Do not infer an automatic site mix from historical example values.',
    '2806.2–2806.5 — The source contains specialist preparation, equipment and application requirements. Record approval of the specialist method statement, safety arrangements, supervising personnel and inspection hold points; no operational instructions are supplied here.',
    '2806.6 — Review the final percolation test report. The printed acceptance statement requires a result below 2 "lugions" (historical spelling); record the tested value and Engineer decision without auto-accepting.',
    '2806.6 — For specialised polymer-modified cementitious grout, confirm the applicable manufacturer literature/specification is part of the approved submission.',
    'SOURCE-CONTROL HOLD — Printed Clause 2806.4 has potentially confusing stopping-language. Keep original source and Engineer-approved method authoritative; do not extrapolate a stop rule, pressure range or pump setting from this app.'
  ];
  cementGrouting.tables=[
    {
      name:'2806 · Cement Grouting — PWD JE Documentary Inspection',
      status:'checked',
      headers:['Clause','Evidence / site record','Engineer / specialist hold'],
      rows:[
        ['2806.1 · Materials','Product identification, cement source, approved grout submission, site-specific compatibility and material records','Approval and material suitability require Engineer decision'],
        ['2806.1 · Admixtures','Proposal and written approval for any additive/admixture, with traceable material identity','No default admixture is authorised'],
        ['2806.2–2806.5 · Work method','Approved specialist work plan, supervision, condition survey, protective measures and inspection record','These are documentation controls only; no drilling or pumping guidance'],
        ['2806.6 · Final test','Percolation test report after completion with location, result, tester and Engineer review','Printed acceptance statement is below 2 "lugions"; no automated clearance'],
        ['2806.6 · Specialised grout','Manufacturer literature, project specification and approval for polymer-modified systems','Do not substitute a generic cement-grout checklist for a specialist system']
      ],
      note:'Source: MoRTH Fifth Revision (2013), Section 2800, pp.769–771. Method-statement and inspection-record prompts are practical site-governance notes, not new prescriptive MoRTH test frequencies or construction methods.'
    },
    {
      name:'2806 · Source-Critical Distinctions',
      status:'checked',
      headers:['Subject','Verified source reference','App treatment'],
      rows:[
        ['Material selection · 2806.1','Portland cement grout and Engineer approval for additives','Source summary only; no material quantity or water-ratio calculator'],
        ['Site implementation · 2806.2–2806.5','Preparation, equipment and application in the original source','HOLD: qualified specialist plan and site safety approval; no execution or equipment settings'],
        ['End-of-work quality · 2806.6','Percolation requirement printed below 2 "lugions"','Record laboratory/field test evidence; no algorithmic pass/fail'],
        ['Specialised grout · 2806.6','Follow approved manufacturer specifications for polymer-modified cementitious systems','Specialist supplier information cannot override contract and Engineer authority'],
        ['Historical ambiguity · 2806.4','Ambiguous printed work-continuation wording','SOURCE HOLD: consult the controlling original document / contract clarification']
      ],
      note:'The spelling "lugions" is retained as printed; the accepted test name/unit and laboratory method should be verified against approved project documentation. No other acceptance number or test frequency is inferred.'
    }
  ];
  cementGrouting.calc='No grouting pressure, drilling geometry, mixing sequence, dose, pump-operation or quantity calculator. Review approved material and test records with the competent Engineer.';

  // 2807–2809: Engineering documentary checks only. No specialist equipment
  // settings, handling, spraying, chemical procedures or structural approval.
  const shotcrete=list[6];
  shotcrete.read='MoRTH Fifth Revision (2013), selected Clause 2807 requirements, printed pp.771–773. Material and test-panel QA records checked; PARTIAL scope. Specialist instructions in original code are not reproduced.';
  shotcrete.quick=[
    '2807.2–2807.4: Check supplier identity and conformity documents for cement and aggregates against the IS references cited in the source (including IS:269, IS:383 and IS:9012).',
    '2807.6–2807.8: Retain approved preconstruction test-panel and authorised laboratory strength results. The source refers to a strength of approximately 25 MPa at 28 days; Engineer approval is essential.',
    '2807.9–2807.13: Confirm competent existing-member assessment and approved repair/reinforcement plan before considering site-inspection release.',
    '2807.14–2807.15: Review contractor documentation for rejected/rebound material, curing and weather-related controls under the approved method.',
    'HOLD: No proportioning, nozzle operation, spraying, surface-removal or reinforcement-replacement instructions or automatic acceptance.'
  ];
  shotcrete.tables=[{
    name:'2807 · Shotcrete Pre-Work and QC Records',status:'checked',
    headers:['Source','JE documentary review','Authority'],
    rows:[
      ['2807.2–2807.4','Cement, aggregate and any specialist material traceability and conformity evidence','Engineer-approved repair material submission'],
      ['2807.6–2807.8','Test-panel identification, recognised laboratory report and 28-day performance result','Applicable IS:9012 and signed Engineer decision'],
      ['2807.9–2807.13','Member assessment and repair-design approval; reinforcement inspection hold','Competent structural professional and Engineer'],
      ['2807.14–2807.15','Rejected material, protection and curing records','Qualified contractor QC and safety plan']
    ],
    note:'MoRTH Fifth Revision (2013), pp.771–773. Site documentation suggestions do not invent a new test sampling frequency.'
  }];
  shotcrete.calc='No structural safety certificate, mix calculator, rebound reuse or shotcrete operating guide.';

  const acrylic=list[7];
  acrylic.read='MoRTH Fifth Revision (2013), selected Clause 2808 requirements, printed pp.773–775, including coating performance, laboratory evidence, stock register and performance guarantee. PARTIAL; no application procedure.';
  acrylic.quick=[
    '2808.1–2808.2: Verify acrylic elastomeric coating technical certificates for anti-carbonation, UV and moisture-vapour diffusion performance against approved contract criteria.',
    '2808.3: Verify pre-approval laboratory reports and execution-consignment random-sample testing; keep a site stock register periodically signed by the Engineer.',
    '2808.6: Confirm authorised experienced technical applicator and minimum five-year performance guarantee from the executing agency.',
    'SOURCE HOLD: Clause 2808.3 cites Table 2800-1 while its acrylic performance table is printed as Table 2800-2; seek clarification.',
    'SOURCE HOLD: The printed adhesion-unit notation in Table 2800-2 is questionable; do not guess a corrected unit or numerical acceptance limit.',
    'HOLD: No product handling, surface preparation, application rate or thickness-calculation procedure is supplied.'
  ];
  acrylic.tables=[{
    name:'2808 · Acrylic Coating Approval and QA',status:'checked',
    headers:['Source','Evidence to retain','Approval / hold'],
    rows:[
      ['2808.1–2808.2 / Table 2800-2','Batch/product technical data and accredited laboratory performance certificates','Engineer verifies current contract specification'],
      ['2808.3','Pre-approval and site-sample test reports plus Engineer-signed stock register','No frequency beyond source term random is inferred'],
      ['2808.6','Authorised applicator credentials; executing agency guarantee minimum five years','Signed performance guarantee required'],
      ['Printed discrepancy','2808.3 table reference and Table 2800-2 adhesion units','SOURCE HOLD: no automatic numerical acceptance']
    ],
    note:'MoRTH Fifth Revision (2013) pp.773–775; Table 2800-2 printed values not corrected or converted where ambiguous.'
  }];
  acrylic.calc='No application, thickness or consumption calculator or chemical handling guidance.';

  const patented=list[8];
  patented.read='MoRTH Fifth Revision (2013), source-checked Clause 2809, printed pp.775–776; Engineer approval, relevant product-performance records and guarantee. No application instructions.';
  patented.quick=[
    '2809: Patented coating systems require Engineer approval based on an assessment of product performance.',
    '2809: Retain relevant certificates from users and acceptance-test reports to published standards for carbonation, vapour diffusion, crack bridging, UV resistance and related criteria.',
    '2809: The executing agency must provide a minimum five-year performance guarantee.',
    'HOLD: No automatic proprietary-product selection or structural certification.'
  ];
  patented.tables=[{
    name:'2809 · Proprietary Protective Coating Approval',status:'checked',
    headers:['Stage','Evidence','Engineer action'],
    rows:[
      ['Product assessment','Technical proposal, user certificates and relevant published-standard test reports','Approve or reject the proposed system'],
      ['Performance guarantee','Executing agency guarantee for at least five years','Retain signed guarantee before acceptance']
    ],
    note:'MoRTH Fifth Revision (2013), Clause 2809, pp.775–776. No specific product is endorsed.'
  }];
  patented.calc='No material quantity, application method or product acceptance calculator.';

  // Clauses 2810–2815 are SOURCE-CONTROLLED documentary / payment references.
  // Never treat these summaries as authorisation of lifting, dismantling or stressing.
  const remaining = [
    {
      read:'2810 · MoRTH Fifth Revision 2013, printed p.776. Approval, bearing-fit and specialist lift-plan oversight only. PARTIAL.',
      quick:[
        '2810.1 — Bearing replacement requires approved repair plans or Engineer direction.',
        '2810.2 — Obtain designer-approved temporary-works and lift documentation; qualified supervision and recorded monitoring are required.',
        '2810.3 — Retain bearing identity, documented fit/space verification and worksite communication/safety plan.',
        'HOLD — No jacking controls, lifting method, capacity appraisal or automatic work clearance.'
      ],
      tables:[{name:'2810 · Bearing Replacement Document Check',status:'checked',
        headers:['Source','JE record','Hold / authority'],
        rows:[
          ['2810.1','Bearing defect inventory, approved repair drawings and Engineer instructions','Structural designer/Engineer'],
          ['2810.2','Approved specialist method, temporary support assessment and lift-monitoring records','No in-app lifting procedure'],
          ['2810.3','Bearing compatibility, communication plan and post-work inspection','Engineer sign-off']
        ],
        note:'MoRTH Fifth Revision, p.776; review only, not a lifting/temporary-works procedure.'
      }],
      calc:'No jack sizing, lifting-force or bearing-design calculator.'
    },
    {
      read:'2811 · MoRTH Fifth Revision 2013, printed pp.776–777. Wearing-coat repair, overlay certification and work-safety records. PARTIAL.',
      quick:[
        '2811.1 — Wearing-coat repair refers to MoRTH Section 3000.',
        '2811.2 — Do not approve an added bridge-deck overlay without Engineer certification of structural adequacy for additional load.',
        '2811.2 — Record existing coat condition, Engineer-approved deck/expansion-joint scope and Section 2700 replacement reference.',
        '2811.3 — Verify public/workforce safety and approved weather/traffic restrictions.',
        'HOLD — No dismantling, work-at-height, traffic closure or demolition method is authorised.'
      ],
      tables:[{name:'2811 · Wearing Coat Approval Register',status:'checked',
        headers:['Source','Evidence','Approval control'],
        rows:[
          ['2811.1','Repair item and Section 3000 specification link','Contract'],
          ['2811.2','Bridge loading assessment and overlay certification where applicable','Engineer/designer'],
          ['2811.2','Existing condition, joint/deck protection and new Section 2700 work approval','Engineer'],
          ['2811.3','Traffic and worker safety risk record','Approved site plan']
        ],
        note:'MoRTH Fifth Revision pp.776–777; high-level documentary controls only.'
      }],
      calc:'No bridge overlay adequacy assessment or dismantling calculations.'
    },
    {
      read:'2812 · MoRTH Fifth Revision 2013, printed pp.777–778. Material traceability and design-led structural monitoring only. PARTIAL.',
      quick:[
        '2812.1 — Check strand/wire, sheathing, anchorage-system traceability and referenced Section 1000 and IS:4984 source documents.',
        '2812.2 — Retain Engineer-approved stressing design and Section 1800 conformity records; specialist execution is outside this reader.',
        '2812.3 — Keep girder-deflection monitoring and distress/exception reports under structural designer review.',
        'HOLD — No cable design, stressing-force, jacking, anchorage-installation or grouting operating instructions.'
      ],
      tables:[{name:'2812 · External Prestressing Documentation',status:'checked',
        headers:['Source','QC record','Authority'],
        rows:[
          ['2812.1','Material/anchorage certificates and approved cable-system documents','Specialist and Engineer'],
          ['2812.2','Approved drawings, method, Section 1800 conformity and inspection plan','Structural designer'],
          ['2812.3','Girder-response and deflection-monitoring reports','Engineer reviews anomalies']
        ],
        note:'MoRTH Fifth Revision pp.777–778; not a prestressing method or structural certificate.'
      }],
      calc:'No prestress, elongation, cable profile or structural-capacity calculator.'
    },
    {
      read:'2813 · MoRTH Fifth Revision 2013, printed p.778. General materials and work acceptance governance checked.',
      quick:[
        '2813 — Materials are tested against the applicable MoRTH specifications and relevant prescribed criteria.',
        '2813 — Completed repairs must meet applicable specified workmanship and acceptance provisions.',
        'Retain authorised test results and Engineer disposition; this general clause does not supply universal test frequency or extra thresholds.'
      ],
      tables:[{name:'2813 · Acceptance Evidence Chain',status:'checked',
        headers:['Stage','Evidence','Sign-off'],
        rows:[
          ['Material','Lot/product identity and specification-linked tests','Engineer'],
          ['Work','Approved workmanship/QC reports','Engineer'],
          ['Nonconformity','Failure evidence and corrective-action disposition','Written decision']
        ],
        note:'MoRTH Fifth Revision p.778; no newly invented acceptance numbers or frequencies.'
      }],
      calc:'No automated acceptance or material-pass/fail calculation.'
    },
    {
      read:'2814 · MoRTH Fifth Revision 2013, printed p.779. Section 2800 measurement units checked for payment documentation.',
      quick:[
        '2814 — Epoxy and cement grout are measured by consumed mass in kg; separately payable nipples by number.',
        '2814 — Mortar/coating, old-new interface bonding and shotcreting are measured by treatment area in m².',
        '2814 — Bearing replacement/rectification is measured by assembly count and removed wearing coat by m².',
        '2814 — External prestressing is measured using H.T. strand/wire mass between anchorages. The printed word is "tones"; confirm the contract unit before billing.',
        'HOLD — No SSR values or payment certification. Contract BOQ and measurement book govern.'
      ],
      tables:[{name:'2814 · Source Measurement Units',status:'checked',
        headers:['Repair work','Unit','Document evidence'],
        rows:[
          ['Epoxy / cement grouting','kg','Approved consumption'],
          ['Grouting nipples where separately payable','number','Count'],
          ['Epoxy mortar or protective coating','m²','Treated area'],
          ['Bonding new concrete to old','m²','Interface area'],
          ['Guniting / shotcreting','m²','Applied area'],
          ['Bearing replacement or rectification','number','Bearing assemblies'],
          ['Dismantling wearing coat','m²','Removed surface'],
          ['External prestressing','Printed "tones" · unit verification HOLD','Strand/wire between anchorages']
        ],
        note:'MoRTH Fifth Revision p.779; verify ambiguous mass-unit spelling against contract before booking quantities.'
      }],
      calc:'No SSR pricing, payment approval or automatic MB certification.'
    },
    {
      read:'2815 · MoRTH Fifth Revision 2013, printed pp.779–780. Rate-inclusion principles source-checked; no monetary prices.',
      quick:[
        '2815 — Contract rates account for applicable materials, labour, equipment, placing, testing and incidental contractual work.',
        '2815 — Preparation, curing, traffic/safety arrangements, specialist temporary works and monitoring may be included as stated for the relevant repair category.',
        'Rate-inclusion checks must follow the sanctioned BOQ; avoid automatically adding costs that are already included.',
        'HOLD — No current Maharashtra SSR rupee rate, GST, lead, royalty or escalation is supplied in this clause.'
      ],
      tables:[{name:'2815 · Unit-Rate Inclusion Review',status:'checked',
        headers:['Work family','Review included obligations','Commercial check'],
        rows:[
          ['Grouting / mortar / coating','Material, labour, plant, test and specified preparation','BOQ item governs'],
          ['Shotcreting','Preparation, testing and curing','Avoid duplication'],
          ['Bearing work','Connection and specialist associated obligations','Approved estimate/contract'],
          ['Wearing coat dismantling','Traffic safety and specified joint removal','Engineer-defined scope'],
          ['External prestressing','Temporary works, testing and girder monitoring','Approved rates only']
        ],
        note:'MoRTH Fifth Revision pp.779–780. A specification scope rule is not an SSR rate schedule.'
      }],
      calc:'No rupee rate, contract amount or automatic payment authorisation.'
    }
  ];
  remaining.forEach((data,i) => Object.assign(list[9+i], data));
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
      'Wearing Coat/Appurtenances 2701–2709, Repair of Structures 2801–2802 and selected Clauses 2803–2815 have source-checked documentary/QC/payment references');
  }
  const requested=new URLSearchParams(location.search).get('clause');
  if(list.some(r=>r.clause===requested)) selected=RECORDS.findIndex(r=>r.section==='2800' && r.clause===requested);
  renderTree();
})();
