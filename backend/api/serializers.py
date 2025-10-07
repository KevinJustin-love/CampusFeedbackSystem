from rest_framework import serializers
from .models import CustomUser, Role

# 2. 用于通用读取用户信息（包括角色）
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'roles']


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

        # 自动分配 "student" 角色
        # 1. 查找 "student" 角色对象
        student_role, created = Role.objects.get_or_create(name='student')
        # 2. 将角色添加到新用户
        user.roles.add(student_role)

        if avatar_data:
            user.avatar = avatar_data
        if bio_data:
            user.bio = bio_data
        if phone_data:
            user.phone = phone_data
        
        # 保存所有自定义字段的更改
        user.save()

        return user
    
# 用于普通用户更新信息
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'phone', 'bio', 'avatar')

class UserAdminUpdateSerializer(serializers.ModelSerializer):
    # 使用PrimaryKeyRelatedField来处理角色列表，前端传递角色ID即可
    roles = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), many=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('email', 'phone', 'bio', 'avatar', 'is_active', 'is_staff', 'roles')
        read_only_fields = ('username',) # 用户名通常不允许修改

    def update(self, instance, validated_data):
        # 提取角色数据
        roles_data = validated_data.pop('roles', None)
        
        # 调用父类的 update 方法处理其他字段
        instance = super().update(instance, validated_data)

        # 更新角色
        if roles_data is not None:
            instance.roles.set(roles_data)
            
        instance.save()
        return instance
