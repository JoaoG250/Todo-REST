from django.urls import reverse
from rest_framework import serializers
from todo.models import Todo

class TodoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Todo
        fields = ('id', 'url', 'titulo', 'descricao', 'concluido')
    
    def url(self, obj):
        return reverse('todo-detail', args=[obj.id])