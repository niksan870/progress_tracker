from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from pomodoro.pomodoro import views as pomdoro_views
from rest_framework_simplejwt import views as jwt_views

router = routers.DefaultRouter()
router.register(r'users', pomdoro_views.UserViewSet)
router.register(r'groups', pomdoro_views.GroupViewSet)
router.register(r'goals', pomdoro_views.GoalViewSet)
router.register(r'user_profiles', pomdoro_views.UserProfileViewSet)
router.register(r'pomodoros', pomdoro_views.PomodoroViewSet)
router.register(r'graph', pomdoro_views.GraphViewSet)
router.register(r'journals', pomdoro_views.JournalViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls',
                              namespace='rest_framework')),
    path('account/register', pomdoro_views.UserCreate.as_view()),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(),
         name='token_refresh'),
]