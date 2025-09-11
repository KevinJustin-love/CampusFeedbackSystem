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
from .permissions import IsSuperAdmin, IsAnyAdmin, IsContentAdmin # 确保你已经创建了这些权限类
from .models import CustomUser

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 将用户信息添加到令牌的自定义载荷中
        token['username'] = user.username

        # 获取用户的所有角色名称
        roles = [role.name for role in user.roles.all()]
        token['roles'] = roles

        # 新增：从用户的角色中获取所有相关的主题
        topics = [role.topic for role in user.roles.all() if role.topic]
        token['topics'] = topics

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

# 4. 管理员问题管理视图
from rest_framework.decorators import api_view, permission_classes
from feedback.models import Issue, Reply
from feedback.serializers import IssueSerializer, ReplySerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAnyAdmin])
def admin_issues_list(request):
    """管理员获取问题列表，根据角色过滤"""
    user = request.user
    user_roles = [role.name for role in user.roles.all()]
    user_topics = [role.topic for role in user.roles.all() if role.topic]
    
    # 如果是超级管理员，显示所有问题
    if 'super_admin' in user_roles:
        issues = Issue.objects.filter(is_public=True)
    else:
        # 内容管理员只能看到自己负责的分类
        issues = Issue.objects.filter(is_public=True, topic__name__in=user_topics)
    
    # 按更新时间排序
    issues = issues.order_by('-updated')
    
    serializer = IssueSerializer(issues, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAnyAdmin])
def admin_reply_issue(request, issue_id):
    """管理员回复问题"""
    try:
        issue = Issue.objects.get(id=issue_id, is_public=True)
        user = request.user
        user_roles = [role.name for role in user.roles.all()]
        user_topics = [role.topic for role in user.roles.all() if role.topic]
        
        # 权限检查：超级管理员可以回复所有问题，内容管理员只能回复自己负责的分类
        if 'super_admin' not in user_roles:
            if issue.topic.name not in user_topics:
                return Response({'error': '您没有权限回复此问题'}, status=status.HTTP_403_FORBIDDEN)
        
        # 创建回复
        content = request.data.get('content', '')
        if not content.strip():
            return Response({'error': '回复内容不能为空'}, status=status.HTTP_400_BAD_REQUEST)
        
        reply = Reply.objects.create(
            administrator=user,
            content=content,
            issue=issue,
            attachment=request.FILES.get('attachment', None)
        )
        
        # 更新问题状态
        issue.status = "已处理"
        issue.save()
        
        serializer = ReplySerializer(reply)
        return Response({
            'reply': serializer.data,
            'message': '回复成功',
            'issue_status': issue.status
        }, status=status.HTTP_201_CREATED)
        
    except Issue.DoesNotExist:
        return Response({'error': '问题不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)