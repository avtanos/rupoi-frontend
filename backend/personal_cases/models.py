from django.db import models
from utils import generate_uuid, generate_personal_case_number


class PersonalCase(models.Model):
    """Личное дело пациента"""
    
    DISABILITY_GROUP_CHOICES = [
        ('NONE', 'Не установлена'),
        ('I', 'I группа'),
        ('II', 'II группа'),
        ('III', 'III группа'),
        ('CHILD', 'Ребёнок-инвалид'),
    ]
    
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    number = models.CharField(max_length=20, unique=True, blank=True, verbose_name='Номер дела')
    pin = models.CharField(max_length=14, verbose_name='ПИН')
    last_name = models.CharField(max_length=100, verbose_name='Фамилия')
    first_name = models.CharField(max_length=100, verbose_name='Имя')
    middle_name = models.CharField(max_length=100, blank=True, verbose_name='Отчество')
    sex = models.CharField(max_length=1, choices=[('M', 'Мужской'), ('F', 'Женский')], verbose_name='Пол')
    birth_date = models.DateField(verbose_name='Дата рождения')
    
    address_registration = models.TextField(verbose_name='Адрес регистрации')
    address_actual = models.TextField(blank=True, verbose_name='Адрес проживания')
    
    phone = models.CharField(max_length=20, blank=True, verbose_name='Телефон')
    email = models.EmailField(blank=True, verbose_name='Email')
    
    disability_group = models.CharField(
        max_length=10, 
        choices=DISABILITY_GROUP_CHOICES, 
        default='NONE',
        verbose_name='Группа инвалидности'
    )
    msek_number = models.CharField(max_length=50, blank=True, verbose_name='Номер МСЭК')
    msek_date = models.DateField(null=True, blank=True, verbose_name='Дата МСЭК')
    
    ipra_number = models.CharField(max_length=50, blank=True, verbose_name='Номер ИПРА')
    ipra_date = models.DateField(null=True, blank=True, verbose_name='Дата ИПРА')
    ipra_valid_to = models.DateField(null=True, blank=True, verbose_name='Срок действия ИПРА')
    
    notes = models.TextField(blank=True, verbose_name='Примечания')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Личное дело'
        verbose_name_plural = 'Личные дела'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['pin']),
            models.Index(fields=['last_name', 'first_name']),
            models.Index(fields=['disability_group']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.number} - {self.last_name} {self.first_name}"
    
    def save(self, *args, **kwargs):
        if not self.number:
            self.number = generate_personal_case_number()
        super().save(*args, **kwargs)
    
    @property
    def full_name(self):
        """Полное имя пациента"""
        parts = [self.last_name, self.first_name]
        if self.middle_name:
            parts.append(self.middle_name)
        return ' '.join(parts)
    
    @property
    def age(self):
        """Возраст пациента"""
        from datetime import date
        today = date.today()
        return today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))
