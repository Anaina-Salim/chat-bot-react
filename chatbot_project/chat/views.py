from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import AzureOpenAI
from .models import ChatMessage
from .serializers import ChatMessageSerializer
import os


# Initialize Azure OpenAI client
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-01"
)

# Helper function to get user IP address
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

class ChatBotAPIView(APIView):
    def post(self, request):
        user_message = request.data.get("message")
        user_ip = get_client_ip(request)  # ✅ Define it here

        try:
            response = client.chat.completions.create(
                model="gpt-35-turbo",  # Use your Azure deployment name
                messages=[
                    {"role": "system", "content": "You are a helpful chatbot."},
                    {"role": "user", "content": user_message},
                ],
            )

            bot_reply = response.choices[0].message.content

            # ✅ Save to database after generating response
            ChatMessage.objects.create(
                user_message=user_message,
                bot_response=bot_reply,
                user_ip=user_ip
            )

            return Response({"response": bot_reply}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class ChatHistoryAPIView(APIView):
    def get(self, request):
        messages = ChatMessage.objects.all().order_by('timestamp')
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
