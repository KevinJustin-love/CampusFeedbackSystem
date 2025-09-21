from django.contrib.auth import get_user_model
from .models import Notification, Issue, Reply, Message

User = get_user_model()

class NotificationService:
    @staticmethod
    def create_notification(recipient, notification_type, title, message, sender=None, issue=None):
        """创建通知"""
        return Notification.objects.create(
            recipient=recipient,
            sender=sender,
            notification_type=notification_type,
            title=title,
            message=message,
            issue=issue
        )
    
    @staticmethod
    def notify_status_update(issue, old_status, new_status):
        """问题状态更新通知"""
        if issue.host and old_status != new_status:
            title = f"您的问题状态已更新"
            message = f"您的问题「{issue.title}」状态从「{old_status}」更新为「{new_status}」"
            NotificationService.create_notification(
                recipient=issue.host,
                notification_type='status_update',
                title=title,
                message=message,
                issue=issue
            )
    
    @staticmethod
    def notify_admin_reply(reply):
        """管理员回复通知"""
        if reply.issue.host and reply.administrator:
            title = f"管理员回复了您的问题"
            message = f"管理员回复了您的问题「{reply.issue.title}」：{reply.content[:50]}..."
            NotificationService.create_notification(
                recipient=reply.issue.host,
                sender=reply.administrator,
                notification_type='admin_reply',
                title=title,
                message=message,
                issue=reply.issue
            )
    
    @staticmethod
    def notify_new_comment(message_obj):
        """新评论通知"""
        issue = message_obj.issue
        # 通知问题发布者（如果评论者不是发布者本人）
        if issue.host and message_obj.user != issue.host:
            title = f"您的问题有新评论"
            message = f"用户「{message_obj.user.username}」评论了您的问题「{issue.title}」：{message_obj.body[:50]}..."
            NotificationService.create_notification(
                recipient=issue.host,
                sender=message_obj.user,
                notification_type='new_comment',
                title=title,
                message=message,
                issue=issue
            )
        
        # 通知其他评论者（除了当前评论者和问题发布者）
        other_commenters = Message.objects.filter(
            issue=issue
        ).exclude(
            user=message_obj.user
        ).exclude(
            user=issue.host
        ).values_list('user', flat=True).distinct()
        
        for user_id in other_commenters:
            try:
                user = User.objects.get(id=user_id)
                title = f"您参与的问题有新评论"
                message = f"用户「{message_obj.user.username}」在问题「{issue.title}」中发表了新评论"
                NotificationService.create_notification(
                    recipient=user,
                    sender=message_obj.user,
                    notification_type='new_comment',
                    title=title,
                    message=message,
                    issue=issue
                )
            except User.DoesNotExist:
                continue
    
    @staticmethod
    def notify_issue_liked(issue, liker):
        """问题被点赞通知"""
        if issue.host and liker != issue.host:
            title = f"您的问题被点赞"
            message = f"用户「{liker.username}」点赞了您的问题「{issue.title}」"
            NotificationService.create_notification(
                recipient=issue.host,
                sender=liker,
                notification_type='issue_liked',
                title=title,
                message=message,
                issue=issue
            )
    
    @staticmethod
    def get_user_notifications(user, is_read=None, limit=None):
        """获取用户通知"""
        queryset = Notification.objects.filter(recipient=user)
        
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read)
        
        if limit:
            queryset = queryset[:limit]
            
        return queryset
    
    @staticmethod
    def mark_as_read(notification_ids, user):
        """标记通知为已读"""
        return Notification.objects.filter(
            id__in=notification_ids,
            recipient=user
        ).update(is_read=True)
    
    @staticmethod
    def get_unread_count(user):
        """获取未读通知数量"""
        return Notification.objects.filter(
            recipient=user,
            is_read=False
        ).count()