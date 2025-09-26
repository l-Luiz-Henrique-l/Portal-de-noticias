// Função para pegar o CSRF Token
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

const csrftoken = getCookie('csrftoken');


// ================= LOGIN =================
const formLogin = document.getElementById('form-login');
const loginMsg = document.getElementById('login-msg');

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(formLogin);
        const data = Object.fromEntries(formData);

        const res = await fetch("/login/", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": csrftoken
            },
            body: new URLSearchParams(data),
            credentials: "include"
        });

        if (res.ok) {
            window.location.href = "/usuarios/";
        } else {
            loginMsg.textContent = "Usuário ou senha incorretos.";
        }
    });
}



// ================= LOGOUT =================
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        await fetch('/logout/', {
            method: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            credentials: 'include'
        });
        window.location.href = '/';
    });
}


// ================= CRUD USUÁRIOS =================
const form = document.getElementById('form-usuario');
const ul = document.getElementById('usuarios-list');
const nav = document.getElementById('nav');

async function fetchUsuarios(url='/api/usuarios/') {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) {
        ul.innerHTML = '<li>Erro ao carregar usuários</li>';
        return;
    }

    const data = await res.json();
    ul.innerHTML = '';

    const usuarios = data.results || data;

    usuarios.forEach(u => {
        const li = document.createElement('li');
        li.textContent = `${u.username} - ${u.email} `;

        // Botão Editar
        const btnEdit = document.createElement('button');
        btnEdit.textContent = 'Editar';
        btnEdit.onclick = () => {
            document.getElementById('usuario-id').value = u.id;
            form.username.value = u.username;
            form.email.value = u.email;
        };
        li.appendChild(btnEdit);

        // Botão Excluir
        const btnDel = document.createElement('button');
        btnDel.textContent = 'Excluir';
        btnDel.onclick = async () => {
            if (confirm(`Deseja realmente excluir ${u.username}?`)) {
                const res = await fetch(`/api/usuarios/${u.id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': csrftoken },
                    credentials: 'include'
                });
                if (res.ok) fetchUsuarios();
                else alert('Erro ao excluir usuário');
            }
        };
        li.appendChild(btnDel);

        ul.appendChild(li);
    });

    // Paginação
    nav.innerHTML = '';
    if (data.previous) {
        const prev = document.createElement('button');
        prev.textContent = 'Anterior';
        prev.onclick = () => fetchUsuarios(data.previous);
        nav.appendChild(prev);
    }
    if (data.next) {
        const next = document.createElement('button');
        next.textContent = 'Próxima';
        next.onclick = () => fetchUsuarios(data.next);
        nav.appendChild(next);
    }
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('usuario-id').value;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        let method = 'POST';
        let url = '/api/usuarios/';
        if (id) {
            method = 'PUT';
            url += `${id}/`;
            delete data.password; // não atualiza senha no PUT sem campo
        }

        const res = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (res.ok) {
            form.reset();
            document.getElementById('usuario-id').value = '';
            fetchUsuarios();
        } else {
            const errorData = await res.json().catch(() => ({}));
            alert('Erro ao salvar usuário: ' + (errorData.detail || res.statusText));
        }
    });

    fetchUsuarios();
}

        // redirecionar para a tela de cadastro
        document.getElementById("btn-cadastro").addEventListener("click", function() {
            window.location.href = "{% url 'usuarios' %}"; 
            // 🔹 Certifique-se que no seu urls.py você registrou a rota 'usuarios' com esse name
        });