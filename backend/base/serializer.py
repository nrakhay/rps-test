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
    player1_name = serializers.ReadOnlyField(source="player1.name")
    player2_name = serializers.ReadOnlyField(source="player2.name", default=None)
    winner_name = serializers.ReadOnlyField(source="winner.name", default=None)

    class Meta:
        model = GameSession
        fields = (
            "id",
            "player1_name",
            "player2_name",
            "player1_choice",
            "player2_choice",
            "winner_name",
            "status",
            "created_at",
            "updated_at",
        )
