from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid
import string
import random


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    # 新增字段，用于关联内容类别
    topic = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    # 新增的字段，用于关联角色
    roles = models.ManyToManyField('Role', related_name='users', blank=True)

    def __str__(self):
        return self.username

def generate_invitation_code():
    """生成随机邀请码"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=8))

class InvitationCode(models.Model):
    """管理员邀请码模型"""
    code = models.CharField(max_length=8, unique=True, default=generate_invitation_code)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)
    used_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    role_to_assign = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='invitation_codes')
    
    def __str__(self):
        return self.code
    
    def use(self, user):
        """使用邀请码"""
        if not self.is_used:
            self.is_used = True
            self.used_at = timezone.now()
            self.used_by = user
            self.save()
            return True
        return False
