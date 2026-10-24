/* Offline expression engine for Basic / Engineering calculator.
   Only explicitly recognised operators and functions are parsed; no eval. */
(function (root) {
  'use strict';
  const FUNCTIONS = new Set(['sin','cos','tan','asin','acos','atan','sqrt','log','ln','abs']);
  function tokens(source) {
    let input=String(source??'').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/\s+/g,'');
    if(input.length>180) throw Error('Expression is too long');
    if(!input) throw Error('Enter a calculation');
    const out=[];
    while(input) {
      let match=input.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
      if(match) {
        const n=Number(match[0]);
        if(!Number.isFinite(n)) throw Error('Number is too large');
        out.push({type:'number',value:n}); input=input.slice(match[0].length);continue;
      }
      match=input.match(/^[a-z]+/i);
      if(match) {
        const name=match[0].toLowerCase();
        if(!FUNCTIONS.has(name)&&name!=='pi'&&name!=='e') throw Error('Unknown function: '+name);
        out.push({type:'name',value:name});input=input.slice(match[0].length);continue;
      }
      const c=input[0];
      if('+-*/^()%'.includes(c)){out.push({type:'symbol',value:c});input=input.slice(1);continue;}
      throw Error('Unsupported character: '+c);
    }
    return out;
  }
  function calculate(input,angle='deg') {
    if(angle!=='deg'&&angle!=='rad') throw Error('Invalid angle mode');
    const parts=tokens(input);let pos=0;
    const peek=()=>parts[pos]?.value;
    const consume=()=>parts[pos++];
    function need(symbol) {
      if(peek()!==symbol) throw Error('Missing '+symbol);
      consume();
    }
    function checked(value) {
      if(!Number.isFinite(value)) throw Error('Result is undefined or too large');
      return value;
    }
    function call(name,x) {
      const rad=angle==='deg'?x*Math.PI/180:x;
      switch(name){
        case 'sin': {const n=Math.sin(rad);return Math.abs(n)<1e-14?0:n;}
        case 'cos': {const n=Math.cos(rad);return Math.abs(n)<1e-14?0:n;}
        case 'tan': if(Math.abs(Math.cos(rad))<1e-12) throw Error('Tangent is undefined at this angle');return Math.tan(rad);
        case 'asin': case 'acos':
          if(x < -1 || x > 1) throw Error('Inverse trig input must be between −1 and 1');
          return (name==='asin'?Math.asin(x):Math.acos(x))*(angle==='deg'?180/Math.PI:1);
        case 'atan': return Math.atan(x)*(angle==='deg'?180/Math.PI:1);
        case 'sqrt': if(x<0) throw Error('Square root requires a non-negative number');return Math.sqrt(x);
        case 'log': case 'ln':
          if(x<=0) throw Error('Logarithm requires a positive number');
          return name==='log'?Math.log10(x):Math.log(x);
        case 'abs': return Math.abs(x);
      }
      throw Error('Unsupported function');
    }
    function prefix() {
      const t=consume();
      if(!t) throw Error('Incomplete calculation');
      if(t.type==='number') return t.value;
      if(t.value==='(') {const n=parse(0);need(')');return n;}
      if(t.value==='+') return parse(25);
      if(t.value==='-') return -parse(25);
      if(t.type==='name'){
        if(t.value==='pi') return Math.PI;
        if(t.value==='e') return Math.E;
        need('(');const n=parse(0);need(')');
        return checked(call(t.value,n));
      }
      throw Error('Expected a number or function');
    }
    const precedence={'+':10,'-':10,'*':20,'/':20,'^':30};
    function parse(min) {
      let lhs=prefix();
      while(pos<parts.length){
        if(peek()==='%') {
          if(40<min) break;
          consume();lhs=checked(lhs/100);continue;
        }
        const op=peek(),bp=precedence[op];
        if(bp===undefined||bp<min) break;
        consume();
        const rhs=parse(op==='^'?bp:bp+1);
        if(op==='+') lhs=checked(lhs+rhs);
        if(op==='-') lhs=checked(lhs-rhs);
        if(op==='*') lhs=checked(lhs*rhs);
        if(op==='/') {if(rhs===0) throw Error('Cannot divide by zero');lhs=checked(lhs/rhs);}
        if(op==='^') lhs=checked(Math.pow(lhs,rhs));
      }
      return lhs;
    }
    const result=checked(parse(0));
    if(pos!==parts.length) throw Error('Unexpected input near '+peek());
    return Number(result.toPrecision(12));
  }
  const api=Object.freeze({calculate});
  root.PWDCalculator=api;
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
