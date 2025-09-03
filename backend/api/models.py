from django.db import models

class Profile(models.Model):
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.email
