from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db.utils import OperationalError, ProgrammingError
from django.core.management import call_command
import json
from django.utils import timezone
from tasks.models import Task
from categories.models import Category
from notifications.models import Notification

def ensure_tables():
    try:
        Task.objects.exists()
    except (OperationalError, ProgrammingError):
        try:
            call_command('migrate', interactive=False)
            try:
                call_command('seed_data')
            except Exception:
                pass
        except Exception:
            pass

def dashboard_home_view(request):
    """
    Renders the TaskFlow Workspace Dashboard.
    Enforces authentication: Unauthenticated users are redirected to the Login page.
    """
    ensure_tables()
    try:
        if not request.user.is_authenticated:
            return redirect('login')
    except (OperationalError, ProgrammingError):
        ensure_tables()
        return redirect('login')

    # API JSON summary fallback for automated consumers
    if request.headers.get('Accept') == 'application/json':
        return JsonResponse({
            'status': 'online',
            'app': 'TaskFlow Trip & Task Planner API',
            'version': '1.0.0',
            'user': request.user.username,
            'total_tasks': Task.objects.count(),
            'total_categories': Category.objects.count(),
            'endpoints': {
                'tasks': '/api/tasks/',
                'stats': '/api/tasks/stats/',
                'categories': '/api/categories/',
                'notifications': '/api/notifications/',
                'export_csv': '/api/reports/csv/',
                'admin': '/admin/',
                'logout': '/logout/',
            }
        })

    tasks_qs = Task.objects.all().select_related('category').order_by('-created_at')
    categories_qs = Category.objects.all()
    unread_notifications_count = Notification.objects.filter(is_read=False).count()
    notifications_qs = Notification.objects.all().order_by('-created_at')[:15]

    total_tasks = tasks_qs.count()
    completed_tasks = tasks_qs.filter(status='COMPLETED').count()
    in_progress_tasks = tasks_qs.filter(status='IN_PROGRESS').count()
    todo_tasks = tasks_qs.filter(status='TODO').count()
    pending_tasks = total_tasks - completed_tasks
    urgent_tasks = tasks_qs.filter(priority='URGENT').exclude(status='COMPLETED').count()

    now = timezone.now()
    today = now.date()
    overdue_tasks = tasks_qs.filter(due_date__lt=today).exclude(status='COMPLETED').count()
    completion_rate = round((completed_tasks / total_tasks) * 100) if total_tasks > 0 else 0

    # Approaching deadlines: up to 5 upcoming tasks
    upcoming_tasks = [t for t in tasks_qs if t.status != 'COMPLETED' and t.due_date]
    upcoming_tasks.sort(key=lambda t: str(t.due_date))
    upcoming_tasks = upcoming_tasks[:5]

    # Categories with calculated progress
    categories_with_progress = []
    for cat in categories_qs:
        cat_tasks = [t for t in tasks_qs if t.category_id == cat.id]
        cat_total = len(cat_tasks)
        cat_completed = len([t for t in cat_tasks if t.status == 'COMPLETED'])
        pct = round((cat_completed / cat_total) * 100) if cat_total > 0 else 0
        categories_with_progress.append({
            'id': cat.id,
            'name': cat.name,
            'color': cat.color or '#3b82f6',
            'description': cat.description or 'Trip category & workspace',
            'total_tasks': cat_total,
            'completed_tasks': cat_completed,
            'progress_pct': pct,
        })

    # Prepare JSON serializable data for charts & interactive client features
    tasks_data = []
    for t in tasks_qs:
        completed_val = getattr(t, 'completed_at', None) or (t.updated_at if t.status == 'COMPLETED' else None)
        tasks_data.append({
            'id': t.id,
            'title': t.title,
            'description': t.description or '',
            'status': t.status,
            'priority': t.priority,
            'due_date': t.due_date.isoformat() if hasattr(t.due_date, 'isoformat') else (str(t.due_date) if t.due_date else None),
            'completed_at': completed_val.isoformat() if hasattr(completed_val, 'isoformat') else (str(completed_val) if completed_val else None),
            'created_at': t.created_at.isoformat() if hasattr(t.created_at, 'isoformat') else (str(t.created_at) if t.created_at else None),
            'category_id': t.category.id if t.category else None,
            'category_name': t.category.name if t.category else 'Uncategorized',
            'category_color': t.category.color if t.category else '#64748b',
        })

    categories_data = [
        {
            'id': c.id,
            'name': c.name,
            'color': c.color or '#3b82f6',
            'description': c.description or '',
        }
        for c in categories_qs
    ]

    context = {
        'user': request.user,
        'tasks': tasks_qs,
        'categories': categories_qs,
        'notifications': notifications_qs,
        'unread_notifications_count': unread_notifications_count,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'in_progress_tasks': in_progress_tasks,
        'todo_tasks': todo_tasks,
        'pending_tasks': pending_tasks,
        'urgent_tasks': urgent_tasks,
        'overdue_tasks': overdue_tasks,
        'completion_rate': completion_rate,
        'upcoming_tasks': upcoming_tasks,
        'categories_with_progress': categories_with_progress,
        'tasks_json': json.dumps(tasks_data),
        'categories_json': json.dumps(categories_data),
        'today_str': now.strftime("%A, %b %d, %Y"),
    }
    return render(request, 'home.html', context)
