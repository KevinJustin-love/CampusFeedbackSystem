from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Issue, Reply, Message, Topic, Notification, ViewHistory

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
    administrator_name = serializers.SerializerMethodField()
    attachment = serializers.SerializerMethodField()
    
    def get_administrator_name(self, obj):
        """获取管理员用户名，如果管理员为None则返回'系统管理员'"""
        if obj.administrator:
            return obj.administrator.username
        return '系统管理员'
    
    def get_attachment(self, obj):
        """获取附件的完整URL"""
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
            return obj.attachment.url
        return None
    
    class Meta:
        model = Reply
        fields = [
            "id",
            "administrator_name",
            "content",
            "attachment",
            "issue",
            "created"
        ]
        read_only_fields = ["id", "administrator_name", "created"] 


class IssueSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True) # 添加嵌套字段
    replies = ReplySerializer(many=True, read_only=True, source='reply_set')
    topic = serializers.StringRelatedField()
    attachment = serializers.SerializerMethodField()

    def get_attachment(self, obj):
        """获取附件的完整URL"""
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
            return obj.attachment.url
        return None

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
            'replies',
            'views',
            'likes',
            'popularity',
            'updated',
            'created'
            ]
        read_only_fields = ['host_name']

class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    issue_title = serializers.SerializerMethodField()
    
    def get_sender_name(self, obj):
        """获取发送者用户名"""
        if obj.sender:
            return obj.sender.username
        return '系统'
    
    def get_issue_title(self, obj):
        """获取相关问题标题"""
        if obj.issue:
            return obj.issue.title
        return None
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'notification_type',
            'title',
            'message',
            'sender_name',
            'issue_title',
            'issue',
            'is_read',
            'created'
        ]
        read_only_fields = ['id', 'sender_name', 'issue_title', 'created']

class ViewHistorySerializer(serializers.ModelSerializer):
    issue_title = serializers.SerializerMethodField()
    issue_status = serializers.SerializerMethodField()
    issue_topic = serializers.SerializerMethodField()
    
    def get_issue_title(self, obj):
        """获取问题标题"""
        return obj.issue.title
    
    def get_issue_status(self, obj):
        """获取问题状态"""
        return obj.issue.status
    
    def get_issue_topic(self, obj):
        """获取问题分类"""
        return obj.issue.topic.name if obj.issue.topic else '未分类'
    
    class Meta:
        model = ViewHistory
        fields = [
            'id',
            'issue',
            'issue_title',
            'issue_status',
            'issue_topic',
            'viewed_at'
        ]
        read_only_fields = ['id', 'issue_title', 'issue_status', 'issue_topic', 'viewed_at']