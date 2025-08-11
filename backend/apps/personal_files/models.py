from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from simple_history.models import HistoricalRecords


class PersonalFile(models.Model):
    """Личное дело"""
    
    # Документы
    DOCUMENT_PASSPORT = 'passport'
    DOCUMENT_BIRTH_CERTIFICATE = 'birth_certificate'
    
    DOCUMENT_CHOICES = [
        (DOCUMENT_PASSPORT, _('Паспорт')),
        (DOCUMENT_BIRTH_CERTIFICATE, _('Свидетельство о рождении')),
    ]
    
    # Пол
    GENDER_MALE = 'male'
    GENDER_FEMALE = 'female'
    
    GENDER_CHOICES = [
        (GENDER_MALE, _('Мужской')),
        (GENDER_FEMALE, _('Женский')),
    ]
    
    # Серия паспорта
    PASSPORT_SERIES_CHOICES = [
        ('ID', 'ID'),
        ('AC', 'AC'),
        ('AN', 'AN'),
        ('KGZ01', 'KGZ01'),
        ('KR-X', 'KR-X'),
    ]
    
    # Категория инвалидности
    DISABILITY_CATEGORY_CHOICES = [
        ('lovz_under_18', _('ЛОВЗ до 18 лет')),
        ('lovz_from_childhood', _('ЛОВЗ с детства')),
        ('vov_invalid', _('Инвалид ВОВ')),
        ('soviet_army_invalid', _('Инвалид советской армии')),
        ('labor_invalid', _('Инвалид труда')),
    ]
    
    # Группа инвалидности
    DISABILITY_GROUP_CHOICES = [
        ('1', _('1 группа')),
        ('2', _('2 группа')),
        ('3', _('3 группа')),
    ]
    
    # Причина инвалидности
    DISABILITY_REASON_CHOICES = [
        ('trauma', _('Травма')),
        ('congenital', _('Врожденный')),
        ('disease', _('Заболевание')),
    ]
    
    # Основные поля
    file_number = models.CharField(
        max_length=20,
        unique=True,
        verbose_name=_('№ личного дела'),
        help_text=_('Формат: ГОД-НОМЕР (ХХХХ-ХХХХ)')
    )
    
    pin = models.CharField(
        max_length=14,
        validators=[
            RegexValidator(
                regex=r'^\d{14}$',
                message=_('ПИН должен содержать 14 цифр')
            )
        ],
        verbose_name=_('ПИН'),
        help_text=_('Персональный идентификационный номер')
    )
    
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_CHOICES,
        verbose_name=_('Тип документа')
    )
    
    last_name = models.CharField(
        max_length=100,
        verbose_name=_('Фамилия')
    )
    
    first_name = models.CharField(
        max_length=100,
        verbose_name=_('Имя')
    )
    
    middle_name = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Отчество')
    )
    
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        verbose_name=_('Пол')
    )
    
    birth_date = models.DateField(
        verbose_name=_('Дата рождения')
    )
    
    passport_series = models.CharField(
        max_length=10,
        choices=PASSPORT_SERIES_CHOICES,
        verbose_name=_('Серия паспорта')
    )
    
    passport_number = models.CharField(
        max_length=20,
        verbose_name=_('№ Паспорта')
    )
    
    passport_issued_by = models.CharField(
        max_length=200,
        verbose_name=_('Орган выдачи')
    )
    
    passport_issue_date = models.DateField(
        verbose_name=_('Дата выдачи паспорта')
    )
    
    pension_number = models.CharField(
        max_length=50,
        blank=True,
        verbose_name=_('№ Пенсионного удостоверения')
    )
    
    pension_issue_date = models.DateField(
        null=True,
        blank=True,
        verbose_name=_('Дата выдачи пенсионного удостоверения')
    )
    
    pension_issued_by = models.CharField(
        max_length=200,
        blank=True,
        verbose_name=_('Орган выдачи пенсионного удостоверения')
    )
    
    registration_address = models.TextField(
        verbose_name=_('Адрес по прописке')
    )
    
    actual_address = models.TextField(
        blank=True,
        verbose_name=_('Фактический адрес')
    )
    
    address_same_as_registration = models.BooleanField(
        default=False,
        verbose_name=_('Совпадает с пропиской')
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name=_('Номер телефона')
    )
    
    additional_phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name=_('Дополнительный номер телефона')
    )
    
    workplace = models.CharField(
        max_length=200,
        blank=True,
        verbose_name=_('Место работы')
    )
    
    disability_category = models.CharField(
        max_length=20,
        choices=DISABILITY_CATEGORY_CHOICES,
        verbose_name=_('Категория инвалидности')
    )
    
    disability_group = models.CharField(
        max_length=5,
        choices=DISABILITY_GROUP_CHOICES,
        verbose_name=_('Группа инвалидности')
    )
    
    disability_reason = models.CharField(
        max_length=20,
        choices=DISABILITY_REASON_CHOICES,
        blank=True,
        verbose_name=_('Причина инвалидности')
    )
    
    surgery_info = models.TextField(
        blank=True,
        verbose_name=_('Где и когда оперирован')
    )
    
    additional_info = models.TextField(
        blank=True,
        max_length=255,
        verbose_name=_('Дополнения')
    )
    
    # Системные поля
    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_personal_files',
        verbose_name=_('Создано пользователем')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Дата создания')
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Дата обновления')
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Активно')
    )
    
    # История изменений
    history = HistoricalRecords()
    
    class Meta:
        verbose_name = _('Личное дело')
        verbose_name_plural = _('Личные дела')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.file_number} - {self.last_name} {self.first_name}"
    
    def save(self, *args, **kwargs):
        if not self.file_number:
            # Автоматическая генерация номера дела
            year = self.created_at.year if self.created_at else models.timezone.now().year
            last_file = PersonalFile.objects.filter(
                file_number__startswith=f"{year}-"
            ).order_by('-file_number').first()
            
            if last_file:
                last_number = int(last_file.file_number.split('-')[1])
                new_number = last_number + 1
            else:
                new_number = 1
            
            self.file_number = f"{year}-{new_number:04d}"
        
        super().save(*args, **kwargs)


