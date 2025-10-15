
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

    document.getElementById("login").classList.remove("hidden")
    document.getElementById("Criarconta").classList.add("hidden")
    document.getElementById("explorar").classList.add("hidden")
    document.getElementById("ModoAnônimo").classList.add("hidden")
}

function mostrarareadecriarconta() {

    document.getElementById("Criarconta").classList.remove("hidden")
    document.getElementById("logi").classList.add("hidden")
    document.getElementById("explorar").classList.add("hidden")
    document.getElementById("ModoAnônimo").classList.add("hidden")
}


function mostrarareadeExplorar() {

    document.getElementById("Explorar").classList.remove("hidden")
    document.getElementById("Criarconta").classList.add("hidden")
    document.getElementById("login").classList.add("hidden")
    document.getElementById("ModoAnônimo").classList.add("hidden")
}



function mostrarareadeModoAnônimo() {

    document.getElementById("ModoAnônimo").classList.remove("hidden")
    document.getElementById("Criarconta").classList.add("hidden")
    document.getElementById("login").classList.add("hidden")
    document.getElementById("ModoAnônimo").classList.add("hidden")
}

