

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
   
}

function mostrarareadecriarconta() {

    document.getElementById("CriarConta1").classList.remove("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("ModoAnônimo1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
    document.getElementById("acessar1").classList.remove("hidden")

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

}



function mostrarareadeModoAnônimo() {

    document.getElementById("ModoAnônimo1").classList.remove("hidden")
    document.getElementById("CriarConta1").classList.add("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
    document.getElementById("acessar1").classList.remove("hidden")


}

function acessaraparecer() {
    document.getElementById("acessar1").classList.remove("hidden")
    document.getElementById("CriarConta1").classList.add("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
    document.getElementById("livros").classList.remove("hidden")


}

senha.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        acessar();
    }});
login.addEventListener("keyup", function (event) {
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


// ================================
// Código Alternativo com Carrossel
// ================================


const input = document.getElementById("PesquisarDoExporar");
const botao = document.getElementById("btnPesquisar");
const loading = document.getElementById("loading");
const track = document.getElementById("carousel-track");

document.getElementById("toggleDark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// =========================== SETAS DO CARROSSEL ===========================
const carousel = document.getElementById("carousel-track");
document.getElementById("arrow-left").addEventListener("click",()=>{ carousel.scrollBy({left:-200, behavior:'smooth'}); });
document.getElementById("arrow-right").addEventListener("click",()=>{ carousel.scrollBy({left:200, behavior:'smooth'}); });
