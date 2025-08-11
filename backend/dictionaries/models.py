from django.db import models
from utils import generate_uuid


class TSRCategory(models.Model):
    """Категория ТСР"""
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    code = models.CharField(max_length=20, unique=True, verbose_name='Код')
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Категория ТСР'
        verbose_name_plural = 'Категории ТСР'
        ordering = ['code']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Workshop(models.Model):
    """Цех"""
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    code = models.CharField(max_length=20, unique=True, verbose_name='Код')
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Цех'
        verbose_name_plural = 'Цеха'
        ordering = ['code']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class OrderStatus(models.Model):
    """Статус заказа"""
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    code = models.CharField(max_length=30, unique=True, verbose_name='Код')
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Статус заказа'
        verbose_name_plural = 'Статусы заказов'
        ordering = ['code']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
