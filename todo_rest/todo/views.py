from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import viewsets
from todo.serializers import TodoSerializer
from todo.models import Todo
from todo.forms import TodoForm


class IndexView(TemplateView):
    template_name="todo/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        active_tab = 'todo'
        if self.request.GET.get('tab') == 'done':
            active_tab = 'done'
        context['active_tab'] = active_tab
        context['todo_form'] = TodoForm()
        return context


class TodoView(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
