import json
from channels.generic.websocket import AsyncWebsocketConsumer


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        await self.channel_layer.group_add(self.game_id, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.game_id, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        move = data["move"]

        # forward the move
        await self.channel_layer.group_send(
            self.game_id,
            {"type": "forward_move", "player": self.channel_name, "move": move},
        )

    async def forward_move(self, event):
        player = event["player"]
        move = event["move"]

        # send the move
        await self.send(text_data=json.dumps({"player": player, "move": move}))