class Referral(models.Model):
    """Направление на услуги"""
    
    personal_file = models.ForeignKey(
        PersonalFile,
        on_delete=models.CASCADE,
        related_name='referrals',
        verbose_name=_('Личное дело')
    )
    
    referral_date = models.DateField(
        verbose_name=_('Дата направления')
    )
    
    diagnosis = models.CharField(
        max_length=200,
        verbose_name=_('Диагноз при направлении')
    )
    
    institution = models.CharField(
        max_length=200,
        verbose_name=_('Учреждение')
    )
    
    doctor_name = models.CharField(
        max_length=200,
        verbose_name=_('ФИО Врача')
    )
    
    service_type = models.CharField(
        max_length=100,
        verbose_name=_('Вид услуги')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Дата создания')
    )
    
    class Meta:
        verbose_name = _('Направление')
        verbose_name_plural = _('Направления')
        ordering = ['-referral_date']
    
    def __str__(self):
        return f"{self.personal_file.file_number} - {self.service_type} ({self.referral_date})"


class ProstheticsData(models.Model):
    """Данные по протезированию"""
    
    # Форма культи
    STUMP_FORM_CHOICES = [
        ('cylindrical', _('Цилиндрическая')),
        ('bulbous', _('Булавовидная')),
        ('moderately_conical', _('Умеренно-коническая')),
        ('sharply_conical', _('Резко-коническая')),
        ('excess_tissue', _('Избыток ткани')),
        ('atrophy', _('Атрофия')),
    ]
    
    # Подвижность культи
    STUMP_MOBILITY_CHOICES = [
        ('normal', _('Нормальная')),
        ('limited_movement', _('Ограничение движения')),
        ('contracture', _('Контрактура')),
    ]
    
    # Рубец
    SCAR_CHOICES = [
        ('linear', _('Линейный')),
        ('stellate', _('Звездчатый')),
        ('central', _('Центральный')),
        ('anterior', _('Передний')),
        ('posterior', _('Задний')),
        ('lateral', _('Боковой')),
        ('mobile', _('Подвижный')),
        ('adherent', _('Спаянный')),
        ('painless', _('Безболезненный')),
        ('keloid', _('Келоидный')),
    ]
    
    # Состояние кожного покрова
    SKIN_CONDITION_CHOICES = [
        ('normal', _('Нормальный')),
        ('cyanotic', _('Синюшный')),
        ('edematous', _('Отечный')),
        ('abrasions', _('Потертости')),
        ('cracks', _('Трещины')),
        ('ulcers', _('Язвы')),
        ('fistulas', _('Свищи')),
        ('neuromas', _('Невромы')),
    ]
    
    # Костный опил
    BONE_SAW_CHOICES = [
        ('painful', _('Болезненный')),
        ('painless', _('Безболезненный')),
        ('uneven', _('Неровный')),
        ('smooth', _('Гладкий')),
        ('osteophytes', _('Остеофиты')),
    ]
    
    personal_file = models.OneToOneField(
        PersonalFile,
        on_delete=models.CASCADE,
        related_name='prosthetics_data',
        verbose_name=_('Личное дело')
    )
    
    stump_length = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('Длина культи (см)')
    )
    
    stump_form = models.CharField(
        max_length=20,
        choices=STUMP_FORM_CHOICES,
        blank=True,
        verbose_name=_('Форма культи')
    )
    
    stump_mobility = models.CharField(
        max_length=20,
        choices=STUMP_MOBILITY_CHOICES,
        blank=True,
        verbose_name=_('Подвижность культи')
    )
    
    contracture_description = models.TextField(
        blank=True,
        verbose_name=_('Описание контрактуры')
    )
    
    scar = models.CharField(
        max_length=20,
        choices=SCAR_CHOICES,
        blank=True,
        verbose_name=_('Рубец')
    )
    
    skin_condition = models.CharField(
        max_length=20,
        choices=SKIN_CONDITION_CHOICES,
        blank=True,
        verbose_name=_('Состояние кожного покрова')
    )
    
    bone_saw = models.CharField(
        max_length=20,
        choices=BONE_SAW_CHOICES,
        blank=True,
        verbose_name=_('Костный опил')
    )
    
    stump_support = models.BooleanField(
        default=False,
        verbose_name=_('Опорность культи')
    )
    
    objective_data = models.TextField(
        blank=True,
        verbose_name=_('Объективные данные')
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
        verbose_name = _('Данные по протезированию')
        verbose_name_plural = _('Данные по протезированию')
    
    def __str__(self):
        return f"Данные протезирования - {self.personal_file.file_number}"
