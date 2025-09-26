# Portal-de-noticias
Modelo de portal de notícias usando django sqlite e outros
Portal de Notícias - Sistema CRUD Web
🔹 Descrição

Este projeto é um portal de notícias com cadastro de usuários e gerenciamento de notícias.
Ele é composto por um back-end em Django REST Framework e um front-end em HTML, CSS e JavaScript, consumindo a API via fetch.

Funcionalidades principais:

Cadastro, edição e exclusão de usuários e notícias.

Listagem de notícias com paginação.

Autenticação e autorização de usuários.

Interface web responsiva e temática escura.

🔹 Tecnologias Utilizadas
Back-end

Python 3.x

Django 5.x

Django REST Framework

SQLite (pode ser configurado para PostgreSQL/MySQL)

Autenticação de usuários com session authentication

Front-end

HTML5, CSS3, JavaScript (ES6+)

Fetch API para consumo da API

Layout responsivo com grid e cards

Outros

Variáveis de ambiente via .env

Controle de versão com Git

🔹 Estrutura do Projeto
portal/
├── core/                   # App principal
│   ├── models.py           # Modelos de Usuário e Notícia
│   ├── serializers.py      # Serializers DRF
│   ├── urls.py             # Rotas da API
│   ├── templates/          # Templates HTML
│   └── static/core/        # CSS, JS e imagens
├── portal/                 # Configurações do Django
│   └── settings.py         # Configurações do projeto
├── manage.py
└── README.md

🔹 Instalação

Clone o repositório:

git clone https://github.com/seu-usuario/portal.git
cd portal


Crie um ambiente virtual:

python -m venv venv
source venv/bin/activate  # Linux / Mac
venv\Scripts\activate     # Windows


Instale as dependências:

pip install -r requirements.txt


Configure variáveis de ambiente (.env):

SECRET_KEY=sua_chave_secreta
DEBUG=True
DB_USER=usuario
DB_PASSWORD=senha
DB_HOST=localhost
DB_PORT=5432


Rode as migrações do banco de dados:

python manage.py migrate


Crie um superusuário:

python manage.py createsuperuser


Inicie o servidor:

python manage.py runserver


O sistema estará disponível em http://127.0.0.1:8000/.

🔹 Uso

Acesse o painel de administração Django (/admin) para gerenciar usuários e notícias.

Utilize a interface web para cadastrar, editar, excluir e listar notícias.

A API suporta métodos HTTP:

GET → Listar usuários e notícias

POST → Criar

PATCH/PUT → Editar

DELETE → Excluir

🔹 Boas práticas aplicadas

Código modular e organizado.

Interface web responsiva.

Uso de variáveis de ambiente para segurança.

Comunicação cliente/servidor via JSON.

Proteção contra CSRF no front-end.
