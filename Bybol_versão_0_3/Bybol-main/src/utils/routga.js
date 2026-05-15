function irPara(nome_pagina) {
  if (nome_pagina == 'home')   { window.location.href = './Bybol_versão_0_3/Bybol-main/src/private/home.html';        return; }
  if (nome_pagina == 'login')  { window.location.href = './Bybol_versão_0_3/Bybol-main/src/public/login/login.html';  return; }
  if (nome_pagina == 'readme') { window.location.href = './Bybol_versão_0_3/Bybol-main/src/components/readme.html';   return; }
  if (nome_pagina == 'ia')     { window.location.href = './Bybol_versão_0_3/Bybol-main/src/utils/ia.html';            return; }
  window.location.href = nome_pagina;
}

function mostrarTela(id) {
  const telas = ["telaInicial", "telaCriarConta", "telaLogin", "telaAnonimo"];
  telas.forEach(t => {
    const el = document.getElementById(t);
    if (el) el.classList.toggle("hidden", t !== id);
  });
}
