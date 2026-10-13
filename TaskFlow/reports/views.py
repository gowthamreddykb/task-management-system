import csv
from django.http import HttpResponse
from rest_framework.decorators import api_view
from tasks.models import Task

@api_view(['GET'])
def export_tasks_csv(request):
    """Exports all tasks as a downloadable CSV."""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="taskflow_export.csv"'

    writer = csv.writer(response)
    writer.writerow(['ID', 'Title', 'Category', 'Status', 'Priority', 'Due Date', 'Estimated Hours', 'Tags', 'Created At'])

    for t in Task.objects.all().select_related('category'):
        writer.writerow([
            t.id,
            t.title,
            t.category.name if t.category else 'Uncategorized',
            t.status,
            t.priority,
            t.due_date.isoformat() if t.due_date else '',
            t.estimated_hours,
            t.tags,
            t.created_at.isoformat(),
        ])

    return response
