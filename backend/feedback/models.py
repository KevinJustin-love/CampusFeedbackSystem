from django.db import models
from django.conf import settings

# Create your models here.
class Topic(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Process(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Issue(models.Model):
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=50, help_text="标题")
    topic = models.ForeignKey(Topic,on_delete=models.SET_NULL,null=True)
    date = models.DateField(help_text="问题发生时间")
    description = models.CharField(max_length=1000,help_text="问题描述")
    status = models.ForeignKey(Process, on_delete=models.SET_NULL, null=True)
    attachment = models.FileField(upload_to='attachments/', help_text="附件", null=True, blank=True)
    is_public = models.BooleanField(default=True)

    views = models.IntegerField(default=0, help_text="浏览量")
    likes = models.IntegerField(default=0, help_text="点赞量")

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated','-created']

    def __str__(self):
        return self.title

class Message(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    issue = models.ForeignKey(Issue,on_delete=models.CASCADE)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = [ '-created']

    def __str__(self):
        return self.body[0:50]

class Reply(models.Model):
    administrator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    content = models.CharField()
    attachment = models.FileField(upload_to='attachments/', help_text="附件”")
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = [ '-created']

    def __str__(self):
        return self.body[0:50]