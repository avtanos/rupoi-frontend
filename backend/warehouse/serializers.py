from rest_framework import serializers
from .models import WarehouseEntry, Issue


class WarehouseEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseEntry
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'
        read_only_fields = ('id', 'issued_at', 'created_at', 'updated_at')
