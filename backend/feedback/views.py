from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Issue, Reply, Message, Topic
from .serializers import IssueSerializer, ReplySerializer, MessageSerializer, TopicSerializer


class TopicListCreate(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [AllowAny] # 允许所有用户访问

class IssueListCreate(generics.ListCreateAPIView):
    serializer_class = IssueSerializer

    def get_queryset(self):
        def get_queryset(self):
            # 你的前端只展示公开问题，所以可以过滤 is_public=True 的问题
            return Issue.objects.filter(is_public=True).order_by('-updated')

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
