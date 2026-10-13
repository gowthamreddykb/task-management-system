from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'color', 'icon', 'description', 'task_count', 'created_at', 'updated_at']

    def get_task_count(self, obj):
        return obj.tasks.count()
