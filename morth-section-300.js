/* Section 300: source-backed engineering documentation and payment entries;
 two specialist sections are index-only and carry no field-operation guidance. */
(() => {
 if(typeof RECORDS==='undefined'||typeof renderTree!=='function')return;
 if(RECORDS.some(r=>r.section==='300'))return;
 const incoming=[
  {
    "id": 8000,
    "section": "300",
    "clause": "301",
    "title": "Excavation for Roadway and Drains",
    "page": "Printed p.45 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 301, printed p.45. Roadway and drain excavation classification and alignment follow approved plans. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Roadway and drain excavation classification and alignment follow approved plans.",
      "Site documentation: Pre/post cross-sections, chainage, material classification and reuse/disposal records.",
      "QC evidence: Approved grades, crossfall, levels and material reports.",
      "Measurement: Roadway excavation in m³ by average-end-area method and material class, subject to contract.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "301 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Pre/post cross-sections, chainage, material classification and reuse/disposal records.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Approved grades, crossfall, levels and material reports.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Roadway excavation in m³ by average-end-area method and material class, subject to contract.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8001,
    "section": "300",
    "clause": "302",
    "title": "Specialist Rock Work — Clause 302",
    "page": "Printed p.53 · PDF mapping unverified",
    "status": "index",
    "read": "MoRTH Fifth Revision (2013), Clause 302, printed p.53. Specialist source section; no field procedures reproduced. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [],
    "tables": [],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8002,
    "section": "300",
    "clause": "303",
    "title": "Specialist Rock Slope Work — Clause 303",
    "page": "Printed p.56 · PDF mapping unverified",
    "status": "index",
    "read": "MoRTH Fifth Revision (2013), Clause 303, printed p.56. Specialist source section; no field procedures reproduced. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [],
    "tables": [],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8003,
    "section": "300",
    "clause": "304",
    "title": "Excavation for Structures",
    "page": "Printed p.59 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 304, printed p.59. Foundation excavation follows approved founding levels and geometry. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Foundation excavation follows approved founding levels and geometry.",
      "Site documentation: Design footprint, recorded founding strata and Engineer inspection.",
      "QC evidence: Geotechnical variations and protected-site compliance records.",
      "Measurement: Authorised excavation in m³ by classified material; other pay items follow contract.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "304 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Design footprint, recorded founding strata and Engineer inspection.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Geotechnical variations and protected-site compliance records.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Authorised excavation in m³ by classified material; other pay items follow contract.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8004,
    "section": "300",
    "clause": "305",
    "title": "Embankment Construction",
    "page": "Printed p.63 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 305, printed p.63. Approved fill properties, density, geometry and layer records govern road embankment works. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Approved fill properties, density, geometry and layer records govern road embankment works.",
      "Site documentation: Borrow material identity, laboratory soil classification, approvals and chainage.",
      "QC evidence: Linked field dry-density/MDD test reports and surveyed finished levels.",
      "Measurement: Earthwork measurement and item rates follow Clause 305.8 and sanctioned BOQ.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "305 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Borrow material identity, laboratory soil classification, approvals and chainage.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Linked field dry-density/MDD test reports and surveyed finished levels.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Earthwork measurement and item rates follow Clause 305.8 and sanctioned BOQ.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8005,
    "section": "300",
    "clause": "306",
    "title": "Soil Erosion and Sedimentation Control",
    "page": "Printed p.77 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 306, printed p.77. Temporary/permanent erosion and sediment controls require Engineer-approved plans. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Temporary/permanent erosion and sediment controls require Engineer-approved plans.",
      "Site documentation: Approved mitigation and monitoring locations.",
      "QC evidence: Pollution prevention and corrective-action records.",
      "Measurement: Payment by item-specific BOQ units under 306.4.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "306 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Approved mitigation and monitoring locations.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Pollution prevention and corrective-action records.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Payment by item-specific BOQ units under 306.4.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8006,
    "section": "300",
    "clause": "307",
    "title": "Turfing with Sods",
    "page": "Printed p.79 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 307, printed p.79. Vegetation protection uses approved cover and finished area. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Vegetation protection uses approved cover and finished area.",
      "Site documentation: Work location and material approval.",
      "QC evidence: Finished cover and acceptance evidence.",
      "Measurement: Finished area in m² under 307.4.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "307 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Work location and material approval.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Finished cover and acceptance evidence.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Finished area in m² under 307.4.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8007,
    "section": "300",
    "clause": "308",
    "title": "Seeding and Mulching",
    "page": "Printed p.82 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 308, printed p.82. Slope protection uses approved seed and mulch material. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Slope protection uses approved seed and mulch material.",
      "Site documentation: Treatment boundary and approved material submissions.",
      "QC evidence: Completed cover, condition and acceptance records.",
      "Measurement: Finished area in m² under 308.6.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "308 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Treatment boundary and approved material submissions.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Completed cover, condition and acceptance records.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Finished area in m² under 308.6.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8008,
    "section": "300",
    "clause": "309",
    "title": "Surface/Sub-Surface Drains",
    "page": "Printed p.85 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 309, printed p.85. Drain alignment, outlet, material and drainage filter specifications follow drawings. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Drain alignment, outlet, material and drainage filter specifications follow drawings.",
      "Site documentation: Drain chainage, invert and approved profile.",
      "QC evidence: Product conformity and finished drain inspections.",
      "Measurement: Running metres under 309.4; ancillary items checked against approved contract.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "309 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Drain chainage, invert and approved profile.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Product conformity and finished drain inspections.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Running metres under 309.4; ancillary items checked against approved contract.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8009,
    "section": "300",
    "clause": "310",
    "title": "Preparation and Surface Treatment of Formation",
    "page": "Printed p.89 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 310, printed p.89. Formation survey and subgrade acceptance precede pavement layers. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Formation survey and subgrade acceptance precede pavement layers.",
      "Site documentation: Final line/level and remedial-area surveys.",
      "QC evidence: Verified subgrade condition and Engineer hold-point release.",
      "Measurement: Source treats formation treatment as incidental to the relevant sub-base/base item.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "310 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Final line/level and remedial-area surveys.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Verified subgrade condition and Engineer hold-point release.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Source treats formation treatment as incidental to the relevant sub-base/base item.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8010,
    "section": "300",
    "clause": "311",
    "title": "Works to be Kept Free of Water",
    "page": "Printed p.90 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 311, printed p.90. Site drainage and runoff must not impair finished work. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Site drainage and runoff must not impair finished work.",
      "Site documentation: Approved water-management plan and recorded incidents.",
      "QC evidence: Water-damage checks and Engineer-approved corrective actions.",
      "Measurement: Clause 311 treats related work as incidental, not separately payable.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "311 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Approved water-management plan and recorded incidents.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Water-damage checks and Engineer-approved corrective actions.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Clause 311 treats related work as incidental, not separately payable.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8011,
    "section": "300",
    "clause": "312",
    "title": "Water Courses at Culverts",
    "page": "Printed p.90 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 312, printed p.90. Watercourse restoration and culvert-channel protection follow approved geometry. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Watercourse restoration and culvert-channel protection follow approved geometry.",
      "Site documentation: Surveyed channel limits and Engineer instructions.",
      "QC evidence: Finished protection and channel-function inspection.",
      "Measurement: Item-specific BOQ units; temporary diversion and reinstatement incidental.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "312 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Surveyed channel limits and Engineer instructions.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Finished protection and channel-function inspection.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Item-specific BOQ units; temporary diversion and reinstatement incidental.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8012,
    "section": "300",
    "clause": "313",
    "title": "Rockfill Embankment",
    "page": "Printed p.91 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 313, printed p.91. Rockfill material and geometric acceptance follow approved design. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Rockfill material and geometric acceptance follow approved design.",
      "Site documentation: Material approval and surveyed original/final profiles.",
      "QC evidence: Authorised fill QC and finish evidence.",
      "Measurement: m³ using original/completed cross sections under 313.4.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "313 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Material approval and surveyed original/final profiles.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Authorised fill QC and finish evidence.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "m³ using original/completed cross sections under 313.4.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  },
  {
    "id": 8013,
    "section": "300",
    "clause": "314",
    "title": "Ground Improvement for Weak Embankment Foundation",
    "page": "Printed p.92 · PDF mapping unverified",
    "status": "partial",
    "read": "MoRTH Fifth Revision (2013), Clause 314, printed p.92. Specialist-designed ground-improvement systems follow the approved geotechnical design. Only selected documentary facts have been reviewed; all final judgments remain with the Engineer and project contract.",
    "quick": [
      "Specialist-designed ground-improvement systems follow the approved geotechnical design.",
      "Site documentation: Approved investigation and qualified designer's plan.",
      "QC evidence: Traceable monitoring and specialised acceptance reports.",
      "Measurement: Specific units for approved work components; consult original source and BOQ.",
      "Use the controlling contract and approved documents. This entry does not issue engineering acceptance."
    ],
    "tables": [
      {
        "name": "314 · Field QC and Payment Record",
        "status": "checked",
        "headers": [
          "Review topic",
          "Record evidence",
          "Approval authority"
        ],
        "rows": [
          [
            "Scope / survey",
            "Approved investigation and qualified designer's plan.",
            "Approved drawing and Engineer"
          ],
          [
            "Material and quality",
            "Traceable monitoring and specialised acceptance reports.",
            "Project specification and qualified inspection"
          ],
          [
            "Payment record",
            "Specific units for approved work components; consult original source and BOQ.",
            "Sanctioned BOQ / measurement book"
          ]
        ],
        "note": "Selected source-backed documentary prompts from MoRTH Fifth Revision (2013), Section 300. No independent acceptance frequency, specialist operating method or rate is supplied."
      }
    ],
    "calc": "No autonomous site decision, physical work instructions or certified billing."
  }
];
 RECORDS.push(...incoming);
 const filter=document.getElementById('sectionFilter');
 if(filter&&!filter.querySelector('option[value="300"]')){
 const option=document.createElement('option');option.value='300';option.textContent='Section 300';
 filter.insertBefore(option,filter.querySelector('option[value="400"]'));
 }
 const wanted=new URLSearchParams(location.search).get('clause');
 if(incoming.some(r=>r.clause===wanted))selected=RECORDS.findIndex(r=>r.section==='300'&&r.clause===wanted);
 renderTree();
})();
