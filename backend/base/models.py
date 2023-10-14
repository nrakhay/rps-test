from django.db import models
from django.contrib.auth.models import User


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100)

    total_games_played = models.PositiveIntegerField(default=0)
    total_wins = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username


class GameSession(models.Model):
    CHOICES = (
        ("rock", "Rock"),
        ("paper", "Paper"),
        ("scissors", "Scissors"),
    )
    STATUS = (
        ("waiting", "Waiting for opponent"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    )

    player1 = models.ForeignKey(
        Player, related_name="player1_sessions", on_delete=models.CASCADE
    )
    player2 = models.ForeignKey(
        Player,
        related_name="player2_sessions",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    player1_choice = models.CharField(
        max_length=10, choices=CHOICES, null=True, blank=True
    )
    player2_choice = models.CharField(
        max_length=10, choices=CHOICES, null=True, blank=True
    )
    winner = models.ForeignKey(
        Player,
        related_name="winning_sessions",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    status = models.CharField(max_length=20, choices=STATUS, default="waiting")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def determine_winner(self):
        if self.player1_choice == self.player2_choice:
            return None
        if (
            (self.player1_choice == "rock" and self.player2_choice == "scissors")
            or (self.player1_choice == "scissors" and self.player2_choice == "paper")
            or (self.player1_choice == "paper" and self.player2_choice == "rock")
        ):
            return self.player1
        return self.player2

    def __str__(self):
        return f"Game between {self.player1} and {self.player2}"
