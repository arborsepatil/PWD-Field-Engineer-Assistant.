/* Private, optional on-device attachment for a PDF already indexed in Drive.
 * No cloud API, no original PDF bytes in the public app. Each publication gets
 * its own IndexedDB key. Clearing app storage also clears saved copies.
 */
(function(){
'use strict';
const DB='pwd-private-library-pdfs-v1',STORE='files',MAX=160*1024*1024;
function record(mode,action){
 if(!('indexedDB' in window))return Promise.reject(new Error('Local storage unavailable'));
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};
  req.onerror=()=>reject(req.error||new Error('Cannot open private storage'));
  req.onsuccess=()=>{
   const db=req.result;
   try{
    const tx=db.transaction(STORE,mode),op=action(tx.objectStore(STORE));
    let value;
    op.onsuccess=()=>value=op.result;
    tx.oncomplete=()=>{db.close();resolve(value)};
    tx.onerror=()=>{db.close();reject(tx.error||new Error('Private storage error'))};
    tx.onabort=()=>{db.close();reject(tx.error||new Error('Private storage aborted'))};
   }catch(e){db.close();reject(e)}
  };
 });
}
function message(head,sub){
 const target=document.getElementById('privatePdfStatus');
 if(!target)return;
 target.textContent=head;
 if(sub){const note=document.createElement('small');note.textContent=sub;target.appendChild(note)}
}
async function looksLikePDF(file){
 if(!file||file.size<100||file.size>MAX)throw new Error('Choose a PDF file under 160 MB');
 const bytes=new Uint8Array(await file.slice(0,1024).arrayBuffer());
 const prefix=String.fromCharCode(...bytes.slice(0,100));
 if(!prefix.includes('%PDF-'))throw new Error('Selected file does not have a PDF header');
}
window.PWDLibraryPrivatePDF={
 setup({key,onSource}){
  if(!/^drive-[A-Za-z0-9_-]{15,}$/.test(key))throw new Error('Unknown private book key');
  const input=document.getElementById('privatePdfFile');
  const remove=document.getElementById('forgetPrivatePdf');
  document.getElementById('privateBar').classList.add('visible');
  let blobURL=null,version=0,disposed=false;
  async function present(blob,name,saved,myVersion){
   if(disposed||myVersion!==version)return;
   const url=URL.createObjectURL(blob);
   try{await onSource(url,blob)}catch(e){message('Unable to render PDF',e.message||String(e))}
   if(disposed||myVersion!==version){URL.revokeObjectURL(url);return}
   if(blobURL)URL.revokeObjectURL(blobURL);
   blobURL=url;
   remove.hidden=false;
   message(saved?'Private PDF restored':'PDF selected for this device',
     name+' · original document identity not verified · no upload');
  }
  async function restore(){
   const v=version;
   try{
    const saved=await record('readonly',store=>store.get(key));
    if(v!==version||disposed)return;
    if(saved&&saved.blob instanceof Blob){
      await present(saved.blob,saved.name||'Private PDF',true,v);
    }else message('Drive preview active','Select your PDF for offline use on this device');
   }catch{
    if(v===version&&!disposed)message('Drive preview active','On-device storage unavailable; use Drive or select a PDF');
   }
  }
  input.addEventListener('change',async()=>{
   const file=input.files?.[0];input.value='';
   if(!file)return;
   const v=++version;
   try{
    await looksLikePDF(file);
    if(v!==version||disposed)return;
    await present(file,file.name,false,v);
    if(v!==version||disposed)return;
    try{
      await record('readwrite',store=>store.put({blob:file,name:file.name,storedAt:Date.now()},key));
      if(v===version&&!disposed)message('PDF saved privately on this device',
        file.name+' · identity not independently verified · no upload');
    }catch(e){
      if(v===version&&!disposed)message('PDF open for this session',file.name+' · device could not save offline copy');
    }
   }catch(e){
    if(v===version&&!disposed)message('Could not open PDF',e.message||String(e));
   }
  });
  remove.addEventListener('click',async()=>{
   const v=++version;
   if(blobURL)URL.revokeObjectURL(blobURL);
   blobURL=null;remove.hidden=true;
   try{await onSource(null,null)}catch{}
   try{
     await record('readwrite',store=>store.delete(key));
     if(v===version&&!disposed)message('On-device PDF removed','Drive preview active for this publication');
   }catch{
     if(v===version&&!disposed)message('Removal could not be confirmed','Current view cleared; check browser site storage');
   }
  });
  restore();
  return {dispose(){disposed=true;if(blobURL)URL.revokeObjectURL(blobURL)}};
 }
};
})();