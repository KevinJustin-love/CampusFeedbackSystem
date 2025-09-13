# your_app_name/admin.py
from django.contrib import admin
from .models import Issue, Topic # 从你的 models.py 中导入模型

# 注册你的模型
admin.site.register(Issue)
admin.site.register(Topic)
