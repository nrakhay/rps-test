import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import GameSession


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        await self.channel_layer.group_add(self.game_id, self.channel_name)

        # notify users about new connect
        await self.channel_layer.group_send(
            self.game_id,
            {
                "type": "user_connected",
                "player": self.channel_name,
                "message": "A new player has connected.",
            },
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.game_id, self.channel_name)

        game_session = GameSession.objects.get(id=self.game_id)

        if game_session.player1.name == self.scope["user"].username:
            game_session.winner = game_session.player2.name
        elif game_session.player2.name == self.scope["user"].username:
            game_session.winner = game_session.player1.name

        game_session.save()

        await self.channel_layer.group_send(
            self.game_id,
            {
                "type": "player_disconnected",
                "message": f"Player {self.scope['user'].username} has disconnected.",
            },
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        move = data["move"]

        await self.channel_layer.group_send(
            self.game_id,
            {"type": "forward_move", "player": self.channel_name, "move": move},
        )

    async def forward_move(self, event):
        player = event["player"]
        move = event["move"]

        await self.send(text_data=json.dumps({"player": player, "move": move}))

    async def user_connected(self, event):
        player = event["player"]
        message = event["message"]

        await self.send(text_data=json.dumps({"player": player, "message": message}))

    async def player_disconnected(self, event):
        await self.send(text_data=json.dumps({"message": event["message"]}))
