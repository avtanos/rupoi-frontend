from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/personal-cases/', include('personal_cases.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/invoices/', include('invoices.urls')),
    path('api/warehouse/', include('warehouse.urls')),
    path('api/dictionaries/', include('dictionaries.urls')),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
