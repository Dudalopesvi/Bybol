// ============================================================
// BYBOL — readme.js (explorar)
// ============================================================

// ── Navbar dinâmica ────────────────────────────────────────
const usuario = localStorage.getItem("bybol_usuario");
if (usuario) {
  document.getElementById("nomeUsuario").textContent = `Olá, ${usuario}`;
  document.getElementById("btnLogout").style.display = "";
}

function logout() {
  localStorage.removeItem("bybol_usuario");
  window.location.href = "src/pubic/login/login.html";
}
window.logout = logout;

// ── Setas do carrossel ─────────────────────────────────────
const track = document.getElementById("carousel-track");
document.getElementById("arrow-left")
  .addEventListener("click", () => track.scrollBy({ left: -220, behavior: "smooth" }));
document.getElementById("arrow-right")
  .addEventListener("click", () => track.scrollBy({ left: 220, behavior: "smooth" }));

// ── Favoritos ──────────────────────────────────────────────
function getFavs()      { return JSON.parse(localStorage.getItem("bybol_favoritos") || "[]"); }
function isFav(id)      { return getFavs().some(l => l.id === id); }

function toggleFav(livro, btn) {
  let favs = getFavs();
  if (isFav(livro.id)) {
    favs = favs.filter(l => l.id !== livro.id);
    btn.textContent = "☆ Favoritar";
    btn.classList.remove("favoritado");
  } else {
    favs.push(livro);
    btn.textContent = "★ Favoritado";
    btn.classList.add("favoritado");
  }
  localStorage.setItem("bybol_favoritos", JSON.stringify(favs));
}

// ── Pesquisa ───────────────────────────────────────────────
async function pesquisar() {
  const termo   = document.getElementById("PesquisarDoExporar").value.trim();
  const loading = document.getElementById("loading");

  track.innerHTML = "";
  if (!termo) { track.innerHTML = "<p>Digite algo para pesquisar.</p>"; return; }

  loading.style.display = "block";
  const livros = await buscarLivros(termo);   // definido em livros.js
  loading.style.display = "none";

  if (!livros.length) { track.innerHTML = "<p>Nenhum livro encontrado.</p>"; return; }

  livros.forEach(livro => {
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

    const btnFav = document.createElement("button");
    btnFav.textContent = isFav(livro.id) ? "★ Favoritado" : "☆ Favoritar";
    btnFav.className = "btn-favoritar" + (isFav(livro.id) ? " favoritado" : "");
    btnFav.onclick = () => toggleFav(livro, btnFav);

    card.append(img, titulo, autor, link, btnFav);
    track.appendChild(card);
  });
}

// ── Listeners de pesquisa ──────────────────────────────────
document.getElementById("btnPesquisar")
  .addEventListener("click", pesquisar);
document.getElementById("PesquisarDoExporar")
  .addEventListener("keypress", e => { if (e.key === "Enter") pesquisar(); });

// ── Dark mode ──────────────────────────────────────────────
document.getElementById("toggleDark")
  .addEventListener("click", () => document.body.classList.toggle("dark"));