#!/usr/bin/env python
import os
import django

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Role, CustomUser
from feedback.models import Topic

def main():
    print("Creating admin data...")
    
    # 创建超级管理员角色
    super_admin, created = Role.objects.get_or_create(
        name='super_admin',
        defaults={'description': '超级管理员', 'topic': None}
    )
    print(f'Super admin role created: {created}')

    # 获取现有的主题
    topics = Topic.objects.all()
    print(f'Available topics: {[t.name for t in topics]}')

    # 为每个主题创建内容管理员角色
    for topic in topics:
        role_name = f'{topic.name}_admin'
        role, created = Role.objects.get_or_create(
            name=role_name,
            defaults={'description': f'{topic.name}管理员', 'topic': topic.name}
        )
        print(f'Content admin role {role_name} created: {created}')

    # 创建测试管理员用户
    admin_user, created = CustomUser.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print('Admin user created')
    else:
        print('Admin user already exists')

    # 给管理员用户分配超级管理员角色
    admin_user.roles.add(super_admin)
    print('Super admin role assigned to admin user')

    # 创建生活管理员用户
    life_admin, created = CustomUser.objects.get_or_create(
        username='life_admin',
        defaults={
            'email': 'life@example.com',
            'is_staff': True
        }
    )
    if created:
        life_admin.set_password('life123')
        life_admin.save()
        print('Life admin user created')
    else:
        print('Life admin user already exists')

    # 给生活管理员分配角色
    life_role = Role.objects.filter(name='生活_admin').first()
    if life_role:
        life_admin.roles.add(life_role)
        print('Life admin role assigned')
    else:
        print('Life admin role not found')
        
    print("\nFinal state:")
    print("Roles:")
    for role in Role.objects.all():
        print(f"  {role.name} - {role.topic}")
    
    print("Users:")
    for user in CustomUser.objects.all():
        roles = [f'{r.name}({r.topic})' for r in user.roles.all()]
        print(f"  {user.username}: {roles}")

if __name__ == '__main__':
    main()