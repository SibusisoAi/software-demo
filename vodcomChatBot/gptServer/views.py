from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import openai
import json

openai.api_key = "API_KEY"

messages = [
    {"role": "system", "content": "You are an Expert Vodacom Sales AI - Deliver personalized, knowledgeable sales assistance, assess customer needs, provide tailored recommendations, foster long-term relationships, and achieve sales targets."},
]

@csrf_exempt
def index(request):
    if request.method == "POST":
        user_message = request.body.decode('utf-8')
        body = json.loads(user_message)
        user_message = body['message']
        print('the user message is', user_message)

        messages.append({"role": "user", "content": user_message})

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=100
        )

        ai_response = completion.choices[0].message.content
        
        messages.append({"role": "assistant", "content": ai_response})

        return JsonResponse({"ai_response": ai_response})
    if request.method == "GET":
        return JsonResponse({ "message": "Hey there, welcome to the sales assistant please feel free to ask me anything! "})