from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TSRCategoryViewSet, WorkshopViewSet, OrderStatusViewSet

router = DefaultRouter()
router.register(r'tsr-categories', TSRCategoryViewSet, basename='tsr-category')
router.register(r'workshops', WorkshopViewSet, basename='workshop')
router.register(r'order-statuses', OrderStatusViewSet, basename='order-status')

urlpatterns = [
    path('', include(router.urls)),
]
