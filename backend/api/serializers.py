from rest_framework import serializers
from .models import CustomUser

# 用于用户注册
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("username", "password", "email", "bio", "phone", "avatar")
        extra_kwargs = {
            "email": {"required": False},
            "bio": {"required": False},
            "phone": {"required": False},
            "avatar": {"required": False},
        }

    def create(self, validated_data):
        avatar_data = validated_data.pop('avatar', None)
        bio_data = validated_data.pop('bio', None)
        phone_data = validated_data.pop('phone', None)

        # 使用 create_user 方法创建基本用户，将剩余的 validated_data 作为参数传入
        user = CustomUser.objects.create_user(**validated_data)

        if avatar_data:
            user.avatar = avatar_data
        if bio_data:
            user.bio = bio_data
        if phone_data:
            user.phone = phone_data
        
        # 保存所有自定义字段的更改
        user.save()

        return user
    
# 用于用户信息更新
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'phone', 'bio', 'avatar')