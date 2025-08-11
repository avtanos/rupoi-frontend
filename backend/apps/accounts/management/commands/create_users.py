from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.accounts.models import UserProfile

User = get_user_model()


class Command(BaseCommand):
    help = 'Создает пользователей с разными ролями для АИС РУПОИ'

    def handle(self, *args, **options):
        users_data = [
            {
                'username': 'registry_user',
                'password': 'registry123',
                'first_name': 'Анна',
                'last_name': 'Петрова',
                'email': 'registry@rupoi.kz',
                'role': 'registry',
                'department': 'Регистратура',
                'phone': '+7-701-123-45-67',
                'bio': 'Сотрудник регистратуры. Обработка персональных дел пациентов.'
            },
            {
                'username': 'medical_user',
                'password': 'medical123',
                'first_name': 'Доктор',
                'last_name': 'Иванов',
                'email': 'medical@rupoi.kz',
                'role': 'medical',
                'department': 'Медицинский отдел',
                'phone': '+7-701-234-56-78',
                'bio': 'Врач-ортопед. Осмотр пациентов и назначение протезно-ортопедических изделий.'
            },
            {
                'username': 'workshop_user',
                'password': 'workshop123',
                'first_name': 'Мастер',
                'last_name': 'Сидоров',
                'email': 'workshop@rupoi.kz',
                'role': 'workshop',
                'department': 'Производственные мастерские',
                'phone': '+7-701-345-67-89',
                'bio': 'Мастер-протезист. Изготовление протезно-ортопедических изделий.'
            },
            {
                'username': 'warehouse_user',
                'password': 'warehouse123',
                'first_name': 'Кладовщик',
                'last_name': 'Козлов',
                'email': 'warehouse@rupoi.kz',
                'role': 'warehouse',
                'department': 'Склад готовой продукции',
                'phone': '+7-701-456-78-90',
                'bio': 'Кладовщик склада готовой продукции. Учет и выдача изделий.'
            },
            {
                'username': 'admin_user',
                'password': 'admin123',
                'first_name': 'Администратор',
                'last_name': 'Смирнов',
                'email': 'admin@rupoi.kz',
                'role': 'admin',
                'department': 'Администрация',
                'phone': '+7-701-567-89-01',
                'bio': 'Системный администратор. Полный доступ к системе.'
            },
            {
                'username': 'registry_user2',
                'password': 'registry456',
                'first_name': 'Елена',
                'last_name': 'Соколова',
                'email': 'registry2@rupoi.kz',
                'role': 'registry',
                'department': 'Регистратура',
                'phone': '+7-701-678-90-12',
                'bio': 'Сотрудник регистратуры. Обработка персональных дел пациентов.'
            },
            {
                'username': 'medical_user2',
                'password': 'medical456',
                'first_name': 'Доктор',
                'last_name': 'Попов',
                'email': 'medical2@rupoi.kz',
                'role': 'medical',
                'department': 'Медицинский отдел',
                'phone': '+7-701-789-01-23',
                'bio': 'Врач-ортопед. Осмотр пациентов и назначение протезно-ортопедических изделий.'
            },
            {
                'username': 'workshop_user2',
                'password': 'workshop456',
                'first_name': 'Мастер',
                'last_name': 'Новиков',
                'email': 'workshop2@rupoi.kz',
                'role': 'workshop',
                'department': 'Производственные мастерские',
                'phone': '+7-701-890-12-34',
                'bio': 'Мастер-протезист. Изготовление протезно-ортопедических изделий.'
            }
        ]

        created_count = 0
        updated_count = 0

        for user_data in users_data:
            username = user_data['username']
            
            # Проверяем, существует ли пользователь
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'email': user_data['email'],
                    'role': user_data['role'],
                    'department': user_data['department'],
                    'phone': user_data['phone'],
                    'is_staff': user_data['role'] == 'admin',
                    'is_superuser': user_data['role'] == 'admin',
                }
            )

            if created:
                # Устанавливаем пароль для нового пользователя
                user.set_password(user_data['password'])
                user.save()
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Создан пользователь: {username} (роль: {user_data["role"]})')
                )
            else:
                # Обновляем существующего пользователя
                user.first_name = user_data['first_name']
                user.last_name = user_data['last_name']
                user.email = user_data['email']
                user.role = user_data['role']
                user.department = user_data['department']
                user.phone = user_data['phone']
                user.is_staff = user_data['role'] == 'admin'
                user.is_superuser = user_data['role'] == 'admin'
                user.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Обновлен пользователь: {username} (роль: {user_data["role"]})')
                )

            # Создаем или обновляем профиль пользователя
            profile, profile_created = UserProfile.objects.get_or_create(
                user=user,
                defaults={'bio': user_data['bio']}
            )
            
            if not profile_created:
                profile.bio = user_data['bio']
                profile.save()

        self.stdout.write(
            self.style.SUCCESS(
                f'\nГотово! Создано пользователей: {created_count}, обновлено: {updated_count}'
            )
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                '\nДанные для входа:\n'
                'Регистратура: registry_user / registry123\n'
                'Медицинский отдел: medical_user / medical123\n'
                'Мастерские: workshop_user / workshop123\n'
                'Склад: warehouse_user / warehouse123\n'
                'Администратор: admin_user / admin123'
            )
        )
