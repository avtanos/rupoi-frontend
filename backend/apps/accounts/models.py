from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Кастомная модель пользователя"""
    
    # Роли пользователей
    ROLE_REGISTRY = 'registry'
    ROLE_MEDICAL = 'medical'
    ROLE_WORKSHOP = 'workshop'
    ROLE_WAREHOUSE = 'warehouse'
    ROLE_ADMIN = 'admin'
    
    ROLE_CHOICES = [
        (ROLE_REGISTRY, _('Регистратура')),
        (ROLE_MEDICAL, _('Медотдел')),
        (ROLE_WORKSHOP, _('Цех')),
        (ROLE_WAREHOUSE, _('Склад готовой продукции')),
        (ROLE_ADMIN, _('Администрация')),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_REGISTRY,
        verbose_name=_('Роль')
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name=_('Телефон')
    )
    
    department = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Отдел')
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Активен')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Дата создания')
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Дата обновления')
    )
    
    class Meta:
        verbose_name = _('Пользователь')
        verbose_name_plural = _('Пользователи')
        ordering = ['username']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"
    
    @property
    def is_registry(self):
        return self.role == self.ROLE_REGISTRY
    
    @property
    def is_medical(self):
        return self.role == self.ROLE_MEDICAL
    
    @property
    def is_workshop(self):
        return self.role == self.ROLE_WORKSHOP
    
    @property
    def is_warehouse(self):
        return self.role == self.ROLE_WAREHOUSE
    
    @property
    def is_admin(self):
        return self.role == self.ROLE_ADMIN


class UserProfile(models.Model):
    """Профиль пользователя"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    # avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)  # Временно отключено
    avatar = models.CharField(max_length=255, null=True, blank=True)  # Временно заменено
    bio = models.TextField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
    
    def __str__(self):
        return f'Профиль {self.user.username}'
