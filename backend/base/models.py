from django.db import models
from django.contrib.auth.models import User


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100)

    total_games_played = models.PositiveIntegerField(default=0)
    total_wins = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username
