import os

from celery import Celery

# Set default Django settings module for 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

app = Celery("core")
# Load configuration from Django settings using the 'CELERY_" prefix
app.config_from_object("django.conf:settings", namespace="CELERY")
# Load taks modules from all registered Django app configs.
app.autodiscover_tasks()