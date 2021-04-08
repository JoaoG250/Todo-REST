from django.db import models


class Todo(models.Model):
    titulo = models.CharField('Título', max_length=100)
    descricao = models.TextField('Descrição')
    concluido = models.BooleanField('Concluído', default=False)

    def _str_(self):
        return self.titulo
