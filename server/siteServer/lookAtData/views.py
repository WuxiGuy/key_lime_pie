from django.shortcuts import render
from dateutil.parser import parse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
from django.http import HttpResponse
from .models import UserActions  # Import the missing model class
from django.template import loader

# Dealing with HTTP requests from the client
@csrf_exempt
def post_data(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))  # Decode the request body and parse the JSON data
        new_history = UserActions.objects.create(
            hostUrl=data['hostUrl'],
            pageUrl=data['pageUrl'],
            startTime=parse(data['startTime']), 
            endTime=parse(data['endTime']),
            activeTime=data['activeTime'],
            webType=data['type']
        )
        return JsonResponse({'id': new_history.id})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def index(request):
    UserAction = UserActions.objects.all()
    template = loader.get_template("lookAtData/index.html")
    context = {
        "user_actions": UserAction,
    }
    return HttpResponse(template.render(context, request))