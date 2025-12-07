// Formata CPF enquanto o usuário digita (000.000.000-00)
const cpfInput = document.getElementById('cpf');
const feedback = document.getElementById('feedback');

const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const copyDigitsBtn = document.getElementById('copyDigitsBtn');

function onlyDigits(v) { return v.replace(/\D/g, '') }

function formatCPF(v) {
  const d = onlyDigits(v).slice(0, 11);
  let out = d;
  if (d.length > 3) out = d.slice(0, 3) + '.' + d.slice(3);
  if (d.length > 6) out = d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6);
  if (d.length > 9) out = d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9);
  return out;
}

cpfInput.addEventListener('input', (e) => {
  const pos = cpfInput.selectionStart;
  const old = cpfInput.value;
  cpfInput.value = formatCPF(old);
  // keep caret at end (simpler):
  cpfInput.selectionStart = cpfInput.selectionEnd = cpfInput.value.length;
  // live validation hint (not final)
  const digits = onlyDigits(cpfInput.value);
  if (digits.length === 11) {
    showValidationResult(validateCPF(digits));
  } else {
    clearFeedback();
  }
});


clearBtn.addEventListener('click', () => {
  cpfInput.value = '';
  clearFeedback();
  cpfInput.focus();
});

copyBtn.addEventListener('click', async () => {
  const val = cpfInput.value.trim();
  if (!val) { showMessage('Nada para copiar. Preencha o CPF primeiro.', 'error'); return; }
  try { await navigator.clipboard.writeText(val); showMessage('CPF formatado copiado para a área de transferência.', 'success'); }
  catch (e) { showMessage('Não foi possível copiar (restrição do navegador).', 'error'); }
});

copyDigitsBtn.addEventListener('click', async () => {
  const digits = onlyDigits(cpfInput.value);
  if (!digits) { showMessage('Nada para copiar. Preencha o CPF primeiro.', 'error'); return; }
  try { await navigator.clipboard.writeText(digits); showMessage('CPF (só dígitos) copiado para a área de transferência.', 'success'); }
  catch (e) { showMessage('Não foi possível copiar (restrição do navegador).', 'error'); }
});

function showMessage(text, kind) {
  feedback.style.display = 'block';
  feedback.textContent = text;
  feedback.className = 'msg ' + (kind === 'success' ? 'success' : 'error');
  feedback.dataset.type = kind;
}
function clearFeedback() { feedback.style.display = 'none'; feedback.textContent = ''; feedback.className = 'msg'; }

function showValidationResult(valid) {
  if (valid) { showMessage('CPF válido ✅', 'success'); }
  else { showMessage('CPF inválido ✖️', 'error'); }
}

function validateCPF(cpf) {

  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^([0-9])\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i), 10) * (10 - i);
    let r = sum % 11;
  let d1 = (r < 2) ? 0 : 11 - r;
  if (d1 !== parseInt(cpf.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i), 10) * (11 - i);
    r = sum % 11;
  let d2 = (r < 2) ? 0 : 11 - r;
  if (d2 !== parseInt(cpf.charAt(10), 10)) return false;

  return true;
}

