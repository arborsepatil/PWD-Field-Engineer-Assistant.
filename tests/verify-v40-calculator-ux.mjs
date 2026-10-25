/* V40 — calculator interaction and Civil tab UX; engineering formula sources remain unchanged. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const html=read('pwd_calculators_converters.html');
const styles=read('civil-calculator-v40.css');
const script=read('pwd-calculator-ui.js');
const oldRoutes=['calculator','units','geometry','civil'];
for(const id of oldRoutes)assert.ok(html.includes('id="'+id+'"'),'Missing tab '+id);
assert.ok(html.includes('class="calc-v40"'));
assert.ok(html.includes('src="./pwd-calculator-ui.js"'));
assert.ok(html.includes('src="./pwd-calculator-core.js"'));
assert.ok(html.includes('href="./civil-calculator-v40.css"'));
assert.ok(html.includes('<title>Calculator & Civil · CivilBandhu</title>'));
assert.ok(!html.includes('‹ PWD Tools'),'Old header should be gone');
assert.match(styles,/\.calc-v40 \.calc-answer output/);
assert.match(styles,/font-size:clamp\(26px,7vw,36px\)/);
assert.ok(read('sw.js').includes("'./civil-calculator-v40.css'"),'Offline stylesheet missing');
assert.ok(read('android/scripts/prepare_assets.py').includes('".css"'));
for(const id of ['ucat','uval','ufrom','uto','allout','areaShapes','volumeShapes','earthInputs','chout','surveyOut','rise','run','ch1','ch2']){
  assert.ok(html.includes('id="'+id+'"'),'Lost existing converter input '+id);
}
assert.ok(html.includes('Start chainage (km+m)'));
assert.ok(html.includes('Horizontal run (same unit)'));
assert.ok(html.includes('id="calcKeyboard"'));
assert.ok(html.includes('aria-pressed="true">Calc</button>'));
assert.equal((html.match(/class="panel(?: active)?"/g)||[]).length,4);
assert.ok(!read('index.html').includes('id="pwdCalcFab"'),'No floating calculator');

function element(options={}){
 const events={};const attributes=new Map(Object.entries(options.attributes||{}));
 const node={dataset:options.dataset||{},value:options.value||'',textContent:'',inputMode:'none',
  hidden:!!options.hidden,selectionStart:0,selectionEnd:0,focused:false,
  getAttribute:n=>attributes.get(n)??null,setAttribute:(n,v)=>attributes.set(n,String(v)),
  addEventListener:(name,cb)=>{events[name]=cb;},
  emit:(name,p={})=>{if(!events[name])throw Error('No listener '+name);return events[name](p);},
  setSelectionRange:(a,b)=>{node.selectionStart=a;node.selectionEnd=b;},
  focus:()=>{node.focused=true;},blur:()=>{node.focused=false;},
  classList:{toggle:()=>{},add:()=>{},remove:()=>{}}
 };
 return node;
}
const values=Object.fromEntries(['calcExpression','calcResult','calcMessage','calcEngineeringPad','calcAngle','calcKeyboard','calcInputHint'].map(x=>[x,element()]));
values.calcKeyboard.setAttribute('aria-pressed','false');
values.calcEngineeringPad.hidden=true;values.calcAngle.hidden=true;
const tokenMap=Object.fromEntries(['0','1','2','3','7','8','9','+','−','×','÷','(','π','sin(',')'].map(x=>[x,element({dataset:{calcToken:x}})]));
const actionMap=Object.fromEntries(['clear','back','equal','negate','square','reciprocal','ans','copy'].map(x=>[x,element({dataset:{calcAction:x}})]));
const modes=['basic','engineering'].map(value=>element({dataset:{calcMode:value}}));
const document={getElementById:id=>values[id],querySelectorAll:s=>{
 if(s==='[data-calc-token]')return Object.values(tokenMap);
 if(s==='[data-calc-action]')return Object.values(actionMap);
 if(s==='[data-calc-mode]')return modes;
 throw Error('Unexpected selector '+s);
}};
const clipboardTexts=[];
const core=require('../pwd-calculator-core.js');
const context={window:{PWDCalculator:core},PWDCalculator:core,document,navigator:{clipboard:{writeText:async s=>{clipboardTexts.push(s);}}}};
vm.runInNewContext(script,context,{filename:'pwd-calculator-ui.js'});
const press=(name)=>tokenMap[name].emit('click');
const act=(name)=>actionMap[name].emit('click');
press('1');press('2');press('×');press('3');
assert.equal(values.calcExpression.value,'12×3');act('equal');assert.equal(values.calcResult.textContent,'36');
press('−');press('1');act('equal');assert.equal(values.calcResult.textContent,'35','Continuing from last answer must work');
act('clear');
values.calcExpression.value='12+3';values.calcExpression.setSelectionRange(2,2);
press('9');assert.equal(values.calcExpression.value,'129+3','Insert at cursor');
act('back');assert.equal(values.calcExpression.value,'12+3','Backspace removes char before cursor');
values.calcExpression.setSelectionRange(2,3);press('×');assert.equal(values.calcExpression.value,'12×3','Overwrite selected operator');
act('equal');assert.equal(values.calcResult.textContent,'36');
act('clear');assert.equal(values.calcResult.textContent,'0');assert.equal(values.calcResult.dataset.error,'false');
modes[1].emit('click');assert.equal(values.calcEngineeringPad.hidden,false);assert.equal(values.calcAngle.hidden,false);
values.calcAngle.emit('click');assert.equal(values.calcAngle.textContent,'RAD');
values.calcExpression.value='sin(pi/2)';values.calcExpression.emit('input');
assert.equal(values.calcResult.textContent,'1','Radian conversion must remain correct');
values.calcKeyboard.emit('click');
assert.equal(values.calcExpression.inputMode,'text');
assert.equal(values.calcKeyboard.getAttribute('aria-pressed'),'true');
assert.equal(values.calcExpression.focused,true);
values.calcKeyboard.emit('click');assert.equal(values.calcExpression.inputMode,'none');assert.equal(values.calcExpression.focused,false);
values.calcExpression.value='1÷0';values.calcExpression.emit('input');
act('equal');assert.equal(values.calcResult.textContent,'Error');assert.match(values.calcMessage.textContent,/divide by zero/);
values.calcExpression.value='';values.calcExpression.emit('input');assert.equal(values.calcResult.dataset.error,'false');
assert.ok(script.includes('selectionStart')&&script.includes('setSelectionRange'));
console.log('V40 CALCULATOR PASS: source-preserving UI, cursor insert/delete, input keyboard toggle, errors, DEG/RAD, calculator + civil tabs.');
