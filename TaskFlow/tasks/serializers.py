from rest_framework import serializers
from .models import Task
from categories.serializers import CategorySerializer

class TaskSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)
    category_name = serializers.SerializerMethodField()
    category_color = serializers.SerializerMethodField()
    category_id = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'category_id',
            'category_name', 'category_color', 'category_detail',
            'status', 'priority', 'due_date', 'estimated_hours',
            'assigned_to', 'assigned_to_name', 'tags', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True}
        }

    def to_internal_value(self, data):
        # Support both 'category' and 'category_id' keys from frontend
        data_dict = dict(data) if hasattr(data, 'dict') else dict(data)
        if 'category_id' in data_dict and 'category' not in data_dict:
            val = data_dict.get('category_id')
            data_dict['category'] = val if val else None
        return super().to_internal_value(data_dict)

    def get_category_id(self, obj):
        return obj.category.id if obj.category else None

    def get_category_name(self, obj):
        return obj.category.name if obj.category else 'Uncategorized'

    def get_category_color(self, obj):
        return obj.category.color if obj.category else '#64748b'

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None
