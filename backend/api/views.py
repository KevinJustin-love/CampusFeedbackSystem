from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import RegisterSerializer, UserUpdateSerializer
from .models import CustomUser

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # 将用户信息添加到令牌的自定义载荷中
        token['username'] = user.username
        
        # 根据用户名设置不同的角色
        if user.username == 'lifeAdmin':
            token['role'] = 'life_admin'
        elif user.username == 'studyAdmin':
            token['role'] = 'study_admin'
        elif user.username == 'manageAdmin':
            token['role'] = 'manage_admin'
        else:
            token['role'] = 'student'  # 默认角色为student
        
        return token

# 创建一个自定义视图，使用你的序列化器
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
    