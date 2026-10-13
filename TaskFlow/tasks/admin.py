from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'priority', 'due_date', 'assigned_to', 'created_at')
    list_filter = ('status', 'priority', 'category', 'due_date')
    search_fields = ('title', 'description', 'tags')
    date_hierarchy = 'due_date'
