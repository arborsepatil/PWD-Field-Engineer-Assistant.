/* V37: calculator restoration, precision, domain safety, and Android packaging contract. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const {calculate:c}=require('../pwd-calculator-core.js');
const close=(actual,wanted,tol=1e-10)=>assert.ok(Math.abs(actual-wanted)<=tol,actual+' ≠ '+wanted);
assert.equal(c('150+25'),175);
assert.equal(c('9−4×2'),1);
assert.equal(c('(2+3)×5'),25);
assert.equal(c('16÷4'),4);
assert.equal(c('200×10%'),20);
assert.equal(c('50%'),.5);
assert.equal(c('2^3^2'),512);
assert.equal(c('-2^2'),-4);
assert.equal(c('2^-2'),.25);
assert.equal(c('sqrt(81)'),9);
assert.equal(c('√(81)'),9);
assert.equal(c('(-2)^2'),4);
assert.equal(c('abs(-6)'),6);
assert.equal(c('log(100)'),2);
assert.equal(c('ln(e)'),1);
assert.equal(c('1e3+2'),1002);
close(c('sin(30)'),.5);
close(c('cos(90)'),0);
close(c('tan(45)'),1);
close(c('asin(0.5)'),30);
close(c('acos(0.5)'),60);
close(c('atan(1)'),45);
close(c('sin(pi/2)','rad'),1);
close(c('asin(1)','rad'),Math.PI/2);
close(c('2×pi'),2*Math.PI);
close(c('1/3'),1/3);
for(const input of ['1/0','sqrt(-1)','log(0)','asin(2)','tan(90)','bad(2)','2++','(','1+','2/**3','3))','Math.random()','1;alert(1)']){
 assert.throws(()=>c(input),undefined,'Must reject: '+input);
}
assert.throws(()=>c('9','grads'));
assert.throws(()=>c('9'.repeat(181)));
const file=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=file('pwd_calculators_converters.html');
const home=file('index.html');
const ui=file('pwd-calculator-ui.js');
for(const id of ['calculator','calcExpression','calcResult','calcEngineeringPad','calcAngle','units','geometry','civil','ucat','uval','ufrom','uto','allout','areaShapes','volumeShapes','earthInputs','chout','surveyOut']){
 assert.ok(html.includes('id="'+id+'"'),'Missing calculator/civil id '+id);
}
for(const src of ['pwd-unit-data.js','pwd-calculator-core.js','pwd-calculator-ui.js']){
 assert.ok(html.includes('src="./'+src+'"'),'Missing local offline script '+src);
}
assert.match(html,/data-calc-mode="basic"/);
assert.match(html,/data-calc-mode="engineering"/);
assert.match(html,/data-calc-token="sin\("/);
assert.match(html,/data-calc-action="equal"/);
assert.ok(home.includes('href="./pwd_calculators_converters.html"'),'Existing Home route must remain');
assert.ok(!home.includes('id="pwdCalcFab"'),'No floating calculator reinstated');
assert.doesNotMatch(file('pwd-calculator-core.js'),/\beval\s*\(|\bnew Function\b/);
assert.match(ui,/navigator\.clipboard/);
assert.match(file('android/scripts/prepare_assets.py'),/EXTENSIONS =/);
assert.ok(!file('android/scripts/prepare_assets.py').includes('"pwd-calculator-core.js"'),'Calculator must be included in APK');
console.log('V37 CALCULATOR PASS: basic, engineering, angle modes, safe parsing, compact 4-tab UI, Android asset packaging.');
