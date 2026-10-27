/* Civil Bandhu MoRTH QC draft: preserves source references and manual records.
 * Never computes testing frequencies, compliance, or engineering approvals.
 */
(function(root){
  'use strict';
  const COLUMNS=[
    'Document status','Source edition','QC reference ID','Clause / table',
    'Work / basis','Control test','Selected source-frequency reference',
    'Project / work','Site / chainage','Inspection date','Contractor',
    'Sample / test ID (field entry)','Observed result (field entry)',
    'Engineer review (field entry)'
  ];
  const STATUS='DRAFT ONLY - NOT TESTED OR APPROVED';
  function cell(value){
    let text=String(value==null?'':value);
    // Prevent formulas in a CSV opened in spreadsheet applications.
    // Prefix the entire suspicious field; preserve the original characters.
    if(/^[\s\uFEFF]*[=+\-@]/.test(text)) text="'"+text;
    return '"'+text.replace(/"/g,'""')+'"';
  }
  function sheet(meta,entries){
    if(!Array.isArray(entries)||!entries.length)throw new Error('Select at least one matching QC reference.');
    meta=meta||{};
    const lines=[COLUMNS];
    entries.forEach(function(entry){
      lines.push([
        STATUS,'MoRTH Fifth Revision (2013)',entry.id,entry.section,
        entry.work,entry.test,entry.frequency,
        meta.project,meta.site,meta.date,meta.contractor,
        entry.sampleId||'',entry.observed||'',entry.review||''
      ]);
    });
    return '\uFEFF'+lines.map(function(line){return line.map(cell).join(',')}).join('\r\n')+'\r\n';
  }
  root.CivilBandhuQCPlanCore=Object.freeze({columns:COLUMNS.slice(),status:STATUS,makeCsv:sheet});
})(typeof window!=='undefined'?window:globalThis);
