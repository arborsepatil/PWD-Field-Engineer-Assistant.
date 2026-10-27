/* CIVIL BANDHU: local QC draft worksheet (private-owner test only).
 * Data are transient. Export/save CSV before leaving; no network or storage.
 * No test count, pass/fail, shortfall, recovery or engineer approval decisions.
 */
(function(){
  'use strict';
  const core=window.CivilBandhuQCPlanCore;
  const el=function(id){return document.getElementById(id)};
  const preview=el('qcPlanPrintView'),message=el('qcPlanMessage');
  if(!core||!preview||!message)return;
  const inputIds={project:'qcPlanProject',site:'qcPlanSite',date:'qcPlanDate',contractor:'qcPlanContractor'};
  const records=new Map();
  let currentEntries=[];
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
  function stateFor(id){
    if(!records.has(id))records.set(id,{selected:true,sampleId:'',observed:'',review:''});
    return records.get(id);
  }
  function chosen(){
    return currentEntries.filter(function(entry){return stateFor(entry.id).selected})
      .map(function(entry){return Object.assign({},entry,stateFor(entry.id))});
  }
  function node(tag,content,className){
    const item=document.createElement(tag);
    if(content!==undefined)item.textContent=content;
    if(className)item.className=className;
    return item;
  }
  function labelledLine(label,value){
    return node('p',label+': '+(value||'________________________'),'qc-plan-meta');
  }
  function updateCount(){
    const selected=chosen().length;
    message.textContent=selected+' of '+currentEntries.length+' matching QC references selected for an unapproved draft. Unsaved entries are lost when the page closes.';
  }
  function addEditableCell(row,entry,key,title){
    const state=stateFor(entry.id),td=node('td');
    const control=node('input');
    control.type='text';
    control.value=state[key];
    control.maxLength=220;
    control.setAttribute('aria-label',title+' for '+entry.test);
    const printed=node('span',state[key]||'________________','qc-plan-print-value');
    td.appendChild(control);
    td.appendChild(printed);
    control.addEventListener('input',function(){
      state[key]=control.value;
      printed.textContent=control.value||'________________';
    });
    row.appendChild(td);
  }
  function prepare(){
    currentEntries=visibleEntries();
    if(!currentEntries.length){
      message.textContent='No matching QC entries. Clear or change the search above.';
      preview.hidden=true;
      return null;
    }
    const meta=metadata();
    preview.replaceChildren();
    preview.appendChild(node('h2','Field QC draft register · NOT APPROVED'));
    preview.appendChild(node('p','MoRTH Fifth Revision (2013) · select the relevant rows and enter observed results manually. Not a complete QC plan.','qc-plan-disclaimer'));
    preview.appendChild(labelledLine('Project / work',meta.project));
    preview.appendChild(labelledLine('Site / chainage',meta.site));
    preview.appendChild(labelledLine('Inspection date',meta.date));
    preview.appendChild(labelledLine('Contractor',meta.contractor));
    const table=node('table');
    table.className='qc-plan-table';
    const thead=node('thead'),header=node('tr');
    ['Include','Work / basis','Control test','2013 source reference','Sample / test ID','Observed result','Engineer remarks'].forEach(function(title){
      header.appendChild(node('th',title));
    });
    thead.appendChild(header);
    table.appendChild(thead);
    const tbody=node('tbody');
    currentEntries.forEach(function(entry){
      const state=stateFor(entry.id);
      const tr=node('tr');
      tr.setAttribute('data-selected',state.selected?'true':'false');
      const td=node('td');
      const control=node('input');
      control.type='checkbox';
      control.checked=state.selected;
      control.setAttribute('aria-label','Include '+entry.test+' in QC draft');
      control.addEventListener('change',function(){
        state.selected=control.checked;
        tr.setAttribute('data-selected',state.selected?'true':'false');
        updateCount();
      });
      td.appendChild(control);tr.appendChild(td);
      [entry.work,entry.test,entry.frequency].forEach(function(value){tr.appendChild(node('td',value))});
      addEditableCell(tr,entry,'sampleId','Sample / test ID');
      addEditableCell(tr,entry,'observed','Observed result');
      addEditableCell(tr,entry,'review','Engineer remarks');
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    preview.appendChild(table);
    preview.appendChild(node('p','Only checked reference rows are exported or printed. Source frequencies do not establish a project-specific test count. Source changes, daily minima, plant, layer, contract and Engineer directions require independent review.','qc-plan-disclaimer'));
    preview.appendChild(node('p','No lab result is checked, no shortfall is calculated and no compliance / engineer approval is recorded automatically. Validate each record against applicable governing specifications.','qc-plan-disclaimer'));
    preview.hidden=false;
    updateCount();
    return {meta:meta,entries:chosen()};
  }
  el('qcPlanPreview').addEventListener('click',prepare);
  el('qcPlanCsv').addEventListener('click',function(){
    const draft=prepare();
    if(!draft||!draft.entries.length){
      if(draft)message.textContent='Select at least one matching QC reference before exporting.';
      return;
    }
    const csv=core.makeCsv(draft.meta,draft.entries);
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=node('a');
    link.href=url;
    link.download='civilbandhu-qc-register-DRAFT.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function(){URL.revokeObjectURL(url)},1000);
  });
  el('qcPlanPrint').addEventListener('click',function(){
    const draft=prepare();
    if(!draft||!draft.entries.length){
      if(draft)message.textContent='Select at least one matching QC reference before printing.';
      return;
    }
    document.body.classList.add('qc-print-mode');
    window.print();
  });
  window.addEventListener('afterprint',function(){document.body.classList.remove('qc-print-mode')});
})();
