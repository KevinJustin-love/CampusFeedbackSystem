from rest_framework import serializers
from .models import CustomUser, Role, InvitationCode

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
    invitation_code = serializers.CharField(max_length=8, required=False, write_only=True)

    class Meta:
        model = CustomUser
        fields = ("username", "password", "email", "bio", "phone", "avatar", "invitation_code")
        extra_kwargs = {
            "email": {"required": False},
            "bio": {"required": False},
            "phone": {"required": False},
            "avatar": {"required": False},
            "invitation_code": {"required": False},
        }

    def validate(self, data):
        invitation_code = data.get('invitation_code', '').strip().upper()
        
        if invitation_code:
            # 验证邀请码
            try:
                invitation = InvitationCode.objects.get(code=invitation_code)
                if invitation.is_used:
                    raise serializers.ValidationError("邀请码已被使用")
                data['validated_invitation'] = invitation
            except InvitationCode.DoesNotExist:
                raise serializers.ValidationError("邀请码无效")
        
        return data

    def create(self, validated_data):
        # 弹出邀请码相关数据
        invitation = validated_data.pop('validated_invitation', None)
        invitation_code = validated_data.pop('invitation_code', None)
        
        avatar_data = validated_data.pop('avatar', None)
        bio_data = validated_data.pop('bio', None)
        phone_data = validated_data.pop('phone', None)

        # 使用 create_user 方法创建基本用户
        user = CustomUser.objects.create_user(**validated_data)

        # 根据邀请码分配角色
        if invitation:
            # 使用邀请码指定的角色
            user.roles.add(invitation.role_to_assign)
            # 标记邀请码为已使用
            invitation.use(user)
        else:
            # 默认分配 "student" 角色
            student_role, created = Role.objects.get_or_create(name='student')
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

# 邀请码相关序列化器
class InvitationCodeSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role_to_assign.name', read_only=True)
    
    class Meta:
        model = InvitationCode
        fields = ['id', 'code', 'is_used', 'created_at', 'used_at', 'role_name']
        read_only_fields = ['code', 'created_at', 'used_at']

class CreateInvitationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvitationCode
        fields = ['role_to_assign']
    
    def create(self, validated_data):
        # 生成唯一的邀请码
        code = generate_invitation_code()
        while InvitationCode.objects.filter(code=code).exists():
            code = generate_invitation_code()
        
        invitation = InvitationCode.objects.create(
            code=code,
            role_to_assign=validated_data['role_to_assign']
        )
        return invitation

def generate_invitation_code():
    """生成随机邀请码"""
    import string
    import random
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=8))
