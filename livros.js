// ===========================
    // PESQUISAR LIVROS
    // ===========================
    async function buscarLivros(termo) {
        try {
          const urlOriginal = `https://www.dbooks.org/api/search/${encodeURIComponent(termo)}`;
          const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(urlOriginal)}`;
          const res = await fetch(proxy);
          const data = await res.json();
          const conteudo = JSON.parse(data.contents);
          return conteudo.books || [];
        } catch (e) {
          console.error("Erro ao buscar:", e);
          return [];
        }
      }
  
      async function pesquisar() {
        const termo = document.getElementById("PesquisarDoExporar").value.trim();
        const loading = document.getElementById("loading");
        const track = document.getElementById("carousel-track");
  
        track.innerHTML = "";
        if (termo === "") {
          track.innerHTML = "<p>Digite algo para pesquisar.</p>";
          return;
        }
  
        loading.style.display = "block";
        const livros = await buscarLivros(termo);
        loading.style.display = "none";
  
        if (!livros || livros.length === 0) {
          track.innerHTML = "<p>Nenhum livro encontrado.</p>";
          return;
        }
  
        livros.forEach(livro => {
          const card = document.createElement("div");
          card.className = "livro";
          card.innerHTML = `
            <img src="${livro.image}" alt="${livro.title}">
            <h3>${livro.title}</h3>
            <p>${livro.authors || "Autor desconhecido"}</p>
            <a href="https://www.dbooks.org/${livro.id}/" target="_blank">Ver livro</a>
          `;
          track.appendChild(card);
        });
      }
  
      document.getElementById("btnPesquisar").addEventListener("click", pesquisar);
      document.getElementById("PesquisarDoExporar").addEventListener("keypress", (e) => {
        if (e.key === "Enter") pesquisar();
      });