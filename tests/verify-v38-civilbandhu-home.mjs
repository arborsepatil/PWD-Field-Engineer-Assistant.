/* CivilBandhu V38: name, logo, single eight-row list, Android launcher and old routes. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const home=read('index.html');
const names=['Calculator & Civil','Concrete Batch','Steel Table','Retaining Wall',
 'Concrete Mix Design','SSR & Rates','Bridge References','Technical Library'];
const routes=['pwd_calculators_converters.html','pwd_mix_batch_assistant.html',
 'pwd_steel_table.html','pwd_retaining_walls.html','pwd_concrete_mix_design.html',
 'library.html?section=ssr','pwd_bridge_plans.html','library.html'];
const icons=['calculator','batch','steel','wall','mix','ssr','bridge','library'];
assert.ok(home.includes('<title>CivilBandhu · Field Engineering Toolkit</title>'));
assert.ok(home.includes('Civil<span>Bandhu</span>'));
assert.ok(home.includes('home-v38.css'));
const rows=[...home.matchAll(/<a class="tool-row"[^>]*>[\s\S]*?<\/a>/g)].map(x=>x[0]);
assert.equal(rows.length,8,'Eight tools exactly; not seven, nine or duplicate modules');
for(let i=0;i<8;i++){
 assert.ok(rows[i].includes('<b>'+names[i]+'</b>'),'Wrong order/name at '+i);
 assert.ok(rows[i].includes('href="./'+routes[i]+'"'),'Existing route changed at '+i);
 assert.ok(rows[i].includes('data-tool-icon="'+icons[i]+'"'),'Expected exact engineering icon');
 assert.ok(rows[i].includes('<svg viewBox="0 0 24 24" aria-hidden="true"'));
 assert.ok(fs.existsSync(path.join(root,routes[i].split('?')[0])),'Missing old engineering module');
}
assert.equal(new Set(routes).size,8);
assert.ok(!home.includes('<h2>Daily Site Tools</h2>')&&!home.includes('<h2>Design & Reference</h2>'));
assert.equal((home.match(/class="tools-list"/g)||[]).length,1);
for(const obsolete of ['id="pwdCalcFab"','class="fab-stack"','id="recentGrid"','id="mainModules"','id="moduleSearch"']){
 assert.ok(!home.includes(obsolete),'Rejected clutter returned: '+obsolete);
}
assert.ok(home.includes('approved drawings'),'Engineering warning not deleted');
const manifest=JSON.parse(read('manifest.json'));
assert.equal(manifest.short_name,'CivilBandhu');
assert.ok(manifest.name.includes('CivilBandhu'));
assert.equal(manifest.start_url,'./index.html');
const launcher=read('android/app/src/main/res/drawable/ic_pwd.xml');
const logo=read('icon.svg');
assert.ok(launcher.includes('#174F87')&&launcher.includes('#AEE8F3'));
assert.ok(logo.includes('CivilBandhu')&&logo.includes('viewBox="0 0 108 108"'));
assert.ok(read('android/app/src/main/res/values/strings.xml').includes('>CivilBandhu<'));
for(const name of ['settings.html','profile.html']){
 assert.ok(read(name).includes('Civil<span>Bandhu</span>'),'Inconsistent shared header '+name);
}
assert.ok(read('profile.html').includes('not an official departmental record'));
assert.ok(read('android/app/build.gradle').includes("applicationId 'in.pwdtools.fieldassistant'"),
 'Keep existing Android package identity for updates');
assert.ok(read('android/scripts/prepare_assets.py').includes('generate_civilbandhu_icons.py'));
assert.ok(read('scripts/prepare_public_site.py').includes('generate_civilbandhu_icons.py'));
assert.ok(read('sw.js').includes('home-v38.css'));
assert.ok(read('sw.js').includes('pwd-tools-steel-v54-2026-10-25'));
const destination=fs.mkdtempSync(path.join(os.tmpdir(),'civilbandhu-icons-'));
try{
 const process=spawnSync('python3',[path.join(root,'scripts/generate_civilbandhu_icons.py'),destination],{encoding:'utf8',timeout:90000});
 assert.equal(process.status,0,'PNG generation failed: '+process.stderr);
 for(const n of [192,512]){
  const bytes=fs.readFileSync(path.join(destination,'icon-'+n+'.png'));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16),n);
  assert.equal(bytes.readUInt32BE(20),n);
  assert.ok(bytes.length>500,'Logo unexpectedly blank');
 }
}finally{fs.rmSync(destination,{recursive:true,force:true});}
console.log('V38 HOME PASS: CivilBandhu brand, launcher and fresh PNGs, unique icons, ordered eight routes, no extra groups.');
