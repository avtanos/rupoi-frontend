from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import TSRCategory, Workshop, OrderStatus
from .serializers import TSRCategorySerializer, WorkshopSerializer, OrderStatusSerializer


class TSRCategoryViewSet(viewsets.ModelViewSet):
    queryset = TSRCategory.objects.all()
    serializer_class = TSRCategorySerializer
    permission_classes = [IsAuthenticated]


class WorkshopViewSet(viewsets.ModelViewSet):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer
    permission_classes = [IsAuthenticated]


class OrderStatusViewSet(viewsets.ModelViewSet):
    queryset = OrderStatus.objects.all()
    serializer_class = OrderStatusSerializer
    permission_classes = [IsAuthenticated]
