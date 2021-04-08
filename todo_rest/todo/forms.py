from django.forms import ModelForm
from todo.models import Todo

class TodoForm(ModelForm):
    class Meta:
        model = Todo
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(TodoForm, self).__init__(*args, **kwargs)
        self.fields['titulo'].widget.attrs.update({'class': 'form-control'})
        self.fields['descricao'].widget.attrs.update({'class': 'form-control', 'rows': '3'})
        self.fields['concluido'].widget.attrs.update({'class': 'form-check-input'})