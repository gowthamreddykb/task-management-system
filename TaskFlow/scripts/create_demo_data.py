#!/usr/bin/env python
"""
Standalone script to populate initial demo data for TaskFlow.
Can be executed via: python scripts/create_demo_data.py
"""
import os
import sys
from pathlib import Path

# Setup Django environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.core.management import call_command

if __name__ == '__main__':
    print("Running seed_data command...")
    call_command('seed_data')
    print("Done!")
