from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('topics/', views.TopicListCreate.as_view(), name='topic-list-create'),
    path('issues/', views.IssueListCreate.as_view(), name='issue-list-create'),
    path('issues/<int:pk>/', views.IssueDetailView.as_view(), name='issue-detail'),
    path('issues/<int:pk>/messages/', views.MessageListCreate.as_view(), name='message-list-create'),
    path('issues/<int:pk>/Replies/', views.ReplyListCreate.as_view(), name='reply-list-create'), 
    path('issues/<int:issue_id>/like/', views.like_issue, name='like_issue'),
    path('issues/<int:issue_id>/like-status/', views.check_like_status, name='check_like_status'),
    path('issues/<int:issue_id>/view/', views.view_issue, name='view_issue'),
    path('issues/<int:issue_id>/delete/', views.delete_issue, name='delete_issue'),
    path('issues/<int:issue_id>/delete-permission/', views.check_delete_permission, name='check_delete_permission'),
    path('auth/csrf/', views.get_csrf_token, name='get_csrf_token'),
    # 通知相关路由
    path('notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('notifications/unread-count/', views.get_unread_count, name='unread-count'),
    path('notifications/mark-read/', views.mark_notifications_read, name='mark-notifications-read'),
    path('notifications/mark-all-read/', views.mark_all_read, name='mark-all-read'),
    
    # 历史记录相关路由
    path('view-history/', views.ViewHistoryListCreate.as_view(), name='view-history-list'),
    path('issues/<int:issue_id>/record-view/', views.record_view_history, name='record-view-history'),
    path('view-history/clear/', views.clear_view_history, name='clear-view-history'),
    
    # 收藏夹相关路由
    path('favorites/', views.FavoriteListView.as_view(), name='favorite-list'),
    path('issues/<int:issue_id>/favorite/', views.toggle_favorite, name='toggle-favorite'),
    path('issues/<int:issue_id>/favorite-status/', views.check_favorite_status, name='check-favorite-status'),
    
    # 智能客服聊天路由
    path('chat/', views.chat, name='chat'),
    
    # 智能分类路由
    path('classify/', views.classify_issue_view, name='classify-issue'),
]