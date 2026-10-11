/* MoRTH Section 2700 — Wearing Coat and Appurtenances.
   Private controlling source: Fifth Revision (2013), printed pp.751–756.
   Clause 2701–2703 facts verified; 2704–2709 are index-only, not approved guidance. */
(() => {
  if (typeof RECORDS === 'undefined' || typeof renderTree !== 'function') return;
  if (RECORDS.some(r => r.section === '2700' || r.clause === '2701')) return;
  const index = [
    ['2701','Description',751],
    ['2702','Wearing Coat',751],
    ['2703','Railing and Crash Barrier',752],
    ['2704','Approach Slab',754],
    ['2705','Drainage Spouts',754],
    ['2706','Weep Holes',755],
    ['2707','Tests and Standards of Acceptance',755],
    ['2708','Measurements for Payment',755],
    ['2709','Rate',756]
  ];
  const list = index.map(([clause,title,page],i) => ({
    id:2300+i, section:'2700', clause, title,
    page:'Printed p.'+page+' · PDF mapping QA pending',
    status:i<3?'partial':'index',
    read:i<3?'Source-checked against the MoRTH Fifth Revision (2013) PDF.':'Contents index checked only; clause-specific content and decisions are pending source verification.',
    quick:[], tables:[], calc:'No approved calculation for an unchecked clause.'
  }));

  const scope = list[0];
  scope.read='Source-checked Clause 2701 defines bridge wearing coat and appurtenances scope; approved drawings, specifications or Engineer approval govern execution.';
  scope.quick=[
    '2701 — Scope includes bridge wearing coat, railings, crash barriers, approach slabs, drainage spouts and weep holes.',
    '2701 — Execute according to the drawings and these Specifications, or as approved by the Engineer.',
    '2701 — This is a scope and approval provision, not a standalone material test or numerical acceptance limit.'
  ];
  scope.tables=[{
    name:'2701 · Scope and Control', status:'checked',
    headers:['Item group','Authority/condition'],rows:[
      ['Bridge deck','Wearing coat'],
      ['Safety elements','Railing and crash barrier'],
      ['End transition','Approach slab'],
      ['Water management','Drainage spout and weep holes'],
      ['Execution basis','Drawings plus specification requirements, or Engineer approval']
    ],note:'Each component has its own requirements in later clauses; do not copy wearing-coat limits to railings or vice versa.'
  }];
  scope.calc='No formula in Clause 2701.';

  const wearing=list[1];
  wearing.read='Entire Clause 2702.1–2702.5 source-checked. Distinguish bituminous alternatives from separately laid reinforced cement-concrete wearing coat, and avoid applying deck geometry values to unrelated structures.';
  wearing.page='Printed pp.751–752 · PDF mapping QA pending';
  wearing.quick=[
    '2702.1 — Four bituminous wearing-coat alternatives: Type 1 BC 50 mm single layer; Type 2 BC 40 mm plus mastic asphalt 25 mm; Type 3 SMA 50 mm single layer; Type 4 mastic asphalt 50 mm single layer.',
    '2702.1 — Clean deck thoroughly and apply tack coat before bituminous wearing coat; operations, mix and tack coat conform to Section 500.',
    '2702.2 — Separately placed cement-concrete wearing coat: thickness 75 mm and grade at least M30.',
    '2702.2 — Cement-concrete wearing coat steel reinforcement: 8 mm diameter bars at 150 mm c/c in both directions, at mid-depth.',
    '2702.2 — Within 1 m from an expansion joint, additional 8 mm bars in both directions reduce reinforcement spacing to 75 mm c/c.',
    '2702.2 — Concrete and steel follow Sections 1700 and 1600 respectively; start curing as early as possible. Carriageway and footpath surfaces must be non-skid.',
    '2702.3 — Deck cross slope specified as 2.5%. Do not convert this into a universal road-camber rule outside the clause.',
    '2702.4(i) — For flat decks with bituminous wearing coat, provide profile-making course of the same material before wearing coat; wearing-coat thickness at any point must meet the minimum from 2702.1.',
    '2702.4(ii) — On flat decks with cement-concrete wearing coat, place profile-corrective course together with wearing coat as a single layer.',
    '2702.5 — Do not overlay an existing bridge wearing coat. Repair or replace damage; removal/dismantling follows Section 2800.'
  ];
  wearing.tables=[
    {name:'2702.1 · Bituminous Wearing-Coat Types',status:'checked',
      headers:['Type','Material system','Source thickness'],rows:[
        ['1','Bituminous concrete (BC) · single layer','50 mm'],
        ['2','BC + mastic asphalt overlay','40 mm BC + 25 mm mastic asphalt'],
        ['3','Stone matrix asphalt (SMA) · single layer','50 mm'],
        ['4','Mastic asphalt · single layer','50 mm']
      ],note:'These are alternative systems, not layers to combine arbitrarily. Before paving, clean deck and apply tack coat. Section 500 controls materials, mixes and operations.'},
    {name:'2702.2–3 · Cement-Concrete Wearing Coat and Geometry',status:'checked',
      headers:['Parameter','Governing source value'],rows:[
        ['CC wearing-coat thickness','75 mm'],
        ['CC grade','M30 minimum'],
        ['Main reinforcement','8 mm bars at 150 mm c/c each direction, at mid-depth'],
        ['Expansion-joint zone (1 m length)','Additional 8 mm bars, resulting spacing 75 mm c/c in both directions'],
        ['CC / reinforcement material controls','Sections 1700 / 1600 respectively'],
        ['Deck cross slope','2.5%'],
        ['Carriageway and footpath finish','Non-skid'],
        ['Curing','Start as early as possible; no stand-alone day-count in 2702']
      ],note:'This clause refers to bridge wearing coat. Approved drawings and governing section requirements must still be checked; do not invent a separate test frequency.'},
    {name:'2702.4–5 · Flat Deck Profile and Maintenance',status:'checked',
      headers:['Site condition','Specification'],rows:[
        ['Flat deck — bituminous system','Profile-making course before wearing coat, of same wearing-coat material; no point thinner than 2702.1 system thickness'],
        ['Flat deck — cement-concrete system','Provide profile-corrective course together with wearing coat in a single layer'],
        ['Existing bridge wearing coat','Overlay NOT permitted'],
        ['Damaged bridge wearing coat','Repair or replace; dismantling follows Section 2800']
      ],note:'Cross-slope and wearing-coat layer details are checked against project drawings. This is a specification reference, not structural deck design approval.'}
  ];
  wearing.calc='No automatic wearing-coat design or thickness selection. Approved drawing, specified type, Section 500/1600/1700, and Engineer authority govern.';

  const barrier=list[2];
  barrier.page='Printed pp.752–754 · PDF mapping QA pending';
  barrier.read='Clauses 2703.1–2703.4 source-checked: general railing/crash-barrier control, metal protection, cast-in-situ and precast concrete requirements. The last sentence in 2703.2 is visibly incomplete and held for source clarification.';
  barrier.quick=[
    '2703.1 — Railing/crash barrier includes construction on and above the kerb; do not construct until centering/falsework is released and the span is self-supporting.',
    '2703.1 — Railing/crash-barrier type follows approved drawings and IRC:5 / IRC:6; concrete and steel reinforcement follow governing material Sections.',
    '2703.1 — Set railing true to line/grade. Maximum permitted post verticality deviation is 6 mm in 3 m; fill post pockets with non-shrink mortar.',
    '2703.1 — Ensure expansion joints in railing/crash barriers function; choose a design conducive to quick repairs. Keep metal components supported above ground and free from dirt, grease and damage.',
    '2703.1 — Contractor replaces or repairs materials damaged, lost or stolen after delivery without damaging protective coatings.',
    '2703.2 — Metal railing fabrication, transportation, erection and painting conform to Section 1900.',
    '2703.2 — All steel elements, terminals, posts and hardware are galvanized or coated with approved paint. Galvanized parts must not have sharp burrs, kinks, twists or bends.',
    '2703.2 — Engineer approves any straightening; clean and re-galvanize damaged galvanized areas, drilled-hole edges and cut ends after galvanizing.',
    '2703.2 — Adjust metal railing alignment/camber before final fixing; drill field-connection holes with railing positioned at correct line and level.',
    '2703.2 — Unless drawings specify otherwise, non-galvanized metal railing gets one shop paint coat and three coats after erection.',
    '2703.3 — Cast-in-situ barrier concrete/reinforcement follow Sections 1700/1600. Formwork follows drawings; finished surfaces/corners must be sound and free of cracks/spalls.',
    '2703.3 — For bridges/viaducts longer than 500 m, horizontal slip forms are specified for casting crash barriers. Cast railing/barrier posts in a single pour.',
    '2703.4 — Precast RCC members follow Sections 1600/1700. Maximum aggregate size 12 mm; minimum M30 for railings and M40 for crash barriers.',
    '2703.4 — Keep precast members damp at least 10 days and protect from sun/wind. Reject members that chip, mar or crack before/during placement.',
    'SOURCE-CONTROL HOLD — Final line of 2703.2 prints “Where required as per the drawings, the rail elements shall be before erection.” Missing action/wording must not be guessed.'
  ];
  barrier.tables=[
    {name:'2703.1–2 · Railing/Crash-Barrier Inspection',status:'checked',
      headers:['Inspection point','Source requirement'],rows:[
        ['Span readiness','Falsework removed and span self-supporting before barrier work'],
        ['Drawing/code basis','Type as drawings, IRC:5 and IRC:6'],
        ['Post verticality','Deviation not more than 6 mm in 3 m'],
        ['Post pockets','Non-shrink mortar'],
        ['Metal works','Section 1900 controls materials, fabrication, transport, erection and painting'],
        ['Metal protection','Approved paint or galvanizing; damaged/cut galvanizing cleaned and re-galvanized'],
        ['Field alignment','Match abutting joint, line and camber before fixing; holes drilled in position'],
        ['Non-galvanized painting default','1 shop coat + 3 post-erection coats, unless drawings specify otherwise'],
        ['Storage','Above-ground support; protect from dirt, grease and damage']
      ],note:'Post verticality tolerance is only for posts. Do not apply it as a blanket tolerance to bridge members. Maintain function of railing expansion joints.'},
    {name:'2703.3–4 · Cast-in-Situ and Precast Concrete Barrier',status:'checked',
      headers:['Requirement','Source control'],rows:[
        ['Cast-in-situ reinforcement/concrete','Sections 1600 and 1700, with approved form shape and sound finish'],
        ['Long bridges/viaducts','Length >500 m: horizontal slip forms for crash barriers'],
        ['Casting posts','Single pour'],
        ['Precast maximum aggregate size','12 mm'],
        ['Precast railing concrete','M30 minimum'],
        ['Precast crash-barrier concrete','M40 minimum'],
        ['Precast damp curing','At least 10 days, protected from sun and wind'],
        ['Precast rejection','Chipped, marred or cracked before/during positioning: reject']
      ],note:'Do not apply precast M30/M40 grade requirements to cast-in-situ members without checking their separate drawing and Section 1700 requirements.'},
    {name:'2703.2 · Source-Control Hold',status:'held',
      headers:['Printed issue','Engineering disposition'],rows:[
        ['Incomplete last rail-element sentence','Clause 2703.2 prints “Where required as per the drawings, the rail elements shall be before erection.”'],
        ['Required handling','Do not supply a guessed operation; use approved drawing, verified amendment and Engineer instruction']
      ],note:'The unusual wording is retained as printed rather than silently repaired.'}
  ];
  barrier.calc='No barrier structural-design calculator authorized by Clause 2703; IRC, approved barrier type and structural design control.';

  RECORDS.push(...list);
  const filter=document.getElementById('sectionFilter');
  if(filter && !filter.querySelector('option[value="2700"]')){
    const option=document.createElement('option');
    option.value='2700';option.textContent='Section 2700';
    filter.appendChild(option);
  }
  const notice=document.querySelector('.note.warn');
  if (notice && notice.innerHTML.includes('Expansion Joints 2601–2615 content is source-checked')) {
    notice.innerHTML=notice.innerHTML.replace('Expansion Joints 2601–2615 content is source-checked','Expansion Joints 2601–2615 and Wearing Coat/Appurtenances 2701–2703 content is source-checked');
  }
  const requested=new URLSearchParams(location.search).get('clause');
  if(list.some(r=>r.clause===requested)) selected=RECORDS.findIndex(r=>r.clause===requested&&r.section==='2700');
  renderTree();
})();
