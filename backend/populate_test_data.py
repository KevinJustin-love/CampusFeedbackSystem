#!/usr/bin/env python
import os
import django
import sys

# 添加项目路径到系统路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# 配置Django
django.setup()

from django.contrib.auth import get_user_model
from feedback.models import Issue, Topic

def create_test_data():
    # 创建测试主题
    topics = ['学习问题', '生活问题', '技术问题', '其他问题']
    for topic_name in topics:
        Topic.objects.get_or_create(name=topic_name)
    
    # 获取或创建测试用户
    User = get_user_model()
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'password': 'testpass123'
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
    
    # 创建测试问题
    test_issues = [
        {
            'title': '图书馆座位不足',
            'topic': '学习问题',
            'description': '图书馆座位经常不够用，希望增加座位数量',
            'status': '已提交，等待审核'
        },
        {
            'title': '宿舍网络不稳定',
            'topic': '生活问题', 
            'description': '宿舍WiFi经常断线，影响学习和娱乐',
            'status': '已提交，等待审核'
        },
        {
            'title': '课程网站访问慢',
            'topic': '技术问题',
            'description': '课程管理系统访问速度很慢，影响学习效率',
            'status': '已提交，等待审核'
        },
        {
            'title': '食堂菜品单一',
            'topic': '生活问题',
            'description': '希望食堂能增加更多菜品选择',
            'status': '已提交，等待审核'
        },
        {
            'title': '实验室设备老旧',
            'topic': '学习问题',
            'description': '实验室部分设备需要更新换代',
            'status': '已提交，等待审核'
        }
    ]
    
    for issue_data in test_issues:
        topic = Topic.objects.get(name=issue_data['topic'])
        Issue.objects.get_or_create(
            title=issue_data['title'],
            defaults={
                'host': user,
                'topic': topic,
                'description': issue_data['description'],
                'status': issue_data['status'],
                'is_public': True,
                'date': '2024-01-15'
            }
        )
    
    print("测试数据创建完成！")
    print(f"创建了 {Issue.objects.count()} 个问题")
    print(f"创建了 {Topic.objects.count()} 个主题")

if __name__ == '__main__':
    create_test_data()