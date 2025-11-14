from django.core.management.base import BaseCommand
from api.models import Role, InvitationCode
import random
import string

class Command(BaseCommand):
    help = '生成管理员邀请码'

    def add_arguments(self, parser):
        parser.add_argument('--role', type=str, default='super_admin', help='角色名称')
        parser.add_argument('--count', type=int, default=5, help='生成数量')
        parser.add_argument('--custom-code', type=str, help='自定义邀请码')

    def handle(self, *args, **options):
        role_name = options['role']
        count = options['count']
        custom_code = options.get('custom_code')
        
        try:
            role = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'角色 "{role_name}" 不存在'))
            return
        
        if custom_code:
            # 生成自定义邀请码
            if InvitationCode.objects.filter(code=custom_code.upper()).exists():
                self.stdout.write(self.style.ERROR(f'邀请码 "{custom_code}" 已存在'))
                return
                
            invitation = InvitationCode.objects.create(
                code=custom_code.upper(),
                role_to_assign=role
            )
            self.stdout.write(self.style.SUCCESS(f'已生成邀请码: {invitation.code}'))
        else:
            # 批量生成随机邀请码
            codes = []
            for i in range(count):
                invitation = InvitationCode.objects.create(role_to_assign=role)
                codes.append(invitation.code)
                self.stdout.write(self.style.SUCCESS(f'已生成邀请码 {i+1}: {invitation.code}'))
            
            self.stdout.write(self.style.SUCCESS(f'成功生成 {len(codes)} 个 {role_name} 邀请码'))