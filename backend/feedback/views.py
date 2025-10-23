from django.shortcuts import render,get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Issue, Reply, Message, Topic, IssueLike, Notification, ViewHistory, Favorite
from .serializers import IssueSerializer, ReplySerializer, MessageSerializer, TopicSerializer, NotificationSerializer, ViewHistorySerializer, FavoriteSerializer
from .notification_service import NotificationService
from .classify_service import classify_service
import json


class TopicListCreate(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [AllowAny] # 允许所有用户访问

class IssueListCreate(generics.ListCreateAPIView):
    serializer_class = IssueSerializer
    permission_classes = [AllowAny]  # 允许查看问题列表，但创建需要认证

    def get_queryset(self):
        # 初始查询集：所有公开的问题
        queryset = Issue.objects.filter(is_public=True)

        # 获取查询参数
        topic = self.request.GET.get('topic', None)
        sort_by = self.request.GET.get('sortBy', None)


        # 1. 过滤逻辑：按分类筛选
        if topic and topic != 'all':
            # 假设 topic 名称是唯一的，或者你需要根据你的模型进行修改
            queryset = queryset.filter(topic__name=topic)

        # 2. 排序逻辑
        if sort_by == 'time':
            # 默认排序（按更新时间）
            queryset = queryset.order_by('-updated')
        elif sort_by == 'popularity':
            # 按热度值排序，热度值高的在前
            queryset = queryset.order_by('-popularity', '-updated')
        else:
            # 默认排序
            queryset = queryset.order_by('-updated')
        
        return queryset

    def perform_create(self, serializer):
        # 从请求数据中获取 topic 的名称
        topic_name = self.request.data.get('topic')
            
        # 查找或创建一个 Topic 实例
        # 这段代码实现了"自定义"分类，如果前端只提供固定选项，这个方法也适用
        topic_instance, created = Topic.objects.get_or_create(name=topic_name)
            
        if self.request.user.is_authenticated:
            # 将 host 和 topic 实例传递给序列化器的 save 方法
            issue = serializer.save(host=self.request.user, topic=topic_instance)
            
            # 通知相关管理员有新问题
            from .notification_service import NotificationService
            NotificationService.notify_new_issue_to_admins(issue)
        else:
            raise PermissionDenied("你必须登录才能发布。")

class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [AllowAny] 


class ReplyListCreate(generics.ListCreateAPIView):
    serializer_class = ReplySerializer
    permission_classes = [AllowAny]  # 允许查看回复，但创建需要认证

    def get_queryset(self):
        issue_id = self.kwargs.get('pk')
        return Reply.objects.filter(issue_id=issue_id)
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            issue_id = self.kwargs.get('pk')
            issue = get_object_or_404(Issue, pk=issue_id)
            reply = serializer.save(
                administrator=self.request.user,
                issue=issue
            )
            # 触发管理员回复通知
            NotificationService.notify_admin_reply(reply)
        else:
            # 如果未认证用户尝试创建，抛出权限拒绝异常
            raise PermissionDenied("你必须登录才能发布。")

class MessageListCreate(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]  # 允许查看评论，但创建需要认证

    def get_queryset(self):
        issue_id = self.kwargs.get('pk')
        return Message.objects.filter(issue_id=issue_id)
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            issue_id = self.kwargs.get('pk')
            issue = get_object_or_404(Issue, pk=issue_id)
            message = serializer.save(
                user=self.request.user,
                issue=issue
            )
            # 触发新评论通知
            NotificationService.notify_new_comment(message)
        else:
            # 如果未认证用户尝试创建，抛出权限拒绝异常
            raise PermissionDenied("你必须登录才能发布。")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_issue(request, issue_id):
    try:
        issue = get_object_or_404(Issue, pk=issue_id)
        
        # 检查用户是否已经点过赞
        like_exists = IssueLike.objects.filter(user=request.user, issue=issue).exists()
        
        if like_exists:
            # 如果已经点过赞，则取消点赞
            IssueLike.objects.filter(user=request.user, issue=issue).delete()
            new_likes = max(0, issue.likes - 1)
            # 计算新的热度值（点赞权重=2，浏览权重=1）
            new_popularity = new_likes * 2 + issue.views * 1
            # 使用update()方法更新likes和popularity字段，避免触发auto_now
            Issue.objects.filter(pk=issue_id).update(likes=new_likes, popularity=new_popularity)
            issue.refresh_from_db()  # 刷新实例以获取最新值
            return Response({'likes': issue.likes, 'popularity': issue.popularity, 'liked': False, 'message': '取消点赞'})
        else:
            # 如果没有点过赞，则添加点赞
            IssueLike.objects.create(user=request.user, issue=issue)
            new_likes = issue.likes + 1
            # 计算新的热度值（点赞权重=2，浏览权重=1）
            new_popularity = new_likes * 2 + issue.views * 1
            # 使用update()方法更新likes和popularity字段，避免触发auto_now
            Issue.objects.filter(pk=issue_id).update(likes=new_likes, popularity=new_popularity)
            issue.refresh_from_db()  # 刷新实例以获取最新值
            # 触发点赞通知
            NotificationService.notify_issue_liked(issue, request.user)
            return Response({'likes': issue.likes, 'popularity': issue.popularity, 'liked': True, 'message': '点赞成功'})
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def view_issue(request, issue_id):
    try:
        issue = get_object_or_404(Issue, pk=issue_id)
        new_views = issue.views + 1
        # 计算新的热度值（点赞权重=2，浏览权重=1）
        new_popularity = issue.likes * 2 + new_views * 1
        # 使用update()方法更新views和popularity字段，避免触发auto_now
        Issue.objects.filter(pk=issue_id).update(views=new_views, popularity=new_popularity)
        issue.refresh_from_db()  # 刷新实例以获取最新值
        return Response({'views': issue.views, 'popularity': issue.popularity})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

def can_delete_issue(user, issue):
    """检查用户是否有权限删除问题"""
    if not user.is_authenticated:
        return False
    
    # 作者本人可以删除
    if issue.host == user:
        return True
    
    # 管理员可以删除（检查用户是否是超级用户或有管理员角色）
    if user.is_superuser or user.is_staff:
        return True
    
    # 检查用户是否有管理员角色
    if hasattr(user, 'roles') and user.roles.filter(name__icontains='管理员').exists():
        return True
    
    return False

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_issue(request, issue_id):
    """删除问题"""
    try:
        issue = get_object_or_404(Issue, pk=issue_id)
        
        # 检查权限
        if not can_delete_issue(request.user, issue):
            return Response({'error': '您没有权限删除此问题'}, status=status.HTTP_403_FORBIDDEN)
        
        issue.delete()
        return Response({'message': '问题删除成功'}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def check_delete_permission(request, issue_id):
    """检查用户是否有删除权限"""
    try:
        issue = get_object_or_404(Issue, pk=issue_id)
        can_delete = can_delete_issue(request.user, issue)
        return Response({'can_delete': can_delete})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def check_like_status(request, issue_id):
    """检查用户是否已经点赞了某个问题"""
    if not request.user.is_authenticated:
        return Response({'liked': False})
    
    issue = get_object_or_404(Issue, pk=issue_id)
    liked = IssueLike.objects.filter(user=request.user, issue=issue).exists()
    return Response({'liked': liked})

class NotificationListView(generics.ListAPIView):
    """获取用户通知列表"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        is_read = self.request.query_params.get('is_read', None)
        admin_filter = self.request.query_params.get('admin_filter', 'false').lower() == 'true'
        
        if is_read is not None:
            is_read = is_read.lower() == 'true'
            return NotificationService.get_user_notifications(user, is_read=is_read, admin_filter=admin_filter)
        
        return NotificationService.get_user_notifications(user, admin_filter=admin_filter)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_count(request):
    """获取未读通知数量"""
    admin_filter = request.query_params.get('admin_filter', 'false').lower() == 'true'
    
    if admin_filter:
        # 使用过滤后的通知查询集计算未读数量
        notifications = NotificationService.get_user_notifications(request.user, admin_filter=True)
        count = notifications.filter(is_read=False).count()
    else:
        count = NotificationService.get_unread_count(request.user)
    
    return Response({'unread_count': count})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notifications_read(request):
    """标记通知为已读"""
    notification_ids = request.data.get('notification_ids', [])
    
    if not notification_ids:
        return Response({'error': '请提供通知ID列表'}, status=status.HTTP_400_BAD_REQUEST)
    
    updated_count = NotificationService.mark_as_read(notification_ids, request.user)
    return Response({'updated_count': updated_count})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    """标记所有通知为已读"""
    updated_count = Notification.objects.filter(
        recipient=request.user,
        is_read=False
    ).update(is_read=True)
    
    return Response({'updated_count': updated_count})

# 历史记录相关API
class ViewHistoryListCreate(generics.ListCreateAPIView):
    """获取用户浏览历史记录"""
    serializer_class = ViewHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ViewHistory.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # 检查是否已存在该用户对该问题的浏览记录
        issue_id = self.request.data.get('issue')
        if issue_id:
            # 如果存在，更新浏览时间；如果不存在，创建新记录
            from django.utils import timezone
            ViewHistory.objects.update_or_create(
                user=self.request.user,
                issue_id=issue_id,
                defaults={'viewed_at': timezone.now()}
            )
        else:
            serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_view_history(request, issue_id):
    """记录用户浏览问题"""
    try:
        issue = get_object_or_404(Issue, pk=issue_id)
        
        # 使用update_or_create来避免重复记录
        from django.utils import timezone
        view_history, created = ViewHistory.objects.update_or_create(
            user=request.user,
            issue=issue,
            defaults={'viewed_at': timezone.now()}
        )
        
        return Response({
            'message': '浏览记录已更新' if not created else '浏览记录已创建',
            'viewed_at': view_history.viewed_at
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_view_history(request):
    """清空用户浏览历史"""
    try:
        deleted_count = ViewHistory.objects.filter(user=request.user).delete()[0]
        return Response({'message': f'已清空 {deleted_count} 条浏览记录'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 收藏夹相关API
class FavoriteListView(generics.ListAPIView):
    """获取用户收藏列表"""
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, issue_id):
    """切换收藏状态"""
    try:
        issue = get_object_or_404(Issue, pk=issue_id)
        
        # 检查是否已收藏
        favorite_exists = Favorite.objects.filter(user=request.user, issue=issue).exists()
        
        if favorite_exists:
            # 如果已收藏，则取消收藏
            Favorite.objects.filter(user=request.user, issue=issue).delete()
            return Response({
                'favorited': False, 
                'message': '取消收藏成功'
            })
        else:
            # 如果未收藏，则添加收藏
            Favorite.objects.create(user=request.user, issue=issue)
            return Response({
                'favorited': True, 
                'message': '收藏成功'
            })
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def check_favorite_status(request, issue_id):
    """检查用户是否已收藏某个问题"""
    if not request.user.is_authenticated:
        return Response({'favorited': False})
    
    issue = get_object_or_404(Issue, pk=issue_id)
    favorited = Favorite.objects.filter(user=request.user, issue=issue).exists()
    return Response({'favorited': favorited})

# 智能客服聊天API
@api_view(['POST'])
@permission_classes([AllowAny])  # 允许任何人使用智能客服
def chat(request):
    """
    智能客服聊天接口
    接收用户消息，返回AI回复
    """
    from .chat_service import chat_service
    
    try:
        # 获取用户消息
        user_message = request.data.get('message', '').strip()
        
        if not user_message:
            return Response(
                {'error': '消息不能为空'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 获取对话历史（可选）
        conversation_history = request.data.get('history', [])
        
        # 调用聊天服务
        result = chat_service.get_response(user_message, conversation_history)
        
        if result['success']:
            return Response({
                'message': result['message'],
                'usage': result.get('usage', {})
            })
        else:
            return Response(
                {'error': result['message']},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {'error': f'服务器错误: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])  # 允许未登录用户使用分类功能
def classify_issue_view(request):
    """
    智能分类问题接口
    接收标题和描述，返回建议的分类
    """
    try:
        title = request.data.get('title', '')
        description = request.data.get('description', '')
        
        if not title:
            return Response(
                {'error': '标题不能为空'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 调用分类服务
        result = classify_service.classify_issue(title, description)
        
        if result['success']:
            return Response({
                'category': result['category'],
                'confidence': result['confidence'],
                'reason': result['reason']
            })
        else:
            # 分类失败时仍返回默认分类
            return Response({
                'category': result['category'],
                'confidence': result['confidence'],
                'reason': result['reason'],
                'warning': '智能分类服务暂时不可用，返回默认分类'
            })
            
    except Exception as e:
        return Response(
            {'error': f'分类服务错误: {str(e)}', 'category': '生活'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )