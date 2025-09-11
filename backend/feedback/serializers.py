from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Issue, Reply, Message, Topic

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
    
    def to_representation(self, instance):
        if instance is None:
            return None
        return super().to_representation(instance)

class MessageSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()  # 添加用户名字段

    def get_user_name(self, obj):
        """获取用户名，如果用户为None则返回'匿名用户'"""
        if obj.user:
            return obj.user.username
        return '匿名用户'

    class Meta:
        model = Message
        fields = [
            "id",
            "user_name",
            "body",
            'created'
        ]
        read_only_fields = ["id", "user_name", 'created']

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = [
            "administrator_name",
            "content",
            "attachment",
            "issue",
            "created"
        ]
        read_only_fields = ["administrator_name"] 


class IssueSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True) # 添加嵌套字段
    reply = ReplySerializer(read_only=True)
    topic = serializers.StringRelatedField()


    class Meta:
        model = Issue
        fields = [
            'id',
            'host', 
            'title', 
            'topic', 
            'date',
            'description', 
            'status', 
            'attachment',
            'is_public',
            'messages',
            'reply',
            'views',
            'likes',
            'updated',
            'created'
            ]
        read_only_fields = ['host_name']