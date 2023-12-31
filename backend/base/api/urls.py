from django.urls import path
from . import views
from .views import (
    MyTokenObtainPairView,
    ListAllGamesView,
    ListAllPlayersView,
    ConnectToGame,
    PlayerStatisticsView,
    UserRegistrationView
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path("profile/", views.get_profile),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("games/", ListAllGamesView.as_view(), name="list-all-games"),
    path("players/", ListAllPlayersView.as_view(), name="list-all-players"),
    path(
        "players/<int:pk>/statistics/",
        PlayerStatisticsView.as_view(),
        name="player-statistics",
    ),
    path("games/connect", ConnectToGame.as_view(), name="open-game"),
]
