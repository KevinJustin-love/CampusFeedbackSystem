from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Issue, Reply, Message, Topic, IssueLike
from .serializers import IssueSerializer, ReplySerializer, MessageSerializer, TopicSerializer
import json


class TopicListCreate(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [AllowAny] # 允许所有用户访问

class IssueListCreate(generics.ListCreateAPIView):
    serializer_class = IssueSerializer

    def get_queryset(self):
        # 初始查询集：所有公开的问题
        queryset = Issue.objects.filter(is_public=True)

        # 获取查询参数
        topic = self.request.query_params.get('topic', None)
        sort_by = self.request.query_params.get('sortBy', None)


        # 1. 过滤逻辑：按分类筛选
        if topic and topic != 'all':
            # 假设 topic 名称是唯一的，或者你需要根据你的模型进行修改
            queryset = queryset.filter(topic__name=topic)

        # 2. 排序逻辑
        if sort_by == 'time':
            # 默认排序（按更新时间）
            queryset = queryset.order_by('-updated')
        elif sort_by == 'popularity':
            # 假设你的前端是发送 'popularity'，这里就用它
            # 注意：Django ORM 无法直接计算一个复杂的 popularity 得分，
            # 这里简单地按 likes 排序
            queryset = queryset.order_by('-likes', '-updated')
        else:
            # 默认排序
            queryset = queryset.order_by('-updated')
        
        return queryset

    def perform_create(self, serializer):
        # 从请求数据中获取 topic 的名称
        topic_name = self.request.data.get('topic')
            
        # 查找或创建一个 Topic 实例
        # 这段代码实现了“自定义”分类，如果前端只提供固定选项，这个方法也适用
        topic_instance, created = Topic.objects.get_or_create(name=topic_name)
            
        if self.request.user.is_authenticated:
            # 将 host 和 topic 实例传递给序列化器的 save 方法
            serializer.save(host=self.request.user, topic=topic_instance)
        else:
            raise PermissionDenied("你必须登录才能发布。")

class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [AllowAny] 


class ReplyListCreate(generics.ListCreateAPIView):
    serializer_class = ReplySerializer

    def get_queryset(self):
        return Reply.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            issue_id = self.kwargs.get('pk')
            issue = get_object_or_404(Issue, pk=issue_id)
            serializer.save(
                administrator=self.request.user,
                issue=issue
            )
        else:
            # 如果未认证用户尝试创建，抛出权限拒绝异常
            raise PermissionDenied("你必须登录才能发布。")

class MessageListCreate(generics.ListCreateAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            issue_id = self.kwargs.get('pk')
            issue = get_object_or_404(Issue, pk=issue_id)
            serializer.save(
                user=self.request.user,
                issue=issue
            )
        else:
            # 如果未认证用户尝试创建，抛出权限拒绝异常
            raise PermissionDenied("你必须登录才能发布。")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_issue(request, issue_id):
    try:
        issue = get_object_or_404(Issue, pk=issue_id)
        
        # 检查用户是否已经点过赞
        like_exists = IssueLike.objects.filter(user=request.user, issue=issue).exists()
        
        if like_exists:
            # 如果已经点过赞，则取消点赞
            IssueLike.objects.filter(user=request.user, issue=issue).delete()
            issue.likes = max(0, issue.likes - 1)  # 确保点赞数不会变成负数
            issue.save()
            return Response({'likes': issue.likes, 'liked': False, 'message': '取消点赞'})
        else:
            # 如果没有点过赞，则添加点赞
            IssueLike.objects.create(user=request.user, issue=issue)
            issue.likes += 1
            issue.save()
            return Response({'likes': issue.likes, 'liked': True, 'message': '点赞成功'})
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def view_issue(request, issue_id):
    try:
        issue = get_object_or_404(Issue, pk=issue_id)
        issue.views += 1
        issue.save()
        return Response({'views': issue.views})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

@api_view(['GET'])
def check_like_status(request, issue_id):
    """检查用户是否已经点赞了某个问题"""
    if not request.user.is_authenticated:
        return Response({'liked': False})
    
    issue = get_object_or_404(Issue, pk=issue_id)
    liked = IssueLike.objects.filter(user=request.user, issue=issue).exists()
    return Response({'liked': liked})