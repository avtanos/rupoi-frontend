"""
URL configuration for АИС РУПОИ project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.accounts.urls')),
    # path('api/', include('apps.personal_files.urls')),  # Временно отключено
    # path('api/', include('apps.orders.urls')),      # Временно отключено
    # path('api/', include('apps.invoices.urls')),    # Временно отключено
    # path('api/', include('apps.warehouse.urls')),   # Временно отключено
    # path('api/', include('apps.reports.urls')),     # Временно отключено
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
