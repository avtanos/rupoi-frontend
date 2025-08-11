from rest_framework import serializers
from .models import TSRCategory, Workshop, OrderStatus


class TSRCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TSRCategory
        fields = '__all__'


class WorkshopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = '__all__'


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = '__all__'
