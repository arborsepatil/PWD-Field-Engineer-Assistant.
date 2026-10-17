/* MoRTH Fifth Revision 2013 · Section 200 · selected source-backed JE documentary QC.
   No independent structural assessment or hazardous field-work instructions. */
(() => {
  if(typeof RECORDS==='undefined'||typeof renderTree!=='function') return;
  if(RECORDS.some(r=>r.section==='200'))return;
  const incoming=[
  {
    "id": 24000,
    "section": "200",
    "clause": "201",
    "title": "Clearing and Grubbing",
    "page": "Printed p.37 · PDF viewer mapping QA pending",
    "status": "partial",
    "read": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Clause 201, printed p.37. Selected source-backed overview and documentary checks only. Site clearing scope includes Engineer-directed unsuitable top organic material, vegetation and stumps. Approved current contract and Engineer direction govern.",
    "quick": [
      "201 — Site clearing scope includes Engineer-directed unsuitable top organic material, vegetation and stumps.",
      "JE inspection — Record tree/asset inventory, approved limits, protected utilities and salvaged/disposed materials.",
      "Quality evidence — Keep permits, environmental/land permissions and final clearance inspection.",
      "Measurement / approval — 201.5 clearing and grubbing measured in hectares; tree items may follow contract-specific numbers/girth; avoid double payment when incidental.",
      "SOURCE CONTROL — Summary is not the full specification or independent technical approval. Follow current contract amendments and qualified supervision."
    ],
    "tables": [
      {
        "name": "201 · Field Inspection and Documentation",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Record to retain",
          "Engineering / commercial control"
        ],
        "rows": [
          [
            "Scope and drawing",
            "Record tree/asset inventory, approved limits, protected utilities and salvaged/disposed materials.",
            "Approved contract / drawing and Engineer"
          ],
          [
            "Material, safety and quality",
            "Keep permits, environmental/land permissions and final clearance inspection.",
            "Applicable test clause / approval record"
          ],
          [
            "Measurement and payment",
            "201.5 clearing and grubbing measured in hectares; tree items may follow contract-specific numbers/girth; avoid double payment when incidental.",
            "Sanctioned BOQ, measurement book and contract"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 200, Clause 201. These are JE record prompts, not newly prescribed test frequencies or procedures."
      }
    ],
    "calc": "No automatic acceptance, site permission, equipment operating instruction or certified contract payment."
  },
  {
    "id": 24001,
    "section": "200",
    "clause": "202",
    "title": "Dismantling Culverts, Bridges and Other Structures / Pavements",
    "page": "Printed p.39 · PDF viewer mapping QA pending",
    "status": "partial",
    "read": "MoRTH Specifications for Road and Bridge Works, Fifth Revision (2013), Clause 202, printed p.39. Selected source-backed overview and documentary checks only. Only approved structures and limits may be dismantled under a competent, safe work plan. Approved current contract and Engineer direction govern.",
    "quick": [
      "202 — Only approved structures and limits may be dismantled under a competent, safe work plan.",
      "JE inspection — Check structural/utility survey, demolition authorisation and limits.",
      "Quality evidence — Retain salvage inventory, disposal evidence, protection and signed completion.",
      "Measurement / approval — 202.6 lists item-specific units; verify masonry/concrete m³, pavement and other components against BOQ; no generic all-items volume.",
      "SOURCE CONTROL — Summary is not the full specification or independent technical approval. Follow current contract amendments and qualified supervision."
    ],
    "tables": [
      {
        "name": "202 · Field Inspection and Documentation",
        "status": "checked",
        "headers": [
          "Checkpoint",
          "Record to retain",
          "Engineering / commercial control"
        ],
        "rows": [
          [
            "Scope and drawing",
            "Check structural/utility survey, demolition authorisation and limits.",
            "Approved contract / drawing and Engineer"
          ],
          [
            "Material, safety and quality",
            "Retain salvage inventory, disposal evidence, protection and signed completion.",
            "Applicable test clause / approval record"
          ],
          [
            "Measurement and payment",
            "202.6 lists item-specific units; verify masonry/concrete m³, pavement and other components against BOQ; no generic all-items volume.",
            "Sanctioned BOQ, measurement book and contract"
          ]
        ],
        "note": "Source: MoRTH Fifth Revision (2013), Section 200, Clause 202. These are JE record prompts, not newly prescribed test frequencies or procedures."
      }
    ],
    "calc": "No automatic acceptance, site permission, equipment operating instruction or certified contract payment."
  }
];
  RECORDS.push(...incoming);
  const filter=document.getElementById('sectionFilter');
  if(filter&&!filter.querySelector('option[value="200"]')){
    const option=document.createElement('option');option.value='200';option.textContent='Section 200';
    filter.insertBefore(option,filter.querySelector('option[value="400"]'));
  }
  const wanted=new URLSearchParams(location.search).get('clause');
  if(incoming.some(r=>r.clause===wanted))selected=RECORDS.findIndex(r=>r.section==='200'&&r.clause===wanted);
  renderTree();
})();
 