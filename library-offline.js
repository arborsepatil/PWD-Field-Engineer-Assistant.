/* Private offline PDF Library for the installable Android app and browser preview.
 * PDF bytes only in this browser's IndexedDB; never in the GitHub Pages bundle.
 * Uses the same store as the existing per-publication PDF viewer.
 */
(function(){
'use strict';
const DB='pwd-private-library-pdfs-v1',STORE='files',MAX=160*1024*1024;
const PDFJS_CACHE='pwd-public-pdfjs-offline-v1';
const RENDERER=[
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];
function entryFor(id){
 return (window.PWDDrivePDFCatalog||[]).find(x=>x.id===id)||null;
}
function transaction(mode,operation){
 if(typeof indexedDB==='undefined')return Promise.reject(Error('Private on-device storage is unavailable in this browser.'));
 return new Promise((resolve,reject)=>{
  let db,finished=false,value;
  const req=indexedDB.open(DB,1);
  req.onupgradeneeded=()=>{
   if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE);
  };
  req.onerror=()=>reject(req.error||Error('Could not open private storage'));
  req.onsuccess=()=>{
   db=req.result;
   try{
    const tx=db.transaction(STORE,mode),op=operation(tx.objectStore(STORE));
    op.onsuccess=()=>value=op.result;
    tx.oncomplete=()=>{db.close();finished=true;resolve(value)};
    tx.onerror=()=>{db.close();reject(tx.error||Error('Private storage write failed'))};
    tx.onabort=()=>{db.close();reject(tx.error||Error('Private storage aborted'))};
   }catch(error){db.close();reject(error)}
  };
 });
}
function key(id){return 'drive-'+id}
function normalized(name){
 return String(name||'').toLowerCase().replace(/\\/g,'/').split('/').pop()
   .replace(/^\d+\.\s*/,'').replace(/\.pdf$/i,'')
   .replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
function fileMatch(file,record){
 return normalized(file?.name)===normalized(record.name);
}
async function checkPDF(file){
 if(!file||file.size<100||file.size>MAX)throw Error('Choose a PDF between 100 bytes and 160 MB.');
 const bytes=new Uint8Array(await file.slice(0,1024).arrayBuffer());
 const head=String.fromCharCode(...bytes.slice(0,Math.min(bytes.length,100)));
 if(!head.includes('%PDF-'))throw Error('This file does not appear to be a PDF.');
}
async function save(id,file,{allowDifferentName=false,replace=false}={}){
 const record=entryFor(id);
 if(!record)throw Error('The publication is not listed in this Library.');
 if(!fileMatch(file,record)&&!allowDifferentName)
   throw Error('PDF filename does not match this publication. Choose the correct book or confirm the edition.');
 await checkPDF(file);
 if(!replace&&await get(id))throw Error('This PDF is already saved; remove it before replacing.');
 if(navigator.storage?.estimate){
  const {quota,usage}=await navigator.storage.estimate();
  if(quota&&usage&&quota-usage<file.size*1.12)throw Error('Not enough device storage. Free space before saving.');
 }
 await transaction('readwrite',store=>store.put({
  blob:file,name:file.name,storedAt:Date.now(),size:file.size
 },key(id)));
 const found=await get(id);
 if(!found||found.blob?.size!==file.size)throw Error('PDF save could not be confirmed. Try again.');
 return found;
}
async function get(id){
 if(!entryFor(id))return null;
 return transaction('readonly',store=>store.get(key(id)));
}
async function remove(id){
 if(!entryFor(id))throw Error('Unknown PDF');
 await transaction('readwrite',store=>store.delete(key(id)));
}
async function list(){
 const results={};
 // Cursor reads metadata and Blob references; it does not convert PDF bytes to ArrayBuffers.
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB,1);
  req.onerror=()=>reject(req.error||Error('Storage unavailable'));
  req.onupgradeneeded=()=>{
    if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE);
  };
  req.onsuccess=()=>{
   const db=req.result,tx=db.transaction(STORE,'readonly'),cursor=tx.objectStore(STORE).openCursor();
   cursor.onsuccess=()=>{
    const item=cursor.result;
    if(!item)return;
    const id=String(item.key).replace(/^drive-/,'');
    const value=item.value;
    if(entryFor(id)&&value?.blob instanceof Blob){
      results[id]={name:value.name||'Saved PDF',size:value.blob.size,storedAt:value.storedAt||value.savedAt||0};
    }
    item.continue();
   };
   tx.oncomplete=()=>{db.close();resolve(results)};
   tx.onerror=()=>{db.close();reject(tx.error||Error('Storage listing failed'))};
  };
 });
}
async function requestDurableStorage(){
 try{return await navigator.storage?.persist?.()===true}catch{return false}
}
async function rendererReady(){
 if(!('caches' in window))return false;
 try{
  const cache=await caches.open(PDFJS_CACHE);
  return (await Promise.all(RENDERER.map(url=>cache.match(url)))).every(Boolean);
 }catch{return false}
}
async function prepareRenderer(){
 if(!('caches' in window))throw Error('This mobile browser does not support offline application caching.');
 const cache=await caches.open(PDFJS_CACHE);
 for(const url of RENDERER){
  if(await cache.match(url))continue;
  let result;
  try{result=await fetch(url,{mode:'cors',credentials:'omit',cache:'no-store'})}
  catch{throw Error('Connect to the internet to prepare the offline PDF reader.')}
  if(!result.ok||result.type==='opaque')throw Error('PDF reader download was blocked by this browser.');
  await cache.put(url,result);
 }
 if(!await rendererReady())throw Error('PDF reader could not be saved for offline use.');
 return true;
}
function exportCopy(data,filename){
 if(!data?.blob)throw Error('No PDF is stored.');
 const url=URL.createObjectURL(data.blob),a=document.createElement('a');
 a.href=url;a.download=filename||data.name||'reference.pdf';
 a.style.display='none';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),10000);
}
window.PWDOfflineLibrary={
 DB,STORE,PDFJS_CACHE,RENDERER,normalized,fileMatch,checkPDF,
 get,save,remove,list,prepareRenderer,rendererReady,requestDurableStorage,exportCopy
};
})();