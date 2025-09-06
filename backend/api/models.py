from django.db import models
from django.contrib.auth.models import AbstractUser
    
class CustomUser(AbstractUser):
    # 定义角色选项
    ROLE_CHOICES = (
        ('student', '学生'),
        ('life_admin', '生活管理员'),
        ('study_admin', '学业管理员'),
        ('manage_admin', '管理管理员'),
    )
    # 为用户添加角色字段，默认角色为'学生'
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    REQUIRED_FIELDS = ['role']