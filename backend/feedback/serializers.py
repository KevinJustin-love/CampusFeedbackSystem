from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Issue, Reply, Message, Topic, Notification, ViewHistory, Favorite
import re
import html

class TopicSerializer(serializers.ModelSerializer):
    
    def validate_name(self, value):
        """验证分类名称"""
        if not value or not value.strip():
            raise serializers.ValidationError("分类名称不能为空")
        
        # 限制长度
        if len(value) > 50:
            raise serializers.ValidationError("分类名称不能超过50个字符")
        
        # 只允许字母、数字、中文、空格和常见标点
        if not re.match(r'^[\w\u4e00-\u9fa5\s\-_,.()（）\[\]【】]+$', value):
            raise serializers.ValidationError("分类名称只能包含字母、数字、中文、空格和常见标点符号")
        
        # HTML转义防护
        value = html.escape(value)
        
        return value.strip()
    
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
    
    def validate_body(self, value):
        """验证评论内容"""
        if not value or not value.strip():
            raise serializers.ValidationError("评论内容不能为空")
        
        # 限制长度
        if len(value) > 1000:
            raise serializers.ValidationError("评论内容不能超过1000个字符")
        
        # 基本HTML标签过滤
        dangerous_tags = ['<script', '<iframe', '<object', '<embed', '<form', '<input', '<button']
        for tag in dangerous_tags:
            if tag in value.lower():
                raise serializers.ValidationError("评论内容中不能包含危险的HTML标签")
        
        # HTML转义防护
        value = html.escape(value)
        
        return value.strip()

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
    
    def validate_content(self, value):
        """验证回复内容"""
        if not value or not value.strip():
            raise serializers.ValidationError("回复内容不能为空")
        
        # 限制长度
        if len(value) > 1000:
            raise serializers.ValidationError("回复内容不能超过1000个字符")
        
        # 基本HTML标签过滤
        dangerous_tags = ['<script', '<iframe', '<object', '<embed', '<form', '<input', '<button']
        for tag in dangerous_tags:
            if tag in value.lower():
                raise serializers.ValidationError("回复内容中不能包含危险的HTML标签")
        
        # HTML转义防护
        value = html.escape(value)
        
        return value.strip()
    
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
    is_favorited = serializers.SerializerMethodField()
    
    def validate_title(self, value):
        """验证问题标题"""
        if not value or not value.strip():
            raise serializers.ValidationError("问题标题不能为空")
        
        # 限制长度
        if len(value) > 50:
            raise serializers.ValidationError("问题标题不能超过50个字符")
        
        # 只允许字母、数字、中文、空格和常见标点
        if not re.match(r'^[\w\u4e00-\u9fa5\s\-_,.!?()（）\[\]【】]+$', value):
            raise serializers.ValidationError("标题只能包含字母、数字、中文、空格和常见标点符号")
        
        # HTML转义防护
        value = html.escape(value)
        
        return value.strip()
    
    def validate_description(self, value):
        """验证问题描述"""
        if not value or not value.strip():
            raise serializers.ValidationError("问题描述不能为空")
        
        # 限制长度
        if len(value) > 1000:
            raise serializers.ValidationError("问题描述不能超过1000个字符")
        
        # 基本HTML标签过滤（允许一些安全的标签）
        # 移除危险标签
        dangerous_tags = ['<script', '<iframe', '<object', '<embed', '<form', '<input', '<button']
        for tag in dangerous_tags:
            if tag in value.lower():
                raise serializers.ValidationError("描述中不能包含危险的HTML标签")
        
        # HTML转义防护
        value = html.escape(value)
        
        return value.strip()

    def get_attachment(self, obj):
        """获取附件的完整URL"""
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
            return obj.attachment.url
        return None

    def get_is_favorited(self, obj):
        """检查当前用户是否已收藏此问题"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, issue=obj).exists()
        return False

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
            'created',
            'is_favorited'
            ]
        read_only_fields = ['host_name', 'is_favorited']

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

class FavoriteSerializer(serializers.ModelSerializer):
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
        model = Favorite
        fields = [
            'id',
            'issue',
            'issue_title',
            'issue_status',
            'issue_topic',
            'created'
        ]
        read_only_fields = ['id', 'issue_title', 'issue_status', 'issue_topic', 'created']