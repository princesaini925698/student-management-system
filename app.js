const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let expression = '';

function updateDisplay(){
  display.textContent = expression || '0';
}

function appendValue(val){
  if (val === '.' && /\.[0-9]*$/.test(expression)) return; // prevent multiple decimals in a number
  expression += val;
  updateDisplay();
}

function clearAll(){ expression = ''; updateDisplay(); }

function deleteLast(){ expression = expression.slice(0, -1); updateDisplay(); }

function evaluateExpression(){
  if (!expression) return;
  try{
    // replace percent: number% -> (number/100)
    let expr = expression.replace(/%/g, '/100');
    // prevent unsafe chars
    if (/[^0-9.+\-*/()% ]/.test(expr)) throw new Error('Invalid characters');
    const result = Function('return ('+expr+')')();
    if (!isFinite(result)) throw new Error('Math error');
    expression = String(result);
    updateDisplay();
  }catch(e){
    expression = '';
    display.textContent = 'Error';
    setTimeout(()=>updateDisplay(),1500);
  }
}

buttons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const v = btn.dataset.value;
    const action = btn.dataset.action;
    if (action === 'clear') return clearAll();
    if (action === 'delete') return deleteLast();
    if (action === 'equals') return evaluateExpression();
    if (v) return appendValue(v);
  });
});

// Keyboard support
window.addEventListener('keydown', (e)=>{
  const key = e.key;
  if ((/^[0-9]$/.test(key)) || key === '.') { appendValue(key); return; }
  if (key === 'Enter') { e.preventDefault(); evaluateExpression(); return; }
  if (key === 'Backspace') { deleteLast(); return; }
  if (key === 'Delete') { clearAll(); return; }
  if (['+','-','*','/','%','(',')'].includes(key)) { appendValue(key); return; }
});
