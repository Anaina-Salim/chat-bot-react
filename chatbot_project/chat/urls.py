#from django.urls import path
#from .views import ChatBotAPIView

#urlpatterns = [
#    path('chat/', ChatBotAPIView.as_view(), name='chat'),
#]



from django.urls import path
from .views import ChatBotAPIView, ChatHistoryAPIView

urlpatterns = [
    path("chat/", ChatBotAPIView.as_view(), name="chat"),
    path("history/", ChatHistoryAPIView.as_view(), name="history"),  # ✅ New route
]
