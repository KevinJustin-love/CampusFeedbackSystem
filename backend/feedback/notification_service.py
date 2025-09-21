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
    def notify_new_issue_to_admins(issue):
        """新问题通知给相关管理员"""
        from api.models import Role
        
        # 获取所有管理员用户
        admin_users = User.objects.filter(roles__isnull=False).distinct()
        
        for admin in admin_users:
            admin_roles = [role.name for role in admin.roles.all()]
            admin_topics = [role.topic for role in admin.roles.all() if role.topic]
            
            # 如果是超级管理员，直接通知
            if 'super_admin' in admin_roles:
                title = f"新问题需要处理"
                message = f"学生「{issue.host.username}」发布了新问题「{issue.title}」"
                NotificationService.create_notification(
                    recipient=admin,
                    sender=issue.host,
                    notification_type='system',
                    title=title,
                    message=message,
                    issue=issue
                )
            else:
                # 内容管理员：检查问题主题是否匹配管理员负责的主题
                should_notify = False
                for topic in admin_topics:
                    if topic and topic.lower() in issue.topic.name.lower():
                        should_notify = True
                        break
                
                if should_notify:
                    title = f"新问题需要处理"
                    message = f"学生「{issue.host.username}」在您负责的「{issue.topic.name}」分类下发布了新问题「{issue.title}」"
                    NotificationService.create_notification(
                        recipient=admin,
                        sender=issue.host,
                        notification_type='system',
                        title=title,
                        message=message,
                        issue=issue
                    )
    
    @staticmethod
    def get_user_notifications(user, is_read=None, limit=None, admin_filter=False):
        """获取用户通知"""
        queryset = Notification.objects.filter(recipient=user)
        
        # 如果是管理员过滤模式，只显示与管理员相关的问题通知
        if admin_filter:
            from django.db.models import Q
            from api.models import Role
            
            # 获取用户角色和主题
            user_roles = [role.name for role in user.roles.all()]
            user_topics = [role.topic for role in user.roles.all() if role.topic]
            
            # 如果是超级管理员，显示所有通知
            if 'super_admin' in user_roles:
                pass  # 不添加额外过滤
            else:
                # 内容管理员只能看到自己负责分类的问题通知
                topic_query = Q()
                for topic in user_topics:
                    topic_query |= Q(issue__topic__name__icontains=topic)
                
                # 只显示与管理员负责主题相关的问题通知
                queryset = queryset.filter(topic_query)
        
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