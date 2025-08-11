from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Role


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'description', 'created_at']
    list_filter = ['code']
    search_fields = ['name', 'description']
    ordering = ['code']


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'first_name', 'last_name', 'email', 'phone', 'department', 'get_roles_display', 'is_active']
    list_filter = ['is_active', 'roles', 'department']
    search_fields = ['username', 'first_name', 'last_name', 'email', 'phone']
    ordering = ['username']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Дополнительная информация', {
            'fields': ('phone', 'department', 'roles')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Дополнительная информация', {
            'fields': ('phone', 'department', 'roles')
        }),
    )
    
    def get_roles_display(self, obj):
        return obj.get_roles_display()
    get_roles_display.short_description = 'Роли'
