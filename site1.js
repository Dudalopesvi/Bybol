
let login = document.getElementById("login")

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

mostrarareadeLogin()
function mudarpraoutratela() {

    document.getElementById("Criarconta").classList.add("hidden")
    document.getElementById("login").classList.remove("hidden")

}

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
}

function mostrarareadeLogin() {

    document.getElementById("Criarconta").classList.remove("hidden")
    document.getElementById("login").classList.add("hidden")

    let corpotabela = document.getElementById("corpo");
    corpotabela.innerHTML = ""
    for (let i = 0; i < usuarios.length; i++) {
        const linha = document.createElement("tr")

    }
}

