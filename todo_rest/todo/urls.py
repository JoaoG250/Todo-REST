from django.urls import path, include
from rest_framework import routers
from todo import views

router = routers.DefaultRouter()
router.register(r'todos', views.TodoView, 'todo')

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('api/', include(router.urls))
]
