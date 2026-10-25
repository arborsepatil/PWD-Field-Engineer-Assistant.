/* Dedicated keypad inside the existing Calculators page; no floating overlay. */
(()=>{
  'use strict';
  const expression=document.getElementById('calcExpression');
  if(!expression||!window.PWDCalculator) return;
  const result=document.getElementById('calcResult');
  const message=document.getElementById('calcMessage');
  const engineeringPad=document.getElementById('calcEngineeringPad');
  const angleButton=document.getElementById('calcAngle');
  const keyboardButton=document.getElementById('calcKeyboard');
  const inputHint=document.getElementById('calcInputHint');
  const modeButtons=[...document.querySelectorAll('[data-calc-mode]')];
  let angle='deg',lastAnswer=null,solved=false;

  function format(x) {
    if(Object.is(x,-0)) return '0';
    return String(x);
  }
  function render(strict=false) {
    const value=expression.value.trim();
    if(!value){result.textContent='0';result.dataset.error='false';message.textContent='';return null;}
    try {
      const n=PWDCalculator.calculate(value,angle);
      result.textContent=format(n);
      message.textContent='';
      result.dataset.error='false';
      if(strict){lastAnswer=n;solved=true;}
      return n;
    } catch(error) {
      result.textContent=strict?'Error':'…';
      result.dataset.error=String(strict);
      message.textContent=strict?error.message:'';
      solved=false;
      return null;
    }
  }
  // Place keypad input at the user's cursor, not always at the end.
  function caretAt(position) {
    if (typeof expression.setSelectionRange==='function') {
      expression.setSelectionRange(position,position);
    }
  }
  function selection() {
    const length=expression.value.length;
    const start=Number.isInteger(expression.selectionStart)?expression.selectionStart:length;
    const end=Number.isInteger(expression.selectionEnd)?expression.selectionEnd:start;
    return {start,end};
  }
  function addToken(token) {
    if(solved) {
      expression.value=/^[+−×÷^%]/.test(token)?String(lastAnswer??''):'';
      caretAt(expression.value.length);
    }
    solved=false;
    const {start,end}=selection();
    const left=expression.value.slice(0,start),right=expression.value.slice(end);
    // e.g. 2π, 2sin(30), and 2(5) need explicit multiplication.
    if ((token==='π'||token==='e'||token.startsWith('(')||token.endsWith('('))&&
        /(?:\d|[)%πe])$/.test(left)) token='×'+token;
    expression.value=left+token+right;
    caretAt(left.length+token.length);
    render();
  }
  function action(kind) {
    if(kind==='clear'){expression.value='';caretAt(0);solved=false;render();return;}
    if(kind==='back'){
      const {start,end}=selection(),left=expression.value.slice(0,start),right=expression.value.slice(end);
      expression.value=left.slice(0,start===end?-1:undefined)+right;
      caretAt(start===end?Math.max(0,start-1):start);
      solved=false;render();return;
    }
    if(kind==='negate'){
      const x=expression.value.trim();
      if(!x){expression.value='−';}
      else if(x.startsWith('−(')&&x.endsWith(')')) expression.value=x.slice(2,-1);
      else expression.value='−('+x+')';
      caretAt(expression.value.length);solved=false;render();return;
    }
    if(kind==='square'){
      const x=expression.value.trim();
      if(x) {expression.value='('+x+')^2';caretAt(expression.value.length);solved=false;render();}
      return;
    }
    if(kind==='reciprocal'){
      const x=expression.value.trim();
      if(x) {expression.value='1/('+x+')';caretAt(expression.value.length);solved=false;render();}
      return;
    }
    if(kind==='equal') {render(true);return;}
    if(kind==='ans') {
      if(lastAnswer===null){message.textContent='No previous answer';return;}
      addToken('('+format(lastAnswer)+')');return;
    }
    if(kind==='copy') {
      const n=render();
      if(n===null){message.textContent='Enter a valid calculation';return;}
      if(!navigator.clipboard?.writeText){message.textContent='Copy unavailable on this device';return;}
      navigator.clipboard.writeText(format(n)).then(()=>{message.textContent='Answer copied';}).catch(()=>{message.textContent='Copy unavailable on this device';});
    }
  }
  document.querySelectorAll('[data-calc-token]').forEach(button=>{
    button.addEventListener('click',()=>addToken(button.dataset.calcToken));
  });
  document.querySelectorAll('[data-calc-action]').forEach(button=>{
    button.addEventListener('click',()=>action(button.dataset.calcAction));
  });
  modeButtons.forEach(button=>button.addEventListener('click',()=>{
    const advanced=button.dataset.calcMode==='engineering';
    engineeringPad.hidden=!advanced;
    angleButton.hidden=!advanced;
    modeButtons.forEach(b=>{
      const active=b===button;b.classList.toggle('on',active);
      b.setAttribute('aria-pressed',String(active));
    });
  }));
  keyboardButton?.addEventListener('click',()=>{
    const enable=keyboardButton.getAttribute('aria-pressed')!=='true';
    keyboardButton.setAttribute('aria-pressed',String(enable));
    keyboardButton.textContent=enable?'Done typing':'Type expression';
    expression.inputMode=enable?'text':'none';
    inputHint.textContent=enable?'Keyboard editing enabled':'Use keypad · tap expression to position cursor';
    if(enable){expression.focus();caretAt(expression.value.length);}else{expression.blur();}
  });
  angleButton.addEventListener('click',()=>{
    angle=angle==='deg'?'rad':'deg';
    angleButton.textContent=angle==='deg'?'DEG':'RAD';
    angleButton.setAttribute('aria-label','Angle mode '+(angle==='deg'?'degrees':'radians'));
    solved=false;render();
  });
  expression.addEventListener('input',()=>{solved=false;render();});
  expression.addEventListener('keydown',event=>{
    if(event.key==='Enter'){event.preventDefault();action('equal');}
    if(event.key==='Escape'){event.preventDefault();action('clear');}
  });
  render();
})();
