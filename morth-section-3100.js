/* MoRTH Section 3100 Reinforced Soil · Fifth Revision 2013 printed pp.801–812.
   Selected documentary QC and payment references for 3101–3110 only.
   No reinforced-soil design, excavation, equipment or installation procedure. */
(() => {
  if(typeof RECORDS==='undefined'||typeof renderTree!=='function')return;
  if(RECORDS.some(r=>r.section==='3100'))return;
  const incoming=[
  {
    "id": 2700,
    "section": "3100",
    "clause": "3101",
    "title": "Scope",
    "page": "Printed p.801 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3101, printed p.801. Reinforced soil structure scope; design-led work package and any required ground improvement. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "Verify approved wall/abutment/slope category, location and design drawings before recording work.",
      "Retain foundation, ground-improvement and reinforcement/facing system approvals.",
      "HOLD — Design stability and allowable geometry are not determined from this checklist."
    ],
    "tables": [
      {
        "name": "3101 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "System identity",
            "Approved drawings, design basis and structure location",
            "Structural designer/Engineer"
          ],
          [
            "Ground improvement",
            "Approved geotechnical investigations and proposed treatment",
            "Designer/Engineer"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  },
  {
    "id": 2701,
    "section": "3100",
    "clause": "3102",
    "title": "Design",
    "page": "Printed p.801 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3102, printed p.801. Section 3100 design refers to its Annexure A1 and relevant contracted design standards. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "Obtain stamped design/drawings with foundation assessment, internal/external/global stability and connection evidence.",
      "Check the applicable design edition/contract and source Annexure references before work.",
      "HOLD — No load, reinforcement length, bearing, seismic or factor-of-safety calculator."
    ],
    "tables": [
      {
        "name": "3102 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "Design dossier",
            "Engineer-approved drawings, calculations, design standard/version",
            "Designer"
          ],
          [
            "Changes",
            "Design revision and site condition discrepancy disposition",
            "Engineer"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  },
  {
    "id": 2702,
    "section": "3100",
    "clause": "3103",
    "title": "Reinforcing Element",
    "page": "Printed p.801 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3103, printed p.801. Metallic and geosynthetic reinforcement product governance, certification and lot/roll traceability. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "Record approved reinforcement system: metal strips/grids or geosynthetics, and the design-specified material/grade.",
      "3103.7.2 — Review manufacturer certification and independent test documentation for long-term reduction factors, strength, pull-out/interface data as applicable.",
      "Check each geosynthetic roll has product and roll identification; retain relevant lot tensile certificates and project-specific testing records.",
      "HOLD — No reinforcement strength, anchorage, pull-out or durability design is made by this app."
    ],
    "tables": [
      {
        "name": "3103 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "Reinforcement type",
            "Approved product/system and grade matched to drawings",
            "Engineer"
          ],
          [
            "Product tests",
            "Accredited/manufacturer laboratory certificates, product and lot IDs",
            "Approval before use"
          ],
          [
            "Project tests",
            "Applicable site/project specific tensile and interaction test reports",
            "Source 3103.7.2; Engineer decision"
          ],
          [
            "Metal durability",
            "Galvanizing/connector certification and compatibility evidence where specified",
            "Design and applicable standard"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  },
  {
    "id": 2703,
    "section": "3100",
    "clause": "3104",
    "title": "Earth Fill",
    "page": "Printed p.804 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3104, printed p.804. Approved reinforced and retained fill properties, chemical compatibility and geotechnical QC. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "3104 — Record approved source, gradation, plasticity and drained shear test reports. The general reinforced-fill source criterion is friction angle at least 30°.",
      "For metallic or polymer reinforcement, source-specific soil electrochemical compatibility tests and product restrictions must be checked.",
      "Match construction-phase reinforced, retained and founding-soil test evidence to the design assumptions.",
      "SOURCE DISTINCTION — Clause 3107.2 separately specifies slope-fill friction angle not less than 28°; do not apply one condition universally."
    ],
    "tables": [
      {
        "name": "3104 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "General reinforced fill",
            "Gradation/PI and drained shear testing; source φ ≥30°",
            "Engineer checks design and source"
          ],
          [
            "Durability compatibility",
            "Relevant resistivity/pH/chloride/sulphate evidence by reinforcement type",
            "Table 3100.1 / Clause 3104.1"
          ],
          [
            "Source changes",
            "New fill source and material test/approval record",
            "Engineer hold"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  },
  {
    "id": 2704,
    "section": "3100",
    "clause": "3105",
    "title": "Facia Material",
    "page": "Printed p.805 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3105, printed p.805. Wall/slope facing product identity, structural/flexible system compatibility and connection tests. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "Verify designer-selected facing type: precast panel, segmental block, gabion, wrap-around, metal or approved proprietary system.",
      "3105.1.1 — Precast RCC facing panels are specified with minimum M35 concrete and minimum 180 mm thickness, subject to approved design.",
      "3105.1.2 — Modular concrete blocks have minimum M35 concrete; check dimensional and test evidence.",
      "3105.3 — Record facing-to-reinforcement connection conformity against long-term design forces; no in-app connection approval."
    ],
    "tables": [
      {
        "name": "3105 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "Facing system",
            "Approved geometry, supplier, product and drawings",
            "Engineer/designer"
          ],
          [
            "Panel/block QC",
            "Concrete certificates, panel/block dimensions and identifiable lot",
            "Source 3105.1"
          ],
          [
            "Connections",
            "System test data and inspected connection identity",
            "Approved design / test reports"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  },
  {
    "id": 2705,
    "section": "3100",
    "clause": "3106",
    "title": "Construction Details",
    "page": "Printed p.807 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3106, printed p.807. Foundations, reinforced fill, drainage, panels and face tolerances: documented inspection checks. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "Obtain Engineer sign-off for foundation/leveling pad, drainage/filter material and reinforcement arrangement against approved drawings.",
      "3106.5 — The printed source has maximum 200 mm compacted fill layers and 97% laboratory MDD under IS:2720 (Part 8); review layer-linked test reports.",
      "3106.6 — Check facing dimensional/alignment tolerances against the source tables and approved design, not a generic visual judgment.",
      "HOLD — This reader does not specify plant movement, excavation, temporary works or compaction-equipment operation."
    ],
    "tables": [
      {
        "name": "3106 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "Founding and drainage",
            "Foundation approval, drainage/filter conformity and layout",
            "Designer/Engineer"
          ],
          [
            "Layer fill QC",
            "Layer ID, thickness/field-density records and MDD test identity",
            "Source 3106.5; Engineer acceptance"
          ],
          [
            "Facing inspection",
            "Survey/alignment, joint and dimensional tolerance record",
            "Source 3106.6"
          ],
          [
            "Deviations",
            "Nonconformance, photos, designer disposition",
            "Hold dependent work"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  },
  {
    "id": 2706,
    "section": "3100",
    "clause": "3107",
    "title": "Reinforced Soil Slopes",
    "page": "Printed p.810 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3107, printed p.810. Slope reinforcement, approved facing systems, fill and connections. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "3107 — Applies to reinforced soil slopes with face angles flatter than 70° in the printed source.",
      "3107.1–3107.5 — Check reinforcement certificates, designer-approved facing, connections and reinforcement/soil compatibility.",
      "3107.2 — Slope reinforced fill refers to Clause 3104 but uses a specified minimum friction angle of 28°; confirm design suitability.",
      "3107.6 — Collect the applicable 3106.5 reinforcement/fill QC records and independent inspection approvals."
    ],
    "tables": [
      {
        "name": "3107 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "Slope category",
            "Approved geometry and certified design category",
            "Structural/geotechnical designer"
          ],
          [
            "Materials",
            "Reinforcement, facing, fill and connection traceability",
            "Clauses 3103–3105 and 3107"
          ],
          [
            "Fill testing",
            "Drained shear records and design-matched soil QC",
            "Source slope φ ≥28°"
          ],
          [
            "Completion",
            "Face geometry, protection and drainage conformity record",
            "Engineer"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  },
  {
    "id": 2707,
    "section": "3100",
    "clause": "3108",
    "title": "System Responsibility, Performance Bond",
    "page": "Printed p.811 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3108, printed p.811. Conditional supplier performance-bond record, depending on the contract. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "3108.1 — The system supplier provides a performance bond if the contract specifies one.",
      "Where required, the original source specifies a performance bond valid for at least 20 years; verify actual signed contractual obligations.",
      "HOLD — Do not infer a universal performance bond for jobs where the contract does not require it."
    ],
    "tables": [
      {
        "name": "3108 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "Contract applicability",
            "Relevant clause and executed security instrument",
            "Contract administrator"
          ],
          [
            "Conditional period",
            "Bond duration/validity and supplier responsibility",
            "Printed source ≥20 years when specified"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  },
  {
    "id": 2708,
    "section": "3100",
    "clause": "3109",
    "title": "Measurement for Payment",
    "page": "Printed p.812 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3109, printed p.812. Section 3100 finished-face measurements and separately measured ancillary elements. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "3109.1 — Reinforced soil wall is measured in m² of finished face in the approved final inclination plane.",
      "3109.2 — Reinforced soil slope is measured in m² of each finished face in its approved final inclined plane.",
      "3109.1 — Friction slab and crash barrier are measured in linear metres as separately specified.",
      "HOLD — Approved drawings, face dimensions, sanctioned BOQ and signed MB control the actual quantity; no automatic bill approval."
    ],
    "tables": [
      {
        "name": "3109 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "Reinforced soil wall",
            "m² per finished face at specified inclination",
            "Approved drawing/survey/MB"
          ],
          [
            "Reinforced soil slope",
            "m² per finished face at specified inclination",
            "Approved drawing/survey/MB"
          ],
          [
            "Friction slab / crash barrier",
            "Linear metres",
            "Separate relevant BOQ/MB items"
          ],
          [
            "Variations",
            "Recorded approved layout revisions",
            "Engineer certification"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  },
  {
    "id": 2709,
    "section": "3100",
    "clause": "3110",
    "title": "Rates",
    "page": "Printed p.812 · PDF viewer page mapping QA pending",
    "status": "partial",
    "read": "Source-checked selected documentary/QA and payment requirements: MoRTH Fifth Revision (2013), Clause 3110, printed p.812. Contractual inclusions and separate friction-slab/crash-barrier payment. The governing contract, approved design and Engineer's written decision control.",
    "quick": [
      "3110 — Check rate inclusions for materials, labour, plant, royalties, handling, transport, fill, reinforcement, facing, temporary works, design, drawings and tests.",
      "3100 rate statement also includes the specified investigations and ground improvement measures; avoid duplicate bills under the same priced scope.",
      "3110 — Friction slab and crash barrier are paid separately according to the sanctioned contract.",
      "HOLD — No Maharashtra SSR rupee rates, GST, royalty computation or new BOQ price is derived from this clause."
    ],
    "tables": [
      {
        "name": "3110 · Reinforced Soil — JE Field Record",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Documentary QC / payment evidence",
          "Review authority"
        ],
        "rows": [
          [
            "Rate inclusion review",
            "Contract wording for material/supplier/design/investigation/ground improvement",
            "Sanctioned BOQ"
          ],
          [
            "Separately measured work",
            "Friction slab and crash barrier lengths",
            "Separate contract pay items"
          ],
          [
            "Variations",
            "Variation approval before booking extra work",
            "Engineer / competent authority"
          ]
        ],
        "note": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Section 3100. Check contract amendments and approved structural design before acceptance. Documentary field reference only."
      }
    ],
    "calc": "No independent structural, geotechnical, installation, test-acceptance or rate calculation. Refer to approved design and Engineer."
  }
];
  RECORDS.push(...incoming);
  const filter=document.getElementById('sectionFilter');
  if(filter && !filter.querySelector('option[value="3100"]')) {
    const option=document.createElement('option');
    option.value='3100'; option.textContent='Section 3100';
    filter.appendChild(option);
  }
  const requested=new URLSearchParams(location.search).get('clause');
  if(incoming.some(r=>r.clause===requested)) selected=RECORDS.findIndex(r=>r.section==='3100'&&r.clause===requested);
  renderTree();
})();
