from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().select_related('category', 'assigned_to')
    serializer_class = TaskSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        priority_param = self.request.query_params.get('priority')
        category_param = self.request.query_params.get('category')
        search_param = self.request.query_params.get('search')

        if status_param:
            qs = qs.filter(status=status_param.upper())
        if priority_param:
            qs = qs.filter(priority=priority_param.upper())
        if category_param:
            qs = qs.filter(category_id=category_param)
        if search_param:
            qs = qs.filter(title__icontains=search_param)

        return qs

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        task = self.get_object()
        if task.status == 'COMPLETED':
            task.status = 'TODO'
            task.completed_at = None
        else:
            task.status = 'COMPLETED'
            task.completed_at = timezone.now()
        task.save()
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['patch', 'post'], url_path='status')
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            task.status = new_status
            if new_status == 'COMPLETED':
                task.completed_at = timezone.now()
            else:
                task.completed_at = None
            task.save()
        return Response(TaskSerializer(task).data)


@api_view(['GET'])
def task_statistics_view(request):
    """Returns overview metrics for dashboard and analytics."""
    tasks = Task.objects.all()
    today = timezone.now().date()

    total = tasks.count()
    completed = tasks.filter(status='COMPLETED').count()
    in_progress = tasks.filter(status='IN_PROGRESS').count()
    todo = tasks.filter(status='TODO').count()
    overdue = tasks.filter(due_date__lt=today).exclude(status='COMPLETED').count()
    urgent = tasks.filter(priority='URGENT').exclude(status='COMPLETED').count()
    completion_rate = round((completed / total) * 100) if total > 0 else 0

    return Response({
        'total': total,
        'completed': completed,
        'in_progress': in_progress,
        'todo': todo,
        'overdue': overdue,
        'urgent': urgent,
        'completion_rate': completion_rate,
    })
