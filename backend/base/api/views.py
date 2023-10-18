from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from base.serializer import (
    PlayerSerializer,
    GameSessionSerializer,
)

from base.models import GameSession, Player
from base.serializer import GameSessionSerializer, PlayerSerializer
from rest_framework import generics, status
from rest_framework.generics import GenericAPIView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class ListAllGamesView(generics.ListAPIView):
    queryset = GameSession.objects.all()
    serializer_class = GameSessionSerializer


class ListAllPlayersView(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class ConnectToGame(GenericAPIView):
    serializer_class = GameSessionSerializer

    def get_queryset(self):
        return GameSession.objects.filter(player2__isnull=True, status="waiting")

    def get(self, request, *args, **kwargs):
        game_session = self.get_queryset().first()
        username = request.query_params.get("username")

        player = Player.objects.get(name=username)

        if game_session and game_session.player1 == player:
            return Response(
                {"detail": "you are already in the waiting room"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not game_session:
            game_session = GameSession.objects.create(player1=player)
        else:
            game_session.player2 = player
            game_session.status = "in_progress"
            game_session.save()

        serializer = self.get_serializer(game_session)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    profile = user.profile
    serializer = PlayerSerializer(profile, many=False)
    return Response(serializer.data)
