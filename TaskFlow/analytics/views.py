from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Count
from tasks.models import Task
from categories.models import Category

@api_view(['GET'])
@permission_classes([AllowAny])
def analytics_overview(request):
    """Provides high-level metrics for dashboard graphs and summary widgets."""
    total_tasks = Task.objects.count()
    completed_tasks = Task.objects.filter(status='COMPLETED').count()
    in_progress = Task.objects.filter(status='IN_PROGRESS').count()
    todo_tasks = Task.objects.filter(status='TODO').count()

    tasks_by_priority = {
        item['priority']: item['count']
        for item in Task.objects.values('priority').annotate(count=Count('id'))
    }

    category_stats = []
    for cat in Category.objects.all():
        cat_total = cat.tasks.count()
        cat_completed = cat.tasks.filter(status='COMPLETED').count()
        category_stats.append({
            'id': cat.id,
            'name': cat.name,
            'color': cat.color,
            'total': cat_total,
            'completed': cat_completed,
            'progress_percent': round((cat_completed / cat_total) * 100) if cat_total > 0 else 0
        })

    return Response({
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'in_progress_tasks': in_progress,
        'todo_tasks': todo_tasks,
        'completion_rate': round((completed_tasks / total_tasks) * 100) if total_tasks > 0 else 0,
        'priority_breakdown': tasks_by_priority,
        'categories': category_stats,
    })
