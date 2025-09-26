from rest_framework import viewsets, permissions
from django.utils.decorators import method_decorator
from .models import Usuario, Noticia, Categoria
from .serializers import UsuarioSerializer, NoticiaSerializer, CategoriaSerializer
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from django.http import JsonResponse

@method_decorator(csrf_exempt, name='dispatch')
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]  # permite criar/editar sem login   

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"success": True})
        return JsonResponse({"success": False}, status=401)
    return JsonResponse({"error": "Método não permitido"}, status=405)

class NoticiaViewSet(viewsets.ModelViewSet):
    serializer_class = NoticiaSerializer
    queryset = Noticia.objects.all()

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)

def index(request):
    if request.user.is_authenticated:
        return redirect('usuarios')
    return render(request, 'core/index.html')

def usuarios_page(request):
    return render(request, 'core/usuarios.html')

def noticias_page(request):
    return render(request, 'core/noticias.html')

@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        logout(request)  # destrói a sessão
        return redirect('index')
    return redirect('index')

def portal_view(request):
    # === Criar categorias se não existirem ===
    categorias_nome = ["Sport", "Escola", "Política", "Economía", "Tecnologia"]
    categorias = []
    for nome in categorias_nome:
        cat, created = Categoria.objects.get_or_create(nome=nome)
        categorias.append(cat)

    categoria_id = request.GET.get('categoria')
    if categoria_id:
        noticias = Noticia.objects.filter(categoria=categoria_id).order_by('-criado_em')
    else:
        noticias = Noticia.objects.all().order_by('-criado_em')

    # Notícia principal (a primeira com destaque)
    noticia_principal = noticias.filter(destaque=True).first()

    context = {
        'noticia_principal': noticia_principal,
        'noticias': noticias.exclude(id=noticia_principal.id) if noticia_principal else noticias,
        'categorias': categorias,  # lista criada no início
        'categoria_selecionada': int(categoria_id) if categoria_id else None
    }
    return render(request, 'core/portal.html', context)

def usuarios_view(request):
    return render(request, "core/usuarios.html")

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]