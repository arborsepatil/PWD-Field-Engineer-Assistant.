/** V21 final navigation and profile de-clutter regression.
 * Exercises the real Profile script without depending on a browser, keeping
 * the user's saved JE fields but dropping duplicate/development controls.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const home=read('index.html'),profile=read('profile.html'),settings=read('settings.html');
assert.match(home,/<h1>Tools<\/h1>/,'Home must have a meaningful accessible heading');
assert.equal((home.match(/class="tool-row"/g)||[]).length,8);
assert.equal((home.match(/<nav class="bottom-nav"/g)||[]).length,1);
for(const dead of ['pwd_recent_tools','recentText','being built','still being built','this public PWA','quick calculator and cache management','<section class="profile-grid">']){
 assert.ok(!profile.includes(dead),'Profile contains discarded tool/development wording: '+dead);
}
for(const needed of ['id="editProfile"','id="pName"','id="pDesignation"','id="pOffice"','id="avatar"','Profile information is stored on this device']){
 assert.ok(profile.includes(needed),'Profile editor or local privacy notice missing: '+needed);
}
assert.ok(settings.includes('href="./profile.html"'),'Profile remains reachable from Settings');
assert.ok(profile.includes('href="./index.html"'),'Profile returns to Home');
assert.ok(!home.includes('href="./profile.html"'),'Do not create competing Home navigation');
const script=profile.split('<script src="./app-shell.js"></script><script>')[1]?.split('</script>')[0];
assert.ok(script,'Profile script missing');
new vm.Script(script,{filename:'profile inline script'});
const storeData=new Map([['pwd_profile',JSON.stringify({name:'Sample Engineer',designation:'Junior Engineer',office:'Sub Division'})]]);
const localStorage={
 getItem:k=>storeData.has(k)?storeData.get(k):null,
 setItem:(k,v)=>storeData.set(k,v)
};
const globals={
 localStorage,
 pName:{textContent:''},pDesignation:{textContent:''},
 pOffice:{textContent:''},avatar:{textContent:''},
 editProfile:{onclick:null},
 prompt:(label,def)=>label.startsWith('Display name')?'Edited Engineer':def
};
vm.runInNewContext(script,globals,{filename:'profile inline script'});
assert.equal(globals.pName.textContent,'Sample Engineer');
assert.equal(globals.pOffice.textContent,'Sub Division');
assert.equal(globals.avatar.textContent,'SE');
assert.equal(typeof globals.editProfile.onclick,'function','Edit action must remain functional');
globals.editProfile.onclick();
assert.equal(globals.pName.textContent,'Edited Engineer');
assert.equal(JSON.parse(storeData.get('pwd_profile')).name,'Edited Engineer');
assert.equal(storeData.has('pwd_recent_tools'),false,'Profile should not track redundant recents');
console.log('V21 UX PASS: accessible eight-tool Home, concise editable JE Profile, no duplicate links/recents or development text.');
