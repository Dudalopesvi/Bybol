// ============================================================
// BYBOL — livros.js
// Só define buscarLivros(). Os listeners ficam no site3.js.
// ============================================================

async function buscarLivros(termo) {
  try {
    const urlOriginal = `https://www.dbooks.org/api/search/${encodeURIComponent(termo)}`;
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(urlOriginal)}`;
    const res = await fetch(proxy);
    const data = await res.json();
    const conteudo = JSON.parse(data.contents);
    return conteudo.books || [];
  } catch (e) {
    console.error("Erro ao buscar livros:", e);
    return [];
  }
}