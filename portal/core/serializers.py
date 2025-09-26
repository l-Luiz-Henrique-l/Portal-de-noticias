from rest_framework import serializers
from .models import Usuario, Noticia, Categoria
from django.contrib.auth.models import User

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'bio', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class NoticiaSerializer(serializers.ModelSerializer):
    autor_username = serializers.ReadOnlyField(source="autor.username")
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)  # nome legível
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all())     # ID para criar/editar

    class Meta:
        model = Noticia
        fields = [
            "id",
            "titulo",
            "conteudo",
            "categoria",       # ID enviado pelo POST
            "categoria_nome",  # Nome exibido no front
            "autor",
            "autor_username",
            "criado_em",
            "atualizado_em"
        ]
        read_only_fields = ["autor", "autor_username", "criado_em", "atualizado_em"]


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']
