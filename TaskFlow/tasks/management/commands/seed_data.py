from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User
from categories.models import Category
from tasks.models import Task
from notifications.models import Notification

class Command(BaseCommand):
    help = 'Seeds initial sample categories, tasks, and demo user for TaskFlow'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding demo data for TaskFlow...'))

        # 1. Create Demo User & Superuser
        demo_user, created_demo = User.objects.get_or_create(
            username='demo',
            defaults={
                'email': 'demo@taskflow.dev',
                'first_name': 'Alex',
                'last_name': 'Rivera',
                'is_staff': False
            }
        )
        if created_demo:
            demo_user.set_password('demo123')
            demo_user.save()
            self.stdout.write(self.style.SUCCESS('Created demo user: username: demo / password: demo123'))
        else:
            demo_user.set_password('demo123')
            demo_user.save()

        # Admin user for Django admin
        admin_user, created_admin = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@taskflow.dev',
                'first_name': 'Admin',
                'last_name': 'Staff',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created_admin:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user: username: admin / password: admin123'))
        else:
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.set_password('admin123')
            admin_user.save()

        # 2. Categories
        cat_travel, _ = Category.objects.get_or_create(
            name='Travel Planning',
            defaults={'slug': 'travel-planning', 'color': '#3b82f6', 'icon': 'Plane', 'description': 'Flights, itineraries and reservations'}
        )
        cat_packing, _ = Category.objects.get_or_create(
            name='Packing & Gear',
            defaults={'slug': 'packing-gear', 'color': '#10b981', 'icon': 'Luggage', 'description': 'Luggage, clothing, and travel accessories'}
        )
        cat_hotels, _ = Category.objects.get_or_create(
            name='Hotel & Stays',
            defaults={'slug': 'hotel-stays', 'color': '#8b5cf6', 'icon': 'Building', 'description': 'Accommodations and bookings'}
        )
        cat_activities, _ = Category.objects.get_or_create(
            name='Activities & Tours',
            defaults={'slug': 'activities-tours', 'color': '#f59e0b', 'icon': 'Compass', 'description': 'Excursions, tickets, and dining'}
        )

        # 3. Tasks
        today = timezone.now().date()

        tasks_to_create = [
            {
                'title': 'Book round-trip flight tickets',
                'description': 'Compare airline rates for departure and return flights.',
                'category': cat_travel,
                'status': 'COMPLETED',
                'priority': 'HIGH',
                'due_date': today - timedelta(days=2),
                'estimated_hours': 2,
                'assigned_to': demo_user,
            },
            {
                'title': 'Confirm boutique hotel reservation',
                'description': 'Ensure check-in date matches arrival and request late arrival option.',
                'category': cat_hotels,
                'status': 'IN_PROGRESS',
                'priority': 'URGENT',
                'due_date': today + timedelta(days=1),
                'estimated_hours': 1,
                'assigned_to': demo_user,
            },
            {
                'title': 'Pack passport, visas, and international adapter',
                'description': 'Gather essential travel documents and universal power plugs.',
                'category': cat_packing,
                'status': 'TODO',
                'priority': 'HIGH',
                'due_date': today + timedelta(days=3),
                'estimated_hours': 3,
                'assigned_to': demo_user,
            },
            {
                'title': 'Reserve guided walking tour tickets',
                'description': 'Reserve skip-the-line passes for morning museum tour.',
                'category': cat_activities,
                'status': 'TODO',
                'priority': 'MEDIUM',
                'due_date': today + timedelta(days=5),
                'estimated_hours': 1,
                'assigned_to': demo_user,
            },
        ]

        created_count = 0
        for task_info in tasks_to_create:
            task, created = Task.objects.get_or_create(
                title=task_info['title'],
                defaults=task_info
            )
            if created:
                created_count += 1

        Notification.objects.get_or_create(
            title='Welcome to TaskFlow',
            defaults={
                'message': 'Your single-user workspace is ready. You can organize your trip and tasks smoothly.',
                'notification_type': 'SYSTEM',
                'is_read': False
            }
        )

        self.stdout.write(self.style.SUCCESS(
            f'Successfully seeded demo data! Created {created_count} tasks and categories.\n'
            f'Ready to login with: username: demo | password: demo123 (or admin / admin123)'
        ))
