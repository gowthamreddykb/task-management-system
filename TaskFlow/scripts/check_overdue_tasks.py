#!/usr/bin/env python
"""
Checks for upcoming or overdue tasks and creates notifications.
Can be executed via: python scripts/check_overdue_tasks.py or scheduled via cron.
"""
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.utils import timezone
from tasks.models import Task
from notifications.models import Notification

def check_tasks():
    now = timezone.now()
    overdue = Task.objects.filter(due_date__lt=now).exclude(status='COMPLETED')
    print(f"Found {overdue.count()} overdue tasks.")
    for task in overdue:
        title = f"Task Overdue: {task.title}"
        if not Notification.objects.filter(title=title).exists():
            Notification.objects.create(
                title=title,
                message=f"The deadline for '{task.title}' passed on {task.due_date.strftime('%Y-%m-%d %H:%M')}.",
                notification_type='DEADLINE',
                is_read=False
            )
            print(f"Created notification for task: {task.title}")

if __name__ == '__main__':
    check_tasks()
