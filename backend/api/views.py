# myapp/views.py
from django.shortcuts import render
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import (
    RegisterSerializer, 
    UserUpdateSerializer, 
    UserSerializer, 
    UserAdminUpdateSerializer
)
from .permissions import IsSuperAdmin, IsAnyAdmin # 确保你已经创建了这些权限类
from .models import CustomUser

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # 将用户信息添加到令牌的自定义载荷中
        token['username'] = user.username
        
        # 1. 从用户的多对多关系中动态获取角色
        #    并将其作为列表添加到令牌载荷中
        roles = [role.name for role in user.roles.all()]
        token['roles'] = roles
        
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

# 2. 新增的视图：用于获取当前登录用户的详细信息
class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# 3. 新增的视图集：用于管理员管理用户
class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserAdminUpdateSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]