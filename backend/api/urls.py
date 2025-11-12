from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# 创建一个路由器来处理视图集
router = DefaultRouter()
router.register(r'admin/users', views.UserAdminViewSet)
router.register(r'admin/invitation-codes', views.InvitationCodeViewSet)

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path('profile/', views.UserProfileUpdateView.as_view(), name='user-profile'),

    # 新增的路由：用于获取当前用户信息
    path('me/', views.UserDetailView.as_view(), name='user-me'),
    
    # 管理员相关路由
    path('admin/issues/', views.admin_issues_list, name='admin-issues-list'),
    path('admin/issues/<int:issue_id>/reply/', views.admin_reply_issue, name='admin-reply-issue'),
    
    # 邀请码相关路由
    path('validate-invitation-code/', views.validate_invitation_code, name='validate-invitation-code'),
    
    # 包含由路由器生成的管理员用户管理路由
    path('', include(router.urls)),
]