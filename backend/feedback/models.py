from django.db import models
from django.conf import settings

# Create your models here.
class Topic(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Issue(models.Model):
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=50, help_text="标题")
    topic = models.ForeignKey(Topic,on_delete=models.SET_NULL,null=True)
    date = models.DateField(help_text="问题发生时间")
    description = models.CharField(max_length=1000,help_text="问题描述")
    status = models.CharField(null=True,default="已提交，等待审核")
    attachment = models.FileField(upload_to='attachments/', help_text="附件", null=True, blank=True)
    is_public = models.BooleanField(default=True)

    views = models.IntegerField(default=0, help_text="浏览量")
    likes = models.IntegerField(default=0, help_text="点赞量")
    popularity = models.FloatField(default=0.0, help_text="热度值")

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated','-created']

    def calculate_popularity(self):
        """
        计算热度值：点赞权重更高，浏览量权重较低
        公式：热度 = 点赞数 * 5 + 浏览量 * 0.1
        """
        return self.likes * 5 + self.views * 0.1
    
    def update_popularity(self):
        """更新热度值"""
        self.popularity = self.calculate_popularity()
        # 使用update避免触发auto_now
        Issue.objects.filter(pk=self.pk).update(popularity=self.popularity)

    def __str__(self):
        return self.title

class IssueLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'issue')  # 确保一个用户只能给一个问题点一次赞
        
    def __str__(self):
        return f"{self.user.username} liked {self.issue.title}"

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
    content = models.CharField(max_length=1000)
    attachment = models.FileField(upload_to='attachments/', help_text="附件")
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = [ '-created']

    def __str__(self):
        return self.content[0:50]