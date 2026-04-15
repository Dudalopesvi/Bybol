function irPara(nome_pagina) {
    if(nome_pagina == 'home'){
        window.location.href = '/src/private/home.html'
    }

    if(nome_pagina == 'login'){
        window.location.href = '/src/public/login/login.html'
    }
    if(nome_pagina == 'readme'){
        window.location.href = '/src/components/readme.html'
    }

    window.location.href = pagina;
  }
  
  function mostrarTela(id) {
    const telas = ["telaInicial", "telaCriarConta", "telaLogin", "telaAnonimo"];
    telas.forEach(t => {
      const el = document.getElementById(t);
      if (el) el.classList.toggle("hidden", t !== id);
    });
  }