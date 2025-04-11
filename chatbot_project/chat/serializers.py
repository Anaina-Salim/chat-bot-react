from rest_framework import serializers
from .models import ChatMessage
from .models import ChatHistory

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['user_message', 'bot_response', 'user_ip', 'timestamp']



class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ['user_message', 'bot_response', 'timestamp']






