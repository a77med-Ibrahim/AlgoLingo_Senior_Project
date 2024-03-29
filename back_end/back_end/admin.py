from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserAccount

class UserAccountAdmin(UserAdmin):
    model = UserAccount
    list_display = ['email', 'name', 'is_active', 'is_staff']
    # Specify the field to use for ordering user entries; in this case, 'email'
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'name', 'is_active', 'is_staff')}),
        ('Permissions', {'fields': ('is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password', 're_password'),
        }),
    )
    search_fields = ('email', 'name')
    list_filter = ('is_active', 'is_staff', 'is_superuser')

admin.site.register(UserAccount, UserAccountAdmin)