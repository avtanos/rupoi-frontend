from django.db import models
from utils import generate_uuid


class WarehouseEntry(models.Model):
    """Складская позиция"""
    
    STATUS_CHOICES = [
        ('ON_STOCK', 'На складе'),
        ('RESERVED', 'Зарезервировано'),
        ('ISSUED', 'Выдано'),
    ]
    
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    invoice = models.ForeignKey('invoices.Invoice', on_delete=models.CASCADE, verbose_name='Накладная')
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, verbose_name='Заказ')
    
    product_name = models.CharField(max_length=200, verbose_name='Название изделия')
    serial_number = models.CharField(max_length=100, blank=True, verbose_name='Серийный номер')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ON_STOCK', verbose_name='Статус')
    
    arrived_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата поступления')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Складская позиция'
        verbose_name_plural = 'Складские позиции'
        ordering = ['-arrived_at']
        indexes = [
            models.Index(fields=['invoice']),
            models.Index(fields=['order']),
            models.Index(fields=['status']),
            models.Index(fields=['arrived_at']),
        ]
    
    def __str__(self):
        return f"{self.product_name} - {self.invoice.invoice_number}"
    
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
    
    @property
    def invoice_number(self):
        """Номер накладной"""
        return self.invoice.invoice_number


class Issue(models.Model):
    """Выдача ТСР"""
    
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    warehouse_entry = models.ForeignKey(WarehouseEntry, on_delete=models.CASCADE, verbose_name='Складская позиция')
    
    issued_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата выдачи')
    receiver_fio = models.CharField(max_length=200, verbose_name='ФИО получателя')
    document_ref = models.CharField(max_length=100, blank=True, verbose_name='Документ получателя')
    comment = models.TextField(blank=True, verbose_name='Комментарий')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Выдача'
        verbose_name_plural = 'Выдачи'
        ordering = ['-issued_at']
        indexes = [
            models.Index(fields=['warehouse_entry']),
            models.Index(fields=['issued_at']),
            models.Index(fields=['receiver_fio']),
        ]
    
    def __str__(self):
        return f"Выдача {self.warehouse_entry.product_name} - {self.receiver_fio}"
    
    def save(self, *args, **kwargs):
        # При создании выдачи обновляем статус складской позиции и заказа
        if not self.pk:  # Новый объект
            self.warehouse_entry.status = 'ISSUED'
            self.warehouse_entry.save(update_fields=['status'])
            
            # Обновляем статус заказа на "Выдан"
            self.warehouse_entry.order.status = 'ISSUED'
            self.warehouse_entry.order.save(update_fields=['status'])
        
        super().save(*args, **kwargs)
    
    @property
    def patient_name(self):
        """Имя пациента"""
        return self.warehouse_entry.patient_name
    
    @property
    def patient_pin(self):
        """ПИН пациента"""
        return self.warehouse_entry.patient_pin
    
    @property
    def order_number(self):
        """Номер заказа"""
        return self.warehouse_entry.order_number
    
    @property
    def invoice_number(self):
        """Номер накладной"""
        return self.warehouse_entry.invoice_number
    
    @property
    def product_name(self):
        """Название изделия"""
        return self.warehouse_entry.product_name
