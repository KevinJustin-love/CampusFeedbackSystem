from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Issue, Reply, Message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) # 嵌套用户序列化器

    class Meta:
        model = Message
        fields = [
            "user_name",
            "issue",
            "body",
            'created'
        ]
        read_only_fields = ["user_name", 'created']

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = [
            "administrator_name",
            "content",
            "attachment",
            "issue"
            "created"
        ]
        read_only_fields = ["administrator_name"] 


class IssueSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True) # 添加嵌套字段
    reply = ReplySerializer(read_only=True)

    class Meta:
        model = Issue
        fields = [
            'host_name', 
            'title', 
            'topic', 
            'date',
            'description', 
            'status', 
            'attachment',
            'is_public',
            'messages',
            'reply',
            ]
        read_only_fields = ['host_name']