

let login = document.getElementById("login");
let senha = document.getElementById("senha");


const url = "https://openlibrary.org/search.json?q=the+lord+of+the+rings"

async function imformação_Livros() {
    const resposta = await fetch("https://viacep.com.br/ws/88132857/json/")
    const dados = await resposta.json()
    console.log("exercicio 1 ", dados)
}


function cadastrar() {
    let usuario = { login: login.value, senha: senha.value }
    usuarios.push(usuario)
    alert("usuário cadastrado com sucesso!")
    localStorage.setItem("usuarios", JSON.stringify(usuarios))

}

function acessar() {

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].login == login.value && usuarios[i].senha == senha.value) {
            alert("Bem vindo")
        }

    }
}
let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")


function Salvar() {

    let usuario = document.getElementById("usuarios").value
    let senha = document.getElementById("senha").value

    let conta = {
        usuario: usuario,
        senha: senha
    }

    usuarios.push(usuario);

    alert("Cadastro realizado com sucesso!")
    mostrarareadeLogin()
    mostrarareadecriarconta()
    mostrarareadeExplorar()
    mostrarareadeModoAnônimo()
    acessar()

    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}

function mostrarareadeLogin() {

    document.getElementById("Login1").classList.remove("hidden")
    document.getElementById("CriarConta1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("ModoAnônimo1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
    document.getElementById("acessar1").classList.remove("hidden")
    document.getElementById("footer1").classList.add("hidden")
}

function mostrarareadecriarconta() {

    document.getElementById("CriarConta1").classList.remove("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("ModoAnônimo1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
    document.getElementById("acessar1").classList.remove("hidden")
    document.getElementById("footer1").classList.add("hidden")
}


function mostrarareadeExplorar() {

    document.getElementById("Explorar1").classList.remove("hidden")
    document.getElementById("CriarConta1").classList.add("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("ModoAnônimo1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
    document.getElementById("acessar1").classList.remove("hidden")
    document.getElementById("livros").classList.remove("hidden")
    document.getElementById("footer1").classList.add("hidden")
}



function mostrarareadeModoAnônimo() {

    document.getElementById("ModoAnônimo1").classList.remove("hidden")
    document.getElementById("CriarConta1").classList.add("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
    document.getElementById("acessar1").classList.remove("hidden")
    document.getElementById("footer1").classList.add("hidden")

}

function acessaraparecer() {
    document.getElementById("acessar1").classList.remove("hidden")
    document.getElementById("CriarConta1").classList.add("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
     document.getElementById("footer1").classList.add("hidden")

}

senha   .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        acessar();
    }});
login   .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        acessar();
    }});
document.getElementById("senhadocriarconta").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        Salvar();
    }});
document.getElementById("nomecriaronta").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        Salvar();
    }});                
document.getElementById("emailaocriar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        Salvar();
    }   });             
document.getElementById("usuarios").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        Salvar();
    }});    
document.getElementById("senha").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        Salvar();
    }});


    function showAlert() {
        document.getElementById("custom-alert").style.display = "block";
      }
      
      function closeAlert() {
        document.getElementById("custom-alert").style.display = "none";
      }

      // Buscar livros na API dBooks
async function buscarLivros(termo) {
    const res = await fetch(`https://www.dbooks.org/api/search/${termo}`);
    const data = await res.json();
    return data.books;
  }
  
  // Mostrar livros
  async function pesquisar() {
    const termo = document.getElementById("inputBusca").value.trim();
    const container = document.getElementById("livros");
    const msg = document.getElementById("mensagem");
  
    container.innerHTML = "";
    msg.textContent = "";
  
    if (!termo) {
      msg.textContent = "Digite algo para pesquisar.";
      return;
    }
  
    msg.textContent = "Procurando livros...";
  
    const livros = await buscarLivros(termo);
  
    if (!livros || livros.length === 0) {
      msg.textContent = "Nenhum livro encontrado.";
      return;
    }
  
    msg.textContent = "";
  
    livros.forEach(livro => {
      const div = document.createElement("div");
      div.className = "livro";
  
      div.innerHTML = `
        <img src="${livro.image}" alt="${livro.title}">
        <h3>${livro.title}</h3>
        <p>${livro.authors}</p>
      `;
  
      container.appendChild(div);
    });
  }
  
  // Ativar botão de pesquisa
  document.getElementById("btnPesquisar").addEventListener("click", pesquisar);
  
  // Pesquisar ao pressionar Enter
  document.getElementById("inputBusca").addEventListener("keypress", function(e) {
    if (e.key === "Enter") pesquisar();
  });
  
      