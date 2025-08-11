from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonalCaseViewSet

router = DefaultRouter()
router.register(r'', PersonalCaseViewSet, basename='personal-case')

urlpatterns = [
    path('', include(router.urls)),
]
