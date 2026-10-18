/* Original PWD bridge PDFs are not uploaded or served by this app.
   Only a file explicitly chosen on this device may be stored in this browser's IndexedDB. */
(function(){
'use strict';
const DB='pwd-private-bridge-sources-v1',STORE='originals',MAX=160*1024*1024;
function storage(mode,action){
 if(typeof indexedDB==='undefined')return Promise.reject(new Error('On-device storage unavailable'));
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};
  req.onerror=()=>reject(req.error||new Error('Cannot open device storage'));
  req.onsuccess=()=>{
   const db=req.result;let result;
   try{
    const tx=db.transaction(STORE,mode),op=action(tx.objectStore(STORE));
    op.onsuccess=()=>result=op.result;
    tx.oncomplete=()=>{db.close();resolve(result)};
    tx.onerror=()=>{db.close();reject(tx.error||new Error('Device storage failed'))};
    tx.onabort=()=>{db.close();reject(tx.error||new Error('Device storage cancelled'))};
   }catch(e){db.close();reject(e)}
  };
 });
}
function setStatus(message,detail){
 const target=document.getElementById('privatePdfStatus');
 if(!target)return;
 target.textContent=message;
 if(detail){const s=document.createElement('small');s.textContent=detail;target.appendChild(s)}
}
function validFile(file,year){
 if(!file||file.size>MAX||file.size<100)throw new Error('Select an original PDF under 160 MB');
 const y=file.name.match(/(?:19|20)\d{2}/g)||[];
 if(y.length&&!y.includes(year))throw new Error('The filename belongs to a different publication year');
}
async function hasPdfHeader(file){
 const buf=await file.slice(0,1024).arrayBuffer();
 const a=new Uint8Array(buf);
 let text='';
 for(let i=0;i<Math.min(a.length,100);i++)text+=String.fromCharCode(a[i]);
 return text.includes('%PDF-');
}
window.PWDBridgeLocalSource={
  setup({key,year,onSource}){
   if(!['bridge2002','bridge2023'].includes(key))throw new Error('Unrecognized publication');
   const input=document.getElementById('privatePdfFile'),clear=document.getElementById('forgetPrivatePdf');
   document.getElementById('privateBar').classList.add('visible');
   let localURL=null,localBlob=null,sourceName=null,generation=0,disposed=false;
   async function activate(blob,name,persisted,version){
     if(disposed||version!==generation)return 'cancelled';
     const candidate=URL.createObjectURL(blob);
     let outcome;
     try{
       outcome=await onSource(candidate,blob);
     }catch(e){
       outcome={verification:'unverified',reason:e.message||String(e)};
     }
     if(disposed||version!==generation){
       URL.revokeObjectURL(candidate);
       return 'cancelled';
     }
     const result=outcome?.verification||'unverified';
     if(result==='mismatch'){
       URL.revokeObjectURL(candidate);
       // Never replace a previously accepted book with a mismatched publication.
       try{await onSource(localURL,localBlob)}catch{}
       clear.hidden=!localURL;
       setStatus('Wrong original PDF — not saved',
         outcome?.reason||'This file does not have the expected PDF page count for this book.');
       return 'mismatch';
     }
     if(localURL)URL.revokeObjectURL(localURL);
     localURL=candidate;localBlob=blob;sourceName=name;
     clear.hidden=false;
     if(result==='matched'){
       setStatus(persisted?'Private PDF restored and page count checked':'PDF page count checked',
         name+' · page-count match is not proof of drawing identity · no upload');
       return 'matched';
     }
     setStatus('Native PDF fallback · page count unconfirmed',
       name+' · do not rely on exact-page jumps · not saved on new import');
     return 'unverified';
   }
   async function restore(){
     const version=generation;
     try{
       const saved=await storage('readonly',store=>store.get(key));
       if(disposed||version!==generation)return;
       if(saved?.blob instanceof Blob){
         const result=await activate(saved.blob,saved.name||'Original PDF',true,version);
         if(result==='mismatch'&&version===generation){
           try{await storage('readwrite',store=>store.delete(key))}catch{}
         }
       }else{
         setStatus('Drive preview active','Choose the correct original PDF to view it on this device');
       }
     }catch{
       if(!disposed&&version===generation)
         setStatus('Drive preview active','On-device storage unavailable; choose a PDF for this session');
     }
   }
   input.addEventListener('change',async()=>{
     const file=input.files?.[0];
     input.value='';
     if(!file)return;
     const version=++generation;
     try{
       validFile(file,year);
       if(!(await hasPdfHeader(file)))throw new Error('Selected file does not appear to be a PDF');
       if(version!==generation||disposed)return;
       const result=await activate(file,file.name,false,version);
       if(result!=='matched'||version!==generation||disposed)return;
       try{
         await storage('readwrite',store=>store.put({
           blob:file,name:file.name,publication:year,savedAt:Date.now()
         },key));
         if(version===generation&&!disposed)
           setStatus('Private PDF saved on this device',
             file.name+' · correct page count, original drawing identity not certified · no upload');
       }catch{
         if(version===generation&&!disposed)
           setStatus('Private PDF open for this session',file.name+' · device saving failed');
       }
     }catch(e){
       if(version===generation&&!disposed)setStatus('Could not open that PDF',e.message);
     }
   });
   clear.addEventListener('click',async()=>{
     const version=++generation;
     if(localURL)URL.revokeObjectURL(localURL);
     localURL=null;localBlob=null;sourceName=null;clear.hidden=true;
     try{await onSource(null,null)}catch{}
     try{
       await storage('readwrite',store=>store.delete(key));
       if(version===generation&&!disposed)
         setStatus('Private PDF cleared','Drive preview active; this book’s copy was removed from this browser');
     }catch{
       if(version===generation&&!disposed)
         setStatus('Device removal could not be confirmed','Current view cleared; check device storage settings');
     }
   });
   restore();
   return {dispose(){
     disposed=true;
     if(localURL)URL.revokeObjectURL(localURL);
   }};
  }
};
})();
