"""
TaskFlow URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from dashboard.views import dashboard_home_view
from accounts.views import login_view, register_view, logout_view

def favicon_view(request):
    svg_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>'
    return HttpResponse(svg_icon, content_type="image/svg+xml")

urlpatterns = [
    # Favicon
    path('favicon.ico', favicon_view, name='favicon'),

    # Admin
    path('admin/', admin.site.urls),

    # Main dashboard
    path('', dashboard_home_view, name='home'),

    # Authentication views (Login first & Register)
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('accounts/login/', login_view, name='account_login'),
    path('accounts/register/', register_view, name='account_register'),
    path('accounts/logout/', logout_view, name='account_logout'),

    # API Endpoints
    path('api/tasks/', include('tasks.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/analytics/', include('analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
