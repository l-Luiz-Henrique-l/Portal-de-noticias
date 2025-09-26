from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class Usuario(AbstractUser):
    bio = models.TextField(blank=True, null=True)


class Categoria(models.Model):
    nome = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nome


class Noticia(models.Model):
    titulo = models.CharField(max_length=200)
    conteudo = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    # 🔹 Alterado para ForeignKey
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        related_name="noticias",
        default=1
    )

    destaque = models.BooleanField(default=False)

    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="noticias"
    )

    def __str__(self):
        return f"{self.titulo} ({self.categoria.nome})"
