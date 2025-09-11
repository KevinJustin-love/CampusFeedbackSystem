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
    path('issues/<int:issue_id>/view/', views.view_issue, name='view_issue'),
    path('auth/csrf/', views.get_csrf_token, name='get_csrf_token'),
]