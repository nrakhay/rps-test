import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GameSession, Player
from rest_framework_jwt.utils import jwt_decode_handler


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.token = self.scope["url_route"]["kwargs"]["token"]
        await self.channel_layer.group_add(self.game_id, self.channel_name)

        self.user_id = jwt_decode_handler(self.token).get("user_id", None)

        game_status = await self.get_game_status(self.game_id)

        # notify users about new connect
        await self.channel_layer.group_send(
            self.game_id,
            {
                "type": "user_connected",
                "player": self.channel_name,
                "message": game_status,
            },
        )

        await self.accept()

    @database_sync_to_async
    def get_game_status(self, game_id):
        return GameSession.objects.get(id=game_id).status

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.game_id, self.channel_name)
        await self.determine_winner_when_left()

    @database_sync_to_async
    def determine_winner_when_left(self):
        game_session = GameSession.objects.get(id=self.game_id)

        if self.user_id == game_session.player1.user.id:
            game_session.winner = game_session.player2
        else:
            game_session.winner = game_session.player1

        print(game_session.winner)

        game_session.status = "completed"
        game_session.save()

    async def receive(self, text_data):
        print("received:", text_data)
        data = json.loads(text_data)
        move = data["move"]

        await self.channel_layer.group_send(
            self.game_id,
            {"type": "forward_move", "player": self.channel_name, "move": move},
        )

    async def forward_move(self, event):
        player = event["player"]
        move = event["move"]

        if player != self.channel_name:
            await self.send(
                text_data=json.dumps(
                    {"player": player, "move": move, "type": "forward_move"}
                )
            )

    async def user_connected(self, event):
        player = event["player"]
        message = event["message"]

        await self.send(text_data=json.dumps({"player": player, "message": message}))

    async def player_disconnected(self, event):
        await self.send(text_data=json.dumps({"message": event["message"]}))
