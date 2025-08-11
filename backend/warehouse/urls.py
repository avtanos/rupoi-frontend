from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WarehouseEntryViewSet, IssueViewSet

router = DefaultRouter()
router.register(r'entries', WarehouseEntryViewSet, basename='warehouse-entry')
router.register(r'issues', IssueViewSet, basename='issue')

urlpatterns = [
    path('', include(router.urls)),
]
