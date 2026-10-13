from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.db.utils import OperationalError, ProgrammingError
from django.core.management import call_command
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import UserProfile

# --------------------------------------------------------------------------
# Auto-Migration Helper
# --------------------------------------------------------------------------
def auto_migrate_if_needed():
    """
    Checks if database tables exist. If missing, automatically runs migrate
    and seed_data so the user never encounters 'no such table: auth_user'.
    """
    try:
        User.objects.exists()
    except (OperationalError, ProgrammingError):
        try:
            call_command('migrate', interactive=False)
            try:
                call_command('seed_data')
            except Exception:
                pass
        except Exception:
            pass

# --------------------------------------------------------------------------
# Web Views (HTML Login, Register, Logout)
# --------------------------------------------------------------------------

def login_view(request):
    """
    Renders login screen or logs in user via session.
    If already logged in, redirects to dashboard.
    """
    auto_migrate_if_needed()
    try:
        if request.user.is_authenticated:
            return redirect('home')
    except (OperationalError, ProgrammingError):
        auto_migrate_if_needed()

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        if not username or not password:
            messages.error(request, 'Please provide both username and password.')
            return render(request, 'accounts/login.html')

        # Auto-provision and authenticate demo user instantly
        if username.lower() == 'demo' and password == 'demo123':
            demo_user = User.objects.filter(username='demo').first()
            if not demo_user:
                demo_user = User.objects.create_user(
                    username='demo',
                    password='demo123',
                    email='demo@taskflow.dev',
                    first_name='Alex',
                    last_name='Rivera'
                )
            else:
                demo_user.set_password('demo123')
                demo_user.save()
            demo_user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, demo_user)
            return redirect('home')

        try:
            user = authenticate(request, username=username, password=password)
        except (OperationalError, ProgrammingError):
            auto_migrate_if_needed()
            try:
                user = authenticate(request, username=username, password=password)
            except Exception:
                user = None

        if user is not None:
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
            return redirect('home')
        else:
            messages.error(
                request,
                'Invalid username or password. If you are new here, click "Create Account" below to register!'
            )

    return render(request, 'accounts/login.html')


def register_view(request):
    """
    Renders register screen and creates a new user account.
    Automatically logs in the user upon registration and redirects to dashboard.
    """
    auto_migrate_if_needed()
    try:
        if request.user.is_authenticated:
            return redirect('home')
    except (OperationalError, ProgrammingError):
        auto_migrate_if_needed()

    if request.method == 'POST':
        full_name = request.POST.get('full_name', '').strip()
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        password_confirm = request.POST.get('password_confirm', '')

        if not username or not password:
            messages.error(request, 'Username and password are required.')
            return render(request, 'accounts/register.html', {
                'full_name': full_name,
                'username': username,
                'email': email
            })

        if password != password_confirm:
            messages.error(request, 'Passwords do not match. Please re-enter them.')
            return render(request, 'accounts/register.html', {
                'full_name': full_name,
                'username': username,
                'email': email
            })

        if len(password) < 4:
            messages.error(request, 'Password must be at least 4 characters.')
            return render(request, 'accounts/register.html', {
                'full_name': full_name,
                'username': username,
                'email': email
            })

        try:
            if User.objects.filter(username=username).exists():
                messages.error(request, f'Username "{username}" is already taken. Please choose another username or sign in.')
                return render(request, 'accounts/register.html', {
                    'full_name': full_name,
                    'email': email
                })
        except (OperationalError, ProgrammingError):
            auto_migrate_if_needed()

        # Split full name into first and last name
        first_name = full_name
        last_name = ''
        if ' ' in full_name:
            parts = full_name.split(' ', 1)
            first_name = parts[0]
            last_name = parts[1]

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
            messages.success(request, f'Welcome to TaskFlow, {user.first_name or user.username}!')
            return redirect('home')
        except Exception as e:
            messages.error(request, f'Registration error: {str(e)}')
            return render(request, 'accounts/register.html', {
                'full_name': full_name,
                'username': username,
                'email': email
            })

    return render(request, 'accounts/register.html')


def logout_view(request):
    """
    Logs out the user and redirects to the login screen.
    """
    logout(request)
    return redirect('login')


# --------------------------------------------------------------------------
# REST API Endpoints (For Single-Page Apps or Mobile/API Clients)
# --------------------------------------------------------------------------

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().select_related('profile')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def api_login_view(request):
    """REST API endpoint for login."""
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response({
            'status': 'success',
            'user': UserSerializer(user).data
        })
    return Response(
        {'error': 'Invalid username or password'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def api_register_view(request):
    """REST API endpoint for registration."""
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    email = request.data.get('email', '').strip()
    full_name = request.data.get('full_name', '').strip()

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

    first_name = full_name
    last_name = ''
    if ' ' in full_name:
        parts = full_name.split(' ', 1)
        first_name = parts[0]
        last_name = parts[1]

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    login(request, user)
    return Response({
        'status': 'success',
        'user': UserSerializer(user).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST', 'GET'])
@permission_classes([permissions.AllowAny])
def api_logout_view(request):
    """REST API endpoint for logout."""
    logout(request)
    return Response({'status': 'logged_out'})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def current_user_view(request):
    """Returns the authenticated user or guest profile info."""
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    return Response({
        'id': None,
        'username': 'guest',
        'email': 'guest@taskflow.local',
        'is_authenticated': False,
        'profile': {
            'role': 'Trip Planner',
            'theme_preference': 'dark'
        }
    })
