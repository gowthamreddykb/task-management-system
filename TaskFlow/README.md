# 🚀 TaskFlow — Backend & Full-Stack Setup Guide

This guide covers running the **TaskFlow** project locally, including running clean **without initial data**, seeding sample data, and connecting with the frontend.

---

## ⚡ Quick Start: Running on Localhost

### 1. Python Virtual Environment Setup

From this `TaskFlow` directory (or the project root):

- **Windows (Command Prompt / PowerShell)**:
  ```cmd
  python -m venv venv
  venv\Scripts\activate
  ```

- **macOS / Linux**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Apply Database Migrations
```bash
python manage.py migrate
```
This generates the local SQLite database file `db.sqlite3`.

---

## 🎯 How to Run With or Without Initial Data

### Option A: Running Clean Without Any Data
If you want to start fresh with no existing tasks or categories:
1. Run `python manage.py migrate`
2. Do **not** run the seed command.
3. Start the server:
   ```bash
   python manage.py runserver 8000
   ```
Your app starts with a 100% clean slate!

### Option B: Seeding Sample Demo Data
To populate demo categories (Travel Planning, Packing, Hotel, Activities) and sample tasks:
```bash
python manage.py seed_data
```
Or:
```bash
python scripts/create_demo_data.py
```

---

## 🌐 Running the Server
```bash
python manage.py runserver 8000
```
Open **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)** in your browser:
1. **Login First**: You will see the TaskFlow Sign In screen.
2. **Register**: Click "Create Account" (or go to `/register/`) to create your account and automatically log in.
3. **Demo Quick Access**: Or click "1-Click Demo Login" (demo / demo123).
4. **Interactive Workspace**: Manage tasks, toggle status with the checkbox, filter by categories, search in real-time, and click "+ New Task" to add tasks.
5. **Sign Out**: Click "Sign Out" in the top navbar at any time.
- Django Admin portal: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) (log in with `admin` / `admin123`).
- Raw REST API: [http://127.0.0.1:8000/api/tasks/](http://127.0.0.1:8000/api/tasks/)

---

## 💻 Running the Frontend (React Vite)
In a separate terminal window at the project root:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the TaskFlow UI.

---

## 📁 Key File Index
- `manage.py`: Django command-line execution utility.
- `requirements.txt`: Python package requirements.
- `config/settings.py`: SQLite, REST Framework, and CORS settings.
- `config/urls.py`: URL dispatching for all endpoints.
- `tasks/`: Models, serializers, views, and `seed_data` management command.
- `categories/`: Models and endpoints for task categorization.
- `accounts/`: Single-user personal profile settings.
- `scripts/`: Standalone scripts (`create_demo_data.py`, `check_overdue_tasks.py`).

---

## 🔧 Troubleshooting

### If you see `BadMigrationError: Migration init in app accounts has no Migration class`:
- This was caused by dummy `init.py` files in migration folders. They have now been deleted from the project and replaced with clean `0001_initial.py` migrations.
- If you have an older export on your machine, delete any file named `init.py` inside `accounts/migrations/`, `categories/migrations/`, `tasks/migrations/`, or `notifications/migrations/` (keep `__init__.py`).
- Then simply run:
  ```cmd
  python manage.py migrate
  ```

