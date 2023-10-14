from channels.routing import ProtocolTypeRouter, URLRouter
import base.routing

application = ProtocolTypeRouter(
    {"websocket": URLRouter(base.routing.websocket_urlpatterns)}
)
