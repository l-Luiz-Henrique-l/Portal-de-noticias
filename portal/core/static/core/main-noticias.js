// ================= FUNÇÃO CSRF =================
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getCSRFToken() {
    return getCookie('csrftoken');
}

// ================= CRUD NOTÍCIAS =================
const formNoticia = document.getElementById('form-noticia');
const ulNoticias = document.getElementById('noticias-list');
const navNoticias = document.getElementById('nav-noticias');
const btnSalvar = document.getElementById('btn-salvar-noticia');

console.log("🔎 btnSalvar encontrado?", btnSalvar);

if (btnSalvar) {
    btnSalvar.addEventListener('click', async () => {
        console.log("✅ Clique detectado");

        const formData = new FormData(formNoticia);
        const data = Object.fromEntries(formData.entries());

        // ❌ Remove o CSRF do corpo do POST
        delete data.csrfmiddlewaretoken;

        const id = data.id; 
        if (!id) delete data.id;

        console.log("🔹 Dados enviados:", data);

        let url = '/api/noticias/';
        let method = 'POST';
        if (id) { method='PATCH'; url+=`${id}/`; delete data.id; }

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            if (res.ok) {
                formNoticia.reset();
                document.getElementById('noticia-id').value = '';
                fetchNoticias();
            } else {
                const errData = await res.json().catch(()=>({}));
                alert('Erro ao salvar notícia: ' + (errData.detail || res.statusText));
            }
        } catch (err) {
            console.error("Erro no fetch:", err);
        }
    });
}

async function fetchNoticias(url='/api/noticias/') {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) { 
        ulNoticias.innerHTML = '<li>Erro ao carregar notícias</li>'; 
        return; 
    }
    const data = await res.json();
    ulNoticias.innerHTML = '';
    const noticias = Array.isArray(data) ? data : data.results || [];

    noticias.forEach(n => {
        const li = document.createElement('li');
        li.innerHTML = `
    <div>
        <strong>${n.titulo}</strong> 
        <em>(${n.categoria_nome || "Sem categoria"})</em>: 
        ${n.conteudo.substring(0, 60)}...
        <button class="edit">Editar</button>
        <button class="del">Excluir</button>
    </div>
`;
        li.querySelector('.edit').onclick = () => {
            document.getElementById('noticia-id').value = n.id;
            formNoticia.titulo.value = n.titulo;
            formNoticia.conteudo.value = n.conteudo;
            formNoticia.categoria.value = n.categoria || "";
        };
        li.querySelector('.del').onclick = async () => {
            if (!confirm(`Deseja excluir "${n.titulo}"?`)) return;
            const resDel = await fetch(`/api/noticias/${n.id}/`, {
                method: 'DELETE',
                headers: { 'X-CSRFToken': getCSRFToken() },
                credentials: 'include'
            });
            if (resDel.ok) fetchNoticias();
            else alert('Erro ao excluir notícia');
        };
        ulNoticias.appendChild(li);
    });

    async function carregarCategorias() {
    const res = await fetch('/api/categorias/');
    if (!res.ok) return;
    const categorias = await res.json();

    const select = document.getElementById('select-categoria');
    select.innerHTML = '<option value="">Selecione uma categoria</option>';

    categorias.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;       // id da categoria
        opt.textContent = cat.nome; // nome visível
        select.appendChild(opt);
    });
}

// chama ao carregar a página
carregarCategorias();


    // Paginação
    navNoticias.innerHTML = '';
    if (data.previous) { 
        const prev = document.createElement('button'); 
        prev.textContent='Anterior'; 
        prev.onclick=()=>fetchNoticias(data.previous); 
        navNoticias.appendChild(prev);
    }
    if (data.next) { 
        const next = document.createElement('button'); 
        next.textContent='Próxima'; 
        next.onclick=()=>fetchNoticias(data.next); 
        navNoticias.appendChild(next);
    }
}

// Chama ao carregar a página
fetchNoticias();
