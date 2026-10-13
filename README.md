# 🚀 TaskFlow — Trip & Task Planner

A modern, high-performance **Single-User Trip & Task Planner** built with a responsive **React + Vite** frontend and a robust **Django REST Framework** backend with SQLite.

---

## 📋 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Prerequisites](#-prerequisites)
3. [Quick Start — Complete Flow to Run on Localhost](#-quick-start--complete-flow-to-run-on-localhost)
   - [Method 1: Run the React Frontend (Instant UI)](#method-1-run-the-react-frontend-instant-ui)
   - [Method 2: Run the Django Backend (REST API & Admin)](#method-2-run-the-django-backend-rest-api--admin)
   - [Method 3: Run Both Together (Full-Stack Experience)](#method-3-run-both-together-full-stack-experience)
4. [How to Run With or Without Initial Data](#-how-to-run-with-or-without-initial-data)
5. [Project Directory & File Structure](#-project-directory--file-structure)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Troubleshooting Guide](#-troubleshooting-guide)

---

## 🏗️ Architecture Overview

- **Single-User Workspace**: Streamlined personal workspace for planning trips, packing lists, bookings, and daily tasks without confusing multi-user account switches.
- **Frontend**:
  - React 19 + Vite 8
  - Tailwind CSS + Lucide React Icons
  - Interactive Kanban board, Calendar deadline tracker, Category manager, PDF/CSV export, and statistics.
  - Automatic LocalStorage fallback so the app works 100% offline or standalone out of the box!
- **Backend**:
  - Python 3.9+ / 3.10 / 3.11 / 3.12
  - Django 4.2+ / 5.x & Django REST Framework
  - SQLite database (self-contained, **no external SQL server or installation required**)
  - Pre-configured CORS support for seamless communication with frontend.

---

## 💻 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher) & **npm**: [Download Node.js](https://nodejs.org/)
- **Python** (v3.9 or higher) & **pip**: [Download Python](https://www.python.org/)

Check your versions by running in your terminal:
```bash
node -v
npm -v
python --version   # (or python3 --version)
```

---

## ⚡ Quick Start — Complete Flow to Run on Localhost

### Method 1: Run the React Frontend (Instant UI)

The frontend provides the complete interactive visual application with dashboard cards, Kanban board, category color coding, upcoming deadline alerts, and export tools.

1. Open your terminal in the extracted project root directory:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
*(You will see the full TaskFlow interface running immediately!)*

---

### Method 2: Run the Django Backend (REST API & Admin)

The Django backend provides persistent SQLite database storage, browsable REST APIs, and an administrative control panel.

#### Step 1: Create and Activate a Python Virtual Environment

- **On Windows (Command Prompt / PowerShell)**:
  ```cmd
  python -m venv venv
  venv\Scripts\activate
  ```

- **On macOS / Linux**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

#### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Step 3: Initialize Database Migrations
```bash
python manage.py migrate
```
*(This sets up your clean SQLite database `db.sqlite3` in 2 seconds!)*

#### Step 5: (Optional) Seed Demo Data & User Accounts
To immediately generate sample trip tasks, categories, and ready-to-use demo accounts:
```bash
python manage.py seed_data
```
This automatically prepares:
- **Demo User**: Username: `demo` | Password: `demo123`
- **Admin Staff**: Username: `admin` | Password: `admin123`

#### Step 6: Start the Server
```bash
python manage.py runserver 8000
```

#### Step 7: Access the Application
Open your browser at **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**:
1. **Login Page First**: You will immediately see the clean TaskFlow Sign In screen.
2. **Registration (New Users)**: If you don't have an account, click the **"Create Account"** tab or link, enter your name, username, and password, and submit. Your account is created and you are logged in automatically!
3. **1-Click Demo Access**: Or click the **"1-Click Demo Login"** button (or enter `demo` / `demo123`) to explore right away.
4. **Single-User Workspace**: Once inside, you have full access to your interactive dashboard, tasks, filters, "+ New Task" modal, status toggles, and "Sign Out" button.
5. **Django Admin Portal**: Available at [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) (log in with `admin` / `admin123`).

---

### Method 3: Run Both Together (Full-Stack Experience)

Run the backend in one terminal tab and the frontend in a second terminal tab:

| Terminal | Command | Address |
| :--- | :--- | :--- |
| **Terminal 1 (Backend)** | `python manage.py runserver 8000` | `http://127.0.0.1:8000` |
| **Terminal 2 (Frontend)** | `npm run dev` | `http://localhost:3000` |

---

## 🎯 How to Run With or Without Initial Data

### Option A: Running 100% Clean "Without Data"
If you want to start with a completely empty, fresh workspace for your own personal tasks:
1. Run `python manage.py migrate`
2. **Do not** run any seeding commands!
3. Start the server with `python manage.py runserver 8000`.
4. Your database is completely clean, ready for you to create your custom categories and tasks via the UI or API.

### Option B: Seeding Sample Demo Data
If you want pre-populated travel planner data (Flights, Hotels, Packing lists, Activities) to explore right away:
```bash
python manage.py seed_data
```
Or run the helper script:
```bash
python TaskFlow/scripts/create_demo_data.py
```

---

## 📁 Project Directory & File Structure

```text
├── manage.py                   # Root Django CLI wrapper (run commands from project root)
├── requirements.txt            # Python dependencies (Django, DRF, CORS, Pillow, etc.)
├── package.json                # Frontend npm dependencies and build scripts
├── vite.config.js              # Vite bundler configuration
├── index.html                  # Frontend HTML entry point
├── README.md                   # Complete documentation and setup guide
│
├── src/                        # React Frontend Source Code
│   ├── App.jsx                 # Main application controller
│   ├── main.jsx                # React DOM mount point
│   ├── components/             # Reusable UI components
│   │   ├── dashboard/          # Metric cards, upcoming tasks, charts
│   │   ├── kanban/             # Drag-and-drop / status columns (TODO, In Progress, Done)
│   │   ├── tasks/              # Task creation, editing, filter modal
│   │   ├── categories/         # Category manager with color tags & icons
│   │   ├── accounts/           # Single-user personal profile settings modal
│   │   ├── notifications/      # Reminder dropdown & deadline alerts
│   │   └── reports/            # PDF and CSV report export tools
│   ├── services/               # LocalStorage & API communication services
│   └── data/                   # Initial data schemas and default fallbacks
│
└── TaskFlow/                   # Django REST Framework Backend
    ├── manage.py               # Django management script inside backend folder
    ├── requirements.txt        # Backend dependencies
    ├── config/                 # Project configuration (settings, routing, wsgi, asgi)
    │   ├── settings.py         # Configured with SQLite, CORS, and REST Framework
    │   └── urls.py             # Global URL routing
    ├── tasks/                  # Task management app (models, serializers, views, seed command)
    ├── categories/             # Category categorization app
    ├── accounts/               # Personal single-user profile app
    ├── notifications/          # Reminder and alert system
    ├── analytics/              # Statistics and metrics aggregator
    ├── reports/                # CSV export generator
    ├── templates/              # HTML templates for home and base layouts
    ├── static/                 # CSS, JavaScript, and SVG static files
    └── scripts/                # Standalone demo seeder & overdue checker scripts
```

---

## 🌐 API Endpoints Reference

All endpoints accept and return JSON with standard HTTP status codes:

| Endpoint | HTTP Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | HTML Overview Dashboard & API Explorer |
| `/api/tasks/` | `GET`, `POST` | List all tasks or create a new task |
| `/api/tasks/{id}/` | `GET`, `PUT`, `DELETE` | Retrieve, update, or remove a task |
| `/api/tasks/stats/` | `GET` | Summary statistics (counts, completion rates) |
| `/api/categories/` | `GET`, `POST` | List or create categories (name, color, icon) |
| `/api/categories/{id}/`| `GET`, `PUT`, `DELETE` | Manage a specific category |
| `/api/notifications/`| `GET` | List active notifications and deadline reminders |
| `/api/notifications/mark_all_read/` | `POST` | Mark all alerts as read |
| `/api/reports/csv/` | `GET` | Download tasks as a standard CSV file |
| `/api/analytics/overview/` | `GET` | Aggregated analytics & category progress breakdown |
| `/api/accounts/me/` | `GET` | Current user profile information |
| `/admin/` | `GET`, `POST` | Django Admin Portal |

---

## 🔧 Troubleshooting Guide

### 1. `python: command not found`
- Try `python3` instead of `python`:
  ```bash
  python3 manage.py runserver 8000
  ```
- Make sure Python is added to your system `PATH` during installation.

### 2. `Couldn't import Django...`
- You need to activate your virtual environment before running commands:
  ```bash
  # Windows
  venv\Scripts\activate
  # Mac/Linux
  source venv/bin/activate
  ```
- Make sure dependencies are installed:
  ```bash
  pip install -r requirements.txt
  ```

### 3. Port 3000 or 8000 is already in use
- **For Frontend (Vite)**: Specify another port:
  ```bash
  npm run dev -- --port 3001
  ```
- **For Backend (Django)**: Specify another port:
  ```bash
  python manage.py runserver 8080
  ```

### 4. `BadMigrationError: Migration init in app accounts has no Migration class`
- **Cause**: Stray dummy files named `init.py` existed inside Django's migration folders (`accounts/migrations/init.py`, etc.). Django expects only `__init__.py` and proper migration files like `0001_initial.py`.
- **Solution**: All stray `init.py` files have been permanently removed, and valid initial migrations (`0001_initial.py`) have been placed in all apps (`accounts`, `categories`, `tasks`, `notifications`).
- You can now directly run:
  ```cmd
  python manage.py migrate
  ```
- If you had already exported older files on your local machine, simply delete any file called `init.py` inside `accounts/migrations/`, `categories/migrations/`, `tasks/migrations/`, and `notifications/migrations/` (keep `__init__.py`).

### 5. Empty Files Error on Export
- All files (`manage.py`, `requirements.txt`, `README.md`, serializers, views, templates) have been verified and populated with zero-byte placeholders removed.
- You can run `manage.py` from either the repository root or inside the `TaskFlow/` folder—both work out of the box!

---

🎉 **You are all set! Enjoy organizing your tasks and trips with TaskFlow.**
