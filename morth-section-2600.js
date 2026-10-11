/* MoRTH Section 2600 — expansion joint reader, Fifth Revision 2013.
   Controlling private PDF retained in Google Drive. Clause 2601–2603 facts only. */
(() => {
  if (typeof RECORDS === 'undefined' || typeof renderTree !== 'function') return;
  if (RECORDS.some(r=>r.clause==='2601')) return;
  const ix=[
    ['2601','Description',723],
    ['2602','General',723],
    ['2603','Performance Requirements',724],
    ['2604','Filler Joints',725],
    ['2605','Reinforced Elastomeric Joint',726],
    ['2606','Single Strip/Box Seal Joint',728],
    ['2607','Modular Strip/Box Seal Expansion Joints',730],
    ['2608','Asphaltic Plug Joint',732],
    ['2609','Compression Seal Joint',734],
    ['2610','Installation of Expansion Joints',736],
    ['2611','Title not printed in supplied contents index · clause QA pending',744],
    ['2612','Testing and Acceptance Standards',744],
    ['2613','Tests and Standards of Acceptance',748],
    ['2614','Measurements for Payment',748],
    ['2615','Rate',748]
  ];
  const list=ix.map(([clause,title,page],i)=>({
    id:2200+i,section:'2600',clause,title,page:'Printed p.'+page+' · PDF mapping QA pending',
    status:i<3?'partial':'index',
    read:i<3?'Source checked against the controlling Fifth Revision 2013 PDF.':'Contents index checked only. Clause-specific facts not yet source verified.',
    quick:[],tables:[],calc:'No calculation available before source-verified inputs and approval boundary.'
  }));
  const d=list[0];
  d.read='Source-checked Clause 2601 covers fabrication/installation scope and enumerates expansion joint families; specific dimensional/performance checks follow later clauses and approved design.';
  d.quick=[
    '2601 — Covers fabrication and installation of deck expansion joints.',
    '2601 — Specified joint families include filler, asphaltic plug, compression seal and reinforced elastomeric slab seal, strip seal and box seal systems.',
    '2601 — Clause is a scope definition, not a standalone numeric tolerance or test-frequency requirement.'
  ];
  d.calc='No calculator: Section 2601 provides no formula.';
  const gen=list[1];
  gen.read='Source-checked Clause 2602: approved joint type/manufacturer, prohibition on site fabrication, alternative proprietary submissions, deck-wide continuity and Engineer-controlled post-installation traffic hold.';
  gen.quick=[
    '2602.1 — Joint type must suit structural design and obtain Engineer approval. Source prints unusual wording “and got approved by the Engineer”; preserve without editorial correction.',
    '2602.2 — Joint must be robust, durable, watertight and maintainable/replaceable. SITE-FABRICATED expansion joints are prohibited.',
    '2602.2 — Procure proven joint type from approved manufacturer.',
    '2602.3 — Alternative proprietary joints need equivalent movement and rotation capacity, manufacturer requirements and evidence of satisfactory service in similar environmental conditions.',
    '2602.3 — Contractor submits proposed manufacturer name/location, general details/dimensions, specifications, anchorage/hold-down details, installation procedure and past service-performance evidence.',
    '2602.3 — Alternative joint acceptance is at sole Engineer discretion; installation follows manufacturer recommendations and specification.',
    '2602.3 — Vehicular traffic must be held off newly installed joints for the period determined by the Engineer. No universal duration is specified.',
    '2602.4 — Joint must extend across complete carriageway, kerb and footpath where provided and follow deck, kerb, footway and fascia profile.',
    '2602.4 — Footpath/kerb/fascia joints may be of another type, but must handle the same design movement/rotation demands and be watertight.'
  ];
  gen.tables=[{
    name:'Clause 2602 · Approval and Field Hold Points',status:'checked',
    headers:['Control','Governing requirement'],rows:[
      ['Joint type/design','Engineer-approved; satisfy approved movement/rotation and deck requirements'],
      ['Site fabrication','Prohibited'],
      ['Product','Proven joint from approved manufacturer'],
      ['Contractor proprietary substitution','Supporting manufacturer, detail, anchor, installation and similar-service evidence; Engineer sole discretion'],
      ['Installation','Follow manufacturer recommendations and applicable specifications'],
      ['Opening to traffic','Hold for period set by Engineer, not a guessed number'],
      ['Coverage','Carriageway, kerb, footpath/fascia as present; design movement/rotation and watertightness']
    ],note:'No fixed post-installation traffic-opening time, movement range or test frequency is printed in Clause 2602; those depend on the approved design/product/Engineer.'}];
  gen.calc='No expansion joint design calculator. Manufacturer product data, approved design movements/rotations and Engineer approval govern.';
  const perf=list[2];
  perf.read='Source-checked Clause 2603: performance requirements for the bridge structure, road user, and transition zone. The lists are qualitative performance obligations, not new numerical acceptance thresholds.';
  perf.quick=[
    '2603.1 — Expansion joint AND its transition zone must meet the relevant specification performance requirements.',
    '2603.2 — Structural performance: carry live-load effects (including impact), accommodate expansion/contraction from temperature, creep, shrinkage, prestress and deformation, and allow rotations in elevation and plan.',
    '2603.2 — Joint must be waterproof/sealed, resistant to corrosion and expected deck contaminants, maintainable and replaceable.',
    '2603.3 — Road user performance: smooth ride continuity, skid resistance, tyre safety, low noise, and safe passage where animal-drawn/steel-tyre carts apply; satisfactory appearance.',
    '2603.4 — Transition-zone anchorage must transfer generated forces into the deck without distress or uprooting; surface stays stable in long-term service.'
  ];
  perf.tables=[{name:'2603 · Performance Checklist (Qualitative)',status:'checked',
    headers:['Area','Source performance boundary'],rows:[
      ['Structure','Imposed load + impact; designed expansion/contraction and rotations'],
      ['Water/operation','Waterproof, sealed, corrosion/contaminant resistant, maintainable/replaceable'],
      ['Road user','Smooth, skid resistant, tyre safe, low noise; local animal/cart conditions where relevant'],
      ['Transition zone','Anchorage/force transfer without uprooting or deck distress; stable riding surface over service life']
    ],note:'No source numerical pass/fail threshold is supplied in 2603; acceptance is checked against approved design, manufacturer evidence, applicable later clauses and Contract.'}];
  perf.calc='No calculator; Clause 2603 defines performance requirements without a universal design equation.';

  // MoRTH Fifth Revision 2013, 2604–2605, printed pp.725–728.
  const filler=list.find(r=>r.clause==='2604');
  filler.status='partial';
  filler.page='Printed pp.725–726 · PDF page mapping QA pending';
  filler.read='Source checked for filler-joint components, materials, storage, installation and pre-sealing Engineer inspection. Drawings and manufacturer control apply; the clause gives no sampling frequency.';
  filler.quick=[
    '2604.1 — Joint includes corrugated copper plate at least 2 mm thick, installed slightly below wearing coat; 20 mm compressible fibre board edge protection, 20 mm pre-moulded filler to wearing-course top and suitable sealant.',
    '2604.2(i) — Filler material is drawing-specified bitumen-impregnated felt, elastomer or other suitable material. Impregnated felt conforms to IS:1838 and requires Engineer approval.',
    '2604.2(i) — Use large filler pieces; assembling small pieces to make the required size should be avoided.',
    '2604.2(ii–iii) — Store joint materials carefully under cover; Contractor makes good post-delivery damage to Engineer satisfaction at Contractor cost.',
    '2604.3(i) — Form joint gaps as shown on drawings; wire-brush groove faces clean of loose matter/debris and wash or jet out.',
    '2604.3(ii) — Place pre-moulded filler just before installing abutting material. Where adjacent faces are installed at different times, place it when the second face is ready.',
    '2604.3(iii–iv) — Install sealant per manufacturer recommendations; finish it approximately 3 mm below joint upper surface.',
    '2604.3(v–vi) — Remove spilled joint materials from finished bridge surfaces. Do not seal any joint before Engineer inspection and approval to proceed.'
  ];
  filler.tables=[
    {name:'2604 · Filler Joint Source Controls',status:'checked',
      headers:['Component / inspection','Requirement / boundary'],
      rows:[
        ['Corrugated copper plate','Thickness ≥2 mm, slightly below wearing coat'],
        ['Compressible edge fibre board','20 mm'],
        ['Pre-moulded filler','20 mm; to top wearing-course level'],
        ['Impregnated felt','IS:1838 + Engineer approval when used'],
        ['Groove condition','Clean thoroughly by wire brush, followed by wash/jetting'],
        ['Filler installation','Just before abutting material; defer for second joint face if built later'],
        ['Sealant','Manufacturer procedure; upper finish approximately 3 mm below joint top'],
        ['Approval HOLD','Engineer inspects and approves joint before sealing'],
        ['Protection of materials','Covered storage; damaged items rectified at Contractor expense']
      ],
      note:'These are component and workmanship controls, not a universal joint-opening or traffic-release time. Plate position, joint gap and materials remain drawing/Contract/manufacturer governed.'}
  ];
  filler.calc='No calculator: design gap, movements and installation limits require drawings/manufacturer approval.';

  const elas=list.find(r=>r.clause==='2605');
  elas.status='partial';
  elas.page='Printed pp.726–728 · PDF page mapping QA pending';
  elas.read='Source checked for steel inserts, anchors, bolts, elastomer properties, workshop fabrication, coating, fabricated-unit tolerances and handling. All manufacturer, IRC and design boundaries remain active.';
  elas.quick=[
    '2605.1(i) — Elastomeric slab is secured to steel inserts correctly anchored in deck; anchoring bolts directly embedded in deck concrete are prohibited. Steel inserts and anchorage must be manufactured at workshop, not on site.',
    '2605.1(ii) — Loop anchors with plates: plate thickness ≥12 mm, loop-bar diameter ≥16 mm and anchor spacing ≤250 mm. Alternative sinusoidal anchor-bar diameter ≥12 mm.',
    '2605.1(iii–vi) — Bolts/nuts are stainless steel and nuts use lock washers. Plug bolt holes with adhesive-fixed elastomeric plugs; manufacturer-specified adhesive/sealant and positioning/spacer jigs apply.',
    '2605.2 — Mild steel insert/anchorage and reinforcing plates conform to IS:2062 Grade B; cast steel reinforcing plates conform to IS:1030.',
    '2605.2 — Slab elastomer conforms to IRC:83 (Part II) Clause 915.1; compounded hardness IRHD 60 ±5.',
    '2605.3(i) — Steel inserts/anchorage, including embedded/concrete-contact surfaces, are sand/shot blasted to SA 2½ and primed with zinc-rich epoxy.',
    '2605.3(i) — Non-embedded/non-contact surfaces receive additional primer, MIO reinforced high-build epoxy intermediate coat and high-performance epoxy finish; total dry-film thickness ≥150 microns to manufacturer specification.',
    '2605.3(ii) — Fully mould slab and its reinforcing plates in a single vulcanizing operation; round reinforcement edges and form male/female grooves at adjoining slab units for watertightness. Refer to IRC:83 (Part II) Clause 917.',
    '2605.3(iii) — Fabrication dimensional tolerances: plan dimensions ±5 mm; overall height ±3 mm.',
    '2605.4 — Supply bolts, nuts, sealants, plugs and kerb-angle accessories; protect units in covered storage. Damage after delivery must be rectified by Contractor to Engineer satisfaction.'
  ];
  elas.tables=[
    {name:'2605 · Anchors, Inserts and Fasteners',status:'checked',
      headers:['Control','Requirement'],
      rows:[
        ['Fixing method','Slab fixed to workshop-fabricated steel inserts/anchorage; no bolts anchored directly in deck concrete'],
        ['Loop-anchor plate thickness','≥12 mm'],
        ['Loop-anchor diameter','≥16 mm'],
        ['Loop-anchor spacing','≤250 mm'],
        ['Sinusoidal anchor-bar diameter','≥12 mm'],
        ['Bolts / nuts','Stainless steel with lock washers'],
        ['Insert/anchor steel','IS:2062 Grade B; cast reinforcing plates IS:1030']
      ],note:'Two anchorage systems are alternatives; do not combine their size limits into a nonexistent single design. Approved detailing governs.'},
    {name:'2605 · Elastomer, Coating and Fabrication',status:'checked',
      headers:['Parameter','Source criterion / boundary'],
      rows:[
        ['Elastomer hardness','IRHD 60 ±5; also IRC:83 (Part II) 915.1'],
        ['Blast preparation','SA 2½ for steel inserts and anchors, including concrete-contact surfaces'],
        ['Base corrosion protection','Zinc-rich epoxy primer'],
        ['Exposed surface protection','Additional primer, MIO high-build epoxy, epoxy finish; total DFT ≥150 µm'],
        ['Slab fabrication','Single moulding/vulcanising operation; embedded reinforcement integral'],
        ['Fabrication plan dimensions','±5 mm'],
        ['Fabrication total height','±3 mm'],
        ['Handling','Store under cover, replace/repair damage at Contractor expense to Engineer satisfaction']
      ],note:'Coating stack and minimum DFT specifically apply to surfaces NOT in contact with or embedded in concrete. Fabrication tolerances are not bridge construction tolerances. Manufacturer and IRC requirements remain controlling.'}
  ];
  elas.calc='No calculator: anchor design, joint movement capacity and installation suitability need structural design and manufacturer/Engineer approval.';


  // Source controlled MoRTH 2013 pp.728–730: Clause 2606 + Table 2600-1.
  const strip=list.find(r=>r.clause==="2606");
  strip.status="partial";
  strip.page="Printed pp.728–730 · PDF page mapping QA pending";
  strip.read="Source checked 2606.1–2606.4 and Table 2600-1. DIN and ASTM alternatives are NOT combined. Apparent source ambiguities remain held for governing-source confirmation.";
  strip.quick=[
    "2606.1(i) — Edge beam must mechanically retain seal; flange/web steel thickness at least 10 mm throughout, lip thickness at least 6 mm, edge beam height at least 80 mm and cross-sectional area at least 1500 mm².",
    "2606.1(ii) — Rigid loop anchors welded via anchor plates. Total anchor-loop section on EACH side at least 1600 mm² per metre joint; centre spacing not over 250 mm.",
    "2606.1(ii) — Anchor-plate thickness at least greater of 0.7 × anchor-loop diameter or 12 mm. Loop orientation 90° to joint with planned deviation ±20°; anchoring reinforcement parallel to loop anchors.",
    "2606.1(iii) — Continuous preformed/extruded strip, mechanically locked into edge beams; separate mechanical fastening of sealing strip is prohibited. Seal resists tear, oils, petrol, ozone and ageing.",
    "2606.1(iii) — Perpendicular working movement at least 80 mm up to maximum 100 mm; parallel to joint ±40 mm; gap for inserting chloroprene seal at least 25 mm. Joint structural design still governs required movement.",
    "2606.2(i–iii) — Edge beam steels from listed equivalent grade families; for subzero conditions IS:2062 Grade C. Anchors IS:2062 Grade B or equivalent. Sealing strip of chloroprene rubber (CR).",
    "2606.2 Table 2600-1 — DIN and ASTM are ALTERNATIVES selected based on source of supply. Preserve the printed value and test method association; hold disputed or unclear table entries.",
    "2606.3(i–iii) — Fabricate continuous edge profiles for full carriageway width to actual bridge cross-section; use clamps, weld anchor plates to edge beam and bent loops to plates during pre-installation fabrication.",
    "2606.3(iv–v) — Corrosion protection: hot-dip galvanising at least 150 µm OR epoxy coating. All insert/anchor surfaces, including concrete-contact, are treated per Clause 2605.3(i).",
    "2606.3–4 — Transport finished clamped assembly with auxiliary brackets; supply seals/accessories, store covered on suitable wooden pads, and rectify delivery damage to Engineer satisfaction at Contractor cost."
  ];
  strip.tables=[
    {name:"2606.1 · Edge Beam and Anchorage Geometry",status:"checked",
     headers:["Field criterion","Source value / boundary"],rows:[
       ["Steel section thickness including flange/web","≥10 mm throughout"],
       ["Seal retaining lip thickness","≥6 mm"],
       ["Edge beam minimum height","≥80 mm"],
       ["Edge beam cross-sectional area","≥1500 mm²"],
       ["Total rigid anchor loop area EACH side","≥1600 mm² per metre joint length"],
       ["Anchor loop centre-to-centre spacing","≤250 mm"],
       ["Anchor plate thickness","≥ greater of 0.7 × loop diameter OR 12 mm"],
       ["Anchor-loop angle to joint","90° ±20° for planned deviation"],
       ["Anchoring reinforcement","Parallel to anchor loops"],
       ["Seal mounting","Mechanical locking profile; no separate mechanical fastening of seal"] ],
     note:"The 1600 mm² figure is a TOTAL area per metre on EACH side, not the cross-section required for one anchor. Approved design and manufacturer detailing govern."},
    {name:"2606.1 · Sealing Element Movement",status:"checked",headers:["Characteristic","Source requirement"],rows:[
       ["Perpendicular working movement","At least 80 mm, maximum 100 mm"],
       ["Parallel working movement","±40 mm"],
       ["Minimum gap to insert chloroprene seal","25 mm"],
       ["Seal configuration","Continuous preformed/extruded, locked in edge beam, resistant to oil, gasoline, ozone and ageing"],
       ["Watertightness","Joint to provide watertight proprietary locking and ease of replacement"] ],
     note:"These are system performance/component bounds, NOT a calculated design movement for a specific bridge."},
    {name:"2606.2 · Material Standards",status:"checked",headers:["Component","Source-controlled standard"],rows:[
       ["Edge steel, ordinary condition","Equivalent RST 37-2 / 37-3; EN10025 S235JRG2 / S355K2G3; ASTM A36/A588; CAN/CSA G40.21 Grade 300W; IS:2062 Grade B"],
       ["Edge steel, subzero condition","IS:2062 Grade C"],
       ["Anchor steel","IS:2062 Grade B or equivalent"],
       ["Sealing element","Chloroprene Rubber; Table 2600-1"],
       ["Seal tests","Choose one of DIN OR ASTM based on source of supply"] ],
     note:"Do not combine DIN results with ASTM thresholds for one seal acceptance decision."},
    {name:"Table 2600-1 · DIN Chloroprene Property Entries",status:"checked",headers:["Property and method","Printed value / source boundary"],rows:[
       ["Hardness · DIN 53505","63 + 5 Shore A (printed plus sign; interpretation held)"],
       ["Tensile · DIN 53504","Minimum 11 MPa"],
       ["Elongation · DIN 53504","Minimum 350%"],
       ["Tear · DIN 53507","Minimum 10 N/mm (longitudinal/transverse printed line; check original layout)"],
       ["Shock elasticity · DIN 53512","Minimum 25%"],
       ["Abrasion · DIN 53516","Maximum 220 mm³"],
       ["Residual compression strain · DIN 53517","Max 28% in shared DIN/ASTM property row; exact association held"],
       ["Hot-air ageing · DIN 53508, 14 days at 70°C","Hardness max +7 Shore A; tensile change max −20%; elongation change max −20%"],
       ["Ozone ageing · DIN 53509","No cracks"],
       ["Oil No.1 swelling · DIN 53521","Volume max +5%; hardness max −10 Shore A"],
       ["Oil No.3 swelling · DIN 53521","Volume max +25%; hardness max −20 Shore A"] ],
     note:"Only source-controlled printed values, not auto-pass/fail. DIN 53521 swelling uses named ASTM test oils; this does not override the source note selecting one DIN/ASTM specification."},
    {name:"Table 2600-1 · ASTM Alternative Property Entries",status:"checked",headers:["Property and method","Printed value / held issue"],rows:[
       ["Hardness · ASTM D2240","55 + 5 Shore A (printed plus sign; interpretation held)"],
       ["Tensile · ASTM D412","Minimum 13.8 MPa"],
       ["Elongation · ASTM D412","Minimum 250%"],
       ["Tear · ASTM D624 (printed Dia C)","Minimum 10 N/mm (verify source table alignment)"],
       ["Compression strain · ASTM D395 Method B","Max 28% shown for combined DIN/ASTM row; hold alignment"],
       ["Cold hardening point · ASTM D1043","Min −35°C as printed; interpretation held"] ],
     note:"Table 2600-1 expressly states only one specification, ASTM or DIN, per source of supply. Printed hardness uses + not unambiguously ±; cold hardening uses Min −35°C; preserve rather than correct. Clarify from actual governing source before numeric pass/fail."},
    {name:"2606.3–4 · Fabrication, Corrosion and Handling",status:"checked",headers:["Control","Source requirement"],rows:[
       ["Profile fit","Full carriageway width; align against actual bridge cross-section on fabrication tables"],
       ["Welds / anchor assembly","Anchor plates to edge beams; loop bars to plates"],
       ["Corrosion protection","Hot-dip galvanising ≥150 µm OR epoxy-coating"],
       ["Inserts / anchor surfaces","Clause 2605.3(i) surface treatment including concrete-contact faces"],
       ["Transport","Clamp finished assembly; auxiliary brackets"],
       ["Storage","Under cover on wooden padding"],
       ["Delivered damaged materials","Contractor makes good to Engineer satisfaction"] ],
     note:"Read fabrication details with Clause 2602.2 prohibition on SITE-manufactured expansion joints. This clause does not waive it."}
  ];
  strip.calc="No automatic acceptance or movement/design calculator. Approved movement, anchor design, manufacturer and contractual requirements remain governing; Table 2600-1 source-control issues prevent a combined pass/fail tool.";


  // MoRTH 5th Revision (2013), 2607–2608, printed pp.730–734.
  // Preserve all suspicious printed figures/cross-references as SOURCE-CONTROL.
  const modular=list.find(r=>r.clause==="2607");
  modular.status="partial";
  modular.page="Printed pp.730–732 · PDF page mapping QA pending";
  modular.read="Source checked against Clause 2607.1–2607.4, cross-referenced 2606.1, 2606.3 and 2605.3(i), and manufacturer-controlled supports and fabrication. The manufacturer/Designer/Engineer governs joint design and selected module count.";
  modular.quick=[
    "2607.1 — A modular strip/box seal joint comprises two or more cells of individual capacity 80 mm for total horizontal movements exceeding 80 mm. System accommodates three-direction movement and rotation about three axes as required by design.",
    "2607.1 — Edge beams, central beams/lamellas and transverse support bars deliver joint loads to deck via anchor system. Edge/central beams follow Clause 2606.1(i).",
    "2607.1(ii) — Edge beam anchorage follows Clause 2606.1(ii). Joist-box/control covers may have studs and/or loop anchors with anchor plates.",
    "2607.1(iii) — Sealing elements follow Clause 2606.1(iii); minimum gap for inserting neoprene seal is 25 mm.",
    "2607.1(iv) — Manufacturer-recommended support and control system must make all joint modules open/close equally through movement cycles; single/multiple support-bar or swivel system with resilient/shock-absorption and elastic/sliding controls.",
    "2607.1(iv) — During maximum deck contraction and joint opening, maximum surface gap between consecutive central beams is 80 mm.",
    "2607.2 — Steel for edge/central beams, support bars and components follows listed equivalent DIN/EN/ASTM/CAN-CSA grades. Sealing element is chloroprene rubber (CR) with properties per Table 2600-1; other materials follow manufacturer recommendations.",
    "2607.3 — Edge/lamella profiles cover full carriageway width; shop fabrication, anchorage assembly and transport follow manufacturer's approved specifications.",
    "2607.3 — Steel corrosion protection follows Clause 2606.3(iv); all steel insert/anchor surfaces, including embedded/concrete-contact, follow Clause 2605.3(i).",
    "2607.4 — Manufacturer-prescribed storage/transport arrangements; manufacturer supplies all seals and installation accessories."
  ];
  modular.tables=[
    {name:"2607.1 · Modular Joint Movement / Arrangement",status:"checked",
      headers:["Field or design parameter","Requirement / boundary"],rows:[
        ["Number of modules/cells","At least 2"],
        ["Individual module horizontal movement capacity","80 mm"],
        ["Intended total horizontal movement","Greater than 80 mm"],
        ["Movement / rotation","Three directions and rotation about all three axes according to design"],
        ["Maximum surface gap, consecutive centre beams","80 mm at full opening under maximum deck contraction"],
        ["Minimum neoprene-seal insertion gap","25 mm"],
        ["Edge and central beams","As Clause 2606.1(i)"],
        ["Edge anchorage","As Clause 2606.1(ii)"],
        ["Sealing elements","As Clause 2606.1(iii)"],
        ["Control system","Ensure equal opening/closing of all modules; manufacturer specifications govern"]
      ],
      note:"80 mm/cell is stated as individual capacity; do not automatically select number of modules from bridge length or presume Engineer design approval."},
    {name:"2607.2–4 · Materials, Corrosion, Fabrication and Supply",status:"checked",
      headers:["Category","Controlling requirement"],rows:[
        ["Structural steel","Source-listed equivalent DIN RST 37-2/37-3/52-3; EN S235JRG2/S355K2G3; ASTM A36/A588; CAN/CSA G40.21 Grade 300W"],
        ["Seal material","Chloroprene Rubber, Table 2600-1; unresolved Table 2600-1 issues preserved"],
        ["Other materials","Manufacturer specification"],
        ["Profiles","Full carriageway width"],
        ["Fabrication/transport","Manufacturer specifications; assembled joint"],
        ["Steel section corrosion protection","Clause 2606.3(iv)"],
        ["Inserts/anchor surfaces","Clause 2605.3(i), including embedded surfaces"],
        ["Storage and accessories","Manufacturer requirements, with required sealants/accessories supplied"]
      ],note:"Do not substitute requirements from other expansion-joint systems where Clause 2607 specifies a particular cross-reference."}
  ];
  modular.calc="No modular-joint sizing calculator: the number of cells and true movement demand require approved structural design and manufacturer documentation. 80 mm is an individual module capacity, not automatic construction approval.";

  const plug=list.find(r=>r.clause==="2608");
  plug.status="partial";
  plug.page="Printed pp.732–734 · PDF page mapping QA pending";
  plug.read="Source checked against Clause 2608.1–2608.2 and Table 2600-2. Suspicious or internally inconsistent printed gradation columns, aggregate indicators and binder units are SOURCE-CONTROL HOLD issues, not corrected or auto-approved.";
  plug.quick=[
    "2608.1 — Asphaltic plug joint comprises polymer-modified bitumen binder, single-size aggregate, metallic closure/bridging plate and heat-resistant foam caulking/backer rod.",
    "2608.1 — Stated satisfactory ambient service temperature range: −5°C to +50°C.",
    "2608.2(i) — Proprietary binder needs specified low-temperature flexibility, installation fluidity and high-temperature flow resistance. Source binder softening-point minimum 100°C, flow-resistance maximum 3 mm (70°C/5h).",
    "2608.2(i) — Printed cone-penetration row reads 'at 25°C, 0.1 mm (BS:2499): 100 mm max'; unit/notation uncertain and is HELD from auto-acceptance.",
    "2608.2(i) — Source's extension-test text and safe-heating entry require manufacturer and approved specialist interpretation. Do not infer field heating or acceptance procedures from this summary.",
    "2608.2(ii) — Single-size stone is basalt, granite, gritstone or gabro group. Text specifies nominal 12.5 mm stone for joints up to 75 mm depth and 20 mm above; Table 2600-2 instead labels gradation columns 20 mm and 25 mm. Preserve this source mismatch.",
    "2608.2(ii) — Aggregate flakiness index must not exceed 25%. Other printed PSV/AAV/AIV/ACV values are recorded in the table with possible anomalies flagged; grading table retained by printed headings.",
    "2608.2(iii) — Closure/bridging plate of weldable IS:2062 structural steel, at least 6 mm thick and 200 mm wide. Prefer one continuous length; at most two pieces per traffic lane, welded together.",
    "2608.2(iii) — Closure plate anchorage holes along longitudinal centreline at maximum 300 mm intervals; anti-corrosive galvanising/coating with minimum 100 µm as printed.",
    "2608.2(iv) — Backer rod is specified closed-cell polyolefin or open-cell polyurethane cylinder; diameter equals 150% joint opening and density 25–30 kg/m³, heat resistant with recovery."
  ];
  plug.tables=[
    {name:"2608 · Asphaltic Plug Joint Components / Service Limits",status:"checked",
      headers:["Item","Printed requirement / boundary"],rows:[
        ["Operating ambient range","−5°C to +50°C"],
        ["Binder softening point","Minimum 100°C"],
        ["Binder flow resistance, 70°C for 5 h","Maximum 3 mm per BS:2499"],
        ["Binder cone penetration at 25°C, 0.1 mm increments","Printed '100 mm max' — unit SOURCE-CONTROL HOLD"],
        ["Binder extension test","5 cycles to 50%; referenced ASTM D1190 / BS:2499; test setup/outcome alignment held"],
        ["Aggregate nominal size per running text","12.5 mm for joint depth up to 75 mm; 20 mm for deeper joint"],
        ["Aggregate flakiness index","≤25%"],
        ["Service/design approval","Binder suitability, composition and application remain approved proprietary product/Engineer controlled"]
      ],note:"The source also prints a binder safe-heating entry, but this reader does not give heating instructions. Trained specialist installation and manufacturer documentation govern. Do not normalize cone-penetration unit or merge the text's stone sizes with Table 2600-2 column labels."},
    {name:"Table 2600-2 · Aggregate Gradation (as printed)",status:"checked",
      headers:["IS sieve","Printed 20 mm column (% passing)","Printed 25 mm column (% passing)"],
      rows:[
        ["26.5 mm","100","—"],
        ["19.9 mm","85–100","100"],
        ["13.0 mm","0–35","85–100"],
        ["9.5 mm","0–7","0–35"],
        ["6.3 mm","—","0–7"],
        ["2.3 mm","0–2","0–2"],
        ["75 micron","0–1","0–1"]
      ],note:"SOURCE-CONTROL: Running text calls for 12.5/20 mm nominal aggregate by depth, while the printed table headings read 20/25 mm. The sieve designation '19.9 mm' and the printed values are preserved, not normalized. Table is reference only until governing clarification; no auto-gradation pass/fail."},
    {name:"2608.2 · Aggregate Acceptance References / Source Holds",status:"checked",
      headers:["Printed characteristic","Value / issue"],rows:[
        ["PSV","Printed >60"],
        ["AAV","Printed >05 (suspicious direction and two-digit formatting — SOURCE-CONTROL)"],
        ["AIV","Printed <18"],
        ["ACV","Printed 10–25 (no comparison sign)"],
        ["Aggregate surface","Should promote adhesion"]
      ],note:"Do not silently reverse AAV inequality, change the ACV expression or import a later MoRTH edition. Interpret only using controlling source or governing amendment."},
    {name:"2608.2(iii–iv) · Closure Plate / Backer Rod",status:"checked",
      headers:["Field component","Source criterion"],rows:[
        ["Closure plate steel","Weldable structural steel IS:2062"],
        ["Closure plate thickness","≥6 mm"],
        ["Closure plate width","≥200 mm"],
        ["Piece count per traffic-lane width","Prefer single length; maximum two pieces welded together"],
        ["Plate hole centres","≤300 mm, equidistant along longitudinal centre"],
        ["Plate corrosion protection","Galvanising or approved protective coating at least 100 µm"],
        ["Foam backer-rod types","Closed-cell polyolefin or open-cell polyurethane"],
        ["Rod diameter","1.5 × joint opening"],
        ["Backer-rod density","25–30 kg/m³"],
        ["Backer characteristics","Heat resistance, flexibility and recovery"]
      ],note:"Thickness, hole spacing and materials are component controls, not a complete bridge expansion-joint design or onsite heating procedure."}
  ];
  plug.calc="No asphaltic-plug material/grading/heating calculator enabled. Running-text/table nominal-size disagreement and printed binder/AAV ambiguities must be resolved from governing source; approved supplier and Contract control.";

  RECORDS.push(...list);
  const filter=document.getElementById('sectionFilter');
  if(filter && !filter.querySelector('option[value="2600"]')){
    const option=document.createElement('option');option.value='2600';option.textContent='Section 2600';filter.appendChild(option);
  }
  const notice=document.querySelector('.note.warn');
  if(notice && notice.innerHTML.includes('and River Training / Protection 2501–2510 content is source-checked')){
    notice.innerHTML=notice.innerHTML.replace('and River Training / Protection 2501–2510 content is source-checked','and River Training / Protection 2501–2510 and Expansion Joints 2601–2608 content is source-checked');
  }
  const clause=new URLSearchParams(location.search).get('clause');
  if(list.some(r=>r.clause===clause))selected=RECORDS.findIndex(r=>r.clause===clause);
  renderTree();
})();
