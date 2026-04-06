// ============================================================
// BYBOL — site2.js (home/dashboard)
// ============================================================

const usuario = localStorage.getItem("bybol_usuario");

// ── Saudação ───────────────────────────────────────────────
const nomeEl     = document.getElementById("nomeUsuario");
const saudacaoEl = document.getElementById("saudacao");
if (usuario) {
  if (nomeEl)     nomeEl.textContent     = `Olá, ${usuario}`;
  if (saudacaoEl) saudacaoEl.textContent = `Bem-vindo(a) de volta, ${usuario}!`;
}

// ── Favoritos ──────────────────────────────────────────────
function carregarFavoritos() {
  const lista    = document.getElementById("listaFavoritos");
  const semFavs  = document.getElementById("semFavoritos");
  const wrapper  = document.querySelector(".carousel-wrapper");
  const favoritos = JSON.parse(localStorage.getItem("bybol_favoritos") || "[]");

  if (!favoritos.length) {
    wrapper.style.display  = "none";
    semFavs.style.display  = "block";
    return;
  }

  wrapper.style.display  = "";
  semFavs.style.display  = "none";
  lista.innerHTML        = "";

  favoritos.forEach(livro => {
    const card = document.createElement("div");
    card.className = "livro";

    const img = document.createElement("img");
    img.src = livro.image || "";
    img.alt = livro.title || "Livro";

    const titulo = document.createElement("h3");
    titulo.textContent = livro.title || "Sem título";

    const autor = document.createElement("p");
    autor.textContent = livro.authors || "Autor desconhecido";

    const link = document.createElement("a");
    link.href = `https://www.dbooks.org/${livro.id}/`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Ver livro";

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "✕ Remover";
    btnRemover.className = "btn-remover";
    btnRemover.onclick = () => {
      let favs = JSON.parse(localStorage.getItem("bybol_favoritos") || "[]");
      favs = favs.filter(l => l.id !== livro.id);
      localStorage.setItem("bybol_favoritos", JSON.stringify(favs));
      carregarFavoritos();
    };

    card.append(img, titulo, autor, link, btnRemover);
    lista.appendChild(card);
  });
}

// ── Setas do carrossel ─────────────────────────────────────
const lista = document.getElementById("listaFavoritos");
document.getElementById("arrow-left")
  .addEventListener("click", () => lista.scrollBy({ left: -220, behavior: "smooth" }));
document.getElementById("arrow-right")
  .addEventListener("click", () => lista.scrollBy({ left: 220, behavior: "smooth" }));

// ── Logout ─────────────────────────────────────────────────
function logout() {
  localStorage.removeItem("bybol_usuario");
  window.location.href = "site1.html";
}
window.logout = logout;

// ── Dark mode ──────────────────────────────────────────────
document.getElementById("toggleDark")
  .addEventListener("click", () => document.body.classList.toggle("dark"));

// ── Init ───────────────────────────────────────────────────
carregarFavoritos();