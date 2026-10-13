from django.urls import path
from .views import export_tasks_csv

urlpatterns = [
    path('csv/', export_tasks_csv, name='export-tasks-csv'),
]
