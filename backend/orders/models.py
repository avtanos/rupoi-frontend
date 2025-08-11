from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from utils import generate_uuid, generate_order_number


class Order(models.Model):
    """Заказ/наряд на изготовление ТСР"""
    
    TYPE_CHOICES = [
        ('PROSTHESIS', 'Протез'),
        ('SHOES', 'Ортопедическая обувь'),
        ('OTTOBOCK', 'Otto Bock'),
        ('REPAIR', 'Ремонт'),
        ('READY_TSR', 'Готовое ТСР'),
    ]
    
    WORKSHOP_CHOICES = [
        ('PROSTHESIS', 'Протезный цех'),
        ('SHOES', 'Обувной цех'),
        ('OTTOBOCK', 'Otto Bock'),
        ('REPAIR', 'Ремонтный цех'),
    ]
    
    URGENCY_CHOICES = [
        ('NORMAL', 'Обычный'),
        ('URGENT', 'Срочный'),
    ]
    
    PAYMENT_TYPE_CHOICES = [
        ('FREE', 'Бесплатно'),
        ('PARTIAL', 'Частичная оплата'),
        ('PAID', 'Полная оплата'),
    ]
    
    STATUS_CHOICES = [
        ('DRAFT', 'Черновик'),
        ('IN_WORK', 'В работе'),
        ('WAITING_FITTING', 'Ожидает примерки'),
        ('ON_REWORK', 'На доработке'),
        ('READY_FOR_TRANSFER', 'Готов к передаче'),
        ('TRANSFERRED_TO_WAREHOUSE', 'Передан на склад'),
        ('ISSUED', 'Выдан'),
        ('CANCELED', 'Отменен'),
    ]
    
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    personal_case = models.ForeignKey(
        'personal_cases.PersonalCase', 
        on_delete=models.CASCADE, 
        verbose_name='Личное дело'
    )
    order_number = models.CharField(max_length=20, unique=True, blank=True, verbose_name='Номер заказа')
    
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name='Тип заказа')
    primary_flag = models.BooleanField(default=True, verbose_name='Первичный случай')
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='NORMAL', verbose_name='Срочность')
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPE_CHOICES, default='FREE', verbose_name='Тип оплаты')
    
    amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name='Сумма'
    )
    workshop = models.CharField(max_length=20, choices=WORKSHOP_CHOICES, verbose_name='Цех')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='DRAFT', verbose_name='Статус')
    
    diagnosis = models.CharField(max_length=100, blank=True, verbose_name='Диагноз (МКБ)')
    category = models.CharField(max_length=100, blank=True, verbose_name='Категория')
    item_name = models.CharField(max_length=200, blank=True, verbose_name='Название изделия')
    
    master_name = models.CharField(max_length=100, blank=True, verbose_name='Мастер')
    
    planned_manufacture_date = models.DateField(null=True, blank=True, verbose_name='Планируемая дата изготовления')
    planned_issue_date = models.DateField(null=True, blank=True, verbose_name='Планируемая дата выдачи')
    
    # Примерки
    fitting1_call = models.DateTimeField(null=True, blank=True, verbose_name='1-я примерка - звонок')
    fitting1_visit = models.DateTimeField(null=True, blank=True, verbose_name='1-я примерка - визит')
    fitting2_call = models.DateTimeField(null=True, blank=True, verbose_name='2-я примерка - звонок')
    fitting2_visit = models.DateTimeField(null=True, blank=True, verbose_name='2-я примерка - визит')
    fitting3_call = models.DateTimeField(null=True, blank=True, verbose_name='3-я примерка - звонок')
    fitting3_visit = models.DateTimeField(null=True, blank=True, verbose_name='3-я примерка - визит')
    
    # Спецификация в JSON
    spec = models.JSONField(default=dict, blank=True, verbose_name='Спецификация')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['personal_case']),
            models.Index(fields=['type']),
            models.Index(fields=['status']),
            models.Index(fields=['workshop']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.order_number} - {self.personal_case.full_name}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = generate_order_number()
        super().save(*args, **kwargs)
    
    @property
    def patient_name(self):
        """Имя пациента"""
        return self.personal_case.full_name
    
    @property
    def patient_pin(self):
        """ПИН пациента"""
        return self.personal_case.pin
