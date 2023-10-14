from rest_framework import serializers
from base.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class PlayerSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Player
        fields = ("user", "name")


class GameSessionSerializer(serializers.ModelSerializer):
    player1_username = serializers.ReadOnlyField(source="player1.username")
    player2_username = serializers.ReadOnlyField(
        source="player2.username", default=None
    )
    winner_username = serializers.ReadOnlyField(source="winner.username", default=None)

    class Meta:
        model = GameSession
        fields = (
            "id",
            "player1_username",
            "player2_username",
            "player1_choice",
            "player2_choice",
            "winner_username",
            "status",
            "created_at",
            "updated_at",
        )
