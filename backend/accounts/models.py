from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class Role(models.Model):
    """Роли пользователей системы"""
    ROLE_CHOICES = [
        ('REGISTRY', 'Регистратура'),
        ('MED', 'Медицинский персонал'),
        ('WORKSHOP', 'Цех'),
        ('WAREHOUSE', 'Склад'),
        ('ADMIN', 'Администратор'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, choices=ROLE_CHOICES, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Роль'
        verbose_name_plural = 'Роли'
        ordering = ['code']
    
    def __str__(self):
        return self.name


class User(AbstractUser):
    """Пользователь системы"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    roles = models.ManyToManyField(Role, blank=True, verbose_name='Роли')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Телефон')
    department = models.CharField(max_length=100, blank=True, verbose_name='Отделение')
    
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['username']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"
    
    def has_role(self, role_code):
        """Проверка наличия роли у пользователя"""
        return self.roles.filter(code=role_code).exists()
    
    def get_roles_display(self):
        """Получение списка ролей для отображения"""
        return ', '.join([role.name for role in self.roles.all()])
