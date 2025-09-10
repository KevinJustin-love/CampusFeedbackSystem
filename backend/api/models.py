from django.db import models
from django.contrib.auth.models import AbstractUser


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

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
