# your_app_name/admin.py
from django.contrib import admin
from .models import Issue, Topic, Notification # 从你的 models.py 中导入模型

# 注册你的模型
admin.site.register(Issue)
admin.site.register(Topic)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'notification_type', 'title', 'is_read', 'created']
    list_filter = ['notification_type', 'is_read', 'created']
    search_fields = ['recipient__username', 'title', 'message']
    readonly_fields = ['created']
