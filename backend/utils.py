import uuid
from datetime import datetime
from django.db import transaction
from django.db.models import Max


def generate_personal_case_number():
    """Генерация номера личного дела в формате YYYY-XXXX"""
    current_year = datetime.now().year
    
    # Получаем максимальный номер для текущего года
    from personal_cases.models import PersonalCase
    
    max_number = PersonalCase.objects.filter(
        number__startswith=f"{current_year}-"
    ).aggregate(Max('number'))['number__max']
    
    if max_number:
        # Извлекаем номер из строки YYYY-XXXX
        try:
            last_sequence = int(max_number.split('-')[1])
            new_sequence = last_sequence + 1
        except (IndexError, ValueError):
            new_sequence = 1
    else:
        new_sequence = 1
    
    return f"{current_year}-{new_sequence:04d}"


def generate_order_number():
    """Генерация номера заказа в формате ORD-YYYY-NNNN"""
    current_year = datetime.now().year
    
    # Получаем максимальный номер для текущего года
    from orders.models import Order
    
    max_number = Order.objects.filter(
        order_number__startswith=f"ORD-{current_year}-"
    ).aggregate(Max('order_number'))['order_number__max']
    
    if max_number:
        # Извлекаем номер из строки ORD-YYYY-NNNN
        try:
            last_sequence = int(max_number.split('-')[2])
            new_sequence = last_sequence + 1
        except (IndexError, ValueError):
            new_sequence = 1
    else:
        new_sequence = 1
    
    return f"ORD-{current_year}-{new_sequence:04d}"


def generate_invoice_number():
    """Генерация номера накладной в формате INV-YYYY-NNNN"""
    current_year = datetime.now().year
    
    # Получаем максимальный номер для текущего года
    from invoices.models import Invoice
    
    max_number = Invoice.objects.filter(
        invoice_number__startswith=f"INV-{current_year}-"
    ).aggregate(Max('invoice_number'))['invoice_number__max']
    
    if max_number:
        # Извлекаем номер из строки INV-YYYY-NNNN
        try:
            last_sequence = int(max_number.split('-')[2])
            new_sequence = last_sequence + 1
        except (IndexError, ValueError):
            new_sequence = 1
    else:
        new_sequence = 1
    
    return f"INV-{current_year}-{new_sequence:04d}"


def generate_uuid():
    """Генерация UUID"""
    return uuid.uuid4()
