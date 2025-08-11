from rest_framework import permissions


class HasRolePermission(permissions.BasePermission):
    """Разрешение на основе роли пользователя"""
    
    def __init__(self, required_roles=None):
        self.required_roles = required_roles or []
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Администратор имеет доступ ко всему
        if request.user.has_role('ADMIN'):
            return True
        
        # Проверяем наличие требуемых ролей
        if self.required_roles:
            return any(request.user.has_role(role) for role in self.required_roles)
        
        return True


class RegistryPermission(HasRolePermission):
    """Разрешения для регистратуры"""
    required_roles = ['REGISTRY', 'ADMIN']


class MedicalPermission(HasRolePermission):
    """Разрешения для медицинского персонала"""
    required_roles = ['MED', 'ADMIN']


class WorkshopPermission(HasRolePermission):
    """Разрешения для цеха"""
    required_roles = ['WORKSHOP', 'ADMIN']


class WarehousePermission(HasRolePermission):
    """Разрешения для склада"""
    required_roles = ['WAREHOUSE', 'ADMIN']


class AdminPermission(HasRolePermission):
    """Разрешения для администраторов"""
    required_roles = ['ADMIN']
