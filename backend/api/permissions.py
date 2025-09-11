from rest_framework import permissions

class IsContentAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.roles.filter(name__endswith='_admin').exists()

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.roles.filter(name='super_admin').exists()

class IsAnyAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.roles.filter(name__endswith='_admin').exists() or
            request.user.roles.filter(name='super_admin').exists()
        )