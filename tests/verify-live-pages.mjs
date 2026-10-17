/**
 * Verify the published Pages release, not merely the GitHub checkout.
 * Usage: node tests/verify-live-pages.mjs https://owner.github.io/repo/
 * Checks every service-worker pre-cache asset plus the service worker itself.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const input=process.argv[2]||process.env.PAGES_URL;
assert.ok(input,'Provide the published Pages base URL');
const base=new URL(input.endsWith('/')?input:input+'/');
const loopback=['localhost','127.0.0.1','[::1]'].includes(base.hostname);
assert.ok(base.protocol==='https:'||(loopback&&base.protocol==='http:'),'Expected HTTPS Pages URL');
assert.ok(base.pathname.endsWith('/'),'Expected directory URL with trailing slash');

const localSW=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const config=vm.runInNewContext(localSW+'\n({CACHE,SHELL})',{
  self:{addEventListener(){}}
},{timeout:1000});
const expectedCache=config.CACHE;
const shell=Array.from(config.SHELL);
assert.ok(typeof expectedCache==='string'&&expectedCache.length>0,'Missing local cache version');
assert.ok(shell.length>0&&shell.length===new Set(shell).size,'Invalid offline asset list');

async function request(relative,{attempts=4,delay=750}={}){
  const target=new URL(relative,base);
  assert.ok(target.origin===base.origin&&target.pathname.startsWith(base.pathname),'Asset escaped published app scope: '+relative);
  let lastError;
  for(let attempt=1;attempt<=attempts;attempt++){
    try{
      const response=await fetch(target,{redirect:'follow',cache:'no-store',signal:AbortSignal.timeout(15000)});
      assert.ok(response.ok,relative+' returned HTTP '+response.status);
      const landed=new URL(response.url);
      assert.ok(landed.origin===base.origin&&landed.pathname.startsWith(base.pathname),relative+' redirected outside app scope');
      const contentType=response.headers.get('content-type')||'';
      const body=Buffer.from(await response.arrayBuffer());
      assert.ok(body.length>0,relative+' is empty');
      const sample=body.subarray(0,512).toString('utf8').trimStart();
      const path=target.pathname.toLowerCase();
      if(/\.(js|css|json|svg|png|jpe?g|webp)$/.test(path)){
        assert.ok(!/^<!doctype\s+html|^<html\b/i.test(sample),relative+' returned HTML instead of an asset');
      }
      if(path.endsWith('.js')) assert.match(contentType,/javascript|ecmascript|text\/plain/i,relative+' unexpected JS content-type: '+contentType);
      if(path.endsWith('.css')) assert.match(contentType,/text\/css/i,relative+' unexpected CSS content-type: '+contentType);
      if(path.endsWith('.json')) JSON.parse(body.toString('utf8'));
      if(path.endsWith('.html')||relative==='./') assert.match(sample,/^<!doctype\s+html|^<html\b/i,relative+' not an HTML page');
      return body.toString('utf8');
    }catch(err){lastError=err;if(attempt<attempts)await new Promise(resolve=>setTimeout(resolve,delay*attempt));}
  }
  throw new Error(relative+': '+lastError.message);
}

// GitHub Pages may still serve the previous release briefly after deployment.
const remoteSW=await request('./sw.js',{attempts:6,delay:1000});
assert.ok(remoteSW.includes("const CACHE='"+expectedCache+"'"),
  'Live service worker is not the deployed cache version '+expectedCache);

const errors=[];
const queue=[...shell];
const concurrency=Math.min(6,queue.length);
let verified=0;
await Promise.all(Array.from({length:concurrency},async()=>{
  while(queue.length){
    const asset=queue.shift();
    try{await request(asset);verified++;}catch(err){errors.push(err.message);}
  }
}));
if(errors.length)throw new Error('Published assets missing or invalid:\n'+errors.join('\n'));
process.stdout.write('Published PWA release verified: '+verified+'/'+shell.length+' offline assets, cache '+expectedCache+'\n');
