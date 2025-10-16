
let login = document.getElementById("login");

let senha = document.getElementById("senha");

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
   
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}

function mostrarareadeLogin() {

    document.getElementById("Login1").classList.remove("hidden")
    document.getElementById("CriarConta1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("ModoAnônimo1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
  
}

function mostrarareadecriarconta() {

    document.getElementById("CriarConta1").classList.remove("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("ModoAnônimo1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")

}


function mostrarareadeExplorar() {

    document.getElementById("Explorar1").classList.remove("hidden")
    document.getElementById("CriarConta1").classList.add("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("ModoAnônimo1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
}



function mostrarareadeModoAnônimo() {

    document.getElementById("ModoAnônimo1").classList.remove("hidden")
    document.getElementById("CriarConta1").classList.add("hidden")
    document.getElementById("Login1").classList.add("hidden")
    document.getElementById("Explorar1").classList.add("hidden")
    document.getElementById("botõess").classList.add("hidden")
    document.getElementById("apresentação").classList.add("hidden")
 
}

function acessar (){
 document.getElementById("b_acessar").classList.remove("hidden")   
}