/** V20 Home + inside-tools UX regression.
 * The user's marked screen recording preferred the eight compact tool rows.
 * Clutter is removed, but the real engineering inputs, original sources,
 * warnings, and the native Android build must remain functional.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const home=read('index.html'),shared=read('app-shell.js');
const compact=[['Batch Assistant','pwd_mix_batch_assistant.html'],['Retaining Walls','pwd_retaining_walls.html'],['Steel Table','pwd_steel_table.html'],['Units & Civil Quick','pwd_calculators_converters.html'],['Mix Design','pwd_concrete_mix_design.html'],['Bridge Plans','pwd_bridge_plans.html'],['SSR Master','library.html?section=ssr'],['Library','library.html']];
const rows=[...home.matchAll(/<a class="tool-row"[^>]*>/g)].map(x=>x[0]);
assert.equal(rows.length,compact.length,'exactly the eight marked tool routes');
for(const [name,route] of compact){
 const matched=rows.filter(x=>x.includes('data-tool-name="'+name.replace('Units & Civil Quick','Units')+'"')||x.includes('href="./'+route+'"'));
 assert.equal(matched.length,1,'One route per real tool: '+name);
 assert.ok(home.includes('href="./'+route+'"'),name+' remains accessible from Home');
 const file=route.split('?')[0];assert.ok(fs.existsSync(path.join(root,file)),'Missing linked module: '+file);
}
for(const removed of ['id="recentGrid"','id="mainModules"','id="moduleSearch"','id="searchTop"','id="pwdCalcFab"','class="fab-stack"','id="installHelp"','id="install"','Good morning!','Rate engine pending','Five sections']){
 assert.ok(!home.includes(removed),'Home still shows rejected/duplicate item: '+removed);
}
assert.ok(home.includes('<details class="home-guidance">'),'Engineering boundary must stay accessible, not vanish');
assert.ok(home.includes('approved drawings'),'Source warning must not disappear entirely');
assert.equal((home.match(/class="bottom-nav"/g)||[]).length,1);
for(const file of ['index.html','settings.html','profile.html']){
 const text=read(file);assert.ok(text.includes('href="./library.html"'),'Library link required: '+file);
 assert.ok(text.includes('href="./settings.html"'),'Settings link required: '+file);
 assert.ok(!text.includes('href="./index.html#tools"'),'Home and Tools are now a single destination');
}
assert.ok(!shared.includes('pwdCalcFab'),'Global floating calculator must not reappear');
assert.ok(!shared.includes('openCalc'),'Dead calculator overlay controller should be removed');
assert.ok(shared.includes('loadMoRTHExtensions'),'MoRTH module loading must survive UI cleanup');
new vm.Script(shared,{filename:'app-shell.js'});
for(const file of ['pwd_mix_batch_assistant.html','pwd_concrete_mix_design.html']){
 const html=read(file),prefix=file.includes('mix_batch')?'batch':'mix';
 const target=prefix==='batch'?'batchInputHelp':'mixInputHelp';
 assert.ok(html.includes('id="'+target+'"'),'Optional input guidance toggle required');
 assert.ok(html.includes('.effect{display:none}'),'Repeated field effect notes hidden by default');
 assert.ok(html.includes('classList.toggle('),'Input help toggle must do actual work');
 assert.ok(html.includes('Show input guidance')&&html.includes('Hide input guidance'));
}
const batch=read('pwd_mix_batch_assistant.html');
for(const id of ['qCat','qItem','qQty','qUnit','aCat','aItem','aBasis','qOut'])assert.ok(batch.includes('id="'+id+'"'),'Batch field preserved '+id);
assert.ok(batch.includes('Engineering checks & notes'),'Keep the actual engineering guidance');
const mix=read('pwd_concrete_mix_design.html');
for(const id of ['inputCard','grade','ctype','exposure','slump','nmas'])assert.ok(mix.includes('id="'+id+'"'),'Mix design field preserved '+id);
assert.ok(mix.includes('Supported scope:')&&mix.includes('M10–M60'),'Mix safety scope visible');
const calc=read('pwd_calculators_converters.html');
for(const id of ['ucat','uval','ufrom','uto','allout','unitFilter','areaShapes','volumeShapes','earthInputs','chout','surveyOut'])assert.ok(calc.includes('id="'+id+'"'),'Civil tool preserved '+id);
assert.ok(calc.includes('<details class="all-units-details">'),'Long unit conversion list opens on demand');
const steel=read('pwd_steel_table.html');
for(const id of ['steelFamilies','steelSeries','steelSearch','steelLength','steelCountPieces','steelRate','outKg','outMethod','steelStandardsDisclosure','steelDataCaution'])assert.ok(steel.includes('id="'+id+'"'),'Steel calculator/safety data intact: '+id);
assert.equal((steel.match(/<h1>Steel Table<\/h1>/g)||[]).length,0,'No duplicate large steel title');
const lib=read('library.html');
for(const id of ['libSearch','bookGrid','libraryTabs','bulkImport','prepareOfflineReader','offlineOne','offlineMany','showOfflineOnly'])assert.ok(lib.includes('id="'+id+'"'),'Library browsing/storage intact: '+id);
assert.ok(lib.includes('Source and edition information'),'Library source risks remain accessible');
for(const file of ['pwd_bridge_plans.html','bridge_book_2002.html','bridge_book_2023.html']){
 const html=read(file);
 assert.ok(html.includes('<details'),'Source coverage instructions are discoverable: '+file);
 assert.ok(!html.includes('‹ Three Books'),'Only two bridge books are listed');
 assert.ok(!html.includes('SHEET QA PENDING')&&!html.includes('LEGACY · SHEET QA PENDING'),'Hide development badges: '+file);
}
const wall=read('pwd_retaining_walls.html'),pcc=read('pwd_retaining_wall_section_quantity.html'),rcc=read('pwd_rcc_wall_reference.html');
assert.ok(wall.includes('pwd_retaining_wall_section_quantity.html')&&wall.includes('pwd_rcc_wall_reference.html'),'Both wall modes retained');
assert.ok(wall.includes('Site check required'),'Structural warning visible');
assert.ok(pcc.indexOf('id="inputCard"')<pcc.indexOf('Related original return-wall drawings'),'PCC inputs appear before optional related drawings');
for(const id of ['rccSbc','rccHeight','rccLength','rccResult'])assert.ok(rcc.includes('id="'+id+'"'),'RCC original source lookup preserved: '+id);
assert.ok(!read('settings.html').includes('id="calcToggle"'),'Retired overlay setting hidden');
console.log('V20 UI PASS: single eight-tool Home, no floating overlay, 9 simplified nested screens, all engineering inputs and source cautions preserved.');
