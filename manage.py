#!/usr/bin/env python
"""
TaskFlow root manage.py wrapper.
Allows running Django commands directly from the root repository directory
as well as inside the TaskFlow/ folder.
"""
import os
import sys
from pathlib import Path

def main():
    root_dir = Path(__file__).resolve().parent
    taskflow_dir = root_dir / 'TaskFlow'
    if str(taskflow_dir) not in sys.path:
        sys.path.insert(0, str(taskflow_dir))

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?\n\n"
            "Quick setup:\n"
            "  python -m venv venv\n"
            "  source venv/bin/activate  # (Windows: venv\\Scripts\\activate)\n"
            "  pip install -r requirements.txt\n"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
