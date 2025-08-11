from django.db import models
from utils import generate_uuid, generate_invoice_number


class Invoice(models.Model):
    """Накладная на передачу ТСР на склад"""
    
    WORKSHOP_CHOICES = [
        ('PROSTHESIS', 'Протезный цех'),
        ('SHOES', 'Обувной цех'),
        ('OTTOBOCK', 'Otto Bock'),
        ('REPAIR', 'Ремонтный цех'),
    ]
    
    STATUS_CHOICES = [
        ('ON_ISSUE', 'На выдаче'),
        ('ISSUED', 'Выдано'),
        ('CANCELED', 'Отменено'),
    ]
    
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, verbose_name='Заказ')
    invoice_number = models.CharField(max_length=20, unique=True, blank=True, verbose_name='Номер накладной')
    
    date = models.DateField(verbose_name='Дата накладной')
    sender_workshop = models.CharField(max_length=20, choices=WORKSHOP_CHOICES, verbose_name='Отправитель (цех)')
    receiver = models.CharField(max_length=20, default='WAREHOUSE', verbose_name='Получатель')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ON_ISSUE', verbose_name='Статус')
    
    comment = models.TextField(blank=True, verbose_name='Комментарий')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Накладная'
        verbose_name_plural = 'Накладные'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['invoice_number']),
            models.Index(fields=['order']),
            models.Index(fields=['sender_workshop']),
            models.Index(fields=['status']),
            models.Index(fields=['date']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.invoice_number} - {self.order.order_number}"
    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            self.invoice_number = generate_invoice_number()
        
        # При создании накладной обновляем статус заказа
        if not self.pk:  # Новый объект
            self.order.status = 'TRANSFERRED_TO_WAREHOUSE'
            self.order.save(update_fields=['status'])
        
        super().save(*args, **kwargs)
    
    @property
    def patient_name(self):
        """Имя пациента"""
        return self.order.patient_name
    
    @property
    def patient_pin(self):
        """ПИН пациента"""
        return self.order.patient_pin
    
    @property
    def order_number(self):
        """Номер заказа"""
        return self.order.order_number
