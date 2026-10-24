/* Dedicated keypad inside the existing Calculators page; no floating overlay. */
(()=>{
  'use strict';
  const expression=document.getElementById('calcExpression');
  if(!expression||!window.PWDCalculator) return;
  const result=document.getElementById('calcResult');
  const message=document.getElementById('calcMessage');
  const engineeringPad=document.getElementById('calcEngineeringPad');
  const angleButton=document.getElementById('calcAngle');
  const modeButtons=[...document.querySelectorAll('[data-calc-mode]')];
  let angle='deg',lastAnswer=null,solved=false;

  function format(x) {
    if(Object.is(x,-0)) return '0';
    return String(x);
  }
  function render(strict=false) {
    const value=expression.value.trim();
    if(!value){result.textContent='0';message.textContent='';return null;}
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
  function addToken(token) {
    if(solved) {
      if(/^[+\-×÷^%]/.test(token)) expression.value=String(lastAnswer??'');
      else expression.value='';
    }
    solved=false;
    // Make 2π, 2sin(30), 2(5) and (1+2)(3+4) explicit multiplication.
    if((token==='π'||token==='e'||token.endsWith('('))&&
      /(?:\d|[)%πe])$/.test(expression.value)) expression.value+='×';
    expression.value+=token;
    render();
  }
  function action(kind) {
    if(kind==='clear'){expression.value='';solved=false;render();return;}
    if(kind==='back'){expression.value=expression.value.slice(0,-1);solved=false;render();return;}
    if(kind==='negate'){
      const x=expression.value.trim();
      if(!x){expression.value='−';}
      else if(x.startsWith('−(')&&x.endsWith(')')) expression.value=x.slice(2,-1);
      else expression.value='−('+x+')';
      solved=false;render();return;
    }
    if(kind==='square'){
      const x=expression.value.trim();
      if(x) {expression.value='('+x+')^2';solved=false;render();}
      return;
    }
    if(kind==='reciprocal'){
      const x=expression.value.trim();
      if(x) {expression.value='1/('+x+')';solved=false;render();}
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
