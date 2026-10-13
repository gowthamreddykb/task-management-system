from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, task_statistics_view

router = DefaultRouter()
router.register(r'', TaskViewSet, basename='task')

urlpatterns = [
    path('stats/', task_statistics_view, name='task-statistics'),
    path('', include(router.urls)),
]
