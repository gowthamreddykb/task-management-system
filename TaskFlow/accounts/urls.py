from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    current_user_view,
    login_view,
    register_view,
    logout_view,
    api_login_view,
    api_register_view,
    api_logout_view
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Web views
    path('login/', login_view, name='accounts_login'),
    path('register/', register_view, name='accounts_register'),
    path('logout/', logout_view, name='accounts_logout'),

    # REST API endpoints
    path('me/', current_user_view, name='current-user'),
    path('auth/login/', api_login_view, name='api-login'),
    path('auth/register/', api_register_view, name='api-register'),
    path('auth/logout/', api_logout_view, name='api-logout'),

    path('', include(router.urls)),
]
