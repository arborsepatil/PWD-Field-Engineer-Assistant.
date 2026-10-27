/* MoRTH QC planning draft. Printable/exportable from currently visible reference rows.
 * Read-only QC frequencies; no sample count calculator, pass/fail, storage or network.
 */
(function(){
  'use strict';
  const core=window.CivilBandhuQCPlanCore;
  const el=function(id){return document.getElementById(id)};
  const preview=el('qcPlanPrintView'),message=el('qcPlanMessage');
  if(!core||!preview||!message)return;
  const inputIds={project:'qcPlanProject',site:'qcPlanSite',date:'qcPlanDate',contractor:'qcPlanContractor'};
  function metadata(){
    const meta={};
    Object.keys(inputIds).forEach(function(key){meta[key]=el(inputIds[key]).value.trim()});
    return meta;
  }
  function visibleEntries(){
    return Array.from(document.querySelectorAll('#roadQC2013 tr[data-qc-id]'))
      .filter(function(row){return !row.hidden})
      .map(function(row){
        const cells=row.querySelectorAll('td');
        const parent=row.closest('details.qc-card');
        const summary=parent&&parent.querySelector('summary');
        return {
          id:row.getAttribute('data-qc-id'),
          section:summary?summary.textContent.trim():'Selected MoRTH QC reference',
          work:cells[0].textContent.trim(),
          test:cells[1].textContent.trim(),
          frequency:cells[2].textContent.trim()
        };
      });
  }
  function node(tag,text,className){
    const element=document.createElement(tag);
    if(text!==undefined)element.textContent=text;
    if(className)element.className=className;
    return element;
  }
  function labelLine(title,value){
    return node('p',title+': '+(value||'________________________'),'qc-plan-meta');
  }
  function prepare(){
    const entries=visibleEntries();
    if(!entries.length){
      message.textContent='No matching QC entries. Clear or change the search above.';
      preview.hidden=true;
      return null;
    }
    const meta=metadata();
    preview.replaceChildren();
    preview.appendChild(node('h2','QC Planning Sheet · DRAFT ONLY'));
    preview.appendChild(node('p','MoRTH Fifth Revision (2013) · selected reference entries; not a complete QC plan.','qc-plan-disclaimer'));
    preview.appendChild(labelLine('Project / work',meta.project));
    preview.appendChild(labelLine('Site / chainage',meta.site));
    preview.appendChild(labelLine('Inspection date',meta.date));
    preview.appendChild(labelLine('Contractor',meta.contractor));
    const table=node('table');
    table.className='qc-plan-table';
    const thead=node('thead'),heads=node('tr');
    ['Work / basis','Control test','2013 source reference','Sample / test ID','Engineer review / remarks'].forEach(function(text){
      heads.appendChild(node('th',text));
    });
    thead.appendChild(heads);
    table.appendChild(thead);
    const tbody=node('tbody');
    entries.forEach(function(entry){
      const tr=node('tr');
      [entry.work,entry.test,entry.frequency,'',''].forEach(function(text){tr.appendChild(node('td',text))});
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    preview.appendChild(table);
    preview.appendChild(node('p','Only '+entries.length+' currently matching references are included. Frequencies may require additional testing by source, daily minimum, layer, plant, contract and Engineer instructions. No automatic test-count or acceptance decision is provided.','qc-plan-disclaimer'));
    preview.appendChild(node('p','Review the current contract, approved drawings, governing specifications and printed source anomalies before planning or accepting tests.','qc-plan-disclaimer'));
    message.textContent=entries.length+' matching QC references prepared as an unapproved draft. Nothing is stored or sent.';
    preview.hidden=false;
    return {meta:meta,entries:entries};
  }
  el('qcPlanPreview').addEventListener('click',prepare);
  el('qcPlanCsv').addEventListener('click',function(){
    const draft=prepare();
    if(!draft)return;
    const content=core.makeCsv(draft.meta,draft.entries);
    const blob=new Blob([content],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=node('a');
    link.href=url;
    link.download='civilbandhu-qc-planning-DRAFT.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function(){URL.revokeObjectURL(url)},1000);
  });
  el('qcPlanPrint').addEventListener('click',function(){
    if(!prepare())return;
    document.body.classList.add('qc-print-mode');
    window.print();
  });
  window.addEventListener('afterprint',function(){document.body.classList.remove('qc-print-mode')});
})();
