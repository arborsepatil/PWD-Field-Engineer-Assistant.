/* MoRTH 2013 Fifth Revision, Section 2900, printed pp.783–786.
   Selected source-backed documentary/QC/payment reference only.
   No excavation, rigging or opening-to-traffic operating instructions. */
(() => {
  if(typeof RECORDS==='undefined'||typeof renderTree!=='function')return;
  if(RECORDS.some(r=>r.section==='2900'))return;
  const incoming=[
  {
    "id": 2500,
    "section": "2900",
    "clause": "2901",
    "title": "Scope",
    "page": "Printed p.783 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2901, printed p.783: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "Confirm approved pipe type, diameter, length and culvert location against drawings or written Engineer direction.",
      "Retain drawing revision and culvert identity for traceability."
    ],
    "tables": [
      {
        "name": "2901 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Design scope",
            "Approved RCC pipe details, dimensions and chainage",
            "Engineer-approved drawing"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2501,
    "section": "2900",
    "clause": "2902",
    "title": "Materials",
    "page": "Printed p.783 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2902, printed p.783: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "Materials refer to MoRTH Section 1000.",
      "Each pipe consignment needs Engineer inspection, testing if necessary, and approval before incorporation; record manufacturer and lot identity."
    ],
    "tables": [
      {
        "name": "2902 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Incoming pipe consignment",
            "Identity, condition, manufacturer, lot and receipt",
            "Engineer approval"
          ],
          [
            "Materials/tests",
            "Section 1000-linked conformity and authorised test reports",
            "No invented sampling frequency"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2502,
    "section": "2900",
    "clause": "2903",
    "title": "Excavation for Pipe",
    "page": "Printed p.783 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2903, printed p.783: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "Document approved alignment, founding levels and excavation-survey measurements.",
      "Record unsuitable strata and any written Engineer direction for foundation treatment.",
      "Check site-specific trench safety and water-management approvals; no excavation operating instructions."
    ],
    "tables": [
      {
        "name": "2903 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Survey and foundation",
            "Chainage, founding grade and observed soil strata",
            "Engineer verifies approved plan"
          ],
          [
            "Variations",
            "Written decisions on unstable soil or rock and corrective treatment",
            "No app-directed excavation method"
          ],
          [
            "Safety",
            "Qualified contractor excavation/temporary works risk plan",
            "Competent supervision"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2503,
    "section": "2900",
    "clause": "2904",
    "title": "Bedding for Pipe",
    "page": "Printed p.784 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2904, printed p.784: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "Check bedding type selected on the approved drawings: first-class granular or concrete cradle.",
      "For first-class bedding, the source sets a compacted thickness minimum of 75 mm; record evidence.",
      "Concrete cradle where specified is not leaner than M15; see MoRTH Section 1700."
    ],
    "tables": [
      {
        "name": "2904 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Bedding type",
            "Drawings, base/support inspection and levels",
            "Engineer sign-off"
          ],
          [
            "Granular bedding",
            "Approved grading/support/thickness records; source minimum 75 mm",
            "Contract-specific acceptance"
          ],
          [
            "Concrete cradle",
            "Approved dimensions, concrete grade and related Section 1700 QC",
            "Engineer/designer"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2504,
    "section": "2900",
    "clause": "2905",
    "title": "Laying of Pipe",
    "page": "Printed p.784 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2905, printed p.784: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "The source requires Engineer approval of the foundation before pipe laying.",
      "Verify accepted pipe condition and recorded line, levels and continuous invert; defective/damaged units must be recorded for rejection.",
      "Obtain specialist pipe-handling/lifting plan approval; no lifting or lowering operating directions."
    ],
    "tables": [
      {
        "name": "2905 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Pre-placement",
            "Foundation and bedding Engineer inspection",
            "Hold before placement"
          ],
          [
            "Pipe identity and position",
            "Condition, serial/lot, level and invert evidence",
            "Site QC"
          ],
          [
            "Handling",
            "Approved specialist lifting plan and damage records",
            "No rigging instructions"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2505,
    "section": "2900",
    "clause": "2906",
    "title": "Jointing",
    "page": "Printed p.785 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2906, printed p.785: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "Document the Engineer-approved joint type and pipe/joint compatibility; source covers collar and flush joints.",
      "Inspect finished alignment/internal surface and trace corrections to identified joints.",
      "The source specifies keeping finished joints covered and damp for at least four days; document protection evidence."
    ],
    "tables": [
      {
        "name": "2906 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Joint type",
            "Approved system and materials",
            "Contract/design"
          ],
          [
            "Completion",
            "Joint-by-joint inspection, photographs and rectification",
            "Engineer"
          ],
          [
            "Protection",
            "Damp cover records against source minimum four days",
            "No joint-making procedure"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2506,
    "section": "2900",
    "clause": "2907",
    "title": "Backfilling",
    "page": "Printed p.785 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2907, printed p.785: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "Obtain backfill material approval and confirmation jointing material has hardened before dependent work.",
      "Retain pipe protection and contract-specific density/compaction test reports; no automatic pass/fail.",
      "Any trench work must follow qualified supervision and a site-specific safety plan."
    ],
    "tables": [
      {
        "name": "2907 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Material and timing",
            "Backfill source approval and joint readiness",
            "Engineer"
          ],
          [
            "Quality",
            "Approved support/haunch and fill inspection, density test records",
            "Contract acceptance criteria"
          ],
          [
            "Safety",
            "Site risk and structural protection plan",
            "No operating method"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2507,
    "section": "2900",
    "clause": "2908",
    "title": "Headwalls and Other Ancillary Works",
    "page": "Printed p.786 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2908, printed p.786: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "Check sanctioned drawings and Engineer direction for headwalls, wingwalls and aprons.",
      "Verify cross-references to MoRTH Sections 1300, 1400, 1700 and 2500 as applicable.",
      "Reconcile ancillary measurement with the complete-culvert contract item to prevent duplicate billing."
    ],
    "tables": [
      {
        "name": "2908 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Structures",
            "Approved design, materials and inspection records",
            "Engineer"
          ],
          [
            "Aprons",
            "Section 2500 compliance evidence",
            "Contract"
          ],
          [
            "BOQ reconciliation",
            "Included ancillary scope and variations",
            "Payment authority"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2508,
    "section": "2900",
    "clause": "2909",
    "title": "Opening to Traffic",
    "page": "Printed p.786 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2909, printed p.786: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "The printed source prohibits traffic crossing pipes unless fill above the pipe crown is at least 600 mm.",
      "This is only one criterion: traffic permission requires Engineer-reviewed structural and safety approvals.",
      "Record surveyed cover, completion reports and written opening decision; no automatic release."
    ],
    "tables": [
      {
        "name": "2909 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Source hold",
            "Printed minimum 600 mm cover above pipe top",
            "Survey evidence; not sole clearance"
          ],
          [
            "Traffic release",
            "Engineer authorisation, safety and completion record",
            "No app-issued traffic permission"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2509,
    "section": "2900",
    "clause": "2910",
    "title": "Measurements for Payment",
    "page": "Printed p.786 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2910, printed p.786: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "Complete RCC pipe culverts are measured in linear metres between inlet and outlet ends.",
      "For multiple rows of pipe, the source measures the culvert as one unit regardless of row count.",
      "Retain authorised MB/BOQ records and approved variations; do not multiply quantity by pipe rows."
    ],
    "tables": [
      {
        "name": "2910 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Payment unit",
            "Linear metres from inlet to outlet",
            "Approved survey and MB"
          ],
          [
            "Multiple rows",
            "One unit of culvert length, no row multiplier",
            "Prevent double count"
          ],
          [
            "Contract",
            "Sanctioned BOQ and variations",
            "Engineer certification"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  },
  {
    "id": 2510,
    "section": "2900",
    "clause": "2911",
    "title": "Rate",
    "page": "Printed p.786 · PDF viewer page mapping pending",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 2911, printed p.786: selected documentation and QC reference source-checked. Detailed execution is outside this reader; approved drawings, the contract and Engineer direction govern.",
    "quick": [
      "Contract rate includes pipe supply, loading, transport/handling, laying and jointing, excavation, bedding, backfilling, concrete, masonry, aprons and incidentals.",
      "This is a contract inclusion reference, not a Maharashtra SSR rupee-price schedule.",
      "Review potential duplication before separately adding included ancillary works."
    ],
    "tables": [
      {
        "name": "2911 · Pipe Culvert Record Checklist",
        "status": "checked",
        "headers": [
          "Check",
          "Evidence / site record",
          "Approval authority"
        ],
        "rows": [
          [
            "Contract inclusion",
            "Pipe supply/handling, bedding, excavation, backfill and ancillaries",
            "Original contract item"
          ],
          [
            "Estimate QC",
            "Check excavation/headwall/apron duplication",
            "No price invented"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 2900. This checklist is documentary guidance, not engineering approval or a construction method."
      }
    ],
    "calc": "No automatic structural acceptance, excavation, lifting, site-traffic permission or certified payment. Refer to approved drawings, source specification and Engineer."
  }
];
  RECORDS.push(...incoming);
  const filter=document.getElementById('sectionFilter');
  if(filter&&!filter.querySelector('option[value="2900"]')){
    const option=document.createElement('option');
    option.value='2900'; option.textContent='Section 2900';
    filter.appendChild(option);
  }
  const requested=new URLSearchParams(location.search).get('clause');
  if(incoming.some(r=>r.clause===requested)){
    selected=RECORDS.findIndex(r=>r.section==='2900'&&r.clause===requested);
  }
  renderTree();
})();
