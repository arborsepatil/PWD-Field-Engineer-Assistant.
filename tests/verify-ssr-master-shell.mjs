/* SSR Master public-shell staging gate: source data stays owner-private. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8');
const hub=read('ssr_master.html'),home=read('index.html'),lib=read('library.html'),sw=read('sw.js'),android=read('android/scripts/prepare_assets.py');
assert.ok(home.includes('id="ssr" href="./ssr_master.html"'),'Home does not open SSR Master');
assert.ok(lib.includes('id="digitalSSR"')&&lib.includes('href="./ssr_master.html"'),'Library SSR Master link missing');
assert.ok(lib.includes('href="./ssr_search.html"'),'Legacy private Excel index must remain accessible');
assert.ok(sw.includes("'./ssr_master.html'"),'SSR Master must be cached offline');
assert.ok(hub.includes('href="./ssr_search.html"'),'Existing local SSR Excel search missing');
for(const x of ['Items & rates','Notes, GR','Rate annexures','Material lead charges','Consumption library','QC & testing charges']){
 assert.ok(hub.toLowerCase().includes(x.toLowerCase()),'Missing SSR workspace '+x);
}
const tasks=[...hub.matchAll(/class="ssr-number">(\d\d)<\/span>/g)].map(x=>x[1]);
assert.deepEqual(tasks,['01','02','03','04','05','06'],'SSR tasks must show all six');
assert.equal((hub.match(/aria-disabled="true"/g)||[]).length,5,'Unbundled private source modules must not advertise clickable broken links');
assert.ok(!hub.includes('href="./ssr_task4_lead.html"'),'Do not link to excluded private lead module in public app');
assert.ok(!hub.includes('href="./ssr_task5_consumption.html"'),'Do not link to excluded private consumption module');
assert.ok(!hub.includes('href="./ssr_task6_qc.html"'),'Do not link to excluded private QC module');
assert.ok(/no consumption mapping is engineer-approved/i.test(hub),'Missing engineering approval boundary');
for(const marker of ['ssr-private-data.js','ssr_task4_lead.html','ssr_task5_consumption.html','ssr_task6_qc.html']){
 assert.ok(!sw.includes("'./"+marker+"'"),'Private module illegally precached: '+marker);
}
assert.ok(android.includes('EXCLUDED'),'Android public asset scoping regressed');
assert.ok(!/<script[^>]+ssr-private-data\.js/.test(hub),'Private SSR source bundle must not be embedded in public code');
console.log('SSR Master public staging PASS: 6 tasks, offline shell, private-source isolation, current Excel search retained.');
