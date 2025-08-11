from rest_framework import serializers
from .models import PersonalCase


class PersonalCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalCase
        fields = '__all__'
        read_only_fields = ('id', 'number', 'created_at', 'updated_at')

    def create(self, validated_data):
        # Автоматически генерируем номер при создании
        from utils import generate_personal_case_number
        validated_data['number'] = generate_personal_case_number()
        return super().create(validated_data)
