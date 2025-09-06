from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api.views import MyTokenObtainPairView # 导入自定义视图
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth", include("api.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("feedback/", include("feddback.urls"))
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


