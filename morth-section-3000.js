/* MoRTH Section 3000 — Maintenance of Road. Fifth Revision (2013), pp.789–798.
   Selected 3001–3005 source-checked documentary references. Specialist road-work operations excluded.
   This module does not give excavation, roller operation, hazardous material use, or traffic permission. */
(() => {
  if(typeof RECORDS==='undefined'||typeof renderTree!=='function')return;
  if(RECORDS.some(r=>r.section==='3000'))return;
  const incoming=[
  {
    "id": 2600,
    "section": "3000",
    "clause": "3001",
    "title": "General",
    "page": "Printed p.789 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked: MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3000, Clause 3001, printed p.789. General authority and conformity controls only.",
    "quick": [
      "3001 — Match each road-maintenance activity to the sanctioned contract or Engineer instruction, including location and scope.",
      "3001 — Verify specified lines, levels and grades, suitable approved materials and applicable item specifications.",
      "3001 — If the specification does not cover an item, obtain a documented engineering decision; this reader does not create a new acceptance rule."
    ],
    "tables": [
      {
        "name": "3001 · Road Maintenance QC and Records",
        "status": "checked",
        "headers": [
          "Source / checkpoint",
          "Record to check",
          "Authority / limitation"
        ],
        "rows": [
          [
            "Scope/authority",
            "Contract item, site instruction, chainage and approved drawings",
            "Engineer or written sanction"
          ],
          [
            "Geometry and material",
            "Level, alignment, material approval and project specification references",
            "Field QC inspection records"
          ],
          [
            "Unspecified situation",
            "Technical assessment and approved written decision",
            "No improvised standard from app"
          ]
        ],
        "note": "Governance references from Clause 3001; recording prompts are site-QC guidance, not a separate MoRTH test procedure."
      }
    ],
    "calc": "No independent maintenance method, acceptance certification or SSR rate is derived from this general clause."
  },
  {
    "id": 2601,
    "section": "3000",
    "clause": "3002",
    "title": "Restoration of Rain Cuts",
    "page": "Printed p.789 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked: MoRTH Fifth Revision (2013), Clause 3002.1–3002.5, printed pp.789–790. Material/QC inspection and commercial units only; no earthwork operating guide.",
    "quick": [
      "3002.1–3002.2 — Verify the identified rain-cut repair limits and traceable soil compliance with Clause 305.2.",
      "3002.3 — Retain approved surveyed line, grade, slope and compaction/field-density records; documentary comparison to relevant project criteria is required.",
      "3002.4 — The published measurement for rain-cut restoration is cubic metres (m³), verified against sanctioned quantities and MB.",
      "3002.5 — Rate description covers specified labour, machinery, soil supply/transport, preparation and compaction obligations; do not automatically add overlapping charges.",
      "HOLD — The original clause includes construction geometry and equipment. This app intentionally provides no excavation, benching, compaction-operation or traffic-work instructions."
    ],
    "tables": [
      {
        "name": "3002 · Road Maintenance QC and Records",
        "status": "checked",
        "headers": [
          "Source / checkpoint",
          "Record to check",
          "Authority / limitation"
        ],
        "rows": [
          [
            "Defect mapping",
            "Chainage, affected shoulder/embankment extent, before-work photographs and cause review",
            "Engineer-approved limits and repair plan"
          ],
          [
            "Soil material · 3002.2",
            "Supplier/borrow source and Clause 305.2 traceability",
            "Material approval"
          ],
          [
            "Quality · 3002.3",
            "Surveyed finish levels, slopes and approved material/compaction test evidence",
            "Compare with applicable contract and Engineer acceptance"
          ],
          [
            "MB · 3002.4",
            "Authorised volume in m³, location/measurement basis",
            "Do not auto-certify"
          ],
          [
            "Rate · 3002.5",
            "Check source-covered equipment, material, leads/lifts, preparation and compaction items",
            "Prevent unsupported double counting"
          ]
        ],
        "note": "MoRTH Fifth Revision (2013), pp.789–790. Recording prompts do not supply an excavation method or new test frequency."
      }
    ],
    "calc": "Source payment unit is m³; no field operation, quantity-from-damage-photo or sanctioned-rate calculator."
  },
  {
    "id": 2602,
    "section": "3000",
    "clause": "3003",
    "title": "Maintenance of Earthen Shoulder",
    "page": "Printed p.790 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked: MoRTH Fifth Revision (2013), Clause 3003.1–3003.5, printed pp.790–791. Material, laboratory evidence, finished-geometry and measurement records; not an execution method.",
    "quick": [
      "3003.1–3003.2 — Record approved shoulder extent, existing crossfall/grade deficiencies and select soil conformity with Clause 305.",
      "3003.3 — Check site density results against the published minimum of 97% of laboratory maximum dry density, with IS 2720 Part 8 referenced for the laboratory MDD. Engineer confirms test applicability and compliance.",
      "3003.3 — Verify finished surface crossfall, line and levels against drawings or Engineer instructions; retain signed survey and test evidence.",
      "3003.4 — The source measures maintenance of earthen shoulder in square metres (m²), not cubic metres.",
      "3003.5 — Contract unit-rate inclusions cover applicable filling/stripping, material, transport, compaction, labour, equipment and incidentals. Check approved BOQ before separating charges.",
      "HOLD — No shoulder-stripping, roller settings, compaction-method instructions or automatic traffic clearance are provided."
    ],
    "tables": [
      {
        "name": "3003 · Road Maintenance QC and Records",
        "status": "checked",
        "headers": [
          "Source / checkpoint",
          "Record to check",
          "Authority / limitation"
        ],
        "rows": [
          [
            "Survey / damage",
            "Deficiency or surplus, chainage, crossfall, line/level and approved limits",
            "Engineer inspection"
          ],
          [
            "Material · 3003.2",
            "Select-soil identity and Clause 305 compliance evidence",
            "Engineer-approved source"
          ],
          [
            "Density · 3003.3",
            "Lab MDD reference (IS 2720 Part 8), field dry density report and location",
            "Printed ≥97% criterion, subject to governing contract and signed Engineer decision"
          ],
          [
            "Finish · 3003.3",
            "Final crossfall, levels and shoulder continuity survey",
            "Approved drawings"
          ],
          [
            "Payment · 3003.4",
            "Maintained shoulder area in m² with authorised MB",
            "No automatic certification"
          ],
          [
            "Rates · 3003.5",
            "Check whether soil, disposal, compaction and incidentals are already included",
            "BOQ governs"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), pp.790–791. The 97% figure is a source-stated compaction requirement; not a blanket test frequency, completion certificate or authority to proceed."
      }
    ],
    "calc": "No density-based automatic release or compaction planning; source measurement unit is m²."
  },
  {
    "id": 2603,
    "section": "3000",
    "clause": "3004",
    "title": "Bituminous Maintenance and Repair",
    "page": "Printed pp.791–797 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected contractual, inspection, materials, treatment cross-references and payment requirements: MoRTH Fifth Revision (2013), Clause 3004.1–3004.7, printed pp.791–797. Documentary reference only. Approved specifications and the Engineer govern treatment choice and road-user safety.",
    "quick": [
      "3004.1 — Identify the Engineer-approved treatment and road chainage. The source covers pothole/patch repair, crack sealing, fog seal, dusting, slurry seal, surface dressing and special repairs; traffic control refers to Section 100.",
      "3004.2 — Check failed-area assessment and compatibility of approved replacement materials with the existing pavement; replacement materials must not be inferior to the original construction. Maintain approved material and inspection records.",
      "3004.2.5 — Pothole/patch repair is measured by area (m²) or weight (tonnes) under the applicable contract item; do not assume both measurements are payable.",
      "3004.3.2 — Fog seal references Clause 513, and its measurement is in m². Source discusses fine cracks narrower than 3 mm for treatment consideration, subject to Engineer direction.",
      "3004.3.3 — Crack filling measurement is m² where later patching is required, or linear metres for isolated cracks without subsequent patching. Retain location-linked records.",
      "3004.3.4–3004.7 — Dusting and slurry seal/surface dressing/special-treatment proposals refer to their respective source clauses and Engineer approval; retain technical justification and suitable material reports.",
      "SOURCE HOLD — Published treatment conditions are not a diagnosis or permission to use bituminous materials. No spraying, heating, cutting, compaction, traffic management or repair-application steps are provided."
    ],
    "tables": [
      {
        "name": "3004 · Bituminous Maintenance — Pre-Approval QC",
        "status": "checked",
        "headers": [
          "Source",
          "Evidence for JE review",
          "Approval boundary"
        ],
        "rows": [
          [
            "3004.1",
            "Work order/BOQ, chainage, distress/condition survey and traffic protection plan — Engineer decides appropriate treatment",
            null
          ],
          [
            "3004.2",
            "Cause/extent review, material compatibility, approved mix/plant and site inspection records — Apply controlling construction-material clauses",
            null
          ],
          [
            "3004.3.2",
            "Fog seal reference to 513; product/test and treatment-area evidence — Contract and Engineer; no application instruction",
            null
          ],
          [
            "3004.3.3",
            "Crack type and location, approved repair option and measured length/area — Engineer to confirm scope",
            null
          ],
          [
            "3004.4–3004.7",
            "Treatment approval, material and quality evidence for dusting, slurry seal, surface dressing or special repairs — Refer respectively to applicable source clauses",
            null
          ]
        ],
        "note": "MoRTH Fifth Revision (2013), pp.791–797. No independent frequency, unsafe operation guidance or automatic acceptance is created."
      },
      {
        "name": "3004 · Contract Measurement and Inclusion Records",
        "status": "checked",
        "headers": [
          "Source / work",
          "Source payment unit",
          "MB / BOQ checkpoint"
        ],
        "rows": [
          [
            "3004.2.5 · pothole / patch repair",
            "m² or tonnes",
            "Pay only per applicable sanctioned item and approved measurements"
          ],
          [
            "3004.3.2.4 · fog seal",
            "m²",
            "Record authorised treatment-area survey"
          ],
          [
            "3004.3.3.4 · crack filling",
            "m² if subsequent patching; otherwise linear metre for isolated cracks",
            "Distinguish two source situations, avoid duplicated item payment"
          ],
          [
            "3004.4.4 · dusting",
            "m²",
            "Engineer-approved area"
          ],
          [
            "3004.5 / 3004.6 · slurry seal / surface dressing",
            "Cross-references Clause 512 / 509",
            "Use contract-specific unit and rates; not inferred here"
          ],
          [
            "3004.2.6, 3004.3.2.5, 3004.3.3.5, 3004.4.5 · inclusions",
            "Contract rate covers relevant materials, work, labour, tools, equipment and incidentals",
            "Review exact BOQ before separate charges"
          ]
        ],
        "note": "This is a payment-documentation reference, not an MB certificate, SSR rate or authorisation of new pay items."
      }
    ],
    "calc": "No bitumen usage, treatment selection, material heating, equipment operation, cure time, traffic-opening or payment calculation."
  },
  {
    "id": 2604,
    "section": "3000",
    "clause": "3005",
    "title": "Maintenance of Cement Concrete Road",
    "page": "Printed pp.797–798 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected material, inspection, Engineer control and payment provisions of MoRTH Fifth Revision (2013), Clause 3005.1–3005.2, printed pp.797–798. PARTIAL: specialist repair procedures and traffic management remain outside the reader.",
    "quick": [
      "3005.1 — Check the approved scope and engineering assessment for spalled joint-groove repair in cement-concrete pavement, including material compatibility and traceable supplier documentation.",
      "3005.1.4 — Printed source describes a desirable traffic diversion period of 12 hours or as recommended by the manufacturer; this is not automatic reopening permission. Preserve approved traffic-management and Engineer release records.",
      "3005.1.5 — Spalled joint-groove repairs are measured in linear metres under the applicable BOQ.",
      "3005.2.1–3005.2.2 — Where joint sealant is replaced, verify compatible approved product documentation against Clause 602.2.10 and the repair plan.",
      "3005.2.4 — Joint sealant replacement is measured in linear metres; document joint identity, length and approved scope.",
      "3005.1.6 / 3005.2.5 — Check the full contract rate inclusions before creating separate payment items for preparation or incidental works.",
      "HOLD — No joint cutting/removal, hazardous sealant handling, heating, pouring, surface preparation, specialised tool operation or public-road reopening procedure is provided."
    ],
    "tables": [
      {
        "name": "3005 · Concrete Pavement Joint Repair QC",
        "status": "checked",
        "headers": [
          "Source",
          "Record to inspect",
          "Authority / hold"
        ],
        "rows": [
          [
            "3005.1.1–3005.1.2",
            "Condition survey, joint identity, repair scope and compatible epoxy system certificates",
            "Engineer-approved materials and repair drawings"
          ],
          [
            "3005.1.4",
            "Manufacturer cure/traffic recommendations and approved diversion or traffic-protection record",
            "Engineer controls release; no automatic clearance"
          ],
          [
            "3005.2.1–3005.2.2",
            "Sealant replacement scope, approved product and Clause 602.2.10 compliance",
            "Specialist product choice and Engineer approval"
          ],
          [
            "3005.1.5 / 3005.2.4",
            "Repair lengths in linear metres with joint identification, chainage, signed measurements",
            "Sanctioned BOQ/MB only"
          ],
          [
            "3005.1.6 / 3005.2.5",
            "Contract rate coverage of material, removal/preparation and incidental work",
            "Do not double-book included work"
          ]
        ],
        "note": "MoRTH Fifth Revision 2013 pp.797–798. This is a QC/document checklist, not a field repair or chemical handling instruction."
      },
      {
        "name": "3005 · Measurement Distinction",
        "status": "checked",
        "headers": [
          "Item",
          "Published unit",
          "Commercial control"
        ],
        "rows": [
          [
            "3005.1.5 · joint groove repair",
            "Linear metre",
            "Record approved actual repaired joint length"
          ],
          [
            "3005.2.4 · joint sealant replacement",
            "Linear metre",
            "Record approved replaced-sealant joint length"
          ],
          [
            "3005.1.6 / 3005.2.5 · rate inclusions",
            "No monetary rates stated",
            "Verify sanctioned SSR/BOQ and included preparation before paying"
          ]
        ],
        "note": "Never infer a rupee rate or a separate payable quantity from the generic specification alone."
      }
    ],
    "calc": "No sealant quantity, chemical application, joint-cutting, traffic-opening or automated acceptance calculator."
  }

];
  RECORDS.push(...incoming);
  const filter=document.getElementById('sectionFilter');
  if(filter&&!filter.querySelector('option[value="3000"]')){
    const option=document.createElement('option');option.value='3000';
    option.textContent='Section 3000';filter.appendChild(option);
  }
  const requested=new URLSearchParams(location.search).get('clause');
  if(incoming.some(r=>r.clause===requested)){
    selected=RECORDS.findIndex(r=>r.section==='3000'&&r.clause===requested);
  }
  renderTree();
})();
