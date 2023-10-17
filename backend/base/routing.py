from django.urls import re_path

from . import consumer

websocket_urlpatterns = [
    re_path(
        r"ws/game/(?P<game_id>\w+)/(?P<token>[\w\-\.]+)/$",
        consumer.GameConsumer.as_asgi(),
    ),
]
