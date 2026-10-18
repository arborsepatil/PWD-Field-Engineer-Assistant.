/* Canvas renderer for private PWD bridge PDFs. The PDF stays on the device:
 * pdf.js is loaded as a static, version-pinned library; getDocument receives
 * the File bytes in memory, never a file URL on a remote server.
 * If the library is unavailable, the caller retains the local browser PDF fallback.
 */
(function(){
'use strict';
const LIB='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
let loader=null;
function pdfJs(){
 if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
 if(loader)return loader;
 loader=new Promise((resolve,reject)=>{
  const tag=document.createElement('script');
  tag.async=true;tag.src=LIB;tag.crossOrigin='anonymous';
  tag.onload=()=>{
    if(!window.pdfjsLib){reject(new Error('PDF renderer did not initialize'));return}
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=WORKER;
    resolve(window.pdfjsLib);
  };
  tag.onerror=()=>reject(new Error('The PDF rendering library could not load. Internet may be required.'));
  document.head.appendChild(tag);
 }).catch(e=>{loader=null;throw e});
 return loader;
}
window.PWDBridgeCanvas={
 setup({layer,canvas,expectedPages,onState}){
  if(!layer||!canvas)throw new Error('Missing private drawing canvas');
  let loading=null,pdf=null,currentPage=1,epoch=0,renderEpoch=0,renderTask=null,zoom=1,disposed=false,lastErrorKind=null,lastErrorMessage='';
  const status=(state,message)=>{if(!disposed)onState?.(state,message)};
  async function close(){
    epoch++;renderEpoch++;
    if(renderTask){try{renderTask.cancel()}catch{}renderTask=null}
    const old=loading;loading=null;pdf=null;
    if(old){try{await old.destroy()}catch{}}
    layer.hidden=true;
    canvas.width=0;canvas.height=0;
  }
  async function open(blob,pageNumber){
    await close();
    if(!blob||disposed)return false;
    lastErrorKind=null;lastErrorMessage='';
    const job=epoch;
    currentPage=pageNumber||1;
    status('loading','Opening original PDF locally…');
    try{
      const lib=await pdfJs();
      if(job!==epoch||disposed)return false;
      const bytes=new Uint8Array(await blob.arrayBuffer());
      if(job!==epoch||disposed)return false;
      const task=lib.getDocument({data:bytes,useSystemFonts:true,isEvalSupported:false});
      loading=task;
      const loaded=await task.promise;
      if(job!==epoch||disposed){await task.destroy();return false}
      if(expectedPages&&loaded.numPages!==expectedPages){
        lastErrorKind='edition-mismatch';
        await task.destroy();loading=null;
        throw new Error('Page-count mismatch: this edition requires '+expectedPages+
                        ' PDF pages, but the selected file contains '+loaded.numPages+
                        '. Select the correct original book.');
      }
      pdf=loaded;
      zoom=1;
      status('loading','Rendering original page '+currentPage+' of '+pdf.numPages);
      const painted=await render(currentPage,1);
      if(!painted&&job===epoch)lastErrorKind=lastErrorKind||'render-failed';
      return painted&&job===epoch&&!!pdf;
    }catch(e){
      if(job===epoch&&!disposed){
        layer.hidden=true;
        lastErrorKind=lastErrorKind||'renderer-unavailable';
        lastErrorMessage=e.message||'Cannot render private PDF; opening browser preview.';
        status('error',lastErrorMessage);
      }
      return false;
    }
  }
  async function render(number,requestedZoom=zoom){
    if(!pdf||disposed)return false;
    currentPage=Math.min(pdf.numPages,Math.max(1,Number(number)||1));
    zoom=Math.max(1,Math.min(6,Number(requestedZoom)||1));
    const token=++renderEpoch;
    if(renderTask){try{renderTask.cancel()}catch{}renderTask=null}
    try{
      const pdfPage=await pdf.getPage(currentPage);
      if(token!==renderEpoch||disposed)return false;
      const initial=pdfPage.getViewport({scale:1});
      const bounds=layer.getBoundingClientRect();
      const w=Math.max(1,bounds.width),h=Math.max(1,bounds.height);
      const fit=Math.min(w/initial.width,h/initial.height);
      const cssWidth=Math.max(1,Math.floor(initial.width*fit));
      const cssHeight=Math.max(1,Math.floor(initial.height*fit));
      // Render sharper after zoom, but cap the bitmap to avoid Android tab crashes.
      let ratio=Math.max(1,Math.min(3.5,Number(window.devicePixelRatio)||1));
      ratio*=zoom>2?1.5:1;
      const limit=12000000;
      ratio=Math.min(ratio,Math.sqrt(limit/(cssWidth*cssHeight)));
      ratio=Math.max(0.5,ratio);
      const viewport=pdfPage.getViewport({scale:fit*ratio});
      canvas.width=Math.max(1,Math.floor(viewport.width));
      canvas.height=Math.max(1,Math.floor(viewport.height));
      canvas.style.width=cssWidth+'px';
      canvas.style.height=cssHeight+'px';
      const context=canvas.getContext('2d',{alpha:false});
      const task=pdfPage.render({canvasContext:context,viewport});
      renderTask=task;
      await task.promise;
      if(token!==renderEpoch||disposed)return false;
      renderTask=null;
      layer.hidden=false;
      status('ready','Original PDF page '+currentPage+' / '+pdf.numPages+' · rendered locally');
      return true;
    }catch(e){
      if(e?.name==='RenderingCancelledException'||token!==renderEpoch)return false;
      lastErrorKind='render-failed';
      lastErrorMessage='Could not render PDF page '+currentPage+': '+(e.message||String(e));
      status('error',lastErrorMessage);
      return false;
    }
  }
  return {
    open,close,
    showPage(number){return render(number,zoom)},
    rerenderForZoom(nextZoom){return render(currentPage,nextZoom)},
    get ready(){return !!pdf},
    get pageCount(){return pdf?.numPages||0},
    get lastErrorKind(){return lastErrorKind},
    get lastErrorMessage(){return lastErrorMessage},
    dispose(){disposed=true;close()}
  };
 }
};
})();
