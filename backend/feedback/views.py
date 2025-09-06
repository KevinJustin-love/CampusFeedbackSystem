from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Issue, Reply, Message
from .serializers import IssueSerializer, ReplySerializer, MessageSerializer

# Create your views here.

class IssueListCreate(generics.ListCreateAPIView):
    serializer_class = IssueSerializer

    def get_queryset(self):
        return Message.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(host=self.request.user)
        else:
            # 如果未认证用户尝试创建，抛出权限拒绝异常
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
                administrator=self.request.user
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
                user=self.request.user
                issue=issue
            )
        else:
            # 如果未认证用户尝试创建，抛出权限拒绝异常
            raise PermissionDenied("你必须登录才能发布。")
