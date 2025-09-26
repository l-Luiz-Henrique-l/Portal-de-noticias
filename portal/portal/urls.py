from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from core.views import UsuarioViewSet, NoticiaViewSet, CategoriaViewSet
from core.views import index, usuarios_page, noticias_page
from core.views import logout_view, portal_view
from core import views 

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'noticias', NoticiaViewSet)
router.register(r'categorias', CategoriaViewSet)

urlpatterns = [
    path('', index, name='index'),
    path('usuarios/', usuarios_page, name='usuarios'),
    path("login/", views.login_view, name="login"),
    path('noticias/', noticias_page, name='noticias'),
    path('logout/', logout_view, name='logout'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path("portal/", portal_view, name="portal"),
]
