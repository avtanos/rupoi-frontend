from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import WarehouseEntry, Issue
from .serializers import WarehouseEntrySerializer, IssueSerializer


class WarehouseEntryViewSet(viewsets.ModelViewSet):
    queryset = WarehouseEntry.objects.all()
    serializer_class = WarehouseEntrySerializer
    permission_classes = [IsAuthenticated]


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
