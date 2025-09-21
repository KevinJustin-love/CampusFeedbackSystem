from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Issue
from .notification_service import NotificationService

@receiver(pre_save, sender=Issue)
def track_status_change(sender, instance, **kwargs):
    """跟踪问题状态变化"""
    if instance.pk:  # 只有更新时才处理
        try:
            old_instance = Issue.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except Issue.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None

@receiver(post_save, sender=Issue)
def notify_status_update(sender, instance, created, **kwargs):
    """问题状态更新后发送通知"""
    if not created and hasattr(instance, '_old_status'):
        old_status = instance._old_status
        new_status = instance.status
        
        if old_status and old_status != new_status:
            NotificationService.notify_status_update(instance, old_status, new_status)