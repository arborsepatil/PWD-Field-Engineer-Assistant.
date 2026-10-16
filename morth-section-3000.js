/* MoRTH Section 3000 — Maintenance of Road. Fifth Revision (2013), pp.789–798.
   Selected 3001–3003 are source-checked documentary references; 3004–3005 index-only.
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
    "page": "Printed p.791 · PDF viewer page mapping QA pending",
    "status": "index",
    "read": "Contents-index reference only. Detailed Clause 3004 subclauses not source-checked for the reader in this increment. Consult original MoRTH Fifth Revision (2013), printed pp.791–797 and the controlling contract.",
    "quick": [],
    "tables": [],
    "calc": "No source-verified calculator is available for Clause 3004."
  },
  {
    "id": 2604,
    "section": "3000",
    "clause": "3005",
    "title": "Maintenance of Cement Concrete Road",
    "page": "Printed p.797 · PDF viewer page mapping QA pending",
    "status": "index",
    "read": "Contents-index reference only. Detailed Clause 3005 subclauses not source-checked for the reader in this increment. Consult MoRTH Fifth Revision (2013), printed pp.797–798 and the controlling contract.",
    "quick": [],
    "tables": [],
    "calc": "No source-verified calculator is available for Clause 3005."
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
