from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role
from dictionaries.models import Workshop, OrderStatus, TSRCategory

User = get_user_model()


class Command(BaseCommand):
    help = 'Инициализация базовых данных системы'

    def handle(self, *args, **options):
        self.stdout.write('Создание ролей...')
        
        # Создаем роли
        roles_data = [
            {'code': 'REGISTRY', 'name': 'Регистратура', 'description': 'Доступ к личным делам'},
            {'code': 'MED', 'name': 'Медицинский персонал', 'description': 'Доступ к заказам и личным делам'},
            {'code': 'WORKSHOP', 'name': 'Цех', 'description': 'Доступ к заказам и накладным'},
            {'code': 'WAREHOUSE', 'name': 'Склад', 'description': 'Доступ к складу и выдаче'},
            {'code': 'ADMIN', 'name': 'Администратор', 'description': 'Полный доступ ко всем модулям'},
        ]
        
        for role_data in roles_data:
            role, created = Role.objects.get_or_create(
                code=role_data['code'],
                defaults=role_data
            )
            if created:
                self.stdout.write(f'Создана роль: {role.name}')
            else:
                self.stdout.write(f'Роль уже существует: {role.name}')
        
        self.stdout.write('Создание пользователей...')
        
        # Создаем тестовых пользователей
        users_data = [
            {
                'username': 'admin',
                'password': 'admin123',
                'first_name': 'Администратор',
                'last_name': 'Системы',
                'email': 'admin@rupoi.kg',
                'roles': ['ADMIN']
            },
            {
                'username': 'registry',
                'password': 'registry123',
                'first_name': 'Регистратор',
                'last_name': 'Тестовый',
                'email': 'registry@rupoi.kg',
                'roles': ['REGISTRY']
            },
            {
                'username': 'med',
                'password': 'med123',
                'first_name': 'Врач',
                'last_name': 'Тестовый',
                'email': 'med@rupoi.kg',
                'roles': ['MED']
            },
            {
                'username': 'workshop',
                'password': 'workshop123',
                'first_name': 'Мастер',
                'last_name': 'Тестовый',
                'email': 'workshop@rupoi.kg',
                'roles': ['WORKSHOP']
            },
            {
                'username': 'warehouse',
                'password': 'warehouse123',
                'first_name': 'Кладовщик',
                'last_name': 'Тестовый',
                'email': 'warehouse@rupoi.kg',
                'roles': ['WAREHOUSE']
            },
        ]
        
        for user_data in users_data:
            roles = user_data.pop('roles')
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                # Добавляем роли
                for role_code in roles:
                    role = Role.objects.get(code=role_code)
                    user.roles.add(role)
                self.stdout.write(f'Создан пользователь: {user.username}')
            else:
                self.stdout.write(f'Пользователь уже существует: {user.username}')
        
        self.stdout.write('Создание справочников...')
        
        # Создаем цеха
        workshops_data = [
            {'code': 'PROSTHESIS', 'name': 'Протезный цех', 'description': 'Изготовление протезов'},
            {'code': 'SHOES', 'name': 'Обувной цех', 'description': 'Изготовление ортопедической обуви'},
            {'code': 'OTTOBOCK', 'name': 'Otto Bock', 'description': 'Изготовление изделий Otto Bock'},
            {'code': 'REPAIR', 'name': 'Ремонтный цех', 'description': 'Ремонт ТСР'},
        ]
        
        for workshop_data in workshops_data:
            workshop, created = Workshop.objects.get_or_create(
                code=workshop_data['code'],
                defaults=workshop_data
            )
            if created:
                self.stdout.write(f'Создан цех: {workshop.name}')
            else:
                self.stdout.write(f'Цех уже существует: {workshop.name}')
        
        # Создаем статусы заказов
        order_statuses_data = [
            {'code': 'DRAFT', 'name': 'Черновик', 'description': 'Заказ в черновике'},
            {'code': 'IN_WORK', 'name': 'В работе', 'description': 'Заказ в производстве'},
            {'code': 'WAITING_FITTING', 'name': 'Ожидает примерки', 'description': 'Готов к примерке'},
            {'code': 'ON_REWORK', 'name': 'На доработке', 'description': 'Требует доработки'},
            {'code': 'READY_FOR_TRANSFER', 'name': 'Готов к передаче', 'description': 'Готов к передаче на склад'},
            {'code': 'TRANSFERRED_TO_WAREHOUSE', 'name': 'Передан на склад', 'description': 'Передан на склад'},
            {'code': 'ISSUED', 'name': 'Выдан', 'description': 'Изделие выдано пациенту'},
            {'code': 'CANCELED', 'name': 'Отменен', 'description': 'Заказ отменен'},
        ]
        
        for status_data in order_statuses_data:
            status, created = OrderStatus.objects.get_or_create(
                code=status_data['code'],
                defaults=status_data
            )
            if created:
                self.stdout.write(f'Создан статус: {status.name}')
            else:
                self.stdout.write(f'Статус уже существует: {status.name}')
        
        # Создаем категории ТСР
        tsr_categories_data = [
            {'code': 'PROSTHESIS', 'name': 'Протезы', 'description': 'Протезы конечностей'},
            {'code': 'ORTHOSES', 'name': 'Ортезы', 'description': 'Ортопедические изделия'},
            {'code': 'SHOES', 'name': 'Ортопедическая обувь', 'description': 'Специальная обувь'},
            {'code': 'WHEELCHAIRS', 'name': 'Инвалидные коляски', 'description': 'Кресла-коляски'},
            {'code': 'CRUTCHES', 'name': 'Костыли и трости', 'description': 'Средства опоры'},
            {'code': 'OTHER', 'name': 'Прочее', 'description': 'Другие ТСР'},
        ]
        
        for category_data in tsr_categories_data:
            category, created = TSRCategory.objects.get_or_create(
                code=category_data['code'],
                defaults=category_data
            )
            if created:
                self.stdout.write(f'Создана категория: {category.name}')
            else:
                self.stdout.write(f'Категория уже существует: {category.name}')
        
        self.stdout.write(
            self.style.SUCCESS('Инициализация данных завершена успешно!')
        )
