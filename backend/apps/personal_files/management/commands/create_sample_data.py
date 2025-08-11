from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.personal_files.models import PersonalFile, Referral, ProstheticsData
from datetime import date, timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Создает тестовые данные персональных дел для АИС РУПОИ'

    def handle(self, *args, **options):
        # Получаем пользователей для назначения
        registry_users = User.objects.filter(role='registry')
        medical_users = User.objects.filter(role='medical')
        
        if not registry_users.exists():
            self.stdout.write(
                self.style.ERROR('Ошибка: Нет пользователей с ролью "registry". Сначала создайте пользователей.')
            )
            return
            
        if not medical_users.exists():
            self.stdout.write(
                self.style.ERROR('Ошибка: Нет пользователей с ролью "medical". Сначала создайте пользователей.')
            )
            return

        # Данные для создания персональных дел
        sample_data = [
            {
                'pin': '123456789012',
                'document_type': 'id_card',
                'last_name': 'Иванов',
                'first_name': 'Иван',
                'middle_name': 'Иванович',
                'birth_date': date(1985, 5, 15),
                'gender': 'male',
                'disability_category': 'first',
                'disability_group': 'first',
                'disability_reason': 'general_disease',
                'disability_date': date(2020, 3, 10),
                're_examination_date': date(2023, 3, 10),
                'address': 'г. Алматы, ул. Абая, д. 123, кв. 45',
                'phone': '+7-701-111-22-33',
                'status': 'active',
                'notes': 'Пациент нуждается в протезе нижней конечности'
            },
            {
                'pin': '987654321098',
                'document_type': 'passport',
                'last_name': 'Петрова',
                'first_name': 'Мария',
                'middle_name': 'Сергеевна',
                'birth_date': date(1978, 12, 3),
                'gender': 'female',
                'disability_category': 'second',
                'disability_group': 'second',
                'disability_reason': 'work_injury',
                'disability_date': date(2019, 7, 22),
                're_examination_date': date(2022, 7, 22),
                'address': 'г. Алматы, ул. Достык, д. 456, кв. 78',
                'phone': '+7-701-222-33-44',
                'status': 'active',
                'notes': 'Требуется ортопедическая обувь'
            },
            {
                'pin': '456789123456',
                'document_type': 'id_card',
                'last_name': 'Сидоров',
                'first_name': 'Алексей',
                'middle_name': 'Петрович',
                'birth_date': date(1992, 8, 20),
                'gender': 'male',
                'disability_category': 'third',
                'disability_group': 'third',
                'disability_reason': 'military_injury',
                'disability_date': date(2021, 1, 15),
                're_examination_date': date(2024, 1, 15),
                'address': 'г. Алматы, ул. Фурманова, д. 789, кв. 12',
                'phone': '+7-701-333-44-55',
                'status': 'active',
                'notes': 'Протез верхней конечности'
            },
            {
                'pin': '789123456789',
                'document_type': 'passport',
                'last_name': 'Козлова',
                'first_name': 'Елена',
                'middle_name': 'Александровна',
                'birth_date': date(1980, 4, 8),
                'gender': 'female',
                'disability_category': 'first',
                'disability_group': 'first',
                'disability_reason': 'general_disease',
                'disability_date': date(2020, 11, 5),
                're_examination_date': date(2023, 11, 5),
                'address': 'г. Алматы, ул. Толе би, д. 321, кв. 67',
                'phone': '+7-701-444-55-66',
                'status': 'closed',
                'notes': 'Дело закрыто - пациент получил протез'
            },
            {
                'pin': '321654987321',
                'document_type': 'id_card',
                'last_name': 'Новиков',
                'first_name': 'Дмитрий',
                'middle_name': 'Владимирович',
                'birth_date': date(1975, 9, 12),
                'gender': 'male',
                'disability_category': 'second',
                'disability_group': 'second',
                'disability_reason': 'work_injury',
                'disability_date': date(2018, 6, 18),
                're_examination_date': date(2021, 6, 18),
                'address': 'г. Алматы, ул. Саина, д. 654, кв. 34',
                'phone': '+7-701-555-66-77',
                'status': 'urgent',
                'notes': 'СРОЧНО - требуется замена протеза'
            },
            {
                'pin': '654321987654',
                'document_type': 'passport',
                'last_name': 'Смирнова',
                'first_name': 'Ольга',
                'middle_name': 'Ивановна',
                'birth_date': date(1988, 2, 25),
                'gender': 'female',
                'disability_category': 'third',
                'disability_group': 'third',
                'disability_reason': 'general_disease',
                'disability_date': date(2022, 4, 30),
                're_examination_date': date(2025, 4, 30),
                'address': 'г. Алматы, ул. Байтурсынова, д. 147, кв. 89',
                'phone': '+7-701-666-77-88',
                'status': 'active',
                'notes': 'Ортопедические стельки'
            },
            {
                'pin': '147258369147',
                'document_type': 'id_card',
                'last_name': 'Попов',
                'first_name': 'Сергей',
                'middle_name': 'Андреевич',
                'birth_date': date(1983, 11, 7),
                'gender': 'male',
                'disability_category': 'first',
                'disability_group': 'first',
                'disability_reason': 'military_injury',
                'disability_date': date(2021, 8, 12),
                're_examination_date': date(2024, 8, 12),
                'address': 'г. Алматы, ул. Гагарина, д. 258, кв. 56',
                'phone': '+7-701-777-88-99',
                'status': 'active',
                'notes': 'Протез с микропроцессорным управлением'
            },
            {
                'pin': '258369147258',
                'document_type': 'passport',
                'last_name': 'Волкова',
                'first_name': 'Наталья',
                'middle_name': 'Петровна',
                'birth_date': date(1990, 6, 18),
                'gender': 'female',
                'disability_category': 'second',
                'disability_group': 'second',
                'disability_reason': 'work_injury',
                'disability_date': date(2020, 12, 3),
                're_examination_date': date(2023, 12, 3),
                'address': 'г. Алматы, ул. Розыбакиева, д. 369, кв. 23',
                'phone': '+7-701-888-99-00',
                'status': 'urgent',
                'notes': 'СРОЧНО - поломка протеза'
            }
        ]

        created_count = 0
        updated_count = 0

        for data in sample_data:
            # Проверяем, существует ли персональное дело
            personal_file, created = PersonalFile.objects.get_or_create(
                pin=data['pin'],
                defaults={
                    'document_type': data['document_type'],
                    'last_name': data['last_name'],
                    'first_name': data['first_name'],
                    'middle_name': data['middle_name'],
                    'birth_date': data['birth_date'],
                    'gender': data['gender'],
                    'disability_category': data['disability_category'],
                    'disability_group': data['disability_group'],
                    'disability_reason': data['disability_reason'],
                    'disability_date': data['disability_date'],
                    're_examination_date': data['re_examination_date'],
                    'address': data['address'],
                    'phone': data['phone'],
                    'status': data['status'],
                    'notes': data['notes'],
                    'created_by': random.choice(registry_users),
                    'updated_by': random.choice(registry_users)
                }
            )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Создано персональное дело: {data["last_name"]} {data["first_name"]} (ПИН: {data["pin"]})')
                )
            else:
                # Обновляем существующее дело
                personal_file.document_type = data['document_type']
                personal_file.last_name = data['last_name']
                personal_file.first_name = data['first_name']
                personal_file.middle_name = data['middle_name']
                personal_file.birth_date = data['birth_date']
                personal_file.gender = data['gender']
                personal_file.disability_category = data['disability_category']
                personal_file.disability_group = data['disability_group']
                personal_file.disability_reason = data['disability_reason']
                personal_file.disability_date = data['disability_date']
                personal_file.re_examination_date = data['re_examination_date']
                personal_file.address = data['address']
                personal_file.phone = data['phone']
                personal_file.status = data['status']
                personal_file.notes = data['notes']
                personal_file.updated_by = random.choice(registry_users)
                personal_file.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Обновлено персональное дело: {data["last_name"]} {data["first_name"]} (ПИН: {data["pin"]})')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nГотово! Создано персональных дел: {created_count}, обновлено: {updated_count}'
            )
        )
